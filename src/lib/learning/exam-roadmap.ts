/**
 * Exam Roadmap — blueprint-aligned readiness per official test-plan category.
 * Performance is derived from practice attempts mapped to blueprint subjectIds.
 */

import { CACHE_STALE, CACHE_TTL, cacheGetOrSet, cacheKey } from "@/lib/cache";
import { EXAM_CATALOG } from "@/lib/edtech/exams";
import type { ExamSlug } from "@/types/edtech";
import {
  deepDiveTopicHref,
  questionBankHref,
  drugs300ClassHref,
} from "@/lib/edtech/practice-links-core";
import {
  getExamBlueprint,
  type BlueprintCategory,
  type ExamBlueprint,
} from "@/lib/engine/blueprints";
import { getExamTopicStudyLinks, topicNameToSlug } from "@/lib/library/exam-topic-bridge";
import {
  topicNodeFromBlueprintCategory,
  topicNodePracticeHref,
} from "@/lib/topics/topic-node";
import { getDrugClassMeta } from "@/lib/drugs300/drug-classes";
import {
  resolveNclexTopicSlugForBlueprint,
  resolveNclexTopicSlugForSubject,
} from "@/lib/exam-prep/nclex/topic-registry";
import {
  resolveUsmleTopicSlugForBlueprint,
  resolveUsmleTopicSlugForCategory,
  resolveUsmleTopicSlugForSubject,
} from "@/lib/exam-prep/usmle/topic-registry";
import { getHighYieldTopic } from "@/lib/edtech/seeds";
import {
  getNclexStudyPreset,
  nclexPresetPracticeHref,
} from "@/lib/exam-prep/nclex/study-presets";
import {
  getUsmleStudyPreset,
  usmlePresetPracticeHref,
  type UsmleStudyPresetId,
} from "@/lib/exam-prep/usmle/study-presets";
import { prisma } from "@/lib/prisma";
import {
  computeCoveragePct,
  countServeBankBySubject,
  countUserSeenBySubject,
  getUserExamHistory,
  sumCategoryPushCoverage,
} from "@/lib/learning/exam-progress";

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
  /** Unique question-bank items pushed in this category. */
  pushesCompleted: number;
  /** Active serve items available in this category. */
  pushesAvailable: number;
  /** Percentage of question-bank pushes completed (0–100). */
  pushCoveragePct: number;
  highYieldTopics: string[];
  practiceHref: string;
  deepDiveHref?: string;
  /** NCLEX study hub topic slugs for this blueprint category. */
  studyTopicSlugs?: string[];
  topicsHubHref?: string;
  drugClassHref?: string;
  drugClassLabel?: string;
  presetHref?: string;
  presetLabel?: string;
  /** Target readiness score for first-attempt pass focus. */
  passTargetScore?: number;
  /** Points below pass target (0 if at/above). */
  gapToPass?: number;
};

