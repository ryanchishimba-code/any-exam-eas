import type { BillingInterval } from "@/lib/billing-config";

/** Canonical Pro pricing — amounts used when Stripe Price unit_amount is asserted. */
export const PRO_MONTHLY_PRICE_USD = 27.99;

/** Annual discount vs paying monthly for 12 months. */
export const PRO_ANNUAL_SAVINGS_PERCENT = 30;

/** Fixed annual total — 30% off 12× monthly ($27.99 × 12 × 0.7 = $235.12). */
export const PRO_YEARLY_PRICE_USD =
  Math.round(
    PRO_MONTHLY_PRICE_USD * 12 * (1 - PRO_ANNUAL_SAVINGS_PERCENT / 100) * 100
  ) / 100;

/** First-time Pro monthly: percent off the first paid invoice only. */
export const PRO_FIRST_MONTH_DISCOUNT_PERCENT = 20;

/**
 * Stripe Price IDs for Pro (live mode — anyexameasy.com).
 * Env vars override these when set (use test price IDs locally).
 * Update via `npm run stripe:sync-prices` when changing amounts.
 */
export const COMMITTED_STRIPE_PRO_PRICE_IDS: Record<BillingInterval, string> = {
  monthly: "price_1Ts1AYHzk3nTXwgVj7j4DYAU",
  quarterly: "price_1Ts1AZHzk3nTXwgVC02NgIsb",
  semiannual: "price_1Ts1AZHzk3nTXwgVoPiQX0T8",
  yearly: "price_1Ts1AZHzk3nTXwgVAgjkAvOi",
};
