/** Billing/trial constants — edge-safe (no Stripe SDK). */

/** App-native free trial (days) — starts at signup without a payment method. */
export const TRIAL_DAYS = Number(process.env.TRIAL_DAYS ?? "3");

/** Lifetime question cap during app-native free trial (soft limit with full Pro access). */
export const TRIAL_LIFETIME_QUESTIONS = Number(
  process.env.TRIAL_LIFETIME_QUESTIONS ?? "150"
);

/** Lifetime question cap after trial expires (restricted Free tier). */
export const FREE_TIER_LIFETIME_QUESTIONS = Number(
  process.env.FREE_TIER_LIFETIME_QUESTIONS ?? "20"
);

/** Optional paid intro (legacy). Omit STRIPE_TRIAL_INTRO_PRICE_ID for standard $0 trial. */
export const TRIAL_INTRO_PRICE_USD = Number(process.env.TRIAL_INTRO_PRICE_USD ?? "17.99");

/** @deprecated Use TIER_MONTHLY_USD from subscription-tiers — kept for API compat (Pro monthly). */
export const MONTHLY_PRICE_USD = Number(process.env.PRO_MONTHLY_PRICE_USD ?? process.env.MONTHLY_PRICE_USD ?? "34.99");

/** Percent savings vs paying monthly for the same period. */
export const BILLING_INTERVAL_SAVINGS = {
  monthly: 0,
  quarterly: 5,
  semiannual: 12,
  yearly: 20,
} as const;

export type BillingInterval = keyof typeof BILLING_INTERVAL_SAVINGS;

export const INTERVAL_MONTHS: Record<BillingInterval, number> = {
  monthly: 1,
  quarterly: 3,
  semiannual: 6,
  yearly: 12,
};

/** Human-readable duration labels. */
export const INTERVAL_DISPLAY_LABELS: Record<BillingInterval, string> = {
  monthly: "Monthly",
  quarterly: "3 Months",
  semiannual: "6 Months",
  yearly: "12 Months",
};

/** @deprecated Use intervalTotalUsd(tier, "yearly") from billing-plans. */
export const YEARLY_PRICE_USD = Number(process.env.PRO_YEARLY_PRICE_USD ?? process.env.YEARLY_PRICE_USD ?? "349");

export const GRACE_PERIOD_DAYS = Number(process.env.GRACE_PERIOD_DAYS ?? "3");

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

/** Legacy $17.99 intro checkout — disabled unless both env vars are set. */
export function usesIntroTrialPricing(): boolean {
  return (
    process.env.ENABLE_LEGACY_INTRO_TRIAL === "true" &&
    Boolean(process.env.STRIPE_TRIAL_INTRO_PRICE_ID?.trim())
  );
}

/** Rough MRR for staff dashboards (active × tier monthly; trialing users excluded until first charge). */
export function estimateMrr(activeSubscribers: number, activeTrials: number): number {
  void activeTrials;
  return Math.round(activeSubscribers * MONTHLY_PRICE_USD * 100) / 100;
}
