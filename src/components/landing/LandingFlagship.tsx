"use client";

/**
 * Flagship landing — simple, focused, premium conversion funnel:
 *   Hero (countdown + 1 CTA) → Product showcase → Pick your board →
 *   Why choose us (+ compare + proof) → Pricing → Final CTA
 */

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, LogIn } from "lucide-react";
import { LoginModalTrigger } from "@/components/auth/LoginModalTrigger";
import { LandingCta } from "@/components/landing/LandingCta";
import { LandingStickyCta } from "@/components/landing/LandingStickyCta";
import { LandingHashScroll } from "@/components/landing/LandingHashScroll";
import { HighlightedPrice } from "@/components/landing/HighlightedPrice";
import { LandingPricingPreview } from "@/components/landing/LandingPricingPreview";
import { ProBenefitsComparison } from "@/components/pricing/ProBenefitsComparison";
import { BoardSeasonCountdown } from "@/components/landing/BoardSeasonCountdown";
import { LandingShowcase } from "@/components/landing/flagship/LandingShowcase";
import { LandingWhyChoose } from "@/components/landing/flagship/LandingWhyChoose";
import { ChooseYourExam } from "@/components/home/ChooseYourExam";
import { LandingAnatomyPreview } from "@/components/home/LandingAnatomyPreview";
import {
  LANDING_HERO_CTA_DISCLOSURE,
  LANDING_HERO_EXAMS,
  LANDING_HERO_EYEBROW,
  LANDING_HERO_HEADLINE,
  LANDING_HERO_HEADLINE_ACCENT,
  LANDING_TRIAL_HREF,
  PLATFORM_EXAM_LIST_MIDDOT,
} from "@/lib/landing/content";
import { getLandingVisual, landingVisualSrc } from "@/lib/marketing/landing-visuals";
import { LEGAL_ENTITY } from "@/lib/legal";
import { ROUTES } from "@/lib/routes";
import {
  formatTrialCtaLabel,
  formatTrialLabel,
  MARKETING_DISCLAIMER,
  TRIAL_PAYMENT_DISCLOSURE,
} from "@/lib/site";
import type { LandingBankCountsDisplay } from "@/lib/marketing/question-bank-counts";

function HeroSection({ bankCounts }: { bankCounts: LandingBankCountsDisplay }) {
  const reduceMotion = useReducedMotion();
  const heroSpec = getLandingVisual("hero-app-mockup");
  const heroSrc = landingVisualSrc("hero-app-mockup");

  return (
    <section
      className="aee-flagship-hero relative overflow-hidden bg-[var(--color-bg)] pb-16 pt-28 sm:pb-20 sm:pt-32"
      aria-labelledby="flagship-hero-heading"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(60%_60%_at_50%_0%,color-mix(in_srgb,var(--color-accent)_14%,transparent),transparent)]"
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
            {LANDING_HERO_EYEBROW}
          </p>

          <BoardSeasonCountdown className="mt-5" />

          <h1
            id="flagship-hero-heading"
            className="mt-6 text-balance text-4xl font-bold tracking-tight text-[var(--color-ink)] sm:text-5xl lg:text-6xl"
          >
            {LANDING_HERO_HEADLINE}{" "}
            <span className="text-[var(--color-accent)]">{LANDING_HERO_HEADLINE_ACCENT}</span>
          </h1>

          <p className="mt-5 max-w-xl text-balance text-lg leading-relaxed text-[var(--color-ink-muted)]">
            {bankCounts.totalLabel} board-style questions across all six exams — QA-gated, with
            teachable rationales and a Roadmap that tells you exactly what to study next.
          </p>

          <div
            className="mt-6 inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm font-semibold text-[var(--color-ink-muted)]"
            aria-label="Starting price"
          >
            <span>From</span>
            <HighlightedPrice size="hero" period="/month" />
            <span>· all 6 exams · {formatTrialLabel()}</span>
          </div>

          <div className="mt-7 flex w-full flex-col items-center gap-3 sm:flex-row sm:justify-center">
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
              {formatTrialCtaLabel()}
            </LandingCta>
            <Link
              href="#product"
              className="inline-flex h-12 items-center justify-center rounded-full px-5 text-sm font-semibold text-[var(--color-ink)] transition hover:text-[var(--color-accent)]"
            >
              See how it works
            </Link>
          </div>

          <p className="mt-4 text-xs font-medium text-[var(--color-ink-muted)]">
            {LANDING_HERO_CTA_DISCLOSURE}
          </p>

          <ul
            className="mt-9 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3"
            aria-label="Included board exams"
          >
            {LANDING_HERO_EXAMS.map((exam) => (
              <li
                key={exam.label}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-4 py-2 text-base font-bold tracking-tight text-[var(--color-ink)] shadow-[var(--shadow-apple-sm)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-apple-md)] sm:px-5 sm:py-2.5 sm:text-lg"
              >
                <span
                  className="h-2.5 w-2.5 rounded-full sm:h-3 sm:w-3"
                  style={{ background: exam.color }}
                  aria-hidden
                />
                {exam.label}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Focal product visual */}
      {heroSrc ? (
        <motion.div
          className="relative mx-auto mt-12 max-w-4xl px-5 sm:px-6"
          initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] shadow-[var(--shadow-apple-lg)]">
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
            <Image
              src={heroSrc}
              alt={heroSpec?.alt ?? "Any Exam Easy study dashboard"}
              width={1200}
              height={750}
              priority
              className="h-auto w-full object-cover object-top"
              sizes="(max-width: 1024px) 100vw, 896px"
            />
          </div>
        </motion.div>
      ) : null}
    </section>
  );
}

