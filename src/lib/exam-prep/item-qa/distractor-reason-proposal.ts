/**
 * Propose per-option reasons for wrong answers from text the item already stores.
 *
 * Dry-run listing is the default. The only write is a distractorRationale map
 * keyed by option text. Stem, correct answer, explanation, qaPassed, and active
 * are never part of the write. Near-duplicate rows are never written.
 *
 * A proposal is a quote. Generic placeholder lines that do not name the option,
 * answer-key restatements, and options the teaching summary treats as correct
 * stay needs_human with a null reason.
 */
import { listWrongBankOptions, normalizeRationaleOptionKey } from "@/lib/engine/rationale/validate-rationale";
import { parseBankOptions } from "@/lib/mpje/parse-bank-options";
import { NEAR_DUPLICATE_CODE, readItemQaRecord } from "./flag";
import {
  collectedDistractorReasons,
  contentFromStoredItem,
  evaluateRationaleSchema,
  type ItemQaContent,
} from "./rationale-schema";

/** Same floor evaluateRationaleSchema uses before a distractor reason counts. */
export const DISTRACTOR_REASON_MIN = 20;

export type DistractorReasonClassification = "auto_extract" | "needs_human";

export type DistractorOptionProposal = {
  option: string;
  /** Reason the schema already accepts, when one is stored or parsed. */
  existingReason: string | null;
  /** Quote to store, or null when this option cannot be grounded. */
  proposedReason: string | null;
  note: string;
};

export type DistractorReasonProposal = {
  classification: DistractorReasonClassification;
  options: DistractorOptionProposal[];
  reason: string;
  notes: string[];
};

export type DistractorReasonBankRow = {
  id: string;
  fieldId: string;
  subjectId: string;
  active: boolean;
  qaPassed: boolean;
  stem: string;
  explanation: string;
  options: string;
  correctAnswer: string;
  itemType?: string | null;
  references?: unknown;
  generationMeta: unknown;
  curationMeta: unknown;
};

export type DistractorReasonSkipReason =
  | "inactive"
  | "other_field"
  | "near_duplicate"
  | "already_resolved";

export type DistractorReasonSkip = {
  id: string;
  reason: DistractorReasonSkipReason;
};

export type DistractorReasonPlanItem = {
  id: string;
  fieldId: string;
  subjectId: string;
  qaPassed: boolean;
  itemType: string | null;
  classification: DistractorReasonClassification;
  options: DistractorOptionProposal[];
  reason: string;
  notes: string[];
  stemPreview: string;
  wouldWrite: boolean;
  /** True when the write would give every missing wrong option a reason. */
  wouldResolve: boolean;
  codes: string[];
};

export type DistractorReasonPlan = {
  fieldId: string;
  autoExtract: DistractorReasonPlanItem[];
  needsHuman: DistractorReasonPlanItem[];
  skipped: DistractorReasonSkip[];
  failingDistractorBefore: number;
  wouldWrite: number;
  failingDistractorAfter: number;
  truncated: boolean;
};

export type ProposeDistractorReasonArgs = {
  field: string;
  subject?: string;
  limit: number;
  apply: boolean;
  idsFile?: string;
  outDir: string;
};

const GENERIC_REASON = [
  /plausible (?:nursing )?action but not the first priority/i,
  /correct eventually/i,
  /teaching or screening task unrelated/i,
  /unsafe to prioritize before abc/i,
  /review the client presentation and clinical data/i,
  /reassess the client after intervention and document/i,
];

const ANSWER_RESTATEMENT =
  /^(?:the\s+)?(?:correct|best)\s+(?:answer|response|action|option)\s+is\b/i;

