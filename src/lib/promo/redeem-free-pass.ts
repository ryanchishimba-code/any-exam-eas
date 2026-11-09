import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  addCompDays,
  classifyPassRow,
  FreePassError,
  normalizePassCode,
  type PassCodeRow,
  type PassGrant,
} from "@/lib/promo/free-pass";

type PassTx = Prisma.TransactionClient;

type LockedPass = {
  id: string;
  code: string;
  active: boolean;
  compDays: number | null;
  audience: string | null;
  expiryDate: Date | null;
  maxUses: number | null;
  currentUses: number;
};

function asRow(row: LockedPass | undefined): PassCodeRow | null {
  if (!row) return null;
  return {
    id: row.id,
    code: row.code,
    active: row.active,
    compDays: row.compDays,
    audience: row.audience,
    expiryDate: row.expiryDate ? new Date(row.expiryDate) : null,
    maxUses: row.maxUses,
    currentUses: row.currentUses,
  };
}

/**
 * Redeem one access-grant code for a user that already has a subscription row.
 * Caller must be inside a transaction. The promo row is locked, then a conditional
 * update increments currentUses only while it is still under maxUses.
 */
export async function redeemFreePassOnTx(
  tx: PassTx,
  userId: string,
  rawCode: string,
  now = new Date()
): Promise<PassGrant> {
  const code = normalizePassCode(rawCode);
  if (!code) throw new FreePassError("invalid");

  const rows = await tx.$queryRaw<LockedPass[]>`
    SELECT id, code, active, "compDays", audience, "expiryDate", "maxUses", "currentUses"
    FROM "PromoCode"
    WHERE code = ${code}
    FOR UPDATE
  `;
  const row = asRow(rows[0]);
  const decision = classifyPassRow(row, now);
  if (!decision.ok || !row) {
    throw new FreePassError(!decision.ok ? decision.reason : "invalid");
  }

  const updated = await tx.$executeRaw`
    UPDATE "PromoCode"
    SET "currentUses" = "currentUses" + 1,
        "updatedAt" = ${now}
    WHERE id = ${row.id}
      AND active = true
      AND "compDays" IS NOT NULL
      AND "compDays" > 0
      AND ("expiryDate" IS NULL OR "expiryDate" > ${now})
      AND "maxUses" IS NOT NULL
      AND "currentUses" < "maxUses"
  `;
  if (updated !== 1) throw new FreePassError("used");

  await tx.promoRedemption.create({
    data: { promoCodeId: row.id, userId },
  });

  const compAccessUntil = addCompDays(now, decision.compDays);
  await tx.subscription.update({
    where: { userId },
    data: {
      compAccessUntil,
      status: "inactive",
      trialEndsAt: null,
      plan: "comp",
      planTier: "pro",
    },
  });

  return {
    promoCodeId: row.id,
    code: row.code,
    audience: row.audience,
    compDays: decision.compDays,
    compAccessUntil,
  };
}

export type ExistingPassReason =
  | "paid"
  | "already"
  | "missing"
  | "invalid"
  | "not_found"
  | "inactive"
  | "expired"
  | "used"
  | "not_a_pass";

export type ExistingPassResult =
  | { ok: true; grant: PassGrant }
  | { ok: false; reason: ExistingPassReason };

/**
 * Apply a pass to an account that already exists. A paid Stripe subscription
 * is left alone and does not consume a redemption, so this cannot replace a
 * paid plan or start a charge.
 */
export async function redeemPassForExistingUser(
  userId: string,
  rawCode: string
): Promise<ExistingPassResult> {
  const code = normalizePassCode(rawCode);
  if (!code) return { ok: false, reason: "invalid" };

  try {
    const outcome = await prisma.$transaction(async (tx) => {
      const sub = await tx.subscription.findUnique({
        where: { userId },
        select: { stripeSubscriptionId: true },
      });
      if (sub?.stripeSubscriptionId?.trim()) return { blocked: "paid" as const };
      if (!sub) return { blocked: "missing" as const };
      const prior = await tx.promoRedemption.findFirst({
        where: { userId, promoCode: { code } },
        select: { id: true },
      });
      if (prior) return { blocked: "already" as const };
      return { grant: await redeemFreePassOnTx(tx, userId, code) };
    });
    if ("blocked" in outcome && outcome.blocked) {
      return { ok: false, reason: outcome.blocked };
    }
    if ("grant" in outcome) return { ok: true, grant: outcome.grant };
    return { ok: false, reason: "invalid" };
  } catch (err) {
    if (err instanceof FreePassError) return { ok: false, reason: err.reason };
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return { ok: false, reason: "already" };
    }
    throw err;
  }
}
