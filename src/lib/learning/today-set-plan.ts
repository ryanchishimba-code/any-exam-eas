/**
 * Loads the ids behind today's set.
 *
 * Review incorrect uses the shared open-remediation queue. Spaced review uses
 * QuestionMastery rows that are already due. New items are unseen, servable
 * bank rows weighted by the board blueprint. Enough new rows are loaded to
 * fill the slots the review cap leaves open; compose backfills with more
 * review when that pool is short. Every exam goes through this function;
 * the field id decides the bank.
 */

import { questionBankHref } from "@/lib/edtech/practice-links-core";
import { bankRowMatchesPracticeField } from "@/lib/edtech/exam-item-scope";
import { getExamBlueprint } from "@/lib/engine/blueprints";
import { getExamTopicStudyLinks } from "@/lib/library/exam-topic-bridge";
import { loadServableReviewBankIds, loadStillIncorrectBankItemIds } from "@/lib/learning/review-incorrect";
import { reviewFieldIdsForQuery } from "@/lib/learning/review-queue-launch";
import {
  applyQuestionAllowance,
  composeTodaySet,
  computeDailyHabitStreak,
  mergeDailyHabitDay,
  questionAllowanceFromUsage,
  readDailyHabitDays,
  resolveTodaySetSize,
  todaySetRandom,
  todayUnseenNeeded,
  utcDateKey,
  type TodayNewCandidate,
  type TodaySetComposition,
  type TodaySetSizeInput,
} from "@/lib/learning/today-set";
import { recordDailyHabitDay } from "@/lib/learning/today-set-preference";
import { prisma } from "@/lib/prisma";
import { getSubjectsForFieldId } from "@/lib/subjects/registry";
import type { ExamSlug } from "@/types/edtech";
import type { UserAccess } from "@/lib/access-control";
import { getStudyUsageSnapshot, type StudyUsageSnapshot } from "@/lib/study/usage-limits";

const NEW_WINDOW = 500;

export type TodayTopicLink = {
  id: string;
  label: string;
  href: string;
};

export type TodaySetSelection = {
  examSlug: ExamSlug;
  fieldId: string;
  /** Study target for the ring and for tomorrow. Not cut by a usage cap. */
  target: number;
  tomorrowCount: number;
  /** How many items this sitting will start. */
  size: number;
  composition: TodaySetComposition;
  topics: Record<string, TodayTopicLink>;
};

export type TodaySetPreview = {
  examSlug: ExamSlug;
  fieldId: string;
  size: number;
  target: number;
  questionsDone: number;
  reviewCount: number;
  newCount: number;
  mixLine: string | null;
  empty: boolean;
  limitReached: boolean;
  /** Null when habit history could not be read. Zero is a real empty streak. */
  streakDays: number | null;
};

function subjectLabel(fieldId: string, subjectId: string): string | null {
  try {
    return getSubjectsForFieldId(fieldId).find((subject) => subject.id === subjectId)?.label ?? null;
  } catch {
    return null;
  }
}

function topicForSubject(
  examSlug: ExamSlug,
  fieldId: string,
  subjectId: string | null | undefined
): TodayTopicLink {
  const subject = subjectId?.trim() ?? "";
  const blueprint = getExamBlueprint(fieldId);
  const category = blueprint?.categories.find(
    (row) => row.id === subject || row.subjectIds?.includes(subject)
  );
  const label = category?.label ?? (subject ? subjectLabel(fieldId, subject) : null) ?? "This topic";
  const id = category?.id || subject || "general";
  if (!subject) {
    return { id, label, href: questionBankHref(examSlug, fieldId) };
  }
  const links = getExamTopicStudyLinks(examSlug, subject, { fieldId });
  return {
    id,
    label,
    href: links.deepDiveHref ?? links.practiceHref,
  };
}

function weightForRow(
  fieldId: string,
  row: { subjectId: string | null; topicCategory: string | null; blueprintDomain: string | null }
): number {
  const blueprint = getExamBlueprint(fieldId);
  if (!blueprint) return 1;
  const subject = row.subjectId?.trim() ?? "";
  const category = blueprint.categories.find(
    (item) =>
      (subject && (item.subjectIds?.includes(subject) || item.id === subject)) ||
      (row.blueprintDomain &&
        (item.id === row.blueprintDomain || item.label === row.blueprintDomain)) ||
      (row.topicCategory && (item.id === row.topicCategory || item.label === row.topicCategory))
  );
  if (!category || !(category.weight > 0)) return 0.001;
  return category.weight;
}

