import {
  TRIAL_DAYS,
  TRIAL_INTRO_PRICE_USD,
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

export function formatMonthlyPrice(tier: SubscriptionTier = "basic"): string {
  return `$${TIER_MONTHLY_USD[tier].toFixed(2)}`;
}

export function formatStartingPrice(): string {
  return `$${startingMonthlyUsd().toFixed(2)}`;
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

export function formatLandingHeroSubline(): string {
  return `${LANDING_HERO_SUBLINE_BODY} Starting at just ${formatMonthlyPrice("basic")}/month.`;
}

export function formatTrialCtaLabel(): string {
  return "Start 14-Day Free Trial";
}

export function formatTrialCtaWithSavings(
  tier: SubscriptionTier = "pro",
  interval: BillingInterval = "yearly"
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
  interval: BillingInterval = "yearly"
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
  return `Basic from ${formatMonthlyPrice("basic")}/mo · Pro from ${formatMonthlyPrice("pro")}/mo · ${formatTrialLabel()}`;
}

export const SIGNUP_PAYMENT_REQUIRED_NOTE =
  "Add your payment method at checkout — you won't be charged until your trial ends. Cancel anytime before then for no charge.";

export function formatTrialPlanDetail(): string {
  return `${TRIAL_DAYS}-day free trial · payment required at checkout · not charged until trial ends · save up to 20% on annual`;
}

export function formatTrialCheckoutDescription(): string {
  return `${TRIAL_DAYS}-day free trial on your chosen plan. Add payment below — ${formatTrialTodayPrice()} due today unless intro pricing applies. Your plan is not charged until the trial ends. ${BILLING_POLICY_SHORT}`;
}

export const TRIAL_CARD_DISCLOSURE = TRIAL_PAYMENT_DISCLOSURE;

export function formatPricingHeadline(): string {
  if (usesIntroTrialPricing()) {
    return `${formatTrialIntroPrice()} / ${TRIAL_DAYS}-day trial → from ${formatStartingPrice()}/mo`;
  }
  return `${TRIAL_DAYS}-day free trial · Basic from ${formatMonthlyPrice("basic")}/mo · Pro from ${formatMonthlyPrice("pro")}/mo`;
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

export function formatTierName(tier: SubscriptionTier): string {
  return tier === "pro" ? "Pro" : "Basic";
}

export { parseSubscriptionTier };
