/**
 * Scored totals for the six board pages.
 *
 * Those pages used to print ActiveInventoryCount, the snapshot the
 * sync-question-bank cron writes. That row lags QuestionBankItem (PANCE stayed
 * at 2,856 after the bank reached 3,276). This read counts active, qaPassed
 * rows and caches the result for an hour. It does not parse option JSON, and
 * it does not write. ISR pages call it from `unstable_cache` only, so the
 * route stays static.
 */
import { unstable_cache } from "next/cache";
import {
  boardQuestionUnits,
  scoredQuestionCount,
  type BoardQuestionUnits,
  type CountBoardSlug,
} from "@/lib/counts";
import { sqlQuery } from "@/lib/db";
import { USMLE_FIELD_IDS } from "@/lib/exam-prep/usmle/steps";
import {
  ACTIVE_INVENTORY_CACHE_TAG,
  BANK_COUNTS_QUERY_TIMEOUT_MS,
} from "@/lib/inventory/active-inventory-cache";
import { INVENTORY_FIELD_IDS } from "@/lib/inventory/active-questions";

/** Hourly is enough for public copy and keeps ISR off a per-request bank scan. */
export const LIVE_BOARD_COUNT_REVALIDATE_SECONDS = 60 * 60;

const INVENTORY_FIELD_SET = new Set<string>(INVENTORY_FIELD_IDS);

const BOARD_COUNT_FIELDS: Record<CountBoardSlug, readonly string[]> = {
  nclex: ["nursing"],
  usmle: USMLE_FIELD_IDS,
  naplex: ["pharmacy"],
  pance: ["pance"],
  "aanp-fnp": ["aanp-fnp"],
  "npte-pt": ["npte-pt"],
};

export const LIVE_BOARD_COUNT_SQL = `
    SELECT
      "fieldId",
      COALESCE(NULLIF(BTRIM("itemType"), ''), 'mcq') AS "itemType",
      COUNT(*)::int AS count
    FROM "QuestionBankItem"
    WHERE active = true
      AND "qaPassed" = true
      AND "fieldId" IN (${INVENTORY_FIELD_IDS.map((fieldId) => `'${fieldId}'`).join(", ")})
    GROUP BY 1, 2
    `;

export type LiveBoardQuestionCounts = {
  byField: Record<string, number>;
  itemTypesByField: Record<string, Record<string, number>>;
};

type LiveCountRow = {
  fieldId?: unknown;
  itemType?: unknown;
  count?: unknown;
};

export function liveBoardQuestionCountsFromRows(
  rows: readonly LiveCountRow[]
): LiveBoardQuestionCounts {
  const byField: Record<string, number> = {};
  const itemTypesByField: Record<string, Record<string, number>> = {};
  for (const row of rows) {
    const fieldId = typeof row.fieldId === "string" ? row.fieldId : "";
    if (!INVENTORY_FIELD_SET.has(fieldId)) continue;
    const raw = typeof row.count === "number" ? row.count : Number(row.count);
    if (!Number.isFinite(raw) || raw <= 0) continue;
    const count = Math.floor(raw);
    byField[fieldId] = (byField[fieldId] ?? 0) + count;
    const itemType =
      (typeof row.itemType === "string" ? row.itemType : "mcq").trim().toLowerCase() || "mcq";
    const types = itemTypesByField[fieldId] ?? {};
    types[itemType] = (types[itemType] ?? 0) + count;
    itemTypesByField[fieldId] = types;
  }
  return { byField, itemTypesByField };
}

export function liveBoardCountTotal(counts: LiveBoardQuestionCounts): number {
  return Object.values(counts.byField).reduce((sum, count) => sum + count, 0);
}

/** QuestionBankItem rows for one board. USMLE is Step 1 + Step 2 CK + Step 3. */
export function liveBankItemCount(counts: LiveBoardQuestionCounts, slug: CountBoardSlug): number {
  return BOARD_COUNT_FIELDS[slug].reduce((sum, fieldId) => sum + (counts.byField[fieldId] ?? 0), 0);
}

export function liveUsmleStepCounts(
  counts: LiveBoardQuestionCounts | null
): { step1: number; step2: number; step3: number } | null {
  if (!counts) return null;
  const step1 = counts.byField["usmle-step-1"] ?? 0;
  const step2 = counts.byField["usmle-step-2"] ?? 0;
  const step3 = counts.byField["usmle-step-3"] ?? 0;
  if (step1 + step2 + step3 <= 0) return null;
  return { step1, step2, step3 };
}

/**
 * Replace the bank-item total and keep published NGN catalog extras.
 * Those extras are not QuestionBankItem rows, so the NCLEX "including …"
 * clause stays in place.
 */
export function applyLiveBankItemCount(
  units: BoardQuestionUnits,
  liveBankItems: number
): BoardQuestionUnits {
  const bankItems = Math.max(0, Math.floor(liveBankItems));
  const standaloneMcq = units.standaloneMcq + (bankItems - units.bankItems);
  if (standaloneMcq >= 0) return { ...units, bankItems, standaloneMcq };
  return { ...units, bankItems };
}

export function boardPageQuestionUnits(input: {
  slug: CountBoardSlug;
  snapshotUnits: BoardQuestionUnits | null;
  live: LiveBoardQuestionCounts | null;
}): BoardQuestionUnits | null {
  const liveBank = input.live ? liveBankItemCount(input.live, input.slug) : 0;
  if (liveBank > 0) {
    if (input.snapshotUnits) return applyLiveBankItemCount(input.snapshotUnits, liveBank);
    return boardQuestionUnits({
      slug: input.slug,
      bankItems: liveBank,
      formats: { mcq: liveBank, ngn: 0, case: 0 },
    });
  }
  if (!input.snapshotUnits || scoredQuestionCount(input.snapshotUnits) <= 0) return null;
  return input.snapshotUnits;
}

async function readLiveBoardQuestionCounts(): Promise<LiveBoardQuestionCounts> {
  const rows = await sqlQuery<LiveCountRow[]>(LIVE_BOARD_COUNT_SQL, [], {
    timeoutMs: BANK_COUNTS_QUERY_TIMEOUT_MS,
  });
  const counts = liveBoardQuestionCountsFromRows(Array.isArray(rows) ? rows : []);
  if (liveBoardCountTotal(counts) <= 0) {
    throw new Error("live board counts unavailable");
  }
  return counts;
}

const readCachedLiveBoardQuestionCounts = unstable_cache(
  readLiveBoardQuestionCounts,
  ["live-board-question-counts-v1"],
  {
    revalidate: LIVE_BOARD_COUNT_REVALIDATE_SECONDS,
    tags: [ACTIVE_INVENTORY_CACHE_TAG],
  }
);

/** Null when the count query fails. Callers then keep the stored snapshot. */
export async function loadLiveBoardQuestionCounts(): Promise<LiveBoardQuestionCounts | null> {
  try {
    return await readCachedLiveBoardQuestionCounts();
  } catch (error) {
    console.error("[marketing] live board count lookup failed:", error);
    return null;
  }
}

export async function loadLiveItemTypes(fieldId: string): Promise<Record<string, number> | null> {
  const live = await loadLiveBoardQuestionCounts();
  const types = live?.itemTypesByField[fieldId];
  if (!types || !Object.values(types).some((count) => count > 0)) return null;
  return types;
}

export async function loadBoardPageQuestionUnits(
  slug: CountBoardSlug,
  snapshotUnits: BoardQuestionUnits | null
): Promise<BoardQuestionUnits | null> {
  const live = await loadLiveBoardQuestionCounts();
  return boardPageQuestionUnits({ slug, snapshotUnits, live });
}
