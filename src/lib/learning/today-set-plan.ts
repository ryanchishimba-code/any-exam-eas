/**
 * Today's set is the shared daily pack: one sequence per practice field,
 * sliced by the America/Chicago date. Review misses is a separate sitting
 * and still uses open remediation plus due QuestionMastery rows, on the
 * student's calendar day.
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
  calendarDateKey,
  compositionFromStored,
  composeTodaySet,
  computeDailyHabitStreak,
  fitTodayComposition,
  hashStringToSeed,
  mergeDailyHabitDay,
  msUntilNextCalendarDay,
  priorTodaySetIds,
  questionAllowanceFromUsage,
  readDailyHabitDays,
  readStoredTodaySetForDate,
  recountTodayMix,
  resolveStudyTimeZone,
  resolveTodaySetSize,
  todaySetRandom,
  todayUnseenNeeded,
  type TodayNewCandidate,
  type TodaySetComposition,
  type TodaySetSizeInput,
} from "@/lib/learning/today-set";
import {
  persistTodaySetSnapshot,
  readTodaySetMetadata,
  recordDailyHabitDay,
} from "@/lib/learning/today-set-preference";
import { ineligibleServedIds } from "@/lib/exam-prep/student-eligibility";
import { DAILY_PACK_SIZE } from "@/lib/learning/daily-pack";
import { loadSharedDailyPack } from "@/lib/learning/daily-pack-serve";
import { prisma } from "@/lib/prisma";
import { getSubjectsForFieldId } from "@/lib/subjects/subject-catalog";
import type { ExamSlug } from "@/types/edtech";
import type { UserAccess } from "@/lib/access-control";
import { getStudyUsageSnapshot, type StudyUsageSnapshot } from "@/lib/study/usage-limits";
import { cacheDeleteMatching, cacheGetOrSetDeduped, cacheKey, isUpstashRedisEnabled } from "@/lib/cache";

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

export function todayServedCacheKey(
  userId: string,
  fieldId: string,
  day: string,
  size: number
): string {
  return cacheKey(["today-set-served-v2", userId, fieldId, day, size]);
}

/**
 * Drop this process's copy of today's mix. The account snapshot is the source
 * of truth, so another instance can keep serving the same ids until that
 * entry expires at local midnight.
 */
export async function invalidateTodayServedCache(
  userId: string,
  fieldId?: string | null,
  now?: Date
): Promise<void> {
  // Callers pass the board and instant. The wipe is per student: the day key
  // includes a timezone this process may not know, and the snapshot keeps the
  // ids stable after this cache drop.
  void fieldId;
  void now;
  cacheDeleteMatching(`${cacheKey(["today-set-served-v2", userId])}:`);
  cacheDeleteMatching(`${cacheKey(["today-set-served-v1", userId])}:`);
  cacheDeleteMatching(`${cacheKey(["today-set-review-v1", userId])}:`);
}

function topicKeyForRow(row: {
  subjectId: string | null;
  topicCategory: string | null;
  blueprintDomain: string | null;
}): string {
  return row.subjectId?.trim() || row.blueprintDomain?.trim() || row.topicCategory?.trim() || "general";
}

