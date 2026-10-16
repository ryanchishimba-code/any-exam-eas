import { TRIAL_DAYS } from "@/lib/billing-config";

/** One primary action. The trial length comes from billing config. */
export function homeTrialCtaLabel(): string {
  return `Start ${TRIAL_DAYS}-day free trial`;
}

export function homeTrialCloseHeading(): string {
  return `Start your ${TRIAL_DAYS}-day free trial.`;
}

export const HOME_NO_PAYMENT_LINE = "No payment method required.";
