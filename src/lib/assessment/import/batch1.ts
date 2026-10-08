import { buildSeedPlan, type PlannedCase, type PlannedItem, type SeedPlan } from "@/lib/assessment/import/plan";
import type { NgnItem, PilotDocument, ScoringRule } from "@/lib/assessment/types";
import { SCORING_RULES } from "@/lib/assessment/types";

export const NGN_BATCH1_ID = "ngn-batch1-2026-10-08";
export const NGN_BATCH1_DOCUMENT = "content/ngn-batch1/batch1-items.json";
export const NGN_BATCH1_KEYS = "content/ngn-batch1/batch1-keys.json";
export const NGN_PUBLISH_CONFIRM_ENV = "NGN_PUBLISH_CONFIRM";

export type NgnBatchCounts = {
  batches: number;
  cases: number;
  items: number;
  manualCorrectionCases: number;
  manualCorrectionItems: number;
};

export type ExistingNgnRow = {
  id: string;
  version: number;
  manualCorrection: boolean;
};

export type Batch1Actions = {
  insertBatch: boolean;
  insertCases: PlannedCase[];
  insertItems: PlannedItem[];
  flagCases: { id: string; version: number }[];
  flagItems: { id: string; version: number }[];
  unchangedCases: number;
  unchangedItems: number;
};

type JsonRecord = Record<string, unknown>;

function asRecord(value: unknown): JsonRecord | null {
  if (value && typeof value === "object" && !Array.isArray(value)) return value as JsonRecord;
  return null;
}

function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a === null || b === null || typeof a !== "object" || typeof b !== "object") return false;
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
    return a.every((value, index) => deepEqual(value, b[index]));
  }
  const left = a as JsonRecord;
  const right = b as JsonRecord;
  const leftKeys = Object.keys(left);
  if (leftKeys.length !== Object.keys(right).length) return false;
  return leftKeys.every((key) => deepEqual(left[key], right[key]));
}

function documentItems(doc: PilotDocument): NgnItem[] {
  return [...doc.cases.flatMap((caseDoc) => caseDoc.items), ...doc.standalone];
}

function matrixRowsMatch(itemRows: unknown, keyRows: unknown, mode: "mc" | "mr"): boolean {
  if (!Array.isArray(itemRows) || !Array.isArray(keyRows) || itemRows.length !== keyRows.length) return false;
  return itemRows.every((itemRow, index) => {
    const item = asRecord(itemRow);
    const key = asRecord(keyRows[index]);
    if (!item || !key || item.id !== key.row || item.text !== key.text) return false;
    if (mode === "mr") return deepEqual(item.keys, key.keys);
    return Array.isArray(key.keys) && key.keys.length === 1 && item.key === key.keys[0];
  });
}

function dropdownsMatch(itemDropdowns: unknown, keyDropdowns: unknown): boolean {
  if (!Array.isArray(itemDropdowns) || !Array.isArray(keyDropdowns) || itemDropdowns.length !== keyDropdowns.length) {
    return false;
  }
  return itemDropdowns.every((itemDropdown, index) => {
    const item = asRecord(itemDropdown);
    const key = asRecord(keyDropdowns[index]);
    return Boolean(item && key && item.id === key.id && item.key === key.key);
  });
}

/**
 * Confirms the approved keys file describes the same stems' keys, rationales,
 * references, flags, and scoring as the pilot document. Does not rewrite either side.
 */
