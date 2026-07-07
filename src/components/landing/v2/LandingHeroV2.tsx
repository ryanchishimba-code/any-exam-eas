"use client";

/**
 * LandingHeroV2 — the focal point of the rebuilt landing page.
 *
 * Bold benefit headline + subheadline, a real board-season countdown for
 * urgency, one prominent primary CTA, an honest payment disclosure, a compact
 * trust strip, and a crisp in-code product mockup (no external image assets, so
 * it stays sharp in light/dark mode and never 404s).
 */

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, Flame, Map as MapIcon, ShieldCheck, Sparkles, XCircle } from "lucide-react";
import { LandingCta } from "@/components/landing/LandingCta";
import { NoPaymentTrialCallout } from "@/components/marketing/NoPaymentTrialCallout";
import { BoardSeasonCountdown } from "@/components/landing/BoardSeasonCountdown";
import { HighlightedPrice } from "@/components/landing/HighlightedPrice";
import { TRIAL_DAYS } from "@/lib/billing-config";
import {
  LANDING_HERO_CTA_DISCLOSURE,
  LANDING_HERO_EXAMS,
  LANDING_HERO_HEADLINE,
  LANDING_HERO_HEADLINE_ACCENT,
  LANDING_TRIAL_HREF,
  formatFlagshipHeroSubline,
} from "@/lib/landing/content";
import { formatTrialLabel } from "@/lib/site";
import { landingVideoSrc } from "@/lib/marketing/landing-visuals";
import type { LandingBankCountsDisplay } from "@/lib/marketing/question-bank-counts";

