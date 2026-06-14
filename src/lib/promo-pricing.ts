import {
  MONTHLY_PRICE_USD,
  TRIAL_DAYS,
  TRIAL_INTRO_PRICE_USD,
  usesIntroTrialPricing,
  type BillingInterval,
} from "@/lib/billing-config";
import { getBillingPlanTier, intervalTotalUsd } from "@/lib/billing-plans";
import type { SignupPlan } from "@/lib/validators/auth";

export type PriceLine = {
  label: string;
  original: number;
  discounted: number;
};

export type PromoPricing = {
  plan: SignupPlan;
  interval: BillingInterval;
  primary: PriceLine;
  /** Recurring charge after trial (trial plan only). */
  recurring?: PriceLine;
  totalSavings: number;
  formattedPrimary: string;
  formattedRecurring?: string;
  formattedSavings: string;
};

export function formatUsd(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

/** Apply percent then fixed amount; never below zero. */
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

function recurringLineLabel(interval: BillingInterval, afterTrial: boolean): string {
  const tier = getBillingPlanTier(interval);
  const prefix = afterTrial ? `Then (after ${TRIAL_DAYS}-day trial)` : "Due today";
  if (interval === "monthly") {
    return `${prefix} · ${formatUsd(tier.totalUsd)}/month`;
  }
  return `${prefix} · ${formatUsd(tier.totalUsd)} every ${tier.months} mo (${formatUsd(tier.monthlyEquivalentUsd)}/mo equiv.)`;
}

export function buildPlanPricing(
  plan: SignupPlan,
  interval: BillingInterval = "monthly",
  discountPercent?: number | null,
  discountAmount?: number | null
): PromoPricing {
  const tier = getBillingPlanTier(interval);
  const periodTotal = intervalTotalUsd(interval);

  if (plan === "trial") {
    const dueTodayOriginal = usesIntroTrialPricing() ? TRIAL_INTRO_PRICE_USD : 0;
    const dueTodayDiscounted = applyDiscount(dueTodayOriginal, discountPercent, discountAmount);
    const periodOriginal = periodTotal;
    const periodDiscounted = applyDiscount(periodOriginal, discountPercent, discountAmount);

    const todaySavings = Math.max(0, dueTodayOriginal - dueTodayDiscounted);
    const periodSavings = Math.max(0, periodOriginal - periodDiscounted);

    return {
      plan,
      interval,
      primary: {
        label: `Due today (${TRIAL_DAYS}-day free trial · add payment method)`,
        original: dueTodayOriginal,
        discounted: dueTodayDiscounted,
      },
      recurring: {
        label: recurringLineLabel(interval, true),
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
    interval,
    primary: {
      label: recurringLineLabel(interval, false),
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

/** Compare against paying monthly for the same number of months (interval savings). */
export function intervalListSavingsUsd(interval: BillingInterval): number {
  if (interval === "monthly") return 0;
  const tier = getBillingPlanTier(interval);
  const full = MONTHLY_PRICE_USD * tier.months;
  return Math.round((full - tier.totalUsd) * 100) / 100;
}
