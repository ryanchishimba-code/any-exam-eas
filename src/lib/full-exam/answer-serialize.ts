import type { StudyQuestion } from "@/lib/questions/types";
import { joinStoredCorrectAnswer } from "@/lib/questions/multi-answer";
import { formatAnswerDisplay as formatNgnAnswerDisplay } from "@/lib/full-exam/ngn-review-display";

/** Serialize a learner's choices for exam-session persistence. */
export function serializeExamSelection(
  question: StudyQuestion,
  selected: string[]
): string {
  if (selected.length === 0) return "";
  // Matrix cells already contain `|||` (`row|||column`). A JSON list keeps each pair intact.
  if (question.type === "matrix") return JSON.stringify(selected);
  if (
    question.type === "select_all" ||
    question.type === "bow_tie" ||
    question.type === "highlight" ||
    question.type === "ordered_response" ||
    question.type === "drag_drop"
  ) {
    return selected.join("|||");
  }
  return selected[0] ?? "";
}

/**
 * Matrix cells are stored as `row|||column`. Joining those cells with `|||`
 * cannot be split back into pairs, so a `;;` join is the durable form and an
 * even `|||` split is accepted for logs already saved that way.
 */
export function selectionForGrading(type: string, stored: string): string[] {
  const trimmed = stored.trim();
  if (!trimmed) return [];
  if (type !== "matrix") return deserializeExamSelection(trimmed);
  if (trimmed.startsWith("[")) {
    try {
      const parsed = JSON.parse(trimmed) as unknown;
      if (Array.isArray(parsed) && parsed.every((part) => typeof part === "string")) {
        return parsed.map((part) => part.trim()).filter(Boolean);
      }
    } catch {
      /* fall through */
    }
  }
  if (trimmed.includes(";;")) {
    return trimmed
      .split(";;")
      .map((part) => part.trim())
      .filter(Boolean);
  }
  const parts = trimmed
    .split("|||")
    .map((part) => part.trim())
    .filter(Boolean);
  if (parts.length >= 2 && parts.length % 2 === 0) {
    const cells: string[] = [];
    for (let i = 0; i < parts.length; i += 2) {
      cells.push(`${parts[i]}|||${parts[i + 1]}`);
    }
    return cells;
  }
  return [trimmed];
}

/** Restore persisted selection into UI state. */
export function deserializeExamSelection(selected: string): string[] {
  const trimmed = selected.trim();
  if (!trimmed) return [];
  if (trimmed.startsWith("[")) {
    try {
      const parsed = JSON.parse(trimmed) as unknown;
      if (Array.isArray(parsed) && parsed.every((part) => typeof part === "string")) {
        return parsed.map((part) => part.trim()).filter(Boolean);
      }
    } catch {
      /* not a matrix list */
    }
  }
  if (trimmed.includes(";;")) {
    return trimmed
      .split(";;")
      .map((part) => part.trim())
      .filter(Boolean);
  }
  if (trimmed.includes("|||")) {
    return trimmed.split("|||").map((s) => s.trim()).filter(Boolean);
  }
  return [trimmed];
}

/** Human-readable answer for results review. */
export function formatAnswerDisplay(value: string, ngnFormat?: string): string {
  return formatNgnAnswerDisplay(value, ngnFormat);
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
  return joinStoredCorrectAnswer(question.type, question.correctAnswers);
}