async function collectUnseenCandidates(params: {
  fieldId: string;
  fieldIds: string[];
  excluded: Set<string>;
  needed: number;
  random: () => number;
  previouslyShown?: ReadonlySet<string>;
}): Promise<TodayNewCandidate[]> {
  if (params.needed <= 0) return [];
  const excluded = params.excluded;
  const useNotIn = excluded.size > 0 && excluded.size <= 8000;
  const where = {
    active: true,
    qaPassed: true,
    fieldId: { in: params.fieldIds },
    ...(useNotIn ? { id: { notIn: [...excluded] } } : {}),
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

  const seen = new Set<string>();
  const candidates: TodayNewCandidate[] = [];
  const accept = (list: Awaited<ReturnType<typeof loadWindow>>) => {
    for (const row of list) {
      if (seen.has(row.id) || excluded.has(row.id)) continue;
      if (!bankRowMatchesPracticeField(row, params.fieldId)) continue;
      seen.add(row.id);
      candidates.push({
        id: row.id,
        weight: weightForRow(params.fieldId, row),
        topicKey: topicKeyForRow(row),
        previouslyShown: params.previouslyShown?.has(row.id) === true,
      });
    }
  };

  const pageSize = Math.min(unseenPageSize(params.needed), total);
  const targetPool = Math.min(total, Math.max(params.needed * 4, Math.min(80, total)));
  if (total <= pageSize) {
    accept(await loadWindow(0, total));
    return candidates;
  }

  // Several windows, not the first id page. Consecutive ids are often one topic.
  const probeCount = Math.min(8, Math.max(3, Math.ceil(targetPool / pageSize)));
  const usedSkips = new Set<number>();
  let emptyProbes = 0;
  for (let probe = 0; probe < probeCount && candidates.length < targetPool; probe++) {
    let skip = Math.floor(params.random() * (total - pageSize + 1));
    let guard = 0;
    while (usedSkips.has(skip) && guard < 4) {
      skip = Math.floor(params.random() * (total - pageSize + 1));
      guard += 1;
    }
    usedSkips.add(skip);
    const before = candidates.length;
    accept(await loadWindow(skip, pageSize));
    if (candidates.length === before) emptyProbes += 1;
  }

  // A window of another field accepts nothing. Walk the bank until new slots can fill.
  if (candidates.length < params.needed) {
    const wide = Math.min(NEW_WINDOW, total);
    let skip = 0;
    let scanned = 0;
    const loopCap = Math.ceil(total / Math.max(1, wide)) + 2;
    let loops = 0;
    while (candidates.length < targetPool && scanned < total && loops < loopCap) {
      loops += 1;
      const rows = await loadWindow(skip, wide);
      if (rows.length === 0) break;
      accept(rows);
      scanned += rows.length;
      const next = skip + rows.length;
      skip = next >= total ? 0 : next;
      if (emptyProbes > 0 && candidates.length >= params.needed) break;
    }
  }
  return candidates;
}

async function loadUnseenCandidates(params: {
  fieldId: string;
  fieldIds: string[];
  excluded: string[];
  /** Shown on an earlier day. Skipped until never-shown items run out. */
  softExcluded?: readonly string[];
  needed: number;
  random: () => number;
}): Promise<TodayNewCandidate[]> {
  if (params.needed <= 0) return [];
  const hard = new Set(params.excluded);
  const blocked = (await Promise.all(params.fieldIds.map((id) => ineligibleServedIds(id)))).flat();
  for (const id of blocked) hard.add(id);
  const soft = new Set((params.softExcluded ?? []).map((id) => id.trim()).filter((id) => id && !hard.has(id)));
  const strict = (
    await collectUnseenCandidates({
      fieldId: params.fieldId,
      fieldIds: params.fieldIds,
      excluded: new Set([...hard, ...soft]),
      needed: params.needed,
      random: params.random,
    })
  ).map((row) => ({
    ...row,
    previouslyShown: row.previouslyShown === true || soft.has(row.id),
  }));
  const freshCount = strict.filter((row) => !row.previouslyShown).length;
  if (freshCount >= params.needed || soft.size === 0) return strict;
  const relaxed = await collectUnseenCandidates({
    fieldId: params.fieldId,
    fieldIds: params.fieldIds,
    excluded: hard,
    needed: params.needed,
    random: params.random,
    previouslyShown: soft,
  });
  const seen = new Set(strict.map((row) => row.id));
  const merged = [...strict];
  for (const row of relaxed) {
    if (seen.has(row.id)) continue;
    seen.add(row.id);
    merged.push({ ...row, previouslyShown: soft.has(row.id) });
  }
  return merged;
}

export async function selectTodaySet(params: {
  userId: string;
  examSlug: ExamSlug;
  fieldId: string;
  size: number;
  goals?: TodaySetSizeInput | null;
  now?: Date;
  timeZone?: string | null;
  calendarDate?: string | null;
  avoidReviewIds?: readonly string[];
  recentlyShownNewIds?: readonly string[];
  /** Misses and due review only. Unseen bank rows stay out of this sitting. */
  reviewOnly?: boolean;
  targetOverride?: number;
}): Promise<TodaySetSelection> {
  const now = params.now ?? new Date();
  const calendarDate =
    params.calendarDate && /^\d{4}-\d{2}-\d{2}$/.test(params.calendarDate)
      ? params.calendarDate
      : calendarDateKey(now, params.timeZone);
  const target = params.targetOverride ?? resolveTodaySetSize(params.goals);
  const reviewOnly = params.reviewOnly === true;
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

  const [openReviewIds, dueMastery, seenRows, blockedLists] = await Promise.all([
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
    reviewOnly
      ? Promise.resolve([] as { bankItemId: string | null }[])
      : prisma.questionAttempt.findMany({
          where: {
            userId: params.userId,
            fieldId: { in: fieldIds },
            bankItemId: { not: null },
          },
          select: { bankItemId: true },
          distinct: ["bankItemId"],
        }),
    Promise.all(fieldIds.map((id) => ineligibleServedIds(id))),
  ]);

  const blocked = new Set(blockedLists.flat());
  const reviewIncorrectIds = openReviewIds.filter((id) => !blocked.has(id));
  const spacedKeys = dueMastery.map((row) => row.questionKey).filter(Boolean);
  const servableSpaced = await loadServableReviewBankIds(params.fieldId, spacedKeys);
  const spacedReviewIds = spacedKeys.filter((id) => servableSpaced.has(id) && !blocked.has(id));
  const seenIds = seenRows
    .map((row) => row.bankItemId)
    .filter((id): id is string => Boolean(id));
  const random = todaySetRandom([params.userId, params.fieldId, calendarDate]);
  const reviewAvailable = new Set(
    [...reviewIncorrectIds, ...spacedReviewIds].map((id) => id.trim()).filter(Boolean)
  ).size;
  const candidates = reviewOnly
    ? []
    : await loadUnseenCandidates({
        fieldId: params.fieldId,
        fieldIds,
        excluded: [...seenIds, ...reviewIncorrectIds, ...spacedReviewIds],
        softExcluded: params.recentlyShownNewIds,
        needed: todayUnseenNeeded(size, reviewAvailable),
        random,
      });
  const composition = composeTodaySet({
    size,
    reviewIncorrectIds,
    spacedReviewIds,
    newCandidates: candidates,
    random,
    reviewCycle: {
      date: calendarDate,
      salt: hashStringToSeed(`${params.userId}|${params.fieldId}`),
    },
    avoidReviewIds: params.avoidReviewIds,
  });

  return selectionFromComposition({
    examSlug: params.examSlug,
    fieldId: params.fieldId,
    target: reviewOnly ? composition.ids.length : target,
    composition,
  });
}

async function selectionFromComposition(params: {
  examSlug: ExamSlug;
  fieldId: string;
  target: number;
  composition: TodaySetComposition;
}): Promise<TodaySetSelection> {
  const topics: Record<string, TodayTopicLink> = {};
  if (params.composition.ids.length > 0) {
    const rows = await prisma.questionBankItem.findMany({
      where: { id: { in: params.composition.ids } },
      select: { id: true, subjectId: true },
    });
    const byId = new Map(rows.map((row) => [row.id, row.subjectId]));
    const bySubject = new Map<string, TodayTopicLink>();
    for (const id of params.composition.ids) {
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
    target: params.target,
    tomorrowCount: params.target,
    size: params.composition.ids.length,
    composition: params.composition,
    topics,
  };
}

type CachedServed = {
  requestedSize: number;
  selection: TodaySetSelection;
  mix: TodaySetComposition;
};

type ServedParams = {
  userId: string;
  examSlug: ExamSlug;
  fieldId: string;
  size: number;
  goals?: TodaySetSizeInput | null;
  now?: Date;
  timeZone?: string | null;
};

function packMixLine(count: number): string | null {
  if (count <= 0) return null;
  return count === 1 ? "1 question" : `${count} questions`;
}

/**
 * Personal misses and due review for one student, board, and local day.
 * Kept off the shared pack. The snapshot key is separate from any older today-set history.
 */
async function loadReviewServedCore(params: ServedParams): Promise<CachedServed> {
  const now = params.now ?? new Date();
  const zone = resolveStudyTimeZone(params.timeZone);
  const day = calendarDateKey(now, zone);
  const snapshotFieldId = `review-misses:${params.fieldId}`;
  const key = cacheKey(["today-set-review-v1", params.userId, params.fieldId, day, params.size]);
  const ttl = msUntilNextCalendarDay(now, zone);
  const options = { skipFreshL1: isUpstashRedisEnabled() };
  const target = DAILY_PACK_SIZE;

  const finish = async (composition: TodaySetComposition): Promise<CachedServed> => {
    const fitted = fitTodayComposition(composition, params.size);
    const loaded = await loadBankItemsByIds(params.fieldId, fitted.ids);
    const loadedIds = new Set(loaded.map((item) => item.id).filter((id): id is string => Boolean(id)));
    const mix = recountTodayMix(fitted, loadedIds);
    const selection = await selectionFromComposition({
      examSlug: params.examSlug,
      fieldId: params.fieldId,
      target: composition.ids.length,
      composition: mix,
    });
    return { requestedSize: params.size, selection, mix };
  };

  return cacheGetOrSetDeduped<CachedServed>(
    key,
    ttl,
    async () => {
      const metadata = await readTodaySetMetadata(params.userId);
      const stored = readStoredTodaySetForDate(metadata, snapshotFieldId, day);
      if (stored) {
        const full = compositionFromStored(stored);
        if (params.size <= full.ids.length || stored.requestedSize >= params.size) {
          return finish(full);
        }
      }
      const prior = priorTodaySetIds(metadata, snapshotFieldId, day);
      const selection = await selectTodaySet({
        ...params,
        size: target,
        now,
        timeZone: zone,
        calendarDate: day,
        avoidReviewIds: prior.reviewIds,
        recentlyShownNewIds: prior.newIds,
        reviewOnly: true,
        targetOverride: target,
      });
      const loaded = await loadBankItemsByIds(params.fieldId, selection.composition.ids);
      const loadedIds = new Set(
        loaded.map((item) => item.id).filter((id): id is string => Boolean(id))
      );
      const mix = recountTodayMix(selection.composition, loadedIds);
      const latest = await readTodaySetMetadata(params.userId);
      const won = readStoredTodaySetForDate(latest, snapshotFieldId, day);
      if (won && (params.size <= compositionFromStored(won).ids.length || won.requestedSize >= params.size)) {
        return finish(compositionFromStored(won));
      }
      await persistTodaySetSnapshot(params.userId, snapshotFieldId, {
        date: day,
        timeZone: zone,
        requestedSize: target,
        reviewIncorrectIds: mix.reviewIncorrectIds,
        spacedReviewIds: mix.spacedReviewIds,
        newIds: mix.newIds,
      });
      return finish(mix);
    },
    options
  );
}

/**
 * Shared pack behind Today's set. The date is America/Chicago for every student.
 * Misses stay on `loadReviewMissesSet`. A usage cap keeps a prefix of the same pack.
 */
export async function loadServedTodaySet(params: ServedParams): Promise<{
  selection: TodaySetSelection;
  mix: TodaySetComposition;
  items: BankItem[];
}> {
  const now = params.now ?? new Date();
  const pack = await loadSharedDailyPack({ fieldId: params.fieldId, now });
  const fullIds = pack.ids;
  const take = Math.max(0, Math.min(fullIds.length, Math.round(params.size) || 0));
  const ids = fullIds.slice(0, take);
  const byId = new Map(pack.items.map((item) => [item.id, item]));
  const items = ids
    .map((id) => byId.get(id))
    .filter((item): item is BankItem => Boolean(item));
  const servedIds = items.map((item) => item.id).filter((id): id is string => Boolean(id));
  const composition: TodaySetComposition = {
    requestedSize: take,
    ids: servedIds,
    reviewIncorrectIds: [],
    spacedReviewIds: [],
    newIds: servedIds,
    reviewCount: 0,
    newCount: servedIds.length,
    mixLine: packMixLine(servedIds.length),
  };
  const selection = await selectionFromComposition({
    examSlug: params.examSlug,
    fieldId: params.fieldId,
    target: fullIds.length,
    composition,
  });
  return { selection, mix: composition, items };
}

/** Open misses, then due review. Not mixed into the shared pack. */
export async function loadReviewMissesSet(params: ServedParams): Promise<{
  selection: TodaySetSelection;
  mix: TodaySetComposition;
  items: BankItem[];
}> {
  const core = await loadReviewServedCore({
    ...params,
    size: Math.max(0, Math.min(DAILY_PACK_SIZE, Math.round(params.size) || 0)),
  });
  const loaded = await loadBankItemsByIds(params.fieldId, core.mix.ids);
  const loadedIds = new Set(loaded.map((item) => item.id).filter((id): id is string => Boolean(id)));
  const mix = recountTodayMix(core.mix, loadedIds);
  const byId = new Map(loaded.map((item) => [item.id, item]));
  const items = mix.ids
    .map((id) => byId.get(id))
    .filter((item): item is BankItem => Boolean(item));
  return { selection: { ...core.selection, size: mix.ids.length }, mix, items };
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
  timeZone?: string | null;
}): Promise<TodaySetPreview> {
  const now = params.now ?? new Date();
  const today = calendarDateKey(now, params.timeZone);
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
  const allowance = questionAllowanceFromUsage(usage);
  const size = applyQuestionAllowance(DAILY_PACK_SIZE, allowance);
  const questionsDone = Math.max(0, Math.round(params.questionsDone) || 0);

  const served = await loadServedTodaySet({
    userId: params.userId,
    examSlug: params.examSlug,
    fieldId: params.fieldId,
    size,
    goals: params.goals,
    now,
    timeZone: params.timeZone,
  });
  const target = served.selection.target;
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