export function assertKeysMatchDocument(doc: PilotDocument, keysDoc: unknown): void {
  const keysRecord = asRecord(keysDoc);
  const keyItems = keysRecord && Array.isArray(keysRecord.items) ? keysRecord.items : null;
  if (!keysRecord || !keyItems) throw new Error("keys file is missing an items array");
  if (keysRecord.batchId !== doc.batchId) {
    throw new Error(`keys batch ${String(keysRecord.batchId)} does not match ${doc.batchId}`);
  }
  const items = documentItems(doc);
  const byId = new Map(items.map((item) => [item.id, item]));
  if (byId.size !== items.length) throw new Error("batch document has duplicate item ids");
  const seen = new Set<string>();
  const mismatches: string[] = [];
  for (const entry of keyItems) {
    const key = asRecord(entry);
    if (!key || typeof key.id !== "string") {
      mismatches.push("key record missing id");
      continue;
    }
    seen.add(key.id);
    const item = byId.get(key.id);
    if (!item) {
      mismatches.push(`${key.id}: missing from document`);
      continue;
    }
    const payload = item.payload;
    const rationale = asRecord(item.rationale);
    const expanded = asRecord(rationale?.expanded);
    const problems: string[] = [];
    if (item.responseFormat !== key.responseFormat) problems.push("responseFormat");
    if (item.scoringRule !== key.scoringRule) problems.push("scoringRule");
    if (item.maxPoints !== key.maxPoints) problems.push("maxPoints");
    if (!deepEqual(item.references, key.references)) problems.push("references");
    if (!deepEqual(item.rnFlags, key.rnFlags)) problems.push("rnFlags");
    if (rationale?.short !== key.rationaleShort) problems.push("rationale");
    if (!deepEqual(expanded?.perOption, key.perOption)) problems.push("perOption");
    const format = item.responseFormat;
    if (format === "highlight_text" || format === "mr_sata" || format === "mr_select_n") {
      if (!deepEqual(payload.keys, key.keys)) problems.push("keys");
    } else if (format === "dropdown_cloze" || format === "dropdown_rationale") {
      if (!dropdownsMatch(payload.dropdowns, key.dropdowns)) problems.push("dropdowns");
      if (format === "dropdown_rationale" && payload.kind !== key.kind) problems.push("kind");
    } else if (format === "matrix_mc") {
      if (!matrixRowsMatch(payload.rows, key.rows, "mc")) problems.push("rows");
    } else if (format === "matrix_mr") {
      if (!matrixRowsMatch(payload.rows, key.rows, "mr")) problems.push("rows");
    } else if (format === "bowtie") {
      for (const part of ["condition", "actions", "monitor"] as const) {
        const itemPart = asRecord(payload[part]);
        const keyPart = asRecord(key[part]);
        if (!deepEqual(itemPart?.keys, keyPart?.keys)) problems.push(part);
      }
    } else {
      problems.push("responseFormat");
    }
    if (problems.length > 0) mismatches.push(`${key.id}: ${problems.join(", ")}`);
  }
  for (const item of items) {
    if (!seen.has(item.id)) mismatches.push(`${item.id}: missing from keys`);
  }
  if (mismatches.length > 0) {
    throw new Error(
      `approved keys do not match the batch document (${mismatches.length}): ${mismatches.slice(0, 5).join("; ")}`
    );
  }
}

export function isScoringRule(value: string): value is ScoringRule {
  return (SCORING_RULES as readonly string[]).includes(value);
}

/** Empty student response used by the batch scoring self-test. */
export function emptyResponse(responseFormat: string): unknown {
  if (
    responseFormat === "mr_sata" ||
    responseFormat === "mr_select_n" ||
    responseFormat === "highlight_text"
  ) {
    return [];
  }
  if (responseFormat === "mc_single") return null;
  return {};
}

export function buildBatch1Plan(doc: PilotDocument, sha256: string): SeedPlan {
  if (doc.batchId !== NGN_BATCH1_ID) {
    throw new Error(`refusing to publish ${doc.batchId}; this script only publishes ${NGN_BATCH1_ID}`);
  }
  return buildSeedPlan(doc, sha256);
}

function rowKey(id: string, version: number): string {
  return `${id}\0${version}`;
}

/**
 * Inserts only missing id+version rows. Existing rows are never rewritten;
 * a false manual_correction flag is the only column an existing row can change.
 */
export function diffBatch1(
  plan: SeedPlan,
  existing: { batch: boolean; cases: readonly ExistingNgnRow[]; items: readonly ExistingNgnRow[] }
): Batch1Actions {
  const cases = new Map(existing.cases.map((row) => [rowKey(row.id, row.version), row]));
  const items = new Map(existing.items.map((row) => [rowKey(row.id, row.version), row]));
  const insertCases: PlannedCase[] = [];
  const flagCases: { id: string; version: number }[] = [];
  let unchangedCases = 0;
  for (const row of plan.cases) {
    const found = cases.get(rowKey(row.id, row.version));
    if (!found) insertCases.push(row);
    else if (!found.manualCorrection) flagCases.push({ id: row.id, version: row.version });
    else unchangedCases += 1;
  }
  const insertItems: PlannedItem[] = [];
  const flagItems: { id: string; version: number }[] = [];
  let unchangedItems = 0;
  for (const row of plan.items) {
    const found = items.get(rowKey(row.id, row.version));
    if (!found) insertItems.push(row);
    else if (!found.manualCorrection) flagItems.push({ id: row.id, version: row.version });
    else unchangedItems += 1;
  }
  return {
    insertBatch: !existing.batch,
    insertCases,
    insertItems,
    flagCases,
    flagItems,
    unchangedCases,
    unchangedItems,
  };
}

export function projectBatchCounts(before: NgnBatchCounts, actions: Batch1Actions): NgnBatchCounts {
  return {
    batches: before.batches + (actions.insertBatch ? 1 : 0),
    cases: before.cases + actions.insertCases.length,
    items: before.items + actions.insertItems.length,
    manualCorrectionCases: before.manualCorrectionCases + actions.insertCases.length + actions.flagCases.length,
    manualCorrectionItems: before.manualCorrectionItems + actions.insertItems.length + actions.flagItems.length,
  };
}

export function formatBatchCounts(label: string, counts: NgnBatchCounts): string[] {
  return [
    `${label}:`,
    `  ngn_import_batch: ${counts.batches}`,
    `  ngn_case: ${counts.cases} (manual_correction ${counts.manualCorrectionCases})`,
    `  ngn_item: ${counts.items} (manual_correction ${counts.manualCorrectionItems})`,
  ];
}
