"use client";

/**
 * Interactive sample for the selected board.
 * - variant="hero": compact player for ATF (product-in-hero)
 * - variant="section": full mid-page block (legacy / optional)
 *
 * NCLEX uses NGN formats; other boards use curated interactive MCQs.
 */

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { ArrowRight, Check } from "lucide-react";
import { LandingCta } from "@/components/landing/LandingCta";
import { useLandingExamSelection } from "@/components/landing/v2/LandingExamSelectionContext";
import { EXAM_CATALOG } from "@/lib/edtech/exams";
import { getLandingMcqSample } from "@/lib/demo/landing-samples";
import { analytics } from "@/lib/analytics";
import { formatTrialCtaLabel } from "@/lib/site";
import { cn } from "@/lib/utils";
import type { ExamSlug } from "@/types/edtech";

const NgnInteractiveDemo = dynamic(
  () =>
    import("@/components/home/NgnInteractiveDemo").then(
      (m) => m.NgnInteractiveDemo
    ),
  {
    ssr: false,
    loading: () => (
      <div
        className="aee-landing-sample__card aee-landing-sample__card--hero min-h-[200px] animate-pulse"
        aria-hidden
      />
    ),
  }
);

const LABELS = ["A", "B", "C", "D"] as const;

function LandingMcqPractice({
  examSlug,
  compact = false,
}: {
  examSlug: string;
  compact?: boolean;
}) {
  const sample = getLandingMcqSample(examSlug as ExamSlug);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    setSelected(null);
    setRevealed(false);
  }, [examSlug]);

  const correct = revealed && selected === sample.correct;

  return (
    <article
      className={cn(
        "aee-landing-sample__card",
        compact && "aee-landing-sample__card--hero"
      )}
    >
      <header className="aee-landing-sample__card-head">
        <span
          className="aee-landing-sample__badge"
          style={{ background: sample.accent }}
        >
          {sample.examLabel}
        </span>
        <span className="aee-landing-sample__hint">Sample · no signup</span>
      </header>

      <p className="aee-landing-sample__stem">{sample.stem}</p>

      <ul className="aee-landing-sample__options" role="listbox" aria-label="Answer choices">
        {sample.options.map((opt, i) => {
          const isSelected = selected === opt.id;
          const isCorrectOpt = revealed && opt.id === sample.correct;
          const isWrong = revealed && isSelected && opt.id !== sample.correct;
          return (
            <li key={opt.id}>
              <button
                type="button"
                role="option"
                aria-selected={isSelected}
                disabled={revealed}
                onClick={() => setSelected(opt.id)}
                className={cn(
                  "aee-landing-sample__option",
                  isSelected && !revealed && "aee-landing-sample__option--selected",
                  isCorrectOpt && "aee-landing-sample__option--correct",
                  isWrong && "aee-landing-sample__option--wrong"
                )}
              >
                <span className="aee-landing-sample__letter" aria-hidden>
                  {LABELS[i]}
                </span>
                {opt.text}
              </button>
            </li>
          );
        })}
      </ul>

      {!revealed ? (
        <button
          type="button"
          disabled={!selected}
          onClick={() => {
            setRevealed(true);
            analytics.ctaClicked(`sample_check_answer_${examSlug}`, "hero_practice");
          }}
          className="aee-landing-sample__check"
        >
          <Check className="h-4 w-4" aria-hidden />
          Check answer
        </button>
      ) : (
        <div className="aee-landing-sample__result">
          <p
            className={cn(
              "aee-landing-sample__verdict",
              correct ? "aee-landing-sample__verdict--ok" : "aee-landing-sample__verdict--miss"
            )}
          >
            {correct ? "Correct" : "Not quite"}
          </p>
          <p className="aee-landing-sample__rationale">{sample.rationale}</p>
          <button
            type="button"
            onClick={() => {
              setSelected(null);
              setRevealed(false);
            }}
            className="aee-landing-sample__retry"
          >
            Try again
          </button>
        </div>
      )}
    </article>
  );
}

