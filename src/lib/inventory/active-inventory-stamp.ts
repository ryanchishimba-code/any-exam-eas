/**
 * Published-inventory stamp.
 *
 * Page reads use the row written by the sync-question-bank cron. The live
 * COUNT/MAX below is that refresh, not a request path. It uses the same serve
 * filter as `queryActiveInventoryRows` in `active-questions.ts`: active,
 * qaPassed, inventory fields, and no legacy Step 3 rows on Step 2. A retire
 * drops `published`. An edit of a still-published row moves `touchedAt`.
 * Draft-only edits stay out of the filter, so they do not rebuild the snapshot.
 */
import { cacheGetOrSet, cacheKey, type CacheResilienceOptions } from "@/lib/cache";
import { sqlQuery } from "@/lib/db";
import { BANK_COUNTS_QUERY_TIMEOUT_MS } from "@/lib/inventory/active-inventory-cache";
import { INVENTORY_FIELD_IDS } from "@/lib/inventory/active-questions";
import { studentEligibleAndSql } from "@/lib/exam-prep/student-eligibility-sql";

export type ActiveInventoryStamp = {
  /** Rows the Qbank and marketing count as active. */
  published: number;
  /** Latest updatedAt among those rows. Null when none are published. */
  touchedAt: string | null;
};

export function activeInventoryStampKey(stamp: ActiveInventoryStamp): string {
  return `${stamp.published}:${stamp.touchedAt ?? "none"}`;
}

export function normalizeActiveInventoryStampRow(row: {
  published?: unknown;
  touchedAt?: unknown;
} | null | undefined): ActiveInventoryStamp {
  const publishedRaw = row?.published;
  const published =
    typeof publishedRaw === "number"
      ? publishedRaw
      : typeof publishedRaw === "bigint"
        ? Number(publishedRaw)
        : Number(publishedRaw ?? 0);
  return {
    published: Number.isFinite(published) ? Math.max(0, Math.floor(published)) : 0,
    touchedAt: normalizeTouchedAt(row?.touchedAt),
  };
}

function normalizeTouchedAt(value: unknown): string | null {
  if (value == null) return null;
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value.toISOString();
  }
  if (typeof value === "string") {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? value : parsed.toISOString();
  }
  return null;
}

/**
 * Stamp key, or null when the lookup fails.
 * Callers should skip their own cache on null and read the stored counts.
 * A null stamp must not fall through to the live group-by.
 */
export async function readActiveInventoryStampKey(): Promise<string | null> {
  try {
    return activeInventoryStampKey(await fetchActiveInventoryStamp());
  } catch (error) {
    console.error("[inventory] stamp lookup failed:", error);
    return null;
  }
}

/** Same serve filter as `ACTIVE_INVENTORY_ROWS_SQL`. Only the cron refresh runs this. */
export const ACTIVE_INVENTORY_STAMP_SQL = `
    SELECT
      COUNT(*)::int AS published,
      MAX("updatedAt") AS "touchedAt"
    FROM "QuestionBankItem"
    WHERE active = true
      AND "qaPassed" = true
      AND "fieldId" IN (
        'nursing',
        'usmle-step-1',
        'usmle-step-2',
        'usmle-step-3',
        'pharmacy',
        'pance',
        'aanp-fnp',
        'npte-pt'
      )
      AND NOT ("fieldId" = 'usmle-step-2' AND "stepLevel" = 'step3')
      ${studentEligibleAndSql()}
    `;

/** Live published count. Page reads use the stored stamp instead. */
export async function queryLiveActiveInventoryStamp(
  timeoutMs = BANK_COUNTS_QUERY_TIMEOUT_MS
): Promise<ActiveInventoryStamp> {
  const rows = await sqlQuery(ACTIVE_INVENTORY_STAMP_SQL, [], { timeoutMs });
  const row = Array.isArray(rows) ? rows[0] : null;
  return normalizeActiveInventoryStampRow(
    row as { published?: unknown; touchedAt?: unknown } | null
  );
}

/**
 * Stored stamp written by the question-bank sync cron.
 * Missing or failed reads throw so the caller skips the cache instead of
 * scanning QuestionBankItem.
 */
export async function fetchActiveInventoryStamp(): Promise<ActiveInventoryStamp> {
  const { readStoredActiveInventoryStamp } = await import("./stored-active-inventory");
  const stored = await readStoredActiveInventoryStamp();
  if (!stored) throw new Error("stored inventory stamp unavailable");
  return stored;
}

/**
 * Redis/L1 cache whose key includes the published stamp.
 * A retire misses the previous entry without a cron purge. A failed stamp
 * skips the cache and reads the database.
 */
export async function cacheAsidePublishedStamp<T>(
  keyParts: readonly string[],
  ttlMs: number,
  factory: () => Promise<T>,
  options?: CacheResilienceOptions
): Promise<T> {
  const stamp = await readActiveInventoryStampKey();
  if (!stamp) return factory();
  return cacheGetOrSet(cacheKey([...keyParts, stamp]), ttlMs, factory, options);
}

/** Guard so the stamp SQL stays aligned with the inventory field list. */
export function activeInventoryStampCoversFields(source: string): boolean {
  return INVENTORY_FIELD_IDS.every((fieldId) => source.includes(`'${fieldId}'`));
}
