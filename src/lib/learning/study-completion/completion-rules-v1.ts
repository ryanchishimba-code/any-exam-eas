import type { ExamSlug } from "@/types/edtech";

/** Boards included in phase 1 of the study-completion meter. */
export const STUDY_COMPLETION_EXAM_SLUGS = [
  "nclex",
  "naplex",
  "aanp-fnp",
  "pance",
] as const;

export type StudyCompletionExamSlug = (typeof STUDY_COMPLETION_EXAM_SLUGS)[number];

export function isStudyCompletionExamSlug(slug: string): slug is StudyCompletionExamSlug {
  return (STUDY_COMPLETION_EXAM_SLUGS as readonly string[]).includes(slug);
}

export type CompletionRulesV1 = {
  version: "completion-rules-v1";
  /** Minimum time on a question before it counts toward unique coverage. */
  minAttemptDurationMs: number;
  /** Fraction of the live bank (0–100) required for the coverage pillar. */
  coveragePercentTarget: number;
  /** Default full-length completed exams required. */
  fullLengthExamsTarget: number;
  /** Completed readiness checks required. */
  readinessChecksTarget: number;
  perExam: Partial<
    Record<
      StudyCompletionExamSlug,
      {
        coveragePercentTarget?: number;
        fullLengthExamsTarget?: number;
        readinessChecksTarget?: number;
      }
    >
  >;
};

export const COMPLETION_RULES_V1: CompletionRulesV1 = {
  version: "completion-rules-v1",
  minAttemptDurationMs: 5000,
  coveragePercentTarget: 85,
  fullLengthExamsTarget: 3,
  readinessChecksTarget: 1,
  perExam: {
    "aanp-fnp": {
      fullLengthExamsTarget: 2,
    },
  },
};

export function rulesForExam(
  examSlug: StudyCompletionExamSlug,
  rules: CompletionRulesV1 = COMPLETION_RULES_V1
): {
  coveragePercentTarget: number;
  fullLengthExamsTarget: number;
  readinessChecksTarget: number;
} {
  const override = rules.perExam[examSlug];
  return {
    coveragePercentTarget: override?.coveragePercentTarget ?? rules.coveragePercentTarget,
    fullLengthExamsTarget: override?.fullLengthExamsTarget ?? rules.fullLengthExamsTarget,
    readinessChecksTarget: override?.readinessChecksTarget ?? rules.readinessChecksTarget,
  };
}

/** @internal — guard non–phase-1 slugs at call sites. */
export function assertStudyCompletionExamSlug(slug: ExamSlug): StudyCompletionExamSlug {
  if (!isStudyCompletionExamSlug(slug)) {
    throw new Error(`Study completion is not configured for exam slug: ${slug}`);
  }
  return slug;
}