export function LandingFlagship({ bankCounts }: { bankCounts: LandingBankCountsDisplay }) {
  return (
    <div className="aee-flagship aee-flagship--conversion">
      <LandingHashScroll />

      <HeroSection bankCounts={bankCounts} />

      <LandingShowcase />

      <LandingAnatomyPreview />

      <ChooseYourExam bankCounts={bankCounts} />

      <LandingWhyChoose />

      <section className="bg-[var(--color-surface)] py-20 sm:py-24">
        <ProBenefitsComparison />
      </section>

      <section id="pricing" className="scroll-mt-24 bg-[var(--color-bg)] py-20 sm:py-24">
        <div className="mx-auto max-w-5xl px-5 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-accent)]">
              Simple pricing
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--color-ink)] sm:text-4xl">
              One plan. Every board. Start free.
            </h2>
            <p className="mt-4 text-lg text-[var(--color-ink-muted)]">
              {formatTrialLabel()} · all six boards · cancel anytime.
            </p>
          </div>
          <div className="mt-10">
            <LandingPricingPreview />
          </div>
        </div>
      </section>

      <section className="aee-flagship-final-cta" aria-labelledby="flagship-final-cta-heading">
        <div className="aee-flagship-final-cta__bg" aria-hidden />
        <div className="aee-flagship-inner relative text-center">
          <h2 id="flagship-final-cta-heading" className="aee-flagship-final-cta__title">
            Premium board prep starts here
          </h2>
          <p className="aee-flagship-final-cta__subtitle">
            {formatTrialLabel()} · {LANDING_HERO_CTA_DISCLOSURE} · {PLATFORM_EXAM_LIST_MIDDOT}
          </p>
          <div className="aee-flagship-final-cta__actions">
            <LandingCta
              href={LANDING_TRIAL_HREF}
              variant="primary"
              className="aee-flagship-cta--hero aee-flagship-cta--xl group aee-flagship-cta--on-dark"
              icon={
                <ArrowRight
                  className="h-5 w-5 transition-transform group-hover:translate-x-1"
                  aria-hidden
                />
              }
            >
              {formatTrialCtaLabel()}
            </LandingCta>
            <LoginModalTrigger
              callbackUrl={`${ROUTES.settings}?reactivate=1`}
              className="aee-flagship-cta aee-flagship-cta--ghost-dark"
            >
              <LogIn className="h-4 w-4" aria-hidden />
              Already subscribed? Log in
            </LoginModalTrigger>
          </div>
          <p className="aee-flagship-final-cta__legal mt-4">{TRIAL_PAYMENT_DISCLOSURE}</p>
          <p className="aee-flagship-final-cta__legal mt-2">{MARKETING_DISCLAIMER}</p>
          <p className="aee-flagship-final-cta__legal mt-2">
            {LEGAL_ENTITY.productName} is a product of {LEGAL_ENTITY.companyName}.{" "}
            <Link href="/legal/terms" className="aee-flagship-final-cta__legal-link">
              Terms
            </Link>
            {" · "}
            <Link href="/legal/privacy" className="aee-flagship-final-cta__legal-link">
              Privacy
            </Link>
          </p>
        </div>
      </section>

      <LandingStickyCta />
    </div>
  );
}
