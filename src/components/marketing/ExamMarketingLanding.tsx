import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import {
  EXAM_SEO_CONFIG,
  EXAM_SEO_KEYS,
  examMarketingPath,
  getExamSeoConfig,
  type ExamSeoKey,
} from "@/lib/seo/exam-config";
import {
  LANDING_HERO_CTA_DISCLOSURE,
  PLATFORM_EXAM_LIST_MIDDOT,
  landingTrialHrefForExam,
} from "@/lib/landing/content";
import { LandingCta } from "@/components/landing/LandingCta";
import { HighlightedPrice } from "@/components/landing/HighlightedPrice";
import {
  LandingPricingPreviewLazy,
  UsmleStepShowcaseLazy,
} from "@/components/marketing/ExamMarketingSectionsLazy";
import { ROUTES } from "@/lib/routes";
import {
  formatMonthlyPrice,
  formatTrialCtaLabel,
  formatTrialLabel,
  TRIAL_PAYMENT_DISCLOSURE,
} from "@/lib/site";

type Props = {
  examKey: ExamSeoKey;
  /** Live compact question count for this exam, e.g. "8.2K+". */
  questionCountLabel?: string;
  /** Per-step serve-ready counts for the USMLE step picker (SSR). */
  usmleStepCounts?: Partial<Record<"step1" | "step2" | "step3", number>>;
};

