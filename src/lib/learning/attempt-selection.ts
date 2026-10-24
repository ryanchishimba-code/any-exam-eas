import {
  deserializeExamSelection,
  selectionForGrading,
  serializeExamSelection,
} from "@/lib/full-exam/answer-serialize";
import { splitStoredCorrectAnswers } from "@/lib/questions/multi-answer";
import { isAnswerCorrect } from "@/lib/questions/prepare";
import type { StudyQuestion } from "@/lib/questions/types";

/** Wire format for QuestionAttempt.selectedAnswer — matches full-exam persistence. */
export function serializeStudySelectedAnswer(
  question: Pick<StudyQuestion, "type">,
  selected: string[]
): string {
  return serializeExamSelection(question as StudyQuestion, selected);
}

/**
 * Restore a stored selection for grading. Accepts legacy comma-joined select-all
 * rows written before serialization was unified.
 */
export function parseStudySelectedAnswer(
  question: Pick<StudyQuestion, "type" | "options">,
  stored: string | undefined
): string[] {
  const trimmed = stored?.trim() ?? "";
  if (!trimmed) return [];

  const graded = selectionForGrading(question.type, trimmed);
  if (question.type === "select_all" || question.type === "highlight") {
    if (graded.length > 1) return graded;
    if (!trimmed.includes("|||") && trimmed.includes(",")) {
      const legacy = splitStoredCorrectAnswers(trimmed, question.options ?? []);
      if (legacy.length > 1) return legacy;
    }
  }

  if (graded.length > 0) return graded;
  return deserializeExamSelection(trimmed);
}

/** Authoritative correct flag: keyed item on the server, not the client toggle. */
export function resolveAttemptCorrect(
  question: StudyQuestion,
  selectedAnswer: string | undefined,
  clientCorrect: boolean
): boolean {
  const selected = parseStudySelectedAnswer(question, selectedAnswer);
  if (selected.length === 0) return false;
  if (question.correctAnswers.some((answer) => answer.trim())) {
    return isAnswerCorrect(question, selected);
  }
  return clientCorrect;
}
