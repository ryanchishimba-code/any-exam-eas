import { formatMonthlyPrice } from "@/lib/site";

/** Primary hero button on home and board landing pages. */
export const HERO_TRIAL_CTA_LABEL = "Start free trial";

export function homeTrialCtaLabel(): string {
  return HERO_TRIAL_CTA_LABEL;
}

export function homeTrialCloseHeading(): string {
  return "Start free trial.";
}

export const HOME_NO_PAYMENT_LINE = "No payment method required.";

/** Hero microcopy — trial signup does not ask for a card up front. */
export const HOME_NO_CARD_LINE = "No card needed.";

export function homeStickyCtaLabel(): string {
  return `${formatMonthlyPrice("pro")}/mo · Start free trial`;
}

/** Anchor for the public “See questions” secondary CTA on the homepage. */
export const HOME_SEE_QUESTIONS_HREF = "#quick-bites-heading";

/**
 * Pro monthly price beside the trial CTA.
 * Subscriptions renew until canceled in Settings (see paidRenewalConsentText).
 */
export function heroTrialPriceLine(): string {
  if (subscriptionAllowsCancelAnytime()) {
    return `${formatMonthlyPrice("pro")}/mo, cancel anytime`;
  }
  return `${formatMonthlyPrice("pro")}/mo`;
}

/** Self-service cancel in Settings stops the next renewal charge. */
export function subscriptionAllowsCancelAnytime(): boolean {
  return true;
}

/** Board landing secondary CTA — sample question when present. */
export function boardSeeQuestionsHref(hasSample: boolean): string {
  return hasSample ? "#sample-question" : "#quick-bites";
}

export const SEE_QUESTIONS_CTA_LABEL = "See questions";
