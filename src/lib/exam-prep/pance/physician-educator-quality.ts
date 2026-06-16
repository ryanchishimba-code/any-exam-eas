/**
 * QA gate for hand-crafted PANCE physician-educator vignettes before bank sync.
 */
import type { EnrichedBankItem } from "../seed-helpers";
import { PANCE_TASK_CATEGORIES } from "@/lib/edtech/learning-hub/pance-learning-paths";
import { PANCE_SUBJECTS } from "@/lib/subjects/pance/subjects";

export type PanceQualityIssue = {
  itemIndex: number;
  subjectId?: string;
  code: string;
  message: string;
};

export type PanceQualityReport = {
  ok: boolean;
  itemCount: number;
  issues: PanceQualityIssue[];
};

const AI_TELLTALE_PATTERNS: RegExp[] = [
  /\bit is important to note\b/i,
  /\bas an ai\b/i,
  /\bin conclusion\b/i,
  /\bfurthermore\b/i,
  /\bcomprehensive understanding\b/i,
  /\bplays a crucial role\b/i,
];

const CLINICAL_DATA_PATTERN =
  /\d+\s*(?:mg\/dL|mEq\/L|mm Hg|\/min|× 10|g\/dL|mIU\/mL|°C|°F|U\/L|mm|%)/;

const AGE_PATTERN = /\b\d{1,3}[- ](?:year|month|week|day)[- ]old\b/i;

const LEAD_IN_PATTERN =
  /(?:most likely|most appropriate|best explains|best describes|next step|diagnosis|management|treatment|initial|mechanism)/i;

const VALID_SUBJECTS = new Set(PANCE_SUBJECTS.map((s) => s.id));
const VALID_TASKS = new Set<string>(PANCE_TASK_CATEGORIES.map((t) => t.id));

export function assessPancePhysicianEducatorItem(
  item: EnrichedBankItem,
  index: number
): PanceQualityIssue[] {
  const issues: PanceQualityIssue[] = [];
  const subjectId = item.subjectId;
  const push = (code: string, message: string) =>
    issues.push({ itemIndex: index, subjectId, code, message });

  const vignette = item.vignette?.trim() ?? "";
  const stem = item.question?.trim() ?? "";
  const explanation = item.explanation?.trim() ?? "";
  const options = item.options ?? [];
  const combined = `${vignette}\n${stem}\n${explanation}`;
  const taskCategory = item.ngnPayload?.taskCategory as string | undefined;

  if (!vignette || vignette.length < 100) {
    push("vignette_length", "Vignette should be at least 100 characters with clinical context.");
  }

  if (!stem || stem.length < 20) {
    push("stem_length", "Question stem is missing or too short.");
  }

  if (!stem.endsWith("?")) {
    push("stem_question", "Lead-in should end with a question mark.");
  }

  if (!LEAD_IN_PATTERN.test(stem)) {
    push("stem_lead_in", "Stem should use PANCE-style lead-in (e.g. most likely, most appropriate).");
  }

  if (options.length !== 4) {
    push("options_count", `Expected exactly 4 options; got ${options.length}.`);
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

  if (explanation.length < 120) {
    push(
      "explanation_length",
      "Explanation should be at least 120 characters with teaching rationale."
    );
  }

  if (!item.blueprintDomain?.trim()) {
    push("blueprint_domain", "blueprintDomain is required for roadmap tagging.");
  }

  if (item.difficulty == null || item.difficulty < 1 || item.difficulty > 5) {
    push("difficulty", "difficulty must be set between 1 and 5.");
  }

  if (item.itemType !== "vignette" && item.itemType !== "mcq") {
    push("item_type", "PANCE items should use itemType vignette or mcq.");
  }

  if (!subjectId?.trim() || !VALID_SUBJECTS.has(subjectId)) {
    push("subject_id", `subjectId must be a valid PANCE content category; got "${subjectId}".`);
  }

  if (subjectId !== "professional-practice" && !AGE_PATTERN.test(vignette || stem)) {
    push("vignette_age", "Clinical vignette should include patient age.");
  }

  if (
    subjectId !== "professional-practice" &&
    !CLINICAL_DATA_PATTERN.test(vignette)
  ) {
    push("vignette_data", "Vignette should include numeric vitals, labs, or imaging data.");
  }

  if (taskCategory && !VALID_TASKS.has(taskCategory)) {
    push("task_category", `Invalid taskCategory "${taskCategory}".`);
  }

  const tags = item.tags ?? [];
  if (!tags.includes("physician-educator")) {
    push("batch_tag", 'Missing "physician-educator" tag for curated batch tracking.');
  }

  if (!tags.includes("PANCE-2025")) {
    push("blueprint_tag", 'Missing "PANCE-2025" blueprint tag.');
  }

  for (const pattern of AI_TELLTALE_PATTERNS) {
    if (pattern.test(combined)) {
      push("ai_phrasing", `Possible AI telltale phrasing: ${pattern.source}`);
      break;
    }
  }

  return issues;
}

export function assessPancePhysicianEducatorBatch(
  items: EnrichedBankItem[]
): PanceQualityReport {
  const issues = items.flatMap((item, index) =>
    assessPancePhysicianEducatorItem(item, index)
  );
  return { ok: issues.length === 0, itemCount: items.length, issues };
}

export function assertPancePhysicianEducatorQuality(items: EnrichedBankItem[]): void {
  const report = assessPancePhysicianEducatorBatch(items);
  if (report.ok) return;
  const lines = report.issues.map(
    (i) => `[#${i.itemIndex}${i.subjectId ? ` ${i.subjectId}` : ""}] ${i.code}: ${i.message}`
  );
  throw new Error(
    `PANCE physician-educator QA failed (${report.issues.length} issue(s)):\n${lines.join("\n")}`
  );
}
