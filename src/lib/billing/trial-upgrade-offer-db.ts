import { randomBytes } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { normalizeEmail } from "@/lib/validators/auth";
import {
  classifyTrialUpgradeOffer,
  decideOfferIssue,
  offerExpiresAt,
  publicOfferMessage,
  publicOfferStatus,
  TRIAL_UPGRADE_OFFER_PERCENT,
  trialOfferFlags,
  trialUpgradeOfferLink,
  type TrialOfferSubscription,
  type TrialUpgradeOfferView,
} from "@/lib/billing/trial-upgrade-offer";

const OFFER_SELECT = {
  id: true,
  userId: true,
  token: true,
  expiresAt: true,
  redeemedAt: true,
} as const;

export function createOfferToken(): string {
  return randomBytes(24).toString("base64url");
}

export async function readTrialUpgradeOffer(
  userId: string,
  token: string
): Promise<TrialUpgradeOfferView> {
  const [offer, subscription] = await Promise.all([
    prisma.trialUpgradeOffer.findUnique({
      where: { token },
      select: OFFER_SELECT,
    }),
    prisma.subscription.findUnique({ where: { userId } }),
  ]);
  return viewFor(userId, token, offer, subscription);
}

export async function evaluateTrialUpgradeOffer(input: {
  userId: string;
  token: string;
  subscription: TrialOfferSubscription;
}): Promise<{
  status: ReturnType<typeof classifyTrialUpgradeOffer>["status"];
  offerId: string | null;
  message: string;
}> {
  const offer = await prisma.trialUpgradeOffer.findUnique({
    where: { token: input.token },
    select: OFFER_SELECT,
  });
  const flags = trialOfferFlags(input.subscription);
  const classified = classifyTrialUpgradeOffer({
    offer,
    accountUserId: input.userId,
    paid: flags.paid,
    trial: flags.trial,
  });
  return {
    status: classified.status,
    offerId: classified.offerId,
    message: publicOfferMessage(classified.status),
  };
}

function viewFor(
  userId: string,
  token: string,
  offer: {
    id: string;
    userId: string;
    token: string;
    expiresAt: Date;
    redeemedAt: Date | null;
  } | null,
  subscription: TrialOfferSubscription
): TrialUpgradeOfferView {
  const flags = trialOfferFlags(subscription);
  const classified = classifyTrialUpgradeOffer({
    offer,
    accountUserId: userId,
    paid: flags.paid,
    trial: flags.trial,
  });
  const status = publicOfferStatus(classified.status);
  return {
    status,
    message: publicOfferMessage(classified.status),
    expiresAt: status === "valid" && classified.expiresAt ? classified.expiresAt.toISOString() : null,
    token: status === "valid" ? token : null,
    percentOff: status === "valid" ? TRIAL_UPGRADE_OFFER_PERCENT : null,
  };
}

/** Mark the offer spent after a successful charge. Idempotent. */
export async function redeemTrialUpgradeOffer(offerId: string, userId: string): Promise<void> {
  const id = offerId.trim();
  if (!id || !userId) return;
  await prisma.trialUpgradeOffer.updateMany({
    where: { id, userId, redeemedAt: null },
    data: { redeemedAt: new Date() },
  });
}

export function upgradeOfferIdFromMetadata(
  metadata: { upgradeOfferId?: string | null } | null | undefined
): string | null {
  const id = metadata?.upgradeOfferId?.trim();
  return id || null;
}

export async function issueTrialUpgradeOfferForEmail(input: {
  email: string;
  rotate?: boolean;
  origin?: string;
  now?: Date;
}): Promise<
  | {
      ok: true;
      action: "create" | "reuse";
      email: string;
      expiresAt: Date;
      link: string;
    }
  | { ok: false; message: string }
> {
  const email = normalizeEmail(input.email);
  const now = input.now ?? new Date();
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true },
  });
  if (!user) {
    return { ok: false, message: `No account for ${email}.` };
  }

  const [subscription, existing] = await Promise.all([
    prisma.subscription.findUnique({ where: { userId: user.id } }),
    prisma.trialUpgradeOffer.findUnique({ where: { userId: user.id } }),
  ]);
  const flags = trialOfferFlags(subscription);
  const decision = decideOfferIssue({
    paid: flags.paid,
    trial: flags.trial,
    existing,
    now,
    rotate: input.rotate,
  });

  if (decision.action === "refuse") {
    if (decision.reason === "paid") {
      return {
        ok: false,
        message: `${user.email} has already paid. The offer is only for a first payment.`,
      };
    }
    if (decision.reason === "used") {
      return { ok: false, message: `${user.email} already used this offer.` };
    }
    return {
      ok: false,
      message: `${user.email} has no trial on file, so the offer cannot be issued.`,
    };
  }

  if (decision.action === "reuse" && existing) {
    return {
      ok: true,
      action: "reuse",
      email: user.email,
      expiresAt: existing.expiresAt,
      link: trialUpgradeOfferLink(existing.token, input.origin),
    };
  }

  const token = createOfferToken();
  const expiresAt = offerExpiresAt(now);
  await prisma.trialUpgradeOffer.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      token,
      issuedAt: now,
      expiresAt,
    },
    update: {
      token,
      issuedAt: now,
      expiresAt,
      redeemedAt: null,
    },
  });

  return {
    ok: true,
    action: "create",
    email: user.email,
    expiresAt,
    link: trialUpgradeOfferLink(token, input.origin),
  };
}

export async function checkTrialUpgradeOfferForEmail(input: {
  email: string;
  origin?: string;
  now?: Date;
}): Promise<{ email: string; lines: string[] }> {
  const email = normalizeEmail(input.email);
  const now = input.now ?? new Date();
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true },
  });
  if (!user) {
    return { email, lines: [`No account for ${email}.`] };
  }

  const [subscription, existing] = await Promise.all([
    prisma.subscription.findUnique({ where: { userId: user.id } }),
    prisma.trialUpgradeOffer.findUnique({ where: { userId: user.id } }),
  ]);
  const flags = trialOfferFlags(subscription);
  const lines = [
    `Email: ${user.email}`,
    `Trial on file: ${flags.trial ? "yes" : "no"}`,
    `Already paid: ${flags.paid ? "yes" : "no"}`,
  ];

  if (!existing) {
    lines.push("Offer: none");
    return { email: user.email, lines };
  }

  const classified = classifyTrialUpgradeOffer({
    offer: existing,
    accountUserId: user.id,
    paid: flags.paid,
    trial: flags.trial,
    now,
  });
  lines.push(`Status: ${publicOfferStatus(classified.status)}`);
  lines.push(`Issued: ${existing.issuedAt.toISOString()}`);
  lines.push(`Expires: ${existing.expiresAt.toISOString()}`);
  lines.push(
    existing.redeemedAt ? `Used: ${existing.redeemedAt.toISOString()}` : "Used: no"
  );
  if (classified.status === "valid") {
    lines.push(`Link: ${trialUpgradeOfferLink(existing.token, input.origin)}`);
  }
  return { email: user.email, lines };
}
