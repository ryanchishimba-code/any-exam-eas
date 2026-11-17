"use client";

import Link from "next/link";
import { ArrowRight, Crown, Gift, Sparkles } from "lucide-react";
import { TRIAL_DAYS } from "@/lib/billing-config";
import { formatPlanUsd } from "@/lib/billing-plans";
import { TRIAL_UPGRADE_OFFER_PERCENT } from "@/lib/billing/trial-upgrade-offer";
import { PRO_MONTHLY_PRICE_USD } from "@/lib/pricing-defaults";
import { applyDiscount } from "@/lib/promo-pricing";
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

function offerPrices(): { original: string; first: string } {
  return {
    original: formatPlanUsd(PRO_MONTHLY_PRICE_USD),
    first: formatPlanUsd(applyDiscount(PRO_MONTHLY_PRICE_USD, TRIAL_UPGRADE_OFFER_PERCENT)),
  };
}

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

function TrialEndGiftBanner({
  offer,
}: {
  offer: DashboardTrialEndOfferView;
}) {
  const { original, first } = offerPrices();
  const deadline = offer.deadlineLabel?.trim();
  const href = dashboardTrialEndOfferHref(offer.token);

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-2xl border",
        "border-[color-mix(in_srgb,var(--color-accent)_34%,transparent)]",
        "bg-[linear-gradient(165deg,color-mix(in_srgb,var(--color-accent)_11%,var(--color-surface-elevated)),var(--color-surface-elevated)_46%,color-mix(in_srgb,var(--color-accent)_6%,var(--color-surface-elevated)))]",
        "shadow-[var(--shadow-apple-md)] ring-1 ring-[color-mix(in_srgb,var(--color-accent)_16%,transparent)]"
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-2 bg-[linear-gradient(180deg,color-mix(in_srgb,white_42%,var(--color-accent)),var(--color-accent)_46%,color-mix(in_srgb,black_14%,var(--color-accent)))]"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-2 left-[3px] w-px bg-white/45 dark:bg-white/25"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_80%_at_100%_0%,color-mix(in_srgb,var(--color-accent)_18%,transparent),transparent_58%)]"
      />
      <div className="relative flex flex-col gap-5 py-5 pr-5 pl-7 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:py-6 sm:pr-6 sm:pl-8">
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-accent)]">
              <Gift className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
              A gift for you
            </p>
            {deadline ? (
              <p className="inline-flex items-center rounded-full border border-[color-mix(in_srgb,var(--color-accent)_28%,transparent)] bg-[color-mix(in_srgb,var(--color-surface-elevated)_72%,transparent)] px-2.5 py-0.5 text-[11px] font-medium tabular-nums tracking-wide text-[var(--color-ink-muted)]">
                Ends {deadline}
              </p>
            ) : null}
          </div>
          <div className="space-y-1">
            <p className="text-[1.75rem] font-semibold leading-none tracking-tight text-[var(--color-accent)] tabular-nums">
              25% off
            </p>
            <p className="text-[15px] font-medium text-[var(--color-ink)]">your first payment</p>
          </div>
          <p className="max-w-xl text-[13px] leading-relaxed text-[var(--color-ink-muted)]">
            Your {offer.boardName} trial has ended. As a thank-you for practicing, take 25% off
            your first payment if you upgrade in the next 48 hours.
          </p>
          <p className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
            <span className="sr-only">Regular price </span>
            <span className="text-[13px] tabular-nums text-[var(--color-ink-muted)] line-through decoration-[color-mix(in_srgb,var(--color-ink-muted)_45%,transparent)]">
              {original}
            </span>
            <span className="sr-only">Discounted first payment </span>
            <span className="text-[1.35rem] font-semibold leading-none tabular-nums text-[var(--color-ink)]">
              {first}
            </span>
            <span className="text-[12px] text-[var(--color-ink-muted)]">
              first payment · Then {original}/mo.
            </span>
          </p>
        </div>
        <Link
          href={href}
          className={cn(
            "group inline-flex w-full shrink-0 items-center justify-center gap-1.5 rounded-xl",
            "bg-[var(--color-accent)] px-5 py-2.5 text-[13px] font-semibold text-white dark:text-[#071a2c]",
            "shadow-[var(--shadow-apple-btn)] transition-[transform,box-shadow] duration-200",
            "hover:-translate-y-px hover:shadow-[var(--shadow-apple-btn-hover)]",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]",
            "sm:w-auto"
          )}
        >
          Unwrap 25% off
          <ArrowRight
            className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
            aria-hidden
          />
        </Link>
      </div>
    </section>
  );
}

export function DashboardUpgradeBanner({
  trialEndOffer = null,
  ...props
}: DashboardUpgradeProps & { trialEndOffer?: DashboardTrialEndOfferView | null }) {
  const { variant, daysRemaining } = props;
  const isTrial = variant === "trial";
  const offer =
    !isTrial && trialEndOffer?.token && trialEndOffer.boardName ? trialEndOffer : null;
  if (offer) return <TrialEndGiftBanner offer={offer} />;

  const pricingHref = dashboardUpgradePricingHref(variant);
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