const NEGATION =
  /\b(?:incorrect|inadequate|unnecessary|not required|does not|do not|don't|isn't|is not|cannot|can't|never|rather than|instead of)\b/i;

const STOPWORDS = new Set([
  "about",
  "after",
  "also",
  "and",
  "are",
  "before",
  "been",
  "client",
  "clients",
  "could",
  "during",
  "for",
  "from",
  "have",
  "into",
  "nurse",
  "only",
  "onto",
  "other",
  "should",
  "that",
  "the",
  "their",
  "them",
  "then",
  "they",
  "this",
  "than",
  "with",
  "when",
  "what",
  "which",
  "would",
  "your",
]);

function collapse(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function bindKey(text: string): string {
  return normalizeRationaleOptionKey(text.replace(/\*+/g, " ").replace(/[•]/g, " "))
    .replace(/[-‐‑‒–—]/g, " ")
    .replace(/['’]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanReason(text: string): string {
  return collapse(text.replace(/\*+/g, " ").replace(/^[\s:–—-]+/, ""));
}

function isGenericReason(text: string): boolean {
  return GENERIC_REASON.some((pattern) => pattern.test(text));
}

function isAnswerRestatement(text: string): boolean {
  return ANSWER_RESTATEMENT.test(cleanReason(text));
}

function usableReason(text: string): string | null {
  const reason = cleanReason(text);
  if (reason.length < DISTRACTOR_REASON_MIN) return null;
  if (isGenericReason(reason) || isAnswerRestatement(reason)) return null;
  return reason;
}

function lineNamesOption(line: string, option: string): boolean {
  const key = bindKey(option);
  const prefix = key.slice(0, 48);
  if (prefix.length < 8) return false;
  return bindKey(line).includes(prefix);
}

function namedOptions(line: string, options: readonly string[]): string[] {
  return options.filter((option) => lineNamesOption(line, option));
}

function lineIsOptionLabel(line: string, option: string): boolean {
  const stripped = line.replace(/^[\s>*•\-–—]+/, "").replace(/\*+/g, "").trim();
  const key = bindKey(stripped);
  const optionKey = bindKey(option);
  if (optionKey.length < 8 || !key) return false;
  if (key === optionKey) return true;
  return key.startsWith(optionKey) && key.length - optionKey.length <= 12;
}

function reasonFromLabeledLine(line: string): { reason: string | null; rejected: "generic" | "restatement" | "short" | null } {
  const incorrect = line.match(/\bincorrect\s*[—–\-:]\s*(.+)$/i);
  if (incorrect?.[1]) {
    const raw = cleanReason(incorrect[1]);
    if (isGenericReason(raw)) return { reason: null, rejected: "generic" };
    if (isAnswerRestatement(raw)) return { reason: null, rejected: "restatement" };
    if (raw.length < DISTRACTOR_REASON_MIN) return { reason: null, rejected: "short" };
    return { reason: raw, rejected: null };
  }
  const because = line.match(/\bbecause\s+(.+)$/i);
  if (because?.[1] && NEGATION.test(line)) {
    const raw = cleanReason(because[1]);
    if (isGenericReason(raw)) return { reason: null, rejected: "generic" };
    if (isAnswerRestatement(raw)) return { reason: null, rejected: "restatement" };
    if (raw.length < DISTRACTOR_REASON_MIN) return { reason: null, rejected: "short" };
    return { reason: raw, rejected: null };
  }
  return { reason: null, rejected: null };
}

function groundedIn(reason: string, sources: readonly string[]): boolean {
  const needle = collapse(reason).toLowerCase();
  if (needle.length < DISTRACTOR_REASON_MIN) return false;
  return sources.some((source) => collapse(source).toLowerCase().includes(needle));
}

function teachingBody(explanation: string): string {
  const splitAt = explanation.search(/\n+\s*(?:\*\*)?\s*why other options\b/i);
  return (splitAt >= 0 ? explanation.slice(0, splitAt) : explanation).trim();
}

function contentTokens(option: string): string[] {
  return bindKey(option)
    .split(" ")
    .filter((token) => token.length >= 4 && !STOPWORDS.has(token));
}

function teachingEndorses(option: string, explanation: string): boolean {
  const tokens = contentTokens(option);
  if (tokens.length < 2) return false;
  const sentences = teachingBody(explanation).split(/(?<=[.!?])\s+/);
  for (const sentence of sentences) {
    if (NEGATION.test(sentence)) continue;
    const normalized = bindKey(sentence);
    const hits = tokens.filter((token) => normalized.includes(token));
    if (hits.length >= 2 && hits.length / tokens.length >= 0.5) return true;
  }
  return false;
}

function explanationHasGenericPlaceholder(explanation: string): boolean {
  return explanation.split(/\n+/).some((line) => {
    if (!/\bincorrect\b/i.test(line)) return false;
    return isGenericReason(line);
  });
}

type Quote = {
  reason: string;
  note: string;
};

function expertQuote(meta: unknown, option: string): Quote | null {
  const expert = asRecord(asRecord(meta)?.expertRationale);
  const entries = expert?.whyIncorrect;
  if (!Array.isArray(entries)) return null;
  const wanted = bindKey(option);
  if (wanted.length < 8) return null;
  for (const entry of entries) {
    const record = asRecord(entry);
    if (!record) continue;
    const reported = typeof record.option === "string" ? record.option : "";
    if (!reported || bindKey(reported) !== wanted) continue;
    const correction = typeof record.correction === "string" ? record.correction : "";
    const misconception = typeof record.misconception === "string" ? record.misconception : "";
    const chosen = usableReason(correction) ?? usableReason(misconception);
    const source = [correction, misconception].filter(Boolean).join(" ");
    if (!chosen || !groundedIn(chosen, [source])) continue;
    return {
      reason: chosen,
      note: "Quoted expert whyIncorrect for this option.",
    };
  }
  return null;
}

function explanationQuote(
  option: string,
  explanation: string,
  wrongOptions: readonly string[]
): { quote: Quote | null; rejected: "generic" | "restatement" | "short" | null } {
  const lines = explanation.split(/\n+/);
  let rejected: "generic" | "restatement" | "short" | null = null;
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index] ?? "";
    const named = namedOptions(line, wrongOptions);
    if (!named.includes(option)) continue;
    if (named.length > 1) continue;
    const labeled = reasonFromLabeledLine(line);
    if (labeled.reason && groundedIn(labeled.reason, [explanation])) {
      return {
        quote: { reason: labeled.reason, note: "Quoted the labeled incorrect line that names this option." },
        rejected: null,
      };
    }
    if (labeled.rejected) rejected = labeled.rejected;

    if (!lineIsOptionLabel(line, option)) continue;
    const next = lines[index + 1] ?? "";
    if (namedOptions(next, wrongOptions).length > 0) continue;
    const adjacent = reasonFromLabeledLine(next);
    if (adjacent.reason && groundedIn(adjacent.reason, [explanation])) {
      return {
        quote: { reason: adjacent.reason, note: "Quoted the incorrect line directly under this option." },
        rejected: null,
      };
    }
    if (adjacent.rejected) rejected = adjacent.rejected;
  }
  return { quote: null, rejected };
}

function noteForMissing(input: {
  rejected: "generic" | "restatement" | "short" | null;
  endorsed: boolean;
  genericPlaceholder: boolean;
}): string {
  if (input.rejected === "restatement") {
    return "The stored line restates the answer key and was not used.";
  }
  if (input.rejected === "generic" || input.genericPlaceholder) {
    return "Generic placeholder lines do not name this option.";
  }
  if (input.endorsed) {
    return "Teaching summary treats this option as an appropriate action, so it may be a correct-answer mismatch.";
  }
  if (input.rejected === "short") {
    return "The stored incorrect line is shorter than 20 characters.";
  }
  return "No stored incorrect line names this option.";
}

function preview(text: string, max: number): string {
  const trimmed = collapse(text);
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max - 1)}…`;
}

/**
 * Propose a quote for each wrong option that still fails the distractor check.
 * auto_extract only when every missing option has a grounded quote.
 */
export function proposeDistractorReasons(input: {
  content: ItemQaContent;
  generationMeta?: unknown;
}): DistractorReasonProposal {
  const content = input.content;
  const wrong = listWrongBankOptions(content.options ?? [], content.correctAnswer ?? "");
  const collected = collectedDistractorReasons(content);
  const missing = new Set(
    evaluateRationaleSchema(content)
      .filter((issue) => issue.code === "missing_distractor_reason" && issue.option)
      .map((issue) => issue.option as string)
  );
  const genericPlaceholder = explanationHasGenericPlaceholder(content.explanation ?? "");
  const options: DistractorOptionProposal[] = wrong.map((option) => {
    const existing = collected[option]?.trim() ?? "";
    const existingOk = existing.length >= DISTRACTOR_REASON_MIN && !missing.has(option);
    if (existingOk) {
      return {
        option,
        existingReason: existing,
        proposedReason: null,
        note: "Already has a reason of at least 20 characters.",
      };
    }
    const fromExpert = expertQuote(input.generationMeta, option);
    const fromExplanation = explanationQuote(option, content.explanation ?? "", wrong);
    const quote = fromExpert ?? fromExplanation.quote;
    if (quote && missing.has(option)) {
      return {
        option,
        existingReason: existing || null,
        proposedReason: quote.reason,
        note: quote.note,
      };
    }
    return {
      option,
      existingReason: existing || null,
      proposedReason: null,
      note: noteForMissing({
        rejected: fromExplanation.rejected,
        endorsed: teachingEndorses(option, content.explanation ?? ""),
        genericPlaceholder,
      }),
    };
  });

  const missingOptions = options.filter((option) => missing.has(option.option));
  const grounded = missingOptions.filter((option) => option.proposedReason);
  const classification: DistractorReasonClassification =
    missingOptions.length > 0 && grounded.length === missingOptions.length ? "auto_extract" : "needs_human";
  const notes = [...new Set(missingOptions.map((option) => option.note))];
  let reason: string;
  if (missingOptions.length === 0) {
    reason = "Every wrong option already has a reason of at least 20 characters.";
  } else if (classification === "auto_extract") {
    reason = "Every missing wrong option has a stored incorrect line or expert entry that names that option.";
  } else if (missingOptions.some((option) => option.note.includes("correct-answer mismatch"))) {
    reason =
      "At least one option the key marks wrong is described as appropriate in the stored explanation. No clinical reason was invented.";
  } else if (missingOptions.some((option) => option.note.includes("Generic placeholder"))) {
    reason = "Generic placeholder lines do not name the wrong options, so no reason was proposed.";
  } else if (grounded.length > 0) {
    reason = "Some wrong options have a bound incorrect line. At least one does not, so the item stays for review.";
  } else {
    reason = "No stored incorrect line names every missing wrong option.";
  }
  return { classification, options, reason, notes };
}

export function rowFailsDistractorReason(row: DistractorReasonBankRow): boolean {
  const content = contentFromStoredItem({
    question: row.stem,
    options: row.options,
    correctAnswer: row.correctAnswer,
    explanation: row.explanation,
    itemType: row.itemType,
    references: row.references,
    generationMeta: row.generationMeta,
  });
  return evaluateRationaleSchema(content).some(
    (issue) => issue.code === "missing_distractor_reason" && issue.severity === "error"
  );
}

function rowCodes(row: DistractorReasonBankRow): string[] {
  return readItemQaRecord(row.curationMeta)?.codes ?? [];
}

function contentForRow(row: DistractorReasonBankRow): ItemQaContent {
  return contentFromStoredItem({
    question: row.stem,
    options: row.options,
    correctAnswer: row.correctAnswer,
    explanation: row.explanation,
    itemType: row.itemType,
    references: row.references,
    generationMeta: row.generationMeta,
  });
}

function proposedMap(options: readonly DistractorOptionProposal[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const option of options) {
    if (option.proposedReason && option.proposedReason.length >= DISTRACTOR_REASON_MIN) {
      out[option.option] = option.proposedReason;
    }
  }
  return out;
}

function readStringMap(value: unknown): Record<string, string> {
  const record = asRecord(value);
  if (!record) return {};
  const out: Record<string, string> = {};
  for (const [key, entry] of Object.entries(record)) {
    if (typeof entry === "string" && entry.trim()) out[key] = entry.trim();
  }
  return out;
}

/**
 * Merge quotes into generationMeta.distractorRationale.
 * Select-all rows, and any options envelope that already stores distractorRationale,
 * also receive the same keys. The options array itself is not changed.
 * Returns null unless apply is set and the row is allowed to be written.
 */
export function distractorReasonWrite(input: {
  apply: boolean;
  generationMeta: unknown;
  optionsRaw: string;
  itemType?: string | null;
  proposals: readonly DistractorOptionProposal[];
  classification: DistractorReasonClassification;
  allowlistActive: boolean;
  idAllowlisted: boolean;
  nearDuplicate: boolean;
}): { generationMeta: Record<string, unknown>; options?: string } | null {
  if (!input.apply || input.nearDuplicate) return null;
  const permitted = input.allowlistActive ? input.idAllowlisted : input.classification === "auto_extract";
  if (!permitted) return null;
  const reasons = proposedMap(input.proposals);
  for (const reason of Object.values(reasons)) {
    if (!usableReason(reason)) return null;
  }
  if (!Object.keys(reasons).length) return null;
  if (input.generationMeta != null && asRecord(input.generationMeta) == null) return null;
  const generationMeta = { ...(asRecord(input.generationMeta) ?? {}) };
  generationMeta.distractorRationale = {
    ...readStringMap(generationMeta.distractorRationale),
    ...reasons,
  };
  const options = mergeEnvelopeReasons(input.optionsRaw, reasons, input.itemType);
  if (options && !envelopeOptionsUnchanged(input.optionsRaw, options)) return null;
  return options ? { generationMeta, options } : { generationMeta };
}

function envelopeOptionsUnchanged(beforeRaw: string, afterRaw: string): boolean {
  try {
    const before = JSON.parse(beforeRaw) as unknown;
    const after = JSON.parse(afterRaw) as unknown;
    const beforeOptions =
      before && typeof before === "object" && !Array.isArray(before)
        ? (before as Record<string, unknown>).options
        : before;
    const afterOptions =
      after && typeof after === "object" && !Array.isArray(after)
        ? (after as Record<string, unknown>).options
        : after;
    return JSON.stringify(beforeOptions) === JSON.stringify(afterOptions);
  } catch {
    return false;
  }
}

function mergeEnvelopeReasons(
  optionsRaw: string,
  reasons: Record<string, string>,
  itemType?: string | null
): string | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(optionsRaw);
  } catch {
    return null;
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
  const record = { ...(parsed as Record<string, unknown>) };
  const kind = typeof record.kind === "string" ? record.kind.toLowerCase() : "";
  const type = (itemType ?? "").toLowerCase();
  const selectAll = type === "select_all" || type === "sata" || kind === "select_all" || kind === "sata";
  const existingRaw = record.distractorRationale;
  const hasMap = Boolean(existingRaw && typeof existingRaw === "object" && !Array.isArray(existingRaw));
  if (!selectAll && !hasMap) return null;
  const merged = { ...readStringMap(existingRaw), ...reasons };
  record.distractorRationale = merged;
  return JSON.stringify(record);
}

function itemResolves(options: readonly DistractorOptionProposal[], wouldWrite: boolean): boolean {
  if (!wouldWrite) return false;
  return options.every((option) => {
    const existingOk = (option.existingReason?.length ?? 0) >= DISTRACTOR_REASON_MIN && !option.proposedReason;
    return existingOk || Boolean(option.proposedReason && option.proposedReason.length >= DISTRACTOR_REASON_MIN);
  });
}

export function planDistractorReasonProposals(input: {
  fieldId: string;
  rows: readonly DistractorReasonBankRow[];
  limit?: number;
  allowlist?: ReadonlySet<string> | null;
}): DistractorReasonPlan {
  const allowlistActive = input.allowlist != null;
  const limit = input.limit && input.limit > 0 ? input.limit : 0;
  const autoExtract: DistractorReasonPlanItem[] = [];
  const needsHuman: DistractorReasonPlanItem[] = [];
  const skipped: DistractorReasonSkip[] = [];
  let proposals = 0;
  let truncated = false;

  const sorted = [...input.rows].sort((a, b) => a.id.localeCompare(b.id));
  for (const row of sorted) {
    if (limit > 0 && proposals >= limit) {
      truncated = true;
      break;
    }
    if (row.fieldId !== input.fieldId) {
      skipped.push({ id: row.id, reason: "other_field" });
      continue;
    }
    if (!row.active) {
      skipped.push({ id: row.id, reason: "inactive" });
      continue;
    }
    const codes = rowCodes(row);
    const nearDuplicate = codes.includes(NEAR_DUPLICATE_CODE);
    const flagged = codes.includes("missing_distractor_reason");
    const failing = rowFailsDistractorReason(row);
    if (nearDuplicate && (flagged || failing)) {
      skipped.push({ id: row.id, reason: "near_duplicate" });
      continue;
    }
    if (!flagged && !failing) continue;
    if (!failing) {
      skipped.push({ id: row.id, reason: "already_resolved" });
      continue;
    }

    const proposed = proposeDistractorReasons({
      content: contentForRow(row),
      generationMeta: row.generationMeta,
    });
    const idAllowlisted = input.allowlist?.has(row.id) ?? false;
    const write = distractorReasonWrite({
      apply: true,
      generationMeta: row.generationMeta,
      optionsRaw: row.options,
      itemType: row.itemType,
      proposals: proposed.options,
      classification: proposed.classification,
      allowlistActive,
      idAllowlisted,
      nearDuplicate: false,
    });
    const wouldWrite = write !== null;
    const item: DistractorReasonPlanItem = {
      id: row.id,
      fieldId: row.fieldId,
      subjectId: row.subjectId,
      qaPassed: row.qaPassed,
      itemType: row.itemType ?? null,
      classification: proposed.classification,
      options: proposed.options,
      reason: proposed.reason,
      notes: proposed.notes,
      stemPreview: preview(row.stem, 160),
      wouldWrite,
      wouldResolve: itemResolves(proposed.options, wouldWrite),
      codes,
    };
    proposals += 1;
    if (item.classification === "auto_extract") autoExtract.push(item);
    else needsHuman.push(item);
  }

  const failingDistractorBefore = autoExtract.length + needsHuman.length;
  const wouldWrite = [...autoExtract, ...needsHuman].filter((item) => item.wouldWrite).length;
  const failingDistractorAfter = [...autoExtract, ...needsHuman].filter((item) => !item.wouldResolve).length;
  return {
    fieldId: input.fieldId,
    autoExtract,
    needsHuman,
    skipped,
    failingDistractorBefore,
    wouldWrite,
    failingDistractorAfter,
    truncated,
  };
}

export function parseDistractorAllowlist(text: string): string[] {
  const ids: string[] = [];
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    if (/\s/.test(trimmed)) {
      throw new Error(`Allowlist ids must be one per line. No rows were changed. Offending line: ${trimmed}`);
    }
    ids.push(trimmed);
  }
  return ids;
}

export function parseProposeDistractorReasonArgs(argv: readonly string[]): ProposeDistractorReasonArgs {
  const parsed: ProposeDistractorReasonArgs = {
    field: "",
    limit: 0,
    apply: false,
    outDir: "artifacts",
  };
  const args = [...argv];
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === "--field" && args[i + 1]) parsed.field = args[++i] ?? "";
    else if (arg === "--subject" && args[i + 1]) parsed.subject = args[++i];
    else if (arg === "--limit" && args[i + 1]) parsed.limit = Number.parseInt(args[++i] ?? "", 10) || 0;
    else if (arg === "--out" && args[i + 1]) parsed.outDir = args[++i] ?? parsed.outDir;
    else if (arg === "--ids-file" && args[i + 1]) parsed.idsFile = args[++i];
    else if (arg === "--apply") parsed.apply = true;
    else if (arg === "--dry-run") parsed.apply = false;
    else {
      throw new Error(
        `Unknown argument: ${arg ?? ""}. Expected --field, --subject, --limit, --out, --ids-file, --dry-run, or --apply. No rows were changed.`
      );
    }
  }
  if (args.includes("--apply") && args.includes("--dry-run")) {
    throw new Error("Pass either --apply or --dry-run, not both. No rows were changed.");
  }
  if (!parsed.field || parsed.field.startsWith("--")) {
    throw new Error("Pass --field <fieldId> (for example --field nursing). No rows were changed.");
  }
  return parsed;
}

/** Option texts inside an options envelope or a plain JSON array. */
export function bankOptionTexts(optionsRaw: string): string[] {
  return parseBankOptions(optionsRaw).options;
}
