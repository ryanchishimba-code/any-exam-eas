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
  const totalCap = usage.limits.trialLifetimeQuestions;

  if (variant === "trial") {
    const time = formatTimeLeft(daysRemaining);
    if (remainingQuestions != null && totalCap != null) {
      return `${time} · ${remainingQuestions} question${remainingQuestions === 1 ? "" : "s"} left`;
    }
    return time;
  }

  return "Study tools locked — subscribe to continue";
}

export function DashboardUpgradeBanner(props: DashboardUpgradeProps) {
  const { variant } = props;
  const pricingHref = dashboardUpgradePricingHref(variant);
  const isTrial = variant === "trial";

  return (
    <section
      className={cn(
        "flex flex-col gap-3 rounded-2xl border px-4 py-3 sm:flex-row sm:items-center sm:justify-between",
        "border-[color-mix(in_srgb,var(--color-accent)_28%,transparent)]",
        "bg-[color-mix(in_srgb,var(--color-accent)_6%,var(--color-surface-elevated))]"
      )}
    >
      <div className="min-w-0 flex items-start gap-2 sm:items-center">
        {isTrial ? (
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-accent)] sm:mt-0" aria-hidden />
        ) : (
          <Crown className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-accent)] sm:mt-0" aria-hidden />
        )}
        <p className="text-[13px] font-medium text-[var(--color-ink)]">{statusLine(props)}</p>
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
