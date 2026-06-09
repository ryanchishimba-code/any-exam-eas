"use client";

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
import { LandingSection } from "@/components/landing/LandingSection";
import { LandingVisualSlot } from "@/components/home/LandingVisualSlot";
import { LiveBankStats } from "@/components/home/LiveBankStats";
import { PaymentMethodBadges } from "@/components/PaymentMethodBadges";
import {
  LANDING_BENEFITS,
  LANDING_EXAMS,
  LANDING_METRICS,
  LANDING_STEPS,
  LANDING_TESTIMONIALS,
  SAMPLE_QUESTION_PREVIEWS,
} from "@/lib/landing/content";
import { landingVisualSrc } from "@/lib/marketing/landing-visuals";
import { ROUTES } from "@/lib/routes";
import {
  formatMonthlyPrice,
  formatTrialCtaLabel,
  formatTrialHeroOffer,
  MARKETING_DISCLAIMER,
  TRIAL_PAYMENT_DISCLOSURE,
} from "@/lib/site";
import { cn } from "@/lib/utils";

const LandingAppMockup = dynamic(
  () => import("@/components/home/LandingAppMockup").then((m) => m.LandingAppMockup),
  {
    ssr: false,
    loading: () => (
      <div className="aee-flagship-mockup-skeleton" aria-hidden />
    ),
  }
);

const NgnInteractiveDemo = dynamic(
  () => import("@/components/home/NgnInteractiveDemo").then((m) => m.NgnInteractiveDemo),
  { ssr: false }
);

