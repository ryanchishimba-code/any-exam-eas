/**
 * Precomputed active-question groups.
 *
 * The live group-by parses option JSON on every QuestionBankItem row and
 * exceeds the 5s statement timeout. The sync-question-bank cron runs that
 * query once and writes the groups here. Page reads are a scan of this
 * small table. The write is a short transaction on these tables only — it
 * does not lock QuestionBankItem.
 */
import { getSql, sqlQuery } from "@/lib/db";
import {
  aggregateActiveInventory,
  normalizeDbInventoryRow,
  queryActiveInventoryRows,
  type ActiveInventoryRow,
  type ActiveQuestionInventory,
} from "@/lib/inventory/active-questions";
import {
  normalizeActiveInventoryStampRow,
  queryLiveActiveInventoryStamp,
  type ActiveInventoryStamp,
} from "@/lib/inventory/active-inventory-stamp";

/** Live scan budget for the cron. Page reads do not use this. */
export const ACTIVE_INVENTORY_REFRESH_TIMEOUT_MS = 180_000;

export type ActiveInventoryRefreshResult = {
  ok: boolean;
  published: number;
  grouped: number;
  fieldCounts: Record<string, number>;
  error?: string;
};

type StoredStampRow = {
  published?: unknown;
  touchedAt?: unknown;
  refreshedAt?: unknown;
};

function isMissingRelation(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  if ((error as { code?: string }).code === "42P01") return true;
  const message = error instanceof Error ? error.message : String(error);
  return /ActiveInventory(Count|StampRow)/.test(message) && /does not exist/i.test(message);
}

function fieldCountsFromRows(rows: ActiveInventoryRow[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const row of rows) {
    counts[row.fieldId] = (counts[row.fieldId] ?? 0) + row.count;
  }
  return counts;
}

export function groupedTotal(rows: readonly { count: number }[]): number {
  return rows.reduce((sum, row) => sum + (Number.isFinite(row.count) ? row.count : 0), 0);
}

/** True when the live group-by and the live stamp counted the same rows. */
export function storedCountsMatchStamp(
  grouped: number,
  stamp: Pick<ActiveInventoryStamp, "published">
): boolean {
  return grouped === stamp.published;
}

export async function readStoredActiveInventoryStamp(): Promise<
  (ActiveInventoryStamp & { refreshedAt: string | null }) | null
> {
  try {
    const rows = await sqlQuery<StoredStampRow[]>(
      `
      SELECT "published", "touchedAt", "refreshedAt"
      FROM "ActiveInventoryStampRow"
      WHERE "id" = 1
      `,
      [],
      { timeoutMs: 5_000 }
    );
    const row = Array.isArray(rows) ? rows[0] : null;
    if (!row) return null;
    const stamp = normalizeActiveInventoryStampRow(row);
    return { ...stamp, refreshedAt: refreshedAtIso(row.refreshedAt) };
  } catch (error) {
    if (isMissingRelation(error)) return null;
    throw error;
  }
}

function refreshedAtIso(value: unknown): string | null {
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

export async function readStoredActiveInventory(): Promise<ActiveQuestionInventory | null> {
  const stamp = await readStoredActiveInventoryStamp();
  if (!stamp) return null;
  const rows = await sqlQuery(
    `
    SELECT
      "fieldId",
      NULLIF("subjectId", '') AS "subjectId",
      NULLIF("clientNeeds", '') AS "clientNeeds",
      "itemType",
      false AS "hasCaseGroup",
      "count"
    FROM "ActiveInventoryCount"
    `,
    [],
    { timeoutMs: 5_000 }
  );
  const inventory = aggregateActiveInventory(
    (Array.isArray(rows) ? rows : []).map((row) =>
      normalizeDbInventoryRow(row as Parameters<typeof normalizeDbInventoryRow>[0])
    )
  );
  if (stamp.refreshedAt) inventory.updatedAt = stamp.refreshedAt;
  return inventory;
}

type NeonTxn = {
  (strings: TemplateStringsArray, ...values: unknown[]): unknown;
  query: (text: string, params?: unknown[]) => unknown;
};

async function writeStoredInventory(
  rows: ActiveInventoryRow[],
  stamp: ActiveInventoryStamp
): Promise<void> {
  const client = getSql() as unknown as {
    transaction: (
      fn: (txn: NeonTxn) => unknown[],
      opts?: { fetchOptions?: { signal?: AbortSignal } }
    ) => Promise<unknown[]>;
  };
  const payload = JSON.stringify(
    rows.map((row) => ({
      field_id: row.fieldId,
      subject_id: row.subjectId ?? "",
      client_needs: row.clientNeeds ?? "",
      item_type: row.itemType ?? "mcq",
      count: row.count,
    }))
  );
  await client.transaction(
    (txn) => [
      txn`SELECT set_config('statement_timeout', ${"15000"}, true)`,
      txn`DELETE FROM "ActiveInventoryCount"`,
      txn.query(
        `
        INSERT INTO "ActiveInventoryCount"
          ("fieldId", "subjectId", "clientNeeds", "itemType", "count", "refreshedAt")
        SELECT
          r.field_id,
          COALESCE(r.subject_id, ''),
          COALESCE(r.client_needs, ''),
          COALESCE(NULLIF(r.item_type, ''), 'mcq'),
          r.count,
          NOW()
        FROM jsonb_to_recordset($1::jsonb) AS r(
          field_id text,
          subject_id text,
          client_needs text,
          item_type text,
          count int
        )
        `,
        [payload]
      ),
      txn.query(
        `
        INSERT INTO "ActiveInventoryStampRow" ("id", "published", "touchedAt", "refreshedAt")
        VALUES (1, $1, $2::timestamptz, NOW())
        ON CONFLICT ("id") DO UPDATE SET
          "published" = EXCLUDED."published",
          "touchedAt" = EXCLUDED."touchedAt",
          "refreshedAt" = EXCLUDED."refreshedAt"
        `,
        [stamp.published, stamp.touchedAt]
      ),
    ],
    { fetchOptions: { signal: AbortSignal.timeout(20_000) } }
  );
}

/**
 * Recompute the live groups and replace the stored snapshot.
 * A mismatch leaves the previous snapshot in place.
 */
export async function refreshActiveInventoryCounts(): Promise<ActiveInventoryRefreshResult> {
  const dbRows = await queryActiveInventoryRows(ACTIVE_INVENTORY_REFRESH_TIMEOUT_MS);
  const rows = dbRows.map((row) => normalizeDbInventoryRow(row));
  const stamp = await queryLiveActiveInventoryStamp(ACTIVE_INVENTORY_REFRESH_TIMEOUT_MS);
  const grouped = groupedTotal(rows);
  const fieldCounts = fieldCountsFromRows(rows);
  if (!storedCountsMatchStamp(grouped, stamp)) {
    const error = `stored inventory refresh mismatch: grouped ${grouped} published ${stamp.published}`;
    console.error(`[inventory] ${error}`);
    return { ok: false, published: stamp.published, grouped, fieldCounts, error };
  }
  await writeStoredInventory(rows, stamp);
  return { ok: true, published: stamp.published, grouped, fieldCounts };
}
