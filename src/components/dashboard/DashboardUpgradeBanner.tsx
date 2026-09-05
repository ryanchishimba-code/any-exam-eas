"use client";

import Link from "next/link";
import { Crown, Sparkles } from "lucide-react";
import { TRIAL_DAYS } from "@/lib/billing-config";
import {
  dashboardUpgradePricingHref,
  type DashboardUpgradeContext,
} from "@/lib/dashboard/upgrade-banner";
import { cn } from "@/lib/utils";

export type DashboardUpgradeProps = DashboardUpgradeContext;

function formatTimeLeft(days: number | null): string {
  if (days == null) return `${TRIAL_DAYS}-day trial`;
  if (days <= 0) return "Trial ended";
  if (days === 1) return "1 day left";
  return `${days} days left`;
}

function statusLine({ variant, daysRemaining, usage }: DashboardUpgradeProps): string {
  const remainingQuestions = usage.remainingTrialTotal;

  if (variant === "trial") {
    const time = formatTimeLeft(daysRemaining);
    if (remainingQuestions != null) {
      return `${time} · ${remainingQuestions} Q left`;
    }
    return time;
  }

  return "Subscribe to unlock study tools";
}

function trialProgressPct(daysRemaining: number | null): number | null {
  if (daysRemaining == null) return null;
  if (daysRemaining <= 0) return 100;
  return Math.min(100, Math.max(0, Math.round(((TRIAL_DAYS - daysRemaining) / TRIAL_DAYS) * 100)));
}

export function DashboardUpgradeBanner(props: DashboardUpgradeProps) {
  const { variant, daysRemaining } = props;
  const pricingHref = dashboardUpgradePricingHref(variant);
  const isTrial = variant === "trial";
  const usedPct = isTrial ? trialProgressPct(daysRemaining) : null;

  return (
    <section
      className={cn(
        "flex flex-col gap-2.5 rounded-2xl border px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4",
        "border-[color-mix(in_srgb,var(--color-accent)_28%,transparent)]",
        "bg-[color-mix(in_srgb,var(--color-accent)_6%,var(--color-surface-elevated))]"
      )}
    >
      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="flex items-center gap-2">
          {isTrial ? (
            <Sparkles className="h-4 w-4 shrink-0 text-[var(--color-accent)]" aria-hidden />
          ) : (
            <Crown className="h-4 w-4 shrink-0 text-[var(--color-accent)]" aria-hidden />
          )}
          <p className="text-[13px] font-medium text-[var(--color-ink)]">{statusLine(props)}</p>
        </div>
        {usedPct != null ? (
          <div
            className="h-1 overflow-hidden rounded-full bg-[var(--color-border)]/60"
            role="meter"
            aria-valuenow={usedPct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Trial ${usedPct}% elapsed`}
          >
            <div
              className="h-full rounded-full bg-[var(--color-accent)] transition-[width] duration-500"
              style={{ width: `${Math.max(4, usedPct)}%` }}
            />
          </div>
        ) : null}
      </div>
      <Link
        href={pricingHref}
        className="inline-flex shrink-0 items-center justify-center rounded-xl bg-[var(--color-accent)] px-4 py-2 text-[13px] font-semibold text-white shadow-sm transition hover:opacity-95"
      >
        {isTrial ? "Upgrade" : "Subscribe"}
      </Link>
    </section>
  );
}
