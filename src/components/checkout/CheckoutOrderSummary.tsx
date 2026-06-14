"use client";

import { BadgePercent } from "lucide-react";
import type { BillingInterval } from "@/lib/billing-config";
import type { PromoPricing } from "@/lib/promo-pricing";
import { formatUsd, hasDiscount } from "@/lib/promo-pricing";
import {
  BILLING_POLICY_SHORT,
  formatPlanUsd,
  getBillingPlanTier,
  intervalListPriceUsd,
  intervalSavingsUsd,
} from "@/lib/billing-plans";
import type { DiscountValidation } from "@/lib/discount/types";
import { cn } from "@/lib/utils";

type CheckoutOrderSummaryProps = {
  pricing: PromoPricing;
  discount: DiscountValidation | null;
  planLabel: string;
  interval?: BillingInterval;
  className?: string;
  sticky?: boolean;
};

export function CheckoutOrderSummary({
  pricing,
  discount,
  planLabel,
  interval = "yearly",
  className,
  sticky = false,
}: CheckoutOrderSummaryProps) {
  const discounted = discount?.valid && hasDiscount(pricing);
  const tier = getBillingPlanTier(interval);
  const listPrice = intervalListPriceUsd(interval);
  const planSavings = intervalSavingsUsd(interval);

  return (
    <section
      className={cn(
        "overflow-hidden rounded-[24px] border border-black/[0.06] bg-white shadow-[var(--shadow-apple-sm)]",
        sticky && "lg:sticky lg:top-24",
        className
      )}
      aria-label="Order summary"
    >
      <div className="border-b border-black/[0.05] px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
          Summary
        </p>
        <p className="mt-1 text-sm font-medium text-[var(--color-ink)]">{planLabel}</p>
      </div>

      <div className="space-y-3 px-5 py-4">
        <div className="flex justify-between gap-4 text-sm">
          <span className="text-[var(--color-ink-muted)]">{pricing.primary.label}</span>
          <span className="tabular-nums font-medium text-[var(--color-ink)]">
            {discounted && (
              <span className="mr-1.5 font-normal text-[var(--color-ink-muted)] line-through">
                {formatUsd(pricing.primary.original)}
              </span>
            )}
            {formatUsd(pricing.primary.discounted)}
          </span>
        </div>

        {pricing.recurring && tier.savingsPercent > 0 && (
          <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 px-3 py-3 text-sm">
            <div className="flex justify-between gap-3">
              <span className="text-[var(--color-ink-muted)]">List price</span>
              <span className="tabular-nums text-[var(--color-ink-muted)] line-through">
                {formatPlanUsd(listPrice)}
              </span>
            </div>
            <div className="mt-1.5 flex justify-between gap-3 font-medium">
              <span className="text-[var(--color-ink)]">Your price</span>
              <span className="tabular-nums text-[var(--color-ink)]">
                {discounted && pricing.recurring.original !== pricing.recurring.discounted ? (
                  <>
                    <span className="mr-1.5 font-normal text-[var(--color-ink-muted)] line-through">
                      {formatUsd(pricing.recurring.original)}
                    </span>
                    {formatUsd(pricing.recurring.discounted)}
                  </>
                ) : (
                  formatUsd(pricing.recurring.discounted)
                )}
              </span>
            </div>
            <p className="mt-2 text-xs font-semibold text-emerald-800">
              Save {formatPlanUsd(planSavings)} ({tier.savingsPercent}%) ·{" "}
              {formatPlanUsd(tier.monthlyEquivalentUsd)}/mo equiv.
            </p>
          </div>
        )}

        {pricing.recurring && tier.savingsPercent === 0 && (
          <div className="flex justify-between gap-4 text-sm">
            <span className="text-[var(--color-ink-muted)]">{pricing.recurring.label}</span>
            <span className="tabular-nums font-medium text-[var(--color-ink)]">
              {formatUsd(pricing.recurring.discounted)}
            </span>
          </div>
        )}

        {discounted && (
          <p className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800">
            <BadgePercent className="h-3.5 w-3.5" aria-hidden />
            {discount?.code} · save {pricing.formattedSavings}
          </p>
        )}

        <div className="border-t border-black/[0.05] pt-4">
          <div className="flex items-end justify-between gap-4">
            <span className="text-sm font-semibold text-[var(--color-ink)]">Due today</span>
            <p
              className="text-3xl font-semibold tabular-nums tracking-tight text-[var(--color-ink)]"
              aria-live="polite"
              aria-atomic="true"
            >
              {formatUsd(pricing.primary.discounted)}
            </p>
          </div>
        </div>

        <p className="text-[0.6875rem] leading-relaxed text-[var(--color-ink-muted)]">
          {BILLING_POLICY_SHORT}
        </p>
      </div>
    </section>
  );
}
