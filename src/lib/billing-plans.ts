import {
  BILLING_INTERVAL_SAVINGS,
  INTERVAL_MONTHS,
  type BillingInterval,
} from "@/lib/billing-config";
import {
  TIER_ANNUAL_USD,
  TIER_MONTHLY_USD,
  type SubscriptionTier,
} from "@/lib/subscription-tiers";

export type BillingPlanTier = {
  tier: SubscriptionTier;
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
  "Professional board prep for all major exams at a fraction of competitor prices.";

export const BILLING_GUARANTEE_POINTS = [
  "USMLE, NCLEX, NAPLEX, PANCE, AANP FNP, and NPTE-PT — all 6 exams in one Pro plan",
  "Integrated Exam Roadmaps plus board-style vignettes — without $200–400+ per-exam bundles",
  "3-day free trial · 150 practice questions · No payment required at signup · Upgrade anytime for unlimited access",
  "Cancel anytime — access continues through the end of your paid period",
  "Update your saved payment method anytime for recurring billing",
] as const;

export const BILLING_POLICY_SHORT =
  "Cancel anytime. Payments are non-refundable — access continues through the end of your paid period.";

export const BILLING_TRIAL_DISCLOSURE =
  "No payment required to start · 3-day trial with full Pro access (150 practice questions) · Upgrade anytime for unlimited access";

/** Plan change rules shown in Settings and checkout. */
export const BILLING_PLAN_CHANGE_POLICY =
  "During your free trial, plan changes apply when billing starts at the end of the trial — you are not charged until then. On a paid subscription, plan changes take effect when your current term ends; you are billed only when the switch occurs, not when you schedule it. All payments are non-refundable.";

/** Recurring autopay disclosure for Settings and checkout. */
export const BILLING_RECURRING_POLICY =
  "Subscriptions renew automatically on your saved payment method. Update your card or wallet anytime before the next charge.";

const INTERVAL_LABELS: Record<BillingInterval, { label: string; shortLabel: string }> = {
  monthly: { label: "Monthly", shortLabel: "1 mo" },
  quarterly: { label: "Every 3 months", shortLabel: "3 mo" },
  semiannual: { label: "Every 6 months", shortLabel: "6 mo" },
  yearly: { label: "Annual", shortLabel: "12 mo" },
};

export function intervalTotalUsd(tier: SubscriptionTier, interval: BillingInterval): number {
  if (interval === "yearly") {
    return TIER_ANNUAL_USD[tier];
  }
  const monthly = TIER_MONTHLY_USD[tier];
  const months = INTERVAL_MONTHS[interval];
  const full = monthly * months;
  const savings = BILLING_INTERVAL_SAVINGS[interval];
  return Math.round(full * (1 - savings / 100) * 100) / 100;
}

/** Full price if customer paid monthly for the same period (anchor for savings UI). */
export function intervalListPriceUsd(tier: SubscriptionTier, interval: BillingInterval): number {
  return Math.round(TIER_MONTHLY_USD[tier] * INTERVAL_MONTHS[interval] * 100) / 100;
}

/** Dollar savings vs paying monthly for the same number of months. */
export function intervalSavingsUsd(tier: SubscriptionTier, interval: BillingInterval): number {
  return Math.round((intervalListPriceUsd(tier, interval) - intervalTotalUsd(tier, interval)) * 100) / 100;
}

export function intervalMonthlyEquivalent(tier: SubscriptionTier, interval: BillingInterval): number {
  const months = INTERVAL_MONTHS[interval];
  return Math.round((intervalTotalUsd(tier, interval) / months) * 100) / 100;
}

/** Effective savings percent for display (annual uses fixed price). */
export function intervalEffectiveSavingsPercent(
  tier: SubscriptionTier,
  interval: BillingInterval
): number {
  if (interval === "monthly") return 0;
  const list = intervalListPriceUsd(tier, interval);
  const total = intervalTotalUsd(tier, interval);
  return Math.round((1 - total / list) * 100);
}

export function formatPlanUsd(amount: number): string {
  if (Number.isInteger(amount)) return `$${amount}`;
  return `$${amount.toFixed(2)}`;
}

export function formatApproxUsd(amount: number): string {
  if (amount >= 100 && Number.isInteger(amount)) return `$${amount}`;
  return formatPlanUsd(amount);
}

export function getBillingPlanTier(
  tier: SubscriptionTier,
  interval: BillingInterval
): BillingPlanTier {
  const savingsPercent = intervalEffectiveSavingsPercent(tier, interval);
  const names = INTERVAL_LABELS[interval];
  return {
    tier,
    interval,
    label: names.label,
    shortLabel: names.shortLabel,
    months: INTERVAL_MONTHS[interval],
    savingsPercent,
    totalUsd: intervalTotalUsd(tier, interval),
    monthlyEquivalentUsd: intervalMonthlyEquivalent(tier, interval),
    savingsBadge: savingsPercent > 0 ? `Save ${savingsPercent}%` : null,
    recommended: interval === "yearly",
  };
}

export const BILLING_PLAN_TIERS: BillingPlanTier[] = (
  ["monthly", "quarterly", "semiannual", "yearly"] as BillingInterval[]
).map((interval) => getBillingPlanTier("pro", interval));

export function getBillingPlanTiersForTier(tier: SubscriptionTier): BillingPlanTier[] {
  return (["monthly", "quarterly", "semiannual", "yearly"] as BillingInterval[]).map((interval) =>
    getBillingPlanTier(tier, interval)
  );
}

export function parseBillingInterval(value: unknown): BillingInterval {
  if (
    value === "quarterly" ||
    value === "semiannual" ||
    value === "yearly" ||
    value === "monthly"
  ) {
    return value;
  }
  return "yearly";
}

export function intervalRenewalLabel(tier: SubscriptionTier, interval: BillingInterval): string {
  const plan = getBillingPlanTier(tier, interval);
  if (interval === "monthly") {
    return `${formatPlanUsd(plan.totalUsd)}/month`;
  }
  return `${formatPlanUsd(plan.totalUsd)} every ${plan.months} months (${formatPlanUsd(plan.monthlyEquivalentUsd)}/mo)`;
}

/** Compact pricing line for tier cards — e.g. "$27.99/mo | 3mo ≈ $79.77 | 12mo $279" */
export function formatTierPricingSummary(tier: SubscriptionTier): string {
  const monthly = formatPlanUsd(TIER_MONTHLY_USD[tier]);
  const q = formatApproxUsd(intervalTotalUsd(tier, "quarterly"));
  const s = formatApproxUsd(intervalTotalUsd(tier, "semiannual"));
  const y = formatPlanUsd(intervalTotalUsd(tier, "yearly"));
  const ySave = intervalEffectiveSavingsPercent(tier, "yearly");
  return `${monthly}/mo · 3mo ≈ ${q} · 6mo ≈ ${s} · 12mo ${y} (save ${ySave}%)`;
}
