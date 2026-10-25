import { EXAM_CATALOG } from "@/lib/edtech/exams";
import { getExamBlueprint } from "@/lib/engine/blueprints";
import { prisma } from "@/lib/prisma";
import {
  COMPLETION_RULES_V2,
  rulesForExamV2,
  type CompletionRulesV2,
} from "./completion-rules-v2";
import type { StudyCompletionExamSlug } from "./completion-rules-v1";

export type ReadinessEstimateBand = "Building" | "Getting close" | "On track";

export type ReadinessEstimateWeakSpot = {
  areaId: string;
  label: string;
  accuracyPercent: number;
};

export type ReadinessEstimateResult =
  | {
      status: "insufficient_data";
      message: string;
    }
  | {
      status: "ready";
      score: number;
      band: ReadinessEstimateBand;
      weakSpots: ReadinessEstimateWeakSpot[];
      disclaimer: string;
    };

const DISCLAIMER =
  "Based on your practice performance. Not a prediction of your exam result.";

export function bandForReadinessScore(score: number): ReadinessEstimateBand {
  if (score >= 75) return "On track";
  if (score >= 50) return "Getting close";
  return "Building";
}

function levelToScore(level: string | null | undefined): number | null {
  switch (level) {
    case "on_track":
      return 88;
    case "getting_close":
      return 62;
    case "not_yet":
      return 38;
    case "insufficient":
      return 50;
    default:
      return null;
  }
}

function resolveAreaId(
  subjectId: string | null,
  clientNeeds: string | null,
  blueprintDomain: string | null,
  blueprint: ReturnType<typeof getExamBlueprint>
): string {
  if (!blueprint) return subjectId ?? "general";
  if (clientNeeds && blueprint.categories.some((c) => c.id === clientNeeds)) {
    return clientNeeds;
  }
  if (blueprintDomain && blueprint.categories.some((c) => c.id === blueprintDomain)) {
    return blueprintDomain;
  }
  if (subjectId) {
    const bySubject = blueprint.categories.find((c) => c.subjectIds?.includes(subjectId));
    if (bySubject) return bySubject.id;
  }
  return subjectId ?? blueprint.categories[0]?.id ?? "general";
}

export function buildReadinessEstimateFromSignals(input: {
  uniqueQuestionCount: number;
  minUniqueQuestions: number;
  practiceAccuracyPercent: number | null;
  fullLengthScorePercent: number | null;
  readinessCheckScore: number | null;
  areaAccuracies: { areaId: string; label: string; answered: number; correct: number }[];
  blueprint: ReturnType<typeof getExamBlueprint>;
}): ReadinessEstimateResult {
  if (input.uniqueQuestionCount < input.minUniqueQuestions) {
    return {
      status: "insufficient_data",
      message: "Answer more questions to see your estimate.",
    };
  }

  let weightedPractice = input.practiceAccuracyPercent;
  if (input.blueprint && input.areaAccuracies.length > 0) {
    const weights = new Map(
      input.blueprint.categories.map((c) => [c.id, c.weight] as const)
    );
    let sum = 0;
    let weightTotal = 0;
    for (const row of input.areaAccuracies) {
      if (row.answered <= 0) continue;
      const w = weights.get(row.areaId) ?? 0.05;
      const acc = (row.correct / row.answered) * 100;
      sum += acc * w;
      weightTotal += w;
    }
    if (weightTotal > 0) {
      weightedPractice = sum / weightTotal;
    }
  }

  const components: { value: number; weight: number }[] = [];
  if (weightedPractice != null) components.push({ value: weightedPractice, weight: 0.55 });
  if (input.fullLengthScorePercent != null) {
    components.push({ value: input.fullLengthScorePercent, weight: 0.3 });
  }
  if (input.readinessCheckScore != null) {
    components.push({ value: input.readinessCheckScore, weight: 0.15 });
  }

  if (components.length === 0) {
    return {
      status: "insufficient_data",
      message: "Answer more questions to see your estimate.",
    };
  }

  const weightSum = components.reduce((a, c) => a + c.weight, 0);
  const score = Math.round(
    components.reduce((a, c) => a + c.value * (c.weight / weightSum), 0)
  );

  const weakSpots: ReadinessEstimateWeakSpot[] = input.areaAccuracies
    .filter((row) => row.answered >= 3)
    .map((row) => ({
      areaId: row.areaId,
      label: row.label,
      accuracyPercent: Math.round((row.correct / row.answered) * 100),
    }))
    .sort((a, b) => a.accuracyPercent - b.accuracyPercent)
    .slice(0, 3);

  return {
    status: "ready",
    score: Math.min(100, Math.max(0, score)),
    band: bandForReadinessScore(score),
    weakSpots,
    disclaimer: DISCLAIMER,
  };
}

