import {
  MONTHLY_PRICE_USD,
  TRIAL_DAYS,
  TRIAL_INTRO_PRICE_USD,
  usesIntroTrialPricing,
} from "@/lib/stripe";

export const SITE_NAME = "Any Exam Easy";
export const SITE_DOMAIN = "anyexameasy.com";

/** Short disclaimer for signup and marketing surfaces. */
export const MARKETING_DISCLAIMER =
  "Any Exam Easy is a study support tool. We do not guarantee exam results, licensure, or employment outcomes.";

/** User-facing label for in-app progress scores (not exam readiness claims). */
export const PRACTICE_PROGRESS_LABEL = "Practice progress";

export const PRACTICE_PROGRESS_HINT =
  "In-app practice metric only — not a predictor of board exam results.";

export const PROGRESS_METRICS_DISCLAIMER =
  "Practice scores and progress metrics reflect activity on this platform only. They do not predict licensure exam performance.";

export function formatMonthlyPrice(): string {
  return `$${MONTHLY_PRICE_USD.toFixed(2)}`;
}

/** Shown on pricing cards — $0 during trial unless legacy intro pricing is enabled. */
export function formatTrialTodayPrice(): string {
  if (usesIntroTrialPricing()) return formatTrialIntroPrice();
  return "$0 today";
}

export function formatTrialIntroPrice(): string {
  if (!usesIntroTrialPricing()) return "$0";
  return `$${TRIAL_INTRO_PRICE_USD.toFixed(2)}`;
}

export function formatTrialLabel(): string {
  return `${TRIAL_DAYS}-day free trial`;
}

export function formatTrialCtaLabel(): string {
  return `Start ${TRIAL_DAYS}-Day Free Trial`;
}

export function formatTrialHeroOffer(): string {
  return `${formatTrialCtaLabel()} — Only ${formatMonthlyPrice()}/month after`;
}

/** Primary billing disclosure for landing, signup, and pricing. */
export const TRIAL_PAYMENT_DISCLOSURE =
  "No charge today • Cancel anytime • Secure payments with Apple Pay, Google Pay & Cards";

/** @deprecated Use TRIAL_PAYMENT_DISCLOSURE */
export const TRIAL_CARD_DISCLOSURE = TRIAL_PAYMENT_DISCLOSURE;

export function formatPricingHeadline(): string {
  if (usesIntroTrialPricing()) {
    return `${formatTrialIntroPrice()} / ${TRIAL_DAYS}-day trial → ${formatMonthlyPrice()}/mo`;
  }
  return `${TRIAL_DAYS}-day free trial · ${formatTrialTodayPrice()} · then ${formatMonthlyPrice()}/mo`;
}
