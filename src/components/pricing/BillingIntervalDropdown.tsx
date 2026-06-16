"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, Sparkles } from "lucide-react";
import type { BillingInterval } from "@/lib/billing-config";
import {
  formatPlanUsd,
  getBillingPlanTier,
  getBillingPlanTiersForTier,
  intervalListPriceUsd,
  intervalSavingsUsd,
} from "@/lib/billing-plans";
import type { SubscriptionTier } from "@/lib/subscription-tiers";
import { SavingsBreakdownCard } from "@/components/pricing/SavingsBreakdownCard";
import { cn } from "@/lib/utils";

type BillingIntervalDropdownProps = {
  value: BillingInterval;
  onChange: (interval: BillingInterval) => void;
  tier?: SubscriptionTier;
  variant?: "pricing" | "checkout";
  className?: string;
};

function optionLabel(tier: SubscriptionTier, interval: BillingInterval): string {
  const plan = getBillingPlanTier(tier, interval);
  if (plan.savingsPercent === 0) {
    return `${plan.label} — ${formatPlanUsd(plan.totalUsd)}/mo`;
  }
  return `${plan.label} — Save ${plan.savingsPercent}%`;
}

function optionSubline(tier: SubscriptionTier, interval: BillingInterval): string {
  const plan = getBillingPlanTier(tier, interval);
  const list = intervalListPriceUsd(tier, interval);
  if (plan.savingsPercent === 0) {
    return "Flexible · cancel anytime";
  }
  return `${formatPlanUsd(plan.totalUsd)} (was ${formatPlanUsd(list)})`;
}

export function BillingIntervalDropdown({
  value,
  onChange,
  tier = "pro",
  variant = "pricing",
  className,
}: BillingIntervalDropdownProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();
  const plan = getBillingPlanTier(tier, value);
  const tierPlans = getBillingPlanTiersForTier(tier);

  useEffect(() => {
    function onPointerDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onEscape);
    };
  }, []);

  return (
    <div ref={rootRef} className={cn("w-full space-y-4", className)}>
      <div className="relative">
        <label
          htmlFor={`${listboxId}-trigger`}
          className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]"
        >
          Billing cycle
        </label>

        <button
          id={`${listboxId}-trigger`}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listboxId}
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "flex w-full items-center justify-between gap-3 rounded-2xl border border-black/[0.08] bg-white px-4 py-3.5 text-left shadow-[var(--shadow-apple-sm)] transition hover:border-black/[0.12]",
            open && "border-[var(--color-accent)] ring-2 ring-[var(--color-accent)]/15"
          )}
        >
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-[var(--color-ink)]">
                {optionLabel(tier, value)}
              </span>
              {plan.recommended && (
                <span className="rounded-full bg-[var(--color-accent)] px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-wide text-white">
                  Best value
                </span>
              )}
              {plan.savingsBadge && (
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[0.625rem] font-semibold text-emerald-800">
                  {plan.savingsBadge}
                </span>
              )}
            </div>
            <p className="mt-0.5 text-xs text-[var(--color-ink-muted)]">{optionSubline(tier, value)}</p>
          </div>
          <ChevronDown
            className={cn(
              "h-5 w-5 shrink-0 text-[var(--color-ink-muted)] transition-transform duration-200",
              open && "rotate-180"
            )}
            aria-hidden
          />
        </button>

        {open && (
          <ul
            id={listboxId}
            role="listbox"
            aria-label="Billing cycle options"
            className="absolute z-20 mt-2 max-h-[min(20rem,70vh)] w-full overflow-auto rounded-2xl border border-black/[0.08] bg-white py-1 shadow-[var(--shadow-apple-md)]"
          >
            {tierPlans.map((t) => {
              const selected = value === t.interval;
              const savings = intervalSavingsUsd(tier, t.interval);
              return (
                <li key={t.interval} role="option" aria-selected={selected}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(t.interval);
                      setOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-start justify-between gap-3 px-4 py-3 text-left transition hover:bg-slate-50",
                      selected && "bg-[var(--color-accent)]/[0.06]"
                    )}
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-sm font-semibold text-[var(--color-ink)]">
                          {t.label}
                        </span>
                        {t.recommended && (
                          <Sparkles className="h-3.5 w-3.5 text-[var(--color-accent)]" aria-hidden />
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-[var(--color-ink-muted)]">
                        {t.savingsPercent > 0 ? (
                          <>
                            <span className="text-[var(--color-ink-muted)] line-through">
                              {formatPlanUsd(intervalListPriceUsd(tier, t.interval))}
                            </span>
                            {" → "}
                            <span className="font-medium text-[var(--color-ink)]">
                              {formatPlanUsd(t.totalUsd)}
                            </span>
                          </>
                        ) : (
                          `${formatPlanUsd(t.totalUsd)}/month`
                        )}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      {t.savingsPercent > 0 ? (
                        <>
                          <p className="text-xs font-bold text-emerald-700">−{t.savingsPercent}%</p>
                          <p className="text-[0.625rem] font-medium text-emerald-600">
                            Save {formatPlanUsd(savings)}
                          </p>
                        </>
                      ) : (
                        <p className="text-xs text-[var(--color-ink-muted)]">Flexible</p>
                      )}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <SavingsBreakdownCard tier={tier} interval={value} variant={variant} />
    </div>
  );
}
