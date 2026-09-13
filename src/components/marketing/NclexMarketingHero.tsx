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
  landingTrialHrefForExam,
} from "@/lib/landing/content";
import { ROUTES } from "@/lib/routes";
import { formatTrialCtaLabel } from "@/lib/site";

type Props = {
  /** Labeled per-board count from getPublishedQuestionStats(), e.g. "8,327 NCLEX questions live". */
  questionCountLine: string;
};

function NclexMarketingHeroCopy({ questionCountLine }: Props) {
  const trialHref = landingTrialHrefForExam("nclex");

  return (
    <section
      className="aee-hero-beat aee-hero-beat--practice relative w-full overflow-hidden"
      aria-labelledby="nclex-hero-heading"
      data-nclex-hero
    >
      <div className="aee-hero-beat__atmosphere" aria-hidden />
      <div className="aee-hero-beat__vignette" aria-hidden />

      <div className="aee-hero-beat__shell">
        <div className="aee-hero-beat__copy">
          <p className="aee-hero-beat__brand">{formatExamHeroEyebrow("nclex")}</p>

          <h1 id="nclex-hero-heading" className="aee-hero-beat__headline">
            {formatExamHeroHeadline("nclex")}
          </h1>

          <p className="aee-hero-beat__subline">
            NGN vignettes and clinical judgment — try a free sample, then keep going.
          </p>

          <p className="aee-hero-beat__countline">{questionCountLine}</p>

          <div className="aee-hero-beat__actions">
            <LandingCta
              href={trialHref}
              ctaName="exam_hero_trial_nclex"
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
            <Link href={ROUTES.nclexStudyGuide} className="aee-hero-beat__secondary">
              Free NCLEX study guide
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

/** Conversion ATF for /nclex — homepage energy, NCLEX-only copy, NGN sample on the right. */
export function NclexMarketingHero({ questionCountLine }: Props) {
  return (
    <LandingExamSelectionProvider initialExam="nclex">
      <NclexMarketingHeroCopy questionCountLine={questionCountLine} />
    </LandingExamSelectionProvider>
  );
}
