"use client";

/**
 * Flagship landing page — Tesla/Apple minimalism × UWorld medical authority.
 *
 * Section flow (conversion-optimized vertical rhythm):
 *   1. Hero (full viewport, dual CTA, trust bar)
 *   2. Exams grid
 *   3. Why AnyExamEasy (benefit cards + visuals)
 *   4. How it works (numbered steps)
 *   5. Question previews (UWorld-style sample items)
 *   6. Proven results (metrics + testimonials)
 *   7. Pricing (trial → monthly, wallet badges)
 *   8. Final CTA
 *
 * Design tokens: src/lib/landing/tokens.ts (#0A2540 navy, #00D4C8 teal)
 * Guest-only — subscribers see Study Hub via HomeExperience.
 */

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Check,
  ChevronRight,
  HeartPulse,
  LogIn,
  Pill,
  Scale,
  Stethoscope,
} from "lucide-react";
import { LoginModalTrigger } from "@/components/auth/LoginModalTrigger";
import { LandingCta } from "@/components/landing/LandingCta";
import { LandingSection } from "@/components/landing/LandingSection";
import { QuestionPreviewCard } from "@/components/landing/QuestionPreviewCard";
import { LandingVisualSlot } from "@/components/home/LandingVisualSlot";
import { LiveBankStats } from "@/components/home/LiveBankStats";
import { PaymentMethodBadges } from "@/components/PaymentMethodBadges";
import {
  LANDING_BENEFITS,
  LANDING_EXAMS,
  LANDING_HERO_SUBLINE,
  LANDING_METRICS,
  LANDING_PRICING_FEATURES,
  LANDING_STEPS,
  LANDING_TESTIMONIALS,
  SAMPLE_QUESTIONS_FEATURED,
} from "@/lib/landing/content";
import { EXAM_ACCENTS } from "@/lib/landing/tokens";
import { ROUTES } from "@/lib/routes";
import {
  formatMonthlyPrice,
  formatTrialCtaLabel,
  formatTrialHeroOffer,
  MARKETING_DISCLAIMER,
  TRIAL_PAYMENT_DISCLOSURE,
} from "@/lib/site";

const LandingHeroVideoDynamic = dynamic(
  () => import("@/components/landing/LandingHeroVideo").then((m) => m.LandingHeroVideo),
  {
    ssr: false,
    loading: () => <div className="aee-flagship-mockup-skeleton" aria-hidden />,
  }
);

const NgnInteractiveDemo = dynamic(
  () => import("@/components/home/NgnInteractiveDemo").then((m) => m.NgnInteractiveDemo),
  { ssr: false }
);

const TRUST_EXAMS = [
  { label: "NCLEX", icon: HeartPulse, color: EXAM_ACCENTS.nclex },
  { label: "USMLE", icon: Stethoscope, color: EXAM_ACCENTS.usmle },
  { label: "NAPLEX", icon: Pill, color: EXAM_ACCENTS.naplex },
  { label: "MPJE", icon: Scale, color: EXAM_ACCENTS.mpje },
] as const;

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-48px" }}
      transition={{ duration: 0.42, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

function HeroSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="aee-flagship-hero" aria-labelledby="flagship-hero-heading">
      <div className="aee-flagship-hero__bg" aria-hidden />
      <div className="aee-flagship-hero__glow" aria-hidden />
      <div className="aee-flagship-hero__grid" aria-hidden />

      <div className="aee-flagship-inner aee-flagship-hero__layout">
        <motion.div
          className="aee-flagship-hero__copy"
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="aee-flagship-eyebrow aee-flagship-eyebrow--hero">
            Medical licensing exam prep
          </p>
          <h1 id="flagship-hero-heading" className="aee-flagship-hero__headline">
            Board prep with{" "}
            <span className="aee-flagship-gradient-text">clinical-grade</span> questions — one
            subscription.
          </h1>
          <p className="aee-flagship-hero__subline">{LANDING_HERO_SUBLINE}</p>

          <div className="aee-flagship-hero__ctas">
            <LandingCta
              href="/signup?plan=trial"
              icon={
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              }
              className="group"
            >
              {formatTrialCtaLabel()}
            </LandingCta>
            <LandingCta href="#sample-questions" variant="secondary">
              See sample questions
            </LandingCta>
          </div>

          <p className="aee-flagship-hero__disclosure">{TRIAL_PAYMENT_DISCLOSURE}</p>
          <PaymentMethodBadges className="mt-3" size="sm" />
        </motion.div>

        <motion.div
          className="aee-flagship-hero__visual"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.65, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
        >
          <LandingHeroVideoDynamic />
        </motion.div>
      </div>

      <div className="aee-flagship-inner aee-flagship-hero__trust">
        <ul className="aee-flagship-exam-logos" aria-label="Exams we prepare you for">
          {TRUST_EXAMS.map(({ label, icon: Icon, color }) => (
            <li key={label} className="aee-flagship-exam-logo">
              <Icon className="h-4 w-4" style={{ color }} aria-hidden />
              <span>{label}</span>
            </li>
          ))}
        </ul>
        <LiveBankStats compact className="aee-flagship-live-stats" />
      </div>
    </section>
  );
}

