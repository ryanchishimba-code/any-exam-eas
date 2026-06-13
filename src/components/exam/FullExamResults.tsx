"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Award,
  ChevronLeft,
  ChevronRight,
  Clock,
  RotateCcw,
  CheckCircle2,
  XCircle,
  BookOpen,
  LayoutGrid,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { EXAM_CATALOG } from "@/lib/edtech/exams";
import { formatAnswerDisplay } from "@/lib/full-exam/answer-serialize";
import { formatHms } from "@/lib/full-exam/config";
import { fullExamHref, ROUTES } from "@/lib/routes";
import type { ExamSlug } from "@/types/edtech";
import type { FullExamQuestion, FullExamResultsAnalysis } from "@/types/full-exam";
import type { ExamAnswerRecord } from "@/lib/exam-sessions/service";
import { cn } from "@/lib/utils";
import { FullExamStudyLinks } from "@/components/exam/FullExamStudyLinks";

type ReviewView = "summary" | "overview" | "question";

type Props = {
  examSlug: ExamSlug;
  sessionId: string;
  score: number;
  analysis: FullExamResultsAnalysis;
  answers: ExamAnswerRecord[];
  questions: FullExamQuestion[];
  initialReviewOpen?: boolean;
};

function answerFor(answers: ExamAnswerRecord[], index: number) {
  return answers.find((a) => a.questionIndex === index);
}

