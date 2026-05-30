import {
  MONTHLY_PRICE_USD,
  TRIAL_DAYS,
  TRIAL_INTRO_PRICE_USD,
} from "@/lib/stripe";

export const SITE_NAME = "Any Exam Easy";
export const SITE_DOMAIN = "anyexameasy.com";

export const SITE_IN_BETA = true;

export const BETA_MESSAGE =
  "Any Exam Easy is in beta. Features may change, and you may run into occasional issues while we improve the product.";

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