async function loadUnseenCandidates(params: {
  fieldId: string;
  fieldIds: string[];
  excluded: string[];
  needed: number;
  random: () => number;
}): Promise<TodayNewCandidate[]> {
  if (params.needed <= 0) return [];
  const excluded = new Set(params.excluded);
  const useNotIn = params.excluded.length > 0 && params.excluded.length <= 4000;
  const where = {
    active: true,
    qaPassed: true,
    fieldId: { in: params.fieldIds },
    ...(useNotIn ? { id: { notIn: params.excluded } } : {}),
  };
  const total = await prisma.questionBankItem.count({ where });
  if (total <= 0) return [];

  const loadWindow = async (skip: number) =>
    prisma.questionBankItem.findMany({
      where,
      select: {
        id: true,
        subjectId: true,
        topicCategory: true,
        blueprintDomain: true,
        fieldId: true,
        stepLevel: true,
      },
      orderBy: { id: "asc" },
      skip,
      take: NEW_WINDOW,
    });

  const firstSkip = total > NEW_WINDOW ? Math.floor(params.random() * (total - NEW_WINDOW + 1)) : 0;
  const rows = await loadWindow(firstSkip);
  const accept = (list: typeof rows) =>
    list.filter(
      (row) =>
        bankRowMatchesPracticeField(row, params.fieldId) &&
        !excluded.has(row.id)
    );
  let matched = accept(rows);
  if (matched.length < params.needed && firstSkip > 0) {
    matched = accept([...rows, ...(await loadWindow(0))]);
  }

  const seen = new Set<string>();
  const candidates: TodayNewCandidate[] = [];
  for (const row of matched) {
    if (seen.has(row.id)) continue;
    seen.add(row.id);
    candidates.push({
      id: row.id,
      weight: weightForRow(params.fieldId, row),
    });
  }
  return candidates;
}

export async function selectTodaySet(params: {
  userId: string;
  examSlug: ExamSlug;
  fieldId: string;
  size: number;
  goals?: TodaySetSizeInput | null;
  now?: Date;
}): Promise<TodaySetSelection> {
  const now = params.now ?? new Date();
  const target = resolveTodaySetSize(params.goals);
  const size = Math.max(0, Math.min(target, Math.round(params.size) || 0));
  const fieldIds = reviewFieldIdsForQuery(params.fieldId);
  const empty = composeTodaySet({
    size,
    reviewIncorrectIds: [],
    spacedReviewIds: [],
    newCandidates: [],
  });
  if (size <= 0 || fieldIds.length === 0) {
    return {
      examSlug: params.examSlug,
      fieldId: params.fieldId,
      target,
      tomorrowCount: target,
      size,
      composition: empty,
      topics: {},
    };
  }

  const [reviewIncorrectIds, dueMastery, seenRows] = await Promise.all([
    loadStillIncorrectBankItemIds({
      userId: params.userId,
      fieldId: params.fieldId,
      limit: 300,
    }),
    prisma.questionMastery.findMany({
      where: {
        userId: params.userId,
        fieldId: { in: fieldIds },
        nextDue: { lte: now },
      },
      select: { questionKey: true },
      orderBy: { nextDue: "asc" },
      take: 300,
    }),
    prisma.questionAttempt.findMany({
      where: {
        userId: params.userId,
        fieldId: { in: fieldIds },
        bankItemId: { not: null },
      },
      select: { bankItemId: true },
      distinct: ["bankItemId"],
    }),
  ]);

  const spacedKeys = dueMastery.map((row) => row.questionKey).filter(Boolean);
  const servableSpaced = await loadServableReviewBankIds(params.fieldId, spacedKeys);
  const spacedReviewIds = spacedKeys.filter((id) => servableSpaced.has(id));
  const seenIds = seenRows
    .map((row) => row.bankItemId)
    .filter((id): id is string => Boolean(id));
  const random = todaySetRandom([params.userId, params.fieldId, utcDateKey(now)]);
  const reviewAvailable = new Set(
    [...reviewIncorrectIds, ...spacedReviewIds].map((id) => id.trim()).filter(Boolean)
  ).size;
  const candidates = await loadUnseenCandidates({
    fieldId: params.fieldId,
    fieldIds,
    excluded: [...seenIds, ...reviewIncorrectIds, ...spacedReviewIds],
    needed: todayUnseenNeeded(size, reviewAvailable),
    random,
  });
  const composition = composeTodaySet({
    size,
    reviewIncorrectIds,
    spacedReviewIds,
    newCandidates: candidates,
    random,
  });

  const topics: Record<string, TodayTopicLink> = {};
  if (composition.ids.length > 0) {
    const rows = await prisma.questionBankItem.findMany({
      where: { id: { in: composition.ids } },
      select: { id: true, subjectId: true },
    });
    const byId = new Map(rows.map((row) => [row.id, row.subjectId]));
    const bySubject = new Map<string, TodayTopicLink>();
    for (const id of composition.ids) {
      const subject = byId.get(id) ?? "";
      let topic = bySubject.get(subject);
      if (!topic) {
        topic = topicForSubject(params.examSlug, params.fieldId, subject);
        bySubject.set(subject, topic);
      }
      topics[id] = topic;
    }
  }

  return {
    examSlug: params.examSlug,
    fieldId: params.fieldId,
    target,
    tomorrowCount: target,
    size: composition.ids.length,
    composition,
    topics,
  };
}

