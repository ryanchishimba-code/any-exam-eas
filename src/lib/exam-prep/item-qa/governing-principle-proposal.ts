/**
 * Propose a governing principle from text the item already stores.
 *
 * Dry-run listing is the default. The only write is `generationMeta.governingPrinciple`.
 * Stem, options, explanation, qaPassed, and active are never part of the write.
 * Near-duplicate rows are never written.
 * Nothing is paraphrased: a proposal is a whitespace-collapsed span of stored text.
 */
import { parseBankOptions } from "@/lib/mpje/parse-bank-options";
import { NEAR_DUPLICATE_CODE, readItemQaRecord } from "./flag";
import { contentFromStoredItem, evaluateRationaleSchema } from "./rationale-schema";

/** Same floor `readPrinciple` uses before the schema accepts a principle. */
export const GOVERNING_PRINCIPLE_MIN = 24;
/** Short enough to teach. Longer spans stay in the review queue. */
export const GOVERNING_PRINCIPLE_AUTO_MAX = 200;
/** A reviewed allowlist may accept a slightly longer quoted span. */
export const GOVERNING_PRINCIPLE_REVIEW_MAX = 280;

export type PrincipleClassification = "auto_extract" | "needs_human";

export type PrincipleSource =
  | "expert_pearl"
  | "correct_label"
  | "lead_sentence"
  | "prioritize_hypotheses"
  | "key_takeaway"
  | "clinical_reasoning"
  | "none";

export type PrincipleProposal = {
  classification: PrincipleClassification;
  proposedPrinciple: string;
  reason: string;
  source: PrincipleSource;
  alternates: string[];
};

export type GoverningPrincipleBankRow = {
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

export type PrincipleSkipReason =
  | "inactive"
  | "other_field"
  | "near_duplicate"
  | "already_resolved";

export type PrincipleSkip = {
  id: string;
  reason: PrincipleSkipReason;
};

export type PrinciplePlanItem = {
  id: string;
  fieldId: string;
  subjectId: string;
  qaPassed: boolean;
  classification: PrincipleClassification;
  proposedPrinciple: string;
  reason: string;
  source: PrincipleSource;
  alternates: string[];
  stemPreview: string;
  explanationExcerpt: string;
  wouldWrite: boolean;
  codes: string[];
};

export type GoverningPrinciplePlan = {
  fieldId: string;
  autoExtract: PrinciplePlanItem[];
  needsHuman: PrinciplePlanItem[];
  skipped: PrincipleSkip[];
  /** Candidate rows that still fail the principle check. */
  failingPrincipleBefore: number;
  /** Rows an --apply with this allowlist would update. */
  wouldWrite: number;
  /** Predicted failing count in this candidate set after those writes. */
  failingPrincipleAfter: number;
  /** True when --limit stopped the scan before later ids were classified. */
  truncated: boolean;
};

export type ProposeGoverningPrincipleArgs = {
  field: string;
  subject?: string;
  limit: number;
  apply: boolean;
  idsFile?: string;
  outDir: string;
};

const RULE_CUE =
  /\b(?:priorit\w*|principles?|life[-\s]threatening|most urgent|most important|immediate safety|key component|precedence|scope of practice|delegat\w*|informed consent|therapeutic communication|open-ended)\b/i;

const RULE_WORD = /\brules?\b/i;
const RULE_OUT = /\brule out\b/gi;
const ANSWER_RESTATEMENT =
  /^(?:the\s+)?(?:correct|best)\s+(?:answer|response|action|option)\s+is\b/i;
const STEP_LINE =
  /^(?:clinical reasoning:\s*|clinical judgment\s*\(cjmm\):\s*)?(?:\d+\.\s*)?(?:recognize cues|analyze cues|prioritize hypotheses|generate solutions|take action|evaluate outcomes)\s*:/i;
const BOILERPLATE = [
  /plausible (?:nursing )?action but not the first priority/i,
  /review the client presentation and clinical data/i,
  /reassess the client after intervention and document/i,
  /correct eventually/i,
  /teaching or screening task unrelated/i,
  /unsafe to prioritize before abc stabilization/i,
];
const WEAK_FIRST =
  /\b(?:for the )?first (?:time|day|dose|episode|hour)\b/i;
const STRONG_FIRST = /\b(?:step|action|priority|notify|assess|intervention)\b/i;
const TEMPORAL =
  /\b(?:days?|hours?|weeks?|months?|years?|yesterday|today|tomorrow|ago|admission|this morning|last night)\b/i;
const COPULA = /\b(?:is|are|requires?|comes|takes|means)\b/i;
const CITATION_TAIL =
  /\s+\((?:[^)]*(?:\b(?:test plan|guideline|edition|ncsbn|cdc|fda)\b|\b20\d{2}\b)[^)]*)\)[.!?]?\s*$/i;

