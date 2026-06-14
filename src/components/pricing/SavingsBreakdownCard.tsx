"use client";

import { Check, TrendingDown } from "lucide-react";
import type { BillingInterval } from "@/lib/billing-config";
import { MONTHLY_PRICE_USD } from "@/lib/billing-config";
import {
  formatPlanUsd,
  getBillingPlanTier,
  intervalListPriceUsd,
  intervalSavingsUsd,
} from "@/lib/billing-plans";
import { cn } from "@/lib/utils";

type SavingsBreakdownCardProps = {
  interval: BillingInterval;
  className?: string;
  /** checkout = compact inline; pricing = hero emphasis */
  variant?: "pricing" | "checkout";
};

export function SavingsBreakdownCard({
  interval,
  className,
  variant = "pricing",
}: SavingsBreakdownCardProps) {
  const tier = getBillingPlanTier(interval);
  const listPrice = intervalListPriceUsd(interval);
  const yourPrice = tier.totalUsd;
  const savings = intervalSavingsUsd(interval);
  const isPricing = variant === "pricing";

  if (tier.savingsPercent === 0) {
    return (
      <div
        className={cn(
          "rounded-2xl border border-black/[0.06] bg-slate-50/50 px-4 py-4",
          className
        )}
      >
        <p className="text-sm text-[var(--color-ink-muted)]">
          Pay as you go — {formatPlanUsd(MONTHLY_PRICE_USD)}/month, cancel anytime.
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-emerald-200/60 bg-gradient-to-b from-emerald-50/80 to-white",
        isPricing ? "shadow-[var(--shadow-apple-sm)]" : "",
        className
      )}
    >
      <div className="flex items-center gap-2 border-b border-emerald-100/80 px-4 py-3">
        <TrendingDown className="h-4 w-4 text-emerald-700" strokeWidth={2.5} aria-hidden />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-emerald-900">
            You save {formatPlanUsd(savings)} ({tier.savingsPercent}% off)
          </p>
          {isPricing && (
            <p className="mt-0.5 text-xs text-emerald-800">
              {formatPlanUsd(tier.monthlyEquivalentUsd)}/mo — less than most single-exam apps
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2.5 px-4 py-4">
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="text-[var(--color-ink-muted)]">
            List price
            <span className="ml-1 hidden sm:inline">(paying monthly)</span>
          </span>
          <span className="tabular-nums text-[var(--color-ink-muted)] line-through">
            {formatPlanUsd(listPrice)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-medium text-[var(--color-ink)]">Your price</span>
          <span
            className={cn(
              "font-semibold tabular-nums tracking-tight text-[var(--color-ink)]",
              isPricing ? "text-2xl" : "text-lg"
            )}
          >
            {formatPlanUsd(yourPrice)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-emerald-100/80 pt-2.5 text-sm">
          <span className="font-medium text-emerald-800">
            {formatPlanUsd(tier.monthlyEquivalentUsd)}/mo equivalent
          </span>
          <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
            <Check className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
            Locked in
          </span>
        </div>
      </div>

      <p className="border-t border-emerald-100/80 px-4 py-3 text-xs leading-relaxed text-emerald-900/80">
        {tier.recommended
          ? "Most students choose Yearly — locked-in rate, best value vs $99+ per-exam apps."
          : "Longer plans save more — stay subscribed to keep your rate."}
      </p>
    </div>
  );
}
