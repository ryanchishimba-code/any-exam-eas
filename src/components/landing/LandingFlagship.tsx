"use client";

/**
 * Flagship landing — conversion-first funnel:
 *   Hero → Compare → Samples + social proof → Pricing → Final CTA
 *   Sticky trial bar after hero scroll.
 */

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, LogIn } from "lucide-react";
import { LoginModalTrigger } from "@/components/auth/LoginModalTrigger";
import { LandingConversionBand } from "@/components/landing/LandingConversionBand";
import { LandingCta } from "@/components/landing/LandingCta";
import { LandingSection } from "@/components/landing/LandingSection";
import { LandingStickyCta } from "@/components/landing/LandingStickyCta";
import { QuestionPreviewCard } from "@/components/landing/QuestionPreviewCard";
import { LandingHeroExamStrip } from "@/components/home/LandingHeroExamStrip";
import { LandingHeroPriceValue } from "@/components/home/LandingHeroPriceValue";
import { HowWeCompare } from "@/components/home/HowWeCompare";
import { LiveBankStats } from "@/components/home/LiveBankStats";
import { PaymentMethodBadges } from "@/components/PaymentMethodBadges";
import {
  LANDING_HERO_BENEFITS,
  LANDING_HERO_HEADLINE_QUOTED,
  LANDING_HERO_PRICE_TAGLINE,
  LANDING_METRICS,
  LANDING_TESTIMONIALS,
  LANDING_TRIAL_HREF,
  SAMPLE_QUESTIONS_FEATURED,
} from "@/lib/landing/content";
import { LEGAL_ENTITY } from "@/lib/legal";
import { ROUTES } from "@/lib/routes";
import {
  formatLandingConversionSubtitle,
  formatLandingHeroSubline,
  formatMonthlyPrice,
  formatTrialCtaLabel,
  formatTrialLabel,
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

      <div className="aee-flagship-inner aee-flagship-hero__exam-top">
        <LandingHeroExamStrip />
      </div>

      <div className="aee-flagship-inner aee-flagship-hero__layout">
        <motion.div
          className="aee-flagship-hero__visual aee-flagship-hero__visual--prominent"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.65, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
        >
          <LandingHeroVideoDynamic />
        </motion.div>

        <div className="aee-flagship-hero__copy aee-flagship-hero__copy--centered">
          <h1 id="flagship-hero-heading" className="aee-flagship-hero__headline">
            {LANDING_HERO_HEADLINE_QUOTED}
          </h1>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="aee-flagship-hero__subline">{formatLandingHeroSubline()}</p>

            <ul className="aee-flagship-hero__benefits" aria-label="Platform benefits">
              {LANDING_HERO_BENEFITS.map((benefit) => (
                <li key={benefit}>{benefit}</li>
              ))}
            </ul>

            <LandingHeroPriceValue className="mx-auto aee-hero-price-value--compact" />

            <div className="aee-flagship-hero__ctas aee-flagship-hero__ctas--conversion">
              <LandingCta
                href={LANDING_TRIAL_HREF}
                className="aee-flagship-cta--hero group w-full sm:w-auto"
                icon={
                  <ArrowRight
                    className="h-5 w-5 transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  />
                }
              >
                {formatTrialCtaLabel()}
              </LandingCta>
              <Link href="#sample-questions" className="aee-flagship-hero__sample-link">
                Preview sample questions
              </Link>
            </div>

            <p className="aee-flagship-hero__disclosure">{TRIAL_PAYMENT_DISCLOSURE}</p>
            <PaymentMethodBadges className="mt-4" size="sm" />
          </motion.div>
        </div>
      </div>

      <div className="aee-flagship-inner aee-flagship-hero__trust">
        <LiveBankStats compact className="aee-flagship-live-stats" />
      </div>
    </section>
  );
}

export function LandingFlagship() {
  return (
    <div className="aee-flagship aee-flagship--conversion">
      <HeroSection />

      <section className="aee-flagship-compare-wrap" aria-labelledby="compare-heading">
        <div className="aee-flagship-inner">
          <HowWeCompare />
        </div>
      </section>

      <LandingConversionBand
        title="One price. Every board."
        subtitle={formatLandingConversionSubtitle()}
      />

      <LandingSection
        id="sample-questions"
        alt
        align="center"
        eyebrow="Sample questions"
        title="See the quality before you commit"
        subtitle="Board-style stems, plausible distractors, and rationales you can learn from."
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
        <Reveal className="mt-6 flex justify-center">
          <LandingCta
            href={LANDING_TRIAL_HREF}
            className="aee-flagship-cta--hero group"
            icon={
              <ArrowRight
                className="h-5 w-5 transition-transform group-hover:translate-x-0.5"
                aria-hidden
              />
            }
          >
            {formatTrialCtaLabel()}
          </LandingCta>
        </Reveal>
      </LandingSection>

      <LandingSection
        id="results"
        eyebrow="Student feedback"
        align="center"
        title={
          <>
            Built for{" "}
            <span className="aee-flagship-gradient-text">every major board.</span>
          </>
        }
        subtitle="Individual results vary — we do not guarantee licensure outcomes."
      >
        <ul className="aee-flagship-metrics" aria-label="Platform highlights">
          {LANDING_METRICS.slice(0, 4).map((m) => (
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
        eyebrow="Simple pricing"
        title={
          <>
            Only {formatMonthlyPrice()}/mo.{" "}
            <span className="aee-flagship-gradient-text">{LANDING_HERO_PRICE_TAGLINE}</span>
          </>
        }
        subtitle={`${formatTrialLabel()} · all four boards · save up to 20% on longer plans`}
      >
        <div className="aee-flagship-pricing-stack">
          <LandingHeroPriceValue className="mx-auto" />
          <LandingCta
            href={LANDING_TRIAL_HREF}
            className="aee-flagship-cta--hero group mt-5 w-full max-w-md"
            icon={
              <ArrowRight
                className="h-5 w-5 transition-transform group-hover:translate-x-0.5"
                aria-hidden
              />
            }
          >
            {formatTrialCtaLabel()}
          </LandingCta>
          <p className="mt-3 text-center text-sm leading-relaxed text-[var(--flagship-muted)]">
            {TRIAL_PAYMENT_DISCLOSURE}
          </p>
          <PaymentMethodBadges className="mt-4 justify-center" size="sm" />
          <Link
            href={ROUTES.pricing}
            className="mt-4 block text-center text-sm font-semibold text-[var(--flagship-teal)] hover:opacity-80"
          >
            Longer plans save up to 20% →
          </Link>
        </div>
      </LandingSection>

      <section className="aee-flagship-final-cta" aria-labelledby="flagship-final-cta-heading">
        <div className="aee-flagship-final-cta__bg" aria-hidden />
        <div className="aee-flagship-inner relative text-center">
          <h2 id="flagship-final-cta-heading" className="aee-flagship-final-cta__title">
            {formatTrialCtaLabel()}
          </h2>
          <p className="aee-flagship-final-cta__subtitle">
            {formatTrialLabel()} · {formatMonthlyPrice()}/mo after trial · NCLEX · USMLE · NAPLEX · PANCE
          </p>
          <div className="aee-flagship-final-cta__actions">
            <LandingCta
              href={LANDING_TRIAL_HREF}
              variant="primary"
              className="aee-flagship-cta--hero group aee-flagship-cta--on-dark"
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