export function LandingFlagship() {
  return (
    <div className="aee-flagship">
      <HeroSection />

      <LandingSection
        id="exams"
        eyebrow="Exams we cover"
        title={
          <>
            Four boards.{" "}
            <span className="aee-flagship-gradient-text">One premium plan.</span>
          </>
        }
        subtitle="Switch your primary exam anytime — no separate subscriptions."
      >
        <ul className="aee-flagship-exam-grid">
          {LANDING_EXAMS.map((exam, i) => {
            const Icon = exam.icon;
            return (
              <Reveal key={exam.id} delay={i * 0.04}>
                <li>
                  <Link href={exam.href} className="aee-flagship-exam-card group">
                    <span
                      className="aee-flagship-exam-card__icon"
                      style={{ color: exam.color }}
                    >
                      <Icon className="h-5 w-5" strokeWidth={2} aria-hidden />
                    </span>
                    <span className="aee-flagship-exam-card__body">
                      <span className="aee-flagship-exam-card__label">{exam.label}</span>
                      <span className="aee-flagship-exam-card__blurb">{exam.blurb}</span>
                    </span>
                    <ChevronRight
                      className="h-4 w-4 shrink-0 opacity-40 transition group-hover:translate-x-0.5 group-hover:opacity-100"
                      aria-hidden
                    />
                  </Link>
                </li>
              </Reveal>
            );
          })}
        </ul>
      </LandingSection>

      <LandingSection
        id="why-us"
        alt
        eyebrow="Why AnyExamEasy"
        align="center"
        title={
          <>
            Premium prep that earns{" "}
            <span className="aee-flagship-gradient-text">every pixel.</span>
          </>
        }
        subtitle="Curated banks, Reference Hub, Review Modules, and Anatomy Studio — without paying separately for each exam."
      >
        <ul className="aee-flagship-benefits-grid">
          {LANDING_BENEFITS.map((b, i) => (
            <Reveal key={b.title} delay={i * 0.05}>
              <li className="aee-flagship-benefit-card">
                <LandingVisualSlot
                  visualId={b.visualId}
                  fit="contain"
                  className="aee-flagship-benefit-card__visual"
                />
                <div className="aee-flagship-benefit-card__body">
                  <h3 className="aee-flagship-benefit-card__title">{b.title}</h3>
                  <p className="aee-flagship-benefit-card__detail">{b.detail}</p>
                </div>
              </li>
            </Reveal>
          ))}
        </ul>
      </LandingSection>

      <LandingSection
        id="how-it-works"
        eyebrow="How it works"
        title="From signup to exam day in four steps."
        subtitle="No clutter. No upsell maze. Just a clear study path."
      >
        <ol className="aee-flagship-steps">
          {LANDING_STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <Reveal key={step.step} delay={i * 0.06}>
                <li className="aee-flagship-step">
                  <span className="aee-flagship-step__number" aria-hidden>
                    {step.step}
                  </span>
                  <span className="aee-flagship-step__icon">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="aee-flagship-step__title">{step.title}</h3>
                  <p className="aee-flagship-step__detail">{step.detail}</p>
                </li>
              </Reveal>
            );
          })}
        </ol>
      </LandingSection>

      <LandingSection
        id="sample-questions"
        alt
        align="center"
        eyebrow="Question previews"
        title="See the quality before you commit."
        subtitle="Board-style stems, plausible distractors, and concise rationales — the standard you expect from top-tier prep."
      >
        <ul className="aee-flagship-question-grid aee-flagship-question-grid--three">
          {SAMPLE_QUESTIONS_FEATURED.map((q, i) => (
            <Reveal key={q.exam} delay={i * 0.05}>
              <li>
                <QuestionPreviewCard question={q} />
              </li>
            </Reveal>
          ))}
        </ul>
        <Reveal className="mt-5">
          <div className="aee-flagship-ngn-wrap">
            <p className="mb-3 text-center text-sm font-semibold">
              Interactive Next-Gen NCLEX formats
            </p>
            <NgnInteractiveDemo />
          </div>
        </Reveal>
      </LandingSection>

      <LandingSection
        id="results"
        eyebrow="Proven results"
        align="center"
        title={
          <>
            Trusted by students on{" "}
            <span className="aee-flagship-gradient-text">multiple boards.</span>
          </>
        }
        subtitle="Individual experiences vary. We do not guarantee licensure outcomes."
      >
        <ul className="aee-flagship-metrics" aria-label="Platform highlights">
          {LANDING_METRICS.map((m) => (
            <li key={m.label} className="aee-flagship-metric">
              <span className="aee-flagship-metric__value">{m.value}</span>
              <span className="aee-flagship-metric__label">{m.label}</span>
            </li>
          ))}
        </ul>
        <ul className="aee-flagship-testimonials">
          {LANDING_TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.05}>
              <li className="aee-flagship-testimonial">
                <div className="aee-flagship-testimonial__avatar" aria-hidden>
                  {t.initials}
                </div>
                <blockquote className="aee-flagship-testimonial__quote">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <footer>
                  <p className="aee-flagship-testimonial__name">{t.name}</p>
                  <p className="aee-flagship-testimonial__exam">{t.exam}</p>
                </footer>
              </li>
            </Reveal>
          ))}
        </ul>
      </LandingSection>

      <LandingSection
        id="pricing"
        alt
        align="center"
        eyebrow="Pricing"
        title={
          <>
            {formatTrialCtaLabel()} → {formatMonthlyPrice()}/mo
          </>
        }
        subtitle="All four boards included. Cancel anytime."
      >
        <div className="aee-flagship-pricing-card">
          <LandingVisualSlot
            visualId="pricing-value-stack"
            fit="contain"
            className="aee-flagship-pricing-card__visual"
          />
          <ul className="aee-flagship-pricing-features">
            {LANDING_PRICING_FEATURES.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--flagship-teal)]" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
          <LandingCta
            href="/signup?plan=trial"
            className="group mt-5 w-full"
            icon={
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden
              />
            }
          >
            {formatTrialCtaLabel()}
          </LandingCta>
          <p className="mt-3 text-center text-xs">{TRIAL_PAYMENT_DISCLOSURE}</p>
          <PaymentMethodBadges className="mt-4 justify-center" size="sm" />
          <Link
            href={ROUTES.pricing}
            className="mt-4 block text-center text-sm font-semibold text-[var(--flagship-teal)] hover:opacity-80"
          >
            Full pricing details →
          </Link>
        </div>
      </LandingSection>

      <section className="aee-flagship-final-cta" aria-labelledby="flagship-final-cta-heading">
        <div className="aee-flagship-final-cta__bg" aria-hidden />
        <div className="aee-flagship-inner relative text-center">
          <h2 id="flagship-final-cta-heading" className="aee-flagship-final-cta__title">
            {formatTrialHeroOffer()}
          </h2>
          <p className="aee-flagship-final-cta__subtitle">
            Start studying smarter today — your boards won&apos;t wait.
          </p>
          <div className="aee-flagship-final-cta__actions">
            <LandingCta
              href="/signup?plan=trial"
              variant="primary"
              className="group aee-flagship-cta--on-dark"
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
              callbackUrl={ROUTES.dashboard}
              className="aee-flagship-cta aee-flagship-cta--ghost-dark"
            >
              <LogIn className="h-4 w-4" aria-hidden />
              Already subscribed? Log in
            </LoginModalTrigger>
          </div>
          <p className="mt-4 text-xs opacity-80">{MARKETING_DISCLAIMER}</p>
        </div>
      </section>
    </div>
  );
}
