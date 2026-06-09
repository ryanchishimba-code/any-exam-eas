import {
  MONTHLY_PRICE_USD,
  TRIAL_DAYS,
  TRIAL_INTRO_PRICE_USD,
  usesIntroTrialPricing,
} from "@/lib/billing-config";
import type { SignupPlan } from "@/lib/validators/auth";

export type PriceLine = {
  label: string;
  original: number;
  discounted: number;
};

export type PromoPricing = {
  plan: SignupPlan;
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

export function buildPlanPricing(
  plan: SignupPlan,
  discountPercent?: number | null,
  discountAmount?: number | null
): PromoPricing {
  if (plan === "trial") {
    const dueTodayOriginal = usesIntroTrialPricing() ? TRIAL_INTRO_PRICE_USD : 0;
    const dueTodayDiscounted = applyDiscount(dueTodayOriginal, discountPercent, discountAmount);
    const monthlyOriginal = MONTHLY_PRICE_USD;
    const monthlyDiscounted = applyDiscount(monthlyOriginal, discountPercent, discountAmount);

    const todaySavings = Math.max(0, dueTodayOriginal - dueTodayDiscounted);
    const monthlySavings = Math.max(0, monthlyOriginal - monthlyDiscounted);

    return {
      plan,
      primary: {
        label: `Due today (${TRIAL_DAYS}-day free trial · add payment method)`,
        original: dueTodayOriginal,
        discounted: dueTodayDiscounted,
      },
      recurring: {
        label: `Then / month (after ${TRIAL_DAYS}-day trial)`,
        original: monthlyOriginal,
        discounted: monthlyDiscounted,
      },
      totalSavings: todaySavings + monthlySavings,
      formattedPrimary: formatUsd(dueTodayDiscounted),
      formattedRecurring: formatUsd(monthlyDiscounted),
      formattedSavings: formatUsd(todaySavings + monthlySavings),
    };
  }

  const monthlyOriginal = MONTHLY_PRICE_USD;
  const monthlyDiscounted = applyDiscount(monthlyOriginal, discountPercent, discountAmount);
  const savings = Math.max(0, monthlyOriginal - monthlyDiscounted);

  return {
    plan,
    primary: {
      label: "Due today",
      original: monthlyOriginal,
      discounted: monthlyDiscounted,
    },
    totalSavings: savings,
    formattedPrimary: formatUsd(monthlyDiscounted),
    formattedSavings: formatUsd(savings),
  };
}

export function hasDiscount(pricing: PromoPricing): boolean {
  return pricing.primary.discounted < pricing.primary.original - 0.001;
}
