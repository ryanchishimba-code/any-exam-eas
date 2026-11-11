import { EXAM_CATALOG } from "@/lib/edtech/exams";
import { countActiveQuestions } from "@/lib/question-bank-db";
import { prisma } from "@/lib/prisma";
import { qualifiesAsFullLengthExam, readinessChecksFromPractice } from "./full-length-exam-count";
import { quickBiteSlugsForBoard } from "@/lib/quick-bites/board-episodes";
import { getPublishedGuide } from "@/lib/nclex-study-guide/queries";
import type { ExamSlug } from "@/types/edtech";
import {
  assertStudyCompletionExamSlug,
  isStudyCompletionExamSlug,
  rulesForExam,
  STUDY_COMPLETION_EXAM_SLUGS,
  type CompletionRulesV1,
  type StudyCompletionExamSlug
} from "./completion-rules-v1";
import {
  COMPLETION_RULES_V2,
  isCompletionRulesV2,
  rulesForExamV2,
  type CompletionRulesV2,
  type StudyCompletionPillarWeightId
} from "./completion-rules-v2";
import {
  computeReadinessEstimate,
  type ReadinessEstimateResult
} from "./compute-readiness-estimate";

export type StudyCompletionPillarId = StudyCompletionPillarWeightId;

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
  readinessEstimate: ReadinessEstimateResult;
};

export type StudyCompletionMetrics = {
  liveBankCount: number;
  distinctBankItemsAttempted: number;
  fastAttemptsExcluded: number;
  fullLengthExamsCompleted: number;
  readinessChecksCompleted: number;
  quickBitesCompleted: number;
  quickBitesTotal: number;
  studyGuideChaptersCompleted: number;
  studyGuideChaptersTotal: number;
};

export type StudyCompletionRules = CompletionRulesV1 | CompletionRulesV2;

export const ACTIVE_COMPLETION_RULES: CompletionRulesV2 = COMPLETION_RULES_V2;

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
  const cappedDone = Math.min(done, target);
  return Math.min(100, Math.round((cappedDone / target) * 100));
}

export function computeOverallPercent(pillars: StudyCompletionPillar[]): number {
  if (pillars.length === 0) return 0;
  const sum = pillars.reduce(
    (acc, pillar) => acc + pillarProgressPercent(pillar.done, pillar.target),
    0
  );
  return Math.round(sum / pillars.length);
}

export function computeWeightedOverallPercent(
  pillars: StudyCompletionPillar[],
  weights: Record<StudyCompletionPillarId, number>
): number {
  let weightedSum = 0;
  let weightTotal = 0;
  for (const pillar of pillars) {
    const weight = weights[pillar.id] ?? 0;
    if (weight <= 0) continue;
    if (pillar.target <= 0) continue;
    const pct = pillarProgressPercent(pillar.done, pillar.target);
    weightedSum += pct * weight;
    weightTotal += weight;
  }
  if (weightTotal <= 0) return 0;
  return Math.round(weightedSum / weightTotal);
}

