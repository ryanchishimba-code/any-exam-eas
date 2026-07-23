"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { BillingInterval } from "@/lib/billing-config";
import { formatPlanUsd, getBillingPlanTier } from "@/lib/billing-plans";
import type { SubscriptionTier } from "@/lib/subscription-tiers";
import { cn } from "@/lib/utils";

type UpgradeIntervalChoiceProps = {
  value: BillingInterval;
  onChange: (interval: BillingInterval) => void;
  tier?: SubscriptionTier;
  className?: string;
};

const PRIMARY: BillingInterval[] = ["yearly", "monthly"];
const MORE: BillingInterval[] = ["semiannual", "quarterly"];

function priceLine(tier: SubscriptionTier, interval: BillingInterval): string {
  const plan = getBillingPlanTier(tier, interval);
  if (interval === "monthly") {
    return `${formatPlanUsd(plan.totalUsd)}/mo`;
  }
  return `${formatPlanUsd(plan.totalUsd)} · ≈ ${formatPlanUsd(plan.monthlyEquivalentUsd)}/mo`;
}

/** Calm monthly/yearly choice for upgrade checkout — other intervals stay collapsed. */
export function UpgradeIntervalChoice({
  value,
  onChange,
  tier = "pro",
  className,
}: UpgradeIntervalChoiceProps) {
  const groupId = useId();
  const inMore = MORE.includes(value);
  const [showMore, setShowMore] = useState(inMore);

  return (
    <fieldset className={cn("space-y-3", className)}>
      <legend className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
        Billing cycle
      </legend>

      <div
        className="grid gap-2 sm:grid-cols-2"
        role="radiogroup"
        aria-label="Billing cycle"
      >
        {PRIMARY.map((interval) => {
          const plan = getBillingPlanTier(tier, interval);
          const selected = value === interval;
          return (
            <button
              key={interval}
              id={`${groupId}-${interval}`}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(interval)}
              className={cn(
                "rounded-2xl border px-4 py-3.5 text-left transition",
                selected
                  ? "border-[var(--color-accent)] bg-[var(--color-accent)]/[0.06] ring-2 ring-[var(--color-accent)]/15"
                  : "border-black/[0.08] bg-white hover:border-black/[0.12]"
              )}
            >
              <span className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-[var(--color-ink)]">{plan.label}</span>
                {plan.recommended && (
                  <span className="rounded-full bg-[var(--color-accent)] px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-wide text-white">
                    Best value
                  </span>
                )}
                {plan.savingsBadge && (
                  <span className="text-[0.6875rem] font-semibold text-emerald-700">
                    {plan.savingsBadge}
                  </span>
                )}
              </span>
              <span className="mt-1 block text-xs text-[var(--color-ink-muted)]">
                {priceLine(tier, interval)}
              </span>
            </button>
          );
        })}
      </div>

      <div>
        <button
          type="button"
          onClick={() => setShowMore((v) => !v)}
          className="flex items-center gap-1 text-xs font-medium text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
          aria-expanded={showMore}
        >
          Other billing options
          <ChevronDown
            className={cn("h-3.5 w-3.5 transition-transform", showMore && "rotate-180")}
            aria-hidden
          />
        </button>

        {showMore && (
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {MORE.map((interval) => {
              const plan = getBillingPlanTier(tier, interval);
              const selected = value === interval;
              return (
                <button
                  key={interval}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => onChange(interval)}
                  className={cn(
                    "rounded-xl border px-3 py-2.5 text-left text-sm transition",
                    selected
                      ? "border-[var(--color-accent)] bg-[var(--color-accent)]/[0.06]"
                      : "border-black/[0.06] bg-white hover:border-black/[0.1]"
                  )}
                >
                  <span className="font-medium text-[var(--color-ink)]">{plan.label}</span>
                  <span className="mt-0.5 block text-xs text-[var(--color-ink-muted)]">
                    {priceLine(tier, interval)}
                    {plan.savingsBadge ? ` · ${plan.savingsBadge}` : ""}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </fieldset>
  );
}
