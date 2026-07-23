"use client";

import Link from "next/link";
import { Crown, Sparkles } from "lucide-react";
import { TRIAL_DAYS } from "@/lib/billing-config";
import {
  dashboardUpgradePricingHref,
  POST_TRIAL_SUBSCRIBE_MESSAGE,
  PRO_DASHBOARD_UPGRADE_MESSAGE,
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
      return `${time} · ${remainingQuestions} question${remainingQuestions === 1 ? "" : "s"} left in your trial`;
    }
    return time;
  }

  return "Dashboard access only — study tools are locked";
}

function headline(variant: DashboardUpgradeProps["variant"]): string {
  switch (variant) {
    case "trial":
      return "Upgrade to Pro anytime — even before your trial ends.";
    case "free":
      return "Subscribe to continue studying";
  }
}

function eyebrow(variant: DashboardUpgradeProps["variant"]): string {
  switch (variant) {
    case "trial":
      return "Free trial";
    case "free":
      return "Trial ended";
  }
}

export function DashboardUpgradeBanner(props: DashboardUpgradeProps) {
  const { variant } = props;
  const pricingHref = dashboardUpgradePricingHref(variant);
  const isTrial = variant === "trial";

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-2xl border px-4 py-4 sm:px-5 sm:py-5",
        "border-[color-mix(in_srgb,var(--color-accent)_28%,transparent)]",
        "bg-[color-mix(in_srgb,var(--color-accent)_6%,var(--color-surface-elevated))]"
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 space-y-1.5">
          <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-accent)]">
            {isTrial ? (
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
            ) : (
              <Crown className="h-3.5 w-3.5" aria-hidden />
            )}
            {eyebrow(variant)}
          </p>
          <h2 className="text-base font-semibold leading-snug text-[var(--color-ink)] sm:text-lg">
            {headline(variant)}
          </h2>
          <p className="text-sm font-medium text-[var(--color-ink)]">{statusLine(props)}</p>
          <p className="max-w-xl text-sm leading-relaxed text-[var(--color-ink-muted)]">
            {isTrial ? PRO_DASHBOARD_UPGRADE_MESSAGE : POST_TRIAL_SUBSCRIBE_MESSAGE}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Link
            href={pricingHref}
            className="inline-flex items-center justify-center rounded-xl bg-[var(--color-accent)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
          >
            {isTrial ? "Upgrade Now" : "Go to checkout"}
          </Link>
        </div>
      </div>
    </section>
  );
}
