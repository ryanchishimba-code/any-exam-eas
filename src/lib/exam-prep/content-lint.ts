/**
 * Read-only content checks for stems, exhibits, calculation keys, near-duplicate
 * conflicts, and withdrawn drugs. Nothing here writes bank rows.
 */
import type { BankItem } from "@/lib/question-bank";
import { assignSittingClusters } from "@/lib/exam-prep/sitting-clusters";

export type ContentLintCode =
  | "merged_stem"
  | "round_to_fragment"
  | "odd_number_spacing"
  | "exhibit_mismatch"
  | "calc_key_mismatch"
  | "conflicting_cluster_key"
  | "withdrawn_drug";

export type ContentLintRow = {
  id: string;
  code: ContentLintCode;
  severity: "error" | "warn";
  detail: string;
  excerpt: string;
};

export type ContentLintItem = {
  id?: string;
  question: string;
  options?: string[];
  correctAnswer?: string;
  explanation?: string;
  clinicalReasoning?: string;
  topicCategory?: string;
  blueprintTopic?: string;
  itemType?: string;
  tags?: string[];
  /** Diagram caption, exhibit title, or alt text shipped with the item. */
  exhibitText?: string;
  /** Case text shown with the stem. Clustering and exhibit checks read it. */
  scenario?: string;
  fieldId?: string;
  clusterId?: string | null;
  generationMeta?: Record<string, unknown>;
  curationMeta?: Record<string, unknown>;
  ngnPayload?: Record<string, unknown>;
};

/** A second question lead-in glued onto the end of a sentence ("therapy Which action"). */
const MERGED_STEM = /[a-z]{4,}\s+(?:Which|What|How|Select|Identify)\b/;

const ROUND_TO_FRAGMENT = /\(Round to(?![^)\n]{0,80}\))/i;

const ODD_NUMBER_SPACING = /\d\s+\.\s*\d+|\d\.\s+\d+/;

/** US products removed from the market that should not be live answer choices. */
export const WITHDRAWN_DRUGS = [
  "ranitidine",
  "cisapride",
  "phenylpropanolamine",
  "propoxyphene",
  "cerivastatin",
  "rofecoxib",
  "valdecoxib",
  "tegaserod",
  "sibutramine",
  "lorcaserin",
  "phenformin",
] as const;

const DRUG_SUFFIX =
  /\b([a-z]{4,}(?:mycin|cillin|olol|pril|sartan|dipine|statin|prazole|oxetine|azepam|caine))\b/gi;

const KNOWN_EXHIBIT_DRUGS = [
  "vancomycin",
  "gentamicin",
  "tobramycin",
  "amikacin",
  "morphine",
  "insulin",
  "warfarin",
  "heparin",
  "digoxin",
  "phenytoin",
  "lithium",
  "theophylline",
];

const CALC_LEAD =
  /\b(?:calculate|how many|how much|at what rate|round to|what is the (?:rate|dose|volume|concentration|total|amount|infusion))\b/i;

const FINAL_RESULT =
  /(?:correct answer(?:\s+is)?|final answer(?:\s+is)?|the answer(?:\s+is)?|keyed answer(?:\s+is)?)\s*[:=]?\s*(-?\d+(?:\.\d+)?)/gi;

const EQUALS_RESULT = /(?<![=<>])(?:=|equals)\s*(-?\d+(?:\.\d+)?)/gi;

function excerpt(text: string, index = 0): string {
  const start = Math.max(0, index - 24);
  return text.slice(start, start + 90).replace(/\s+/g, " ").trim();
}

function itemText(item: ContentLintItem): string {
  return [
    item.scenario ?? "",
    item.question,
    ...(item.options ?? []),
    item.topicCategory ?? "",
    item.blueprintTopic ?? "",
  ]
    .join(" ")
    .toLowerCase();
}

function rationaleText(item: ContentLintItem): string {
  return [item.explanation ?? "", item.clinicalReasoning ?? ""].join("\n");
}

function push(
  rows: ContentLintRow[],
  item: ContentLintItem,
  code: ContentLintCode,
  severity: ContentLintRow["severity"],
  detail: string,
  sample: string
) {
  rows.push({
    id: item.id?.trim() || "(no id)",
    code,
    severity,
    detail,
    excerpt: excerpt(sample),
  });
}

function lintMergedStem(item: ContentLintItem, rows: ContentLintRow[]) {
  const stem = item.question ?? "";
  const match = MERGED_STEM.exec(stem);
  if (!match) return;
  push(rows, item, "merged_stem", "error", "Stem glues two questions together.", stem.slice(match.index));
}

function lintRoundTo(item: ContentLintItem, rows: ContentLintRow[]) {
  const blob = `${item.question}\n${(item.options ?? []).join("\n")}`;
  const match = ROUND_TO_FRAGMENT.exec(blob);
  if (match) {
    push(rows, item, "round_to_fragment", "error", "Dangling “(Round to” fragment.", match[0]);
  }
}

