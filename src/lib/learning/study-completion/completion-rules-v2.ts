import type { ExamSlug } from "@/types/edtech";
import {
  COMPLETION_RULES_V1,
  isStudyCompletionExamSlug,
  type CompletionRulesV1,
  type StudyCompletionExamSlug,
} from "./completion-rules-v1";

export type StudyCompletionPillarWeightId =
  | "unique_question_coverage"
  | "full_length_exams"
  | "readiness_checks"
  | "quick_bites"
  | "study_guide_chapters";

export type CompletionRulesV2 = {
  version: "completion-rules-v2";
  minAttemptDurationMs: number;
  coveragePercentTarget: number;
  fullLengthExamsTarget: number;
  readinessChecksTarget: number;
  /** Quick Bite counted complete when watchPct reaches this threshold (0–100). */
  quickBiteWatchPctComplete: number;
  /** Study guide chapter scroll threshold (0–100). */
  chapterScrollPctComplete: number;
  /** Minimum verified reading seconds for a chapter to count complete. */
  chapterVerifiedSecondsComplete: number;
  /** Max seconds credited per study-guide heartbeat while the tab is visible. */
  chapterHeartbeatMaxSeconds: number;
  /** Max watchSeconds increment per Quick Bite progress POST (before elapsed-time cap). */
  quickBiteProgressMaxIncrementSeconds: number;
  /** Grace multiplier on elapsed seconds since last progress save (Quick Bites). */
  quickBiteProgressElapsedGrace: number;
  readinessEstimateMinUniqueQuestions: number;
  readinessEstimateRecentAttempts: number;
  /** Weights for overall %; must sum to 1 across pillars that apply. */
  pillarWeights: Record<StudyCompletionPillarWeightId, number>;
  perExam: Partial<
    Record<
      StudyCompletionExamSlug,
      {
        coveragePercentTarget?: number;
        fullLengthExamsTarget?: number;
        readinessChecksTarget?: number;
        pillarWeights?: Partial<Record<StudyCompletionPillarWeightId, number>>;
      }
    >
  >;
};

export const COMPLETION_RULES_V2: CompletionRulesV2 = {
  version: "completion-rules-v2",
  minAttemptDurationMs: COMPLETION_RULES_V1.minAttemptDurationMs,
  coveragePercentTarget: COMPLETION_RULES_V1.coveragePercentTarget,
  fullLengthExamsTarget: 10,
  readinessChecksTarget: COMPLETION_RULES_V1.readinessChecksTarget,
  quickBiteWatchPctComplete: 90,
  chapterScrollPctComplete: 90,
  chapterVerifiedSecondsComplete: 120,
  chapterHeartbeatMaxSeconds: 20,
  quickBiteProgressMaxIncrementSeconds: 30,
  quickBiteProgressElapsedGrace: 1.25,
  readinessEstimateMinUniqueQuestions: 100,
  readinessEstimateRecentAttempts: 300,
  pillarWeights: {
    unique_question_coverage: 0.45,
    full_length_exams: 0.15,
    readiness_checks: 0.1,
    quick_bites: 0.15,
    study_guide_chapters: 0.15,
  },
  perExam: {
    "aanp-fnp": {
      pillarWeights: {
        unique_question_coverage: 0.45,
        full_length_exams: 0.15,
        readiness_checks: 0.1,
        quick_bites: 0.15,
        study_guide_chapters: 0.15,
      },
    },
    pance: {
      pillarWeights: {
        unique_question_coverage: 0.45,
        full_length_exams: 0.15,
        readiness_checks: 0.1,
        quick_bites: 0.15,
        study_guide_chapters: 0.15,
      },
    },
    naplex: {
      pillarWeights: {
        unique_question_coverage: 0.4,
        full_length_exams: 0.15,
        readiness_checks: 0.1,
        quick_bites: 0.2,
        study_guide_chapters: 0.15,
      },
    },
  },
};

export function rulesForExamV2(
  examSlug: StudyCompletionExamSlug,
  rules: CompletionRulesV2 = COMPLETION_RULES_V2
): {
  coveragePercentTarget: number;
  fullLengthExamsTarget: number;
  readinessChecksTarget: number;
  quickBiteWatchPctComplete: number;
  chapterScrollPctComplete: number;
  chapterVerifiedSecondsComplete: number;
  chapterHeartbeatMaxSeconds: number;
  quickBiteProgressMaxIncrementSeconds: number;
  quickBiteProgressElapsedGrace: number;
  readinessEstimateMinUniqueQuestions: number;
  readinessEstimateRecentAttempts: number;
  pillarWeights: Record<StudyCompletionPillarWeightId, number>;
} {
  const override = rules.perExam[examSlug];
  const baseWeights = { ...rules.pillarWeights, ...override?.pillarWeights };
  return {
    coveragePercentTarget: override?.coveragePercentTarget ?? rules.coveragePercentTarget,
    fullLengthExamsTarget: override?.fullLengthExamsTarget ?? rules.fullLengthExamsTarget,
    readinessChecksTarget: override?.readinessChecksTarget ?? rules.readinessChecksTarget,
    quickBiteWatchPctComplete: rules.quickBiteWatchPctComplete,
    chapterScrollPctComplete: rules.chapterScrollPctComplete,
    chapterVerifiedSecondsComplete: rules.chapterVerifiedSecondsComplete,
    chapterHeartbeatMaxSeconds: rules.chapterHeartbeatMaxSeconds,
    quickBiteProgressMaxIncrementSeconds: rules.quickBiteProgressMaxIncrementSeconds,
    quickBiteProgressElapsedGrace: rules.quickBiteProgressElapsedGrace,
    readinessEstimateMinUniqueQuestions: rules.readinessEstimateMinUniqueQuestions,
    readinessEstimateRecentAttempts: rules.readinessEstimateRecentAttempts,
    pillarWeights: baseWeights,
  };
}

export function isCompletionRulesV2(
  rules: CompletionRulesV1 | CompletionRulesV2
): rules is CompletionRulesV2 {
  return rules.version === "completion-rules-v2";
}

/** @internal — guard non–phase-1 slugs at call sites. */
export function assertStudyCompletionExamSlugV2(slug: ExamSlug): StudyCompletionExamSlug {
  if (!isStudyCompletionExamSlug(slug)) {
    throw new Error(`Study completion is not configured for exam slug: ${slug}`);
  }
  return slug;
}
