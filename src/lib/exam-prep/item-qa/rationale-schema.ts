/**
 * Publish schema for new and edited items.
 *
 * Required:
 * - a correct-answer explanation
 * - a specific reason each distractor is wrong (MCQ / select-all)
 * - a governing principle or priority rule (board-generic, not nursing-only)
 *
 * Optional:
 * - a source citation (warning only)
 */
import { readExpertRationaleFromMeta } from "@/lib/engine/rationale/expert-rationale-types";
import {
  listWrongBankOptions,
  normalizeRationaleOptionKey,
} from "@/lib/engine/rationale/validate-rationale";
import { parseBankOptions } from "@/lib/mpje/parse-bank-options";

export type RationaleSchemaIssue = {
  area: "rationale";
  code:
    | "missing_correct_explanation"
    | "missing_distractor_reason"
    | "missing_governing_principle"
    | "missing_citation";
  severity: "error" | "warn";
  message: string;
  option?: string;
};

export type ItemCitation = {
  label?: string;
  citation?: string;
  url?: string;
};

export type ItemQaContent = {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  itemType?: string | null;
  distractorRationale?: Record<string, string>;
  governingPrinciple?: string;
  references?: ItemCitation[];
  expertRationale?: {
    whyCorrect?: { headline?: string };
    whyIncorrect?: Array<{ option?: string; correction?: string; misconception?: string }>;
    keyTakeaway?: string;
  };
};

const DISTRACTOR_TYPES = new Set([
  "mcq",
  "vignette",
  "multiple_choice",
  "select_all",
  "sata",
  "",
]);

const PRINCIPLE_LINE =
  /(?:^|\n)\s*(?:governing principle|priority rule|principle|priority|rule)\s*[:\-–—]\s*(.{24,})/i;

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function readStringMap(value: unknown): Record<string, string> | undefined {
  const record = asRecord(value);
  if (!record) return undefined;
  const out: Record<string, string> = {};
  for (const [key, entry] of Object.entries(record)) {
    if (typeof entry === "string" && entry.trim()) out[key] = entry.trim();
  }
  return Object.keys(out).length ? out : undefined;
}

export function readCitations(value: unknown): ItemCitation[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const citations: ItemCitation[] = [];
  for (const entry of value) {
    if (typeof entry === "string" && entry.trim()) {
      citations.push({ label: entry.trim() });
      continue;
    }
    const record = asRecord(entry);
    if (!record) continue;
    citations.push({
      label: typeof record.label === "string" ? record.label : undefined,
      citation: typeof record.citation === "string" ? record.citation : undefined,
      url: typeof record.url === "string" ? record.url : undefined,
    });
  }
  return citations.length ? citations : undefined;
}

function mergeReasons(
  ...maps: Array<Record<string, string> | undefined>
): Record<string, string> {
  const merged: Record<string, string> = {};
  for (const map of maps) {
    if (!map) continue;
    for (const [key, value] of Object.entries(map)) {
      if (value.trim()) merged[key] = value.trim();
    }
  }
  return merged;
}

function reasonForOption(reasons: Record<string, string>, option: string): string | undefined {
  if (reasons[option]?.trim()) return reasons[option].trim();
  const wanted = normalizeRationaleOptionKey(option);
  for (const [key, value] of Object.entries(reasons)) {
    if (normalizeRationaleOptionKey(key) === wanted && value.trim()) return value.trim();
  }
  return undefined;
}

function reasonsFromExplanation(
  explanation: string,
  wrongOptions: string[]
): Record<string, string> {
  const found: Record<string, string> = {};
  const lines = explanation.split(/\n+/);
  for (const option of wrongOptions) {
    const key = normalizeRationaleOptionKey(option);
    const prefix = key.slice(0, 48);
    if (prefix.length < 8) continue;
    for (const line of lines) {
      const normalized = normalizeRationaleOptionKey(line);
      if (!normalized.includes(prefix)) continue;
      const after = line.split(/[:\-–—]/).slice(1).join(" ").trim();
      if (after.length >= 20) {
        found[option] = after;
        break;
      }
    }
  }
  return found;
}

