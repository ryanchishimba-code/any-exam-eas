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

export function fullExamResultsTitle(input: {
  endedEarly: boolean;
  unanswered: number;
}): string {
  if (input.endedEarly) return FULL_EXAM_RESULTS_ENDED_EARLY_TITLE;
  if (input.unanswered > 0) return FULL_EXAM_RESULTS_INCOMPLETE_TITLE;
  return FULL_EXAM_RESULTS_COMPLETE_TITLE;
}
