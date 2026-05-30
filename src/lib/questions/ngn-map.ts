import type { ExamQuestion, NgnQuestionFormat } from "@/lib/ai";
import type { StudyQuestionType } from "./types";

const SELECT_ALL_TYPES: NgnQuestionFormat[] = [
  "select_all",
  "highlight",
  "matrix",
  "bow_tie",
];

const ORDERED_TYPES: NgnQuestionFormat[] = ["ordered_response", "drag_drop"];

export function inferStudyQuestionType(q: ExamQuestion): StudyQuestionType {
  const t = q.type ?? "multiple_choice";
  if (t === "true_false") return "true_false";
  if (t === "short_answer") return "short_answer";
  if (SELECT_ALL_TYPES.includes(t)) return "select_all";
  if (ORDERED_TYPES.includes(t)) return "ordered_response";
  if (t === "unfolding_case") return "clinical_reasoning";
  return "multiple_choice";
}

export function formatNgnLabel(type?: string, ngnFormat?: string): string {
  const id = ngnFormat ?? type ?? "multiple_choice";
  const labels: Record<string, string> = {
    multiple_choice: "Multiple choice",
    select_all: "Select all that apply",
    bow_tie: "Bow-tie",
    matrix: "Matrix",
    unfolding_case: "Unfolding case",
    highlight: "Highlight",
    ordered_response: "Ordered response",
    drag_drop: "Drag & drop",
    clinical_reasoning: "Clinical reasoning",
    true_false: "True / false",
    short_answer: "Short answer",
  };
  return labels[id] ?? id.replace(/_/g, " ");
}
