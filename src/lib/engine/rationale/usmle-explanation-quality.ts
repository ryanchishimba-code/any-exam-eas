/**
 * Attending-level quality scorer for USMLE expert rationales.
 * Builds on validateStructuredRationale with Step-aware extras.
 */
import type { ExpertStructuredRationale } from "./expert-rationale-types";
import {
  validateStructuredRationale,
  type RationaleQualityIssue,
  type RationaleQualityVerdict,
} from "./validate-rationale";
import { resolveUsmleExpertStepTone } from "../prompts/usmle-expert-rationale";

export type UsmleExplanationQualityIssue =
  | RationaleQualityIssue
  | "thin_clinical_context"
  | "thin_clinical_pearl"
  | "missing_step_reasoning"
  | "missing_high_yield"
  | "missing_test_tip"
  | "weak_mechanism_language"
  | "weak_next_step_language";

export type UsmleExplanationQualityVerdict = {
  ok: boolean;
  score: number;
  issues: UsmleExplanationQualityIssue[];
};

const MECHANISM_HINTS =
  /\b(mechanism|pathogen|pathophys|inhibits?|stimulates?|receptor|enzyme|mutation|deficiency|toxin|apoptosis|inflammation|ischemia)\b/i;

const NEXT_STEP_HINTS =
  /\b(next\s+(best\s+)?(step|action)|order|start|administer|obtain|urgent|stabilize|monitor|disposition|admit|discharge|consult)\b/i;

function hasMechanismLanguage(expert: ExpertStructuredRationale): boolean {
  const blob = [
    expert.whyCorrect.headline,
    expert.whyCorrect.clinicalContext,
    ...expert.whyCorrect.conceptBreakdown,
    ...expert.stepByStepReasoning,
    expert.pharmacologyTieIn ?? "",
  ].join(" ");
  return MECHANISM_HINTS.test(blob);
}

function hasNextStepLanguage(expert: ExpertStructuredRationale): boolean {
  const blob = [
    expert.whyCorrect.headline,
    expert.whyCorrect.clinicalContext,
    ...expert.stepByStepReasoning,
    expert.nextStepInCare ?? "",
    expert.testTakingTip,
  ].join(" ");
  return NEXT_STEP_HINTS.test(blob);
}

/**
 * Score a USMLE expert rationale before persist.
 * Requires base structured coverage plus attending sections.
 */
export function scoreUsmleExplanationQuality(
  expert: ExpertStructuredRationale,
  options: string[],
  correctAnswer: string,
  fieldId: string
): UsmleExplanationQualityVerdict {
  const base = validateStructuredRationale(expert, options, correctAnswer);
  const issues: UsmleExplanationQualityIssue[] = [...base.issues];
  let score = base.score;

  if ((expert.whyCorrect.clinicalContext?.trim().length ?? 0) < 40) {
    issues.push("thin_clinical_context");
    score -= 12;
  }

  if ((expert.clinicalPearl?.trim().length ?? 0) < 30) {
    issues.push("thin_clinical_pearl");
    score -= 10;
  }

  if ((expert.stepByStepReasoning?.length ?? 0) < 3) {
    issues.push("missing_step_reasoning");
    score -= 15;
  }

  if ((expert.highYieldFacts?.length ?? 0) < 2) {
    issues.push("missing_high_yield");
    score -= 8;
  }

  if ((expert.testTakingTip?.trim().length ?? 0) < 15) {
    issues.push("missing_test_tip");
    score -= 8;
  }

  const tone = resolveUsmleExpertStepTone(fieldId);
  if (tone === "step1" && !hasMechanismLanguage(expert)) {
    issues.push("weak_mechanism_language");
    score -= 10;
  }
  if ((tone === "step2" || tone === "step3") && !hasNextStepLanguage(expert)) {
    issues.push("weak_next_step_language");
    score -= 8;
  }

  const unique = [...new Set(issues)];
  return {
    ok:
      score >= 70 &&
      base.ok &&
      !unique.includes("thin_clinical_pearl") &&
      !unique.includes("missing_step_reasoning") &&
      !unique.includes("thin_clinical_context"),
    score: Math.max(0, score),
    issues: unique,
  };
}
