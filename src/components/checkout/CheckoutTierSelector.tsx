"use client";

import { Crown } from "lucide-react";
import { TIER_DEFINITIONS, TIER_MONTHLY_USD, type SubscriptionTier } from "@/lib/subscription-tiers";
import { formatPlanUsd } from "@/lib/billing-plans";

type CheckoutTierSelectorProps = {
  value: SubscriptionTier;
  onChange: (tier: SubscriptionTier) => void;
};

/** Pro is the only paid plan — display confirmation, no tier picker. */
export function CheckoutTierSelector({ value }: CheckoutTierSelectorProps) {
  const def = TIER_DEFINITIONS.pro;
  return (
    <div className="rounded-2xl border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/[0.04] px-4 py-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
        Your plan
      </p>
      <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-[var(--color-ink)]">
        <Crown className="h-4 w-4 text-[var(--color-accent)]" aria-hidden />
        {def.name}
      </p>
      <p className="mt-1 text-xs text-[var(--color-ink-muted)]">
        {def.tagline} · from {formatPlanUsd(TIER_MONTHLY_USD.pro)}/mo
      </p>
      {value !== "pro" ? null : null}
    </div>
  );
}
