import { TRIAL_DAYS } from "@/lib/billing-config";
import { formatMonthlyPrice } from "@/lib/site";

/** One primary action. The trial length comes from billing config. */
export function homeTrialCtaLabel(): string {
  return `Start ${TRIAL_DAYS}-day free trial`;
}

export function homeTrialCloseHeading(): string {
  return `Start your ${TRIAL_DAYS}-day free trial.`;
}

export const HOME_NO_PAYMENT_LINE = "No payment method required.";

/** Hero microcopy — trial signup does not ask for a card up front. */
export const HOME_NO_CARD_LINE = "No card needed.";

export function homeStickyCtaLabel(): string {
  return `${formatMonthlyPrice("pro")}/mo · Start free trial`;
}
