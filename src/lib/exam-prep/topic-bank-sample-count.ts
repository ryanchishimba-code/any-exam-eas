/**
 * Topic-bank pool sizing. Split from topic-bank-practice so sample-count
 * math does not load serve gates.
 */
import { QUESTION_BANK_SAMPLE_MAX_PULL } from "@/lib/question-bank-db";
import { isMpjeField } from "@/lib/mpje/config";
import { isPracticeFieldId } from "@/lib/subjects/field-ids";

/** Single-subject question bank sessions (not mixed-field / not timed full exams). */
export function supportsTopicBankPractice(fieldId: string): boolean {
  return isPracticeFieldId(fieldId) || isMpjeField(fieldId);
}

/** DB pull size — large enough to survive runtime gates without template-stem collapse. */
export function resolveTopicBankSampleCount(
  limit: number,
  mode: "session" | "selection" = "session"
): number {
  if (mode === "selection") {
    // Adaptive/selection only needs a modest ranked pool, not a full session oversample.
    return Math.min(120, Math.max(limit * 3, 48));
  }
  return Math.min(QUESTION_BANK_SAMPLE_MAX_PULL, Math.max(limit * 6, 80));
}
