import { unstable_cache } from "next/cache";
import { sqlQuery } from "@/lib/db";
import { ACTIVE_INVENTORY_CACHE_TAG } from "@/lib/inventory/active-inventory-cache";

export type HeroCaseScene = {
  setting: string;
  notesLabel: string;
  notes: string[];
  vitalsLabel: string;
  columns: string[];
  rows: string[][];
  stem: string;
  options: string[];
  keyedAnswer: string;
  whyNot: string | null;
};

type CaseRow = {
  id: string;
  version: number;
  setting: string | null;
  chart: unknown;
};

type ItemRow = {
  stem: string | null;
  payload: unknown;
  rationale: unknown;
};

const QUERY_TIMEOUT_MS = 5_000;

function record(value: unknown): Record<string, unknown> | null {
  if (value && typeof value === "object" && !Array.isArray(value)) return value as Record<string, unknown>;
  return null;
}

function textList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((entry): entry is string => typeof entry === "string" && entry.trim().length > 0);
}

function chartTabs(chart: unknown): Record<string, unknown>[] {
  const tabs = record(chart)?.tabs;
  if (!Array.isArray(tabs)) return [];
  return tabs.flatMap((tab) => {
    const row = record(tab);
    return row ? [row] : [];
  });
}

function noteTexts(tab: Record<string, unknown>): string[] {
  if (!Array.isArray(tab.entries)) return [];
  return tab.entries.flatMap((entry) => {
    const text = record(entry)?.text;
    return typeof text === "string" && text.trim() ? [text.trim()] : [];
  });
}

function vitalTable(tab: Record<string, unknown>): { columns: string[]; rows: string[][] } | null {
  const columns = textList(tab.columns);
  if (!Array.isArray(tab.rows) || columns.length === 0) return null;
  const rows = tab.rows.flatMap((row) => {
    if (!Array.isArray(row)) return [];
    const cells = row.map((cell) => (typeof cell === "string" ? cell.trim() : ""));
    return cells.some((cell) => cell.length > 0) ? [cells] : [];
  });
  if (rows.length === 0) return null;
  return { columns, rows };
}

function optionsOf(payload: unknown): { id: string; text: string }[] {
  const options = record(payload)?.options;
  if (!Array.isArray(options)) return [];
  return options.flatMap((option) => {
    const row = record(option);
    const id = row?.id;
    const text = row?.text;
    if (typeof id !== "string" || typeof text !== "string" || !text.trim()) return [];
    return [{ id, text: text.trim() }];
  });
}

function keysOf(payload: unknown): string[] {
  const row = record(payload);
  if (!row) return [];
  if (typeof row.key === "string" && row.key.trim()) return [row.key];
  return textList(row.keys);
}

function rationaleShort(rationale: unknown): string {
  const short = record(rationale)?.short;
  return typeof short === "string" ? short.trim() : "";
}

function perOptionText(rationale: unknown, id: string): string | null {
  const perOption = record(record(record(rationale)?.expanded)?.perOption);
  const text = record(perOption?.[id])?.text;
  return typeof text === "string" && text.trim() ? text.trim() : null;
}

/**
 * One published case, trimmed to the chart tabs and the first item that has
 * stored options, a key, and a distractor reason. Missing pieces return null
 * instead of a written example.
 */
export function buildHeroCaseScene(input: {
  setting: string | null;
  chart: unknown;
  items: readonly ItemRow[];
}): HeroCaseScene | null {
  const tabs = chartTabs(input.chart);
  const notesTab = tabs.find((tab) => /nurse/i.test(String(tab.label ?? "")));
  const vitalsTab = tabs.find((tab) => /vital/i.test(String(tab.label ?? "")));
  const notes = notesTab ? noteTexts(notesTab) : [];
  const vitals = vitalsTab ? vitalTable(vitalsTab) : null;
  if (!notesTab || !vitalsTab || notes.length === 0 || !vitals) return null;

  for (const item of input.items) {
    const stem = item.stem?.trim() ?? "";
    const options = optionsOf(item.payload);
    const keys = new Set(keysOf(item.payload));
    if (!stem || options.length < 2 || keys.size === 0) continue;
    const keyed = options.filter((option) => keys.has(option.id));
    const distractors = options.filter((option) => !keys.has(option.id));
    if (keyed.length === 0) continue;
    const whyNot =
      distractors
        .map((option) => perOptionText(item.rationale, option.id))
        .find((text): text is string => Boolean(text)) ?? null;
    const keyedAnswer = rationaleShort(item.rationale) || keyed.map((option) => option.text).join(" ");
    if (!keyedAnswer) continue;
    return {
      setting: input.setting?.trim() || "Next Gen NCLEX case",
      notesLabel: String(notesTab.label),
      notes,
      vitalsLabel: String(vitalsTab.label),
      columns: vitals.columns,
      rows: vitals.rows,
      stem,
      options: options.map((option) => option.text),
      keyedAnswer,
      whyNot,
    };
  }
  return null;
}

async function readNclexHeroCase(): Promise<HeroCaseScene | null> {
  const cases = await sqlQuery<CaseRow[]>(
    `
    SELECT id, version, setting, chart
    FROM (
      SELECT DISTINCT ON (id) id, version, setting, chart
      FROM ngn_case
      WHERE status = 'published'
        AND board_profile = 'nclex-rn-2026'
        AND chart::text ILIKE '%nurse%'
        AND chart::text ILIKE '%vital%'
      ORDER BY id, version DESC
    ) latest
    ORDER BY id
    LIMIT 1
    `,
    [],
    { timeoutMs: QUERY_TIMEOUT_MS }
  );
  const caseRow = Array.isArray(cases) ? cases[0] : undefined;
  if (!caseRow?.id) return null;
  const items = await sqlQuery<ItemRow[]>(
    `
    SELECT stem, payload, rationale
    FROM ngn_item
    WHERE case_id = $1
      AND case_version = $2
      AND status = 'published'
    ORDER BY case_step ASC NULLS LAST, id ASC
    `,
    [caseRow.id, caseRow.version],
    { timeoutMs: QUERY_TIMEOUT_MS }
  );
  return buildHeroCaseScene({
    setting: caseRow.setting,
    chart: caseRow.chart,
    items: Array.isArray(items) ? items : [],
  });
}

const loadCachedNclexHeroCase = unstable_cache(readNclexHeroCase, ["nclex-hero-case-v1"], {
  revalidate: 300,
  tags: [ACTIVE_INVENTORY_CACHE_TAG],
});

/** One live Next Gen case for the NCLEX hero. Null when the bank cannot be read. */
export async function loadNclexHeroCase(): Promise<HeroCaseScene | null> {
  try {
    return await loadCachedNclexHeroCase();
  } catch {
    return null;
  }
}
