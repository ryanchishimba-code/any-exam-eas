/**
 * Auto-pay vs one-time payment choice.
 *
 * Deliberately orthogonal to `BillingInterval`: the price and the length of
 * access are identical in both modes, the only difference is whether Stripe
 * charges the card again at the end of the period.
 */

import type { BillingInterval } from "@/lib/billing-config";
import { formatPlanUsd, getBillingPlanTier } from "@/lib/billing-plans";
import type { SubscriptionTier } from "@/lib/subscription-tiers";

export type PaymentMode = "auto" | "manual";

export const PAYMENT_MODES: readonly PaymentMode[] = ["auto", "manual"] as const;

/** Auto-pay stays the default so existing links and analytics keep their meaning. */
export const DEFAULT_PAYMENT_MODE: PaymentMode = "auto";

export function parsePaymentMode(value: unknown): PaymentMode {
  return value === "manual" ? "manual" : DEFAULT_PAYMENT_MODE;
}

/**
 * Renders the choice in pricing/checkout.
 *
 * Explicit opt-in, not on by default: pay-once checkout needs the one-time
 * Stripe prices from `npm run stripe:sync-prices` to exist first, and offering
 * a non-renewing purchase we cannot actually charge would be worse than not
 * offering it at all.
 */
export function isPaymentModeChoiceEnabled(): boolean {
  const raw =
    process.env.NEXT_PUBLIC_PAYMENT_MODE_CHOICE ??
    process.env.PAYMENT_MODE_CHOICE ??
    "";
  return raw === "true" || raw === "1";
}

export type PaymentModeOption = {
  id: PaymentMode;
  label: string;
  sub: string;
  detail: string;
};

/** Segmented-control copy for one tier/interval. Both modes cost the same. */
export function paymentModeOptions(
  tier: SubscriptionTier,
  interval: BillingInterval
): PaymentModeOption[] {
  const plan = getBillingPlanTier(tier, interval);
  const total = formatPlanUsd(plan.totalUsd);
  const per = interval === "monthly" ? "mo" : plan.shortLabel;
  const accessLength =
    plan.months === 1 ? "1 month of access" : `${plan.months} months of access`;

  return [
    {
      id: "auto",
      label: "Auto-pay",
      sub: `${total}/${per}`,
      detail: `Renews automatically every ${
        plan.months === 1 ? "month" : `${plan.months} months`
      }. Cancel anytime.`,
    },
    {
      id: "manual",
      label: "Pay once",
      sub: `${total} once`,
      detail: `${accessLength} for ${total}. No automatic renewal — you choose when to pay again.`,
    },
  ];
}

/** Replaces the recurring "Due today · $X/month" line, which would misstate a single charge. */
export function oneTimeSummaryLabel(
  tier: SubscriptionTier,
  interval: BillingInterval
): string {
  const plan = getBillingPlanTier(tier, interval);
  const months = plan.months === 1 ? "1 month" : `${plan.months} months`;
  return `Due today · ${formatPlanUsd(plan.totalUsd)} once (${months} of access)`;
}

/** Pay-once variant of BILLING_POLICY_SHORT — there is no subscription to cancel. */
export const ONE_TIME_POLICY_SHORT =
  "One charge, no auto-renewal. Payments are non-refundable — access runs to the end of the period you bought.";

export function paymentModeDetail(
  mode: PaymentMode,
  tier: SubscriptionTier,
  interval: BillingInterval
): string {
  const options = paymentModeOptions(tier, interval);
  return (options.find((o) => o.id === mode) ?? options[0]!).detail;
}
