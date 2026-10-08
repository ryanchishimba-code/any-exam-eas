/**
 * Student-facing limits for NGN multi-response items.
 * Scoring stays in the NCSBN registry. This module only decides what to say
 * before the answer is revealed, when Check is enabled, and how many
 * selections a Select-N item may hold.
 */

export const NGN_SELECT_ALL_INSTRUCTION = "Select all that apply";
export const NGN_MATRIX_MULTI_INSTRUCTION = "Select one or more options per row";
export const NGN_MATRIX_SINGLE_INSTRUCTION = "Select one option per row";

export function selectNInstruction(n: number): string {
  return `Select ${n}`;
}

export type NgnMultiResponseFormat =
  | "matrix_mr"
  | "matrix_mc"
  | "mr_sata"
  | "highlight"
  | "mr_select_n";

export type NgnRuleInput = {
  type?: string;
  responseFormat?: string;
  ngnFormat?: string;
  ngnPayload?: Record<string, unknown> | null;
  payload?: Record<string, unknown> | null;
  chartData?: Record<string, unknown> | null;
  options?: readonly string[] | null;
};

export type NgnMultiResponseRule = {
  format: NgnMultiResponseFormat;
  instruction: string;
  /** Never includes a keyed-cell count. */
  checkLabel: "Check";
  maxSelections: number | null;
  rows: string[];
  requireSelectionPerRow: boolean;
  selectN: number | null;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function positiveInt(value: unknown): number | null {
  return typeof value === "number" && Number.isInteger(value) && value > 0 ? value : null;
}

function rowLabel(entry: unknown): string {
  if (typeof entry === "string" && entry.trim()) return entry.trim();
  const record = asRecord(entry);
  if (!record) return "";
  if (typeof record.id === "string" && record.id.trim()) return record.id.trim();
  if (typeof record.text === "string" && record.text.trim()) return record.text.trim();
  return "";
}

function rowList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const rows: string[] = [];
  const seen = new Set<string>();
  for (const entry of value) {
    const label = rowLabel(entry);
    if (!label || seen.has(label)) continue;
    seen.add(label);
    rows.push(label);
  }
  return rows;
}

function rowsFromOptions(options: readonly string[] | null | undefined): string[] {
  if (!options) return [];
  const rows: string[] = [];
  const seen = new Set<string>();
  for (const option of options) {
    if (typeof option !== "string" || !option.includes("|||")) continue;
    const row = option.slice(0, option.indexOf("|||"));
    if (!row || seen.has(row)) continue;
    seen.add(row);
    rows.push(row);
  }
  return rows;
}

function selectionRow(key: string): string {
  const index = key.indexOf("|||");
  return index === -1 ? key : key.slice(0, index);
}

function countByRow(selected: readonly string[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const key of selected) {
    const row = selectionRow(key);
    counts.set(row, (counts.get(row) ?? 0) + 1);
  }
  return counts;
}

function flag(record: Record<string, unknown> | null, name: string): boolean {
  return record?.[name] === true;
}

/**
 * Rules for matrix, select-all, highlight, and select-N.
 * Bow-tie and every other format return null so callers keep their own gates.
 */
