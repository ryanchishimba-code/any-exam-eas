import {
  buildLandingBankCountsDisplay,
  type LandingBankCountsDisplay,
  type QuestionBankCountsSnapshot,
} from "@/lib/marketing/question-bank-counts";
import { EXAM_FIELD_IDS, type ExamFieldId } from "@/lib/subjects/field-ids";

function buildDegradedSnapshot(): QuestionBankCountsSnapshot {
  const fields = Object.fromEntries(
    EXAM_FIELD_IDS.map((fieldId) => [
      fieldId,
      { fieldId, total: 0, active: 0, served: 0 },
    ])
  ) as Record<ExamFieldId, QuestionBankCountsSnapshot["fields"][ExamFieldId]>;

  return {
    fields,
    totals: { total: 0, active: 0, served: 0 },
    updatedAt: new Date().toISOString(),
    degraded: true,
  };
}

/** Published floor counts — instant hero/social proof while live DB counts stream in. */
export const LANDING_FALLBACK_BANK_COUNTS: LandingBankCountsDisplay =
  buildLandingBankCountsDisplay(buildDegradedSnapshot());
