import { shuffleBankItems } from "@/lib/question-bank-db";
import { examQuestionToStudy, prepareQuestionsForSession } from "./prepare";
import type { RawQuestionInput, StudyQuestion } from "./types";
import {
  assessDifficultyMix,
  balanceDifficultyMix,
  enforceSessionCount,
  hasGenericPlaceholderOptions,
  hasAdjacentSimilarOptions,
  optionsFromStudyQuestion,
  resolveDifficultyBand,
  type DifficultyBand,
} from "./session-quality";
import {
  hasAdjacentSimilarSpread,
  spreadGroupKeyFromStudyQuestion,
} from "./spread-session-order";
import { QUESTION_BANK_SAMPLE_MAX_PULL } from "@/lib/question-bank-db";

/** Field ids used by full-length NCLEX, NAPLEX, USMLE, and PANCE simulators. */
export const FULL_EXAM_FIELD_IDS = new Set([
  "nursing",
  "pharmacy",
  "pance",
  "usmle-step-2",
  "usmle-step-1",
  "usmle-step-3",
]);

export function isFullExamField(fieldId: string): boolean {
  return FULL_EXAM_FIELD_IDS.has(fieldId) || fieldId.startsWith("usmle-step");
}

/** Pool size for DB sampling — timed exams need enough rows to filter, spread, and hit exact count. */
export function resolveExamBankSampleCount(
  fieldId: string,
  limit: number,
  timedExam: boolean
): number {
  if (!timedExam) {
    const clinicalPool =
      fieldId === "nursing" ||
      fieldId.startsWith("usmle") ||
      fieldId === "pance";
    if (clinicalPool) return Math.min(Math.max(limit * 6, 40), 120);
    return Math.max(limit, 40);
  }

  // Runtime clinical gates reject many rows — pull a large pool before spread/limit.
  if (
    fieldId === "nursing" ||
    fieldId.startsWith("usmle") ||
    fieldId === "pance"
  ) {
    return Math.min(
      QUESTION_BANK_SAMPLE_MAX_PULL,
      Math.max(limit * 3, limit + 150)
    );
  }

  const headroom = Math.max(limit + 60, Math.ceil(limit * 1.25));
  return Math.min(headroom, QUESTION_BANK_SAMPLE_MAX_PULL);
}

export type ExamSessionQualityReport = {
  ok: boolean;
  issues: string[];
  returned: number;
  requested: number;
  /** False when the source pool only had one difficulty band — variety is impossible. */
  poolAllowsDifficultyMix: boolean;
};

function rawInputDifficultyBand(q: RawQuestionInput): DifficultyBand {
  return resolveDifficultyBand({
    difficultyLabel: q.difficultyLabel,
  });
}

function studyQuestionDifficultyBand(q: StudyQuestion): DifficultyBand {
  return resolveDifficultyBand({
    difficultyLabel: q.difficulty,
  });
}

function poolAllowsDifficultyMix<T>(
  items: T[],
  bandFn: (item: T) => DifficultyBand
): boolean {
  if (items.length < 3) return true;
  return assessDifficultyMix(items, bandFn).isVaried;
}

function selectRawInputsForSession(
  raw: RawQuestionInput[],
  requested: number,
  shuffle = false
): RawQuestionInput[] {
  const pool = shuffle ? shuffleBankItems(raw) : raw;
  if (pool.length <= requested) return pool;
  return balanceDifficultyMix(pool, requested, rawInputDifficultyBand);
}

export function assessExamSessionQuality(
  prepared: StudyQuestion[],
  requested: number,
  opts?: { poolAllowsDifficultyMix?: boolean }
): ExamSessionQualityReport {
  const issues: string[] = [];
  const returned = prepared.length;
  const poolAllowsDifficultyMix = opts?.poolAllowsDifficultyMix ?? true;

  if (returned !== requested) {
    issues.push(`count_mismatch:${returned}/${requested}`);
  }

  if (hasAdjacentSimilarSpread(prepared, spreadGroupKeyFromStudyQuestion)) {
    issues.push("adjacent_similar_cases");
  }

  if (hasAdjacentSimilarOptions(prepared, optionsFromStudyQuestion)) {
    issues.push("adjacent_similar_options");
  }

  const mix = assessDifficultyMix(prepared, studyQuestionDifficultyBand);
  if (!mix.isVaried && returned >= 6 && poolAllowsDifficultyMix) {
    issues.push("difficulty_not_varied");
  }

  for (const q of prepared) {
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
    poolAllowsDifficultyMix,
  };
}

/**
 * Prepare, spread, and validate a timed/full exam block before it reaches the client.
 * Retries spread once if adjacency rules fail while count is correct.
 */
export function finalizeExamSessionQuestions(
  raw: RawQuestionInput[],
  requested: number
): { prepared: StudyQuestion[]; quality: ExamSessionQualityReport } {
  const poolAllowsMix = poolAllowsDifficultyMix(raw, rawInputDifficultyBand);

  let selected = selectRawInputsForSession(raw, requested);
  let prepared = enforceSessionCount(
    prepareQuestionsForSession(selected, { shuffleOrder: true }),
    requested
  );
  let quality = assessExamSessionQuality(prepared, requested, {
    poolAllowsDifficultyMix: poolAllowsMix,
  });

  for (let attempt = 0; attempt < 5 && !quality.ok; attempt++) {
    const spreadIssues = quality.issues.some((i) =>
      [
        "adjacent_similar_cases",
        "adjacent_similar_options",
        "generic_distractors",
        "difficulty_not_varied",
      ].includes(i)
    );
    if (!spreadIssues && !quality.issues.some((i) => i.startsWith("count_mismatch"))) {
      break;
    }
    selected = selectRawInputsForSession(raw, requested, true);
    prepared = enforceSessionCount(
      prepareQuestionsForSession(selected, { shuffleOrder: true }),
      requested
    );
    quality = assessExamSessionQuality(prepared, requested, {
      poolAllowsDifficultyMix: poolAllowsMix,
    });
  }

  return { prepared, quality };
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

  if (
    quality.returned >= 4 &&
    (quality.issues.includes("adjacent_similar_options") ||
      quality.issues.includes("adjacent_similar_cases"))
  ) {
    throw new Error(
      `Could not assemble a sufficiently diverse ${fieldId} session. Please try again.`
    );
  }

  if (
    quality.poolAllowsDifficultyMix &&
    quality.returned >= 6 &&
    quality.issues.includes("difficulty_not_varied")
  ) {
    throw new Error(
      `Could not assemble a balanced ${fieldId} difficulty mix. Please try again.`
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
