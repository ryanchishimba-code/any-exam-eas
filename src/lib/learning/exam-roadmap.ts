/**
 * Exam Roadmap — blueprint-aligned readiness per official test-plan category.
 * Performance is derived from practice attempts mapped to blueprint subjectIds.
 */

import { EXAM_CATALOG } from "@/lib/edtech/exams";
import type { ExamSlug } from "@/types/edtech";
import {
  deepDiveTopicHref,
  practiceTopicHref,
  questionBankHref,
} from "@/lib/edtech/practice-links";
import {
  getExamBlueprint,
  type BlueprintCategory,
  type ExamBlueprint,
} from "@/lib/engine/blueprints";
import { getExamTopicStudyLinks } from "@/lib/library/exam-topic-bridge";
import { prisma } from "@/lib/prisma";

export type RoadmapReadinessKey = "strong" | "needs_review" | "needs_more_work";

export type RoadmapReadinessLabel =
  | "Strong"
  | "Needs Review"
  | "Needs More Work";

export type RoadmapTopicRow = {
  categoryId: string;
  label: string;
  /** Official blueprint share (0–100). */
  blueprintWeightPct: number;
  readinessScore: number;
  readinessKey: RoadmapReadinessKey;
  readinessLabel: RoadmapReadinessLabel;
  attempts: number;
  correct: number;
  accuracy: number | null;
  highYieldTopics: string[];
  practiceHref: string;
  deepDiveHref?: string;
};

export type ExamRoadmapData = {
  examSlug: ExamSlug;
  examName: string;
  fieldId: string;
  blueprintSource: string;
  overallReadiness: number;
  passFocusMessage: string;
  topics: RoadmapTopicRow[];
  priorityTopics: RoadmapTopicRow[];
  totalAttempts: number;
};

type SubjectStats = { attempts: number; correct: number };

const MIN_ATTEMPTS_FOR_STRONG = 5;

/** Bayesian-smoothed readiness score (0–100) for a blueprint category. */
export function computeCategoryReadinessScore(
  stats: SubjectStats,
  masteryScores: number[]
): number {
  const PRIOR_CORRECT = 3;
  const PRIOR_TOTAL = 6;
  const smoothedAccuracy =
    (stats.correct + PRIOR_CORRECT) / (stats.attempts + PRIOR_TOTAL);

  let score = smoothedAccuracy * 100;

  if (masteryScores.length > 0) {
    const masteryAvg =
      masteryScores.reduce((s, v) => s + v, 0) / masteryScores.length;
    score = score * 0.65 + masteryAvg * 0.35;
  }

  if (stats.attempts < MIN_ATTEMPTS_FOR_STRONG) {
    score = Math.min(score, 74);
  }

  return Math.round(Math.max(0, Math.min(100, score)));
}

export function classifyReadiness(
  score: number,
  attempts: number
): { key: RoadmapReadinessKey; label: RoadmapReadinessLabel } {
  if (attempts === 0) {
    return { key: "needs_more_work", label: "Needs More Work" };
  }
  if (score >= 80 && attempts >= MIN_ATTEMPTS_FOR_STRONG) {
    return { key: "strong", label: "Strong" };
  }
  if (score >= 65) {
    return { key: "needs_review", label: "Needs Review" };
  }
  return { key: "needs_more_work", label: "Needs More Work" };
}

export function aggregateAttemptsBySubject(
  attempts: { subjectId: string | null; correct: boolean }[]
): Map<string, SubjectStats> {
  const map = new Map<string, SubjectStats>();
  for (const row of attempts) {
    if (!row.subjectId) continue;
    const entry = map.get(row.subjectId) ?? { attempts: 0, correct: 0 };
    entry.attempts += 1;
    if (row.correct) entry.correct += 1;
    map.set(row.subjectId, entry);
  }
  return map;
}

function sumStatsForSubjects(
  subjectIds: string[] | undefined,
  attemptMap: Map<string, SubjectStats>
): SubjectStats {
  const ids = subjectIds ?? [];
  return ids.reduce(
    (acc, id) => {
      const row = attemptMap.get(id);
      if (!row) return acc;
      return {
        attempts: acc.attempts + row.attempts,
        correct: acc.correct + row.correct,
      };
    },
    { attempts: 0, correct: 0 }
  );
}

function masteryForSubjects(
  subjectIds: string[] | undefined,
  masteryMap: Map<string, number>
): number[] {
  const scores: number[] = [];
  for (const id of subjectIds ?? []) {
    const key = `subject:${id}`;
    const score = masteryMap.get(key);
    if (score != null) scores.push(score);
  }
  return scores;
}

function buildTopicRow(
  category: BlueprintCategory,
  stats: SubjectStats,
  masteryScores: number[],
  examSlug: ExamSlug
): RoadmapTopicRow {
  const readinessScore = computeCategoryReadinessScore(stats, masteryScores);
  const { key, label } = classifyReadiness(readinessScore, stats.attempts);
  const primarySubject = category.subjectIds?.[0] ?? category.id;
  const topicLinks = getExamTopicStudyLinks(examSlug, primarySubject);

  return {
    categoryId: category.id,
    label: category.label,
    blueprintWeightPct: Math.round(category.weight * 100),
    readinessScore,
    readinessKey: key,
    readinessLabel: label,
    attempts: stats.attempts,
    correct: stats.correct,
    accuracy:
      stats.attempts > 0
        ? Math.round((stats.correct / stats.attempts) * 100)
        : null,
    highYieldTopics: category.highYieldTopics ?? [],
    practiceHref: practiceTopicHref(examSlug, primarySubject, 15),
    deepDiveHref: topicLinks.deepDiveHref,
  };
}