export function FullExamResults({
  examSlug,
  sessionId,
  score,
  analysis,
  answers,
  questions,
  initialReviewOpen = false,
}: Props) {
  const exam = EXAM_CATALOG[examSlug];
  const correct = answers.filter((a) => a.correct).length;
  const [view, setView] = useState<ReviewView>(initialReviewOpen ? "question" : "summary");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (initialReviewOpen && questions.length > 0) {
      setView("question");
      setIndex(0);
    }
  }, [initialReviewOpen, questions.length]);

  const scoreColor =
    score >= 80 ? "text-teal-600" : score >= 65 ? "text-amber-600" : "text-rose-600";

  const current = questions[index];
  const currentAnswer = answerFor(answers, index);
  const isCorrect = currentAnswer?.correct ?? false;

  if (view === "question" && questions.length > 0 && current) {
    return (
      <div className="min-h-[70vh] pb-36">
        <header className="mb-6 space-y-1 border-b border-slate-200/80 pb-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
            Post-exam review · {exam.shortName}
          </p>
          <h1 className="text-xl font-semibold text-slate-900">
            Question {index + 1}{" "}
            <span className="font-normal text-slate-400">/ {questions.length}</span>
          </h1>
          <p className="text-sm text-slate-500">
            Score {score}% · {correct}/{questions.length} correct
          </p>
        </header>

        <article className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            {isCorrect ? (
              <CheckCircle2 className="h-5 w-5 text-teal-600" aria-hidden />
            ) : (
              <XCircle className="h-5 w-5 text-rose-500" aria-hidden />
            )}
            <span
              className={cn(
                "text-sm font-semibold",
                isCorrect ? "text-teal-700" : "text-rose-700"
              )}
            >
              {isCorrect ? "Correct" : "Incorrect"}
              {currentAnswer?.flagged ? " · Flagged during exam" : ""}
            </span>
          </div>

          <p className="whitespace-pre-wrap text-base leading-relaxed text-slate-800">
            {current.question}
          </p>

          {current.options.length > 0 ? (
            <ul className="mt-6 space-y-2">
              {current.options.map((opt) => {
                const selected = formatAnswerDisplay(currentAnswer?.selected ?? "")
                  .split(", ")
                  .includes(opt);
                const correctOpt = formatAnswerDisplay(current.correctAnswer)
                  .split(", ")
                  .includes(opt);
                return (
                  <li
                    key={opt}
                    className={cn(
                      "rounded-xl border px-4 py-3 text-sm",
                      correctOpt && "border-teal-300 bg-teal-50 text-teal-900",
                      selected && !correctOpt && "border-rose-300 bg-rose-50 text-rose-900",
                      !selected && !correctOpt && "border-slate-200 bg-slate-50/50 text-slate-700"
                    )}
                  >
                    {opt}
                    {selected ? " · Your answer" : ""}
                    {correctOpt ? " · Correct" : ""}
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="mt-6 space-y-2 text-sm">
              <p>
                <span className="font-semibold text-slate-600">Your answer: </span>
                <span className={isCorrect ? "text-teal-700" : "text-rose-700"}>
                  {formatAnswerDisplay(currentAnswer?.selected ?? "")}
                </span>
              </p>
              <p>
                <span className="font-semibold text-slate-600">Correct: </span>
                <span className="text-teal-800">{formatAnswerDisplay(current.correctAnswer)}</span>
              </p>
            </div>
          )}

          <div className="mt-6 rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Rationale
            </p>
            {current.explanation || "No rationale saved for this question."}
          </div>
        </article>

        <ReviewFooter
          index={index}
          total={questions.length}
          onPrevious={() => setIndex((i) => Math.max(0, i - 1))}
          onNext={() => setIndex((i) => Math.min(questions.length - 1, i + 1))}
          onReturnToOverview={() => setView("overview")}
          onReturnToSummary={() => setView("summary")}
        />
      </div>
    );
  }

  if (view === "overview" && questions.length > 0) {
    return (
      <div className="min-h-[70vh] pb-36">
        <header className="mb-6 space-y-1 border-b border-slate-200/80 pb-4">
          <h1 className="text-xl font-semibold text-slate-900">Review overview</h1>
          <p className="text-sm text-slate-500">
            Tap a question to review with rationales · {correct}/{questions.length} correct
          </p>
        </header>

        <ol className="grid grid-cols-5 gap-2 sm:grid-cols-8 md:grid-cols-10">
          {questions.map((_, i) => {
            const ans = answerFor(answers, i);
            const answered = Boolean(ans?.selected);
            const ok = ans?.correct ?? false;
            const flagged = ans?.flagged ?? false;
            return (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => {
                    setIndex(i);
                    setView("question");
                  }}
                  className={cn(
                    "relative flex h-10 w-full items-center justify-center rounded-lg text-xs font-semibold tabular-nums transition",
                    flagged && "ring-2 ring-amber-400",
                    !answered && "bg-slate-100 text-slate-600 hover:bg-slate-200",
                    answered && ok && "bg-teal-50 text-teal-800 hover:bg-teal-100",
                    answered && !ok && "bg-rose-50 text-rose-800 hover:bg-rose-100"
                  )}
                >
                  {i + 1}
                </button>
              </li>
            );
          })}
        </ol>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => {
              setIndex(0);
              setView("question");
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-95"
          >
            Start review
          </button>
          <button
            type="button"
            onClick={() => setView("summary")}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            Back to score summary
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      <header className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50">
          <Award className="h-8 w-8 text-teal-600" aria-hidden />
        </div>
        <h1 className="mt-4 text-3xl font-semibold text-slate-900">Exam complete</h1>
        <p className="mt-2 text-slate-600">{analysis.summary}</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Score" value={`${score}%`} valueClass={scoreColor} />
        <StatCard label="Correct" value={`${correct} / ${questions.length}`} />
        <StatCard
          label="Time used"
          value={formatHms(analysis.timeUsedSec)}
          icon={Clock}
        />
      </div>

      {analysis.topicBreakdown.length > 0 ? (
        <Card className="border-slate-200/80">
          <CardHeader>
            <CardTitle className="text-lg">Topic breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analysis.topicBreakdown.map((t) => (
              <div key={t.topic}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="font-medium text-slate-800">{t.topic}</span>
                  <span className="text-slate-500">
                    {t.correct}/{t.total} ({t.pct}%)
                  </span>
                </div>
                <Progress value={t.pct} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}

      <FullExamStudyLinks examSlug={examSlug} topicBreakdown={analysis.topicBreakdown} />

      {questions.length > 0 ? (
        <div className="rounded-2xl border border-teal-200/80 bg-teal-50/50 p-5 text-center">
          <p className="text-sm font-medium text-teal-900">
            Walk through every question with rationales — use Previous and Next to move between
            items.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                setIndex(0);
                setView("question");
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-95"
            >
              <BookOpen className="h-4 w-4" />
              Return to review
            </button>
            <button
              type="button"
              onClick={() => setView("overview")}
              className="inline-flex items-center gap-2 rounded-xl border border-teal-300 bg-white px-6 py-3 text-sm font-semibold text-teal-900 hover:bg-teal-50"
            >
              <LayoutGrid className="h-4 w-4" />
              Question overview
            </button>
          </div>
        </div>
      ) : null}

      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href={fullExamHref(examSlug)}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"
        >
          <RotateCcw className="h-4 w-4" /> New simulation
        </Link>
        <Link
          href={ROUTES.dashboard}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"
        >
          Back to Dashboard
        </Link>
      </div>

      <p className="text-center text-xs text-slate-400">
        Session {sessionId.slice(0, 8)}… · {exam.name}
      </p>
    </div>
  );
}

function ReviewFooter({
  index,
  total,
  onPrevious,
  onNext,
  onReturnToOverview,
  onReturnToSummary,
}: {
  index: number;
  total: number;
  onPrevious: () => void;
  onNext: () => void;
  onReturnToOverview: () => void;
  onReturnToSummary: () => void;
}) {
  return (
    <footer className="fixed inset-x-0 bottom-0 z-[70] border-t border-slate-200/80 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md">
      <div className="mx-auto max-w-3xl space-y-2 px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            disabled={index === 0}
            onClick={onPrevious}
            className="inline-flex shrink-0 items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 sm:px-4"
          >
            <ChevronLeft className="h-4 w-4" /> Previous
          </button>

          <button
            type="button"
            onClick={onReturnToOverview}
            className="inline-flex shrink-0 items-center gap-1 rounded-xl border border-teal-300 bg-teal-50 px-3 py-2 text-sm font-semibold text-teal-800 hover:bg-teal-100 sm:px-4"
          >
            <LayoutGrid className="h-4 w-4" /> Overview
          </button>

          <button
            type="button"
            onClick={onReturnToSummary}
            className="hidden shrink-0 items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 sm:inline-flex"
          >
            Score summary
          </button>

          <button
            type="button"
            disabled={index + 1 >= total}
            onClick={onNext}
            className="inline-flex shrink-0 items-center gap-1 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-40 sm:px-5"
          >
            Next <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}

function StatCard({
  label,
  value,
  valueClass,
  icon: Icon,
}: {
  label: string;
  value: string;
  valueClass?: string;
  icon?: typeof Clock;
}) {
  return (
    <Card className="border-slate-200/80 text-center">
      <CardContent className="pt-6">
        {Icon ? <Icon className="mx-auto mb-2 h-5 w-5 text-slate-400" /> : null}
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
        <p className={cn("mt-1 text-3xl font-bold tabular-nums", valueClass ?? "text-slate-900")}>
          {value}
        </p>
      </CardContent>
    </Card>
  );
}
