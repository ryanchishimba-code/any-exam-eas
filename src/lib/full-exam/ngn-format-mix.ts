/**
 * Enforce blueprint NGN format quotas when assembling live NCLEX (and similar) exams.
 * Without this, random/gather paths over-sample vignettes even when NGN inventory is healthy.
 */
import type { BankItem } from "@/lib/question-bank";
import { sequentialSetId } from "@/lib/exam-prep/sitting-clusters";
import { getExamBlueprint, type ExamBlueprint } from "@/lib/engine/blueprints";
import { isPlainSingleAnswerReclass, isRealHighlight } from "@/lib/exam-prep/effective-type";
import { parseSelectAllCorrectAnswers } from "@/lib/question-format";

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

/** A labelled highlight or case row that is really one single-answer MCQ. */
function isReclassifiedMcq(item: BankItem): boolean {
  return isPlainSingleAnswerReclass({
    itemType: item.itemType,
    question: item.question,
    scenario: item.scenario ?? item.vignette,
    correctAnswer: item.correctAnswer,
    options: item.options,
    ngnPayload: item.ngnPayload,
    curationMeta: item.curationMeta,
  });
}

function payloadKind(item: BankItem): string {
  if (!item.ngnPayload || typeof item.ngnPayload !== "object") return "";
  return String((item.ngnPayload as { kind?: unknown }).kind ?? "")
    .trim()
    .toLowerCase();
}

/** SATA rows whose key is one choice are single-answer MCQs. */
function isSingleAnswerSelectAll(item: BankItem): boolean {
  const type = normalizeItemType(item);
  if (type !== "select_all" && type !== "sata") return false;
  return parseSelectAllCorrectAnswers(item.options ?? [], item.correctAnswer ?? "").length < 2;
}

/** `kind` on the options envelope is not a format. NAPLEX MCQs store kind=highlight. */
function isClassicCarrier(item: BankItem): boolean {
  const type = normalizeItemType(item);
  return type === "mcq" || type === "vignette" || type === "multiple_choice" || type === "";
}

function isRealHighlightItem(item: BankItem): boolean {
  const type = normalizeItemType(item);
  if (type !== "highlight" && type !== "ngn_highlight" && payloadKind(item) !== "highlight") return false;
  if (isClassicCarrier(item)) return false;
  return isRealHighlight(
    {
      itemType: item.itemType,
      question: item.question,
      scenario: item.scenario ?? item.vignette,
      correctAnswer: item.correctAnswer,
      options: item.options,
      ngnPayload: item.ngnPayload,
    },
    item.ngnPayload && typeof item.ngnPayload === "object" ? item.ngnPayload : null
  );
}

function itemMatchesFormat(item: BankItem, format: string): boolean {
  if (isReclassifiedMcq(item) || isSingleAnswerSelectAll(item) || isClassicCarrier(item)) return false;
  const type = normalizeItemType(item);
  if ((format === "highlight" || type === "highlight" || type === "ngn_highlight") && !isRealHighlightItem(item)) {
    return false;
  }
  const aliases = FORMAT_ITEM_TYPES[format];
  if (aliases?.includes(type)) return true;
  const kind = payloadKind(item);
  if (!kind || kind === "highlight") return false;
  return kind === format || aliases?.includes(kind) === true;
}

function stepIndexOf(item: BankItem): number | null {
  const payload = item.ngnPayload;
  if (!payload || typeof payload !== "object") return null;
  const step = (payload as { stepIndex?: unknown }).stepIndex;
  return typeof step === "number" && Number.isFinite(step) ? step : null;
}

/**
 * Whole published cases: one item per step, steps exactly 1..n, n ≥ 2.
 * A missing or duplicate step drops the case so a broken set is not served.
 */
export function completeSequentialGroups(pool: readonly BankItem[]): BankItem[][] {
  const bySet = new Map<string, BankItem[]>();
  for (const item of pool) {
    const setId = sequentialSetId(item);
    const step = stepIndexOf(item);
    if (!setId || step == null) continue;
    const list = bySet.get(setId) ?? [];
    list.push(item);
    bySet.set(setId, list);
  }

  const groups: BankItem[][] = [];
  for (const items of bySet.values()) {
    const sorted = [...items].sort((a, b) => (stepIndexOf(a) ?? 0) - (stepIndexOf(b) ?? 0));
    const steps = sorted.map((item) => stepIndexOf(item) ?? 0);
    const unique = [...new Set(steps)];
    if (unique.length !== sorted.length || unique.length < 2) continue;
    if (!unique.every((step, index) => step === index + 1)) continue;
    groups.push(sorted);
  }
  return groups;
}