export function buildRoadmapTopics(
  blueprint: ExamBlueprint,
  examSlug: ExamSlug,
  attemptMap: Map<string, SubjectStats>,
  masteryMap: Map<string, number>
): RoadmapTopicRow[] {
  return blueprint.categories.map((category) => {
    const stats = sumStatsForSubjects(category.subjectIds, attemptMap);
    const masteryScores = masteryForSubjects(category.subjectIds, masteryMap);
    return buildTopicRow(category, stats, masteryScores, examSlug);
  });
}

export function computeOverallRoadmapReadiness(topics: RoadmapTopicRow[]): number {
  const totalWeight = topics.reduce((s, t) => s + t.blueprintWeightPct, 0) || 1;
  const weighted = topics.reduce(
    (s, t) => s + t.readinessScore * t.blueprintWeightPct,
    0
  );
  return Math.round(weighted / totalWeight);
}

export function selectPriorityTopics(topics: RoadmapTopicRow[], limit = 5): RoadmapTopicRow[] {
  return [...topics]
    .filter((t) => t.readinessKey !== "strong")
    .sort((a, b) => {
      const urgencyA = (100 - a.readinessScore) * a.blueprintWeightPct;
      const urgencyB = (100 - b.readinessScore) * b.blueprintWeightPct;
      return urgencyB - urgencyA;
    })
    .slice(0, limit);
}

function buildPassFocusMessage(
  examName: string,
  overall: number,
  priorities: RoadmapTopicRow[]
): string {
  if (priorities.length === 0) {
    return `Your ${examName} roadmap looks strong across blueprint areas — keep mixing timed practice to stay exam-ready.`;
  }
  const top = priorities.slice(0, 2).map((t) => t.label);
  if (overall < 65) {
    return `To pass ${examName}, prioritize ${top.join(" and ")} — these blueprint areas need the most work right now.`;
  }
  if (overall < 80) {
    return `You're building toward ${examName} readiness. Focus next on ${top.join(" and ")} before your exam date.`;
  }
  return `Nearly exam-ready on ${examName}. Sharpen ${top[0]} to close remaining gaps.`;
}

export function getBlueprintForExamSlug(
  examSlug: ExamSlug,
  usmleFieldId?: string
): ExamBlueprint | undefined {
  if (examSlug === "usmle" && usmleFieldId) {
    return getExamBlueprint(usmleFieldId);
  }
  return getExamBlueprint(EXAM_CATALOG[examSlug].fieldId);
}

export async function getExamRoadmapData(
  userId: string,
  examSlug: ExamSlug,
  options?: { usmleFieldId?: string }
): Promise<ExamRoadmapData | null> {
  const exam = EXAM_CATALOG[examSlug];
  const fieldId =
    examSlug === "usmle" && options?.usmleFieldId
      ? options.usmleFieldId
      : exam.fieldId;
  const blueprint = getExamBlueprint(fieldId);
  if (!blueprint) return null;

  const [attempts, masteries] = await Promise.all([
    prisma.questionAttempt.findMany({
      where: { userId, fieldId },
      select: { subjectId: true, correct: true },
    }),
    prisma.conceptMastery.findMany({
      where: { userId, fieldId },
      select: { conceptKey: true, masteryScore: true },
    }),
  ]);

  const attemptMap = aggregateAttemptsBySubject(attempts);
  const masteryMap = new Map(
    masteries.map((m) => [m.conceptKey, m.masteryScore] as const)
  );

  const topics = buildRoadmapTopics(blueprint, examSlug, attemptMap, masteryMap);
  const overallReadiness = computeOverallRoadmapReadiness(topics);
  const priorityTopics = selectPriorityTopics(topics);

  return {
    examSlug,
    examName: blueprint.examName,
    fieldId,
    blueprintSource: blueprint.sourceNote,
    overallReadiness,
    passFocusMessage: buildPassFocusMessage(
      blueprint.examName,
      overallReadiness,
      priorityTopics
    ),
    topics,
    priorityTopics,
    totalAttempts: attempts.length,
  };
}

export function roadmapHref(examSlug?: ExamSlug): string {
  if (!examSlug) return "/dashboard/roadmap";
  return `/dashboard/roadmap?exam=${encodeURIComponent(examSlug)}`;
}

export function roadmapCategoryBankHref(
  examSlug: ExamSlug,
  categoryId: string
): string {
  const blueprint = getBlueprintForExamSlug(examSlug);
  const category = blueprint?.categories.find((c) => c.id === categoryId);
  const subjectId = category?.subjectIds?.[0];
  if (subjectId) {
    return practiceTopicHref(examSlug, subjectId, 15);
  }
  return questionBankHref(examSlug);
}

export function roadmapCategoryDeepDiveHref(
  examSlug: ExamSlug,
  categoryId: string
): string | undefined {
  const blueprint = getBlueprintForExamSlug(examSlug);
  const category = blueprint?.categories.find((c) => c.id === categoryId);
  const subjectId = category?.subjectIds?.[0];
  if (!subjectId) return undefined;
  const links = getExamTopicStudyLinks(examSlug, subjectId);
  return links.deepDiveHref ?? deepDiveTopicHref(examSlug, subjectId);
}
