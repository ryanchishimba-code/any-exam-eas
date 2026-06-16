"use client";

import { Crown, Sparkles } from "lucide-react";
import { TIER_DEFINITIONS, TIER_MONTHLY_USD, type SubscriptionTier } from "@/lib/subscription-tiers";
import { formatPlanUsd } from "@/lib/billing-plans";
import { cn } from "@/lib/utils";

type CheckoutTierSelectorProps = {
  value: SubscriptionTier;
  onChange: (tier: SubscriptionTier) => void;
};

export function CheckoutTierSelector({ value, onChange }: CheckoutTierSelectorProps) {
  return (
    <fieldset className="space-y-3">
      <legend className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
        Plan tier
      </legend>
      <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Plan tier">
        {(["basic", "pro"] as SubscriptionTier[]).map((tier) => {
          const def = TIER_DEFINITIONS[tier];
          const selected = value === tier;
          return (
            <button
              key={tier}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(tier)}
              className={cn(
                "relative rounded-2xl border px-4 py-4 text-left transition-all",
                selected
                  ? "border-[var(--color-accent)] bg-[var(--color-accent)]/[0.04] ring-2 ring-[var(--color-accent)]/20"
                  : "border-black/[0.08] bg-white hover:border-black/[0.12]"
              )}
            >
              {tier === "pro" && (
                <span className="absolute -top-2.5 right-3 inline-flex items-center gap-1 rounded-full bg-[var(--color-accent)] px-2 py-0.5 text-[0.625rem] font-bold uppercase text-white">
                  <Crown className="h-3 w-3" aria-hidden />
                  Popular
                </span>
              )}
              <span className="flex items-center gap-1.5 text-sm font-semibold text-[var(--color-ink)]">
                {def.name}
                {tier === "pro" && <Sparkles className="h-3.5 w-3.5 text-[var(--color-accent)]" aria-hidden />}
              </span>
              <span className="mt-1 block text-xs text-[var(--color-ink-muted)]">
                from {formatPlanUsd(TIER_MONTHLY_USD[tier])}/mo
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
