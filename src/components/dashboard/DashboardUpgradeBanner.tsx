"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock, Crown, Sparkles } from "lucide-react";
import { TRIAL_DAYS } from "@/lib/billing-config";
import { formatPlanUsd } from "@/lib/billing-plans";
import { TRIAL_UPGRADE_OFFER_PERCENT } from "@/lib/billing/trial-upgrade-offer";
import { PRO_MONTHLY_PRICE_USD } from "@/lib/pricing-defaults";
import { applyDiscount } from "@/lib/promo-pricing";
import {
  dashboardTrialEndOfferHref,
  dashboardUpgradePricingHref,
  formatOfferCountdown,
  type DashboardUpgradeContext,
} from "@/lib/dashboard/upgrade-banner";
import { cn } from "@/lib/utils";
import "./gift-offer-banner.css";

export type DashboardUpgradeProps = DashboardUpgradeContext;

/** Passed only for the post-trial 25% offer. Other banner states ignore it. */
export type DashboardTrialEndOfferView = {
  token: string;
  boardName: string;
  /** ISO end time. The chip counts this down in local minutes, never UTC. */
  expiresAt?: string | null;
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

function GiftBow() {
  return (
    <svg className="gift-offer__bow" viewBox="0 0 72 52" aria-hidden>
      <path d="M36 24c0 0-7-17-20-16-8 .6-12 8-9.5 13 2.4 5 13 7 29.5 3z" fill="var(--color-accent)" />
      <path d="M36 24c0 0 7-17 20-16 8 .6 12 8 9.5 13-2.4 5-13 7-29.5 3z" fill="var(--color-accent)" />
      <path
        d="M33.5 26c-1.5 6-7 15-13 19"
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <path
        d="M38.5 26c1.5 6 7 15 13 19"
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <ellipse cx="24" cy="16" rx="7" ry="2.6" fill="white" opacity="0.32" transform="rotate(-32 24 16)" />
      <ellipse cx="50" cy="15.5" rx="6" ry="2.2" fill="white" opacity="0.24" transform="rotate(28 50 15.5)" />
      <circle cx="36" cy="24" r="4.4" fill="var(--color-accent)" />
      <circle cx="34.8" cy="22.8" r="1.45" fill="#e7d3a1" />
    </svg>
  );
}

function OfferCountdown({ expiresAt }: { expiresAt: string }) {
  const [label, setLabel] = useState(() => formatOfferCountdown(expiresAt));

  useEffect(() => {
    const tick = () => setLabel(formatOfferCountdown(expiresAt));
    tick();
    const delay = 60_000 - (Date.now() % 60_000);
    let interval = 0;
    const timeout = window.setTimeout(() => {
      tick();
      interval = window.setInterval(tick, 60_000);
    }, delay);
    return () => {
      window.clearTimeout(timeout);
      window.clearInterval(interval);
    };
  }, [expiresAt]);

  if (!label) return null;

  return (
    <p className="gift-offer__chip" suppressHydrationWarning>
      <Clock className="h-3 w-3" strokeWidth={1.75} aria-hidden />
      {label}
    </p>
  );
}

function TrialEndGiftBanner({ offer }: { offer: DashboardTrialEndOfferView }) {
  const { original, first } = offerPrices();
  const href = dashboardTrialEndOfferHref(offer.token);
  const expiresAt = offer.expiresAt?.trim();

  return (
    <section className="gift-offer font-sans antialiased" aria-label="A gift for you">
      <span className="gift-offer__ribbon-x" aria-hidden />
      <span className="gift-offer__ribbon-y" aria-hidden />
      <GiftBow />
      <div className="gift-offer__layout">
        <div className="gift-offer__copy">
          <p className="gift-offer__eyebrow">
            <span className="gift-offer__gold" aria-hidden />
            A gift for you
          </p>
          <h2 className="gift-offer__title">
            <span className="gift-offer__title-accent">25% off</span> your first month
          </h2>
          <p className="gift-offer__body">
            Thanks for practicing {offer.boardName} with us. This gift is yours for the next 48
            hours.
          </p>
        </div>
        <aside className="gift-offer__tag">
          <span className="gift-offer__hole" aria-hidden />
          {expiresAt ? <OfferCountdown expiresAt={expiresAt} /> : null}
          <p className="gift-offer__price">
            <span className="sr-only">Regular price </span>
            <span className="gift-offer__was line-through">{original}</span>
            <span className="sr-only">Discounted first month </span>
            <span className="gift-offer__now">{first}</span>
            <span className="gift-offer__then">first month, then {original}/mo</span>
          </p>
          <Link href={href} className="gift-offer__cta">
            Claim your gift
            <ArrowRight aria-hidden />
          </Link>
        </aside>
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
