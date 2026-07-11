import type Stripe from "stripe";

/** Convert a Stripe unix timestamp (seconds) to a Date, or null if missing/invalid. */
export function stripeUnixToDate(unix: unknown): Date | null {
  if (typeof unix !== "number" || !Number.isFinite(unix) || unix <= 0) return null;
  const date = new Date(unix * 1000);
  return Number.isNaN(date.getTime()) ? null : date;
}

type PeriodFields = {
  current_period_end?: number | null;
  current_period_start?: number | null;
};

/**
 * Billing period end for a subscription.
 * Classic Stripe API: top-level `subscription.current_period_end`.
 * API 2025-03-31.basil+: moved onto subscription items.
 */
export function subscriptionCurrentPeriodEnd(sub: Stripe.Subscription): Date | null {
  const top = stripeUnixToDate((sub as Stripe.Subscription & PeriodFields).current_period_end);
  if (top) return top;
  const item = sub.items?.data?.[0] as (Stripe.SubscriptionItem & PeriodFields) | undefined;
  return stripeUnixToDate(item?.current_period_end);
}

/** Billing period start — same dual-shape handling as period end. */
export function subscriptionCurrentPeriodStart(sub: Stripe.Subscription): number | null {
  const top = (sub as Stripe.Subscription & PeriodFields).current_period_start;
  if (typeof top === "number" && Number.isFinite(top) && top > 0) return top;
  const item = sub.items?.data?.[0] as (Stripe.SubscriptionItem & PeriodFields) | undefined;
  const itemStart = item?.current_period_start;
  if (typeof itemStart === "number" && Number.isFinite(itemStart) && itemStart > 0) {
    return itemStart;
  }
  return null;
}

/** Unix seconds for period end (schedules / plan changes). */
export function subscriptionCurrentPeriodEndUnix(sub: Stripe.Subscription): number | null {
  const top = (sub as Stripe.Subscription & PeriodFields).current_period_end;
  if (typeof top === "number" && Number.isFinite(top) && top > 0) return top;
  const item = sub.items?.data?.[0] as (Stripe.SubscriptionItem & PeriodFields) | undefined;
  const itemEnd = item?.current_period_end;
  if (typeof itemEnd === "number" && Number.isFinite(itemEnd) && itemEnd > 0) return itemEnd;
  return null;
}
