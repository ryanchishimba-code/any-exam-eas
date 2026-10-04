import type { ReactNode } from "react";
import Link from "next/link";
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
import { ClinicalReviewerAvatar } from "@/components/marketing/ClinicalReviewers";
import { HeroNgnFrame } from "@/components/marketing/elevation/HeroNgnFrame";
import {
  PathSection,
  PriceSection,
  ProblemSection,
  SocialProof,
} from "@/components/marketing/elevation/MarketingSections";
import { BOARD_FORMAT_FACTS } from "@/lib/marketing/board-format-facts";
import { getHeroNgnFrame } from "@/lib/marketing/hero-ngn-frame";
import {
  BOARD_PROCESS_LINE,
  clinicalReviewerForExam,
} from "@/lib/marketing/company";
import { PublicSampleSet } from "@/components/marketing/PublicSampleSet";
import type { PublicSampleQuestion } from "@/lib/marketing/public-sample";
import { ExamMarketingHero } from "@/components/marketing/ExamMarketingHero";
import type { BoardInventoryPresentation } from "@/lib/inventory/active-questions";
import { examHubProductLinks } from "@/lib/marketing/exam-hub";
import { getStudyGuideConfig } from "@/lib/nclex-study-guide/guide-registry";
import { UsmleStepShowcaseLazy } from "@/components/marketing/ExamMarketingSectionsLazy";
import { testimonialsForBoard } from "@/lib/marketing/why-trust-it";
import { ROUTES } from "@/lib/routes";
import { boardReviewBadge } from "@/lib/marketing/legal-copy";

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
  /** Admin-approved, consented testimonials. Empty renders nothing. */
  testimonials?: LandingSuccessStory[];
  /** Real bank items for this board. Empty renders nothing. */
  samples?: PublicSampleQuestion[];
};

export async function ExamMarketingLanding({
  examKey,
  questionCountLabel,
  inventory,
  usmleStepCounts,
  extraAfterHero,
  testimonials,
  samples = [],
}: Props) {
  const config = presentPublicExamSeo(getExamSeoConfig(examKey), inventory?.formats ?? null);
  const otherExams = EXAM_SEO_KEYS.filter((k) => k !== examKey);
  const isUsmle = examKey === "usmle";
  const questionCountLine = questionCountLabel?.includes("including")
    ? questionCountLabel
    : (formatExamLiveCountLine(config.shortName, questionCountLabel) ??
      (questionCountLabel ? `${questionCountLabel} ${config.shortName} questions` : ""));
  const productLinks = examHubProductLinks(examKey);
  const studyGuide = getStudyGuideConfig(examKey);
  const reviewer = clinicalReviewerForExam(examKey);
  const formatFact = BOARD_FORMAT_FACTS[examKey];
  const heroFrame = examKey === "nclex" ? await getHeroNgnFrame() : null;

  return (
    <div className="aee-exam-marketing">
      <ExamMarketingHero
        examKey={examKey}
        questionCountLine={questionCountLine}
        countSource={inventory?.countSource}
        activeCount={inventory?.activeCount}
        formats={inventory?.formats ?? null}
        visual={heroFrame ? <HeroNgnFrame frame={heroFrame} /> : null}
      />

      <section className="mx-auto max-w-3xl px-5 py-12 sm:px-6">
        <p className="text-lg leading-relaxed text-[var(--color-ink-muted)]">{formatFact.fact}</p>
        <a
          href={formatFact.href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-[var(--color-accent)] hover:underline"
        >
          {formatFact.sourceLabel}
        </a>
      </section>

      <ProblemSection board={config.shortName} />
      <PathSection includeNgn={examKey === "nclex"} />

      <PublicSampleSet
        items={samples.filter((item) => {
          if (examKey === "usmle") return item.fieldId.startsWith("usmle");
          if (examKey === "nclex") return item.fieldId === "nursing";
          if (examKey === "naplex") return item.fieldId === "pharmacy";
          return item.fieldId === examKey;
        })}
      />

      <SocialProof testimonials={testimonialsForBoard(testimonials, examKey)} />

      <div className="mx-auto max-w-5xl px-5 pb-2 pt-6 text-sm leading-relaxed sm:px-6">
        {reviewer ? (
          <p className="flex items-center gap-2 text-[var(--color-ink-muted)]">
            <ClinicalReviewerAvatar reviewer={reviewer} size="sm" />
            <span>
              <span className="font-semibold text-[var(--color-ink)]">
                {boardReviewBadge(examKey, reviewer.displayName)}
              </span>
            </span>
          </p>
        ) : (
          <p className="text-[var(--color-ink-muted)]">{BOARD_PROCESS_LINE}</p>
        )}
        <p className="mt-2">
          <Link
            href={ROUTES.howQuestionsAreReviewed}
            prefetch={false}
            className="font-semibold text-[var(--color-accent)] hover:underline"
          >
            How our questions are built and reviewed
          </Link>
        </p>
      </div>

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
            {studyGuide ? (
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-[var(--color-ink-muted)]">
                The {config.shortName} study guide is included with the 5-day free trial.
              </p>
            ) : null}
            <ul className="mt-10 grid gap-4 sm:grid-cols-3" role="list">
              {productLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    prefetch={false}
                    className="block h-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition hover:border-[var(--color-accent)]/40"
                  >
                    <p
                      className="text-sm font-bold"
                      style={{ color: item.accent ? "var(--color-accent)" : "var(--color-ink)" }}
                    >
                      {item.title}
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

      <PriceSection trialHref={landingTrialHrefForExam(examKey)} />

      <div className="mx-auto max-w-5xl px-5 pb-8 pt-4 sm:px-6">
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
                    prefetch={false}
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
                prefetch={false}
                className="text-base font-semibold text-[var(--color-accent)] hover:underline"
              >
                Toolkit →
              </Link>
            </li>
          </ul>
        </section>

      </div>
    </div>
  );
}