export function ExamMarketingLanding({ examKey, questionCountLabel, usmleStepCounts }: Props) {
  const config = getExamSeoConfig(examKey);
  const otherExams = EXAM_SEO_KEYS.filter((k) => k !== examKey);
  const isUsmle = examKey === "usmle";
  const topFeatures = config.features.slice(0, 4);

  return (
    <div className="aee-exam-marketing">
      <section className="aee-exam-marketing__hero border-b border-[var(--color-border)]/40">
        <div className="mx-auto max-w-5xl px-5 pb-16 pt-[var(--page-top)] sm:px-6 sm:pb-20">
          <nav aria-label="Breadcrumb" className="text-sm text-[var(--color-ink-muted)]">
            <Link href={ROUTES.home} className="transition-colors hover:text-[var(--color-accent)]">
              Home
            </Link>
            <span className="mx-2 opacity-40">/</span>
            <span className="font-medium text-[var(--color-ink)]">{config.shortName} Prep</span>
          </nav>

          <header className="mt-10 max-w-3xl">
            <p
              className="text-xs font-bold uppercase tracking-[0.16em]"
              style={{ color: config.accentColor }}
            >
              {config.blueprintLabel}
            </p>
            <h1 className="mt-4 text-[clamp(2.5rem,6.5vw,4.5rem)] font-extrabold leading-[1.05] tracking-tight text-[var(--color-ink)]">
              {config.h1}
            </h1>
            <p className="mt-5 max-w-xl text-[clamp(1.125rem,2.2vw,1.375rem)] leading-relaxed text-[var(--color-ink)]">
              {config.heroSubline}
            </p>
            {questionCountLabel ? (
              <p className="mt-4 text-base font-semibold text-[var(--color-ink-muted)]">
                {questionCountLabel} serve-ready questions · one plan for six boards
              </p>
            ) : null}

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <LandingCta
                href={landingTrialHrefForExam(examKey)}
                ctaName={`exam_hero_trial_${examKey}`}
                location="exam_marketing_hero"
                className="aee-flagship-cta--hero group"
                icon={
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  />
                }
              >
                {formatTrialCtaLabel()}
              </LandingCta>
              <Link
                href="#pricing"
                className="text-base font-semibold text-[var(--color-accent)] hover:underline"
              >
                View pricing →
              </Link>
            </div>
            <div className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="inline-flex items-baseline gap-1.5 text-base font-bold text-[var(--color-ink)]">
                From
                <HighlightedPrice size="hero" period="/mo" />
              </span>
              <span className="text-sm text-[var(--color-ink-muted)]">{formatTrialLabel()}</span>
            </div>
            <p className="mt-3 text-sm text-[var(--color-ink-muted)]">{LANDING_HERO_CTA_DISCLOSURE}</p>
            <p className="mt-6 text-sm leading-relaxed text-[var(--color-ink-muted)]">
              Independent study aid — not affiliated with or endorsed by the exam owner.
            </p>
          </header>
        </div>
      </section>

      {isUsmle && (
        <section className="border-b border-[var(--color-border)]/40 py-14">
          <div className="mx-auto max-w-5xl px-5 sm:px-6">
            <UsmleStepShowcaseLazy initialStepCounts={usmleStepCounts} />
          </div>
        </section>
      )}

      <section className="border-b border-[var(--color-border)]/40 py-[var(--landing-section-py,4rem)]">
        <div className="mx-auto max-w-5xl px-5 sm:px-6">
          <h2 className="aee-flagship-title max-w-2xl">
            What you get for {config.shortName}
          </h2>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2" role="list">
            {topFeatures.map((feature) => (
              <li key={feature.title}>
                <h3 className="text-lg font-bold text-[var(--color-ink)]">{feature.title}</h3>
                <p className="mt-2 text-base leading-relaxed text-[var(--color-ink-muted)]">
                  {feature.detail}
                </p>
              </li>
            ))}
          </ul>
          <ul className="mt-10 space-y-3" role="list">
            {[
              `${config.shortName} question bank + ${formatTrialLabel()}`,
              "Blueprint Roadmap · Deep Dives · Full Exam sims",
              "Five other boards on the same subscription",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-base text-[var(--color-ink)]">
                <Check
                  className="mt-0.5 h-5 w-5 shrink-0"
                  style={{ color: config.accentColor }}
                  strokeWidth={2.5}
                  aria-hidden
                />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        id="pricing"
        className="scroll-mt-24 border-b border-[var(--color-border)]/40 py-[var(--landing-section-py,4rem)]"
      >
        <div className="mx-auto max-w-5xl px-5 sm:px-6">
          <header className="mx-auto max-w-2xl text-center">
            <h2 className="aee-flagship-title">
              Pro at {formatMonthlyPrice("pro")}/mo
            </h2>
            <p className="aee-flagship-subtitle">
              {formatTrialLabel()} · {PLATFORM_EXAM_LIST_MIDDOT}
            </p>
          </header>
          <div className="mt-10">
            <LandingPricingPreviewLazy />
          </div>
          <p className="mt-8 text-center text-base">
            <Link href={ROUTES.compare} className="font-semibold text-[var(--color-accent)] hover:underline">
              Compare vs stacking QBanks →
            </Link>
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-5 pb-20 pt-14 sm:px-6">
        <section aria-labelledby="exam-faq">
          <h2
            id="exam-faq"
            className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold tracking-tight text-[var(--color-ink)]"
          >
            FAQ
          </h2>
          <dl className="mt-8 space-y-6">
            {config.faqs.map((faq) => (
              <div key={faq.question} className="border-b border-[var(--color-border)] pb-6">
                <dt className="text-base font-bold text-[var(--color-ink)]">{faq.question}</dt>
                <dd className="mt-2 text-base leading-relaxed text-[var(--color-ink-muted)]">
                  {faq.answer}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-12" aria-labelledby="other-boards">
          <h2 id="other-boards" className="text-sm font-bold uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
            All six boards — one subscription
          </h2>
          <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
            {otherExams.map((key) => {
              const other = EXAM_SEO_CONFIG[key];
              return (
                <li key={key}>
                  <Link
                    href={examMarketingPath(key)}
                    className="text-base font-semibold text-[var(--color-ink)] hover:text-[var(--color-accent)]"
                  >
                    {other.shortName}
                  </Link>
                </li>
              );
            })}
            <li>
              <Link
                href={ROUTES.toolkit}
                className="text-base font-semibold text-[var(--color-accent)] hover:underline"
              >
                Toolkit →
              </Link>
            </li>
          </ul>
        </section>

        <section className="mt-16 text-center">
          <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] font-bold tracking-tight text-[var(--color-ink)]">
            Start {config.shortName} prep
          </h2>
          <p className="mt-3 text-lg text-[var(--color-ink-muted)]">
            {formatTrialLabel()} · Pro at {formatMonthlyPrice("pro")}/mo
          </p>
          <div className="mt-8 flex justify-center">
            <LandingCta
              href={landingTrialHrefForExam(examKey)}
              ctaName={`exam_final_trial_${examKey}`}
              location="exam_marketing_final"
              className="aee-flagship-cta--hero group"
              icon={
                <ArrowRight
                  className="h-5 w-5 transition-transform group-hover:translate-x-1"
                  aria-hidden
                />
              }
            >
              {formatTrialCtaLabel()}
            </LandingCta>
          </div>
          <p className="mt-4 text-sm text-[var(--color-ink-muted)]">{TRIAL_PAYMENT_DISCLOSURE}</p>
        </section>
      </div>
    </div>
  );
}
