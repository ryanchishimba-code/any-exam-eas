import type { StudyQuestion } from "@/lib/questions/types";

/** Serialize a learner's choices for exam-session persistence. */
export function serializeExamSelection(
  question: StudyQuestion,
  selected: string[]
): string {
  if (selected.length === 0) return "";
  if (
    question.type === "select_all" ||
    question.type === "bow_tie" ||
    question.type === "matrix" ||
    question.type === "highlight" ||
    question.type === "ordered_response" ||
    question.type === "drag_drop"
  ) {
    return selected.join("|||");
  }
  return selected[0] ?? "";
}

/** Serialize correct answers for results snapshots. */
export function serializeCorrectAnswer(question: StudyQuestion): string {
  if (
    question.type === "select_all" ||
    question.type === "bow_tie" ||
    question.type === "matrix" ||
    question.type === "highlight" ||
    question.type === "ordered_response" ||
    question.type === "drag_drop"
  ) {
    return question.correctAnswers.join("|||");
  }
  return question.correctAnswers[0] ?? "";
}
