/**
 * Shared daily pack. One sequence per practice field, sliced by the
 * America/Chicago date. No model calls and no per-student state.
 *
 * Categories are walked by blueprint weight. Inside a category, answer-key
 * letters are interleaved. A full pass through the sequence does not repeat
 * an id. The last day of a pass is short when the pool is not a multiple of
 * the pack size. A pool smaller than the pack is the whole pass, and the next
 * day starts over. An empty pool stays empty.
 */

import { bankRowMatchesPracticeField } from "@/lib/edtech/exam-item-scope";
import { CASE_ITEM_TYPES } from "@/lib/inventory/question-format";
import { parseBankOptions } from "@/lib/mpje/parse-bank-options";
import { normalizeFieldId } from "@/lib/subjects/field-ids";

export const DAILY_PACK_SIZE = 20;

export const DAILY_PACK_TIME_ZONE = "America/Chicago";

/** Boards whose question-bank Today card is the shared pack, not the mastery engine. */
const SHARED_PACK_EXAM_SLUGS = new Set(["pance", "aanp-fnp", "npte-pt"]);

export type DailyPackCandidate = {
  id: string;
  categoryKey: string;
  /** Blueprint share. Non-positive weights are treated as a trace so the row is still reachable. */
  weight: number;
  /** 0–3 for a single-best-answer item. Null when the item has no letter. */
  keyIndex: number | null;
};

export type DailyPackServeResult = {
  ids: string[];
  /** Ids already pulled forward or retired in this pass. Later days skip them. */
  borrowed: string[];
  overflow: string[];
};

function dedupe(ids: readonly string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const id of ids) {
    const trimmed = id.trim();
    if (!trimmed || seen.has(trimmed)) continue;
    seen.add(trimmed);
    out.push(trimmed);
  }
  return out;
}

function positiveWeight(weight: number): number {
  return Number.isFinite(weight) && weight > 0 ? weight : 0.001;
}

/** Option letter for a single keyed MCQ, or null when the item is not A–D. */
export function answerKeyIndex(
  correctAnswer: string | null | undefined,
  optionsRaw: string | null | undefined
): number | null {
  const answer = correctAnswer?.trim() ?? "";
  if (!answer || !optionsRaw || answer.includes(",") || answer.includes("|||")) return null;
  const { options } = parseBankOptions(optionsRaw);
  if (options.length < 2) return null;
  const index = options.findIndex((option) => option.trim() === answer);
  if (index < 0 || index > 3) return null;
  return index;
}

function interleaveKeys(items: readonly DailyPackCandidate[]): DailyPackCandidate[] {
  const sorted = [...items].sort((a, b) => a.id.localeCompare(b.id) || a.categoryKey.localeCompare(b.categoryKey));
  const buckets = new Map<string, DailyPackCandidate[]>();
  for (const item of sorted) {
    const key = item.keyIndex == null ? "other" : String(item.keyIndex);
    const list = buckets.get(key) ?? [];
    list.push(item);
    buckets.set(key, list);
  }
  const queues = ["0", "1", "2", "3", "other"]
    .filter((key) => (buckets.get(key)?.length ?? 0) > 0)
    .map((key) => buckets.get(key)!);
  const out: DailyPackCandidate[] = [];
  let guard = sorted.length + 1;
  while (out.length < sorted.length && guard > 0) {
    guard -= 1;
    let progressed = false;
    for (const queue of queues) {
      const next = queue.shift();
      if (!next) continue;
      out.push(next);
      progressed = true;
    }
    if (!progressed) break;
  }
  return out;
}

/**
 * Every candidate appears once. Heavier blueprint categories are emitted more
 * often. Ties break on the category key, then the interleave order inside it.
 */
export function buildDailyPackSequence(items: readonly DailyPackCandidate[]): string[] {
  const groups = new Map<string, { weight: number; items: DailyPackCandidate[] }>();
  for (const item of items) {
    const id = item.id.trim();
    if (!id) continue;
    const key = item.categoryKey.trim() || "general";
    const group = groups.get(key) ?? { weight: positiveWeight(item.weight), items: [] };
    group.weight = Math.max(group.weight, positiveWeight(item.weight));
    group.items.push({ ...item, id, categoryKey: key });
    groups.set(key, group);
  }

  const categories = [...groups.entries()]
    .map(([key, group]) => ({
      key,
      weight: positiveWeight(group.weight),
      queue: interleaveKeys(group.items),
    }))
    .sort((a, b) => b.weight - a.weight || a.key.localeCompare(b.key));

  const total = categories.reduce((sum, category) => sum + category.queue.length, 0);
  const current = new Map<string, number>(categories.map((category) => [category.key, 0]));
  const out: string[] = [];
  while (out.length < total) {
    const live = categories.filter((category) => category.queue.length > 0);
    if (live.length === 0) break;
    const weightSum = live.reduce((sum, category) => sum + category.weight, 0);
    let best = live[0]!;
    let bestCurrent = Number.NEGATIVE_INFINITY;
    for (const category of live) {
      const next = (current.get(category.key) ?? 0) + category.weight;
      current.set(category.key, next);
      const better =
        next > bestCurrent + 1e-9 ||
        (Math.abs(next - bestCurrent) <= 1e-9 && category.key.localeCompare(best.key) < 0);
      if (better) {
        best = category;
        bestCurrent = next;
      }
    }
    current.set(best.key, bestCurrent - weightSum);
    const next = best.queue.shift();
    if (next) out.push(next.id);
  }
  return dedupe(out);
}