export function buildStudyCompletionResult(
  examSlug: StudyCompletionExamSlug,
  metrics: StudyCompletionMetrics,
  rules: StudyCompletionRules = ACTIVE_COMPLETION_RULES,
  readinessEstimate: ReadinessEstimateResult = {
    status: "insufficient_data",
    message: "Answer more questions to see your estimate."
}
): StudyCompletionResult {
  const fieldId = EXAM_CATALOG[examSlug].fieldId;
  const v2 = isCompletionRulesV2(rules);
  const thresholds = v2 ? rulesForExamV2(examSlug, rules) : rulesForExam(examSlug, rules as CompletionRulesV1);
  // The Questions row uses the served-bank total, the same number as the
  // question bank and the board page. coveragePercentTarget stays on the
  // rules for older estimates; it is not the denominator students see.
  const coverageTarget = metrics.liveBankCount;
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
      met: metrics.distinctBankItemsAttempted >= coverageTarget && coverageTarget > 0
},
    {
      id: "full_length_exams",
      label: "Full-length practice exams",
      done: metrics.fullLengthExamsCompleted,
      target: thresholds.fullLengthExamsTarget,
      met: metrics.fullLengthExamsCompleted >= thresholds.fullLengthExamsTarget
},
    {
      id: "readiness_checks",
      label: "Readiness checks",
      done: metrics.readinessChecksCompleted,
      target: thresholds.readinessChecksTarget,
      met: metrics.readinessChecksCompleted >= thresholds.readinessChecksTarget
},
  ];

  if (v2 && metrics.quickBitesTotal > 0) {
    pillars.push({
      id: "quick_bites",
      label: "Quick Bites",
      done: metrics.quickBitesCompleted,
      target: metrics.quickBitesTotal,
      met: metrics.quickBitesCompleted >= metrics.quickBitesTotal && metrics.quickBitesTotal > 0
});
  }

  if (v2 && metrics.studyGuideChaptersTotal > 0) {
    pillars.push({
      id: "study_guide_chapters",
      label: "Study guide chapters",
      done: metrics.studyGuideChaptersCompleted,
      target: metrics.studyGuideChaptersTotal,
      met:
        metrics.studyGuideChaptersCompleted >= metrics.studyGuideChaptersTotal &&
        metrics.studyGuideChaptersTotal > 0
});
  }

  const overallPercent =
    v2 && isCompletionRulesV2(rules)
      ? computeWeightedOverallPercent(pillars, rulesForExamV2(examSlug, rules).pillarWeights)
      : computeOverallPercent(pillars);

  return {
    ruleVersion: rules.version,
    examSlug,
    fieldId,
    liveBankCount: metrics.liveBankCount,
    coveragePercent,
    fastAttemptsExcluded: metrics.fastAttemptsExcluded,
    pillars,
    overallPercent,
    readinessEstimate
};
}

/**
 * Student-serving gate: active, qaPassed, and STUDENT_ELIGIBLE_SQL
 * (that predicate already drops code-level hidden ids). Same count the
 * question bank and board pages show. Falls back to active + qaPassed
 * only when that read fails, so the card still renders.
 */
async function countServedBankQuestions(fieldId: string): Promise<number> {
  try {
    const served = await countActiveQuestions(fieldId);
    if (Number.isFinite(served) && served >= 0) return served;
  } catch (error) {
    console.warn(
      "[study-completion] served bank count failed:",
      error instanceof Error ? error.message : error
    );
  }
  // Do not fall back to active+qaPassed. That wider pool is the number
  // that disagreed with the question bank (for example 6,245 vs 4,411).
  return 0;
}

