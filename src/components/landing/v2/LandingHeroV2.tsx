"use client";

/**
 * LandingHeroV2 — exam-led ATF with interactive practice player (product-in-hero).
 */

import Link from "next/link";
import { useMemo } from "react";
import { ArrowRight } from "lucide-react";
import { LandingCta } from "@/components/landing/LandingCta";
import { LandingHeroExamStrip } from "@/components/home/LandingHeroExamStrip";
import { LandingHeroPractice } from "@/components/landing/v2/LandingSamplePractice";
import { useLandingExamSelection } from "@/components/landing/v2/LandingExamSelectionContext";
import {
  LANDING_HERO_EYEBROW,
  formatExamHeroHeadline,
  formatExamHeroSubline,
} from "@/lib/landing/content";
import { analytics } from "@/lib/analytics";
import { formatLandingStickyDetail } from "@/lib/site";
import { useTrialCtaTarget } from "@/lib/client/use-trial-cta-target";
import type { LandingBankCountsDisplay } from "@/lib/marketing/question-bank-counts";

function focusHeroPractice() {
  const el = document.getElementById("try-a-question");
  if (!el) return;
  el.focus({ preventScroll: true });
  el.scrollIntoView({ behavior: "smooth", block: "nearest" });
  const firstOption = el.querySelector<HTMLElement>(
    'button[role="option"], button.aee-landing-sample__option, .aee-ngn-demo button'
  );
  firstOption?.focus({ preventScroll: true });
}

export function LandingHeroV2({ bankCounts }: { bankCounts: LandingBankCountsDisplay }) {
  const { selectedExam, trialHref } = useLandingExamSelection();
  const trialCta = useTrialCtaTarget(trialHref);

  const examCount = useMemo(() => {
    const row = bankCounts.exams?.find((e) => e.slug === selectedExam);
    return row?.questionsLabel ?? row?.countLabel;
  }, [bankCounts.exams, selectedExam]);

  const headline = formatExamHeroHeadline(selectedExam);
  const subline = formatExamHeroSubline(selectedExam, examCount);

  return (
    <section
      className="aee-hero-beat aee-hero-beat--practice relative w-full overflow-hidden"
      aria-labelledby="hero-heading"
      data-landing-hero
    >
      <div className="aee-hero-beat__atmosphere" aria-hidden />
      <div className="aee-hero-beat__vignette" aria-hidden />

      <div className="aee-hero-beat__shell">
        <div className="aee-hero-beat__copy">
          <p className="aee-hero-beat__brand">{LANDING_HERO_EYEBROW}</p>

          <h1 id="hero-heading" className="aee-hero-beat__headline">
            {headline}
          </h1>

          <p className="aee-hero-beat__subline">{subline}</p>

          <LandingHeroExamStrip
            variant="chips"
            selectable
            bankCounts={bankCounts}
            className="aee-hero-beat__exams"
          />

          <div className="aee-hero-beat__actions">
            {trialCta.isMemberContinue ? (
              <LandingCta
                href={trialCta.href}
                ctaName="hero_continue"
                location="hero"
                className="aee-flagship-cta--hero aee-flagship-cta--xl aee-flagship-cta--primary aee-flagship-cta--on-dark group aee-hero-beat__cta"
                icon={
                  <ArrowRight
                    className="h-5 w-5 transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  />
                }
              >
                {trialCta.label}
              </LandingCta>
            ) : (
              <>
                <button
                  type="button"
                  className="aee-flagship-cta aee-flagship-cta--hero aee-flagship-cta--xl aee-flagship-cta--primary aee-flagship-cta--on-dark group aee-hero-beat__cta"
                  onClick={() => {
                    analytics.ctaClicked("hero_try_question", "hero");
                    focusHeroPractice();
                  }}
                >
                  Try a free question
                  <ArrowRight
                    className="h-5 w-5 transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </button>
                <LandingCta
                  href={trialCta.href}
                  ctaName="hero_trial"
                  location="hero"
                  variant="ghost-on-dark"
                  className="aee-hero-beat__secondary aee-hero-beat__secondary--trial"
                >
                  Start free trial
                </LandingCta>
              </>
            )}
            <Link
              href="#pricing"
              prefetch={false}
              className="aee-hero-beat__secondary"
              onClick={() => analytics.ctaClicked("hero_see_pricing", "hero")}
            >
              See pricing
            </Link>
          </div>

          <p className="aee-hero-beat__meta">{formatLandingStickyDetail()}</p>
        </div>

        <div className="aee-hero-beat__visual aee-hero-beat__visual--practice">
          <span className="aee-hero-beat__stage-glow" aria-hidden />
          <LandingHeroPractice />
        </div>
      </div>
    </section>
  );
}
