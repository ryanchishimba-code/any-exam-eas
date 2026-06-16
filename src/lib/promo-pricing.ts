import {
  TRIAL_DAYS,
  TRIAL_INTRO_PRICE_USD,
  usesIntroTrialPricing,
  type BillingInterval,
} from "@/lib/billing-config";
import { getBillingPlanTier, intervalTotalUsd } from "@/lib/billing-plans";
import type { SignupPlan } from "@/lib/validators/auth";
import type { SubscriptionTier } from "@/lib/subscription-tiers";
import { TIER_MONTHLY_USD } from "@/lib/subscription-tiers";

export type PriceLine = {
  label: string;
  original: number;
  discounted: number;
};

export type PromoPricing = {
  plan: SignupPlan;
  tier: SubscriptionTier;
  interval: BillingInterval;
  primary: PriceLine;
  recurring?: PriceLine;
  totalSavings: number;
  formattedPrimary: string;
  formattedRecurring?: string;
  formattedSavings: string;
};

export function formatUsd(amount: number): string {
  if (Number.isInteger(amount)) return `$${amount}`;
  return `$${amount.toFixed(2)}`;
}

export function applyDiscount(
  base: number,
  discountPercent?: number | null,
  discountAmount?: number | null
): number {
  let price = base;
  if (discountPercent && discountPercent > 0) {
    price = price * (1 - discountPercent / 100);
  }
  if (discountAmount && discountAmount > 0) {
    price = price - discountAmount;
  }
  return Math.max(0, Math.round(price * 100) / 100);
}

function recurringLineLabel(
  tier: SubscriptionTier,
  interval: BillingInterval,
  afterTrial: boolean
): string {
  const plan = getBillingPlanTier(tier, interval);
  const prefix = afterTrial ? `Then (after ${TRIAL_DAYS}-day trial)` : "Due today";
  if (interval === "monthly") {
    return `${prefix} · ${formatUsd(plan.totalUsd)}/month`;
  }
  return `${prefix} · ${formatUsd(plan.totalUsd)} every ${plan.months} mo (${formatUsd(plan.monthlyEquivalentUsd)}/mo equiv.)`;
}

export function buildPlanPricing(
  plan: SignupPlan,
  tier: SubscriptionTier = "pro",
  interval: BillingInterval = "yearly",
  discountPercent?: number | null,
  discountAmount?: number | null
): PromoPricing {
  const planTier = getBillingPlanTier(tier, interval);
  const periodTotal = intervalTotalUsd(tier, interval);

  if (plan === "trial") {
    const dueTodayOriginal = usesIntroTrialPricing() ? TRIAL_INTRO_PRICE_USD : 0;
    const dueTodayDiscounted = applyDiscount(dueTodayOriginal, discountPercent, discountAmount);
    const periodOriginal = periodTotal;
    const periodDiscounted = applyDiscount(periodOriginal, discountPercent, discountAmount);

    const todaySavings = Math.max(0, dueTodayOriginal - dueTodayDiscounted);
    const periodSavings = Math.max(0, periodOriginal - periodDiscounted);

    return {
      plan,
      tier,
      interval,
      primary: {
        label: `Due today (${TRIAL_DAYS}-day free trial)`,
        original: dueTodayOriginal,
        discounted: dueTodayDiscounted,
      },
      recurring: {
        label: recurringLineLabel(tier, interval, true),
        original: periodOriginal,
        discounted: periodDiscounted,
      },
      totalSavings: todaySavings + periodSavings,
      formattedPrimary: formatUsd(dueTodayDiscounted),
      formattedRecurring: formatUsd(periodDiscounted),
      formattedSavings: formatUsd(todaySavings + periodSavings),
    };
  }

  const periodOriginal = periodTotal;
  const periodDiscounted = applyDiscount(periodOriginal, discountPercent, discountAmount);
  const savings = Math.max(0, periodOriginal - periodDiscounted);

  return {
    plan,
    tier,
    interval,
    primary: {
      label: recurringLineLabel(tier, interval, false),
      original: periodOriginal,
      discounted: periodDiscounted,
    },
    totalSavings: savings,
    formattedPrimary: formatUsd(periodDiscounted),
    formattedSavings: formatUsd(savings),
  };
}

export function hasDiscount(pricing: PromoPricing): boolean {
  return pricing.primary.discounted < pricing.primary.original - 0.001;
}

export function intervalListSavingsUsd(
  tier: SubscriptionTier,
  interval: BillingInterval
): number {
  if (interval === "monthly") return 0;
  const plan = getBillingPlanTier(tier, interval);
  const full = TIER_MONTHLY_USD[tier] * plan.months;
  return Math.round((full - plan.totalUsd) * 100) / 100;
}
