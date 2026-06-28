import Link from "next/link";
import { Crown, Sparkles } from "lucide-react";
import { TRIAL_DAYS } from "@/lib/billing-config";
import {
  dashboardUpgradePricingHref,
  PRO_DASHBOARD_UPGRADE_MESSAGE,
  type DashboardUpgradeContext,
} from "@/lib/dashboard/upgrade-banner";
import { ROUTES } from "@/lib/routes";
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

  if (variant === "free") {
    if (remainingQuestions != null) {
      return `${remainingQuestions} question${remainingQuestions === 1 ? "" : "s"} left on Free plan`;
    }
    return "You're on the Free plan";
  }

  return "You're on the Basic plan";
}

function headline(variant: DashboardUpgradeProps["variant"]): string {
  switch (variant) {
    case "trial":
      return "You're doing great — keep the momentum going.";
    case "free":
      return "Your trial has ended — you can still practice.";
    case "basic":
      return "You're on Basic — Pro unlocks the full toolkit.";
  }
}

function eyebrow(variant: DashboardUpgradeProps["variant"]): string {
  switch (variant) {
    case "trial":
      return "Free trial";
    case "free":
      return "Upgrade to continue";
    case "basic":
      return "Upgrade to Pro";
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
            {PRO_DASHBOARD_UPGRADE_MESSAGE}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Link
            href={pricingHref}
            className="inline-flex items-center justify-center rounded-xl bg-[var(--color-accent)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
          >
            Upgrade Now
          </Link>
          {variant === "free" ? (
            <Link
              href={ROUTES.questionBank}
              className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white/80 px-4 py-2.5 text-sm font-medium text-[var(--color-ink)] transition hover:bg-white"
            >
              Practice
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
