import type { BillingInterval } from "@/lib/billing-config";

/** Canonical Pro pricing — amounts used when Stripe Price unit_amount is asserted. */
export const PRO_MONTHLY_PRICE_USD = 27.99;
export const PRO_YEARLY_PRICE_USD = 279.97;

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
