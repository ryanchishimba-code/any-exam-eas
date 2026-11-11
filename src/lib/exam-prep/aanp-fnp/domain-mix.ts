/**
 * NPCB domain mix for one assembled AANP FNP sitting.
 * Official scored weights: Assess 43, Diagnose 36, Plan 36, Evaluate 20 of 135.
 */
import { blueprintCategoryIdForQuestion } from "@/lib/inventory/blueprint-domain-pool";
import type { BankItem } from "@/lib/question-bank";
import { replaceSimilarScenarios, scenariosAreNearDuplicate } from "./scenario-similarity";
import {
  AANP_FNP_DOMAIN_WEIGHTS,
  type AanpFnpDomainId,
} from "./types";

export const AANP_FNP_DOMAIN_IDS = ["assess", "diagnose", "plan", "evaluate"] as const;

/** Item counts on a 135-question scored form. 43/135 is 32%, 36/135 is 27%, 20/135 is 15%. */
export const AANP_FNP_FULL_DOMAIN_TARGETS: Record<AanpFnpDomainId, number> = {
  assess: 43,
  diagnose: 36,
  plan: 36,
  evaluate: 20,
};

export function aanpFnpDomainTargets(limit: number): Record<AanpFnpDomainId, number> {
  const length = Math.max(0, Math.floor(limit) || 0);
  if (length === 135) return { ...AANP_FNP_FULL_DOMAIN_TARGETS };
  const rows = AANP_FNP_DOMAIN_IDS.map((id) => ({
    id,
    exact: length * AANP_FNP_DOMAIN_WEIGHTS[id],
    count: Math.floor(length * AANP_FNP_DOMAIN_WEIGHTS[id]),
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
  return {
    assess: rows.find((row) => row.id === "assess")?.count ?? 0,
    diagnose: rows.find((row) => row.id === "diagnose")?.count ?? 0,
    plan: rows.find((row) => row.id === "plan")?.count ?? 0,
    evaluate: rows.find((row) => row.id === "evaluate")?.count ?? 0,
  };
}

function textField(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function aanpFnpItemDomain(item: BankItem): AanpFnpDomainId | null {
  const explicit = textField(item.blueprintDomain).toLowerCase();
  if ((AANP_FNP_DOMAIN_IDS as readonly string[]).includes(explicit)) {
    return explicit as AanpFnpDomainId;
  }
  const clientNeeds = textField(item.clientNeedsCategory) || null;
  const area = blueprintCategoryIdForQuestion("aanp-fnp", {
    subjectId: textField(item.subjectId) || undefined,
    clientNeeds,
  });
  if (area && (AANP_FNP_DOMAIN_IDS as readonly string[]).includes(area)) {
    return area as AanpFnpDomainId;
  }
  return null;
}

export function countAanpFnpDomains(
  items: readonly BankItem[]
): Record<AanpFnpDomainId | "other", number> {
  const counts: Record<AanpFnpDomainId | "other", number> = {
    assess: 0,
    diagnose: 0,
    plan: 0,
    evaluate: 0,
    other: 0,
  };
  for (const item of items) {
    const domain = aanpFnpItemDomain(item);
    counts[domain ?? "other"] += 1;
  }
  return counts;
}

function domainOf(item: BankItem): AanpFnpDomainId | "other" {
  return aanpFnpItemDomain(item) ?? "other";
}

/**
 * Swap rows until the sitting is as close as the pool allows to the NPCB mix.
 * A swap is skipped when it would repeat a scenario already in the sitting.
 */
export function balanceAanpFnpDomains(
  seated: readonly BankItem[],
  pool: readonly BankItem[],
  limit: number
): BankItem[] {
  const out = seated.slice(0, Math.max(0, limit));
  if (out.length === 0) return out;
  const targets = aanpFnpDomainTargets(out.length);
  const used = new Set(out.map((item) => item.id).filter((id): id is string => Boolean(id)));

  for (let guard = 0; guard < out.length * 4; guard += 1) {
    const counts = countAanpFnpDomains(out);
    const under = AANP_FNP_DOMAIN_IDS.find((id) => counts[id] < targets[id]);
    if (!under) break;
    const over =
      AANP_FNP_DOMAIN_IDS.find((id) => counts[id] > targets[id]) ??
      (counts.other > 0 ? "other" : null);
    if (!over) break;
    const dropIndex = out.findIndex((item) => domainOf(item) === over);
    if (dropIndex < 0) break;
    const dropped = out[dropIndex]!;
    const replacement = pool.find((item) => {
      const id = item.id?.trim() ?? "";
      if (id && used.has(id)) return false;
      if (aanpFnpItemDomain(item) !== under) return false;
      return !out.some((kept, index) => index !== dropIndex && scenariosAreNearDuplicate(kept, item));
    });
    if (!replacement) break;
    if (dropped.id) used.delete(dropped.id);
    if (replacement.id) used.add(replacement.id);
    out[dropIndex] = replacement;
  }
  return out;
}

/**
 * Assemble one AANP FNP sitting: no repeated scenario, then the NPCB domain mix.
 */
export function assembleAanpFnpSitting(
  chosen: readonly BankItem[],
  pool: readonly BankItem[],
  limit: number
): BankItem[] {
  const unique = replaceSimilarScenarios(chosen, pool, limit);
  return balanceAanpFnpDomains(unique, pool, limit);
}