export function resolveNgnMultiResponseRule(input: NgnRuleInput): NgnMultiResponseRule | null {
  const payload = asRecord(input.ngnPayload) ?? asRecord(input.payload);
  const chart = asRecord(input.chartData);
  const kind = typeof payload?.kind === "string" ? payload.kind : typeof chart?.kind === "string" ? chart.kind : "";
  const responseFormat = input.responseFormat ?? "";
  const type = input.type ?? input.ngnFormat ?? "";
  const carriedFormat =
    (typeof payload?.responseFormat === "string" ? payload.responseFormat : "") ||
    (typeof chart?.responseFormat === "string" ? chart.responseFormat : "");

  const selectN =
    positiveInt(payload?.n) ??
    positiveInt(payload?.selectN) ??
    positiveInt(chart?.n) ??
    positiveInt(chart?.selectN);
  const isSelectN =
    responseFormat === "mr_select_n" ||
    carriedFormat === "mr_select_n" ||
    kind === "select_n" ||
    kind === "mr_select_n";
  if (isSelectN && selectN != null) {
    return {
      format: "mr_select_n",
      instruction: selectNInstruction(selectN),
      checkLabel: "Check",
      maxSelections: selectN,
      rows: [],
      requireSelectionPerRow: false,
      selectN,
    };
  }

  const matrixMulti =
    flag(payload, "matrixMulti") ||
    flag(chart, "matrixMulti") ||
    responseFormat === "matrix_mr" ||
    kind === "matrix_mr" ||
    carriedFormat === "matrix_mr";
  const isMatrix =
    type === "matrix" ||
    responseFormat === "matrix_mc" ||
    responseFormat === "matrix_mr" ||
    kind === "matrix" ||
    kind === "matrix_mr" ||
    kind === "matrix_mc";
  if (isMatrix) {
    const rows = rowList(payload?.rows).length
      ? rowList(payload?.rows)
      : rowList(chart?.rows).length
        ? rowList(chart?.rows)
        : rowsFromOptions(input.options);
    const requireSelectionPerRow =
      flag(payload, "requireSelectionPerRow") ||
      flag(payload, "requireOnePerRow") ||
      flag(chart, "requireSelectionPerRow") ||
      flag(chart, "requireOnePerRow");
    if (matrixMulti) {
      return {
        format: "matrix_mr",
        instruction: NGN_MATRIX_MULTI_INSTRUCTION,
        checkLabel: "Check",
        maxSelections: null,
        rows,
        requireSelectionPerRow,
        selectN: null,
      };
    }
    return {
      format: "matrix_mc",
      instruction: NGN_MATRIX_SINGLE_INSTRUCTION,
      checkLabel: "Check",
      maxSelections: null,
      rows,
      requireSelectionPerRow: false,
      selectN: null,
    };
  }

  const isHighlight =
    type === "highlight" || responseFormat === "highlight_text" || kind === "highlight";
  if (isHighlight) {
    return {
      format: "highlight",
      instruction: NGN_SELECT_ALL_INSTRUCTION,
      checkLabel: "Check",
      maxSelections: null,
      rows: [],
      requireSelectionPerRow: false,
      selectN: null,
    };
  }

  const isSata = type === "select_all" || responseFormat === "mr_sata" || kind === "select_all";
  if (isSata) {
    return {
      format: "mr_sata",
      instruction: NGN_SELECT_ALL_INSTRUCTION,
      checkLabel: "Check",
      maxSelections: null,
      rows: [],
      requireSelectionPerRow: false,
      selectN: null,
    };
  }

  return null;
}

/** Check is enabled. Never compares the selection to the number of keyed cells. */
export function ngnCheckEnabled(rule: NgnMultiResponseRule, selected: readonly string[]): boolean {
  if (rule.format === "matrix_mc") {
    if (rule.rows.length === 0) return false;
    const counts = countByRow(selected);
    return rule.rows.every((row) => counts.get(row) === 1);
  }
  if (rule.format === "matrix_mr") {
    if (selected.length < 1) return false;
    if (!rule.requireSelectionPerRow || rule.rows.length === 0) return true;
    const counts = countByRow(selected);
    return rule.rows.every((row) => (counts.get(row) ?? 0) >= 1);
  }
  if (rule.format === "mr_select_n") {
    const limit = rule.maxSelections ?? 0;
    return selected.length >= 1 && selected.length <= limit;
  }
  return selected.length >= 1;
}

/** Toggle a choice, refusing anything past a Select-N cap. */
export function toggleCappedSelection(
  rule: NgnMultiResponseRule,
  selected: readonly string[],
  option: string
): string[] {
  if (selected.includes(option)) return selected.filter((entry) => entry !== option);
  if (rule.maxSelections != null && selected.length >= rule.maxSelections) return [...selected];
  return [...selected, option];
}

/** Flatten a clinical item response into the same row|||column or id list the gate uses. */
export function clinicalResponseToSelection(responseFormat: string, response: unknown): string[] {
  if (responseFormat === "matrix_mc") {
    const record = asRecord(response);
    if (!record) return [];
    const keys: string[] = [];
    for (const [row, column] of Object.entries(record)) {
      if (typeof column === "string" && column.trim()) keys.push(`${row}|||${column}`);
    }
    return keys;
  }
  if (responseFormat === "matrix_mr") {
    const record = asRecord(response);
    if (!record) return [];
    const keys: string[] = [];
    for (const [row, columns] of Object.entries(record)) {
      if (!Array.isArray(columns)) continue;
      for (const column of columns) {
        if (typeof column === "string" && column.trim()) keys.push(`${row}|||${column}`);
      }
    }
    return keys;
  }
  if (!Array.isArray(response)) return [];
  return response.filter((entry): entry is string => typeof entry === "string" && entry.length > 0);
}

/**
 * Clinical Check. Formats this module does not own (bow-tie, single choice,
 * dropdown) stay enabled so their existing flow is unchanged.
 */
export function clinicalItemCheckEnabled(
  item: { responseFormat: string; payload?: Record<string, unknown> | null },
  response: unknown
): boolean {
  const rule = resolveNgnMultiResponseRule({
    responseFormat: item.responseFormat,
    payload: item.payload,
  });
  if (!rule) return true;
  return ngnCheckEnabled(rule, clinicalResponseToSelection(item.responseFormat, response));
}
