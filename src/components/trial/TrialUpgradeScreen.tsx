import Link from "next/link";
import { TRIAL_DAYS, TRIAL_LIFETIME_QUESTIONS } from "@/lib/billing-config";
import { CANCEL_ANYTIME_LABEL } from "@/lib/billing-plans";
import { trialUpgradeKeepFeatures } from "@/lib/trial/upgrade-features";
import { trialUpgradeCheckoutHref } from "@/lib/dashboard/upgrade-banner";
import { boardAccentPillClass } from "@/lib/marketing/board-accent";
import { formatPlanUsd } from "@/lib/billing-plans";
import {
  formatOfferDeadline,
  TRIAL_UPGRADE_OFFER_PERCENT,
  type TrialUpgradeOfferView,
} from "@/lib/billing/trial-upgrade-offer";
import { applyDiscount } from "@/lib/promo-pricing";
import { PRO_MONTHLY_PRICE_USD } from "@/lib/pricing-defaults";
import type { ConsentedTestimonialSeed } from "@/lib/testimonials/consented-seed";
import type { ExamSlug } from "@/types/edtech";
import { cn } from "@/lib/utils";

export type { TrialUpgradeOfferView };

export function TrialUpgradeScreen({
  examSlug,
  boardName,
  questionsAnswered,
  accuracyPct,
  testimonial,
  returnPath = "/dashboard",
  capReached = false,
  offer = null,
}: {
  examSlug: ExamSlug;
  boardName: string;
  questionsAnswered: number;
  accuracyPct: number;
  testimonial: ConsentedTestimonialSeed | null;
  returnPath?: string;
  /** Trial user is already at the question cap. */
  capReached?: boolean;
  /** Support-issued 48-hour offer. Null when the page was opened without one. */
  offer?: TrialUpgradeOfferView | null;
}) {
  const monthly = formatPlanUsd(PRO_MONTHLY_PRICE_USD);
  const offerValid = offer?.status === "valid" && Boolean(offer.token);
  const firstMonth = formatPlanUsd(applyDiscount(PRO_MONTHLY_PRICE_USD, TRIAL_UPGRADE_OFFER_PERCENT));
  const checkoutHref = offerValid
    ? `${trialUpgradeCheckoutHref(returnPath)}&offer=${encodeURIComponent(offer!.token!)}`
    : trialUpgradeCheckoutHref(returnPath);
  const pillClass = boardAccentPillClass(examSlug);
  const features = trialUpgradeKeepFeatures(examSlug);
  const offerNotice = offer && !offerValid ? offer.message : null;
  const offerDeadline =
    offerValid && offer?.expiresAt ? formatOfferDeadline(new Date(offer.expiresAt)) : null;

  return (
    <div className="mx-auto w-full max-w-lg space-y-6 py-4 sm:py-8">
      {offerNotice ? (
        <p className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-center text-sm leading-snug text-[var(--color-ink-muted)]">
          {offerNotice}
        </p>
      ) : null}
      <header className="space-y-2 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-accent)]">
          {boardName}
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-3xl">
          {offerValid ? (
            <>
              Keep studying —{" "}
              <span className="text-lg font-normal text-[var(--color-ink-muted)] line-through">
                {monthly}
              </span>{" "}
              {firstMonth}
              <span className="text-lg font-medium text-[var(--color-ink-muted)]"> first month</span>
            </>
          ) : (
            <>Keep studying for {monthly}/mo</>
          )}
        </h1>
        <p className="text-sm text-[var(--color-ink-muted)]">{CANCEL_ANYTIME_LABEL}</p>
        {offerValid ? (
          <p className="text-sm text-[var(--color-ink-muted)]">
            {TRIAL_UPGRADE_OFFER_PERCENT}% off your first payment on any plan. Then {monthly}/mo.
            {offerDeadline ? ` Ends ${offerDeadline}.` : ""}
          </p>
        ) : null}
        {capReached ? (
          <p className="text-sm text-[var(--color-ink-muted)]">
            Your {TRIAL_DAYS}-day trial includes {TRIAL_LIFETIME_QUESTIONS} practice questions.
          </p>
        ) : null}
      </header>

      {questionsAnswered > 0 ? (
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-4 text-center">
          <p className="text-sm font-semibold text-[var(--color-ink)]">Your progress so far</p>
          <p className="mt-2 text-2xl font-semibold tabular-nums text-[var(--color-ink)]">
            {questionsAnswered}{" "}
            <span className="text-base font-medium text-[var(--color-ink-muted)]">
              questions · {accuracyPct}% accuracy
            </span>
          </p>
          <p className="mt-2 text-[13px] leading-snug text-[var(--color-ink-muted)]">
            Subscribe to keep your history, streaks, and readiness on {boardName} — no reset.
          </p>
        </div>
      ) : null}

      <ul className="space-y-2.5 text-[14px] text-[var(--color-ink)]" role="list">
        {features.map((line) => (
          <li key={line} className="flex gap-2 leading-snug">
            <span className="text-[var(--color-accent)]" aria-hidden>✓</span>
            <span>{line}</span>
          </li>
        ))}
      </ul>

      {testimonial ? (
        <figure className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-4 py-4 text-left">
          <blockquote className="text-[14px] leading-relaxed text-[var(--color-ink)]">
            &ldquo;{testimonial.quote}&rdquo;
          </blockquote>
          <figcaption className="mt-2 text-[12px] font-medium text-[var(--color-ink-muted)]">
            {testimonial.name} · {testimonial.exam}
          </figcaption>
        </figure>
      ) : null}

      <div className="flex flex-col items-stretch gap-3 pt-2">
        <Link
          href={checkoutHref}
          className={cn(
            pillClass,
            "!min-h-12 w-full rounded-full text-[15px] font-bold text-white shadow-sm"
          )}
        >
          {offerValid ? `Continue to checkout — ${firstMonth} first month` : `Continue to checkout — ${monthly}/mo`}
        </Link>
        <Link
          href={returnPath}
          className="text-center text-[13px] font-medium text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
