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
import { loadBankItemsByIds } from "@/lib/full-exam/load-bank-items-by-ids";
import type { BankItem } from "@/lib/question-bank";
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
  recountTodayMix,
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
import { cacheDeleteAsync, cacheDeleteMatching, cacheGetOrSetDeduped, cacheKey, isUpstashRedisEnabled } from "@/lib/cache";

/** Widest bank page. A matching board usually finishes in a much shorter read. */
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

/** Enough rows to fill the new slots, without reading a 500-row page up front. */
function unseenPageSize(needed: number): number {
  const slots = Math.max(1, Math.round(needed) || 1);
  return Math.min(NEW_WINDOW, Math.max(40, slots * 5));
}

function msUntilNextUtcDay(now: Date): number {
  const next = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1);
  return Math.max(60_000, next - now.getTime());
}

export function todayServedCacheKey(userId: string, fieldId: string, day: string): string {
  return cacheKey(["today-set-served-v1", userId, fieldId, day]);
}

/** Drop today's served mix for this student and board. Call after an answer is saved. */
export async function invalidateTodayServedCache(
  userId: string,
  fieldId?: string | null,
  now: Date = new Date()
): Promise<void> {
  const day = utcDateKey(now);
  const fields = fieldId ? reviewFieldIdsForQuery(fieldId) : [];
  const targets = fields.length > 0 ? fields : fieldId ? [fieldId] : [];
  await Promise.all(targets.map((id) => cacheDeleteAsync(todayServedCacheKey(userId, id, day))));
  cacheDeleteMatching(`${cacheKey(["today-set-served-v1", userId])}:`);
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

  const loadWindow = async (skip: number, take: number) =>
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
      take,
    });

  const accept = (list: Awaited<ReturnType<typeof loadWindow>>) =>
    list.filter(
      (row) =>
        bankRowMatchesPracticeField(row, params.fieldId) &&
        !excluded.has(row.id)
    );

  // A single id page can miss this board. Stopping there backfills the new
  // slots with review, and the line becomes "25 to review". Keep reading until
  // those slots are filled or the pool has been covered once. The first page
  // is only as wide as the new slots; a miss widens to the full window.
  let pageSize = Math.min(unseenPageSize(params.needed), total);
  let skip = total > pageSize ? Math.floor(params.random() * (total - pageSize + 1)) : 0;
  let scanned = 0;
  let loops = 0;
  const loopCap = Math.ceil(total / Math.max(1, pageSize)) + 2;
  const seen = new Set<string>();
  const candidates: TodayNewCandidate[] = [];
  while (candidates.length < params.needed && scanned < total && loops < loopCap) {
    loops += 1;
    const rows = await loadWindow(skip, pageSize);
    if (rows.length === 0) {
      if (skip === 0) break;
      skip = 0;
      continue;
    }
    const accepted = accept(rows);
    if (accepted.length === 0) pageSize = Math.min(NEW_WINDOW, total);
    for (const row of accepted) {
      if (seen.has(row.id)) continue;
      seen.add(row.id);
      candidates.push({
        id: row.id,
        weight: weightForRow(params.fieldId, row),
      });
    }
    scanned += rows.length;
    const next = skip + rows.length;
    skip = next >= total ? 0 : next;
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

type CachedServed = {
  requestedSize: number;
  selection: TodaySetSelection;
  mix: TodaySetComposition;
};

/**
 * Same composition for this student, board, and UTC day. An answer drops the
 * key. The cached mix was already recounted from a bank load.
 */
async function loadServedCore(params: {
  userId: string;
  examSlug: ExamSlug;
  fieldId: string;
  size: number;
  goals?: TodaySetSizeInput | null;
  now?: Date;
}): Promise<CachedServed> {
  const now = params.now ?? new Date();
  const key = todayServedCacheKey(params.userId, params.fieldId, utcDateKey(now));
  const ttl = msUntilNextUtcDay(now);
  const options = { skipFreshL1: isUpstashRedisEnabled() };
  const read = () =>
    cacheGetOrSetDeduped<CachedServed>(
      key,
      ttl,
      async () => {
        const selection = await selectTodaySet(params);
        const loaded = await loadBankItemsByIds(params.fieldId, selection.composition.ids);
        const loadedIds = new Set(
          loaded.map((item) => item.id).filter((id): id is string => Boolean(id))
        );
        return {
          requestedSize: params.size,
          selection,
          mix: recountTodayMix(selection.composition, loadedIds),
        };
      },
      options
    );
  const cached = await read();
  if (cached.requestedSize === params.size) return cached;
  await cacheDeleteAsync(key);
  return read();
}

/**
 * The sitting `POST /api/study/daily-set` starts, and the mix line the
 * dashboard shows. Same ids, then the same bank load and recount. A line
 * from the composition alone can count a question the player will not get.
 */
export async function loadServedTodaySet(params: {
  userId: string;
  examSlug: ExamSlug;
  fieldId: string;
  size: number;
  goals?: TodaySetSizeInput | null;
  now?: Date;
}): Promise<{
  selection: TodaySetSelection;
  mix: TodaySetComposition;
  items: BankItem[];
}> {
  const core = await loadServedCore(params);
  const loaded = await loadBankItemsByIds(params.fieldId, core.selection.composition.ids);
  const loadedIds = new Set(loaded.map((item) => item.id).filter((id): id is string => Boolean(id)));
  const mix = recountTodayMix(core.selection.composition, loadedIds);
  const byId = new Map(loaded.map((item) => [item.id, item]));
  const items = mix.ids
    .map((id) => byId.get(id))
    .filter((item): item is BankItem => Boolean(item));
  return { selection: core.selection, mix, items };
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

  const served = await loadServedCore({
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
    size: served.mix.ids.length,
    target,
    questionsDone,
    reviewCount: served.mix.reviewCount,
    newCount: served.mix.newCount,
    mixLine: served.mix.mixLine,
    empty: served.mix.ids.length === 0,
    limitReached: false,
    streakDays,
  };
}