function isCatalogStandalone(item: BankItem): boolean {
  const id = item.id ?? "";
  return id.startsWith("ngn:") && sequentialSetId(item) == null;
}

/** Keep each case's steps together and in order while the rest of the sitting shuffles. */
function shuffleKeepingCases(items: BankItem[], seed: number): BankItem[] {
  const bySet = new Map<string, BankItem[]>();
  for (const item of items) {
    const setId = sequentialSetId(item);
    if (!setId) continue;
    const list = bySet.get(setId) ?? [];
    list.push(item);
    bySet.set(setId, list);
  }
  for (const group of bySet.values()) {
    group.sort((a, b) => (stepIndexOf(a) ?? 0) - (stepIndexOf(b) ?? 0));
  }
  const emitted = new Set<string>();
  const units: BankItem[][] = [];
  for (const item of items) {
    const setId = sequentialSetId(item);
    if (!setId) {
      units.push([item]);
      continue;
    }
    if (emitted.has(setId)) continue;
    emitted.add(setId);
    units.push(bySet.get(setId) ?? [item]);
  }
  return shuffleWithSeed(units, seed).flat();
}

function isClassicItem(item: BankItem): boolean {
  if (isReclassifiedMcq(item) || isSingleAnswerSelectAll(item)) return true;
  if (isClassicCarrier(item)) return true;
  const type = normalizeItemType(item);
  if ((type === "highlight" || type === "ngn_highlight") && !isRealHighlightItem(item)) return true;
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
const PUBLISHED_NGN_TYPES = new Set<string>([
  ...Object.values(FORMAT_ITEM_TYPES).flat(),
  "select_all",
  "sata",
  "case_study",
  "case_based",
  "unfolding_case",
  "drag_drop",
  "constructed_response",
]);

/**
 * A row that can fill an NGN slot. Single-answer SATA, relabeled cases, and
 * MCQs that only carry kind=highlight in the options JSON do not qualify.
 */
export function isPublishedNgnBankItem(item: BankItem): boolean {
  if (isReclassifiedMcq(item) || isSingleAnswerSelectAll(item) || isClassicCarrier(item)) return false;
  const type = normalizeItemType(item);
  if (type === "highlight" || type === "ngn_highlight") return isRealHighlightItem(item);
  if (PUBLISHED_NGN_TYPES.has(type)) return true;
  const kind = payloadKind(item);
  if (!kind || kind === "highlight" || kind === "mcq" || kind === "vignette") return false;
  return kind === "sequential" || PUBLISHED_NGN_TYPES.has(kind);
}

export function selectWithNgnFormatMix(
  pool: BankItem[],
  limit: number,
  fieldId: string,
  seed = 0x51ed270b
): BankItem[] {
  if (limit <= 0 || pool.length === 0) return [];

  const blueprint = getExamBlueprint(fieldId);
  // A short pool cannot trade a classic item for a missing format. An exact-length
  // pool still runs the quota pass so NGN rows are not left past a later slice.
  if (!blueprint?.ngnMix?.length || pool.length < limit) {
    return pool.slice(0, limit);
  }

  const planned = planNgnFormatTargets(limit, blueprint);
  const targets = planned
    .map((target) => ({
      ...target,
      count: Math.min(
        target.count,
        pool.filter((item) => itemMatchesFormat(item, target.format)).length
      ),
    }))
    .filter((target) => target.count > 0);
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

  const caseTarget = targets.find((target) => target.format === "unfolding_case");
  let caseRoom = caseTarget?.count ?? (limit >= 85 ? Math.min(18, limit) : 0);
  for (const group of completeSequentialGroups(pool)) {
    if (group.length < 2 || group.length > caseRoom) continue;
    if (picked.length + group.length > limit) continue;
    if (group.some((item) => used.has(item.id ?? ""))) continue;
    group.forEach((item) => take(item));
    caseRoom -= group.length;
  }

  // Published standalones (bow-tie and trend) are not QuestionBankItem rows.
  // Take them before classic fill so a long vignette pool cannot crowd them out.
  const standaloneCap = Math.max(0, Math.floor(limit * 0.22) - picked.length);
  let standaloneRoom = standaloneCap;
  for (const item of pool) {
    if (standaloneRoom <= 0 || picked.length >= limit) break;
    if (!isCatalogStandalone(item)) continue;
    if (take(item)) standaloneRoom -= 1;
  }

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

  return shuffleKeepingCases(picked.slice(0, limit), seed);
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
