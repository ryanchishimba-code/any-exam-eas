import {
  MONTHLY_PRICE_USD,
  TRIAL_DAYS,
  TRIAL_INTRO_PRICE_USD,
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

export function formatTrialIntroPrice(): string {
  return `$${TRIAL_INTRO_PRICE_USD.toFixed(2)}`;
}

export function formatTrialLabel(): string {
  return `${TRIAL_DAYS}-day trial`;
}

export function formatPricingHeadline(): string {
  return `${formatTrialIntroPrice()} / ${TRIAL_DAYS}-day trial → ${formatMonthlyPrice()}/mo`;
}
