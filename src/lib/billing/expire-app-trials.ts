import type { Prisma, Subscription } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type TrialExpiryRow = Pick<
  Subscription,
  "status" | "trialEndsAt" | "stripeSubscriptionId" | "compAccessUntil"
>;

/**
 * Card-free app trials only. A Stripe subscription id or a pass that is still
 * in the future keeps the row out of this write.
 * `trialEndsAt < now` matches the daily cron. The exact end instant is not expired yet.
 */
export function appTrialShouldExpire(subscription: TrialExpiryRow | null, now = new Date()): boolean {
  if (!subscription) return false;
  if (subscription.status !== "trialing") return false;
  if (!subscription.trialEndsAt || subscription.trialEndsAt >= now) return false;
  if (subscription.stripeSubscriptionId != null) return false;
  if (subscription.compAccessUntil && subscription.compAccessUntil > now) return false;
  return true;
}

/** Prisma filter for the same rule. A second run matches nothing once status has changed. */
export function expiredAppTrialWhere(now = new Date()): Prisma.SubscriptionWhereInput {
  return {
    status: "trialing",
    trialEndsAt: { lt: now },
    stripeSubscriptionId: null,
    OR: [{ compAccessUntil: null }, { compAccessUntil: { lte: now } }],
  };
}

/**
 * Flip every elapsed card-free trial to trial_expired.
 * Idempotent: rows already expired, Stripe-linked rows, and live passes are not updated.
 */
export async function expireElapsedAppTrials(now = new Date()): Promise<{ expired: number }> {
  const result = await prisma.subscription.updateMany({
    where: expiredAppTrialWhere(now),
    data: { status: "trial_expired" },
  });
  console.info("[cron/expire-trials] changed", { count: result.count });
  return { expired: result.count };
}
