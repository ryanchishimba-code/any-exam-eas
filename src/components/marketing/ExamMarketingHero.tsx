"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LandingCta } from "@/components/landing/LandingCta";
import { LandingExamSelectionProvider } from "@/components/landing/v2/LandingExamSelectionContext";
import {
  formatExamHeroEyebrow,
  formatExamHeroHeadline,
  formatExamHeroTrialOffer,
  formatExamHeroProductLine,
  landingTrialHrefForExam,
} from "@/lib/landing/content";
import { formatTrialCtaLabel } from "@/lib/site";
import type { FormatCounts } from "@/lib/inventory/active-questions";
import type { ExamSeoKey } from "@/lib/seo/exam-config";

type Props = {
  examKey: ExamSeoKey;
  /** Labeled per-board count, e.g. "7,581 active NCLEX questions". */
  questionCountLine: string;
  countSource?: "active-inventory" | "published-floor";
  activeCount?: number | null;
  formats?: FormatCounts | null;
  /** Real product visual. Omitted when we do not have one for this board. */
  visual?: ReactNode;
};

function ExamMarketingHeroCopy({
  examKey,
  questionCountLine,
  countSource,
  activeCount,
  visual = null,
}: Props) {
  const trialHref = landingTrialHrefForExam(examKey);

  return (
    <section
      className="aee-hero-beat aee-hero-beat--practice relative w-full overflow-hidden"
      aria-labelledby={`${examKey}-hero-heading`}
      data-exam-hero={examKey}
    >
      <div className="aee-hero-beat__atmosphere" aria-hidden />
      <div className="aee-hero-beat__vignette" aria-hidden />

      <div className="aee-hero-beat__shell">
        <div className="aee-hero-beat__copy">
          <p className="aee-hero-beat__brand">{formatExamHeroEyebrow(examKey)}</p>

          <h1 id={`${examKey}-hero-heading`} className="aee-hero-beat__headline">
            {formatExamHeroHeadline(examKey)}
          </h1>

          <p className="aee-hero-beat__subline">{formatExamHeroProductLine(examKey)}</p>

          <div className="aee-hero-beat__actions">
            <LandingCta
              href={trialHref}
              ctaName={`exam_hero_trial_${examKey}`}
              location="exam_marketing_hero"
              className="aee-flagship-cta--hero aee-flagship-cta--xl aee-flagship-cta--primary aee-flagship-cta--on-dark group aee-hero-beat__cta"
              icon={
                <ArrowRight
                  className="h-5 w-5 transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              }
            >
              {formatTrialCtaLabel()}
            </LandingCta>
            <Link href="#try-questions" className="aee-hero-beat__secondary">
              Try free sample questions
            </Link>
          </div>

          <p className="aee-hero-beat__meta" data-offer-line>
            {formatExamHeroTrialOffer()}
          </p>

          {questionCountLine ? (
            <p
              className="aee-hero-beat__countline"
              data-count-source={countSource ?? "published-floor"}
              data-active-question-count={
                typeof activeCount === "number" ? activeCount : undefined
              }
            >
              {questionCountLine}
            </p>
          ) : null}
        </div>

        {visual ? (
          <div className="aee-hero-beat__visual aee-hero-beat__visual--practice">{visual}</div>
        ) : null}
      </div>
    </section>
  );
}

/** Conversion ATF for board hubs — dark hero, live count, board-specific sample. */
export function ExamMarketingHero({
  examKey,
  questionCountLine,
  countSource,
  activeCount,
  formats = null,
  visual = null,
}: Props) {
  return (
    <LandingExamSelectionProvider
      initialExam={examKey}
      boardFormats={{ [examKey]: formats }}
    >
      <ExamMarketingHeroCopy
        examKey={examKey}
        questionCountLine={questionCountLine}
        countSource={countSource}
        activeCount={activeCount}
        formats={formats}
        visual={visual}
      />
    </LandingExamSelectionProvider>
  );
}
