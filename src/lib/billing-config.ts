/** Billing/trial constants — edge-safe (no Stripe SDK). */

/** Paid intro trial period (days) */
export const TRIAL_DAYS = Number(process.env.TRIAL_DAYS ?? "14");

/** Intro trial price shown at checkout (configure matching Stripe Price) */
export const TRIAL_INTRO_PRICE_USD = Number(process.env.TRIAL_INTRO_PRICE_USD ?? "17.99");

/** Recurring monthly price after trial */
export const MONTHLY_PRICE_USD = Number(process.env.MONTHLY_PRICE_USD ?? "29.99");

export const YEARLY_PRICE_USD = Number(process.env.YEARLY_PRICE_USD ?? "299");
export const GRACE_PERIOD_DAYS = Number(process.env.GRACE_PERIOD_DAYS ?? "3");

export type BillingInterval = "monthly" | "yearly";

export function gracePeriodEnd(from = new Date()): Date {
  const end = new Date(from);
  end.setDate(end.getDate() + GRACE_PERIOD_DAYS);
  return end;
}

/** Rough MRR for staff dashboards (active × monthly + trialing × intro). */
export function estimateMrr(activeSubscribers: number, activeTrials: number): number {
  return Math.round(
    (activeSubscribers * MONTHLY_PRICE_USD + activeTrials * TRIAL_INTRO_PRICE_USD) * 100
  ) / 100;
}
