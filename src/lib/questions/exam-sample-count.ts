/**
 * DB pull size for a practice or timed session. Kept off the finalize graph
 * so /api/questions can size the sample without loading serve gates.
 */
import { QUESTION_BANK_SAMPLE_MAX_PULL } from "@/lib/question-bank-db";
import {
  resolveTopicBankSampleCount,
  supportsTopicBankPractice,
} from "@/lib/exam-prep/topic-bank-sample-count";

/** Pool size for DB sampling — timed exams need enough rows to filter and hit exact count. */
export function resolveExamBankSampleCount(
  fieldId: string,
  limit: number,
  timedExam: boolean,
  opts?: { topicPractice?: boolean; bankPractice?: boolean }
): number {
  if (
    !timedExam &&
    (opts?.bankPractice || (opts?.topicPractice && supportsTopicBankPractice(fieldId)))
  ) {
    return resolveTopicBankSampleCount(limit);
  }

  if (!timedExam) {
    const clinicalPool =
      fieldId === "nursing" ||
      fieldId === "pharmacy" ||
      fieldId.startsWith("usmle") ||
      fieldId === "pance" ||
      fieldId === "npte-pt" ||
      fieldId === "aanp-fnp";
    if (fieldId === "aanp-fnp") return Math.min(Math.max(limit * 4, 40), 100);
    if (fieldId === "npte-pt") return Math.min(Math.max(limit * 6, 50), 150);
    if (clinicalPool) return Math.min(Math.max(limit * 6, 40), 120);
    return Math.max(limit, 40);
  }

  if (
    fieldId === "nursing" ||
    fieldId === "pharmacy" ||
    fieldId.startsWith("usmle") ||
    fieldId === "pance" ||
    fieldId === "npte-pt" ||
    fieldId === "aanp-fnp"
  ) {
    return Math.min(
      QUESTION_BANK_SAMPLE_MAX_PULL,
      Math.max(limit + (limit >= 100 ? 80 : 32), Math.ceil(limit * (limit >= 100 ? 2 : 1.45)))
    );
  }

  const headroom = Math.max(limit + 60, Math.ceil(limit * 1.25));
  return Math.min(headroom, QUESTION_BANK_SAMPLE_MAX_PULL);
}
