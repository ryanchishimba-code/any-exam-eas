"use client";

import { BadgePercent } from "lucide-react";
import type { BillingInterval } from "@/lib/billing-config";
import type { PromoPricing } from "@/lib/promo-pricing";
import { formatUsd, hasDiscount } from "@/lib/promo-pricing";
import { renewalTermsLine } from "@/lib/billing-plans";
import type { DiscountValidation } from "@/lib/discount/types";
import {
  DEFAULT_PAYMENT_MODE,
  ONE_TIME_POLICY_SHORT,
  type PaymentMode,
} from "@/lib/billing-payment-mode";
import { cn } from "@/lib/utils";

import type { SubscriptionTier } from "@/lib/subscription-tiers";

type CheckoutOrderSummaryProps = {
  pricing: PromoPricing;
  discount: DiscountValidation | null;
  interval?: BillingInterval;
  tier?: SubscriptionTier;
  paymentMode?: PaymentMode;
  className?: string;
  sticky?: boolean;
};

export function CheckoutOrderSummary({
  pricing,
  discount,
  interval = "monthly",
  tier = "pro",
  paymentMode = DEFAULT_PAYMENT_MODE,
  className,
  sticky = false,
}: CheckoutOrderSummaryProps) {
  const discounted = discount?.valid && hasDiscount(pricing);
  const oneTime = paymentMode === "manual";
  const isFree = pricing.primary.discounted === 0;

  /*
   * One line of terms, not a stack of them. The interval selector already
   * carries the price and savings, so repeating them here only added noise —
   * what is left is the part a buyer cannot infer: what happens next.
   */
  const terms = isFree
    ? "5-day free trial · no card required"
    : oneTime
      ? ONE_TIME_POLICY_SHORT
      : renewalTermsLine(tier, interval);

  return (
    <section
      className={cn(
        "rounded-[20px] border border-black/[0.06] bg-white px-5 py-4 shadow-[var(--shadow-apple-sm)]",
        sticky && "lg:sticky lg:top-24",
        className
      )}
      aria-label="Order summary"
    >
      <div className="flex items-end justify-between gap-4">
        <span className="text-sm font-semibold text-[var(--color-ink)]">Due today</span>
        <p
          className="text-3xl font-semibold tabular-nums tracking-tight text-[var(--color-ink)]"
          aria-live="polite"
          aria-atomic="true"
        >
          {discounted && (
            <span className="mr-2 text-lg font-normal text-[var(--color-ink-muted)] line-through">
              {formatUsd(pricing.primary.original)}
            </span>
          )}
          {formatUsd(pricing.primary.discounted)}
        </p>
      </div>

      {discounted && (
        <p className="mt-2 inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800">
          <BadgePercent className="h-3.5 w-3.5" aria-hidden />
          {discount?.code} · save {pricing.formattedSavings}
        </p>
      )}

      <p className="mt-2 text-[0.6875rem] leading-relaxed text-[var(--color-ink-muted)]">
        {terms}
      </p>
    </section>
  );
}
