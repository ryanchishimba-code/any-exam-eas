import { unstable_cache } from "next/cache";
import { sqlQuery } from "@/lib/db";
import { ACTIVE_INVENTORY_CACHE_TAG } from "@/lib/inventory/active-inventory-cache";

type TypeCountRow = { itemType: string | null; count: number | string };

/**
 * Sum stored active-inventory groups for one field.
 * The table is the same source the question-bank counts already use.
 * A failed read returns an empty map so the page can omit type cards.
 */
export function sumBankTypeCounts(rows: readonly TypeCountRow[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const row of rows) {
    const key = (row.itemType ?? "").trim().toLowerCase();
    const count = typeof row.count === "number" ? row.count : Number(row.count);
    if (!key || !Number.isFinite(count) || count <= 0) continue;
    counts[key] = (counts[key] ?? 0) + Math.floor(count);
  }
  return counts;
}

async function readNursingBankTypeCounts(): Promise<Record<string, number>> {
  try {
    const rows = await sqlQuery<TypeCountRow[]>(
      `
      SELECT "itemType", SUM("count")::int AS count
      FROM "ActiveInventoryCount"
      WHERE "fieldId" = 'nursing'
      GROUP BY 1
      `,
      [],
      { timeoutMs: 5_000 }
    );
    return sumBankTypeCounts(Array.isArray(rows) ? rows : []);
  } catch {
    return {};
  }
}

const loadCachedNursingBankTypeCounts = unstable_cache(
  readNursingBankTypeCounts,
  ["nclex-landing-bank-types-v1"],
  { revalidate: 300, tags: [ACTIVE_INVENTORY_CACHE_TAG] }
);

/** Live nursing item-type counts. Empty when the stored groups cannot be read. */
export async function loadNursingBankTypeCounts(): Promise<Record<string, number>> {
  try {
    return await loadCachedNursingBankTypeCounts();
  } catch {
    return {};
  }
}
