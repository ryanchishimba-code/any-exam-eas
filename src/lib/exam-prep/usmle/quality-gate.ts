/**
 * USMLE full-exam item quality assessment — wraps board QA gates.
 */
import type { BankItem } from "@/lib/question-bank";
import { polishUsmleBankItem } from "@/lib/engine/polish/usmle-polish";
import { auditUsmleQaEditor } from "../usmle-qa-editor";
import { usmleBankItemIsServeReady } from "../usmle-clinical-gate";
import { assessUsmlePhysicianEducatorItem } from "../usmle-physician-educator-quality";
import type { EnrichedBankItem } from "../seed-helpers";
import type { UsmleStepLevel } from "./types";

export type UsmleFullExamQcReport = {
  ok: boolean;
  tier: "best" | "acceptable" | "reject";
  score: number;
  issues: string[];
};

export function assessUsmleFullExamItem(
  item: BankItem,
  index: number,
  stepLevel: UsmleStepLevel
): UsmleFullExamQcReport {
  const issues: string[] = [];
  const fieldId = stepLevel === "step1" ? "usmle-step-1" : "usmle-step-2";
  const subjectId = item.subjectId ?? "internal-medicine";

  const polished = polishUsmleBankItem(item, subjectId, fieldId, index);
  const normalized = polished.item;

  const report = auditUsmleQaEditor(normalized, {
    fieldId,
    source: "ai-curated",
    itemId: normalized.id,
    difficulty: normalized.difficulty ?? null,
  });

  if (!report.examReady) {
    for (const issue of report.issues) {
      if (issue.severity === "error") issues.push(issue.code);
    }
  }

  if (!usmleBankItemIsServeReady(normalized, fieldId)) {
    issues.push("serve_gate_fail");
  }

  const explanation = normalized.explanation?.trim() ?? "";
  const itemType = normalized.itemType ?? "vignette";
  const minExplanation =
    itemType === "biostats" ? 100 : itemType === "ethics" ? 100 : 140;

  if (explanation.length < minExplanation) issues.push("explanation_too_short");

  const hasDistractorTeaching =
    /why (each|other|the other) (option|choice|distractor)/i.test(explanation) ||
    /incorrect because/i.test(explanation) ||
    Boolean(normalized.distractorRationale);

  if (itemType !== "biostats" && !hasDistractorTeaching) {
    issues.push("missing_distractor_rationales");
  }

  const vignette = normalized.vignette?.trim() ?? "";
  if (itemType !== "biostats" && vignette.length < 80) {
    issues.push("missing_vignette");
  }

  const peIssues = assessUsmlePhysicianEducatorItem(normalized as EnrichedBankItem, index);
  for (const si of peIssues) {
    if (!issues.includes(si.code)) issues.push(si.code);
  }

  const uniqueIssues = [...new Set(issues)];
  const ok = uniqueIssues.length === 0 && report.examReady;

  return {
    ok,
    tier: ok ? "best" : report.examReady ? "acceptable" : "reject",
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
