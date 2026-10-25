import { formatExactQuestionCount, publishedNgnItemCount } from "@/lib/counts";

export type NclexNgnTypeRow = {
  id: string;
  label: string;
  count: number;
};

const STANDALONE_TYPE_ORDER: { id: string; types: string[]; label: string }[] = [
  { id: "bowtie", types: ["bowtie", "bow_tie", "ngn_bowtie"], label: "Bow-tie" },
  { id: "trend", types: ["trend"], label: "Trend" },
];

function countForTypes(counts: Record<string, number>, types: readonly string[]): number {
  return types.reduce((sum, type) => sum + (counts[type.toLowerCase()] ?? 0), 0);
}

/** Live published NGN rows for the NCLEX hub bar chart (zeros omitted). */
export function buildNclexNgnTypeChartRows(input: {
  caseItems: number;
  standaloneNgn: number;
  publishedStandaloneTypes: Record<string, number>;
}): NclexNgnTypeRow[] {
  const rows: NclexNgnTypeRow[] = [];
  const caseItems = Math.max(0, Math.floor(input.caseItems));
  if (caseItems > 0) {
    rows.push({ id: "case-items", label: "Case study items", count: caseItems });
  }

  const types = input.publishedStandaloneTypes;
  let namedStandalone = 0;
  for (const group of STANDALONE_TYPE_ORDER) {
    const count = countForTypes(types, group.types);
    if (count <= 0) continue;
    namedStandalone += count;
    rows.push({ id: group.id, label: group.label, count });
  }

  const standaloneTotal = Math.max(0, Math.floor(input.standaloneNgn));
  const rest = standaloneTotal - namedStandalone;
  if (rest > 0) {
    rows.push({ id: "standalone-other", label: "Other standalone NGN", count: rest });
  }

  return rows;
}

export function formatNgnTypeCount(count: number): string {
  return formatExactQuestionCount(count);
}

/** Screen-reader summary for the published NGN type chart. */
export function buildNclexNgnTypeChartAltText(
  rows: readonly NclexNgnTypeRow[],
  units: { standaloneNgn: number; caseItems: number }
): string {
  const total = publishedNgnItemCount(units);
  if (rows.length === 0 || total <= 0) {
    return "Published Next Gen NCLEX item counts appear when the bank lookup succeeds.";
  }
  const parts = rows.map((row) => `${row.label} ${formatNgnTypeCount(row.count)}`);
  return `${formatExactQuestionCount(total)} published NGN items: ${parts.join(", ")}. Select-all-that-apply items in the classic question bank are not included in this total.`;
}
