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

/** Restore persisted selection into UI state. */
export function deserializeExamSelection(selected: string): string[] {
  if (!selected.trim()) return [];
  if (selected.includes("|||")) {
    return selected.split("|||").map((s) => s.trim()).filter(Boolean);
  }
  return [selected];
}

/** Human-readable answer for results review. */
export function formatAnswerDisplay(value: string): string {
  if (!value) return "—";
  if (value.includes("|||")) {
    return value.split("|||").map((s) => s.trim()).filter(Boolean).join(", ");
  }
  return value;
}

/** Whether a snapshot choice is this option. Commas inside one choice stay intact. */
export function storedAnswerIncludesChoice(stored: string, choice: string): boolean {
  const target = choice.trim();
  if (!stored.trim() || !target) return false;
  const parts = stored.includes("|||")
    ? stored.split("|||").map((part) => part.trim()).filter(Boolean)
    : [stored];
  return parts.some((part) => part === target);
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
