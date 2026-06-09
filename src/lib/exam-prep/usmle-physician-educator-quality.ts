/**
 * QA gate for hand-crafted USMLE physician-educator vignettes before bank sync.
 */
import type { EnrichedBankItem } from "./seed-helpers";

export type UsmleQualityIssue = {
  itemIndex: number;
  subjectId?: string;
  code: string;
  message: string;
};

export type UsmleQualityReport = {
  ok: boolean;
  itemCount: number;
  issues: UsmleQualityIssue[];
};

/** Phrasing that often reads as generic AI output — flag in editorial QA. */
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

const CLINICAL_DATA_PATTERN =
  /\d+\s*(?:mg\/dL|mEq\/L|mm Hg|\/min|× 10|g\/dL|mIU\/mL|°C|°F|U\/L|mm|%)/;

const AGE_PATTERN = /\b\d{1,3}[- ]year[- ]old\b/i;

const LEAD_IN_PATTERN =
  /(?:most likely|most appropriate|best explains|best describes|mechanism|next step|diagnosis|management|treatment|prophylactic)/i;

export function assessUsmlePhysicianEducatorItem(
  item: EnrichedBankItem,
  index: number
): UsmleQualityIssue[] {
  const issues: UsmleQualityIssue[] = [];
  const subjectId = item.subjectId;
  const push = (code: string, message: string) =>
    issues.push({ itemIndex: index, subjectId, code, message });

  const vignette = item.vignette?.trim() ?? "";
  const stem = item.question?.trim() ?? "";
  const explanation = item.explanation?.trim() ?? "";
  const options = item.options ?? [];
  const combined = `${vignette}\n${stem}\n${explanation}`;

  if (!vignette || vignette.length < 120) {
    push("vignette_length", "Vignette should be at least 120 characters with clinical context.");
  }

  if (!stem || stem.length < 20) {
    push("stem_length", "Question stem is missing or too short.");
  }

  if (!stem.endsWith("?")) {
    push("stem_question", "Lead-in should end with a question mark.");
  }

  if (!LEAD_IN_PATTERN.test(stem)) {
    push("stem_lead_in", "Stem should use USMLE-style lead-in (e.g. most likely, most appropriate).");
  }

  if (options.length < 4 || options.length > 6) {
    push("options_count", `Expected 4–6 options; got ${options.length}.`);
  }

  const uniqueOptions = new Set(options.map((o) => o.trim().toLowerCase()));
  if (uniqueOptions.size !== options.length) {
    push("options_duplicate", "Answer options must be unique.");
  }

  if (!item.correctAnswer?.trim()) {
    push("correct_missing", "correctAnswer is required.");
  } else if (!options.includes(item.correctAnswer)) {
    push("correct_not_in_options", "correctAnswer must exactly match one option string.");
  }

  if (explanation.length < 100) {
    push("explanation_length", "Explanation should be at least 100 characters (UWorld-style rationale).");
  }

  const stepLevel = item.ngnPayload?.stepLevel;
  if (stepLevel !== "step1" && stepLevel !== "step2" && stepLevel !== "step3") {
    push("step_level", "ngnPayload.stepLevel must be step1, step2, or step3.");
  }

  if (!item.blueprintDomain?.trim()) {
    push("blueprint_domain", "blueprintDomain is required for USMLE tagging.");
  }

  if (item.difficulty == null || item.difficulty < 1 || item.difficulty > 5) {
    push("difficulty", "difficulty must be set between 1 and 5.");
  }

  if (item.itemType !== "vignette") {
    push("item_type", "Physician-educator batch items should use itemType vignette.");
  }

  if (!item.subjectId?.trim()) {
    push("subject_id", "subjectId is required.");
  }

  const exemptAge = item.subjectId === "biostatistics";
  if (!exemptAge && !AGE_PATTERN.test(vignette)) {
    push("vignette_age", "Vignette should include patient age (e.g. 68-year-old).");
  }

  const exemptNumericData =
    item.blueprintDomain === "Social Sciences" ||
    item.subjectId === "ethics" ||
    item.subjectId === "biostatistics";
  if (!exemptNumericData && !CLINICAL_DATA_PATTERN.test(vignette)) {
    push("vignette_data", "Vignette should include numeric vitals, labs, or imaging data.");
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

  return issues;
}

export function assessUsmlePhysicianEducatorBatch(
  items: EnrichedBankItem[]
): UsmleQualityReport {
  const issues = items.flatMap((item, index) => assessUsmlePhysicianEducatorItem(item, index));
  return {
    ok: issues.length === 0,
    itemCount: items.length,
    issues,
  };
}

/** Vitest / CI — throws with a readable summary when QA fails. */
export function assertUsmlePhysicianEducatorQuality(items: EnrichedBankItem[]): void {
  const report = assessUsmlePhysicianEducatorBatch(items);
  if (report.ok) return;

  const lines = report.issues.map(
    (i) => `[#${i.itemIndex}${i.subjectId ? ` ${i.subjectId}` : ""}] ${i.code}: ${i.message}`
  );
  throw new Error(
    `USMLE physician-educator QA failed (${report.issues.length} issue(s)):\n${lines.join("\n")}`
  );
}
