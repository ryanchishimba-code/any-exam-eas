import type { StudyQuestion } from "@/lib/questions/types";
import { normalizeFieldId } from "@/lib/subjects/field-ids";
import { isAiTutorFieldId } from "@/lib/learning/ai-tutor-fields";
import type { AiTutorRequest } from "./ai-tutor-types";

export function buildAiTutorStem(question: StudyQuestion): string {
  const stem = question.stem.trim();
  const vignette = question.vignette?.trim();
  if (vignette) return `${vignette}\n\n${stem}`;
  return stem;
}

export function buildAiTutorRequest(
  field: string,
  question: StudyQuestion,
  selectedAnswers?: string[]
): AiTutorRequest | null {
  const fieldId = normalizeFieldId(field);
  if (!isAiTutorFieldId(fieldId)) return null;

  return {
    fieldId,
    questionId: question.bankItemId ?? question.id,
    stem: buildAiTutorStem(question),
    options: question.options,
    correctAnswers: question.correctAnswers,
    selectedAnswers: selectedAnswers?.length ? selectedAnswers : undefined,
    explanation: question.explanationDetail?.whyCorrect ?? question.explanation,
    tags: question.tags,
  };
}
