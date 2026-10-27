/**
 * Loads one shared daily pack per practice field and Chicago date.
 * The sequence is cached until Chicago midnight. Each serve re-checks
 * active and qaPassed and replaces a retired id from the deterministic overflow.
 */

import { cacheDeleteMatching, cacheGet, cacheGetOrSetDeduped, cacheKey, cacheWriteThrough } from "@/lib/cache";
import { getExamBlueprint } from "@/lib/engine/blueprints";
import { ineligibleServedIds } from "@/lib/exam-prep/student-eligibility";
import { loadBankItemsByIds } from "@/lib/full-exam/load-bank-items-by-ids";
import type { BankItem } from "@/lib/question-bank";
import { calendarDateKey, calendarDayIndex, msUntilNextCalendarDay } from "@/lib/learning/today-set";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { normalizeFieldId } from "@/lib/subjects/field-ids";
import {
  DAILY_PACK_SIZE,
  DAILY_PACK_TIME_ZONE,
  answerKeyIndex,
  buildDailyPackSequence,
  dailyPackCycleDays,
  dailyPackServeWhere,
  isDailyPackFieldRow,
  serveDailyPack,
  type DailyPackCandidate,
} from "@/lib/learning/daily-pack";

const DAY_MS = 86_400_000;

export function resetSharedDailyPackCache(): void {
  cacheDeleteMatching(`${cacheKey(["daily-pack-seq-v1"])}:`);
  cacheDeleteMatching(`${cacheKey(["daily-pack-day-v1"])}:`);
  cacheDeleteMatching(`${cacheKey(["daily-pack-borrowed-v1"])}:`);
}