const EXAM_LOGOS = [
  { label: "NCLEX", icon: HeartPulse, color: "#0d9488" },
  { label: "USMLE", icon: Stethoscope, color: "#2563eb" },
  { label: "NAPLEX", icon: Pill, color: "#7c3aed" },
  { label: "MPJE", icon: Scale, color: "#d97706" },
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
  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

function HeroSection() {
  const reduceMotion = useReducedMotion();
  const heroSrc = landingVisualSrc("hero-app-mockup");

  return (
    <section className="aee-flagship-hero" aria-labelledby="flagship-hero-heading">
      <div className="aee-flagship-hero__bg" aria-hidden />
      <div className="aee-flagship-hero__grid" aria-hidden />

      <div className="aee-flagship-inner aee-flagship-hero__layout">
        <motion.div
          className="aee-flagship-hero__copy"
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="aee-flagship-eyebrow aee-flagship-eyebrow--hero">
            Medical licensing exam prep
          </p>
          <h1 id="flagship-hero-heading" className="aee-flagship-hero__headline">
            Pass your board with{" "}
            <span className="aee-flagship-gradient-text">confidence</span> — not clutter.
          </h1>
          <p className="aee-flagship-hero__subline">
            NCLEX, USMLE Step 2 CK, NAPLEX, and MPJE in one premium subscription — adaptive
            question banks, timed exams, and Top 500 Drugs.
          </p>

          <div className="aee-flagship-hero__ctas">
            <Link
              href="/signup?plan=trial"
              className="aee-btn-hero-xl group inline-flex items-center justify-center gap-2"
            >
              {formatTrialCtaLabel()}
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>
            <Link
              href="#sample-questions"
              className="aee-btn-hero-secondary inline-flex items-center justify-center gap-2"
            >
              See sample questions
              <ChevronRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>

          <p className="aee-flagship-hero__disclosure">{TRIAL_PAYMENT_DISCLOSURE}</p>
          <PaymentMethodBadges className="mt-3" size="sm" />
        </motion.div>

        <motion.div
          className="aee-flagship-hero__visual"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          {heroSrc ? (
            <LandingAppMockup />
          ) : (
            <div className="aee-flagship-mockup-skeleton" aria-hidden />
          )}
        </motion.div>
      </div>

      <div className="aee-flagship-inner aee-flagship-hero__trust">
        <ul className="aee-flagship-exam-logos" aria-label="Exams we prepare you for">
          {EXAM_LOGOS.map(({ label, icon: Icon, color }) => (
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

function ExamsSection() {
  return (
    <LandingSection
      id="exams"
      eyebrow="All included in one plan"
      title={
        <>
          Exams we prepare you for —{" "}
          <span className="aee-flagship-gradient-text">one subscription.</span>
        </>
      }
      subtitle="Switch your primary board anytime. No per-exam upgrade fees."
    >
      <ul className="aee-flagship-exam-grid">
        {LANDING_EXAMS.map((exam, i) => {
          const Icon = exam.icon;
          return (
            <Reveal key={exam.id} delay={i * 0.05}>
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
                    className="h-4 w-4 shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-teal-600"
                    aria-hidden
                  />
                </Link>
              </li>
            </Reveal>
          );
        })}
      </ul>
    </LandingSection>
  );
}

function BenefitsSection() {
  return (
    <LandingSection
      id="why-us"
      alt
      eyebrow="Why students choose AnyExamEasy"
      title={
        <>
          Premium prep that feels{" "}
          <span className="aee-flagship-gradient-text">built for boards.</span>
        </>
      }
      subtitle="Every feature earns its place — no filler modules, no separate bills per exam."
      align="center"
    >
      <ul className="aee-flagship-benefits-grid">
        {LANDING_BENEFITS.map((benefit, i) => (
          <Reveal key={benefit.title} delay={i * 0.06}>
            <li className="aee-flagship-benefit-card">
              <LandingVisualSlot
                visualId={benefit.visualId}
                fit="contain"
                className="aee-flagship-benefit-card__visual"
              />
              <div className="aee-flagship-benefit-card__body">
                <h3 className="aee-flagship-benefit-card__title">{benefit.title}</h3>
                <p className="aee-flagship-benefit-card__detail">{benefit.detail}</p>
              </div>
            </li>
          </Reveal>
        ))}
      </ul>
    </LandingSection>
  );
}

function HowItWorksSection() {
  return (
    <LandingSection
      id="how-it-works"
      eyebrow="How it works"
      title="Four steps from signup to exam-day ready."
      subtitle="A clear path — no maze of upsells."
    >
      <ol className="aee-flagship-steps">
        {LANDING_STEPS.map((step, i) => {
          const Icon = step.icon;
          return (
            <Reveal key={step.step} delay={i * 0.07}>
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
  );
}

function SampleQuestionsSection() {
  return (
    <LandingSection
      id="sample-questions"
      alt
      eyebrow="Realistic previews"
      title="See the quality before you subscribe."
      subtitle="Board-style stems, plausible distractors, and concise rationales — sampled from our banks."
      align="center"
    >
      <ul className="aee-flagship-question-grid">
        {SAMPLE_QUESTION_PREVIEWS.map((q, i) => (
          <Reveal key={q.exam} delay={i * 0.05}>
            <li className="aee-flagship-question-card">
              <div className="aee-flagship-question-card__head">
                <span
                  className="aee-flagship-question-card__badge"
                  style={{ color: q.examColor, borderColor: `${q.examColor}33` }}
                >
                  {q.exam}
                </span>
              </div>
              <p className="aee-flagship-question-card__stem">{q.stem}</p>
              <ol className="aee-flagship-question-card__options" aria-label="Answer choices">
                {q.options.map((opt) => (
                  <li
                    key={opt}
                    className={cn(
                      "aee-flagship-question-card__option",
                      opt === q.correct && "aee-flagship-question-card__option--correct"
                    )}
                  >
                    {opt === q.correct ? (
                      <Check className="h-3.5 w-3.5 shrink-0 text-teal-600" aria-hidden />
                    ) : (
                      <span className="h-3.5 w-3.5 shrink-0" aria-hidden />
                    )}
                    <span>{opt}</span>
                  </li>
                ))}
              </ol>
              <p className="aee-flagship-question-card__rationale">
                <strong>Rationale:</strong> {q.rationale}
              </p>
            </li>
          </Reveal>
        ))}
      </ul>

      <Reveal className="mt-6">
        <div className="aee-flagship-ngn-wrap">
          <p className="mb-3 text-center text-sm font-semibold text-slate-700">
            Try Next-Gen NCLEX formats interactively
          </p>
          <NgnInteractiveDemo />
        </div>
      </Reveal>
    </LandingSection>
  );
}

function ResultsSection() {
  return (
    <LandingSection
      id="results"
      eyebrow="Proven results"
      title={
        <>
          Trusted by students preparing for{" "}
          <span className="aee-flagship-gradient-text">multiple boards.</span>
        </>
      }
      subtitle="Individual experiences vary. We do not guarantee licensure outcomes."
      align="center"
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
          <Reveal key={t.name} delay={i * 0.06}>
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
  );
}

function PricingSection() {
  return (
    <LandingSection
      id="pricing"
      alt
      eyebrow="Pricing that converts"
      title={
        <>
          {formatTrialCtaLabel()} → {formatMonthlyPrice()}/mo
        </>
      }
      subtitle="One plan covers NCLEX, USMLE Step 2 CK, NAPLEX, and MPJE. Cancel anytime."
      align="center"
    >
      <div className="aee-flagship-pricing-card">
        <LandingVisualSlot
          visualId="pricing-value-stack"
          fit="contain"
          className="aee-flagship-pricing-card__visual"
        />
        <ul className="aee-flagship-pricing-features">
          {[
            "All four exam banks + adaptive practice",
            "Timed full-exam simulator",
            "Top 500 Drugs flashcard deck",
            "Progress analytics & weak-area drills",
            "State-specific MPJE when you need it",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-slate-700">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" aria-hidden />
              {item}
            </li>
          ))}
        </ul>
        <Link
          href="/signup?plan=trial"
          className="aee-btn-hero-xl group mt-5 inline-flex w-full items-center justify-center gap-2"
        >
          {formatTrialCtaLabel()}
          <ArrowRight
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
            aria-hidden
          />
        </Link>
        <p className="mt-3 text-center text-xs text-slate-500">{TRIAL_PAYMENT_DISCLOSURE}</p>
        <PaymentMethodBadges className="mt-4 justify-center" size="sm" />
        <Link
          href={ROUTES.pricing}
          className="mt-4 block text-center text-sm font-semibold text-teal-700 hover:text-teal-600"
        >
          View full pricing details →
        </Link>
      </div>
    </LandingSection>
  );
}

function FinalCtaSection() {
  return (
    <section className="aee-flagship-final-cta" aria-labelledby="flagship-final-cta-heading">
      <div className="aee-flagship-final-cta__bg" aria-hidden />
      <div className="aee-flagship-inner relative text-center">
        <h2 id="flagship-final-cta-heading" className="aee-flagship-final-cta__title">
          {formatTrialHeroOffer()}
        </h2>
        <p className="aee-flagship-final-cta__subtitle">
          Join students preparing smarter across nursing, medicine, and pharmacy boards.
        </p>
        <div className="aee-flagship-final-cta__actions">
          <Link
            href="/signup?plan=trial"
            className="aee-btn-hero-xl aee-btn-hero-light group inline-flex items-center justify-center gap-2"
          >
            {formatTrialCtaLabel()}
            <ArrowRight
              className="h-5 w-5 transition-transform group-hover:translate-x-1"
              aria-hidden
            />
          </Link>
          <LoginModalTrigger
            callbackUrl={ROUTES.dashboard}
            className="aee-btn-hero-ghost aee-btn-hero-ghost-on-dark inline-flex items-center justify-center gap-2"
          >
            <LogIn className="h-4 w-4" aria-hidden />
            Already subscribed? Log in
          </LoginModalTrigger>
        </div>
        <p className="mt-4 text-xs text-teal-100/85">{MARKETING_DISCLAIMER}</p>
      </div>
    </section>
  );
}

/** Flagship guest landing — conversion-optimized, zero dead space. */
export function LandingFlagship() {
  return (
    <div className="aee-flagship">
      <HeroSection />
      <ExamsSection />
      <BenefitsSection />
      <HowItWorksSection />
      <SampleQuestionsSection />
      <ResultsSection />
      <PricingSection />
      <FinalCtaSection />
    </div>
  );
}
