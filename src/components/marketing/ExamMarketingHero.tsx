"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LandingCta } from "@/components/landing/LandingCta";
import { LandingHeroPractice } from "@/components/landing/v2/LandingSamplePractice";
import { LandingExamSelectionProvider } from "@/components/landing/v2/LandingExamSelectionContext";
import {
  formatExamHeroEyebrow,
  formatExamHeroHeadline,
  formatExamHeroTrialOffer,
  formatExamHubSubline,
  landingTrialHrefForExam,
} from "@/lib/landing/content";
import { examHubSecondaryLink } from "@/lib/marketing/exam-hub";
import { formatTrialCtaLabel } from "@/lib/site";
import type { ExamSeoKey } from "@/lib/seo/exam-config";

type Props = {
  examKey: ExamSeoKey;
  /** Labeled per-board count, e.g. "7,581 active NCLEX questions". */
  questionCountLine: string;
  /** MCQ / NGN / case split from the active inventory, when those formats exist. */
  formatLine?: string | null;
  /** What "active" means, or the published-floor disclaimer. */
  activeDefinition?: string | null;
  countSource?: "active-inventory" | "published-floor";
  activeCount?: number | null;
};

function ExamMarketingHeroCopy({
  examKey,
  questionCountLine,
  formatLine,
  activeDefinition,
  countSource,
  activeCount,
}: Props) {
  const trialHref = landingTrialHrefForExam(examKey);
  const secondary = examHubSecondaryLink(examKey);

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

          <p className="aee-hero-beat__subline">{formatExamHubSubline(examKey)}</p>

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
          {formatLine ? (
            <p className="aee-hero-beat__countline">{formatLine}</p>
          ) : null}
          {activeDefinition ? (
            <p className="aee-hero-beat__countline" title={activeDefinition}>
              {activeDefinition}
            </p>
          ) : null}

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
            <Link href={secondary.href} className="aee-hero-beat__secondary">
              {secondary.label}
            </Link>
          </div>

          <p className="aee-hero-beat__meta">{formatExamHeroTrialOffer()}</p>
        </div>

        <div className="aee-hero-beat__visual aee-hero-beat__visual--practice">
          <span className="aee-hero-beat__stage-glow" aria-hidden />
          <LandingHeroPractice />
        </div>
      </div>
    </section>
  );
}

/** Conversion ATF for board hubs — dark hero, live count, board-specific sample. */
export function ExamMarketingHero({
  examKey,
  questionCountLine,
  formatLine,
  activeDefinition,
  countSource,
  activeCount,
}: Props) {
  return (
    <LandingExamSelectionProvider initialExam={examKey}>
      <ExamMarketingHeroCopy
        examKey={examKey}
        questionCountLine={questionCountLine}
        formatLine={formatLine}
        activeDefinition={activeDefinition}
        countSource={countSource}
        activeCount={activeCount}
      />
    </LandingExamSelectionProvider>
  );
}
