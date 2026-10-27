import type { Prisma } from "@prisma/client";
import {
  addCompDays,
  classifyPassRow,
  FreePassError,
  normalizePassCode,
  type PassCodeRow,
  type PassGrant,
} from "@/lib/promo/free-pass";

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
  tx: Prisma.TransactionClient,
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
