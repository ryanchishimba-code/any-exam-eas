import {
  BILLING_INTERVAL_SAVINGS,
  INTERVAL_MONTHS,
  MONTHLY_PRICE_USD,
  type BillingInterval,
} from "@/lib/billing-config";

export type BillingPlanTier = {
  interval: BillingInterval;
  label: string;
  shortLabel: string;
  months: number;
  savingsPercent: number;
  totalUsd: number;
  monthlyEquivalentUsd: number;
  /** e.g. "Save 20%" — empty for monthly */
  savingsBadge: string | null;
  recommended: boolean;
};

export const BILLING_GUARANTEE_HEADLINE =
  "Your best companion for boards and clinical practice — at the best price in the industry.";

export const BILLING_GUARANTEE_POINTS = [
  "NCLEX, USMLE Step 2 CK, NAPLEX, MPJE, Top 500 Drugs, and Reference Hub in one plan",
  "UWorld-caliber vignettes, rationales, and adaptive practice — without $99+ per-exam bundles",
  "Cancel anytime from Settings — payments are non-refundable, but you keep full access through the period you paid for",
  "Switch billing plans anytime during your free trial; after that, plan changes take effect when your current paid term ends — billed only when the switch occurs",
  "Update your saved payment method anytime for recurring billing",
] as const;

export const BILLING_POLICY_SHORT =
  "Cancel anytime. Payments are non-refundable — access continues through the end of your paid period.";

/** Plan change rules shown in Settings and checkout. */
export const BILLING_PLAN_CHANGE_POLICY =
  "During your free trial, you can switch plans anytime — no charge until billing starts. On a paid subscription, plan changes take effect when your current term ends; you are billed only when the switch occurs, not when you schedule it. All payments are non-refundable.";

/** Recurring autopay disclosure for Settings and checkout. */
export const BILLING_RECURRING_POLICY =
  "Subscriptions renew automatically on your saved payment method. Update your card or wallet anytime before the next charge.";

const INTERVAL_LABELS: Record<BillingInterval, { label: string; shortLabel: string }> = {
  monthly: { label: "Monthly", shortLabel: "1 mo" },
  quarterly: { label: "Every 3 months", shortLabel: "3 mo" },
  semiannual: { label: "Every 6 months", shortLabel: "6 mo" },
  yearly: { label: "Yearly", shortLabel: "12 mo" },
};

export function intervalTotalUsd(interval: BillingInterval): number {
  const months = INTERVAL_MONTHS[interval];
  const full = MONTHLY_PRICE_USD * months;
  const savings = BILLING_INTERVAL_SAVINGS[interval];
  return Math.round(full * (1 - savings / 100) * 100) / 100;
}

/** Full price if customer paid monthly for the same period (anchor for savings UI). */
export function intervalListPriceUsd(interval: BillingInterval): number {
  return Math.round(MONTHLY_PRICE_USD * INTERVAL_MONTHS[interval] * 100) / 100;
}

/** Dollar savings vs paying monthly for the same number of months. */
export function intervalSavingsUsd(interval: BillingInterval): number {
  return Math.round((intervalListPriceUsd(interval) - intervalTotalUsd(interval)) * 100) / 100;
}

export function intervalMonthlyEquivalent(interval: BillingInterval): number {
  const months = INTERVAL_MONTHS[interval];
  return Math.round((intervalTotalUsd(interval) / months) * 100) / 100;
}

export function formatPlanUsd(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

export function getBillingPlanTier(interval: BillingInterval): BillingPlanTier {
  const savingsPercent = BILLING_INTERVAL_SAVINGS[interval];
  const names = INTERVAL_LABELS[interval];
  return {
    interval,
    label: names.label,
    shortLabel: names.shortLabel,
    months: INTERVAL_MONTHS[interval],
    savingsPercent,
    totalUsd: intervalTotalUsd(interval),
    monthlyEquivalentUsd: intervalMonthlyEquivalent(interval),
    savingsBadge:
      savingsPercent > 0 ? `Save ${savingsPercent}%` : null,
    recommended: interval === "yearly",
  };
}

export const BILLING_PLAN_TIERS: BillingPlanTier[] = (
  ["monthly", "quarterly", "semiannual", "yearly"] as BillingInterval[]
).map(getBillingPlanTier);

export function parseBillingInterval(value: unknown): BillingInterval {
  if (
    value === "quarterly" ||
    value === "semiannual" ||
    value === "yearly" ||
    value === "monthly"
  ) {
    return value;
  }
  return "monthly";
}

export function intervalRenewalLabel(interval: BillingInterval): string {
  const tier = getBillingPlanTier(interval);
  if (interval === "monthly") {
    return `${formatPlanUsd(tier.totalUsd)}/month`;
  }
  return `${formatPlanUsd(tier.totalUsd)} every ${tier.months} months (${formatPlanUsd(tier.monthlyEquivalentUsd)}/mo)`;
}