function lintOddSpacing(item: ContentLintItem, rows: ContentLintRow[]) {
  const blob = `${item.question}\n${(item.options ?? []).join("\n")}`;
  const match = ODD_NUMBER_SPACING.exec(blob);
  if (match) {
    push(
      rows,
      item,
      "odd_number_spacing",
      "error",
      "Number has a space around the decimal point.",
      match[0]
    );
  }
}

function drugTokens(text: string): Set<string> {
  const found = new Set<string>();
  const lower = text.toLowerCase();
  for (const drug of KNOWN_EXHIBIT_DRUGS) {
    if (new RegExp(`\\b${drug}\\b`, "i").test(lower)) found.add(drug);
  }
  for (const match of lower.matchAll(DRUG_SUFFIX)) {
    if (match[1]) found.add(match[1].toLowerCase());
  }
  return found;
}

function lintExhibit(item: ContentLintItem, rows: ContentLintRow[]) {
  const exhibit = item.exhibitText?.trim();
  if (!exhibit) return;
  const exhibitDrugs = drugTokens(exhibit);
  if (exhibitDrugs.size === 0) return;
  const body = itemText(item);
  const mismatched = [...exhibitDrugs].filter((drug) => !new RegExp(`\\b${drug}\\b`, "i").test(body));
  if (mismatched.length === 0) return;
  push(
    rows,
    item,
    "exhibit_mismatch",
    "error",
    `Exhibit names ${mismatched.join(", ")} but the stem and options do not.`,
    exhibit
  );
}

function numericKey(answer: string | undefined): number | null {
  if (!answer) return null;
  const match = answer.replace(/,/g, "").match(/-?\d+(?:\.\d+)?/);
  if (!match) return null;
  const value = Number(match[0]);
  return Number.isFinite(value) ? value : null;
}

function numbersDisagree(keyed: number, other: number): boolean {
  const diff = Math.abs(keyed - other);
  const scale = Math.max(Math.abs(keyed), 1);
  return diff > 0.05 && diff / scale > 0.01;
}

function recomputeDose(stem: string): number | null {
  const weight = stem.match(/(\d+(?:\.\d+)?)\s*kg\b/i);
  const perKg = stem.match(/(\d+(?:\.\d+)?)\s*mg\s*\/\s*kg\b/i);
  if (!weight || !perKg) return null;
  return Number(weight[1]) * Number(perKg[1]);
}

function recomputeRate(stem: string): number | null {
  const volume = stem.match(/(\d+(?:\.\d+)?)\s*mL\b/i);
  const hours = stem.match(/(\d+(?:\.\d+)?)\s*(?:hours?|hrs?)\b/i);
  if (!volume || !hours) return null;
  const h = Number(hours[1]);
  if (!h) return null;
  return Number(volume[1]) / h;
}

function looksLikeCalc(item: ContentLintItem): boolean {
  const type = (item.itemType ?? "").toLowerCase();
  if (type === "constructed_response" || type === "calculation") return true;
  if ((item.tags ?? []).some((tag) => /calc/i.test(tag))) return true;
  return CALC_LEAD.test(item.question ?? "");
}

function lastNumber(matches: IterableIterator<RegExpMatchArray>): number | null {
  let value: number | null = null;
  for (const match of matches) {
    const next = Number(match[1]);
    if (Number.isFinite(next)) value = next;
  }
  return value;
}

/** The last stated result, not an intermediate product. */
function finalStatedNumber(rationale: string): number | null {
  const stated = lastNumber(rationale.matchAll(FINAL_RESULT));
  if (stated != null) return stated;
  return lastNumber(rationale.matchAll(EQUALS_RESULT));
}

function lintCalculation(item: ContentLintItem, rows: ContentLintRow[]) {
  if (!looksLikeCalc(item)) return;
  const keyed = numericKey(item.correctAnswer);
  if (keyed == null) return;

  const rationale = rationaleText(item);
  const stem = `${item.scenario ?? ""}\n${item.question ?? ""}`;
  const stated = finalStatedNumber(rationale);
  if (stated != null && !numbersDisagree(keyed, stated)) return;

  const asksDose = /\bdose\b/i.test(item.question ?? "") && /\bmg\s*\/\s*kg\b/i.test(stem);
  const asksRate = /\b(rate|mL\/h)\b/i.test(item.question ?? "");
  const recomputed = asksDose ? recomputeDose(stem) : asksRate ? recomputeRate(stem) : null;
  const statedConflict = stated != null && numbersDisagree(keyed, stated);
  const recomputeConflict =
    stated == null && recomputed != null && numbersDisagree(keyed, recomputed);
  if (!statedConflict && !recomputeConflict) return;

  const shown = statedConflict ? stated : recomputed;
  push(
    rows,
    item,
    "calc_key_mismatch",
    "error",
    `Keyed ${keyed} does not match ${recomputeConflict ? `recomputed ${recomputed}` : `rationale ${shown}`}.`,
    rationale || item.question
  );
}

