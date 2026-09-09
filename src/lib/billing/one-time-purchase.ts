/**
 * Pay-once purchases.
 *
 * A one-time purchase buys the same length of access as the matching
 * subscription interval, but nothing renews it — `accessEndsAt` is the hard
 * expiry, and the learner buys again when they want more time.
 */

import { prisma } from "@/lib/prisma";
import { INTERVAL_MONTHS, type BillingInterval } from "@/lib/billing-config";
import type { SubscriptionTier } from "@/lib/subscription-tiers";

/**
 * Add whole months, clamping the day to the last valid day of the target month
 * so Jan 31 + 1 month is Feb 28/29 rather than spilling into March.
 *
 * Deliberately UTC: local-time setters shift the resulting instant by an hour
 * across a DST boundary, which would make an expiry depend on the server's
 * timezone.
 */
export function addMonths(from: Date, months: number): Date {
  const day = from.getUTCDate();
  const targetMonth = from.getUTCMonth() + months;
  const lastDayOfTarget = new Date(
    Date.UTC(from.getUTCFullYear(), targetMonth + 1, 0)
  ).getUTCDate();

  return new Date(
    Date.UTC(
      from.getUTCFullYear(),
      targetMonth,
      Math.min(day, lastDayOfTarget),
      from.getUTCHours(),
      from.getUTCMinutes(),
      from.getUTCSeconds(),
      from.getUTCMilliseconds()
    )
  );
}

/** Access window bought by a single payment for `interval`. */
export function oneTimeAccessEnd(
  interval: BillingInterval,
  from: Date = new Date()
): Date {
  return addMonths(from, INTERVAL_MONTHS[interval]);
}

/**
 * Buying again before the current window lapses stacks on top of it, so an
 * early renewal never costs the learner the time they already paid for.
 */
export function extendOneTimeAccess(
  currentEnd: Date | null | undefined,
  interval: BillingInterval,
  now: Date = new Date()
): Date {
  const base = currentEnd && currentEnd > now ? currentEnd : now;
  return oneTimeAccessEnd(interval, base);
}

/** True while a one-time purchase still entitles the user to premium. */
export function oneTimeAccessActive(
  subscription:
    | { purchaseType?: string | null; accessEndsAt?: Date | string | null }
    | null
    | undefined,
  now: Date = new Date()
): boolean {
  if (!subscription || subscription.purchaseType !== "one_time") return false;
  if (!subscription.accessEndsAt) return false;
  return new Date(subscription.accessEndsAt) > now;
}

export type ApplyOneTimePurchaseResult =
  | { applied: true; accessEndsAt: Date }
  | { applied: false; reason: "duplicate" };

/**
 * Record a completed pay-once purchase and open (or extend) the access window.
 *
 * Idempotent on `stripePaymentIntentId`: Stripe retries webhooks, and without
 * this a replay would hand out a second interval of access for one payment.
 */
export async function applyOneTimePurchase(params: {
  userId: string;
  tier: SubscriptionTier;
  interval: BillingInterval;
  stripeCustomerId: string;
  stripePaymentIntentId: string;
  now?: Date;
}): Promise<ApplyOneTimePurchaseResult> {
  const now = params.now ?? new Date();

  const existing = await prisma.subscription.findUnique({
    where: { userId: params.userId },
    select: {
      purchaseType: true,
      accessEndsAt: true,
      stripePaymentIntentId: true,
    },
  });

  if (existing?.stripePaymentIntentId === params.stripePaymentIntentId) {
    return { applied: false, reason: "duplicate" };
  }

  const accessEndsAt = extendOneTimeAccess(
    existing?.purchaseType === "one_time" ? existing.accessEndsAt : null,
    params.interval,
    now
  );

  const data = {
    status: "active",
    plan: "subscribe",
    purchaseType: "one_time",
    planTier: params.tier,
    planInterval: params.interval,
    accessEndsAt,
    currentPeriodEnd: accessEndsAt,
    stripeCustomerId: params.stripeCustomerId,
    stripePaymentIntentId: params.stripePaymentIntentId,
    // A stale ID from an old canceled sub would otherwise keep granting access
    // after this window lapses.
    stripeSubscriptionId: null,
    canceledAt: null,
    gracePeriodEndsAt: null,
  };

  await prisma.subscription.upsert({
    where: { userId: params.userId },
    create: { userId: params.userId, ...data },
    update: data,
  });

  return { applied: true, accessEndsAt };
}

/** Refund/dispute — end the pay-once window immediately. */
export async function revokeOneTimePurchase(
  stripePaymentIntentId: string
): Promise<string | null> {
  const row = await prisma.subscription.findUnique({
    where: { stripePaymentIntentId },
    select: { userId: true },
  });
  if (!row) return null;

  await prisma.subscription.update({
    where: { stripePaymentIntentId },
    data: {
      status: "canceled",
      accessEndsAt: new Date(),
      canceledAt: new Date(),
    },
  });
  return row.userId;
}
