import Link from "next/link";
import { TRIAL_DAYS, TRIAL_LIFETIME_QUESTIONS } from "@/lib/billing-config";
import { CANCEL_ANYTIME_LABEL } from "@/lib/billing-plans";
import { trialUpgradeKeepFeatures } from "@/lib/trial/upgrade-features";
import { trialUpgradeCheckoutHref } from "@/lib/dashboard/upgrade-banner";
import { boardAccentPillClass } from "@/lib/marketing/board-accent";
import { formatPlanUsd } from "@/lib/billing-plans";
import { PRO_MONTHLY_PRICE_USD } from "@/lib/pricing-defaults";
import type { ConsentedTestimonialSeed } from "@/lib/testimonials/consented-seed";
import type { ExamSlug } from "@/types/edtech";
import { cn } from "@/lib/utils";

export function TrialUpgradeScreen({
  examSlug,
  boardName,
  questionsAnswered,
  accuracyPct,
  testimonial,
  returnPath = "/dashboard",
  capReached = false,
}: {
  examSlug: ExamSlug;
  boardName: string;
  questionsAnswered: number;
  accuracyPct: number;
  testimonial: ConsentedTestimonialSeed | null;
  returnPath?: string;
  /** Trial user is already at the question cap. */
  capReached?: boolean;
}) {
  const monthly = formatPlanUsd(PRO_MONTHLY_PRICE_USD);
  const checkoutHref = trialUpgradeCheckoutHref(returnPath);
  const pillClass = boardAccentPillClass(examSlug);
  const features = trialUpgradeKeepFeatures(examSlug);

  return (
    <div className="mx-auto w-full max-w-lg space-y-6 py-4 sm:py-8">
      <header className="space-y-2 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-accent)]">
          {boardName}
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-3xl">
          Keep studying for {monthly}/mo
        </h1>
        <p className="text-sm text-[var(--color-ink-muted)]">{CANCEL_ANYTIME_LABEL}</p>
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
          Continue to checkout — {monthly}/mo
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