function lintWithdrawn(item: ContentLintItem, rows: ContentLintRow[]) {
  const blob = `${item.question}\n${(item.options ?? []).join("\n")}`;
  for (const drug of WITHDRAWN_DRUGS) {
    const match = new RegExp(`\\b${drug}\\b`, "i").exec(blob);
    if (!match) continue;
    push(
      rows,
      item,
      "withdrawn_drug",
      "warn",
      `${drug} was withdrawn from the US market and is still in the stem or options.`,
      match[0]
    );
  }
}

function asBankItem(item: ContentLintItem): BankItem {
  return {
    id: item.id,
    question: item.question,
    scenario: item.scenario,
    vignette: item.scenario,
    options: item.options ?? [],
    correctAnswer: item.correctAnswer ?? "",
    explanation: item.explanation ?? "",
    clusterId: item.clusterId,
    generationMeta: item.generationMeta,
    curationMeta: item.curationMeta,
    ngnPayload: item.ngnPayload,
    topicCategory: item.topicCategory,
    blueprintTopic: item.blueprintTopic,
    itemType: item.itemType,
    tags: item.tags,
  };
}

function answerKey(item: ContentLintItem): string {
  return (item.correctAnswer ?? "").trim().toLowerCase().replace(/\s+/g, " ");
}

function lintConflictingClusters(items: readonly ContentLintItem[], rows: ContentLintRow[]) {
  const byBoard = new Map<string, ContentLintItem[]>();
  for (const item of items) {
    const board = item.fieldId?.trim() || "";
    const list = byBoard.get(board) ?? [];
    list.push(item);
    byBoard.set(board, list);
  }

  const groups = new Map<string, ContentLintItem[]>();
  for (const [board, boardItems] of byBoard) {
    const clusters = assignSittingClusters(boardItems.map(asBankItem));
    boardItems.forEach((item, index) => {
      const id = `${board}:${clusters[index]!}`;
      const list = groups.get(id) ?? [];
      list.push(item);
      groups.set(id, list);
    });
  }

  for (const [clusterId, group] of groups) {
    if (group.length < 2) continue;
    const keys = new Set(group.map(answerKey).filter(Boolean));
    if (keys.size < 2) continue;
    const sample = group[0]!;
    push(
      rows,
      sample,
      "conflicting_cluster_key",
      "error",
      `Cluster ${clusterId} has ${group.length} near-duplicates keyed to ${[...keys].slice(0, 4).join(" | ")}.`,
      sample.question
    );
  }
}

export function lintContentItems(items: readonly ContentLintItem[]): ContentLintRow[] {
  const rows: ContentLintRow[] = [];
  for (const item of items) {
    lintMergedStem(item, rows);
    lintRoundTo(item, rows);
    lintOddSpacing(item, rows);
    lintExhibit(item, rows);
    lintCalculation(item, rows);
    lintWithdrawn(item, rows);
  }
  lintConflictingClusters(items, rows);
  return rows;
}

function csvCell(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

export function contentLintRowsToCsv(rows: readonly ContentLintRow[]): string {
  const header = ["id", "code", "severity", "detail", "excerpt"];
  const lines = [header.join(",")];
  for (const row of rows) {
    lines.push(
      [row.id, row.code, row.severity, row.detail, row.excerpt].map(csvCell).join(",")
    );
  }
  return `${lines.join("\n")}\n`;
}

const MEDIA_TEXT_KEYS = ["alt", "caption", "title", "label", "exhibitCaption", "figureCaption", "diagramAlt", "exhibitLabel", "diagramLabel", "figureTitle", "exhibit"] as const;

function collectMediaText(value: unknown, chunks: string[], depth = 0) {
  if (!value || depth > 4) return;
  if (typeof value === "string") return;
  if (Array.isArray(value)) {
    for (const entry of value) collectMediaText(entry, chunks, depth + 1);
    return;
  }
  if (typeof value !== "object") return;
  const record = value as Record<string, unknown>;
  for (const key of MEDIA_TEXT_KEYS) {
    const text = record[key];
    if (typeof text === "string" && text.trim()) chunks.push(text.trim());
  }
  if ("media" in record) collectMediaText(record.media, chunks, depth + 1);
  if ("figures" in record) collectMediaText(record.figures, chunks, depth + 1);
}

export function exhibitTextFromBankItem(item: BankItem): string | undefined {
  const chunks: string[] = [];
  collectMediaText(item.generationMeta, chunks);
  collectMediaText(item.ngnPayload, chunks);
  return chunks.length > 0 ? chunks.join(" ") : undefined;
}
