import { feUi } from "@/lib/study/full-exam-ui";
import { resolveFullExamResultsTitle } from "@/lib/full-exam/results-title";
import { cn } from "@/lib/utils";

type AnswerRow = {
  questionIndex: number;
  selected?: string | null;
};

/**
 * Score card for a finished Full Exam. Server-rendered so the heading is part of
 * the document, computed from the same summary string shown under it.
 * The client results module must not paint this heading.
 */
export function ExamResultsScoreHeader({
  examName,
  examShortName,
  score,
  correct,
  questionCount,
  summary,
  endedEarly = false,
  analysisEndedEarly = false,
  answeredCount,
  plannedQuestionCount,
  answers,
}: {
  examName: string;
  examShortName: string;
  score: number;
  correct: number;
  questionCount: number;
  summary: string;
  endedEarly?: boolean;
  analysisEndedEarly?: boolean;
  answeredCount?: number | null;
  plannedQuestionCount?: number;
  answers: AnswerRow[];
}) {
  const title = resolveFullExamResultsTitle({
    endedEarly,
    analysisEndedEarly,
    summary,
    answeredCount,
    questionCount: Math.max(questionCount, plannedQuestionCount ?? 0),
    answers,
  });
  const scoreColor =
    score >= 80 ? "text-teal-600" : score >= 65 ? "text-amber-600" : "text-rose-600";

  return (
    <div className={feUi.pageShell}>
      <div className={cn(feUi.panel, "p-4 text-center sm:p-8")}>
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-[var(--color-accent)]/25 bg-[var(--color-surface-elevated)] sm:h-28 sm:w-28 sm:border-[6px] sm:shadow-[var(--shadow-apple-sm)]">
          <span
            className={cn(
              "text-[20px] font-semibold tabular-nums tracking-[-0.03em] sm:text-3xl sm:font-bold",
              scoreColor
            )}
          >
            {score}%
          </span>
        </div>
        <h1 className="mt-3 text-[22px] font-semibold tracking-[-0.03em] text-[var(--color-ink)] sm:mt-5 sm:text-[24px] sm:tracking-tight">
          {title}
        </h1>
        <p className="mt-1 text-[14px] leading-snug tracking-[-0.015em] text-[var(--color-ink-muted)] sm:mt-2 sm:text-[15px]">
          {summary}
        </p>
        <p className="mt-1 hidden text-[13px] text-[var(--color-ink-muted)] sm:block">{examName}</p>
        <p className="mt-1 text-[13px] tracking-[-0.01em] text-[var(--color-ink-muted)] sm:mt-2 sm:text-sm">
          {correct} / {questionCount} correct
          <span className="sm:hidden"> · {examShortName}</span>
        </p>
      </div>
    </div>
  );
}
