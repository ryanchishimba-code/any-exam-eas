/**
 * Short-lived snapshot of the served bank for one field.
 *
 * The gate matches student-facing counts: active, qaPassed, and
 * `studentEligibleAndSql()` (that predicate already drops code-hidden ids).
 * NGN and SATA rows stay in the groups. A new blueprint category is included
 * because the category list is `getExamBlueprint`, not a written domain table.
 * The cache expires in a minute and shares the inventory tag, so a purge
 * drops it immediately.
 */

import { unstable_cache } from "next/cache";
import { studentEligibleAndSql } from "@/lib/exam-prep/student-eligibility-sql";
import { getExamBlueprint } from "@/lib/engine/blueprints";
import { blueprintCategoryIdForQuestion } from "@/lib/inventory/blueprint-domain-pool";
import { ACTIVE_INVENTORY_CACHE_TAG } from "@/lib/inventory/active-inventory-cache";
import { sqlQuery } from "@/lib/db";
import {
  buildServedBankStatsFromCounts,
  type ServedBankCountRow,
  type ServedBankStats,
} from "@/lib/learning/served-bank-stats";

/** Long enough to skip a repeat dashboard read, short enough that a hide or add shows up quickly. */
export const PRACTICE_BANK_STATS_REVALIDATE_SECONDS = 60;

export const PRACTICE_BANK_STATS_CACHE_KEY = "practice-bank-stats-v1";

type BankGroupRow = {
  subjectId: string | null;
  clientNeeds: string | null;
  blueprintDomain: string | null;
  difficulty: number | string | null;
  count: number | string;
};

function domainIdForGroup(fieldId: string, row: BankGroupRow): string | null {
  const explicit = row.blueprintDomain?.trim();
  if (explicit) {
    const fromDomain = blueprintCategoryIdForQuestion(fieldId, {
      subjectId: explicit,
      clientNeeds: explicit,
    });
    if (fromDomain) return fromDomain;
  }
  return blueprintCategoryIdForQuestion(fieldId, {
    subjectId: row.subjectId,
    clientNeeds: row.clientNeeds,
  });
}

export async function loadPracticeBankStats(fieldId: string): Promise<ServedBankStats | null> {
  const blueprint = getExamBlueprint(fieldId);
  if (!blueprint) return null;
  const stepGuard =
    fieldId === "usmle-step-2"
      ? `AND ("stepLevel" IS NULL OR "stepLevel" <> 'step3')`
      : "";
  const rows = (await sqlQuery(
    `
    SELECT
      COALESCE("subjectId", '') AS "subjectId",
      COALESCE(NULLIF(BTRIM("clientNeeds"), ''), '') AS "clientNeeds",
      COALESCE(NULLIF(BTRIM("blueprintDomain"), ''), '') AS "blueprintDomain",
      difficulty,
      COUNT(*)::int AS count
    FROM "QuestionBankItem"
    WHERE "fieldId" = $1
      AND active = true
      AND "qaPassed" = true
      ${stepGuard}
      ${studentEligibleAndSql()}
    GROUP BY 1, 2, 3, 4
    `,
    [fieldId],
    { timeoutMs: 8_000 }
  )) as BankGroupRow[];

  const grouped: ServedBankCountRow[] = rows.map((row) => {
    const difficulty =
      row.difficulty == null || row.difficulty === "" ? null : Number(row.difficulty);
    return {
      domainId: domainIdForGroup(fieldId, row),
      difficulty: Number.isFinite(difficulty) ? difficulty : null,
      count: Math.max(0, Math.floor(Number(row.count)) || 0),
    };
  });

  return buildServedBankStatsFromCounts({
    categories: blueprint.categories.map((category) => ({
      id: category.id,
      label: category.label,
      blueprintWeightPct: Math.round(category.weight * 1000) / 10,
    })),
    rows: grouped,
  });
}

export async function getCachedPracticeBankStats(fieldId: string): Promise<ServedBankStats | null> {
  const id = fieldId.trim();
  if (!id || !getExamBlueprint(id)) return null;
  try {
    return await unstable_cache(
      () => loadPracticeBankStats(id),
      [PRACTICE_BANK_STATS_CACHE_KEY, id],
      {
        revalidate: PRACTICE_BANK_STATS_REVALIDATE_SECONDS,
        tags: [ACTIVE_INVENTORY_CACHE_TAG],
      }
    )();
  } catch (error) {
    console.warn(
      "[practice-bank] served snapshot unavailable:",
      error instanceof Error ? error.message : error
    );
    return null;
  }
}
