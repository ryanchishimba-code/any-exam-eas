/**
 * Results heading for a finished Full Exam / focused sprint.
 * "Exam complete" is a submitted simulation with every administered item answered,
 * including a practice CAT that stopped on its own before the maximum.
 * Early end reuses the Study Hub receipt line ("You ended the exam early").
 */

import { isNaturalCatStop } from "@/lib/full-exam/administered-score";

export const FULL_EXAM_RESULTS_COMPLETE_TITLE = "Exam complete";
export const FULL_EXAM_RESULTS_ENDED_EARLY_TITLE = "You ended the exam early";
export const FULL_EXAM_RESULTS_INCOMPLETE_TITLE = "Incomplete simulation";

type AnsweredItem = {
  questionIndex: number;
  selected?: string | null;
};

/** Items in the delivered set with no saved selection. */
export function countUnansweredExamItems(
  questionCount: number,
  answers: AnsweredItem[]
): number {
  const total = Math.max(0, Math.floor(questionCount) || 0);
  if (total === 0) return 0;
  const answered = new Set<number>();
  for (const answer of answers) {
    if (typeof answer.questionIndex !== "number" || !Number.isFinite(answer.questionIndex)) {
      continue;
    }
    const index = Math.floor(answer.questionIndex);
    if (index < 0 || index >= total) continue;
    if (typeof answer.selected === "string" && answer.selected.trim()) {
      answered.add(index);
    }
  }
  return total - answered.size;
}

/** True when the saved receipt already says the student stopped before submit. */
export function summarySaysEndedEarly(summary: string | null | undefined): boolean {
  return typeof summary === "string" && /session ended early/i.test(summary);
}

/**
 * Early end is not only the status column. The results summary is written in the
 * same submit as that flag, and a focused-sprint row can show the early summary
 * while status stays "completed" and every saved row looks selected.
 */
export function fullExamResultsTitle(input: {
  endedEarly: boolean;
  unanswered: number;
  summary?: string | null;
}): string {
  if (input.endedEarly || summarySaysEndedEarly(input.summary)) {
    return FULL_EXAM_RESULTS_ENDED_EARLY_TITLE;
  }
  if (input.unanswered > 0) return FULL_EXAM_RESULTS_INCOMPLETE_TITLE;
  return FULL_EXAM_RESULTS_COMPLETE_TITLE;
}

/**
 * Delivered length is the items the student was given, not the CAT pool.
 * A finished form (every planned item answered) or a natural CAT stop is
 * "Exam complete" even if an older client stored the early-end sentence
 * because End exam was the only control on the last item.
 */
export function resolveFullExamResultsTitle(input: {
  endedEarly?: boolean;
  analysisEndedEarly?: boolean;
  summary?: string | null;
  answeredCount?: number | null;
  /** Items administered (served snapshots), not the prefetch pool. */
  questionCount: number;
  /** Planned form length. Omitted when the caller only knows the delivered set. */
  plannedQuestionCount?: number | null;
  catStopReason?: string | null;
  answers: AnsweredItem[];
}): string {
  const delivered = Math.max(0, Math.floor(input.questionCount) || 0);
  const unanswered = countUnansweredExamItems(delivered, input.answers);
  const planned =
    typeof input.plannedQuestionCount === "number" && Number.isFinite(input.plannedQuestionCount)
      ? Math.max(0, Math.floor(input.plannedQuestionCount))
      : null;
  const naturalCat = isNaturalCatStop(input.catStopReason);
  const finishedForm =
    delivered > 0 &&
    unanswered === 0 &&
    (naturalCat || (planned != null && planned > 0 && delivered >= planned));
  if (finishedForm) return FULL_EXAM_RESULTS_COMPLETE_TITLE;
  return fullExamResultsTitle({
    endedEarly: input.endedEarly === true || input.analysisEndedEarly === true,
    unanswered,
    summary: input.summary,
  });
}

export function fullExamTreatsAsEndedEarly(input: {
  endedEarly?: boolean;
  analysisEndedEarly?: boolean;
  summary?: string | null;
  questionCount: number;
  plannedQuestionCount?: number | null;
  catStopReason?: string | null;
  answers: AnsweredItem[];
}): boolean {
  return (
    resolveFullExamResultsTitle(input) === FULL_EXAM_RESULTS_ENDED_EARLY_TITLE
  );
}
