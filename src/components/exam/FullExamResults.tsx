"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  RotateCcw,
  CheckCircle2,
  XCircle,
  BookOpen,
  LayoutGrid,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { EXAM_CATALOG } from "@/lib/edtech/exams";
import { formatAnswerDisplay } from "@/lib/full-exam/answer-serialize";
import { formatHms } from "@/lib/full-exam/config";
import { fullExamHref } from "@/lib/routes";
import { STUDY_HUB_PATH } from "@/lib/study-hub/config";
import type { ExamSlug } from "@/types/edtech";
import type { FullExamQuestion, FullExamResultsAnalysis } from "@/types/full-exam";
import type { ExamAnswerRecord } from "@/lib/exam-sessions/service";
import { feUi } from "@/lib/study/full-exam-ui";
import { cn } from "@/lib/utils";
import { FullExamStudyLinks } from "@/components/exam/FullExamStudyLinks";
import { FullExamResultsInsights } from "@/components/exam/FullExamResultsInsights";
import { FullExamCatPracticeBand } from "@/components/exam/FullExamCatPracticeBand";
import { StudyThisTopicButton } from "@/components/study/StudyThisTopicButton";
import { QuestionRelatedLinks } from "@/components/study/questions/QuestionRelatedLinks";
import { resolveQuestionStudyLinks } from "@/lib/library/question-study-links";

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
  const studyLinks = resolveQuestionStudyLinks(examSlug, {
    topicCategory: current?.topicCategory,
    stem: current ? [current.question, current.explanation].filter(Boolean).join("\n") : undefined,
  });

  const notesPreview = answers
    .filter((a) => a.notes?.trim())
    .map((a) => ({
      questionNumber: a.questionIndex + 1,
      text: a.notes!.trim(),
    }))
    .sort((a, b) => a.questionNumber - b.questionNumber);

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

        <article className={feUi.questionPanel}>
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

          <div className="mt-4 space-y-3">
            <StudyThisTopicButton
              links={studyLinks}
              examSlug={examSlug}
              missed={!isCorrect}
              flagged={Boolean(currentAnswer?.flagged)}
            />
            <QuestionRelatedLinks
              question={{
                id: current.id,
                sourceIndex: index,
                type: "multiple_choice",
                stem: current.question,
                options: current.options,
                correctAnswers: [current.correctAnswer],
                explanation: current.explanation,
              }}
              examSlug={examSlug}
              links={studyLinks}
            />
          </div>
        </article>

        <ReviewFooter
          index={index}
          total={questions.length}
          onPrevious={() => setIndex((i) => Math.max(0, i - 1))}
          onNext={() => setIndex((i) => Math.min(questions.length - 1, i + 1))}
          onReturnToOverview={() => setView("overview")}
          onReturnToSummary={() => setView("summary")}
          studyHubHref={STUDY_HUB_PATH}
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
    <div className="space-y-6 pb-8">
      <div className={feUi.pageShell}>
        <div className={cn(feUi.panel, "p-6 text-center sm:p-8")}>
          <div className={feUi.scoreRing}>
            <span className={cn("text-3xl font-bold tabular-nums", scoreColor)}>{score}%</span>
          </div>
          <h1 className="mt-5 text-[24px] font-semibold tracking-tight text-[var(--color-ink)]">
            Exam complete
          </h1>
          <p className="mt-2 text-[15px] text-[var(--color-ink-muted)]">{analysis.summary}</p>
          <p className="mt-1 text-[13px] text-[var(--color-ink-muted)]">{exam.name}</p>
          <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
            {correct} / {questions.length} correct
          </p>
        </div>
      </div>

      {questions.length > 0 ? (
        <div className={cn(feUi.panel, "p-5 sm:p-6")}>
          <p className="text-center text-[14px] font-medium text-[var(--color-ink)]">
            What would you like to do next?
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={() => {
                setIndex(0);
                setView("question");
              }}
              className={cn(feUi.footerBtnPrimary, "w-full justify-center px-6 py-3 sm:w-auto sm:min-w-[14rem]")}
            >
              <BookOpen className="h-4 w-4" />
              Review explanations
            </button>
            <Link
              href={STUDY_HUB_PATH}
              className={cn(feUi.footerBtn, "w-full justify-center px-6 py-3 sm:w-auto sm:min-w-[14rem]")}
            >
              <LayoutGrid className="h-4 w-4" />
              Back to Study Hub
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex justify-center">
          <Link href={STUDY_HUB_PATH} className={feUi.footerBtnPrimary}>
            <LayoutGrid className="h-4 w-4" />
            Back to Study Hub
          </Link>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label="Score" value={`${score}%`} valueClass={scoreColor} />
        <StatCard label="Correct" value={`${correct} / ${questions.length}`} />
        <StatCard label="Time used" value={formatHms(analysis.timeUsedSec)} icon={Clock} />
      </div>

      {notesPreview.length > 0 ? (
        <div className={cn(feUi.panel, "p-5 sm:p-6")}>
          <h2 className={feUi.sectionTitle}>Your scratch notes</h2>
          <ul className="mt-4 space-y-3">
            {notesPreview.slice(0, 8).map((note) => (
              <li key={note.questionNumber} className="rounded-xl bg-black/[0.03] px-4 py-3 text-sm">
                <span className="font-semibold text-[var(--color-ink-muted)]">
                  Question {note.questionNumber}
                </span>
                <p className="mt-1 whitespace-pre-wrap text-[var(--color-ink)]">{note.text}</p>
              </li>
            ))}
          </ul>
          {notesPreview.length > 8 ? (
            <p className="mt-3 text-[13px] text-[var(--color-ink-muted)]">
              View all notes while reviewing questions.
            </p>
          ) : null}
        </div>
      ) : null}

      {analysis.catOutcome ? (
        <FullExamCatPracticeBand catOutcome={analysis.catOutcome} />
      ) : null}

      <FullExamResultsInsights
        examSlug={examSlug}
        score={score}
        analysis={analysis}
        answers={answers}
        onReviewMissed={
          questions.length > 0
            ? () => {
                const firstMissed = answers.findIndex((a) => !a.correct);
                setIndex(firstMissed >= 0 ? firstMissed : 0);
                setView("question");
              }
            : undefined
        }
      />

      {analysis.topicBreakdown.length > 0 ? (
        <div className={cn(feUi.panel, "p-5 sm:p-6")}>
          <h2 className={feUi.sectionTitle}>Topic breakdown</h2>
          <div className="mt-4 space-y-4">
            {analysis.topicBreakdown.map((t) => (
              <div key={t.topic}>
                <div className="mb-1 flex justify-between text-[13px]">
                  <span className="font-medium text-[var(--color-ink)]">{t.topic}</span>
                  <span className="text-[var(--color-ink-muted)]">
                    {t.correct}/{t.total} ({t.pct}%)
                  </span>
                </div>
                <Progress value={t.pct} className="h-1.5 rounded-full bg-black/[0.06]" />
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <FullExamStudyLinks
        examSlug={examSlug}
        topicBreakdown={analysis.topicBreakdown}
        practiceCount={analysis.catOutcome ? 25 : 10}
        autostartPractice={Boolean(analysis.catOutcome)}
      />

      {questions.length > 0 ? (
        <div className="flex flex-wrap justify-center gap-2 border-t border-black/[0.06] pt-6">
          <button type="button" onClick={() => setView("overview")} className={feUi.footerBtn}>
            <LayoutGrid className="h-4 w-4" />
            Question overview
          </button>
          <Link href={fullExamHref(examSlug)} className={feUi.footerBtn}>
            <RotateCcw className="h-4 w-4" /> New simulation
          </Link>
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-2">
          <Link href={fullExamHref(examSlug)} className={feUi.footerBtn}>
            <RotateCcw className="h-4 w-4" /> New simulation
          </Link>
        </div>
      )}

      <p className="text-center text-[11px] text-[var(--color-ink-muted)]">
        Session {sessionId.slice(0, 8)}…
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
  studyHubHref,
}: {
  index: number;
  total: number;
  onPrevious: () => void;
  onNext: () => void;
  onReturnToOverview: () => void;
  onReturnToSummary: () => void;
  studyHubHref: string;
}) {
  return (
    <footer className={feUi.glassFooter}>
      <div className="mx-auto max-w-3xl space-y-2 px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between gap-2">
          <button type="button" disabled={index === 0} onClick={onPrevious} className={feUi.footerBtn}>
            <ChevronLeft className="h-4 w-4" /> Previous
          </button>
          <button type="button" onClick={onReturnToOverview} className={feUi.footerBtn}>
            <LayoutGrid className="h-4 w-4" /> Overview
          </button>
          <button type="button" onClick={onReturnToSummary} className={feUi.footerBtn}>
            Summary
          </button>
          <button
            type="button"
            disabled={index + 1 >= total}
            onClick={onNext}
            className={feUi.footerBtnDark}
          >
            Next <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <div className="flex justify-center">
          <Link href={studyHubHref} className={feUi.footerBtn}>
            <LayoutGrid className="h-4 w-4" /> Study Hub
          </Link>
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
    <div className={cn(feUi.panel, "p-4 text-center")}>
      {Icon ? <Icon className="mx-auto mb-2 h-5 w-5 text-[var(--color-ink-muted)]" /> : null}
      <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
        {label}
      </p>
      <p className={cn("mt-1 text-2xl font-bold tabular-nums", valueClass ?? "text-[var(--color-ink)]")}>
        {value}
      </p>
    </div>
  );
}
