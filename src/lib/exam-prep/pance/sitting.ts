/**
 * One PANCE sitting: no repeated scenario, NCCPA content weights, and a
 * difficulty floor on the 300-question simulation when the pool can fill it.
 * Question text is not changed.
 */
import { blueprintCategoryIdForQuestion } from "@/lib/inventory/blueprint-domain-pool";
import type { BankItem } from "@/lib/question-bank";
import {
  replaceSimilarScenarios,
  scenariosAreNearDuplicate,
} from "@/lib/exam-prep/aanp-fnp/scenario-similarity";
import { PANCE_2025_CONTENT } from "@/lib/exam-prep/compose/pance-2025-plan";

export const PANCE_FULL_QUESTION_COUNT = 300;
/** Full simulations skip difficulty 1 and 2 when enough harder rows exist. */
export const PANCE_FULL_DIFFICULTY_FLOOR = 3;

const CONTENT_IDS = PANCE_2025_CONTENT.map((row) => row.id);

export function panceContentTargets(limit: number): Record<string, number> {
  const length = Math.max(0, Math.floor(limit) || 0);
  const rows = PANCE_2025_CONTENT.map((area) => ({
    id: area.id,
    exact: length * area.weight,
    count: Math.floor(length * area.weight),
  }));
  let left = length - rows.reduce((sum, row) => sum + row.count, 0);
  const byRemainder = [...rows].sort(
    (a, b) => b.exact - b.count - (a.exact - a.count) || a.id.localeCompare(b.id)
  );
  for (const row of byRemainder) {
    if (left <= 0) break;
    row.count += 1;
    left -= 1;
  }
  return Object.fromEntries(rows.map((row) => [row.id, row.count]));
}

function textField(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function panceItemContentId(item: BankItem): string | null {
  const explicit = textField(item.blueprintDomain) || textField(item.topicCategory) || textField(item.subjectId);
  if (CONTENT_IDS.includes(explicit)) return explicit;
  const area = blueprintCategoryIdForQuestion("pance", {
    subjectId: textField(item.subjectId) || textField(item.topicCategory) || undefined,
    clientNeeds: textField(item.clientNeedsCategory) || null,
  });
  if (area && CONTENT_IDS.includes(area)) return area;
  return null;
}

export type PanceDifficultyPoolReport = {
  /** Rows at each stored difficulty. Missing difficulty is "unknown". */
  byDifficulty: Record<string, number>;
  floor: number;
  atOrAboveFloor: number;
  belowFloor: number;
  /** True when a full simulation can be filled without difficulty 1–2 rows. */
  floorCanFillFullExam: boolean;
};

export function panceDifficultyPoolReport(
  pool: readonly BankItem[],
  fullLength = PANCE_FULL_QUESTION_COUNT
): PanceDifficultyPoolReport {
  const byDifficulty: Record<string, number> = {};
  let atOrAboveFloor = 0;
  let belowFloor = 0;
  for (const item of pool) {
    const key =
      typeof item.difficulty === "number" && Number.isFinite(item.difficulty)
        ? String(item.difficulty)
        : "unknown";
    byDifficulty[key] = (byDifficulty[key] ?? 0) + 1;
    if (typeof item.difficulty === "number" && item.difficulty >= PANCE_FULL_DIFFICULTY_FLOOR) {
      atOrAboveFloor += 1;
    } else {
      belowFloor += 1;
    }
  }
  return {
    byDifficulty,
    floor: PANCE_FULL_DIFFICULTY_FLOOR,
    atOrAboveFloor,
    belowFloor,
    floorCanFillFullExam: atOrAboveFloor >= fullLength,
  };
}

function meetsDifficultyFloor(item: BankItem): boolean {
  return typeof item.difficulty === "number" && item.difficulty >= PANCE_FULL_DIFFICULTY_FLOOR;
}

function countContent(items: readonly BankItem[]): Record<string, number> {
  const counts: Record<string, number> = { other: 0 };
  for (const id of CONTENT_IDS) counts[id] = 0;
  for (const item of items) {
    const id = panceItemContentId(item);
    counts[id ?? "other"] = (counts[id ?? "other"] ?? 0) + 1;
  }
  return counts;
}

function balancePanceContent(
  seated: readonly BankItem[],
  pool: readonly BankItem[],
  limit: number
): BankItem[] {
  const out = seated.slice(0, Math.max(0, limit));
  if (out.length === 0) return out;
  const targets = panceContentTargets(out.length);
  const used = new Set(out.map((item) => item.id).filter((id): id is string => Boolean(id)));

  for (let guard = 0; guard < out.length * 4; guard += 1) {
    const counts = countContent(out);
    const under = CONTENT_IDS.find((id) => (counts[id] ?? 0) < (targets[id] ?? 0));
    if (!under) break;
    const over =
      CONTENT_IDS.find((id) => (counts[id] ?? 0) > (targets[id] ?? 0)) ??
      ((counts.other ?? 0) > 0 ? "other" : null);
    if (!over) break;
    const dropIndex = out.findIndex((item) => (panceItemContentId(item) ?? "other") === over);
    if (dropIndex < 0) break;
    const dropped = out[dropIndex]!;
    const replacement = pool.find((item) => {
      const id = item.id?.trim() ?? "";
      if (id && used.has(id)) return false;
      if (panceItemContentId(item) !== under) return false;
      return !out.some(
        (kept, index) => index !== dropIndex && scenariosAreNearDuplicate(kept, item)
      );
    });
    if (!replacement) break;
    if (dropped.id) used.delete(dropped.id);
    if (replacement.id) used.add(replacement.id);
    out[dropIndex] = replacement;
  }
  return out;
}

/**
 * Assemble one PANCE sitting.
 * A 300-question simulation uses only difficulty 3+ rows when that pool can fill it.
 */
export function assemblePanceSitting(
  chosen: readonly BankItem[],
  pool: readonly BankItem[],
  limit: number
): BankItem[] {
  const length = Math.max(0, Math.floor(limit) || 0);
  const applyFloor =
    length >= PANCE_FULL_QUESTION_COUNT &&
    panceDifficultyPoolReport(pool).floorCanFillFullExam;
  const source = applyFloor ? pool.filter(meetsDifficultyFloor) : pool;
  const preferred = applyFloor ? chosen.filter(meetsDifficultyFloor) : chosen;
  const unique = replaceSimilarScenarios(preferred, source, length);
  return balancePanceContent(unique, source, length);
}
