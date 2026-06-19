"use client";

/**
 * Flagship landing — conversion-first funnel:
 *   Hero → Features → Compare → Social proof → Samples → Testimonials → Pricing → Final CTA
 */

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, LogIn } from "lucide-react";
import { LoginModalTrigger } from "@/components/auth/LoginModalTrigger";
import { LandingCta } from "@/components/landing/LandingCta";
import { LandingFeaturesSection } from "@/components/landing/LandingFeaturesSection";
import { LandingHeroTrustPills } from "@/components/landing/LandingHeroTrustPills";
import { LandingHeroBenefits } from "@/components/landing/LandingHeroBenefits";
import { LandingSection } from "@/components/landing/LandingSection";
import { LandingStickyCta } from "@/components/landing/LandingStickyCta";
import { QuestionPreviewCard } from "@/components/landing/QuestionPreviewCard";
import { LandingExamShowcase } from "@/components/landing/LandingExamShowcase";
import { LandingOfferingBand } from "@/components/landing/LandingOfferingBand";
import { LandingHashScroll } from "@/components/landing/LandingHashScroll";
import { HighlightedPrice } from "@/components/landing/HighlightedPrice";
import { LandingPricingPreview } from "@/components/landing/LandingPricingPreview";
import { ChooseYourExam } from "@/components/home/ChooseYourExam";
import { HowWeCompare } from "@/components/home/HowWeCompare";
import {
  LANDING_HERO_CTA_DISCLOSURE,
  LANDING_HERO_EYEBROW,
  LANDING_HERO_HEADLINE,
  LANDING_HERO_HEADLINE_ACCENT,
  LANDING_HERO_PRICE_TAGLINE,
  formatFlagshipHeroSubline,
  LANDING_PASS_STATS,
  LANDING_SUCCESS_STORIES,
  LANDING_TRIAL_HREF,
  PLATFORM_EXAM_LIST_MIDDOT,
  SAMPLE_QUESTIONS_FEATURED,
} from "@/lib/landing/content";
import { SocialProofSection } from "@/components/home/SocialProofSection";
import { LEGAL_ENTITY } from "@/lib/legal";
import { ROUTES } from "@/lib/routes";
import {
  formatMonthlyPrice,
  formatTrialCtaLabel,
  formatTrialLabel,
  MARKETING_DISCLAIMER,
  TRIAL_PAYMENT_DISCLOSURE,
} from "@/lib/site";
import type { LandingBankCountsDisplay } from "@/lib/marketing/question-bank-counts";

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

function HeroSection({ bankCounts }: { bankCounts: LandingBankCountsDisplay }) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="aee-flagship-hero aee-flagship-hero--premium aee-flagship-hero--showcase" aria-labelledby="flagship-hero-heading">
      <div className="aee-flagship-hero__bg" aria-hidden />
      <div className="aee-flagship-hero__glow" aria-hidden />
      <div className="aee-flagship-hero__grid" aria-hidden />

      <div className="aee-flagship-inner aee-flagship-hero__showcase-top">
        <LandingExamShowcase bankCounts={bankCounts} />
      </div>

      <div className="aee-flagship-inner aee-flagship-hero__layout">
        <div className="aee-flagship-hero__copy">
          <p className="aee-flagship-hero__eyebrow">{LANDING_HERO_EYEBROW}</p>
          <h1 id="flagship-hero-heading" className="aee-flagship-hero__headline aee-flagship-hero__headline--punchy">
            {LANDING_HERO_HEADLINE}{" "}
            <span className="aee-flagship-hero__headline-accent">{LANDING_HERO_HEADLINE_ACCENT}</span>
          </h1>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="aee-flagship-hero__subline">
              {formatFlagshipHeroSubline(bankCounts.totalLabel)}
            </p>

            <LandingHeroBenefits className="mt-5" />

            <div className="aee-hero-price-callout aee-hero-price-callout--compact" aria-label="Starting monthly price">
              <span className="aee-hero-price-callout__label">From</span>
              <HighlightedPrice size="hero-lg" period="/month" />
              <span className="aee-hero-price-callout__note">· all 6 exams · {formatTrialLabel()}</span>
            </div>

            <LandingHeroTrustPills className="mt-5" />

            <div className="aee-flagship-hero__ctas aee-flagship-hero__ctas--conversion mt-6">
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
              <Link href="#sample-questions" className="aee-flagship-cta aee-flagship-cta--secondary">
                See sample questions
              </Link>
              <Link href={ROUTES.pricing} className="aee-flagship-hero__sample-link aee-flagship-hero__sample-link--muted">
                View pricing
              </Link>
            </div>

            <p className="aee-flagship-hero__disclosure aee-flagship-hero__disclosure--prominent">
              {LANDING_HERO_CTA_DISCLOSURE}
            </p>
          </motion.div>
        </div>

        <motion.div
          className="aee-flagship-hero__visual aee-flagship-hero__visual--prominent"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.65, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
        >
          <LandingHeroVideoDynamic />
        </motion.div>
      </div>
    </section>
  );
}