function collapse(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function isBoilerplate(text: string): boolean {
  return BOILERPLATE.some((pattern) => pattern.test(text));
}

export function hasGoverningPrincipleCue(sentence: string): boolean {
  if (!sentence.trim() || isBoilerplate(sentence)) return false;
  if (ANSWER_RESTATEMENT.test(sentence.trim())) return false;
  if (STEP_LINE.test(sentence.trim())) return false;
  if (RULE_CUE.test(sentence)) return true;
  const withoutRuleOut = sentence.replace(RULE_OUT, "");
  if (RULE_WORD.test(withoutRuleOut)) return true;
  if (/\bfirst\b/i.test(sentence)) {
    const weak = WEAK_FIRST.test(sentence);
    if (!weak || STRONG_FIRST.test(sentence)) return true;
  }
  if (/\bbefore\b/i.test(sentence) && !TEMPORAL.test(sentence)) return true;
  return false;
}

function splitSentences(text: string): string[] {
  const cleaned = collapse(text);
  if (!cleaned) return [];
  return cleaned
    .split(/(?<=[.!?])\s+(?=[A-Z0-9“"'])/)
    .map((part) => part.trim())
    .filter((part) => part.length > 0);
}

function splitExplanation(explanation: string): { teaching: string; reasoning: string } {
  const distractorAt = explanation.search(/\n+\s*(?:\*\*)?\s*why other options\b/i);
  const body = (distractorAt >= 0 ? explanation.slice(0, distractorAt) : explanation).trim();
  const markers = [
    body.search(/\n+\s*clinical reasoning\s*:/i),
    body.search(/\n+\s*clinical judgment\s*\(cjmm\)\s*:/i),
  ].filter((index) => index >= 0);
  if (!markers.length) return { teaching: body, reasoning: "" };
  const splitAt = Math.min(...markers);
  return {
    teaching: body.slice(0, splitAt).trim(),
    reasoning: body.slice(splitAt).trim(),
  };
}

function stripTrailingCitation(text: string): string {
  return text.replace(CITATION_TAIL, "").trim();
}

function groundedIn(candidate: string, sources: readonly string[]): boolean {
  const needle = collapse(candidate).toLowerCase();
  if (needle.length < GOVERNING_PRINCIPLE_MIN) return false;
  return sources.some((source) => collapse(source).toLowerCase().includes(needle));
}

function lengthBand(text: string): "auto" | "review" | "reject" {
  const length = collapse(text).length;
  if (length < GOVERNING_PRINCIPLE_MIN) return "reject";
  if (length <= GOVERNING_PRINCIPLE_AUTO_MAX) return "auto";
  if (length <= GOVERNING_PRINCIPLE_REVIEW_MAX) return "review";
  return "reject";
}

function proposal(input: {
  classification: PrincipleClassification;
  proposedPrinciple: string;
  reason: string;
  source: PrincipleSource;
  alternates?: string[];
}): PrincipleProposal {
  return {
    classification: input.classification,
    proposedPrinciple: collapse(input.proposedPrinciple),
    reason: input.reason,
    source: input.source,
    alternates: (input.alternates ?? []).map((line) => collapse(line)).filter(Boolean),
  };
}

function fromSpan(
  text: string,
  source: PrincipleSource,
  sources: readonly string[],
  autoReason: string,
  reviewReason: string
): PrincipleProposal | null {
  const collapsed = collapse(text);
  if (!groundedIn(collapsed, sources) || isBoilerplate(collapsed)) return null;
  const band = lengthBand(collapsed);
  if (band === "auto") {
    return proposal({
      classification: "auto_extract",
      proposedPrinciple: collapsed,
      reason: autoReason,
      source,
    });
  }
  if (band === "review") {
    return proposal({
      classification: "needs_human",
      proposedPrinciple: collapsed,
      reason: reviewReason,
      source,
    });
  }
  return null;
}

function correctLabel(teaching: string, sources: readonly string[]): PrincipleProposal | null {
  if (!/^\s*correct:\s+/i.test(teaching)) return null;
  const raw = collapse(teaching.replace(/^\s*correct:\s+/i, ""));
  const stripped = stripTrailingCitation(raw);
  const body = groundedIn(stripped, sources) ? stripped : raw;
  const direct = fromSpan(
    body,
    "correct_label",
    sources,
    "Quoted the labeled Correct line already stored in the explanation.",
    "The labeled Correct line is longer than 200 characters, so it stays for review."
  );
  if (direct) return direct;
  const first = splitSentences(body).find((sentence) => hasGoverningPrincipleCue(sentence));
  if (!first) return null;
  return fromSpan(
    first,
    "correct_label",
    sources,
    "Quoted the principle sentence inside the labeled Correct line.",
    "The Correct-line sentence is longer than 200 characters, so it stays for review."
  );
}

function ruleSentences(text: string): string[] {
  return splitSentences(text).filter((sentence) => hasGoverningPrincipleCue(sentence));
}

function fromOrderedRules(
  block: string,
  source: PrincipleSource,
  sources: readonly string[]
): PrincipleProposal | null {
  const found = ruleSentences(block).filter(
    (sentence) => lengthBand(sentence) !== "reject" && groundedIn(sentence, sources)
  );
  if (!found.length) return null;
  const opening = splitSentences(block)[0] ?? "";
  const openingIsRule = hasGoverningPrincipleCue(opening) && found.includes(opening);
  if (openingIsRule) {
    const band = lengthBand(opening);
    if (band === "auto") {
      return proposal({
        classification: "auto_extract",
        proposedPrinciple: opening,
        reason: "Quoted the opening principle sentence from the stored explanation.",
        source,
        alternates: found.filter((sentence) => sentence !== opening && lengthBand(sentence) === "auto"),
      });
    }
    return proposal({
      classification: "needs_human",
      proposedPrinciple: opening,
      reason: "The opening principle sentence is longer than 200 characters, so it stays for review.",
      source,
      alternates: found.filter((sentence) => sentence !== opening),
    });
  }
  const auto = found.filter((sentence) => lengthBand(sentence) === "auto");
  if (auto.length === 1) {
    return proposal({
      classification: "auto_extract",
      proposedPrinciple: auto[0]!,
      reason: "Quoted the only principle sentence in the stored explanation.",
      source,
    });
  }
  if (auto.length > 1) {
    return proposal({
      classification: "needs_human",
      proposedPrinciple: auto[0]!,
      reason: "More than one principle sentence is stored, so a person picks the line.",
      source,
      alternates: auto.slice(1),
    });
  }
  return proposal({
    classification: "needs_human",
    proposedPrinciple: found[0]!,
    reason: "The stored principle sentence is longer than 200 characters, so it stays for review.",
    source,
    alternates: found.slice(1),
  });
}

function prioritizeHypotheses(reasoning: string): string {
  const match = reasoning.match(/prioritize hypotheses\s*:\s*([^.!\n]+)/i);
  return match ? collapse(match[1] ?? "") : "";
}

function fromPrioritizeHypotheses(reasoning: string, sources: readonly string[]): PrincipleProposal | null {
  const clause = prioritizeHypotheses(reasoning);
  if (!clause || isBoilerplate(clause) || !groundedIn(clause, sources)) return null;
  const strong = hasGoverningPrincipleCue(clause) || COPULA.test(clause);
  const band = lengthBand(clause);
  if (!strong || band === "reject") return null;
  if (band === "auto" && clause.length <= 160) {
    return proposal({
      classification: "auto_extract",
      proposedPrinciple: clause,
      reason: "Quoted the stored Prioritize Hypotheses line from the clinical-reasoning block.",
      source: "prioritize_hypotheses",
    });
  }
  if (band === "auto" || band === "review") {
    return proposal({
      classification: "needs_human",
      proposedPrinciple: clause,
      reason: "The Prioritize Hypotheses line needs a person to confirm it is the principle.",
      source: "prioritize_hypotheses",
    });
  }
  return null;
}

function weakTeachingSentence(teaching: string, sources: readonly string[]): PrincipleProposal | null {
  const sentences = splitSentences(teaching).filter((sentence) => {
    if (isBoilerplate(sentence) || STEP_LINE.test(sentence)) return false;
    if (ANSWER_RESTATEMENT.test(sentence)) return false;
    return lengthBand(sentence) === "auto" || lengthBand(sentence) === "review";
  });
  const quote = sentences.find((sentence) => groundedIn(sentence, sources));
  if (!quote) return null;
  return proposal({
    classification: "needs_human",
    proposedPrinciple: quote,
    reason: "No priority sentence was unambiguous. The opening teaching sentence is quoted for review.",
    source: "lead_sentence",
    alternates: sentences.filter((sentence) => sentence !== quote).slice(0, 3),
  });
}

function readExpertLines(input: {
  expertPearl?: string;
  expertTakeaway?: string;
}): { pearl: string; takeaway: string } {
  return {
    pearl: collapse(input.expertPearl ?? ""),
    takeaway: collapse(input.expertTakeaway ?? ""),
  };
}

/**
 * Extract one short principle from explanation / clinical-reasoning text.
 * Returns needs_human when the stored wording does not contain one clear line.
 */
export function proposeGoverningPrinciple(input: {
  explanation: string;
  clinicalReasoning?: string;
  keyTakeaways?: string[];
  expertPearl?: string;
  expertTakeaway?: string;
}): PrincipleProposal {
  const explanation = input.explanation ?? "";
  const { teaching, reasoning: explanationReasoning } = splitExplanation(explanation);
  const extraReasoning = collapse(input.clinicalReasoning ?? "");
  const reasoning = [explanationReasoning, extraReasoning && !collapse(explanation).toLowerCase().includes(extraReasoning.toLowerCase()) ? extraReasoning : ""]
    .filter(Boolean)
    .join("\n");
  const takeaways = (input.keyTakeaways ?? []).map((line) => collapse(line)).filter(Boolean);
  const expert = readExpertLines(input);
  const sources = [explanation, extraReasoning, ...takeaways, expert.pearl, expert.takeaway].filter(Boolean);
  const expertLine =
    expert.pearl.length >= GOVERNING_PRINCIPLE_MIN ? expert.pearl : expert.takeaway;

  const pearl = fromSpan(
    expertLine,
    "expert_pearl",
    sources,
    "Quoted the expert pearl or key takeaway already stored on the item.",
    "The stored expert pearl is longer than 200 characters, so it stays for review."
  );
  if (pearl) return pearl;

  const labeled = correctLabel(teaching, sources);
  if (labeled) return labeled;

  const lead = fromOrderedRules(teaching, "lead_sentence", sources);
  if (lead) return lead;

  const reasoned = fromOrderedRules(reasoning, "clinical_reasoning", sources);
  if (reasoned) return reasoned;

  const priorityLine = fromPrioritizeHypotheses(reasoning, sources);
  if (priorityLine) return priorityLine;

  if (takeaways.length === 1) {
    const takeaway = fromSpan(
      takeaways[0]!,
      "key_takeaway",
      sources,
      "Quoted the single key takeaway stored with the item.",
      "The stored key takeaway is longer than 200 characters, so it stays for review."
    );
    if (takeaway) return takeaway;
  }
  if (takeaways.length > 1) {
    const first = takeaways.find((line) => groundedIn(line, sources) && lengthBand(line) !== "reject");
    if (first) {
      return proposal({
        classification: "needs_human",
        proposedPrinciple: first,
        reason: "Several key takeaways are stored, so a person picks the principle.",
        source: "key_takeaway",
        alternates: takeaways.filter((line) => line !== first).slice(0, 3),
      });
    }
  }

  const weak = weakTeachingSentence(teaching, sources);
  if (weak) return weak;

  const restatement = splitSentences(teaching).find((sentence) => ANSWER_RESTATEMENT.test(sentence));
  if (restatement && groundedIn(restatement, sources) && lengthBand(restatement) !== "reject") {
    return proposal({
      classification: "needs_human",
      proposedPrinciple: restatement,
      reason: "The explanation restates the answer key and does not state a separate priority rule.",
      source: "lead_sentence",
    });
  }

  return {
    classification: "needs_human",
    proposedPrinciple: "",
    reason: "No grounded principle sentence of at least 24 characters was found in the stored explanation.",
    source: "none",
    alternates: [],
  };
}

function preview(text: string, max: number): string {
  const trimmed = collapse(text);
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max - 1)}…`;
}

function storedPrinciple(meta: unknown): string {
  const value = asRecord(meta)?.governingPrinciple;
  return typeof value === "string" ? value.trim() : "";
}

function expertLinesFromMeta(meta: unknown): { expertPearl?: string; expertTakeaway?: string } {
  const expert = asRecord(asRecord(meta)?.expertRationale);
  if (!expert) return {};
  return {
    expertPearl: typeof expert.clinicalPearl === "string" ? expert.clinicalPearl : undefined,
    expertTakeaway: typeof expert.keyTakeaway === "string" ? expert.keyTakeaway : undefined,
  };
}

export function rowFailsGoverningPrinciple(row: GoverningPrincipleBankRow): boolean {
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
    (issue) => issue.code === "missing_governing_principle" && issue.severity === "error"
  );
}

function rowCodes(row: GoverningPrincipleBankRow): string[] {
  return readItemQaRecord(row.curationMeta)?.codes ?? [];
}

function teachingInputs(row: GoverningPrincipleBankRow): {
  clinicalReasoning?: string;
  keyTakeaways?: string[];
  expertPearl?: string;
  expertTakeaway?: string;
} {
  let clinicalReasoning: string | undefined;
  let keyTakeaways: string[] | undefined;
  try {
    const parsed = parseBankOptions(row.options);
    clinicalReasoning = parsed.clinicalReasoning;
    keyTakeaways = parsed.keyTakeaways;
  } catch {
    clinicalReasoning = undefined;
  }
  const meta = asRecord(row.generationMeta);
  if (!clinicalReasoning && typeof meta?.clinicalReasoning === "string") {
    clinicalReasoning = meta.clinicalReasoning;
  }
  if (!keyTakeaways?.length && Array.isArray(meta?.keyTakeaways)) {
    keyTakeaways = meta.keyTakeaways.filter((entry): entry is string => typeof entry === "string");
  }
  return { clinicalReasoning, keyTakeaways, ...expertLinesFromMeta(row.generationMeta) };
}

function classifyForPlan(row: GoverningPrincipleBankRow): PrincipleProposal {
  const proposed = proposeGoverningPrinciple({
    explanation: row.explanation,
    ...teachingInputs(row),
  });
  const stored = storedPrinciple(row.generationMeta);
  if (stored.length > 0 && stored.length < GOVERNING_PRINCIPLE_MIN && proposed.classification === "auto_extract") {
    return {
      ...proposed,
      classification: "needs_human",
      reason: `${proposed.reason} A shorter governingPrinciple is already stored, so this is not an automatic overwrite.`,
    };
  }
  return proposed;
}

/**
 * Merge a reviewed principle into generationMeta.
 * Returns null unless apply is set and the row is allowed to be written.
 * The return value has no stem, options, explanation, qaPassed, or active field.
 */
export function governingPrincipleWrite(input: {
  apply: boolean;
  generationMeta: unknown;
  proposedPrinciple: string;
  classification: PrincipleClassification;
  /** True when --ids-file was passed. */
  allowlistActive: boolean;
  /** True when this id is on that file. */
  idAllowlisted: boolean;
  nearDuplicate: boolean;
}): { generationMeta: Record<string, unknown> } | null {
  if (!input.apply || input.nearDuplicate) return null;
  const principle = collapse(input.proposedPrinciple);
  const max = input.allowlistActive ? GOVERNING_PRINCIPLE_REVIEW_MAX : GOVERNING_PRINCIPLE_AUTO_MAX;
  if (principle.length < GOVERNING_PRINCIPLE_MIN || principle.length > max) return null;
  const permitted = input.allowlistActive
    ? input.idAllowlisted
    : input.classification === "auto_extract";
  if (!permitted) return null;
  if (input.generationMeta != null && asRecord(input.generationMeta) == null) return null;
  const generationMeta = { ...(asRecord(input.generationMeta) ?? {}) };
  generationMeta.governingPrinciple = principle;
  return { generationMeta };
}

function itemWouldWrite(
  item: Pick<PrinciplePlanItem, "classification" | "proposedPrinciple">,
  nearDuplicate: boolean,
  allowlistActive: boolean,
  idAllowlisted: boolean,
  generationMeta: unknown
): boolean {
  return (
    governingPrincipleWrite({
      apply: true,
      generationMeta,
      proposedPrinciple: item.proposedPrinciple,
      classification: item.classification,
      allowlistActive,
      idAllowlisted,
      nearDuplicate,
    }) !== null
  );
}

export function planGoverningPrincipleProposals(input: {
  fieldId: string;
  rows: readonly GoverningPrincipleBankRow[];
  limit?: number;
  /** When set, --apply writes only these ids (auto_extract or reviewed needs_human). */
  allowlist?: ReadonlySet<string> | null;
}): GoverningPrinciplePlan {
  const allowlistActive = input.allowlist != null;
  const limit = input.limit && input.limit > 0 ? input.limit : 0;
  const autoExtract: PrinciplePlanItem[] = [];
  const needsHuman: PrinciplePlanItem[] = [];
  const skipped: PrincipleSkip[] = [];
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
    const flagged = codes.includes("missing_governing_principle");
    const failing = rowFailsGoverningPrinciple(row);
    if (nearDuplicate && (flagged || failing)) {
      skipped.push({ id: row.id, reason: "near_duplicate" });
      continue;
    }
    if (!flagged && !failing) continue;
    if (!failing) {
      skipped.push({ id: row.id, reason: "already_resolved" });
      continue;
    }

    const proposed = classifyForPlan(row);
    const idAllowlisted = input.allowlist?.has(row.id) ?? false;
    const wouldWrite = itemWouldWrite(proposed, false, allowlistActive, idAllowlisted, row.generationMeta);
    const item: PrinciplePlanItem = {
      id: row.id,
      fieldId: row.fieldId,
      subjectId: row.subjectId,
      qaPassed: row.qaPassed,
      classification: proposed.classification,
      proposedPrinciple: proposed.proposedPrinciple,
      reason: proposed.reason,
      source: proposed.source,
      alternates: proposed.alternates,
      stemPreview: preview(row.stem, 160),
      explanationExcerpt: preview(row.explanation, 280),
      wouldWrite,
      codes,
    };
    proposals += 1;
    if (item.classification === "auto_extract") autoExtract.push(item);
    else needsHuman.push(item);
  }

  const failingPrincipleBefore = autoExtract.length + needsHuman.length;
  const wouldWrite = [...autoExtract, ...needsHuman].filter((item) => item.wouldWrite).length;
  return {
    fieldId: input.fieldId,
    autoExtract,
    needsHuman,
    skipped,
    failingPrincipleBefore,
    wouldWrite,
    failingPrincipleAfter: failingPrincipleBefore - wouldWrite,
    truncated,
  };
}

export function parsePrincipleAllowlist(text: string): string[] {
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

export function parseProposeGoverningPrincipleArgs(argv: readonly string[]): ProposeGoverningPrincipleArgs {
  const parsed: ProposeGoverningPrincipleArgs = {
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
