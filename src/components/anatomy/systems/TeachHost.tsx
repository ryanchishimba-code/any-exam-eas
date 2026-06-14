"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ChevronRight, GraduationCap, HelpCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { anatomyPracticeHref } from "@/lib/edtech/practice-links";
import type { useTeachSession } from "@/components/anatomy/systems/useTeachSession";
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
    quizActive,
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
    <section className="p-1">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-indigo-600" aria-hidden />
          <div>
            <h3 className="text-sm font-bold text-[var(--color-ink)]">Study tools</h3>
            <p className="text-xs text-[var(--color-ink-muted)]">
              Guided tours and click-to-answer quizzes
            </p>
          </div>
        </div>
        {mode !== "off" ? (
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium text-[var(--color-ink-muted)] hover:bg-white/80"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden />
            Exit
          </button>
        ) : null}
      </div>

      {mode === "off" ? (
        <div className="mt-4 space-y-3">
          <TourGrid label="Anatomy tours" tours={anatomyTours} onStart={startTour} />
          {procedureTours.length > 0 ? (
            <TourGrid
              label="Procedure tours"
              tours={procedureTours}
              onStart={startTour}
              accent="indigo"
            />
          ) : null}
          <Button
            variant="secondary"
            className="mt-2 w-full justify-center px-4 py-2.5 text-sm"
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
          className="mt-4 space-y-3"
        >
          <div className="flex items-center justify-between text-xs text-[var(--color-ink-muted)]">
            <span>{tour.title}</span>
            <span>{tourProgress}</span>
          </div>
          {currentProcedure ? (
            <p className="text-xs font-semibold text-indigo-700">
              Procedure: {currentProcedure.name}
            </p>
          ) : null}
          <p className="text-sm leading-relaxed text-[var(--color-ink)]">{currentStep.narration}</p>
          <Button
            variant="primary"
            className="w-full justify-center px-4 py-2.5 text-sm"
            onClick={advanceTour}
          >
            {tourFinished ? "Finish tour" : currentProcedure ? "Next step" : "Next structure"}
            <ChevronRight className="ml-1 h-4 w-4" aria-hidden />
          </Button>
          {tourFinished ? (
            <Button
              href={anatomyPracticeHref(examSlug, 10)}
              variant="secondary"
              className="w-full justify-center px-4 py-2.5 text-sm"
            >
              Practice anatomy questions
            </Button>
          ) : null}
        </motion.div>
      ) : null}

      {mode === "quiz" && currentQuiz && !quizComplete ? (
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between text-xs text-[var(--color-ink-muted)]">
            <span>
              Question {state.quizIndex + 1} of {quizTotal}
            </span>
            <span>Score: {state.quizScore}</span>
          </div>
          <p className="text-sm font-medium text-[var(--color-ink)]">{currentQuiz.prompt}</p>
          {state.quizFeedback ? (
            <p
              className={cn(
                "flex items-center gap-1.5 text-sm font-medium",
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
            <p className="text-xs text-[var(--color-ink-muted)]">{quizHint}</p>
          )}
        </div>
      ) : null}

      {quizComplete && state.quizFeedback ? (
        <div className="mt-4 space-y-3">
          <p className="flex items-center gap-1.5 text-sm font-medium text-emerald-600">
            <CheckCircle2 className="h-4 w-4" aria-hidden />
            {state.quizFeedback}
          </p>
          <Button
            href={anatomyPracticeHref(examSlug, 10)}
            variant="secondary"
            className="w-full justify-center px-4 py-2.5 text-sm"
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
  accent = "slate",
}: {
  label: string;
  tours: { id: string; title: string; subtitle: string; examFocus: string }[];
  onStart: (tourId: string) => void;
  accent?: "slate" | "indigo";
}) {
  if (tours.length === 0) return null;
  const hoverBorder = accent === "indigo" ? "hover:border-indigo-200" : "hover:border-teal-200";
  const tagColor = accent === "indigo" ? "text-indigo-600" : "text-teal-600";

  return (
    <>
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
        {label}
      </p>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {tours.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => onStart(t.id)}
            className={cn(
              "group rounded-xl border border-black/[0.06] bg-white/90 p-3 text-left transition hover:shadow-sm",
              hoverBorder
            )}
          >
            <p className="text-sm font-semibold text-[var(--color-ink)]">{t.title}</p>
            <p className="mt-1 text-xs text-[var(--color-ink-muted)]">{t.subtitle}</p>
            <span
              className={cn(
                "mt-2 inline-block text-[10px] font-bold uppercase tracking-wide",
                tagColor
              )}
            >
              {t.examFocus}
            </span>
          </button>
        ))}
      </div>
    </>
  );
}