export async function loadTodaySetPreview(params: {
  userId: string;
  examSlug: ExamSlug;
  fieldId: string;
  questionsDone: number;
  usage?: StudyUsageSnapshot | null;
  access?: UserAccess | null;
  goals?: TodaySetSizeInput | null;
  now?: Date;
}): Promise<TodaySetPreview> {
  const now = params.now ?? new Date();
  const today = utcDateKey(now);
  let metadata: unknown = null;
  let habitReadable = true;
  try {
    const row = await prisma.userPreference.findUnique({
      where: { userId: params.userId },
      select: { metadata: true },
    });
    metadata = row?.metadata ?? null;
  } catch {
    habitReadable = false;
  }
  const usage =
    params.usage ??
    (params.access ? await getStudyUsageSnapshot(params.access, { includeMockCounters: false }) : null);
  const target = resolveTodaySetSize(params.goals);
  const allowance = questionAllowanceFromUsage(usage);
  const size = applyQuestionAllowance(target, allowance);
  const questionsDone = Math.max(0, Math.round(params.questionsDone) || 0);
  const targetMet = target > 0 && questionsDone >= target;

  let streakDays: number | null = habitReadable ? 0 : null;
  if (habitReadable) {
    const habitMetadata = targetMet
      ? mergeDailyHabitDay(metadata, {
          examSlug: params.examSlug,
          date: today,
          targetMet: true,
        })
      : metadata;
    streakDays = computeDailyHabitStreak({
      days: readDailyHabitDays(habitMetadata, params.examSlug),
      today,
    });
    const stored = readDailyHabitDays(metadata, params.examSlug).some(
      (day) => day.date === today && day.targetMet === true
    );
    if (targetMet && !stored) {
      await recordDailyHabitDay(params.userId, {
        examSlug: params.examSlug,
        date: today,
        targetMet: true,
      });
    }
  }

  if (size <= 0) {
    return {
      examSlug: params.examSlug,
      fieldId: params.fieldId,
      size: 0,
      target,
      questionsDone,
      reviewCount: 0,
      newCount: 0,
      mixLine: null,
      empty: true,
      limitReached: allowance === 0,
      streakDays,
    };
  }

  const selection = await selectTodaySet({
    userId: params.userId,
    examSlug: params.examSlug,
    fieldId: params.fieldId,
    size,
    goals: params.goals,
    now,
  });

  return {
    examSlug: params.examSlug,
    fieldId: params.fieldId,
    size: selection.composition.ids.length,
    target,
    questionsDone,
    reviewCount: selection.composition.reviewCount,
    newCount: selection.composition.newCount,
    mixLine: selection.composition.mixLine,
    empty: selection.composition.ids.length === 0,
    limitReached: false,
    streakDays,
  };
}
