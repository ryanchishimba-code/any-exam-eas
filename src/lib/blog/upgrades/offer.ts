import { LANDING_TRIAL_HREF } from "@/lib/landing/content";
import { formatPricingCheckoutTrialOffer, formatTrialQuestionLimit } from "@/lib/site";

/** Exact public trial line. Do not paraphrase. */
export const TRIAL_OFFER = formatPricingCheckoutTrialOffer();

export const TRIAL_QUESTION_LIMIT = formatTrialQuestionLimit();

export const TRIAL_HREF = LANDING_TRIAL_HREF;

export function trialClose(sentence: string): string {
  return `<p>${sentence} <a href="${TRIAL_HREF}">Try for free</a>. ${TRIAL_OFFER}.</p>`;
}
