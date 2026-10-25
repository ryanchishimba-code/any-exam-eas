import {
  FINISH_LINE_TERMS_PATH,
  isFinishLineOfferEnabled,
} from "@/lib/marketing/finish-line-offer";

/** Plain sentence for emails, JSON-LD, and legal pages (no JSX). */
export function paymentsNonRefundableSentence(finishLineOffer = isFinishLineOfferEnabled()): string {
  if (finishLineOffer) {
    return `Payments are non-refundable, except under the Finish Line Refund terms (${FINISH_LINE_TERMS_PATH}) or where required by law.`;
  }
  return "Payments are non-refundable except where required by law.";
}

export function paidChargesNonRefundableSentence(finishLineOffer = isFinishLineOfferEnabled()): string {
  if (finishLineOffer) {
    return `Paid charges are non-refundable, except under the Finish Line Refund terms (${FINISH_LINE_TERMS_PATH}) or where required by law.`;
  }
  return "Paid charges are non-refundable except where the law requires a refund.";
}

export function refundsAndAccessLegalParagraph(finishLineOffer = isFinishLineOfferEnabled()): string {
  if (finishLineOffer) {
    return `All payments are non-refundable except under the Finish Line Refund terms (${FINISH_LINE_TERMS_PATH}) or where required by applicable law. If you cancel, you retain access through the end of the billing period you have already paid for. We do not provide prorated refunds for unused time within a paid period.`;
  }
  return "All payments are non-refundable except where required by applicable law. If you cancel, you retain access through the end of the billing period you have already paid for. We do not provide prorated refunds for unused time within a paid period.";
}

export function pricingTrialFootnoteSentence(finishLineOffer: boolean): string {
  if (finishLineOffer) {
    return paymentsNonRefundableSentence(true);
  }
  return "Payments are non-refundable (except where required by law). Found a flawed question? Report it and we'll review it. This is not a refund.";
}

export function cancelAnytimeFaqAnswerLanding(finishLineOffer: boolean): string {
  const lead =
    "Yes. Cancel anytime in Settings. That opens Stripe billing and stops the next charge. Canceling before a trial ends means you are not charged.";
  return `${lead} ${paidChargesNonRefundableSentence(finishLineOffer)}`;
}

export function cancelAnytimeFaqAnswerHome(finishLineOffer: boolean): string {
  const lead = "Yes. Cancel anytime in Settings. That stops the next charge.";
  return `${lead} ${paidChargesNonRefundableSentence(finishLineOffer)}`;
}

export function billingPolicyShort(finishLineOffer = isFinishLineOfferEnabled()): string {
  if (finishLineOffer) {
    return `Cancel anytime in Settings. ${paymentsNonRefundableSentence(true)} Access continues through the end of your paid period.`;
  }
  return "Cancel anytime in Settings. Payments are non-refundable — access continues through the end of your paid period.";
}

export function renewalTermsLineNonRefundableClause(finishLineOffer: boolean): string {
  if (finishLineOffer) {
    return "Non-refundable except under Finish Line Refund terms or where required by law.";
  }
  return "Non-refundable.";
}

export function billingPlanChangePolicy(finishLineOffer = isFinishLineOfferEnabled()): string {
  const tail = finishLineOffer
    ? paymentsNonRefundableSentence(true)
    : "All payments are non-refundable.";
  return `During your free trial, plan changes apply when billing starts at the end of the trial — you are not charged until then. On a paid subscription, plan changes take effect when your current term ends; you are billed only when the switch occurs, not when you schedule it. ${tail}`;
}

export function oneTimePolicyShort(finishLineOffer = isFinishLineOfferEnabled()): string {
  if (finishLineOffer) {
    return `One charge, no auto-renewal. ${paymentsNonRefundableSentence(true)} Access runs to the end of the period you bought.`;
  }
  return "One charge, no auto-renewal. Payments are non-refundable — access runs to the end of the period you bought.";
}
