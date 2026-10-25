import { EXAM_CATALOG } from "@/lib/edtech/exams";
import { prisma } from "@/lib/prisma";
import type { ExamSlug } from "@/types/edtech";
import {
  assertStudyCompletionExamSlug,
  COMPLETION_RULES_V1,
  isStudyCompletionExamSlug,
  rulesForExam,
  STUDY_COMPLETION_EXAM_SLUGS,
  type CompletionRulesV1,
  type StudyCompletionExamSlug,
} from "./completion-rules-v1";

export type StudyCompletionPillarId =
  | "unique_question_coverage"
  | "full_length_exams"
  | "readiness_checks";

export type StudyCompletionPillar = {
  id: StudyCompletionPillarId;
  label: string;
  done: number;
  target: number;
  met: boolean;
};

export type StudyCompletionResult = {
  ruleVersion: string;
  examSlug: StudyCompletionExamSlug;
  fieldId: string;
  liveBankCount: number;
  coveragePercent: number;
  fastAttemptsExcluded: number;
  pillars: StudyCompletionPillar[];
  overallPercent: number;
};

export type StudyCompletionMetrics = {
  liveBankCount: number;
  distinctBankItemsAttempted: number;
  fastAttemptsExcluded: number;
  fullLengthExamsCompleted: number;
  readinessChecksCompleted: number;
};

export function coverageTargetQuestionCount(
  liveBankCount: number,
  coveragePercentTarget: number
): number {
  if (liveBankCount <= 0) return 0;
  return Math.min(
    liveBankCount,
    Math.ceil((liveBankCount * coveragePercentTarget) / 100)
  );
}

export function computeCoveragePercent(
  distinctAttempted: number,
  liveBankCount: number
): number {
  if (liveBankCount <= 0) return 0;
  return Math.round(Math.min(100, Math.max(0, (distinctAttempted / liveBankCount) * 100)));
}

export function pillarProgressPercent(done: number, target: number): number {
  if (target <= 0) return done > 0 ? 100 : 0;
  return Math.min(100, Math.round((done / target) * 100));
}

export function computeOverallPercent(pillars: StudyCompletionPillar[]): number {
  if (pillars.length === 0) return 0;
  const sum = pillars.reduce((acc, pillar) => acc + pillarProgressPercent(pillar.done, pillar.target), 0);
  return Math.round(sum / pillars.length);
}

export function buildStudyCompletionResult(
  examSlug: StudyCompletionExamSlug,
  metrics: StudyCompletionMetrics,
  rules: CompletionRulesV1 = COMPLETION_RULES_V1
): StudyCompletionResult {
  const fieldId = EXAM_CATALOG[examSlug].fieldId;
  const thresholds = rulesForExam(examSlug, rules);
  const coverageTarget = coverageTargetQuestionCount(
    metrics.liveBankCount,
    thresholds.coveragePercentTarget
  );
  const coveragePercent = computeCoveragePercent(
    metrics.distinctBankItemsAttempted,
    metrics.liveBankCount
  );

  const pillars: StudyCompletionPillar[] = [
    {
      id: "unique_question_coverage",
      label: "Unique questions",
      done: metrics.distinctBankItemsAttempted,
      target: coverageTarget,
      met: metrics.distinctBankItemsAttempted >= coverageTarget && coverageTarget > 0,
    },
    {
      id: "full_length_exams",
      label: "Full-length practice exams",
      done: metrics.fullLengthExamsCompleted,
      target: thresholds.fullLengthExamsTarget,
      met: metrics.fullLengthExamsCompleted >= thresholds.fullLengthExamsTarget,
    },
    {
      id: "readiness_checks",
      label: "Readiness checks",
      done: metrics.readinessChecksCompleted,
      target: thresholds.readinessChecksTarget,
      met: metrics.readinessChecksCompleted >= thresholds.readinessChecksTarget,
    },
  ];

  return {
    ruleVersion: rules.version,
    examSlug,
    fieldId,
    liveBankCount: metrics.liveBankCount,
    coveragePercent,
    fastAttemptsExcluded: metrics.fastAttemptsExcluded,
    pillars,
    overallPercent: computeOverallPercent(pillars),
  };
}

async function loadStudyCompletionMetrics(
  userId: string,
  examSlug: StudyCompletionExamSlug,
  rules: CompletionRulesV1
): Promise<StudyCompletionMetrics> {
  const fieldId = EXAM_CATALOG[examSlug].fieldId;
  const minDurationMs = rules.minAttemptDurationMs;
  const fullLengthQuestionCount = EXAM_CATALOG[examSlug].simulatedQuestionCount;

  const [
    liveBankCount,
    coverageRows,
    fastRows,
    fullLengthExamsCompleted,
    readinessChecksCompleted,
  ] = await Promise.all([
    prisma.questionBankItem.count({
      where: { fieldId, active: true, qaPassed: true },
    }),
    prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(DISTINCT "bankItemId")::bigint AS count
      FROM "QuestionAttempt"
      WHERE "userId" = ${userId}
        AND "fieldId" = ${fieldId}
        AND "bankItemId" IS NOT NULL
        AND "durationMs" IS NOT NULL
        AND "durationMs" >= ${minDurationMs}
    `,
    prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*)::bigint AS count
      FROM "QuestionAttempt"
      WHERE "userId" = ${userId}
        AND "fieldId" = ${fieldId}
        AND ("durationMs" IS NULL OR "durationMs" < ${minDurationMs})
    `,
    prisma.examSession.count({
      where: {
        userId,
        examType: examSlug,
        status: "completed",
        questionCount: fullLengthQuestionCount,
      },
    }),
    prisma.readinessCheck.count({
      where: {
        userId,
        examSlug,
        status: "completed",
      },
    }),
  ]);

  return {
    liveBankCount,
    distinctBankItemsAttempted: Number(coverageRows[0]?.count ?? 0),
    fastAttemptsExcluded: Number(fastRows[0]?.count ?? 0),
    fullLengthExamsCompleted,
    readinessChecksCompleted,
  };
}

export async function computeStudyCompletion(
  userId: string,
  examSlug: string,
  options?: { rules?: CompletionRulesV1 }
): Promise<StudyCompletionResult> {
  const slug = assertStudyCompletionExamSlug(examSlug as ExamSlug);
  const rules = options?.rules ?? COMPLETION_RULES_V1;
  const metrics = await loadStudyCompletionMetrics(userId, slug, rules);
  return buildStudyCompletionResult(slug, metrics, rules);
}

export type AdminStudyCompletionBoardRow = StudyCompletionResult;

export async function computeAdminStudyCompletionBreakdown(
  userId: string,
  options?: { rules?: CompletionRulesV1 }
): Promise<AdminStudyCompletionBoardRow[]> {
  const rules = options?.rules ?? COMPLETION_RULES_V1;
  return Promise.all(
    STUDY_COMPLETION_EXAM_SLUGS.map(async (examSlug) => {
      const metrics = await loadStudyCompletionMetrics(userId, examSlug, rules);
      return buildStudyCompletionResult(examSlug, metrics, rules);
    })
  );
}

export function studyCompletionSupportedForExam(examSlug: ExamSlug): boolean {
  return isStudyCompletionExamSlug(examSlug);
}
