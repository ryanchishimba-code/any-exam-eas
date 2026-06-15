import {
  examQuestionToStudy,
  prepareQuestionsForSession,
  type RawQuestionInput,
  type StudyQuestion,
} from "./prepare";
import {
  assessDifficultyMix,
  enforceSessionCount,
  hasGenericPlaceholderOptions,
  hasAdjacentSimilarOptions,
  optionsFromStudyQuestion,
  type DifficultyBand,
} from "./session-quality";
import {
  hasAdjacentSimilarSpread,
  spreadGroupKeyFromStudyQuestion,
} from "./spread-session-order";

/** Field ids used by full-length NCLEX, NAPLEX, USMLE, and MPJE simulators. */
export const FULL_EXAM_FIELD_IDS = new Set([
  "nursing",
  "pharmacy",
  "mpje",
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
    const clinicalPool = fieldId === "nursing" || fieldId.startsWith("usmle");
    if (clinicalPool) return Math.min(Math.max(limit * 6, 40), 120);
    return Math.max(limit, 40);
  }

  const headroom = Math.max(limit + 60, Math.ceil(limit * 1.25));
  return Math.min(headroom, 400);
}

export type ExamSessionQualityReport = {
  ok: boolean;
  issues: string[];
  returned: number;
  requested: number;
};

function studyQuestionDifficultyBand(q: StudyQuestion): DifficultyBand {
  const label = q.difficulty?.toLowerCase();
  if (label === "easy") return "easy";
  if (label === "hard") return "hard";
  return "medium";
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

  if (hasAdjacentSimilarSpread(prepared, spreadGroupKeyFromStudyQuestion)) {
    issues.push("adjacent_similar_cases");
  }

  if (hasAdjacentSimilarOptions(prepared, optionsFromStudyQuestion)) {
    issues.push("adjacent_similar_options");
  }

  const mix = assessDifficultyMix(prepared, studyQuestionDifficultyBand);
  if (!mix.isVaried && returned >= 6) {
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

  return { ok: issues.length === 0, issues, returned, requested };
}

/**
 * Prepare, spread, and validate a timed/full exam block before it reaches the client.
 * Retries spread once if adjacency rules fail while count is correct.
 */
export function finalizeExamSessionQuestions(
  raw: RawQuestionInput[],
  requested: number
): { prepared: StudyQuestion[]; quality: ExamSessionQualityReport } {
  let prepared = enforceSessionCount(
    prepareQuestionsForSession(raw, { shuffleOrder: true }),
    requested
  );
  let quality = assessExamSessionQuality(prepared, requested);

  for (let attempt = 0; attempt < 3 && !quality.ok; attempt++) {
    const spreadIssues = quality.issues.some((i) =>
      ["adjacent_similar_cases", "adjacent_similar_options"].includes(i)
    );
    if (!spreadIssues && !quality.issues.some((i) => i.startsWith("count_mismatch"))) {
      break;
    }
    prepared = enforceSessionCount(
      prepareQuestionsForSession(raw, { shuffleOrder: true }),
      requested
    );
    quality = assessExamSessionQuality(prepared, requested);
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
