/**
 * QA gate for hand-crafted NPTE-PT physician-educator vignettes before bank sync.
 */
import type { EnrichedBankItem } from "../seed-helpers";
import { NPTE_PT_TASK_CATEGORIES } from "@/lib/edtech/learning-hub/npte-pt-learning-paths";
import { NPTE_PT_SUBJECTS } from "@/lib/subjects/npte-pt/subjects";

export type NptePtQualityIssue = {
  itemIndex: number;
  subjectId?: string;
  code: string;
  message: string;
};

export type NptePtQualityReport = {
  ok: boolean;
  itemCount: number;
  issues: NptePtQualityIssue[];
};

const AI_TELLTALE_PATTERNS: RegExp[] = [
  /\bit is important to note\b/i,
  /\bas an ai\b/i,
  /\bin conclusion\b/i,
  /\bfurthermore\b/i,
  /\bcomprehensive understanding\b/i,
  /\bplays a crucial role\b/i,
];

/** PT vignettes: vitals/labs plus ROM (°), MMT (/5), goniometry, distances, scores. */
const CLINICAL_DATA_PATTERN =
  /\d+\s*(?:mg\/dL|mEq\/L|mm Hg|mmHg|bpm|\/min|× 10|g\/dL|mIU\/mL|°C|°F|°|U\/L|mm|cm|kg|lb|m\/s|m\b|MET|L\/min|cm H₂O|SpO₂|FEV|Borg|W|sec|seconds|pads|%)|\d+\/\d+|\d+\.\d+|GCS\s*\d+/i;

const AGE_PATTERN = /\b\d{1,3}[- ](?:year|month|week|day)[- ]old\b/i;

const LEAD_IN_PATTERN =
  /(?:most likely|most appropriate|most important|most comprehensive|most realistic|most supported|most favorable|best explains|best describes|best supports|highest priority|next step|appropriate scope|appropriate action|appropriate professional|supports ventilator|complements wound|addressed first|Which action|What is the most|Which conclusion|Which recommendation|Which precaution|Which modification|Which adjustment|Which measure|Which factor|Which explanation|Which positioning|Which role|Which appraisal|Which communication|Which approach|Which plan|Which monitoring|Which exercise|Which training|Which loading|Which combination|Which diagnosis|Which intervention|Which examination|Which finding|Which assistive|Which modality|Which education|Which outcome|Which strategy|Which rationale|Which activity|Which component|Which statement|Which issue|Which prognosis|diagnosis|management|treatment|initial|mechanism)/i;

const VALID_SUBJECTS = new Set(NPTE_PT_SUBJECTS.map((s) => s.id));
const VALID_TASKS = new Set<string>(NPTE_PT_TASK_CATEGORIES.map((t) => t.id));

export function assessNptePtPhysicianEducatorItem(
  item: EnrichedBankItem,
  index: number
): NptePtQualityIssue[] {
  const issues: NptePtQualityIssue[] = [];
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
    push("stem_lead_in", "Stem should use NPTE_PT_style lead-in (e.g. most likely, most appropriate).");
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
    push("item_type", "NPTE-PT items should use itemType vignette or mcq.");
  }

  if (!subjectId?.trim() || !VALID_SUBJECTS.has(subjectId)) {
    push("subject_id", `subjectId must be a valid NPTE-PT content category; got "${subjectId}".`);
  }

  const nonClinicalSubjects = new Set([
    "professional-responsibilities",
    "research-evidence",
  ]);
  if (!nonClinicalSubjects.has(subjectId ?? "") && !AGE_PATTERN.test(vignette || stem)) {
    push("vignette_age", "Clinical vignette should include patient age.");
  }

  if (
    !nonClinicalSubjects.has(subjectId ?? "") &&
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

  if (!tags.includes("NPTE-PT-2026") && !tags.includes("NPTE-PT-2024")) {
    push("blueprint_tag", 'Missing "NPTE-PT-2026" blueprint tag.');
  }

  for (const pattern of AI_TELLTALE_PATTERNS) {
    if (pattern.test(combined)) {
      push("ai_phrasing", `Possible AI telltale phrasing: ${pattern.source}`);
      break;
    }
  }

  return issues;
}

export function assessNptePtPhysicianEducatorBatch(
  items: EnrichedBankItem[]
): NptePtQualityReport {
  const issues = items.flatMap((item, index) =>
    assessNptePtPhysicianEducatorItem(item, index)
  );
  return { ok: issues.length === 0, itemCount: items.length, issues };
}

export function assertNptePtPhysicianEducatorQuality(items: EnrichedBankItem[]): void {
  const report = assessNptePtPhysicianEducatorBatch(items);
  if (report.ok) return;
  const lines = report.issues.map(
    (i) => `[#${i.itemIndex}${i.subjectId ? ` ${i.subjectId}` : ""}] ${i.code}: ${i.message}`
  );
  throw new Error(
    `NPTE-PT physician-educator QA failed (${report.issues.length} issue(s)):\n${lines.join("\n")}`
  );
}
