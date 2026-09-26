import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import {
  EXAM_SEO_CONFIG,
  EXAM_SEO_KEYS,
  examMarketingPath,
  getExamSeoConfig,
  type ExamSeoKey,
} from "@/lib/seo/exam-config";
import { presentPublicExamSeo } from "@/lib/marketing/public-format-copy";
import {
  formatExamLiveCountLine,
  landingTrialHrefForExam,
  type LandingSuccessStory,
} from "@/lib/landing/content";
import { LandingCta } from "@/components/landing/LandingCta";
import { ExamMarketingHero } from "@/components/marketing/ExamMarketingHero";
import { WhyTrustIt } from "@/components/marketing/WhyTrustIt";
import type { BoardInventoryPresentation } from "@/lib/inventory/active-questions";
import { examHubProductLinks } from "@/lib/marketing/exam-hub";
import { getStudyGuideConfig } from "@/lib/nclex-study-guide/guide-registry";
import { UsmleStepShowcaseLazy } from "@/components/marketing/ExamMarketingSectionsLazy";
import { ROUTES } from "@/lib/routes";
import {
  formatPricingCheckoutTrialOffer,
  formatTrialCtaLabel,
  formatTrialLabel,
} from "@/lib/site";

type Props = {
  examKey: ExamSeoKey;
  /** Live compact question count for this exam, e.g. "7,581". */
  questionCountLabel?: string;
  /** Active-inventory breakdown. Same source as the Qbank header. */
  inventory?: BoardInventoryPresentation | null;
  /** Per-step serve-ready counts for the USMLE step picker (SSR). */
  usmleStepCounts?: Partial<Record<"step1" | "step2" | "step3", number>>;
  /** Optional product band after the hero (study guide, practice, etc.). */
  extraAfterHero?: ReactNode;
  /** Admin-approved testimonials. Empty until Ryan publishes real ones. */
  testimonials?: LandingSuccessStory[];
};

export function ExamMarketingLanding({
  examKey,
  questionCountLabel,
  inventory,
  usmleStepCounts,
  extraAfterHero,
  testimonials,
}: Props) {
  const config = presentPublicExamSeo(getExamSeoConfig(examKey), inventory?.formats ?? null);
  const otherExams = EXAM_SEO_KEYS.filter((k) => k !== examKey);
  const isUsmle = examKey === "usmle";
  const topFeatures = config.features.slice(0, 4);
  const questionCountLine =
    formatExamLiveCountLine(config.shortName, questionCountLabel) ??
    (questionCountLabel ? `${questionCountLabel} ${config.shortName} questions` : "");
  const productLinks = examHubProductLinks(examKey);
  const studyGuide = getStudyGuideConfig(examKey);

  return (
    <div className="aee-exam-marketing">
      <ExamMarketingHero
        examKey={examKey}
        questionCountLine={questionCountLine}
        countSource={inventory?.countSource}
        activeCount={inventory?.activeCount}
        formats={inventory?.formats ?? null}
      />

      <WhyTrustIt examKey={examKey} inventory={inventory} testimonials={testimonials} />

      {extraAfterHero ?? (
        <section className="border-b border-[var(--color-border)]/40 py-14">
          <div className="mx-auto max-w-5xl px-5 sm:px-6">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-accent)]">
              Start here
            </p>
            <h2 className="mt-3 text-[clamp(1.75rem,4vw,2.5rem)] font-bold tracking-tight text-[var(--color-ink)]">
              {studyGuide
                ? `${config.shortName} study guide, with the Qbank.`
                : `${config.shortName} tools on one plan.`}
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-[var(--color-ink-muted)]">
              {studyGuide
                ? `The ${config.shortName} study guide is included with the 5-day free trial. ${formatPricingCheckoutTrialOffer()}.`
                : `${formatPricingCheckoutTrialOffer()}.`}
            </p>
            <ul className="mt-10 grid gap-4 sm:grid-cols-3" role="list">
              {productLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block h-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition hover:border-[var(--color-accent)]/40"
                  >
                    <p
                      className="text-sm font-bold"
                      style={{ color: item.accent ? "var(--color-accent)" : "var(--color-ink)" }}
                    >
                      {item.title}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-muted)]">
                      {item.body}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {isUsmle && (
        <section id="usmle-steps" className="scroll-mt-24 border-b border-[var(--color-border)]/40 py-14">
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
            {formatTrialLabel()}. Cancel anytime.
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
          <p className="mt-4 text-sm">
            <Link href={ROUTES.pricing} className="font-semibold text-[var(--color-accent)] hover:underline">
              See pricing
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}