/** Faux app window — used for the hero product mockup. */
function HeroMockup({ totalLabel }: { totalLabel: string }) {
  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] shadow-[var(--shadow-apple-lg)]">
      {/* Window chrome */}
      <div className="flex items-center gap-2 border-b border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </span>
        <span className="ml-2 text-[11px] font-medium text-[var(--color-ink-muted)]">
          anyexameasy.com/dashboard
        </span>
      </div>

      <div className="grid gap-4 p-5 sm:grid-cols-[1.1fr_0.9fr] sm:p-6">
        {/* Greeting + readiness */}
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
              Good morning, Alex
            </p>
            <p className="mt-1 text-lg font-bold text-[var(--color-ink)]">
              Your USMLE Roadmap
            </p>
          </div>

          {/* Readiness ring card */}
          <div className="flex items-center gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <div
              className="relative grid h-16 w-16 shrink-0 place-items-center rounded-full"
              style={{
                background:
                  "conic-gradient(var(--color-accent) 0% 72%, color-mix(in srgb, var(--color-border) 70%, transparent) 72% 100%)",
              }}
              aria-hidden
            >
              <span className="grid h-12 w-12 place-items-center rounded-full bg-[var(--color-surface-elevated)] text-sm font-bold text-[var(--color-ink)]">
                72%
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-[var(--color-ink)]">Practice progress</p>
              <p className="text-xs text-[var(--color-ink-muted)]">
                Cardiology · Renal trending up this week
              </p>
            </div>
          </div>

          {/* Roadmap rows */}
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--color-ink-muted)]">
              Next up
            </p>
            <ul className="mt-2.5 space-y-2.5">
              {[
                { label: "Acid–base disorders", done: true },
                { label: "Heart failure pharmacology", done: false },
                { label: "Antibiotics: coverage & resistance", done: false },
              ].map((row) => (
                <li key={row.label} className="flex items-center gap-2.5 text-sm">
                  <span
                    className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border ${
                      row.done
                        ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white"
                        : "border-[var(--color-border)] text-transparent"
                    }`}
                    aria-hidden
                  >
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  <span
                    className={
                      row.done
                        ? "text-[var(--color-ink-muted)] line-through"
                        : "font-medium text-[var(--color-ink)]"
                    }
                  >
                    {row.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Stat tiles + streak */}
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-[color-mix(in_srgb,var(--color-accent)_28%,var(--color-border))] bg-[color-mix(in_srgb,var(--color-accent)_8%,var(--color-surface))] p-3.5">
              <p className="aee-landing-question-count aee-landing-question-count--mockup">
                {totalLabel}
              </p>
              <p className="text-[11px] font-semibold text-[var(--color-ink-muted)]">
                Serve-ready on tap
              </p>
            </div>
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3.5">
              <p className="flex items-center gap-1 text-xl font-bold text-[var(--color-ink)]">
                <Flame className="h-4 w-4 text-orange-500" aria-hidden /> 14
              </p>
              <p className="text-[11px] text-[var(--color-ink-muted)]">Day streak</p>
            </div>
          </div>

          {/* Mini bar chart */}
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--color-ink-muted)]">
              This week
            </p>
            <div className="mt-3 flex h-20 items-end gap-1.5" aria-hidden>
              {[45, 62, 38, 70, 55, 82, 60].map((h, i) => (
                <span
                  key={i}
                  className="flex-1 rounded-t-md bg-[var(--color-accent)]/70"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/5 p-4">
            <p className="flex items-center gap-1.5 text-sm font-bold text-[var(--color-ink)]">
              <MapIcon className="h-4 w-4 text-[var(--color-accent)]" aria-hidden />
              Deep Dive unlocked
            </p>
            <p className="mt-1 text-xs text-[var(--color-ink-muted)]">
              Missed 2 heart-failure items → open the linked review module.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function LandingHeroV2({ bankCounts }: { bankCounts: LandingBankCountsDisplay }) {
  const reduceMotion = useReducedMotion();

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
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center"
        >
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-accent)]">
            NCLEX · USMLE · NAPLEX · PANCE · FNP · NPTE · Updated for 2026
          </p>

          <BoardSeasonCountdown className="mt-5" />

          <h1
            id="hero-heading"
            className="mt-6 text-balance text-4xl font-bold leading-[1.05] tracking-tight text-[var(--color-ink)] sm:text-5xl lg:text-6xl"
          >
            {LANDING_HERO_HEADLINE}.{" "}
            <span className="aee-flagship-gradient-text">{LANDING_HERO_HEADLINE_ACCENT}</span>
          </h1>

          <div className="mt-5" aria-label={`${bankCounts.totalQuestionsLabel} on the platform`}>
            <span className="aee-landing-question-count aee-landing-question-count--hero">
              {bankCounts.totalLabel}
            </span>
            <span className="aee-landing-question-count--hero-label">
              serve-ready questions
            </span>
          </div>

          <p className="mt-4 max-w-xl text-balance text-lg leading-relaxed text-[var(--color-ink-muted)]">
            {formatFlagshipHeroSubline(bankCounts.totalLabel)}
          </p>

          <div className="mt-7 flex w-full flex-col items-center gap-3">
            <NoPaymentTrialCallout variant="badge" />
            <div className="flex w-full flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <LandingCta
              href={LANDING_TRIAL_HREF}
              className="aee-flagship-cta--hero aee-flagship-cta--xl aee-flagship-cta--primary group w-full sm:w-auto"
              icon={
                <ArrowRight
                  className="h-5 w-5 transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              }
            >
              Start Your Free Trial
            </LandingCta>
            <Link
              href="#showcase"
              className="inline-flex h-12 items-center justify-center rounded-full px-5 text-sm font-semibold text-[var(--color-ink)] transition hover:text-[var(--color-accent)]"
            >
              See how it works
            </Link>
            </div>
          </div>

          <div
            className="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-2"
            aria-label="Starting price and free trial"
          >
            <span className="inline-flex items-baseline gap-1.5 text-base font-bold text-[var(--color-ink)]">
              From
              <HighlightedPrice size="hero" period="/mo" />
            </span>
            <span className="text-sm font-semibold text-[var(--color-ink-muted)]">
              all 6 exams
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[color-mix(in_srgb,var(--color-accent)_38%,transparent)] bg-[color-mix(in_srgb,var(--color-accent)_14%,var(--color-surface-elevated))] px-3.5 py-1.5 text-sm font-extrabold tracking-tight text-[var(--color-accent)] shadow-[var(--shadow-apple-sm)]">
              <Sparkles className="h-4 w-4" aria-hidden />
              {formatTrialLabel()}
            </span>
          </div>

          <p className="mt-3 text-xs font-medium text-[var(--color-ink-muted)]">
            {LANDING_HERO_CTA_DISCLOSURE}
          </p>

          {/* Trust strip */}
          <ul className="mt-7 flex flex-wrap items-center justify-center gap-2 text-xs font-semibold text-[var(--color-ink-muted)]">
            {[
              { icon: ShieldCheck, label: "QA-gated · clinician-built" },
              { icon: Sparkles, label: "AI Tutor + Spaced Repetition" },
              { icon: MapIcon, label: "Adaptive Blueprint Roadmaps" },
              { icon: Check, label: "UWorld alternative value" },
              { icon: XCircle, label: `Cancel free before day ${TRIAL_DAYS}` },
            ].map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3 py-1.5 shadow-[var(--shadow-apple-sm)]"
              >
                <Icon className="h-3.5 w-3.5 text-[var(--color-accent)]" aria-hidden />
                {label}
              </li>
            ))}
          </ul>

          {/* Exam chips */}
          <ul
            className="mt-5 flex flex-wrap items-center justify-center gap-2"
            aria-label="Included board exams"
          >
            {LANDING_HERO_EXAMS.map((exam) => (
              <li
                key={exam.label}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3.5 py-1.5 text-sm font-bold tracking-tight text-[var(--color-ink)] shadow-[var(--shadow-apple-sm)]"
              >
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: exam.color }}
                  aria-hidden
                />
                {exam.label}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Product demo — autoplay video in a phone frame, with the static in-code
          mockup preserved as the reduced-motion fallback. */}
      <motion.div
        className="relative mx-auto mt-12 max-w-4xl px-5 sm:px-6"
        initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      >
        {reduceMotion ? (
          <HeroMockup totalLabel={bankCounts.totalLabel} />
        ) : (
          <div className="relative flex justify-center">
            {/* Phone frame */}
            <div className="relative w-[268px] sm:w-[296px]">
              <div className="relative overflow-hidden rounded-[2.4rem] border-[7px] border-[var(--color-ink)] bg-[var(--color-ink)] shadow-[var(--shadow-apple-lg)]">
                <span
                  className="absolute left-1/2 top-0 z-10 h-5 w-28 -translate-x-1/2 rounded-b-2xl bg-[var(--color-ink)]"
                  aria-hidden
                />
                <video
                  className="block h-auto w-full rounded-[1.9rem]"
                  src={landingVideoSrc("heroShowcase")}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  aria-label="Any Exam Easy product demo"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>

            {/* Floating annotation callouts — desktop only */}
            <div className="pointer-events-none absolute left-0 top-1/4 hidden max-w-[190px] rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3.5 py-2.5 text-left shadow-[var(--shadow-apple-md)] lg:block">
              <p className="text-xs font-bold text-[var(--color-ink)]">Knows what&apos;s next</p>
              <p className="mt-0.5 text-[11px] leading-snug text-[var(--color-ink-muted)]">
                Your Roadmap surfaces the weakest blueprint topics automatically.
              </p>
            </div>
            <div className="pointer-events-none absolute bottom-1/4 right-0 hidden max-w-[190px] rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3.5 py-2.5 text-left shadow-[var(--shadow-apple-md)] lg:block">
              <p className="text-xs font-bold text-[var(--color-ink)]">Review where it counts</p>
              <p className="mt-0.5 text-[11px] leading-snug text-[var(--color-ink-muted)]">
                Deep Dive modules open from the questions you miss.
              </p>
            </div>
          </div>
        )}
      </motion.div>
    </section>
  );
}
