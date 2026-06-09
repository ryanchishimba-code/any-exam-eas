/** Billing/trial constants — edge-safe (no Stripe SDK). */

/** Free trial period (days) — card collected at checkout; no charge until trial ends. */
export const TRIAL_DAYS = Number(process.env.TRIAL_DAYS ?? "3");

/** Optional paid intro (legacy). Omit STRIPE_TRIAL_INTRO_PRICE_ID for free cardless trial. */
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

/** End of app-native free trial (used at signup before Stripe subscription exists). */
export function trialEndsAtFromNow(from = new Date()): Date {
  const end = new Date(from);
  end.setDate(end.getDate() + TRIAL_DAYS);
  return end;
}

export function usesIntroTrialPricing(): boolean {
  return Boolean(process.env.STRIPE_TRIAL_INTRO_PRICE_ID?.trim());
}

/** Rough MRR for staff dashboards (active × monthly; cardless trials excluded until paid). */
export function estimateMrr(activeSubscribers: number, activeTrials: number): number {
  void activeTrials;
  return Math.round(activeSubscribers * MONTHLY_PRICE_USD * 100) / 100;
}
