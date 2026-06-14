"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ChevronRight, GraduationCap, HelpCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { anatomyPracticeHref } from "@/lib/edtech/practice-links";
import type { useTeachSession } from "@/components/anatomy/systems/useTeachSession";
import { anatomyUi } from "@/lib/anatomy/anatomy-ui";
import type { ExamSlug } from "@/types/edtech";
import { cn } from "@/lib/utils";

type TeachSession = ReturnType<typeof useTeachSession>;

type Props = {
  examSlug: ExamSlug;
  session: TeachSession;
};

/** Presentational teach UI — driven by useTeachSession (no viewer coupling). */
export function TeachHost({ examSlug, session }: Props) {
  const {
    mode,
    tour,
    currentStep,
    currentProcedure,
    tourProgress,
    tourFinished,
    currentQuiz,
    quizTotal,
    quizComplete,
    state,
    anatomyTours,
    procedureTours,
    startTour,
    advanceTour,
    startQuiz,
    reset,
    quizHint,
  } = session;

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--color-accent)]/10">
            <GraduationCap className="h-5 w-5 text-[var(--color-accent)]" aria-hidden />
          </div>
          <div>
            <h3 className={anatomyUi.sectionLabel}>Study tools</h3>
            <p className={anatomyUi.sectionHint}>Guided tours and click-to-answer quizzes</p>
          </div>
        </div>
        {mode !== "off" ? (
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1 rounded-full bg-black/[0.05] px-3 py-1.5 text-[12px] font-medium text-[var(--color-ink-muted)] transition hover:bg-black/[0.08]"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden />
            Exit
          </button>
        ) : null}
      </div>

      {mode === "off" ? (
        <div className="mt-4 space-y-4">
          <TourGrid label="Anatomy tours" tours={anatomyTours} onStart={startTour} />
          {procedureTours.length > 0 ? (
            <TourGrid label="Procedure tours" tours={procedureTours} onStart={startTour} />
          ) : null}
          <Button
            variant="secondary"
            className="h-11 w-full justify-center rounded-full text-[14px]"
            onClick={startQuiz}
          >
            <HelpCircle className="mr-2 h-4 w-4" aria-hidden />
            Start structure quiz ({quizTotal} questions)
          </Button>
        </div>
      ) : null}

      {mode === "tour" && tour && currentStep ? (
        <motion.div
          key={`${tour.id}-${state.tourStepIndex}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(anatomyUi.detailSection, "mt-4 space-y-3")}
        >
          <div className="flex items-center justify-between text-[12px] text-[var(--color-ink-muted)]">
            <span>{tour.title}</span>
            <span>{tourProgress}</span>
          </div>
          {currentProcedure ? (
            <p className="text-[12px] font-semibold text-[var(--color-accent)]">
              Procedure: {currentProcedure.name}
            </p>
          ) : null}
          <p className="text-[15px] leading-relaxed text-[var(--color-ink)]">{currentStep.narration}</p>
          <Button
            variant="primary"
            className="h-11 w-full justify-center rounded-full text-[14px] font-semibold"
            onClick={advanceTour}
          >
            {tourFinished ? "Finish tour" : currentProcedure ? "Next step" : "Next structure"}
            <ChevronRight className="ml-1 h-4 w-4" aria-hidden />
          </Button>
          {tourFinished ? (
            <Button
              href={anatomyPracticeHref(examSlug, 10)}
              variant="secondary"
              className="h-11 w-full justify-center rounded-full text-[14px]"
            >
              Practice anatomy questions
            </Button>
          ) : null}
        </motion.div>
      ) : null}

      {mode === "quiz" && currentQuiz && !quizComplete ? (
        <div className={cn(anatomyUi.detailSection, "mt-4 space-y-3")}>
          <div className="flex items-center justify-between text-[12px] text-[var(--color-ink-muted)]">
            <span>
              Question {state.quizIndex + 1} of {quizTotal}
            </span>
            <span>Score: {state.quizScore}</span>
          </div>
          <p className="text-[15px] font-medium text-[var(--color-ink)]">{currentQuiz.prompt}</p>
          {state.quizFeedback ? (
            <p
              className={cn(
                "flex items-center gap-1.5 text-[14px] font-medium",
                state.quizFeedback.startsWith("Correct")
                  ? "text-emerald-600"
                  : "text-amber-700"
              )}
            >
              {state.quizFeedback.startsWith("Correct") ? (
                <CheckCircle2 className="h-4 w-4" aria-hidden />
              ) : null}
              {state.quizFeedback}
            </p>
          ) : (
            <p className="text-[12px] text-[var(--color-ink-muted)]">{quizHint}</p>
          )}
        </div>
      ) : null}

      {quizComplete && state.quizFeedback ? (
        <div className={cn(anatomyUi.detailSection, "mt-4 space-y-3")}>
          <p className="flex items-center gap-1.5 text-[14px] font-medium text-emerald-600">
            <CheckCircle2 className="h-4 w-4" aria-hidden />
            {state.quizFeedback}
          </p>
          <Button
            href={anatomyPracticeHref(examSlug, 10)}
            variant="secondary"
            className="h-11 w-full justify-center rounded-full text-[14px]"
          >
            Keep drilling — anatomy bank
          </Button>
        </div>
      ) : null}
    </section>
  );
}

function TourGrid({
  label,
  tours,
  onStart,
}: {
  label: string;
  tours: { id: string; title: string; subtitle: string; examFocus: string }[];
  onStart: (tourId: string) => void;
}) {
  if (tours.length === 0) return null;

  return (
    <div className="space-y-2">
      <p className="text-[12px] font-medium text-[var(--color-ink-muted)]">{label}</p>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {tours.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => onStart(t.id)}
            className="group rounded-[16px] border border-black/[0.05] bg-[var(--color-surface)]/70 p-3.5 text-left transition hover:bg-white hover:shadow-[var(--shadow-apple-sm)] active:scale-[0.99]"
          >
            <p className="text-[14px] font-semibold text-[var(--color-ink)]">{t.title}</p>
            <p className="mt-1 text-[12px] leading-relaxed text-[var(--color-ink-muted)]">
              {t.subtitle}
            </p>
            <span className="mt-2 inline-block text-[10px] font-semibold uppercase tracking-wide text-[var(--color-accent)]">
              {t.examFocus}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
