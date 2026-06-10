"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ChevronRight, GraduationCap, HelpCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { anatomyPracticeHref } from "@/lib/edtech/practice-links";
import {
  ANATOMY_QUIZ_QUESTIONS,
  getTourById,
  getToursForExam,
} from "@/lib/anatomy/tours";
import type { ExamSlug } from "@/types/edtech";
import { cn } from "@/lib/utils";

type Mode = "off" | "tour" | "quiz";

type Props = {
  examSlug: ExamSlug;
  selectedTourId: string | null;
  onTourChange: (id: string | null) => void;
  tourStepIndex: number;
  onTourStepChange: (index: number) => void;
  highlightedId: string | null;
  onHighlight: (id: string | null) => void;
  onSelectStructure: (id: string) => void;
  quizActive: boolean;
  onQuizActiveChange: (v: boolean) => void;
  onQuizHandlerChange: (handler: ((id: string) => void) | null) => void;
};

export function TeachModePanel({
  examSlug,
  selectedTourId,
  onTourChange,
  tourStepIndex,
  onTourStepChange,
  highlightedId: _highlightedId,
  onHighlight,
  onSelectStructure,
  quizActive,
  onQuizActiveChange,
  onQuizHandlerChange,
}: Props) {
  const [mode, setMode] = useState<Mode>("off");
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);

  const tour = selectedTourId ? getTourById(selectedTourId) : undefined;
  const currentStep = tour?.steps[tourStepIndex];
  const currentQuiz = ANATOMY_QUIZ_QUESTIONS[quizIndex];
  const tours = useMemo(() => getToursForExam(examSlug), [examSlug]);

  useEffect(() => {
    if (selectedTourId && !quizActive) setMode("tour");
    if (!selectedTourId && !quizActive) setMode("off");
  }, [quizActive, selectedTourId]);

  const handleQuizAttempt = useCallback(
    (structureId: string) => {
      if (!quizActive || !currentQuiz) return;
      if (structureId === currentQuiz.structureId) {
        setQuizFeedback("Correct!");
        setQuizScore((s) => {
          const nextScore = s + 1;
          window.setTimeout(() => {
            const next = quizIndex + 1;
            if (next >= ANATOMY_QUIZ_QUESTIONS.length) {
              setQuizFeedback(
                `Quiz complete — ${nextScore}/${ANATOMY_QUIZ_QUESTIONS.length}`
              );
              onQuizActiveChange(false);
              onQuizHandlerChange(null);
              setMode("off");
              return;
            }
            setQuizIndex(next);
            setQuizFeedback(null);
          }, 900);
          return nextScore;
        });
      } else {
        setQuizFeedback("Not quite — try again.");
      }
    },
    [currentQuiz, onQuizActiveChange, onQuizHandlerChange, quizActive, quizIndex]
  );

  useEffect(() => {
    onQuizHandlerChange(quizActive ? handleQuizAttempt : null);
    return () => onQuizHandlerChange(null);
  }, [handleQuizAttempt, onQuizHandlerChange, quizActive]);

  const startTour = useCallback(
    (tourId: string) => {
      setMode("tour");
      onQuizActiveChange(false);
      onTourChange(tourId);
      onTourStepChange(0);
      const t = getTourById(tourId);
      const first = t?.steps[0];
      if (first) {
        onHighlight(first.structureId);
        onSelectStructure(first.structureId);
      }
    },
    [onHighlight, onQuizActiveChange, onSelectStructure, onTourChange, onTourStepChange]
  );

  const advanceTour = useCallback(() => {
    if (!tour) return;
    const next = tourStepIndex + 1;
    if (next >= tour.steps.length) {
      setMode("off");
      onTourChange(null);
      onHighlight(null);
      return;
    }
    onTourStepChange(next);
    const step = tour.steps[next];
    onHighlight(step.structureId);
    onSelectStructure(step.structureId);
  }, [onHighlight, onSelectStructure, onTourChange, onTourStepChange, tour, tourStepIndex]);

  const startQuiz = useCallback(() => {
    setMode("quiz");
    onQuizActiveChange(true);
    onTourChange(null);
    onHighlight(null);
    setQuizIndex(0);
    setQuizScore(0);
    setQuizFeedback(null);
  }, [onHighlight, onQuizActiveChange, onTourChange]);

  const reset = useCallback(() => {
    setMode("off");
    onTourChange(null);
    onTourStepChange(0);
    onHighlight(null);
    onQuizActiveChange(false);
    onQuizHandlerChange(null);
    setQuizFeedback(null);
  }, [onHighlight, onQuizActiveChange, onQuizHandlerChange, onTourChange, onTourStepChange]);

  const tourProgress = tour ? `${tourStepIndex + 1} / ${tour.steps.length}` : null;

  return (
    <section className="rounded-2xl border border-black/[0.06] bg-gradient-to-br from-indigo-50/80 via-white to-violet-50/50 p-4 shadow-[var(--shadow-apple-sm)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-indigo-600" aria-hidden />
          <div>
            <h3 className="text-sm font-bold text-[var(--color-ink)]">Teach Mode</h3>
            <p className="text-xs text-[var(--color-ink-muted)]">
              Guided tours and region quizzes
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
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
            Guided tours
          </p>
          <div className="grid gap-2 sm:grid-cols-3">
            {tours.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => startTour(t.id)}
                className="group rounded-xl border border-black/[0.06] bg-white/90 p-3 text-left transition hover:border-indigo-200 hover:shadow-sm"
              >
                <p className="text-sm font-semibold text-[var(--color-ink)]">{t.title}</p>
                <p className="mt-1 text-xs text-[var(--color-ink-muted)]">{t.subtitle}</p>
                <span className="mt-2 inline-block text-[10px] font-bold uppercase tracking-wide text-indigo-600">
                  {t.examFocus}
                </span>
              </button>
            ))}
          </div>
          <Button
            variant="secondary"
            className="mt-2 w-full justify-center px-4 py-2.5 text-sm"
            onClick={startQuiz}
          >
            <HelpCircle className="mr-2 h-4 w-4" aria-hidden />
            Start region quiz ({ANATOMY_QUIZ_QUESTIONS.length} questions)
          </Button>
        </div>
      ) : null}

      {mode === "tour" && tour && currentStep ? (
        <motion.div
          key={`${tour.id}-${tourStepIndex}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 space-y-3"
        >
          <div className="flex items-center justify-between text-xs text-[var(--color-ink-muted)]">
            <span>{tour.title}</span>
            <span>{tourProgress}</span>
          </div>
          <p className="text-sm leading-relaxed text-[var(--color-ink)]">{currentStep.narration}</p>
          <Button
            variant="primary"
            className="w-full justify-center px-4 py-2.5 text-sm"
            onClick={advanceTour}
          >
            {tourStepIndex + 1 >= tour.steps.length ? "Finish tour" : "Next structure"}
            <ChevronRight className="ml-1 h-4 w-4" aria-hidden />
          </Button>
          {tourStepIndex + 1 >= tour.steps.length ? (
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

      {mode === "quiz" && currentQuiz ? (
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between text-xs text-[var(--color-ink-muted)]">
            <span>
              Question {quizIndex + 1} of {ANATOMY_QUIZ_QUESTIONS.length}
            </span>
            <span>Score: {quizScore}</span>
          </div>
          <p className="text-sm font-medium text-[var(--color-ink)]">{currentQuiz.prompt}</p>
          {quizFeedback ? (
            <p
              className={cn(
                "flex items-center gap-1.5 text-sm font-medium",
                quizFeedback.startsWith("Correct") || quizFeedback.startsWith("Quiz")
                  ? "text-emerald-600"
                  : "text-amber-700"
              )}
            >
              {quizFeedback.startsWith("Correct") ? (
                <CheckCircle2 className="h-4 w-4" aria-hidden />
              ) : null}
              {quizFeedback}
            </p>
          ) : (
            <p className="text-xs text-[var(--color-ink-muted)]">
              Click the matching structure in the 3D viewer or pick from the sidebar list.
            </p>
          )}
          {quizFeedback?.startsWith("Quiz complete") ? (
            <Button
              href={anatomyPracticeHref(examSlug, 10)}
              variant="secondary"
              className="w-full justify-center px-4 py-2.5 text-sm"
            >
              Keep drilling — anatomy bank
            </Button>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
