import {
  MONTHLY_PRICE_USD,
  TRIAL_DAYS,
  TRIAL_INTRO_PRICE_USD,
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
    const introOriginal = TRIAL_INTRO_PRICE_USD;
    const introDiscounted = applyDiscount(introOriginal, discountPercent, discountAmount);
    const monthlyOriginal = MONTHLY_PRICE_USD;
    const monthlyDiscounted = applyDiscount(monthlyOriginal, discountPercent, discountAmount);

    const introSavings = Math.max(0, introOriginal - introDiscounted);
    const monthlySavings = Math.max(0, monthlyOriginal - monthlyDiscounted);

    return {
      plan,
      primary: {
        label: "Due today (trial start)",
        original: introOriginal,
        discounted: introDiscounted,
      },
      recurring: {
        label: `Then / month (after ${TRIAL_DAYS}-day trial)`,
        original: monthlyOriginal,
        discounted: monthlyDiscounted,
      },
      totalSavings: introSavings + monthlySavings,
      formattedPrimary: formatUsd(introDiscounted),
      formattedRecurring: formatUsd(monthlyDiscounted),
      formattedSavings: formatUsd(introSavings + monthlySavings),
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
