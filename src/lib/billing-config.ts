/** Billing/trial constants — edge-safe (no Stripe SDK). */

export const TRIAL_DAYS = Number(process.env.TRIAL_DAYS ?? "7");
export const GRACE_PERIOD_DAYS = Number(process.env.GRACE_PERIOD_DAYS ?? "3");
export const MONTHLY_PRICE_USD = Number(process.env.MONTHLY_PRICE_USD ?? "3.99");
export const YEARLY_PRICE_USD = Number(process.env.YEARLY_PRICE_USD ?? "39.99");

export type BillingInterval = "monthly" | "yearly";

export function gracePeriodEnd(from = new Date()): Date {
  const end = new Date(from);
  end.setDate(end.getDate() + GRACE_PERIOD_DAYS);
  return end;
}
