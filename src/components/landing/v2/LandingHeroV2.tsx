"use client";

/**
 * LandingHeroV2 — six-board H1 + exam pills + interactive free-question widget.
 */

import { useMemo } from "react";
import { ArrowRight } from "lucide-react";
import { LandingCta } from "@/components/landing/LandingCta";
import { LandingHeroExamStrip } from "@/components/home/LandingHeroExamStrip";
import { LandingHeroPractice } from "@/components/landing/v2/LandingSamplePractice";
import { useLandingExamSelection } from "@/components/landing/v2/LandingExamSelectionContext";
import {
  LANDING_HERO_CTA_DISCLOSURE,
  LANDING_HERO_EYEBROW,
  LANDING_HERO_HEADLINE,
  LANDING_HERO_SUBLINE_BODY,
  formatExamHeroCountLine,
} from "@/lib/landing/content";
import { analytics } from "@/lib/analytics";
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

  const examCountLine = useMemo(() => {
    const row = bankCounts.exams?.find((e) => e.slug === selectedExam);
    return formatExamHeroCountLine(row?.questionsLabel ?? row?.countLabel);
  }, [bankCounts.exams, selectedExam]);

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
            {LANDING_HERO_HEADLINE}
          </h1>

          {examCountLine ? (
            <p className="aee-hero-beat__countline" aria-live="polite">
              {examCountLine}
            </p>
          ) : null}

          <p className="aee-hero-beat__subline">{LANDING_HERO_SUBLINE_BODY}</p>

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
          </div>

          <p className="aee-hero-beat__meta">{LANDING_HERO_CTA_DISCLOSURE}</p>
        </div>

        <div className="aee-hero-beat__visual aee-hero-beat__visual--practice">
          <span className="aee-hero-beat__stage-glow" aria-hidden />
          <LandingHeroPractice />
        </div>
      </div>
    </section>
  );
}
