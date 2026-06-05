"use client";

import { BadgePercent } from "lucide-react";
import type { PromoPricing } from "@/lib/promo-pricing";
import { formatUsd, hasDiscount } from "@/lib/promo-pricing";
import type { DiscountValidation } from "@/lib/discount/types";

type CheckoutOrderSummaryProps = {
  pricing: PromoPricing;
  discount: DiscountValidation | null;
  planLabel: string;
};

export function CheckoutOrderSummary({
  pricing,
  discount,
  planLabel,
}: CheckoutOrderSummaryProps) {
  const discounted = discount?.valid && hasDiscount(pricing);

  return (
    <section
      className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm"
      aria-label="Order summary"
    >
      <div className="border-b border-slate-100 bg-slate-50/80 px-5 py-3.5">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Order summary
        </p>
        <p className="mt-0.5 text-sm font-medium text-slate-800">{planLabel}</p>
      </div>

      <div className="space-y-3 p-5">
        <div className="flex justify-between gap-4 text-sm">
          <span className="text-slate-600">{pricing.primary.label}</span>
          <span className="tabular-nums text-slate-800">
            {discounted && (
              <span className="mr-2 text-slate-400 line-through">
                {formatUsd(pricing.primary.original)}
              </span>
            )}
            {formatUsd(pricing.primary.discounted)}
          </span>
        </div>

        {pricing.recurring && (
          <div className="flex justify-between gap-4 text-sm">
            <span className="text-slate-600">{pricing.recurring.label}</span>
            <span className="tabular-nums font-medium text-slate-800">
              {discounted && (
                <span className="mr-2 font-normal text-slate-400 line-through">
                  {formatUsd(pricing.recurring.original)}
                </span>
              )}
              {formatUsd(pricing.recurring.discounted)}/mo
            </span>
          </div>
        )}

        {discounted && (
          <p className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800">
            <BadgePercent className="h-3.5 w-3.5" aria-hidden />
            {discount?.code} · save {pricing.formattedSavings}
          </p>
        )}

        <div className="border-t border-slate-100 pt-4">
          <div className="flex items-end justify-between gap-4">
            <span className="text-sm font-semibold text-slate-900">Total due today</span>
            <div className="text-right">
              {discounted && (
                <p className="text-sm text-slate-400 line-through tabular-nums">
                  {formatUsd(pricing.primary.original)}
                </p>
              )}
              <p
                className="text-2xl font-semibold tabular-nums tracking-tight text-slate-900 transition-all duration-300"
                aria-live="polite"
                aria-atomic="true"
              >
                {formatUsd(pricing.primary.discounted)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
