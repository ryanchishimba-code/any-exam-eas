import {
  MONTHLY_PRICE_USD,
  TRIAL_DAYS,
  TRIAL_INTRO_PRICE_USD,
  usesIntroTrialPricing,
} from "@/lib/billing-config";
import {
  BILLING_GUARANTEE_HEADLINE,
  BILLING_POLICY_SHORT,
  formatPlanUsd,
  getBillingPlanTier,
  intervalRenewalLabel,
  intervalSavingsUsd,
  type BillingPlanTier,
} from "@/lib/billing-plans";
import type { BillingInterval } from "@/lib/billing-config";

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

export {
  MONTHLY_PRICE_USD,
  TRIAL_DAYS,
  TRIAL_INTRO_PRICE_USD,
  usesIntroTrialPricing,
  BILLING_GUARANTEE_HEADLINE,
  BILLING_POLICY_SHORT,
};

export function formatMonthlyPrice(): string {
  return `$${MONTHLY_PRICE_USD.toFixed(2)}`;
}

/** Amount charged at checkout to start a trial ($0 unless legacy intro pricing is enabled). */
export function formatTrialTodayPrice(): string {
  if (usesIntroTrialPricing()) return formatTrialIntroPrice();
  return "$0";
}

export function formatTrialIntroPrice(): string {
  if (!usesIntroTrialPricing()) return "$0";
  return `$${TRIAL_INTRO_PRICE_USD.toFixed(2)}`;
}

/** Entry cost shown on CTAs — "$0" or intro price when legacy mode is on. */
export function formatTrialEntryPrice(): string {
  return formatTrialTodayPrice();
}

export function formatTrialLabel(): string {
  return `${TRIAL_DAYS}-day free trial`;
}

export function formatTrialCtaLabel(): string {
  return "Start free trial";
}

/** Primary pricing/checkout CTA — highlights savings for the selected billing cycle. */
export function formatTrialCtaWithSavings(interval: BillingInterval): string {
  const tier = getBillingPlanTier(interval);
  if (tier.savingsPercent === 0) {
    return formatTrialCtaLabel();
  }
  if (tier.recommended) {
    return `Start free · Lock in ${tier.savingsPercent}% off`;
  }
  return `Start free · Save ${tier.savingsPercent}%`;
}

/** Subline under the trial CTA reinforcing the post-trial price and savings. */
export function formatTrialCtaSubline(interval: BillingInterval): string {
  const tier = getBillingPlanTier(interval);
  const afterTrial = formatTierAfterTrialLine(interval).replace(/^After trial: /, "");
  if (tier.savingsPercent === 0) {
    return `Then ${afterTrial} · cancel anytime`;
  }
  const savings = intervalSavingsUsd(interval);
  return `Then ${afterTrial} · save ${formatPlanUsd(savings)} vs monthly`;
}

/** Checkout continue button — trial vs subscribe, with savings when applicable. */
export function formatCheckoutContinueCta(
  plan: "trial" | "subscribe",
  interval: BillingInterval
): string {
  const tier = getBillingPlanTier(interval);
  if (plan === "trial") {
    if (tier.savingsPercent > 0) {
      return tier.recommended
        ? `Continue · Lock in ${tier.savingsPercent}% Off`
        : `Continue · Save ${tier.savingsPercent}%`;
    }
    return "Continue to Payment";
  }
  if (tier.savingsPercent > 0) {
    return `Subscribe · Lock in ${tier.savingsPercent}% Off`;
  }
  return "Continue to Payment";
}

export function formatTrialHeroOffer(): string {
  return `${formatTrialCtaLabel()} · plans from ${formatMonthlyPrice()}/mo · add payment at checkout`;
}

/** Primary billing disclosure for landing, signup, and pricing. */
export const TRIAL_PAYMENT_DISCLOSURE = `${TRIAL_DAYS}-day free trial · payment method required · ${formatTrialTodayPrice()} charged today · cancel before trial ends and you won't be charged · ${BILLING_POLICY_SHORT}`;

/** Hero subline — trial, payment, and cancel policy in one scannable sentence. */
export function formatLandingHeroSubline(): string {
  return `All four boards on one plan — ${TRIAL_DAYS}-day free trial, payment method required, ${formatTrialTodayPrice()} today. Cancel before trial ends and you won't be charged.`;
}

/** Sticky bar and compact pricing footnotes on the landing page. */
export function formatLandingStickyDetail(): string {
  return `${formatTrialLabel()} · payment required · ${formatTrialTodayPrice()} today · cancel anytime`;
}

/** Mid-page conversion band subtitle — trial and billing at a glance. */
export function formatLandingConversionSubtitle(): string {
  return `Payment method required · ${formatTrialTodayPrice()} today · cancel before trial ends · save up to 20% on longer plans`;
}

/** Signup step — payment collected at checkout immediately after account creation. */
export const SIGNUP_PAYMENT_REQUIRED_NOTE =
  "Payment method required to start your trial. You are not charged today — cancel anytime before your trial ends and you will not be billed.";

/** Checkout / signup detail line for the trial plan card. */
export function formatTrialPlanDetail(): string {
  return `${formatTrialTodayPrice()} today · add card or wallet · full access after checkout · choose monthly or save up to 20% on longer plans`;
}

/** Longer checkout page description under the trial headline. */
export function formatTrialCheckoutDescription(): string {
  return `${TRIAL_DAYS}-day free trial. Add payment below — ${formatTrialTodayPrice()} charged today. Cancel before your trial ends and you won't be billed. ${BILLING_POLICY_SHORT}`;
}

/** @deprecated Use TRIAL_PAYMENT_DISCLOSURE */
export const TRIAL_CARD_DISCLOSURE = TRIAL_PAYMENT_DISCLOSURE;

export function formatPricingHeadline(): string {
  if (usesIntroTrialPricing()) {
    return `${formatTrialIntroPrice()} / ${TRIAL_DAYS}-day trial → from ${formatMonthlyPrice()}/mo`;
  }
  return `${TRIAL_DAYS}-day free trial · then from ${formatMonthlyPrice()}/mo · save up to 20% on longer plans`;
}

export function formatTierPriceLine(tier: BillingPlanTier): string {
  if (tier.interval === "monthly") {
    return `${formatMonthlyPrice()}/month`;
  }
  return `${tier.savingsBadge} · ${tier.totalUsd.toFixed(2)} billed every ${tier.months} months`;
}

export function formatTierAfterTrialLine(interval: BillingInterval): string {
  return `After trial: ${intervalRenewalLabel(interval)}`;
}