export async function computeReadinessEstimate(
  userId: string,
  examSlug: StudyCompletionExamSlug,
  rules: CompletionRulesV2 = COMPLETION_RULES_V2
): Promise<ReadinessEstimateResult> {
  const thresholds = rulesForExamV2(examSlug, rules);
  const fieldId = EXAM_CATALOG[examSlug].fieldId;
  const blueprint = getExamBlueprint(fieldId);
  const minDurationMs = rules.minAttemptDurationMs;
  const fullLengthQuestionCount = EXAM_CATALOG[examSlug].simulatedQuestionCount;
  const attemptLimit = thresholds.readinessEstimateRecentAttempts;

  const [
    uniqueRows,
    recentAttempts,
    latestExam,
    latestCheck,
  ] = await Promise.all([
    prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(DISTINCT "bankItemId")::bigint AS count
      FROM "QuestionAttempt"
      WHERE "userId" = ${userId}
        AND "fieldId" = ${fieldId}
        AND "bankItemId" IS NOT NULL
        AND "durationMs" IS NOT NULL
        AND "durationMs" >= ${minDurationMs}
    `,
    prisma.$queryRaw<
      {
        correct: boolean;
        subjectId: string | null;
        clientNeeds: string | null;
        blueprintDomain: string | null;
      }[]
    >`
      SELECT qa.correct, qbi."subjectId", qbi."clientNeeds", qbi."blueprintDomain"
      FROM (
        SELECT "correct", "bankItemId"
        FROM "QuestionAttempt"
        WHERE "userId" = ${userId}
          AND "fieldId" = ${fieldId}
          AND "bankItemId" IS NOT NULL
          AND "durationMs" IS NOT NULL
          AND "durationMs" >= ${minDurationMs}
        ORDER BY "createdAt" DESC
        LIMIT ${attemptLimit}
      ) qa
      LEFT JOIN "QuestionBankItem" qbi ON qbi.id = qa."bankItemId"
    `,
    prisma.examSession.findFirst({
      where: {
        userId,
        examType: examSlug,
        status: "completed",
        questionCount: fullLengthQuestionCount,
        score: { not: null },
      },
      orderBy: { completedAt: "desc" },
      select: { score: true },
    }),
    prisma.readinessCheck.findFirst({
      where: { userId, examSlug, status: "completed" },
      orderBy: { completedAt: "desc" },
      select: { overallLevel: true },
    }),
  ]);

  const uniqueQuestionCount = Number(uniqueRows[0]?.count ?? 0);
  const answered = recentAttempts.length;
  const correct = recentAttempts.filter((row) => row.correct).length;
  const practiceAccuracyPercent = answered > 0 ? (correct / answered) * 100 : null;

  const areaMap = new Map<
    string,
    { areaId: string; label: string; answered: number; correct: number }
  >();
  for (const row of recentAttempts) {
    const areaId = resolveAreaId(
      row.subjectId,
      row.clientNeeds,
      row.blueprintDomain,
      blueprint
    );
    const label =
      blueprint?.categories.find((c) => c.id === areaId)?.label ?? areaId;
    const existing = areaMap.get(areaId) ?? { areaId, label, answered: 0, correct: 0 };
    existing.answered += 1;
    if (row.correct) existing.correct += 1;
    areaMap.set(areaId, existing);
  }

  const fullLengthScorePercent =
    latestExam?.score != null ? Math.round(latestExam.score) : null;
  const readinessCheckScore = levelToScore(latestCheck?.overallLevel);

  return buildReadinessEstimateFromSignals({
    uniqueQuestionCount,
    minUniqueQuestions: thresholds.readinessEstimateMinUniqueQuestions,
    practiceAccuracyPercent,
    fullLengthScorePercent,
    readinessCheckScore,
    areaAccuracies: [...areaMap.values()],
    blueprint,
  });
}