function readPrinciple(content: ItemQaContent): string {
  const explicit = content.governingPrinciple?.trim() ?? "";
  if (explicit.length >= 24) return explicit;
  const labeled = content.explanation.match(PRINCIPLE_LINE)?.[1]?.trim() ?? "";
  if (labeled.length >= 24) return labeled;
  const takeaway = content.expertRationale?.keyTakeaway?.trim() ?? "";
  if (takeaway.length >= 24 && content.expertRationale?.whyCorrect?.headline?.trim()) {
    return takeaway;
  }
  return "";
}

function hasCitation(content: ItemQaContent): boolean {
  return (content.references ?? []).some(
    (ref) => Boolean(ref.label?.trim() || ref.citation?.trim() || ref.url?.trim())
  );
}

function requiresDistractors(itemType: string | null | undefined): boolean {
  return DISTRACTOR_TYPES.has((itemType ?? "mcq").trim().toLowerCase());
}

/** Map a stored bank row into the schema checker without a database client. */
export function contentFromStoredItem(row: {
  question: string;
  options: string;
  correctAnswer: string;
  explanation: string;
  itemType?: string | null;
  references?: unknown;
  generationMeta?: unknown;
}): ItemQaContent {
  const parsed = parseBankOptions(row.options);
  const meta = asRecord(row.generationMeta);
  const principle =
    typeof meta?.governingPrinciple === "string" ? meta.governingPrinciple : undefined;
  const metaReasons = readStringMap(meta?.distractorRationale);
  const citation = asRecord(meta?.citation);
  const references = readCitations(row.references) ?? [];
  if (citation && (typeof citation.label === "string" || typeof citation.citation === "string")) {
    references.push({
      label: typeof citation.label === "string" ? citation.label : undefined,
      citation: typeof citation.citation === "string" ? citation.citation : undefined,
      url: typeof citation.url === "string" ? citation.url : undefined,
    });
  }
  const expert = readExpertRationaleFromMeta(row.generationMeta);
  return {
    question: row.question,
    options: parsed.options,
    correctAnswer: row.correctAnswer,
    explanation: row.explanation,
    itemType: row.itemType,
    distractorRationale: mergeReasons(parsed.distractorRationale, metaReasons),
    governingPrinciple: principle,
    references,
    expertRationale: expert,
  };
}

export function evaluateRationaleSchema(content: ItemQaContent): RationaleSchemaIssue[] {
  const issues: RationaleSchemaIssue[] = [];
  const explanation = content.explanation?.trim() ?? "";
  const headline = content.expertRationale?.whyCorrect?.headline?.trim() ?? "";
  const correctEnough = explanation.length >= 80 || headline.length >= 40;
  if (!correctEnough) {
    issues.push({
      area: "rationale",
      code: "missing_correct_explanation",
      severity: "error",
      message:
        "Add a correct-answer explanation (at least a short paragraph, or a structured why-correct headline).",
    });
  }

  if (requiresDistractors(content.itemType) && content.options.length >= 2) {
    const wrong = listWrongBankOptions(content.options, content.correctAnswer);
    const reasons = mergeReasons(
      content.distractorRationale,
      reasonsFromExplanation(explanation, wrong),
      Object.fromEntries(
        (content.expertRationale?.whyIncorrect ?? []).flatMap((entry) => {
          const option = entry.option?.trim();
          const reason = (entry.correction || entry.misconception || "").trim();
          return option && reason ? [[option, reason]] : [];
        })
      )
    );
    for (const option of wrong) {
      const reason = reasonForOption(reasons, option);
      if (!reason || reason.length < 20) {
        issues.push({
          area: "rationale",
          code: "missing_distractor_reason",
          severity: "error",
          message: `Add a specific reason this distractor is wrong: ${option.slice(0, 80)}`,
          option,
        });
      }
    }
  }

  if (!readPrinciple(content)) {
    issues.push({
      area: "rationale",
      code: "missing_governing_principle",
      severity: "error",
      message:
        "Add the governing principle or priority rule (a labeled Principle/Priority line, or the principle field).",
    });
  }

  if (!hasCitation(content)) {
    issues.push({
      area: "rationale",
      code: "missing_citation",
      severity: "warn",
      message: "Optional: add a source citation so students can see where the item was checked.",
    });
  }

  return issues;
}
