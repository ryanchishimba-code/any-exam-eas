import { unstable_cache } from "next/cache";
import { applyScoredClinicalCatalog, type ScoredClinicalApplication } from "@/lib/counts";
import { ACTIVE_INVENTORY_CACHE_TAG } from "@/lib/inventory/active-inventory-cache";
import { fieldInventoryPayload, type FormatCounts } from "@/lib/inventory/active-questions";
import {
  getCachedActiveInventory,
  getPublishedInventoryStampKey,
} from "@/lib/marketing/question-bank-counts";

const SCORED_FIELD_CACHE_TTL_SECONDS = 60 * 60;
const SCORED_FIELD_MISS = "SCORED_FIELD_MISS";

export type ScoredFieldInventory = {
  fieldId: string;
  bankTotal: number;
  formats: FormatCounts | null;
  categoryLabel: string | null;
  definition: string;
  scored: ScoredClinicalApplication;
};

/**
 * User-agnostic board totals plus published NGN counts.
 * The NGN load reads every item and case chart for the board. That work is
 * CPU on a cold function, and these pages are hit too rarely to keep an
 * isolate warm. The result is small, so it can live in the data cache.
 * The key includes the published stamp, so a new publish misses within the
 * stamp window. `question-bank-counts` drops it immediately on purge.
 * A failed catalog read is not cached.
 */
function isMiss(error: unknown): boolean {
  return error instanceof Error && error.message === SCORED_FIELD_MISS;
}

export async function getScoredFieldInventory(
  fieldId: string
): Promise<ScoredFieldInventory | null> {
  const stampKey = await getPublishedInventoryStampKey();
  if (!stampKey) {
    try {
      return await loadScoredFieldInventory(fieldId, true);
    } catch (error) {
      if (isMiss(error)) return null;
      throw error;
    }
  }

  try {
    return await unstable_cache(
      () => loadScoredFieldInventory(fieldId, false),
      ["scored-field-inventory-v1", fieldId, stampKey],
      {
        revalidate: SCORED_FIELD_CACHE_TTL_SECONDS,
        tags: [ACTIVE_INVENTORY_CACHE_TAG],
      }
    )();
  } catch (error) {
    if (isMiss(error)) return null;
    console.warn(
      "[inventory] scored field cache missed; counting without the NGN catalog:",
      error instanceof Error ? error.message : error
    );
    try {
      return await loadScoredFieldInventory(fieldId, true);
    } catch (again) {
      if (isMiss(again)) return null;
      throw again;
    }
  }
}

async function loadScoredFieldInventory(
  fieldId: string,
  allowCatalogMiss: boolean
): Promise<ScoredFieldInventory> {
  const inventory = await getCachedActiveInventory({ dynamic: false });
  if (inventory.degraded) {
    throw new Error(allowCatalogMiss ? SCORED_FIELD_MISS : "DEGRADED_INVENTORY");
  }
  const payload = fieldInventoryPayload(fieldId, inventory);
  if (!payload) throw new Error(SCORED_FIELD_MISS);

  let catalog = null;
  try {
    const { loadPublishedClinicalBank } = await import("@/lib/assessment/serve-db");
    catalog = (await loadPublishedClinicalBank(fieldId)).catalog;
  } catch (error) {
    if (!allowCatalogMiss) throw error;
    catalog = null;
  }

  return {
    fieldId,
    bankTotal: payload.total,
    formats: payload.formats,
    categoryLabel: payload.categoryLabel,
    definition: payload.definition,
    scored: applyScoredClinicalCatalog({
      fieldId,
      bankTotal: payload.total,
      topicCounts: payload.counts,
      formats: payload.formats,
      topicFormats: payload.topicFormats,
      categories: payload.categories,
      catalog,
    }),
  };
}
