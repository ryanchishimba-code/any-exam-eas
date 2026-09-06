import {
  TRIAL_DAYS,
  TRIAL_INTRO_PRICE_USD,
  TRIAL_LIFETIME_QUESTIONS,
  usesIntroTrialPricing,
} from "@/lib/billing-config";
import {
  BILLING_GUARANTEE_HEADLINE,
  BILLING_POLICY_SHORT,
  BILLING_TRIAL_DISCLOSURE,
  formatPlanUsd,
  getBillingPlanTier,
  intervalRenewalLabel,
  intervalSavingsUsd,
  type BillingPlanTier,
} from "@/lib/billing-plans";
import type { BillingInterval } from "@/lib/billing-config";
import {
  startingMonthlyUsd,
  TIER_MONTHLY_USD,
  type SubscriptionTier,
} from "@/lib/subscription-tiers";
import { parseSubscriptionTier } from "@/lib/subscription-tiers";
import { LANDING_HERO_SUBLINE_BODY } from "@/lib/landing/content";

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
  TRIAL_DAYS,
  TRIAL_INTRO_PRICE_USD,
  usesIntroTrialPricing,
  BILLING_GUARANTEE_HEADLINE,
  BILLING_POLICY_SHORT,
  BILLING_TRIAL_DISCLOSURE,
};

export function formatMonthlyPrice(tier: SubscriptionTier = "pro"): string {
  return formatPlanUsd(TIER_MONTHLY_USD[tier]);
}

export function formatStartingPrice(): string {
  return formatPlanUsd(startingMonthlyUsd());
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

export function formatTrialEntryPrice(): string {
  return formatTrialTodayPrice();
}

export function formatTrialLabel(): string {
  return `${TRIAL_DAYS}-day free trial`;
}

/** e.g. "500 practice questions during your 5-day trial" */
export function formatTrialQuestionLimit(): string {
  return `${TRIAL_LIFETIME_QUESTIONS} practice questions during your ${TRIAL_DAYS}-day trial`;
}

/** Primary marketing CTA label (buttons, sticky bars, nav). */
export const TRIAL_CTA_LABEL = "Try for free";

export function formatTrialCtaLabel(): string {
  return TRIAL_CTA_LABEL;
}

export function formatLandingHeroSubline(): string {
  return `${LANDING_HERO_SUBLINE_BODY} Pro at ${formatMonthlyPrice("pro")}/month.`;
}

export function formatTrialCtaWithSavings(
  tier: SubscriptionTier = "pro",
  interval: BillingInterval = "monthly"
): string {
  const plan = getBillingPlanTier(tier, interval);
  if (plan.savingsPercent === 0) {
    return formatTrialCtaLabel();
  }
  if (plan.recommended) {
    return `Start free · Lock in ${plan.savingsPercent}% off`;
  }
  return `Start free · Save ${plan.savingsPercent}%`;
}

export function formatTrialCtaSubline(
  tier: SubscriptionTier = "pro",
  interval: BillingInterval = "monthly"
): string {
  const plan = getBillingPlanTier(tier, interval);
  const afterTrial = formatTierAfterTrialLine(tier, interval).replace(/^After trial: /, "");
  if (plan.savingsPercent === 0) {
    return `Then ${afterTrial} · ${BILLING_TRIAL_DISCLOSURE}`;
  }
  const savings = intervalSavingsUsd(tier, interval);
  return `Then ${afterTrial} · save ${formatPlanUsd(savings)} vs monthly · ${BILLING_TRIAL_DISCLOSURE}`;
}

export function formatCheckoutContinueCta(
  plan: "trial" | "subscribe",
  tier: SubscriptionTier,
  interval: BillingInterval
): string {
  const planTier = getBillingPlanTier(tier, interval);
  if (plan === "trial") {
    if (planTier.savingsPercent > 0) {
      return planTier.recommended
        ? `Continue · Lock in ${planTier.savingsPercent}% Off`
        : `Continue · Save ${planTier.savingsPercent}%`;
    }
    return "Continue to Payment";
  }
  if (planTier.savingsPercent > 0) {
    return `Subscribe · Lock in ${planTier.savingsPercent}% Off`;
  }
  return "Continue to Payment";
}

export function formatTrialHeroOffer(): string {
  return `${formatTrialCtaLabel()} · plans from ${formatStartingPrice()}/mo · ${BILLING_TRIAL_DISCLOSURE}`;
}

export const TRIAL_PAYMENT_DISCLOSURE = `${TRIAL_DAYS}-day free trial · ${BILLING_TRIAL_DISCLOSURE} · cancel before trial ends and you won't be charged · ${BILLING_POLICY_SHORT}`;

export function formatLandingConversionSubtitle(): string {
  return `${formatTrialLabel()} · ${BILLING_TRIAL_DISCLOSURE}`;
}

export function formatLandingStickyDetail(): string {
  return `No card · Pro at ${formatMonthlyPrice("pro")}/mo after trial · ${formatTrialLabel()}`;
}

/** Primary headline for no-payment trial callouts. */
export const NO_PAYMENT_TRIAL_HEADLINE = "No payment method required";

/** Supporting copy under the headline on prominent callouts. */
export const NO_PAYMENT_TRIAL_SUBLINE = `Try for free with email — no card, no checkout until you choose to upgrade. Your ${TRIAL_DAYS}-day trial includes ${TRIAL_LIFETIME_QUESTIONS} practice questions instantly.`;

/** Short badge label for CTAs and sticky bars. */
export const NO_PAYMENT_TRIAL_BADGE = "No card required";

export const SIGNUP_PAYMENT_REQUIRED_NOTE =
  `No payment required to start. Your ${TRIAL_DAYS}-day trial includes ${TRIAL_LIFETIME_QUESTIONS} practice questions instantly.`;

export function formatTrialPlanDetail(): string {
  return `${TRIAL_DAYS}-day free trial · ${TRIAL_LIFETIME_QUESTIONS} questions · no card required · upgrade anytime for unlimited access`;
}

export function formatTrialCheckoutDescription(): string {
  return `${TRIAL_DAYS}-day free trial on your chosen plan. Add payment below — ${formatTrialTodayPrice()} due today unless intro pricing applies. Your plan is not charged until the trial ends. ${BILLING_POLICY_SHORT}`;
}

export const TRIAL_CARD_DISCLOSURE = TRIAL_PAYMENT_DISCLOSURE;

export function formatPricingHeadline(): string {
  if (usesIntroTrialPricing()) {
    return `${formatTrialIntroPrice()} / ${TRIAL_DAYS}-day trial → Pro from ${formatStartingPrice()}/mo`;
  }
  return `${TRIAL_DAYS}-day free trial · Pro at ${formatMonthlyPrice("pro")}/mo · no payment required`;
}

export function formatTierPriceLine(plan: BillingPlanTier): string {
  if (plan.interval === "monthly") {
    return `${formatPlanUsd(plan.totalUsd)}/month`;
  }
  return `${plan.savingsBadge} · ${formatPlanUsd(plan.totalUsd)} billed every ${plan.months} months`;
}

export function formatTierAfterTrialLine(
  tier: SubscriptionTier,
  interval: BillingInterval
): string {
  return `After trial: ${intervalRenewalLabel(tier, interval)}`;
}

export function formatTierName(_tier: SubscriptionTier = "pro"): string {
  return "Pro";
}

export { parseSubscriptionTier };
