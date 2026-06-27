/**
 * USMLE full-exam item quality assessment — dedicated gate for block-style practice exams.
 */
import type { BankItem } from "@/lib/question-bank";
import { polishUsmleBankItem } from "@/lib/engine/polish/usmle-polish";
import { auditUsmleQaEditor } from "../usmle-qa-editor";
import {
  normalizeUsmleBankItemFields,
  usmleBankItemHasClinicalScenario,
} from "../usmle-clinical-gate";
import type { UsmleStepLevel } from "./types";

export type UsmleFullExamQcReport = {
  ok: boolean;
  tier: "best" | "acceptable" | "reject";
  score: number;
  issues: string[];
};

const AGE_PATTERN = /\b\d{1,3}[- ](?:year|month|week|day)[- ]old\b/i;
const CLINICAL_DATA_PATTERN =
  /\d+\s*(?:mg\/dL|mEq\/L|mm Hg|mmHg|\/min|bpm|× 10|g\/dL|mIU\/mL|°C|°F|U\/L|mm|%|SpO₂?|pH\s*\d)/i;
const LEAD_IN_PATTERN =
  /(?:most likely|most appropriate|best explains|best describes|mechanism|next step|next best|diagnosis|management|treatment|underlying cause|initial test|which of the following|what is the|what are the|how should|why does|where is|when should)/i;

const FULL_EXAM_ITEM_TYPES = new Set([
  "vignette",
  "mcq",
  "exhibit",
  "biostats",
  "ethics",
  "sequential",
  "lab_interpretation",
]);

/** Minimum QA editor score for full-exam AI items (serve bar). */
const FULL_EXAM_MIN_SCORE = 7;

/** Normalize and enrich AI-generated full-exam items before QA. */
export function normalizeUsmleFullExamItem(item: BankItem, slotMeta?: {
  stepLevel?: UsmleStepLevel;
  blueprintSystem?: string;
  physicianTask?: string;
}): BankItem {
  let normalized = normalizeUsmleBankItemFields(item);
  const ngn = { ...(normalized.ngnPayload ?? {}) };

  if (slotMeta?.stepLevel) ngn.stepLevel = slotMeta.stepLevel;
  if (slotMeta?.blueprintSystem) {
    ngn.blueprintSystem = slotMeta.blueprintSystem;
    normalized = { ...normalized, blueprintDomain: normalized.blueprintDomain ?? slotMeta.blueprintSystem };
  }
  if (slotMeta?.physicianTask) ngn.physicianTask = slotMeta.physicianTask;

  const tags = [...new Set([...(normalized.tags ?? []), "usmle-full-exam", "USMLE-2026"])];

  let vignette = normalized.vignette?.trim() ?? "";
  let question = normalized.question?.trim() ?? "";
  if (question && !question.endsWith("?")) {
    question = `${question.replace(/[.!]+$/, "")}?`;
    normalized = { ...normalized, question };
  }
  if (vignette && !CLINICAL_DATA_PATTERN.test(vignette)) {
    const labTable = ngn.labTable ?? ngn.chartData;
    if (labTable && typeof labTable === "object") {
      vignette = `${vignette}\nLaboratory studies: ${JSON.stringify(labTable)}`;
      normalized = { ...normalized, vignette };
    }
  }

  return { ...normalized, tags, ngnPayload: ngn };
}

export function assessUsmleFullExamItem(
  item: BankItem,
  index: number,
  stepLevel: UsmleStepLevel
): UsmleFullExamQcReport {
  const issues: string[] = [];
  const fieldId =
    stepLevel === "step1"
      ? "usmle-step-1"
      : stepLevel === "step3"
        ? "usmle-step-3"
        : "usmle-step-2";
  const subjectId = item.subjectId ?? "internal-medicine";

  const polished = polishUsmleBankItem(item, fieldId, subjectId, "USMLE", index);
  const normalized = normalizeUsmleBankItemFields(polished.item);

  const report = auditUsmleQaEditor(normalized, {
    fieldId,
    source: "ai-curated",
    itemId: normalized.id,
    difficulty: normalized.difficulty ?? null,
  });

  if (report.overallScore < FULL_EXAM_MIN_SCORE) {
    issues.push(`qa_score_low:${report.overallScore}`);
  }
  for (const issue of report.issues) {
    if (issue.severity === "error") issues.push(issue.code);
  }

  const itemType = normalized.itemType ?? "vignette";
  if (!FULL_EXAM_ITEM_TYPES.has(itemType)) {
    issues.push("invalid_item_type");
  }

  const explanation = normalized.explanation?.trim() ?? "";
  const minExplanation = itemType === "biostats" || itemType === "ethics" ? 100 : 120;
  if (explanation.length < minExplanation) issues.push("explanation_too_short");

  const hasDistractorTeaching =
    /why (each|other|the other) (option|choice|distractor)/i.test(explanation) ||
    /incorrect because/i.test(explanation) ||
    Boolean(normalized.distractorRationale);
  if (itemType !== "biostats" && !hasDistractorTeaching) {
    issues.push("missing_distractor_rationales");
  }

  const stem = normalized.question?.trim() ?? "";
  if (!stem.endsWith("?")) issues.push("stem_question");
  if (!LEAD_IN_PATTERN.test(stem)) issues.push("stem_lead_in");

  const options = normalized.options ?? [];
  if (options.length < 4) issues.push("options_count");
  if (options.length >= 4 && !options.includes(normalized.correctAnswer)) {
    issues.push("correct_not_in_options");
  }

  const vignette = normalized.vignette?.trim() ?? "";
  const exemptVignette = itemType === "biostats";
  if (!exemptVignette) {
    if (vignette.length < 80) issues.push("missing_vignette");
    if (!AGE_PATTERN.test(vignette)) issues.push("vignette_age");
    if (!CLINICAL_DATA_PATTERN.test(vignette)) issues.push("vignette_data");
    if (!usmleBankItemHasClinicalScenario(normalized)) issues.push("serve_gate_fail");
  }

  const step = normalized.ngnPayload?.stepLevel;
  if (step !== "step1" && step !== "step2" && step !== "step3") issues.push("step_level");

  if (!normalized.tags?.includes("usmle-full-exam")) issues.push("missing_exam_tag");

  const uniqueIssues = [...new Set(issues)];
  const clinicalOk =
    exemptVignette || usmleBankItemHasClinicalScenario(normalized);
  const ok =
    uniqueIssues.length === 0 &&
    report.overallScore >= FULL_EXAM_MIN_SCORE &&
    clinicalOk;

  return {
    ok,
    tier: ok ? "best" : report.overallScore >= 6 ? "acceptable" : "reject",
    score: report.overallScore,
    issues: uniqueIssues,
  };
}

export function usmleFullExamItemPasses(
  item: BankItem,
  index: number,
  stepLevel: UsmleStepLevel
): boolean {
  return assessUsmleFullExamItem(item, index, stepLevel).ok;
}
