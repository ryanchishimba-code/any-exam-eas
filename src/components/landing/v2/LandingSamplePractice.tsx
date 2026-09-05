"use client";

/**
 * First section under the hero — interactive sample for the selected board.
 * NCLEX uses real NGN formats; other boards use curated interactive MCQs.
 */

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { LandingCta } from "@/components/landing/LandingCta";
import { useLandingExamSelection } from "@/components/landing/v2/LandingExamSelectionContext";
import { EXAM_CATALOG } from "@/lib/edtech/exams";
import { getLandingMcqSample } from "@/lib/demo/landing-samples";
import { formatTrialCtaLabel } from "@/lib/site";
import { cn } from "@/lib/utils";

const NgnInteractiveDemo = dynamic(
  () =>
    import("@/components/home/NgnInteractiveDemo").then(
      (m) => m.NgnInteractiveDemo
    ),
  {
    ssr: false,
    loading: () => (
      <div
        className="aee-landing-sample__card min-h-[280px] animate-pulse"
        aria-hidden
      />
    ),
  }
);

const LABELS = ["A", "B", "C", "D"] as const;

function LandingMcqPractice({ examSlug }: { examSlug: string }) {
  const sample = getLandingMcqSample(examSlug as import("@/types/edtech").ExamSlug);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    setSelected(null);
    setRevealed(false);
  }, [examSlug]);

  const correct = revealed && selected === sample.correct;

  return (
    <article className="aee-landing-sample__card">
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
          onClick={() => setRevealed(true)}
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

/** Mount heavy NGN player only when the sample stage is near the viewport. */
function DeferredNgnSample({ trialHref }: { trialHref: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const el = hostRef.current;
    if (!el || shouldLoad) return;

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
  }, [shouldLoad]);

  return (
    <div ref={hostRef}>
      {shouldLoad ? (
        <NgnInteractiveDemo embedded trialHref={trialHref} />
      ) : (
        <div
          className="aee-landing-sample__card min-h-[280px] animate-pulse"
          aria-hidden
        />
      )}
    </div>
  );
}

export function LandingSamplePractice() {
  const { selectedExam, trialHref } = useLandingExamSelection();
  const examName = EXAM_CATALOG[selectedExam]?.shortName ?? "your exam";

  return (
    <section
      id="try-a-question"
      className="aee-landing-sample scroll-mt-24"
      aria-labelledby="try-a-question-heading"
    >
      <div className="aee-landing-sample__inner">
        <header className="aee-landing-sample__intro">
          <p className="aee-landing-sample__eyebrow">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            Try before you signup
          </p>
          <h2 id="try-a-question-heading" className="aee-landing-sample__title">
            Answer a real {examName} item —{" "}
            <span className="aee-landing-sample__title-accent">no account needed.</span>
          </h2>
          <p className="aee-landing-sample__lede">
            Same interactive player as the app. Switch boards with the chips above to preview
            another exam.
          </p>
        </header>

        <div className="aee-landing-sample__stage">
          {selectedExam === "nclex" ? (
            <DeferredNgnSample trialHref={trialHref} />
          ) : (
            <LandingMcqPractice examSlug={selectedExam} />
          )}
        </div>

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
          <p className="aee-landing-sample__cta-meta">{formatTrialCtaLabel()} · no card required</p>
        </div>
      </div>
    </section>
  );
}
