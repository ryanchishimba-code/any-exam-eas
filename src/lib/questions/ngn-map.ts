import type { ExamQuestion, NgnQuestionFormat } from "@/lib/ai";
import type { StudyQuestionType } from "./types";

export function inferStudyQuestionType(q: ExamQuestion): StudyQuestionType {
  const t = q.type ?? "multiple_choice";
  const ngn = q.ngnFormat ?? t;

  if (t === "true_false") return "true_false";
  if (t === "short_answer") return "short_answer";
  if (t === "drag_drop" || ngn === "drag_drop") return "drag_drop";
  if (t === "bow_tie" || ngn === "bow_tie") return "bow_tie";
  if (t === "matrix" || ngn === "matrix") return "matrix";
  if (t === "highlight" || ngn === "highlight") return "highlight";
  if (t === "unfolding_case" || ngn === "unfolding_case") return "unfolding_case";
  if (t === "select_all") return "select_all";
  if (ngn === "k_type") return "k_type";
  if (t === "ordered_response" || ngn === "ordered_response") return "ordered_response";
  return "multiple_choice";
}

export function formatNgnLabel(type?: string, ngnFormat?: string): string {
  const id = ngnFormat ?? type ?? "multiple_choice";
  const labels: Record<string, string> = {
    multiple_choice: "Multiple choice",
    select_all: "Select all that apply",
    bow_tie: "Bow-tie",
    matrix: "Matrix / grid",
    unfolding_case: "Unfolding case",
    highlight: "Highlight",
    ordered_response: "Ordered response",
    drag_drop: "Drag & drop",
    clinical_reasoning: "Clinical reasoning",
    k_type: "K-type (combination)",
    true_false: "True / false",
    short_answer: "Short answer",
    sequential: "Sequential item set",
    abstract: "Journal abstract",
    drug_ad: "Pharmaceutical ad",
    ethics: "Ethics / professionalism",
    biostats: "Biostatistics",
    ccs_prompt: "CCS case simulation",
    exhibit: "Chart / exhibit",
    vignette: "Clinical vignette",
  };
  return labels[id] ?? id.replace(/_/g, " ");
}
