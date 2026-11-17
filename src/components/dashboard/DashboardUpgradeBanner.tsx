"use client";

import Link from "next/link";
import { Crown, Sparkles } from "lucide-react";
import { TRIAL_DAYS } from "@/lib/billing-config";
import { formatPlanUsd } from "@/lib/billing-plans";
import { PRO_MONTHLY_PRICE_USD } from "@/lib/pricing-defaults";
import {
  dashboardTrialEndOfferHref,
  dashboardUpgradePricingHref,
  type DashboardUpgradeContext,
} from "@/lib/dashboard/upgrade-banner";
import { cn } from "@/lib/utils";

export type DashboardUpgradeProps = DashboardUpgradeContext;

/** Passed only for the post-trial 25% offer. Other banner states ignore it. */
export type DashboardTrialEndOfferView = {
  token: string;
  boardName: string;
  /** Preformatted on the server so the client does not format a clock. */
  deadlineLabel?: string | null;
};

const BANNER_CLASS = cn(
  "flex flex-col gap-2.5 rounded-2xl border px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4",
  "border-[color-mix(in_srgb,var(--color-accent)_28%,transparent)]",
  "bg-[color-mix(in_srgb,var(--color-accent)_6%,var(--color-surface-elevated))]"
);

const BUTTON_CLASS =
  "inline-flex shrink-0 items-center justify-center rounded-xl bg-[var(--color-accent)] px-4 py-2 text-[13px] font-semibold text-white shadow-sm transition hover:opacity-95";

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

function offerBody(boardName: string): string {
  const monthly = formatPlanUsd(PRO_MONTHLY_PRICE_USD);
  return `Your ${boardName} trial has ended. As a thank-you for practicing, take 25% off your first payment if you upgrade in the next 48 hours. Then ${monthly}/mo.`;
}

export function DashboardUpgradeBanner({
  trialEndOffer = null,
  ...props
}: DashboardUpgradeProps & { trialEndOffer?: DashboardTrialEndOfferView | null }) {
  const { variant, daysRemaining } = props;
  const isTrial = variant === "trial";
  const offer =
    !isTrial && trialEndOffer?.token && trialEndOffer.boardName ? trialEndOffer : null;
  const pricingHref = offer
    ? dashboardTrialEndOfferHref(offer.token)
    : dashboardUpgradePricingHref(variant);
  const usedPct = isTrial ? trialProgressPct(daysRemaining) : null;
  const deadline = offer?.deadlineLabel?.trim();

  return (
    <section className={BANNER_CLASS}>
      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="flex items-center gap-2">
          {isTrial ? (
            <Sparkles className="h-4 w-4 shrink-0 text-[var(--color-accent)]" aria-hidden />
          ) : (
            <Crown className="h-4 w-4 shrink-0 text-[var(--color-accent)]" aria-hidden />
          )}
          <p className="text-[13px] font-medium text-[var(--color-ink)]">
            {offer ? "25% off your first payment" : statusLine(props)}
          </p>
        </div>
        {offer ? (
          <p className="text-[13px] leading-snug text-[var(--color-ink-muted)]">
            {offerBody(offer.boardName)}
            {deadline ? ` Ends ${deadline}.` : ""}
          </p>
        ) : null}
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
      <Link href={pricingHref} className={BUTTON_CLASS}>
        {offer ? "Claim 25% off" : isTrial ? "Upgrade" : "Subscribe"}
      </Link>
    </section>
  );
}
