import { QUESTION_BANK_SAMPLE_MAX_PULL } from "@/lib/question-bank-db";
import { isMpjeField } from "@/lib/mpje/config";
import { isPracticeFieldId } from "@/lib/subjects/field-ids";

/** Single-subject question bank sessions (not mixed-field / not timed full exams). */
export function supportsTopicBankPractice(fieldId: string): boolean {
  return isPracticeFieldId(fieldId) || isMpjeField(fieldId);
}

/** DB pull size — large enough to survive runtime gates without template-stem collapse. */
export function resolveTopicBankSampleCount(limit: number): number {
  return Math.min(QUESTION_BANK_SAMPLE_MAX_PULL, Math.max(limit * 6, 80));
}
