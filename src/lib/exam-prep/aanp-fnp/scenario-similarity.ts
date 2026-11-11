/**
 * Near-duplicate scenarios inside one AANP FNP sitting.
 * Ages and chart noise are normalized first. Two vignettes that still
 * share most of their words are one scenario, even when a number changes.
 */
import {
  examScenarioKey,
  normalizeClinicalCaseText,
  resolveClinicalVignetteText,
} from "@/lib/exam-prep/clinical-case-dedupe";
import type { BankItem } from "@/lib/question-bank";

/** Share of words two vignettes must have in common to count as one scenario. */
export const AANP_FNP_SCENARIO_SIMILARITY = 0.82;

const MIN_SCENARIO_CHARS = 80;

function sequentialSetId(item: BankItem): string | null {
  const payload = item.ngnPayload as { kind?: string; setId?: string } | undefined;
  if (payload?.kind === "sequential" && payload.setId?.trim()) return payload.setId.trim();
  return null;
}

export function scenarioTokens(text: string): Set<string> {
  const normalized = normalizeClinicalCaseText(text);
  const tokens = normalized.split(/[^a-z0-9]+/).filter((token) => token.length > 2);
  return new Set(tokens);
}

export function tokenJaccard(left: ReadonlySet<string>, right: ReadonlySet<string>): number {
  if (left.size === 0 || right.size === 0) return 0;
  let shared = 0;
  const [smaller, larger] = left.size <= right.size ? [left, right] : [right, left];
  for (const token of smaller) {
    if (larger.has(token)) shared += 1;
  }
  const union = left.size + right.size - shared;
  return union === 0 ? 0 : shared / union;
}

export function scenarioText(item: BankItem): string {
  return normalizeClinicalCaseText(resolveClinicalVignetteText(item));
}

/** True when two served rows are the same patient story. Steps of one case stay distinct. */
export function scenariosAreNearDuplicate(a: BankItem, b: BankItem): boolean {
  const setA = sequentialSetId(a);
  const setB = sequentialSetId(b);
  if (setA && setA === setB) return false;
  if (a.id && a.id === b.id) return true;
  if (examScenarioKey(a) === examScenarioKey(b)) return true;
  const left = scenarioText(a);
  const right = scenarioText(b);
  if (left.length < MIN_SCENARIO_CHARS || right.length < MIN_SCENARIO_CHARS) return false;
  return tokenJaccard(scenarioTokens(left), scenarioTokens(right)) >= AANP_FNP_SCENARIO_SIMILARITY;
}

/**
 * One scenario per sitting. A later row that retells a vignette already
 * chosen is replaced from the pool. The result can be shorter than `limit`
 * when the pool has no unused scenario.
 */
export function replaceSimilarScenarios(
  chosen: readonly BankItem[],
  pool: readonly BankItem[],
  limit: number
): BankItem[] {
  const target = Math.max(0, Math.floor(limit) || 0);
  const out: BankItem[] = [];
  const usedIds = new Set<string>();

  const conflicts = (item: BankItem): boolean =>
    out.some((kept) => scenariosAreNearDuplicate(kept, item));

  const take = (item: BankItem): boolean => {
    const id = item.id?.trim() ?? "";
    if (id && usedIds.has(id)) return false;
    if (conflicts(item)) return false;
    if (id) usedIds.add(id);
    out.push(item);
    return true;
  };

  for (const item of chosen) {
    if (out.length >= target) break;
    take(item);
  }
  if (out.length < target) {
    for (const item of pool) {
      if (out.length >= target) break;
      take(item);
    }
  }
  return out;
}