export function LandingFlagship({ bankCounts }: { bankCounts: LandingBankCountsDisplay }) {
  return (
    <div className="aee-flagship aee-flagship--conversion">
      <LandingHashScroll />
      <HeroSection bankCounts={bankCounts} />

      <LandingOfferingBand />

      <LandingFeaturesSection />

      <ChooseYourExam bankCounts={bankCounts} />

      <section className="aee-flagship-compare-wrap" aria-labelledby="compare-heading">
        <div className="aee-flagship-inner">
          <HowWeCompare />
        </div>
      </section>

      <SocialProofSection bankCounts={bankCounts} />

      <LandingSection
        id="sample-questions"
        alt
        align="center"
        className="aee-flagship-section--samples"
        eyebrow="Sample questions"
        title={
          <>
            Premium question quality —{" "}
            <span className="aee-flagship-gradient-text">see it before you commit.</span>
          </>
        }
        subtitle="Board-style vignettes from all six exams — plausible distractors and teachable rationales, not template swaps."
      >
        <ul className="aee-flagship-question-grid aee-flagship-question-grid--six mt-10">
          {SAMPLE_QUESTIONS_FEATURED.map((q, i) => (
            <Reveal key={q.exam} delay={i * 0.04}>
              <li>
                <QuestionPreviewCard question={q} />
              </li>
            </Reveal>
          ))}
        </ul>
        <Reveal className="mt-10 flex flex-col items-center gap-3">
          <div className="flex flex-wrap justify-center gap-3">
            <LandingCta
              href={LANDING_TRIAL_HREF}
              className="aee-flagship-cta--hero aee-flagship-cta--xl group"
              icon={
                <ArrowRight
                  className="h-5 w-5 transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              }
            >
              {formatTrialCtaLabel()}
            </LandingCta>
            <Link href={ROUTES.pricing} className="aee-flagship-cta aee-flagship-cta--secondary">
              View pricing
            </Link>
          </div>
          <p className="text-center text-sm font-semibold text-[var(--flagship-navy-soft)]">
            {LANDING_HERO_CTA_DISCLOSURE}
          </p>
        </Reveal>
      </LandingSection>

      <LandingSection
        id="success-stories"
        eyebrow="Success stories"
        align="center"
        title={
          <>
            Students who switched from{" "}
            <span className="aee-flagship-gradient-text">expensive per-exam prep.</span>
          </>
        }
        subtitle="Individual results vary — illustrative student feedback; we do not guarantee licensure outcomes."
      >
        <ul className="aee-flagship-metrics aee-flagship-metrics--pass-stats" aria-label="Student outcomes at a glance">
          {LANDING_PASS_STATS.map((m) => (
            <li key={m.label} className="aee-flagship-metric">
              <span className="aee-flagship-metric__value">{m.value}</span>
              <span className="aee-flagship-metric__label">{m.label}</span>
              <span className="aee-flagship-metric__detail">{m.detail}</span>
            </li>
          ))}
        </ul>
        <ul className="aee-flagship-testimonials aee-flagship-testimonials--premium">
          {LANDING_SUCCESS_STORIES.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.05}>
              <li className="aee-flagship-testimonial aee-flagship-testimonial--premium">
                <div className="aee-flagship-testimonial__header">
                  <div
                    className="aee-flagship-testimonial__avatar aee-flagship-testimonial__avatar--photo"
                    style={{ background: t.avatarGradient }}
                    aria-hidden
                  >
                    {t.initials}
                  </div>
                  <div>
                    <p className="aee-flagship-testimonial__name">{t.name}</p>
                    <p className="aee-flagship-testimonial__exam">{t.exam}</p>
                  </div>
                </div>
                <p className="aee-flagship-testimonial__outcome">{t.outcome}</p>
                <blockquote className="aee-flagship-testimonial__quote">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
              </li>
            </Reveal>
          ))}
        </ul>
        <p className="mt-4 text-center text-[0.6875rem] text-[var(--flagship-muted)]">
          *Self-reported outcomes from student feedback; not a guarantee of your results.
        </p>
      </LandingSection>

      <LandingSection
        id="pricing"
        alt
        align="center"
        eyebrow="Simple pricing"
        title={
          <>
            Accessible pricing —{" "}
            <span className="aee-flagship-gradient-text">{LANDING_HERO_PRICE_TAGLINE}</span>
          </>
        }
        subtitle={`${formatTrialLabel()} · all six boards · Basic from ${formatMonthlyPrice("basic")}/mo · save up to 20% on annual`}
      >
        <LandingPricingPreview />
      </LandingSection>

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
            <Link href="#sample-questions" className="aee-flagship-cta aee-flagship-cta--ghost-dark">
              See sample questions
            </Link>
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