/** Mount heavy NGN player when near viewport (or immediately for hero). */
function DeferredNgnSample({
  trialHref,
  eager = false,
}: {
  trialHref: string;
  eager?: boolean;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(eager);

  useEffect(() => {
    if (eager || shouldLoad) return;
    const el = hostRef.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setShouldLoad(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShouldLoad(true);
          io.disconnect();
        }
      },
      { rootMargin: "240px 0px", threshold: 0.01 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [eager, shouldLoad]);

  return (
    <div ref={hostRef}>
      {shouldLoad ? (
        <NgnInteractiveDemo embedded trialHref={trialHref} />
      ) : (
        <div
          className="aee-landing-sample__card aee-landing-sample__card--hero min-h-[200px] animate-pulse"
          aria-hidden
        />
      )}
    </div>
  );
}

export function LandingPracticeStage({
  compact = false,
  eagerNgn = false,
}: {
  compact?: boolean;
  eagerNgn?: boolean;
}) {
  const { selectedExam, trialHref } = useLandingExamSelection();

  return (
    <div className={cn("aee-landing-sample__stage", compact && "aee-landing-sample__stage--hero")}>
      {selectedExam === "nclex" ? (
        <DeferredNgnSample trialHref={trialHref} eager={eagerNgn} />
      ) : (
        <LandingMcqPractice examSlug={selectedExam} compact={compact} />
      )}
    </div>
  );
}

/** ATF product visual — interactive player for the selected exam. */
export function LandingHeroPractice() {
  const { selectedExam, trialHref } = useLandingExamSelection();
  const examName = EXAM_CATALOG[selectedExam]?.shortName ?? "your exam";

  return (
    <div
      id="try-a-question"
      className="aee-hero-practice"
      data-hero-practice
      tabIndex={-1}
      aria-label={`Try a free ${examName} question`}
    >
      <div className="aee-hero-practice__chrome">
        <div className="aee-hero-practice__chrome-bar" aria-hidden>
          <span />
          <span />
          <span />
        </div>
        <p className="aee-hero-practice__label">
          Free {examName} sample · no account
        </p>
        <LandingPracticeStage compact eagerNgn />
        <div className="aee-hero-practice__footer">
          <LandingCta
            href={trialHref}
            ctaName={`sample_trial_${selectedExam}`}
            location="hero_practice"
            className="aee-flagship-cta--hero aee-hero-practice__trial group"
            icon={
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden
              />
            }
          >
            Start {examName} free trial
          </LandingCta>
          <p className="aee-hero-practice__meta">{formatTrialCtaLabel()} · no card required</p>
        </div>
      </div>
    </div>
  );
}

/** Thin proof under the hero — avoids a second competing sample block. */
export function LandingSampleProof() {
  return (
    <p className="aee-landing-sample-proof">
      Same interactive player as Study Hub — answer above, then start free with no card.
    </p>
  );
}

/** @deprecated Prefer LandingHeroPractice in ATF; kept for any external imports. */
export function LandingSamplePractice() {
  const { selectedExam, trialHref } = useLandingExamSelection();
  const examName = EXAM_CATALOG[selectedExam]?.shortName ?? "your exam";

  return (
    <section
      className="aee-landing-sample scroll-mt-24"
      aria-labelledby="try-a-question-heading"
    >
      <div className="aee-landing-sample__inner">
        <header className="aee-landing-sample__intro">
          <h2 id="try-a-question-heading" className="aee-landing-sample__title">
            Answer a real {examName} item —{" "}
            <span className="aee-landing-sample__title-accent">no account needed.</span>
          </h2>
        </header>
        <LandingPracticeStage />
        <div className="aee-landing-sample__cta">
          <LandingCta
            href={trialHref}
            ctaName={`sample_trial_${selectedExam}`}
            location="try-a-question"
            className="aee-flagship-cta--hero group"
            icon={
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden
              />
            }
          >
            Try {examName} free
          </LandingCta>
        </div>
      </div>
    </section>
  );
}
