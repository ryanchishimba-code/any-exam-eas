import type { BankItem } from "@/lib/question-bank";
import {
  CRITERION_LABELS,
  type QualityCriterion,
  type QuestionQualityRating,
  rateQuestionQuality,
} from "./quality-rubric";

export type QuestionImprovementRequest = {
  item: BankItem;
  rating: QuestionQualityRating;
  fieldId?: string;
  examName?: string;
};

/** Build an AI prompt to rewrite weak items while preserving exam alignment. */
export function buildQuestionImprovementPrompt(req: QuestionImprovementRequest): string {
  const { item, rating, fieldId, examName } = req;
  const weakNotes = rating.weakCriteria
    .map((c) => `- ${CRITERION_LABELS[c]}: ${rating.feedback[c] ?? "Below board standard."}`)
    .join("\n");

  return [
    `You are a board-exam item writer for ${examName ?? fieldId ?? "healthcare licensing exams"}.`,
    "Rewrite this question to meet NCSBN / NBME / NABP-style standards.",
    "",
    "CURRENT ITEM:",
    `Stem: ${item.scenario ? `${item.scenario}\n` : ""}${item.question}`,
    `Options: ${(item.options ?? []).map((o, i) => `${String.fromCharCode(65 + i)}. ${o}`).join(" | ")}`,
    `Correct: ${item.correctAnswer}`,
    `Explanation: ${item.explanation}`,
    "",
    `Quality grade: ${rating.grade} (${rating.overall}/10)`,
    "Improve these weak areas:",
    weakNotes || "- General polish for board readiness.",
    "",
    "Requirements:",
    "- Four plausible, homogeneous distractors",
    "- Clear single-best-answer stem",
    "- Detailed teaching rationale with why each distractor fails",
    "- Blueprint-aligned high-yield focus",
    "- Return JSON: { question, options[4], correctAnswer, explanation, distractorRationale, clinicalReasoning, blueprintTopic }",
  ].join("\n");
}

export function assessBankItem(item: BankItem): QuestionQualityRating {
  return rateQuestionQuality(item);
}

export function shouldAutoImprove(rating: QuestionQualityRating): boolean {
  return rating.overall < 7 || rating.weakCriteria.includes("distractorQuality");
}

export function priorityCriteria(rating: QuestionQualityRating): QualityCriterion[] {
  return [...rating.weakCriteria].sort(
    (a, b) => rating.criteria[a] - rating.criteria[b]
  );
}
