import { ArrowRight } from "lucide-react";
import { formatTrialCtaLabel } from "@/lib/site";
import {
  LANDING_HERO_HEADLINE,
  LANDING_HERO_HEADLINE_ACCENT,
  LANDING_TRIAL_HREF,
} from "@/lib/landing/content";
import type { LandingBankCountsDisplay } from "@/lib/marketing/question-bank-counts";

/** Lightweight hero shell shown while the flagship landing bundle loads client-side. */
export function LandingHeroSkeleton({ bankCounts }: { bankCounts: LandingBankCountsDisplay }) {
  return (
    <section
      className="aee-flagship-hero relative overflow-hidden bg-[var(--color-bg)] pb-16 pt-28 sm:pb-24 sm:pt-32"
      aria-labelledby="hero-heading"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[460px] bg-[radial-gradient(60%_60%_at_50%_0%,color-mix(in_srgb,var(--color-accent)_16%,transparent),transparent)]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-3xl px-5 text-center sm:px-6">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-accent)]">
          NCLEX · USMLE · NAPLEX · PANCE · FNP · NPTE · Updated for 2026
        </p>

        <h1
          id="hero-heading"
          className="mt-11 text-balance text-4xl font-bold leading-[1.05] tracking-tight text-[var(--color-ink)] sm:text-5xl lg:text-6xl"
        >
          {LANDING_HERO_HEADLINE}
          {LANDING_HERO_HEADLINE_ACCENT ? (
            <>
              {" "}
              <span className="aee-flagship-gradient-text">{LANDING_HERO_HEADLINE_ACCENT}</span>
            </>
          ) : null}
        </h1>

        <div className="mt-5" aria-label={`${bankCounts.totalQuestionsLabel} on the platform`}>
          <span className="aee-landing-question-count aee-landing-question-count--hero">
            {bankCounts.totalLabel}
          </span>
          <span className="aee-landing-question-count--hero-label">serve-ready questions</span>
        </div>

        <div className="mt-7 flex w-full flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <a
            href={LANDING_TRIAL_HREF}
            className="aee-flagship-cta aee-flagship-cta--hero aee-flagship-cta--xl aee-flagship-cta--primary group inline-flex h-12 w-full items-center justify-center gap-2 rounded-full px-6 text-sm font-bold sm:w-auto"
          >
            {formatTrialCtaLabel()}
            <ArrowRight className="h-5 w-5" aria-hidden />
          </a>
        </div>
      </div>

      <div className="relative mx-auto mt-12 max-w-4xl px-5 sm:px-6" aria-hidden>
        <div className="mx-auto h-[420px] max-w-[296px] animate-pulse rounded-[2.4rem] bg-[var(--color-border)]/60" />
      </div>
    </section>
  );
}
