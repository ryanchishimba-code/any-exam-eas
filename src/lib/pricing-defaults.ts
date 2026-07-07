import type { BillingInterval } from "@/lib/billing-config";

/** Canonical Pro pricing — source of truth for deployed builds (overrides stale Vercel env). */
export const PRO_MONTHLY_PRICE_USD = 27.99;
export const PRO_YEARLY_PRICE_USD = 279.97;

/**
 * Stripe Price IDs for Pro (test mode account).
 * Update via `npm run stripe:sync-prices` when changing amounts.
 */
export const COMMITTED_STRIPE_PRO_PRICE_IDS: Record<BillingInterval, string> = {
  monthly: "price_1TqWKTQnlKQP1RHpOViSHUtF",
  quarterly: "price_1TqWKTQnlKQP1RHpkKI5Pcjz",
  semiannual: "price_1TqWKUQnlKQP1RHpqUJy3jW6",
  yearly: "price_1TqWKUQnlKQP1RHpOHrLdBhc",
};