export type ExamRoadmapData = {
  examSlug: ExamSlug;
  examName: string;
  fieldId: string;
  blueprintSource: string;
  overallReadiness: number;
  /** Blueprint-weighted average of per-category bank coverage. */
  overallPushCoveragePct: number;
  pushesCompleted: number;
  pushesAvailable: number;
  passFocusMessage: string;
  topics: RoadmapTopicRow[];
  priorityTopics: RoadmapTopicRow[];
  totalAttempts: number;
  /** Launch affordances for shared Full Exam actions. */
  launch: {
    hasRetake: boolean;
    canContinue: boolean;
    weakFocusAreas: string[];
  };
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
  examSlug: ExamSlug,
  fieldId?: string,
  coverage?: { pushesCompleted: number; pushesAvailable: number; pushCoveragePct: number }
): RoadmapTopicRow {
  const readinessScore = computeCategoryReadinessScore(stats, masteryScores);
  const { key, label } = classifyReadiness(readinessScore, stats.attempts);
  const primarySubject = category.subjectIds?.[0] ?? category.id;
  const topicNode = topicNodeFromBlueprintCategory(examSlug, category, { fieldId });
  const topicLinks = getExamTopicStudyLinks(examSlug, primarySubject, { fieldId });
  const pushCoverage = coverage ?? {
    pushesCompleted: 0,
    pushesAvailable: 0,
    pushCoveragePct: 0,
  };

  let studyTopicSlugs = topicLinks.relatedTopicSlugs;
  let drugClassHref = topicLinks.drugClassLinks?.[0]?.href;
  let drugClassLabel = topicLinks.drugClassLinks?.[0]?.label;
  let presetHref = topicLinks.presetLinks?.[0]?.href;
  let presetLabel = topicLinks.presetLinks?.[0]?.label;
  let topicsHubHref = topicLinks.topicsHubHref;
  let deepDiveHref = topicLinks.deepDiveHref;

  if (examSlug === "nclex") {
    const fromSubject = resolveNclexTopicSlugForSubject(category.id);
    const fromBlueprint = category.highYieldTopics?.[0]
      ? resolveNclexTopicSlugForBlueprint(category.highYieldTopics[0])
      : undefined;
    const primarySlug = fromSubject ?? fromBlueprint;
    if (primarySlug) {
      const card = getHighYieldTopic("nclex", primarySlug);
      if (card) {
        studyTopicSlugs = [card.slug];
        topicsHubHref = `/dashboard/topics?exam=nclex&topic=${encodeURIComponent(card.slug)}`;
        if (card.reviewModule) {
          deepDiveHref = topicLinks.deepDiveHref ?? `/dashboard/topics?exam=nclex&topic=${encodeURIComponent(card.slug)}&mode=deep`;
        }
        if (card.relatedDrugClasses?.[0]) {
          const classMeta = getDrugClassMeta(card.relatedDrugClasses[0]);
          drugClassHref = drugs300ClassHref(card.relatedDrugClasses[0]);
          drugClassLabel = classMeta.shortLabel;
        }
        if (card.relatedPresetIds?.[0]) {
          const preset = getNclexStudyPreset(card.relatedPresetIds[0] as Parameters<typeof getNclexStudyPreset>[0]);
          if (preset) {
            presetHref = nclexPresetPracticeHref(examSlug, preset);
            presetLabel = preset.title;
          }
        }
      }
    }
  }

  if (examSlug === "usmle" && fieldId) {
    const fromCategory = resolveUsmleTopicSlugForCategory(category.id, fieldId);
    const fromSubject = resolveUsmleTopicSlugForSubject(primarySubject, fieldId);
    const fromBlueprint = category.highYieldTopics?.[0]
      ? resolveUsmleTopicSlugForBlueprint(topicNameToSlug(category.highYieldTopics[0]))
      : undefined;
    const primarySlug = fromCategory ?? fromSubject ?? fromBlueprint;
    if (primarySlug) {
      const card = getHighYieldTopic("usmle", primarySlug);
      if (card) {
        studyTopicSlugs = [card.slug];
        topicsHubHref = `/dashboard/topics?exam=usmle&topic=${encodeURIComponent(card.slug)}`;
        if (card.reviewModule) {
          deepDiveHref =
            topicLinks.deepDiveHref ??
            `/dashboard/topics?exam=usmle&topic=${encodeURIComponent(card.slug)}&mode=deep`;
        }
        if (card.relatedDrugClasses?.[0]) {
          const classMeta = getDrugClassMeta(card.relatedDrugClasses[0]);
          drugClassHref = drugs300ClassHref(card.relatedDrugClasses[0]);
          drugClassLabel = classMeta.shortLabel;
        }
        if (card.relatedPresetIds?.[0]) {
          const preset = getUsmleStudyPreset(card.relatedPresetIds[0] as UsmleStudyPresetId);
          if (preset) {
            presetHref = usmlePresetPracticeHref(examSlug, preset);
            presetLabel = preset.title;
          }
        }
      }
    }
  }

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
    pushesCompleted: pushCoverage.pushesCompleted,
    pushesAvailable: pushCoverage.pushesAvailable,
    pushCoveragePct: pushCoverage.pushCoveragePct,
    highYieldTopics: category.highYieldTopics ?? [],
    practiceHref: topicNodePracticeHref(topicNode, 15),
    deepDiveHref,
    studyTopicSlugs,
    topicsHubHref,
    drugClassHref,
    drugClassLabel,
    presetHref,
    presetLabel,
    passTargetScore: 75,
    gapToPass: Math.max(0, 75 - readinessScore),
  };
}

