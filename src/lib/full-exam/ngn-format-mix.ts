/**
 * Enforce blueprint NGN format quotas when assembling live NCLEX (and similar) exams.
 * Without this, random/gather paths over-sample vignettes even when NGN inventory is healthy.
 */
import type { BankItem } from "@/lib/question-bank";
import { getExamBlueprint, type ExamBlueprint } from "@/lib/engine/blueprints";

/** Blueprint format → DB itemType aliases that satisfy that slot. */
const FORMAT_ITEM_TYPES: Record<string, readonly string[]> = {
  bow_tie: ["ngn_bowtie", "bow_tie"],
  matrix: ["ngn_matrix", "matrix"],
  select_all: ["select_all", "sata"],
  ordered_response: ["ordered_response"],
  /** NCLEX blueprint uses drag_drop for priority/order items. */
  drag_drop: ["ordered_response", "drag_drop"],
  highlight: ["ngn_highlight", "highlight"],
  unfolding_case: ["case_study", "unfolding_case"],
};

const CLASSIC_TYPES = new Set(["vignette", "mcq", "multiple_choice", ""]);

export type NgnFormatTarget = {
  format: string;
  count: number;
  itemTypes: readonly string[];
};

function shuffleWithSeed<T>(items: T[], seed: number): T[] {
  let a = seed >>> 0;
  const rng = () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function normalizeItemType(item: BankItem): string {
  return (item.itemType ?? "").trim().toLowerCase();
}

function itemMatchesFormat(item: BankItem, format: string): boolean {
  const type = normalizeItemType(item);
  const aliases = FORMAT_ITEM_TYPES[format];
  if (aliases?.includes(type)) return true;
  const kind =
    item.ngnPayload && typeof item.ngnPayload === "object"
      ? String((item.ngnPayload as { kind?: unknown }).kind ?? "")
      : "";
  return kind === format || aliases?.includes(kind) === true;
}

function isClassicItem(item: BankItem): boolean {
  const type = normalizeItemType(item);
  if (CLASSIC_TYPES.has(type)) return true;
  for (const aliases of Object.values(FORMAT_ITEM_TYPES)) {
    if (aliases.includes(type)) return false;
  }
  return true;
}

/** Official minimum-length NCLEX includes 18 case-study items (3×6 CJMM). */
export const NCLEX_CASE_STUDY_ITEM_TARGET = 18;

/** Plan integer NGN slot counts from blueprint mix (mirrors assignNgnFormats). */
export function planNgnFormatTargets(
  questionCount: number,
  blueprint: ExamBlueprint
): NgnFormatTarget[] {
  if (!blueprint.ngnMix?.length || questionCount <= 0) return [];

  const totalWeight = blueprint.ngnMix.reduce((n, m) => n + m.weight, 0);
  if (totalWeight <= 0) return [];

  const ngnCount = Math.round(questionCount * totalWeight);
  const targets: NgnFormatTarget[] = [];
  let assigned = 0;

  for (const mix of blueprint.ngnMix) {
    const count = Math.max(0, Math.round((mix.weight / totalWeight) * ngnCount));
    const capped = Math.min(count, Math.max(0, ngnCount - assigned));
    if (capped <= 0) continue;
    assigned += capped;
    targets.push({
      format: mix.format,
      count: capped,
      itemTypes: FORMAT_ITEM_TYPES[mix.format] ?? [mix.format],
    });
  }

  // Full-length / CAT pools: reserve ~18 unfolding case items like the real exam.
  if (blueprint.fieldId === "nursing" && questionCount >= 85) {
    const caseIdx = targets.findIndex((t) => t.format === "unfolding_case");
    const floor = Math.min(NCLEX_CASE_STUDY_ITEM_TARGET, questionCount);
    if (caseIdx >= 0) {
      const current = targets[caseIdx]!;
      if (current.count < floor) {
        targets[caseIdx] = { ...current, count: floor };
      }
    } else {
      targets.unshift({
        format: "unfolding_case",
        count: floor,
        itemTypes: FORMAT_ITEM_TYPES.unfolding_case,
      });
    }
  }

  return targets;
}

/**
 * Pick `limit` items from pool, filling blueprint NGN quotas first, then classic items.
 * Falls back gracefully when a format bucket is thin.
 */
export function selectWithNgnFormatMix(
  pool: BankItem[],
  limit: number,
  fieldId: string,
  seed = 0x51ed270b
): BankItem[] {
  if (limit <= 0) return [];
  if (pool.length <= limit) return pool.slice(0, limit);

  const blueprint = getExamBlueprint(fieldId);
  if (!blueprint?.ngnMix?.length) {
    return pool.slice(0, limit);
  }

  const targets = planNgnFormatTargets(limit, blueprint);
  if (!targets.length) return pool.slice(0, limit);

  const used = new Set<string>();
  const picked: BankItem[] = [];

  const take = (item: BankItem) => {
    const id = item.id ?? "";
    if (!id || used.has(id)) return false;
    used.add(id);
    picked.push(item);
    return true;
  };

  for (const target of targets) {
    let need = target.count;
    for (const item of pool) {
      if (need <= 0 || picked.length >= limit) break;
      if (!itemMatchesFormat(item, target.format)) continue;
      if (take(item)) need -= 1;
    }
  }

  for (const item of pool) {
    if (picked.length >= limit) break;
    if (!isClassicItem(item)) continue;
    take(item);
  }

  // Top up from remaining pool (any format) if quotas underfilled.
  for (const item of pool) {
    if (picked.length >= limit) break;
    take(item);
  }

  return shuffleWithSeed(picked.slice(0, limit), seed);
}

/** Summarize format counts for tests / diagnostics. */
export function countFormatsInSelection(items: BankItem[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const item of items) {
    const type = normalizeItemType(item) || "unknown";
    out[type] = (out[type] ?? 0) + 1;
  }
  return out;
}
