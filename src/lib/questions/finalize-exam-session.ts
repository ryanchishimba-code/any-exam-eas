import { shuffleBankItems } from "@/lib/question-bank-db";
import { examQuestionToStudy, prepareQuestionsForSession } from "./prepare";
import type { RawQuestionInput, StudyQuestion } from "./types";
import {
  enforceSessionCount,
  hasGenericPlaceholderOptions,
  rawQuestionMeetsBoardBar,
  rawQuestionMeetsRelaxedBoardBar,
  studyQuestionMeetsBoardBar,
} from "./session-quality";
import { selectSpreadRawInputs, type SessionDedupeMode } from "./spread-session-order";
import { QUESTION_BANK_SAMPLE_MAX_PULL } from "@/lib/question-bank-db";
import { isUsmleFieldId } from "@/lib/exam-prep/usmle/steps";
import { finalizeUsmleExamSessionQuestions } from "@/lib/exam-prep/usmle/progressive-exam-fill";
import {
  resolveTopicBankSampleCount,
  supportsTopicBankPractice,
} from "@/lib/exam-prep/topic-bank-practice";

/** Field ids used by full-length NCLEX, NAPLEX, USMLE, and PANCE simulators. */
export const FULL_EXAM_FIELD_IDS = new Set([
  "nursing",
  "pharmacy",
  "pance",
  "aanp-fnp",
  "npte-pt",
  "usmle-step-2",
  "usmle-step-1",
  "usmle-step-3",
]);

export function isFullExamField(fieldId: string): boolean {
  return FULL_EXAM_FIELD_IDS.has(fieldId) || fieldId.startsWith("usmle-step");
}

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

/** Session pool cap — pass the full vetted pool when available. */
export function resolveSessionSpreadPoolLimit(sessionLimit: number, available?: number): number {
  if (available != null && available > 0) return available;
  return Math.max(sessionLimit * 2, sessionLimit + 40);
}

export type ExamSessionQualityReport = {
  ok: boolean;
  issues: string[];
  returned: number;
  requested: number;
  /** @deprecated Variability checks removed — always true for API compat. */
  poolAllowsDifficultyMix: boolean;
};

function selectRawInputsForSession(
  raw: RawQuestionInput[],
  requested: number,
  shuffle = false,
  dedupeMode?: SessionDedupeMode
): RawQuestionInput[] {
  const spreadOpts = { requestedCount: requested, dedupeMode };
  if (!shuffle) {
    return selectSpreadRawInputs(raw, requested, spreadOpts);
  }
  return selectSpreadRawInputs(shuffleBankItems(raw), requested, spreadOpts);
}

export function assessExamSessionQuality(
  prepared: StudyQuestion[],
  requested: number
): ExamSessionQualityReport {
  const issues: string[] = [];
  const returned = prepared.length;

  if (returned !== requested) {
    issues.push(`count_mismatch:${returned}/${requested}`);
  }

  for (const q of prepared) {
    if (!studyQuestionMeetsBoardBar(q)) {
      issues.push("below_board_bar");
      break;
    }

    if (
      (q.type === "multiple_choice" || q.type === "k_type" || q.type === "select_all") &&
      q.options.length > 0 &&
      hasGenericPlaceholderOptions(q.options)
    ) {
      issues.push("generic_distractors");
      break;
    }
  }

  return {
    ok: issues.length === 0,
    issues,
    returned,
    requested,
    poolAllowsDifficultyMix: true,
  };
}

function finalizeWithBoardBar(
  raw: RawQuestionInput[],
  requested: number,
  meetsBar: (q: RawQuestionInput) => boolean,
  dedupeMode?: SessionDedupeMode
): { prepared: StudyQuestion[]; quality: ExamSessionQualityReport } {
  const vettedRaw = raw.filter(meetsBar);
  const selected = selectRawInputsForSession(vettedRaw, requested, false, dedupeMode);
  const prepared = enforceSessionCount(
    prepareQuestionsForSession(selected, { shuffleOrder: false }),
    requested
  );
  const quality = assessExamSessionQuality(prepared, requested);
  return { prepared, quality };
}

/** Progressive tier relaxation for timed/full exams and large single-topic bank sessions. */
function usesProgressiveExamFinalize(
  fieldId: string | undefined,
  requested: number,
  topicPractice?: boolean
): boolean {
  if (!fieldId) return false;
  if (topicPractice) {
    return supportsTopicBankPractice(fieldId) && requested >= 50;
  }
  if (isUsmleFieldId(fieldId) && requested >= 50) return true;
  if (isFullExamField(fieldId) && requested >= 50) return true;
  return false;
}

/**
 * Prepare and validate a timed/full exam block before it reaches the client.
 * Quality gates: exact count, board-caliber structure, and non-placeholder distractors.
 * Falls back to a slightly lower bar when the strict pool cannot fill the session.
 * USMLE fields use progressive tier relaxation until the requested count is met.
 */
export function finalizeExamSessionQuestions(
  raw: RawQuestionInput[],
  requested: number,
  opts?: { fieldId?: string; topicPractice?: boolean }
): { prepared: StudyQuestion[]; quality: ExamSessionQualityReport } {
  if (usesProgressiveExamFinalize(opts?.fieldId, requested, opts?.topicPractice)) {
    return finalizeUsmleExamSessionQuestions(raw, requested);
  }

  const dedupeMode: SessionDedupeMode | undefined = opts?.topicPractice ? "id" : undefined;

  const strict = finalizeWithBoardBar(raw, requested, rawQuestionMeetsBoardBar, dedupeMode);
  if (strict.prepared.length >= requested && strict.quality.ok) {
    return strict;
  }

  const relaxed = finalizeWithBoardBar(
    raw,
    requested,
    rawQuestionMeetsRelaxedBoardBar,
    dedupeMode
  );
  if (relaxed.prepared.length >= requested) {
    const quality = assessExamSessionQuality(relaxed.prepared, requested);
    return {
      prepared: relaxed.prepared,
      quality: {
        ...quality,
        ok:
          quality.returned === requested &&
          !quality.issues.includes("generic_distractors"),
      },
    };
  }

  return strict.prepared.length >= relaxed.prepared.length ? strict : relaxed;
}

export function assertExamSessionReady(
  quality: ExamSessionQualityReport,
  fieldId: string
): void {
  if (quality.ok) return;

  const countFailed = quality.issues.some((i) => i.startsWith("count_mismatch"));
  if (countFailed) {
    throw new Error(
      `Not enough ${fieldId} questions available (${quality.returned}/${quality.requested}). Try a shorter exam length.`
    );
  }

  if (quality.issues.includes("generic_distractors")) {
    throw new Error(
      `Some ${fieldId} questions did not meet board-style distractor standards. Please try again.`
    );
  }

  if (quality.issues.includes("below_board_bar")) {
    throw new Error(
      `Some ${fieldId} questions did not meet board-exam quality standards. Please try again.`
    );
  }

  if (quality.returned !== quality.requested) {
    throw new Error("Exam session could not be assembled at the requested length.");
  }
}

/** Map already-prepared API questions without changing session order or option order. */
export function mapApiQuestionsToStudy(
  raw: RawQuestionInput[],
  opts?: { shuffleOptions?: boolean }
): StudyQuestion[] {
  return raw.map((q, i) => examQuestionToStudy(q, i, opts));
}
