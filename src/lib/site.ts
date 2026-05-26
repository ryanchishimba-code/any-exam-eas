import { MONTHLY_PRICE_USD, TRIAL_DAYS } from "@/lib/stripe";

export const SITE_IN_BETA = true;

export const BETA_MESSAGE =
  "Any Exam Easy is in beta. Features may change, and you may run into occasional issues while we improve the product.";

export function formatMonthlyPrice(): string {
  return `$${MONTHLY_PRICE_USD.toFixed(2)}`;
}

export function formatTrialLabel(): string {
  return `${TRIAL_DAYS}-day free trial`;
}
