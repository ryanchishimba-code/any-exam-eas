/**
 * QA gate for hand-crafted MPJE physician-educator items before bank sync.
 */
import type { EnrichedBankItem } from "./seed-helpers";

export type MpjeQualityIssue = {
  itemIndex: number;
  subjectId?: string;
  code: string;
  message: string;
};

export type MpjeQualityReport = {
  ok: boolean;
  itemCount: number;
  issues: MpjeQualityIssue[];
};

const AI_TELLTALE_PATTERNS: RegExp[] = [
  /\bit is important to note\b/i,
  /\bas an ai\b/i,
  /\bin conclusion\b/i,
  /\bfurthermore\b/i,
  /\bmoreover\b/i,
  /\bcomprehensive understanding\b/i,
  /\bdelves into\b/i,
  /\bnavigate the complexities\b/i,
  /\bit'?s worth noting\b/i,
  /\bplays a crucial role\b/i,
  /\bin today'?s world\b/i,
];

const AGE_PATTERN = /\b\d{1,3}[- ]year[- ]old\b|\b\d{1,3}\s*y\/o\b/i;

const LEAD_IN_PATTERN =
  /(?:most appropriate|most likely|required|prohibited|which of the following|what is the pharmacist|what action|what should|may the pharmacist|must the pharmacist|is it permissible|best describes|how should)/i;

const MPJE_ITEM_TYPES = new Set(["mcq", "vignette"]);

function isPureMcq(item: EnrichedBankItem): boolean {
  return item.itemType === "mcq";
}

function hasPatientScenario(item: EnrichedBankItem): boolean {
  const text = `${item.vignette ?? ""}\n${item.question ?? ""}`;
  return AGE_PATTERN.test(text) || /\bpatient\b/i.test(text);
}

export function assessMpjePhysicianEducatorItem(
  item: EnrichedBankItem,
  index: number
): MpjeQualityIssue[] {
  const issues: MpjeQualityIssue[] = [];
  const subjectId = item.subjectId;
  const push = (code: string, message: string) =>
    issues.push({ itemIndex: index, subjectId, code, message });

  const vignette = item.vignette?.trim() ?? "";
  const stem = item.question?.trim() ?? "";
  const explanation = item.explanation?.trim() ?? "";
  const options = item.options ?? [];
  const combined = `${vignette}\n${stem}\n${explanation}`;
  const itemType = item.itemType ?? "mcq";

  const minVignetteLength = isPureMcq(item) ? 0 : 60;
  if (vignette.length < minVignetteLength) {
    push(
      "vignette_length",
      `Vignette should be at least ${minVignetteLength} characters for ${itemType}.`
    );
  }

  if (!stem || stem.length < 20) {
    push("stem_length", "Question stem is missing or too short.");
  }

  if (!stem.includes("?")) {
    push("stem_question", "Lead-in should include a question mark.");
  }

  if (!LEAD_IN_PATTERN.test(stem)) {
    push(
      "stem_lead_in",
      "Stem should use MPJE-style lead-in (e.g. most appropriate, required, prohibited)."
    );
  }

  if (options.length < 4 || options.length > 5) {
    push("mcq_options_count", `MCQ/vignette expects 4–5 options; got ${options.length}.`);
  }

  if (!item.correctAnswer?.trim()) {
    push("correct_missing", "correctAnswer is required.");
  } else if (!options.includes(item.correctAnswer)) {
    push("correct_not_in_options", "correctAnswer must exactly match one option string.");
  }

  const uniqueOptions = new Set(options.map((o) => o.trim().toLowerCase()));
  if (options.length > 0 && uniqueOptions.size !== options.length) {
    push("options_duplicate", "Answer options must be unique.");
  }

  if (explanation.length < 100) {
    push(
      "explanation_length",
      "Explanation should be at least 100 characters (jurisprudence board-style rationale)."
    );
  }

  const blueprint = item.blueprintDomain ?? "";
  if (blueprint !== "umpje-uniform" && blueprint !== "mpje-jurisprudence") {
    push("blueprint_domain", "blueprintDomain must be umpje-uniform or mpje-jurisprudence.");
  }

  if (item.difficulty == null || item.difficulty < 1 || item.difficulty > 5) {
    push("difficulty", "difficulty must be set between 1 and 5.");
  }

  if (!MPJE_ITEM_TYPES.has(itemType)) {
    push("item_type", "Physician-educator MPJE batch should use mcq or vignette.");
  }

  if (!item.subjectId?.trim()) {
    push("subject_id", "subjectId is required.");
  }

  const exemptAge = isPureMcq(item) || !hasPatientScenario(item);
  if (!exemptAge && !AGE_PATTERN.test(`${vignette}\n${stem}`)) {
    push("vignette_age", "Patient scenario items should include age (e.g. 68-year-old or 68 y/o).");
  }

  for (const pattern of AI_TELLTALE_PATTERNS) {
    if (pattern.test(combined)) {
      push("ai_phrasing", `Possible AI telltale phrasing: ${pattern.source}`);
      break;
    }
  }

  const tags = item.tags ?? [];
  if (!tags.includes("physician-educator")) {
    push("batch_tag", 'Missing "physician-educator" tag for curated batch tracking.');
  }

  if (!tags.includes("mpje")) {
    push("mpje_tag", 'Missing "mpje" tag for field routing.');
  }

  return issues;
}

export function assessMpjePhysicianEducatorBatch(
  items: EnrichedBankItem[]
): MpjeQualityReport {
  const issues = items.flatMap((item, index) => assessMpjePhysicianEducatorItem(item, index));
  return {
    ok: issues.length === 0,
    itemCount: items.length,
    issues,
  };
}

/** Vitest / CI — throws with a readable summary when QA fails. */
export function assertMpjePhysicianEducatorQuality(items: EnrichedBankItem[]): void {
  const report = assessMpjePhysicianEducatorBatch(items);
  if (report.ok) return;

  const lines = report.issues.map(
    (i) => `[#${i.itemIndex}${i.subjectId ? ` ${i.subjectId}` : ""}] ${i.code}: ${i.message}`
  );
  throw new Error(
    `MPJE physician-educator QA failed (${report.issues.length} issue(s)):\n${lines.join("\n")}`
  );
}
