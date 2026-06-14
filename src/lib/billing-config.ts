/** Billing/trial constants — edge-safe (no Stripe SDK). */

/** Free trial period (days) — payment method collected at checkout; charge after trial ends. */
export const TRIAL_DAYS = Number(process.env.TRIAL_DAYS ?? "7");

/** Optional paid intro (legacy). Omit STRIPE_TRIAL_INTRO_PRICE_ID for standard $0 trial. */
export const TRIAL_INTRO_PRICE_USD = Number(process.env.TRIAL_INTRO_PRICE_USD ?? "17.99");

/** Recurring monthly anchor price (before multi-month savings). */
export const MONTHLY_PRICE_USD = Number(process.env.MONTHLY_PRICE_USD ?? "32.99");

/** Percent savings vs paying monthly for the same period. */
export const BILLING_INTERVAL_SAVINGS = {
  monthly: 0,
  quarterly: 5,
  semiannual: 10,
  yearly: 20,
} as const;

export type BillingInterval = keyof typeof BILLING_INTERVAL_SAVINGS;

export const INTERVAL_MONTHS: Record<BillingInterval, number> = {
  monthly: 1,
  quarterly: 3,
  semiannual: 6,
  yearly: 12,
};

/** @deprecated Use intervalTotalUsd("yearly") from billing-plans — kept for API compat. */
export const YEARLY_PRICE_USD = Number(
  process.env.YEARLY_PRICE_USD ??
    String(
      Math.round(
        MONTHLY_PRICE_USD * 12 * (1 - BILLING_INTERVAL_SAVINGS.yearly / 100) * 100
      ) / 100
    )
);

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

/** Legacy $17.99 intro checkout — disabled unless both env vars are set. Standard trial is $0 today. */
export function usesIntroTrialPricing(): boolean {
  return (
    process.env.ENABLE_LEGACY_INTRO_TRIAL === "true" &&
    Boolean(process.env.STRIPE_TRIAL_INTRO_PRICE_ID?.trim())
  );
}

/** Rough MRR for staff dashboards (active × monthly; cardless trials excluded until paid). */
export function estimateMrr(activeSubscribers: number, activeTrials: number): number {
  void activeTrials;
  return Math.round(activeSubscribers * MONTHLY_PRICE_USD * 100) / 100;
}
