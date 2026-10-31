/**
 * One public question-count read.
 *
 * The filter is the question picker's student-serving gate: active,
 * qaPassed, and STUDENT_ELIGIBLE_SQL (that predicate already drops
 * code-level hidden ids). Published NGN catalog rows are not bank rows,
 * so they are loaded beside this count and are not added to it.
 * Both reads are cached for at most an hour. A later hide or insert shows
 * up on the next fill without waiting for the stored snapshot.
 */
import { unstable_cache } from "next/cache";
import { USMLE_FIELD_IDS } from "@/lib/exam-prep/usmle/steps";
import {
  aggregateActiveInventory,
  emptyActiveInventory,
  normalizeDbInventoryRow,
  queryActiveInventoryRows,
  type ActiveQuestionInventory,
} from "@/lib/inventory/active-questions";
import { ACTIVE_INVENTORY_CACHE_TAG } from "@/lib/inventory/active-inventory-cache";
import { classifyQuestionFormat, emptyFormatCounts } from "@/lib/inventory/question-format";
import {
  COUNT_BOARD_SLUGS,
  loadClinicalExtrasByBoard,
  type ClinicalQuestionExtra,
  type CountBoardSlug,
} from "@/lib/counts";
import type { LiveBoardQuestionCounts } from "@/lib/marketing/live-board-counts";

/** Same ceiling as the board-page count. */
export const SERVED_QUESTION_COUNT_REVALIDATE_SECONDS = 60 * 60;

const BOARD_FIELDS: Record<CountBoardSlug, readonly string[]> = {
  nclex: ["nursing"],
  usmle: USMLE_FIELD_IDS,
  naplex: ["pharmacy"],
  pance: ["pance"],
  "aanp-fnp": ["aanp-fnp"],
  "npte-pt": ["npte-pt"],
};

export type ServedQuestionCounts = {
  /** Subject-level gate when the grouped read finishes. Null when it does not. */
  inventory: ActiveQuestionInventory | null;
  /** Field totals from the same gate. Null only when that read fails too. */
  live: LiveBoardQuestionCounts | null;
  clinical: Partial<Record<CountBoardSlug, ClinicalQuestionExtra>>;
};

/** Field and board totals from the served-gate query. Topic rows are left empty. */
export function inventoryFromLiveFieldCounts(live: LiveBoardQuestionCounts): ActiveQuestionInventory {
  const inventory = emptyActiveInventory(false);
  for (const [fieldId, count] of Object.entries(live.byField)) {
    const field = inventory.fields[fieldId];
    if (!field) continue;
    field.active = count;
    const formats = emptyFormatCounts();
    for (const [itemType, itemCount] of Object.entries(live.itemTypesByField[fieldId] ?? {})) {
      formats[classifyQuestionFormat(itemType)] += itemCount;
    }
    field.formats = formats;
  }
  for (const slug of COUNT_BOARD_SLUGS) {
    const board = inventory.boards[slug];
    if (!board) continue;
    const formats = emptyFormatCounts();
    let active = 0;
    for (const fieldId of BOARD_FIELDS[slug]) {
      const field = inventory.fields[fieldId];
      if (!field) continue;
      active += field.active;
      formats.mcq += field.formats.mcq;
      formats.ngn += field.formats.ngn;
      formats.case += field.formats.case;
    }
    board.active = active;
    board.formats = formats;
  }
  return inventory;
}

/**
 * Replace stored bank totals with the live served-gate totals.
 * Topic and category rows stay in place when the stored snapshot has them.
 */
export function applyServedFieldCounts(
  inventory: ActiveQuestionInventory,
  live: LiveBoardQuestionCounts
): ActiveQuestionInventory {
  for (const [fieldId, count] of Object.entries(live.byField)) {
    const field = inventory.fields[fieldId];
    if (!field) continue;
    field.active = count;
    const formats = emptyFormatCounts();
    for (const [itemType, itemCount] of Object.entries(live.itemTypesByField[fieldId] ?? {})) {
      formats[classifyQuestionFormat(itemType)] += itemCount;
    }
    if (formats.mcq + formats.ngn + formats.case > 0) field.formats = formats;
  }
  for (const slug of COUNT_BOARD_SLUGS) {
    const board = inventory.boards[slug];
    if (!board) continue;
    let active = 0;
    const formats = emptyFormatCounts();
    for (const fieldId of BOARD_FIELDS[slug]) {
      const field = inventory.fields[fieldId];
      if (!field) continue;
      active += field.active;
      formats.mcq += field.formats.mcq;
      formats.ngn += field.formats.ngn;
      formats.case += field.formats.case;
    }
    if (active > 0) {
      board.active = active;
      if (formats.mcq + formats.ngn + formats.case > 0) board.formats = formats;
    }
  }
  return inventory;
}

async function readGroupedServedInventory(): Promise<ActiveQuestionInventory | null> {
  try {
    const { LIVE_BOARD_COUNT_QUERY_TIMEOUT_MS } = await import("@/lib/marketing/live-board-counts");
    const rows = await queryActiveInventoryRows(LIVE_BOARD_COUNT_QUERY_TIMEOUT_MS);
    const inventory = aggregateActiveInventory(rows.map((row) => normalizeDbInventoryRow(row)));
    const total = Object.values(inventory.boards).reduce((sum, board) => sum + board.active, 0);
    return total > 0 ? inventory : null;
  } catch (error) {
    console.error("[served-question-counts] grouped count failed:", error);
    return null;
  }
}

let readCachedClinicalExtras: (() => Promise<Partial<Record<CountBoardSlug, ClinicalQuestionExtra>>>) | null =
  null;

function clinicalExtrasReader() {
  readCachedClinicalExtras ??= unstable_cache(
    async () => loadClinicalExtrasByBoard(),
    ["served-clinical-extras-v1"],
    {
      revalidate: SERVED_QUESTION_COUNT_REVALIDATE_SECONDS,
      tags: [ACTIVE_INVENTORY_CACHE_TAG],
    }
  );
  return readCachedClinicalExtras;
}

/**
 * Live served-gate field counts plus the published NGN catalog.
 * The bank read is the same hourly cache the board pages already use.
 * A failed catalog read returns no extras so the bank total can still publish.
 */
export async function loadServedQuestionCounts(): Promise<ServedQuestionCounts> {
  const { loadLiveBoardQuestionCounts } = await import("@/lib/marketing/live-board-counts");
  const [inventory, clinical] = await Promise.all([
    readGroupedServedInventory(),
    clinicalExtrasReader()().catch((error: unknown) => {
      console.error("[served-question-counts] clinical catalog failed:", error);
      return {} as Partial<Record<CountBoardSlug, ClinicalQuestionExtra>>;
    }),
  ]);
  const live = inventory ? null : await loadLiveBoardQuestionCounts();
  return { inventory, live, clinical };
}
