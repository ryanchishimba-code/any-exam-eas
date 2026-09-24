/**
 * Results heading for a finished Full Exam / focused sprint.
 * "Exam complete" is only for a submitted simulation with every item answered.
 * Early end reuses the Study Hub receipt line ("You ended the exam early").
 */

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
 * Same inputs the results receipt shows: saved summary, planned length, and the
 * answer log. Early summary wins over a completed status or a fully-selected log.
 */
export function resolveFullExamResultsTitle(input: {
  endedEarly?: boolean;
  analysisEndedEarly?: boolean;
  summary?: string | null;
  answeredCount?: number | null;
  questionCount: number;
  answers: AnsweredItem[];
}): string {
  const plannedCount = Math.max(0, Math.floor(input.questionCount) || 0);
  const unansweredFromLog = countUnansweredExamItems(plannedCount, input.answers);
  const recorded = input.answeredCount;
  const unanswered =
    typeof recorded === "number" && Number.isFinite(recorded)
      ? Math.max(unansweredFromLog, plannedCount - Math.max(0, Math.floor(recorded)))
      : unansweredFromLog;
  return fullExamResultsTitle({
    endedEarly: input.endedEarly === true || input.analysisEndedEarly === true,
    unanswered,
    summary: input.summary,
  });
}