async function loadStudyCompletionMetrics(
  userId: string,
  examSlug: StudyCompletionExamSlug,
  rules: StudyCompletionRules
): Promise<StudyCompletionMetrics> {
  const fieldId = EXAM_CATALOG[examSlug].fieldId;
  const minDurationMs = rules.minAttemptDurationMs;
  const fullLengthQuestionCount = EXAM_CATALOG[examSlug].simulatedQuestionCount;
  const v2 = isCompletionRulesV2(rules);
  const thresholds = v2 ? rulesForExamV2(examSlug, rules) : null;

  const quickBiteSlugs = v2 ? quickBiteSlugsForBoard(examSlug) : [];
  const guide = v2 ? await getPublishedGuide(examSlug) : null;

  const [
    liveBankCount,
    coverageRows,
    fastRows,
    completedExams,
    readinessChecksCompleted,
    quickBitesCompleted,
    studyGuideChaptersTotal,
    studyGuideChaptersCompleted,
  ] = await Promise.all([
    countServedBankQuestions(fieldId),
    prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(DISTINCT "bankItemId")::bigint AS count
      FROM "QuestionAttempt"
      WHERE "userId" = ${userId}
        AND "fieldId" = ${fieldId}
        AND "bankItemId" IS NOT NULL
        AND (
          ("durationMs" IS NOT NULL AND "durationMs" >= ${minDurationMs})
          OR EXISTS (
            SELECT 1 FROM "exam_sessions" es
            WHERE es.id = "QuestionAttempt"."sessionId"
              AND es."userId" = "QuestionAttempt"."userId"
              AND es.status = 'completed'
          )
        )
    `,
    prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*)::bigint AS count
      FROM "QuestionAttempt"
      WHERE "userId" = ${userId}
        AND "fieldId" = ${fieldId}
        AND ("durationMs" IS NULL OR "durationMs" < ${minDurationMs})
    `,
    prisma.examSession.findMany({
      where: { userId, examType: examSlug, status: "completed" },
      select: { questionCount: true, analysis: true },
    }),
    prisma.readinessCheck.count({
      where: {
        userId,
        examSlug,
        status: "completed"
}
}),
    v2 && quickBiteSlugs.length > 0
      ? prisma.quickBiteProgress.count({
          where: {
            userId,
            slug: { in: quickBiteSlugs },
            OR: [
              { completedAt: { not: null } },
              { watchPct: { gte: thresholds!.quickBiteWatchPctComplete } },
            ]
}
})
      : Promise.resolve(0),
    v2 && guide
      ? prisma.sgChapter.count({ where: { guideId: guide.id } })
      : Promise.resolve(0),
    v2 && guide
      ? prisma.sgChapterProgress.count({
          where: {
            userId,
            scrollPct: { gte: thresholds!.chapterScrollPctComplete },
            verifiedSeconds: { gte: thresholds!.chapterVerifiedSecondsComplete },
            chapter: { guideId: guide.id }
}
})
      : Promise.resolve(0),
  ]);

  const fullLengthExamsCompleted = completedExams.filter((row) =>
    qualifiesAsFullLengthExam(row, fullLengthQuestionCount)
  ).length;

  return {
    liveBankCount,
    distinctBankItemsAttempted: Number(coverageRows[0]?.count ?? 0),
    fastAttemptsExcluded: Number(fastRows[0]?.count ?? 0),
    fullLengthExamsCompleted,
    readinessChecksCompleted: readinessChecksFromPractice({
      examSlug,
      recordedChecks: readinessChecksCompleted,
      fullLengthExamsCompleted,
    }),
    quickBitesCompleted,
    quickBitesTotal: quickBiteSlugs.length,
    studyGuideChaptersCompleted,
    studyGuideChaptersTotal
};
}

export async function computeStudyCompletion(
  userId: string,
  examSlug: string,
  options?: { rules?: StudyCompletionRules }
): Promise<StudyCompletionResult> {
  const slug = assertStudyCompletionExamSlug(examSlug as ExamSlug);
  const rules = options?.rules ?? ACTIVE_COMPLETION_RULES;
  const metrics = await loadStudyCompletionMetrics(userId, slug, rules);
  const readinessEstimate = isCompletionRulesV2(rules)
    ? await computeReadinessEstimate(userId, slug, rules)
    : {
        status: "insufficient_data" as const,
        message: "Answer more questions to see your estimate."
};
  return buildStudyCompletionResult(slug, metrics, rules, readinessEstimate);
}

export type AdminStudyCompletionBoardRow = StudyCompletionResult;

export async function computeAdminStudyCompletionBreakdown(
  userId: string,
  options?: { rules?: StudyCompletionRules }
): Promise<AdminStudyCompletionBoardRow[]> {
  const rules = options?.rules ?? ACTIVE_COMPLETION_RULES;
  return Promise.all(
    STUDY_COMPLETION_EXAM_SLUGS.map(async (examSlug) => {
      const metrics = await loadStudyCompletionMetrics(userId, examSlug, rules);
      const readinessEstimate = isCompletionRulesV2(rules)
        ? await computeReadinessEstimate(userId, examSlug, rules)
        : {
            status: "insufficient_data" as const,
            message: "Answer more questions to see your estimate."
};
      return buildStudyCompletionResult(examSlug, metrics, rules, readinessEstimate);
    })
  );
}

export function studyCompletionSupportedForExam(examSlug: ExamSlug): boolean {
  return isStudyCompletionExamSlug(examSlug);
}