function sequenceFingerprint(ids: readonly string[]): string {
  let hash = 2166136261;
  for (const id of ids) {
    for (let index = 0; index < id.length; index += 1) {
      hash ^= id.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    hash ^= 0xff;
  }
  return `${ids.length.toString(36)}-${(hash >>> 0).toString(36)}`;
}

function categoryForRow(
  fieldId: string,
  row: { subjectId: string | null; topicCategory: string | null; blueprintDomain: string | null }
): { categoryKey: string; weight: number } {
  const subject = row.subjectId?.trim() ?? "";
  const blueprint = getExamBlueprint(fieldId);
  const category = blueprint?.categories.find(
    (item) =>
      (subject && (item.subjectIds?.includes(subject) || item.id === subject)) ||
      (row.blueprintDomain && (item.id === row.blueprintDomain || item.label === row.blueprintDomain)) ||
      (row.topicCategory && (item.id === row.topicCategory || item.label === row.topicCategory))
  );
  const categoryKey =
    category?.id || subject || row.blueprintDomain?.trim() || row.topicCategory?.trim() || "general";
  const weight = category && category.weight > 0 ? category.weight : 0.001;
  return { categoryKey, weight };
}

async function readBorrowed(key: string, ttl: number): Promise<string[]> {
  const fresh = cacheGet<string[]>(key);
  if (fresh) return fresh;
  const loaded = await cacheGetOrSetDeduped<string[] | null>(key, ttl, async () => null);
  return Array.isArray(loaded) ? loaded : [];
}

async function writeBorrowed(key: string, ids: string[], ttl: number): Promise<void> {
  await cacheWriteThrough(key, ids, Math.max(60_000, ttl));
}

async function buildSequence(fieldId: string): Promise<string[]> {
  const canonical = normalizeFieldId(fieldId);
  const rows = await prisma.questionBankItem.findMany({
    where: dailyPackServeWhere(canonical) as Prisma.QuestionBankItemWhereInput,
    orderBy: { id: "asc" },
    select: {
      id: true,
      subjectId: true,
      topicCategory: true,
      blueprintDomain: true,
      correctAnswer: true,
      options: true,
      itemType: true,
      fieldId: true,
      stepLevel: true,
      active: true,
      qaPassed: true,
    },
  });
  const blocked = new Set(await ineligibleServedIds(canonical));
  if (canonical === "usmle-step-3") {
    for (const id of await ineligibleServedIds("usmle-step-2")) blocked.add(id);
  }
  const candidates: DailyPackCandidate[] = [];
  for (const row of rows) {
    if (blocked.has(row.id) || !isDailyPackFieldRow(row, canonical)) continue;
    const category = categoryForRow(canonical, row);
    candidates.push({
      id: row.id,
      categoryKey: category.categoryKey,
      weight: category.weight,
      keyIndex: answerKeyIndex(row.correctAnswer, row.options),
    });
  }
  return buildDailyPackSequence(candidates);
}

async function loadSequence(fieldId: string, now: Date): Promise<string[]> {
  const date = calendarDateKey(now, DAILY_PACK_TIME_ZONE);
  const key = cacheKey(["daily-pack-seq-v1", normalizeFieldId(fieldId), date]);
  const ttl = msUntilNextCalendarDay(now, DAILY_PACK_TIME_ZONE);
  return cacheGetOrSetDeduped(key, ttl, () => buildSequence(fieldId));
}

function orderItems(ids: readonly string[], loaded: readonly BankItem[]): BankItem[] {
  const byId = new Map(loaded.map((item) => [item.id, item]));
  return ids
    .map((id) => byId.get(id))
    .filter((item): item is BankItem => Boolean(item));
}

/**
 * Full pack for this field and Chicago date. A short pool is returned whole.
 * An empty pool stays empty. `ids` and `items` are the same order.
 */
export async function loadSharedDailyPack(params: {
  fieldId: string;
  now?: Date;
}): Promise<{ ids: string[]; items: BankItem[] }> {
  const now = params.now ?? new Date();
  const fieldId = normalizeFieldId(params.fieldId);
  const sequence = await loadSequence(fieldId, now);
  if (sequence.length === 0) return { ids: [], items: [] };

  const date = calendarDateKey(now, DAILY_PACK_TIME_ZONE);
  const dayIndex = calendarDayIndex(date);
  const fingerprint = sequenceFingerprint(sequence);
  const cycleDays = dailyPackCycleDays(sequence.length, DAILY_PACK_SIZE);
  const cycleIndex = Math.floor(dayIndex / cycleDays);
  const dayTtl = msUntilNextCalendarDay(now, DAILY_PACK_TIME_ZONE);
  const borrowedTtl = Math.max(dayTtl, cycleDays * DAY_MS);
  const dayKey = cacheKey(["daily-pack-day-v1", fieldId, date, fingerprint]);
  const borrowedKey = cacheKey(["daily-pack-borrowed-v1", fieldId, fingerprint, cycleIndex]);

  const initial = await cacheGetOrSetDeduped<string[]>(dayKey, dayTtl, async () => {
    const borrowed = await readBorrowed(borrowedKey, borrowedTtl);
    const served = serveDailyPack({ sequence, dayIndex, borrowed });
    await writeBorrowed(borrowedKey, served.borrowed, borrowedTtl);
    return served.ids;
  });

  let ids = initial;
  for (let pass = 0; pass < 4; pass += 1) {
    if (ids.length === 0) return { ids: [], items: [] };
    const liveRows = await prisma.questionBankItem.findMany({
      where: {
        ...(dailyPackServeWhere(fieldId) as Prisma.QuestionBankItemWhereInput),
        id: { in: ids },
      },
      select: {
        id: true,
        fieldId: true,
        stepLevel: true,
        itemType: true,
        active: true,
        qaPassed: true,
      },
    });
    const live = new Set(
      liveRows.filter((row) => isDailyPackFieldRow(row, fieldId)).map((row) => row.id)
    );
    const loaded = await loadBankItemsByIds(
      fieldId,
      ids.filter((id) => live.has(id))
    );
    const loadedIds = new Set(loaded.map((item) => item.id).filter((id): id is string => Boolean(id)));
    const kept = ids.filter((id) => loadedIds.has(id));
    if (kept.length === ids.length) {
      return { ids: kept, items: orderItems(kept, loaded) };
    }

    const ineligible = new Set(ids.filter((id) => !loadedIds.has(id)));
    const borrowedRaw = await readBorrowed(borrowedKey, borrowedTtl);
    const current = new Set(ids);
    const borrowed = borrowedRaw.filter((id) => !current.has(id) || ineligible.has(id));
    const next = serveDailyPack({ sequence, dayIndex, borrowed, ineligible });
    ids = next.ids;
    await writeBorrowed(borrowedKey, next.borrowed, borrowedTtl);
    await cacheWriteThrough(dayKey, ids, dayTtl);
  }

  const loaded = await loadBankItemsByIds(fieldId, ids);
  const loadedIds = new Set(loaded.map((item) => item.id).filter((id): id is string => Boolean(id)));
  const kept = ids.filter((id) => loadedIds.has(id));
  return { ids: kept, items: orderItems(kept, loaded) };
}