export function buildRoadmapTopics(
  blueprint: ExamBlueprint,
  examSlug: ExamSlug,
  attemptMap: Map<string, SubjectStats>,
  masteryMap: Map<string, number>,
  bySubject?: Parameters<typeof sumCategoryPushCoverage>[1]
): RoadmapTopicRow[] {
  return blueprint.categories.map((category) => {
    const stats = sumStatsForSubjects(category.subjectIds, attemptMap);
    const masteryScores = masteryForSubjects(category.subjectIds, masteryMap);
    const coverage = bySubject
      ? sumCategoryPushCoverage(category.subjectIds, bySubject)
      : { pushesCompleted: 0, pushesAvailable: 0, pushCoveragePct: 0 };
    return buildTopicRow(
      category,
      stats,
      masteryScores,
      examSlug,
      blueprint.fieldId,
      coverage
    );
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

export function computeOverallPushCoverage(topics: RoadmapTopicRow[]): number {
  const totalWeight = topics.reduce((s, t) => s + t.blueprintWeightPct, 0) || 1;
  const weighted = topics.reduce(
    (s, t) => s + t.pushCoveragePct * t.blueprintWeightPct,
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

async function loadExamRoadmapData(
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

  // One attempt scan for subject aggregates + push stats (avoid a second full table read).
  const [attempts, masteries, serveBySubject, seenBySubject, history] =
    await Promise.all([
      prisma.questionAttempt.findMany({
        where: { userId, fieldId },
        select: {
          subjectId: true,
          correct: true,
          bankItemId: true,
          questionKey: true,
        },
      }),
      prisma.conceptMastery.findMany({
        where: { userId, fieldId },
        select: { conceptKey: true, masteryScore: true },
      }),
      countServeBankBySubject(fieldId),
      countUserSeenBySubject(userId, fieldId),
      getUserExamHistory(userId, examSlug, { fieldId }),
    ]);

  const attemptMap = aggregateAttemptsBySubject(attempts);
  const masteryMap = new Map(
    masteries.map((m) => [m.conceptKey, m.masteryScore] as const)
  );

  let pushesAvailable = 0;
  for (const n of serveBySubject.values()) pushesAvailable += n;

  const bySubject: Record<
    string,
    { seen: number; available: number; coveragePct: number }
  > = {};
  for (const [subjectId, available] of serveBySubject) {
    const seen = seenBySubject.get(subjectId) ?? 0;
    bySubject[subjectId] = {
      seen,
      available,
      coveragePct: computeCoveragePct(seen, available),
    };
  }

  const uniqueKeys = new Set<string>();
  for (const row of attempts) {
    const key = row.bankItemId ?? row.questionKey;
    if (key) uniqueKeys.add(key);
  }
  const pushesCompleted = uniqueKeys.size;

  const topics = buildRoadmapTopics(
    blueprint,
    examSlug,
    attemptMap,
    masteryMap,
    bySubject
  );
  const overallReadiness = computeOverallRoadmapReadiness(topics);
  const overallPushCoveragePct = computeOverallPushCoverage(topics);
  const priorityTopics = selectPriorityTopics(topics);
  const weakFocusAreas = priorityTopics
    .flatMap((t) => {
      const cat = blueprint.categories.find((c) => c.id === t.categoryId);
      return cat?.subjectIds?.length ? cat.subjectIds : [t.categoryId];
    })
    .slice(0, 8);

  return {
    examSlug,
    examName: blueprint.examName,
    fieldId,
    blueprintSource: blueprint.sourceNote,
    overallReadiness,
    overallPushCoveragePct,
    pushesCompleted,
    pushesAvailable,
    passFocusMessage: buildPassFocusMessage(
      blueprint.examName,
      overallReadiness,
      priorityTopics
    ),
    topics,
    priorityTopics,
    totalAttempts: attempts.length,
    launch: {
      hasRetake: history.hasRetake,
      canContinue: history.canContinue,
      weakFocusAreas,
    },
  };
}

/** Cached per user/exam — soft nav dashboard ↔ roadmap should hit L1/Redis within TTL. */
export async function getExamRoadmapData(
  userId: string,
  examSlug: ExamSlug,
  options?: { usmleFieldId?: string }
): Promise<ExamRoadmapData | null> {
  const fieldKey =
    examSlug === "usmle" && options?.usmleFieldId
      ? options.usmleFieldId
      : examSlug;
  return cacheGetOrSet(
    cacheKey(["exam-roadmap", userId, fieldKey]),
    CACHE_TTL.learningDashboard,
    () => loadExamRoadmapData(userId, examSlug, options),
    { staleTtlMs: CACHE_STALE.learningDashboard }
  );
}

export { studyHubHref, roadmapHref } from "@/lib/learning/roadmap-links";

export function roadmapCategoryBankHref(
  examSlug: ExamSlug,
  categoryId: string
): string {
  const blueprint = getBlueprintForExamSlug(examSlug);
  const category = blueprint?.categories.find((c) => c.id === categoryId);
  if (category) {
    return topicNodePracticeHref(
      topicNodeFromBlueprintCategory(examSlug, category, {
        fieldId: blueprint.fieldId,
      }),
      15
    );
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