export function dailyPackCycleDays(length: number, size = DAILY_PACK_SIZE): number {
  if (length <= 0) return 1;
  return Math.max(1, Math.ceil(length / Math.max(1, size)));
}

/**
 * Slice for one Chicago day index.
 * `borrowed` ids were pulled forward on an earlier day of this pass, or were
 * retired out of an earlier window. `ineligible` ids are skipped and the hole
 * is filled from the next ids in the sequence, which are then borrowed so a
 * later day does not serve them again.
 */
export function serveDailyPack(input: {
  sequence: readonly string[];
  dayIndex: number;
  borrowed?: readonly string[];
  ineligible?: ReadonlySet<string>;
  size?: number;
}): DailyPackServeResult {
  const size = Math.max(1, Math.round(input.size ?? DAILY_PACK_SIZE));
  const sequence = dedupe(input.sequence);
  const borrowed = dedupe(input.borrowed ?? []);
  if (sequence.length === 0) {
    return { ids: [], borrowed, overflow: [] };
  }

  const cycleDays = dailyPackCycleDays(sequence.length, size);
  const dayIndex = Number.isFinite(input.dayIndex) ? Math.trunc(input.dayIndex) : 0;
  const dayInCycle = ((dayIndex % cycleDays) + cycleDays) % cycleDays;
  const start = dayInCycle * size;
  const originalEnd = Math.min(sequence.length, start + size);
  const skip = new Set(borrowed);
  for (const id of input.ineligible ?? []) skip.add(id);

  const indexOf = new Map(sequence.map((id, index) => [id, index]));
  const ids: string[] = [];
  for (let index = start; index < sequence.length && ids.length < size; index += 1) {
    const id = sequence[index]!;
    if (skip.has(id)) continue;
    ids.push(id);
  }

  const used = new Set(ids);
  const overflow = sequence.slice(start).filter((id) => !used.has(id) && !skip.has(id));
  const nextBorrowed = new Set(borrowed);
  for (let index = start; index < originalEnd; index += 1) {
    const id = sequence[index]!;
    if (input.ineligible?.has(id)) nextBorrowed.add(id);
  }
  for (const id of ids) {
    const index = indexOf.get(id) ?? -1;
    if (index >= originalEnd) nextBorrowed.add(id);
  }

  return { ids, borrowed: [...nextBorrowed], overflow };
}

export function isDailyPackCaseItem(itemType: string | null | undefined): boolean {
  return CASE_ITEM_TYPES.has((itemType ?? "").trim().toLowerCase());
}

/** True when a row may enter this field's pack before the structural SQL exclusion. */
export function isDailyPackFieldRow(
  row: { fieldId?: string | null; stepLevel?: string | null; itemType?: string | null; active?: boolean | null; qaPassed?: boolean | null },
  fieldId: string
): boolean {
  if (row.active === false || row.qaPassed === false) return false;
  if (isDailyPackCaseItem(row.itemType)) return false;
  return bankRowMatchesPracticeField(row, normalizeFieldId(fieldId));
}

/**
 * Prisma filter for the shared pack. Step 3 rows filed on Step 2 stay on the
 * Step 3 pack and stay off the Step 2 pack. Null step levels stay on Step 2.
 * Case item types are excluded.
 */
export function dailyPackServeWhere(fieldId: string): Record<string, unknown> {
  const canonical = normalizeFieldId(fieldId);
  const itemType = { notIn: [...CASE_ITEM_TYPES] };
  const base = { active: true, qaPassed: true, itemType };
  if (canonical === "usmle-step-2") {
    return {
      ...base,
      fieldId: canonical,
      OR: [{ stepLevel: null }, { stepLevel: { not: "step3" } }],
    };
  }
  if (canonical === "usmle-step-3") {
    return {
      ...base,
      OR: [
        { fieldId: "usmle-step-3" },
        { fieldId: "usmle-step-2", stepLevel: "step3" },
      ],
    };
  }
  return { ...base, fieldId: canonical };
}

/** Same Step 3 exclusion the mastery Today query must apply on Step 2. */
export function excludeStep3FiledOnStep2(fieldId: string): { OR: Array<Record<string, unknown>> } | Record<string, never> {
  if (normalizeFieldId(fieldId) !== "usmle-step-2") return {};
  return { OR: [{ stepLevel: null }, { stepLevel: { not: "step3" } }] };
}

export function examUsesSharedDailyPack(examSlug: string | null | undefined, fieldId?: string | null): boolean {
  if (examSlug && SHARED_PACK_EXAM_SLUGS.has(examSlug)) return true;
  if (fieldId && SHARED_PACK_EXAM_SLUGS.has(normalizeFieldId(fieldId))) return true;
  return false;
}

/**
 * Mastery Today exists for NCLEX, NAPLEX, and USMLE only.
 * Every other board, including PANCE, AANP FNP, and NPTE-PT, uses the shared pack
 * so a question-bank Today launch cannot fall through to the NCLEX mastery set.
 */
export function masteryTodayExamSlug(
  fieldId: string | null | undefined,
  examSlug?: string | null
): "nclex" | "naplex" | "usmle" | null {
  const field = normalizeFieldId(fieldId ?? "");
  if (field === "pharmacy" || examSlug === "naplex") return "naplex";
  if (
    examSlug === "usmle" ||
    field === "usmle-step-1" ||
    field === "usmle-step-2" ||
    field === "usmle-step-3"
  ) {
    return "usmle";
  }
  if (examSlug === "nclex" || field === "nursing") return "nclex";
  return null;
}
