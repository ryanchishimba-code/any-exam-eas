import type { BillingInterval } from "@/lib/billing-config";
import { PRO_FIRST_MONTH_DISCOUNT_PERCENT } from "@/lib/pricing-defaults";

export const FIRST_MONTH_COUPON_ID = "aee_first_month_20";

export const FIRST_MONTH_DISCOUNT_LABEL = `${PRO_FIRST_MONTH_DISCOUNT_PERCENT}% off your first month`;

type SubLike = {
  status: string;
  plan: string | null;
  canceledAt: Date | null;
} | null;

/**
 * First-time Pro payers only — never had a paid (subscribe) period.
 * Trial / trial_expired / never subscribed qualify; canceled paid does not.
 */
export function isEligibleForFirstMonthDiscount(sub: SubLike): boolean {
  if (!sub) return true;
  if (sub.status === "active" || sub.status === "past_due" || sub.status === "unpaid") {
    return false;
  }
  if (sub.status === "canceled" && sub.plan === "subscribe") return false;
  if (sub.canceledAt && sub.plan === "subscribe") return false;
  return true;
}

/** Offer applies to monthly Pro checkout for first-time paying members. */
export function shouldApplyFirstMonthDiscount(params: {
  interval: BillingInterval;
  sub: SubLike;
  /** Explicit promo coupon already selected — do not stack. */
  hasPromoCoupon?: boolean;
}): boolean {
  if (params.hasPromoCoupon) return false;
  if (params.interval !== "monthly") return false;
  return isEligibleForFirstMonthDiscount(params.sub);
}

/**
 * Resolve (or create) the Stripe coupon for first-month 20% off.
 * Prefers STRIPE_FIRST_MONTH_COUPON_ID when set.
 */
export async function resolveFirstMonthCouponId(
  stripe: import("stripe").default
): Promise<string> {
  const fromEnv = process.env.STRIPE_FIRST_MONTH_COUPON_ID?.trim();
  if (fromEnv) return fromEnv;

  try {
    await stripe.coupons.retrieve(FIRST_MONTH_COUPON_ID);
    return FIRST_MONTH_COUPON_ID;
  } catch {
    await stripe.coupons.create({
      id: FIRST_MONTH_COUPON_ID,
      percent_off: PRO_FIRST_MONTH_DISCOUNT_PERCENT,
      duration: "once",
      name: "First month — 20% off",
      metadata: { purpose: "first_month_new_pro" },
    });
    return FIRST_MONTH_COUPON_ID;
  }
}
