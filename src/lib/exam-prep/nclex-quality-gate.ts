import type { BankItem } from "@/lib/question-bank";
import { auditBankItem } from "@/lib/exam-prep/bank-audit";
import { auditNclexBankItem, resolveNclexStem, resolveNclexVignette } from "./nclex-bank-audit";
import {
  NCLEX_BOARD_QUALITY_CONTROLS,
  NCLEX_SERVE_QUALITY_CONTROLS,
} from "./nclex-board-quality";
import {
  explanationHasSocietyTieIn,
  hasStructuredGuidelineReferences,
} from "./enrich-guidelines";
import {
  isGenericCommunicationBankItem,
  isGenericInterventionBankItem,
  isGenericPharmacologyBankItem,
  isGenericRiskBankItem,
  isGenericTeachingBankItem,
} from "@/lib/engine/polish/nclex-generic-checks";
import { scoreNclexBankItem } from "@/lib/engine/polish/nclex-polish";
import { isNclexCuratedItem } from "@/lib/question-bank/nclex-curated";

export const NCLEX_BEST_MIN_SCORE = NCLEX_BOARD_QUALITY_CONTROLS.minBestScore;
export const NCLEX_SERVE_MIN_SCORE = NCLEX_SERVE_QUALITY_CONTROLS.minServeScore;
export const NCLEX_SERVE_TARGET = NCLEX_SERVE_QUALITY_CONTROLS.serveTargetTotal;

const BLOCKING_ERROR_CODES = new Set([
  "generic_risk_distractors",
  "distractors_all_benign",
  "generic_teaching_distractors",
  "teaching_unstable_vignette",
  "stem_option_category_mismatch",
  "malformed_finding_option",
  "stable_unstable_mismatch",
  "generic_delegation_correct",
  "generic_communication_distractors",
  "generic_pharmacology_distractors",
  "clinical_medication_vignette_mismatch",
  "delegation_wrong_subject",
]);
const BLOCKING_WARN_CODES = new Set(["duplicate_vignette_in_stem", "answer_leaked_in_vignette"]);
const SERVE_SOFT_ISSUES = new Set([
  "missing_guideline_reference",
  "not_curated_source",
  "score_below_best_bar",
  "weak_distractor_rationales",
]);
const CARTOON_OPTION_PATTERNS = [
  /^Discourage questions to keep the discharge process efficient$/i,
  /^Assume understanding because the client nodded/i,
  /^You shouldn't feel that way/i,
  /overreacting so they can adjust/i,
  /Use another client's medication if the MAR is unavailable/i,
  /Administer .+ without verifying the client's identity or allergy history/i,
  /Document administration before giving the medication/i,
  /^Complete routine comfort measures for all other assigned clients before addressing abnormal findings$/i,
  /^Wait until the next scheduled assessment round to recheck vital signs despite acute changes$/i,
  /^Restrict all oral intake for 24 hours without provider order or further assessment$/i,
];

export type NclexQualityTier = "best" | "serve" | "acceptable" | "reject";
export type NclexQualityMode = "best" | "serve";

export type NclexQualityVerdict = {
  ok: boolean;
  score: number;
  tier: NclexQualityTier;
  issues: string[];
};

function collectHardIssues(
  item: BankItem,
  mode: NclexQualityMode,
  opts?: { source?: string | null }
): string[] {
  const issues: string[] = [];
  const shared = auditBankItem(item, "nursing");
  const nclex = auditNclexBankItem(item);
  for (const issue of [...shared.issues, ...nclex.issues]) {
    if (issue.severity === "error" && BLOCKING_ERROR_CODES.has(issue.code)) issues.push(issue.code);
    if (issue.severity === "warn" && BLOCKING_WARN_CODES.has(issue.code)) issues.push(issue.code);
  }
  if (!shared.ok) issues.push(...shared.issues.filter((i) => i.severity === "error").map((i) => i.code));
  if (!nclex.ok) issues.push(...nclex.issues.filter((i) => i.severity === "error").map((i) => i.code));

  if (isGenericRiskBankItem(item)) issues.push("generic_risk_distractors");
  if (isGenericTeachingBankItem(item)) issues.push("generic_teaching_distractors");
  if (isGenericCommunicationBankItem(item)) issues.push("generic_communication_distractors");
  if (isGenericPharmacologyBankItem(item)) issues.push("generic_pharmacology_distractors");
  if (isGenericInterventionBankItem(item)) issues.push("generic_intervention_distractors");

  const stem = resolveNclexStem(item);
  if (
    /confirms effective patient education|evaluates whether the client understands|therapeutic communication|before administering|infection control|which finding|medication safety|priority action|assess first|see first/i.test(
      stem
    )
  ) {
    if (
      item.options.filter((o) => CARTOON_OPTION_PATTERNS.some((re) => re.test(o.trim()))).length >= 1
    ) {
      issues.push("cartoon_distractors");
    }
  }

  const requireCurated =
    mode === "best"
      ? NCLEX_BOARD_QUALITY_CONTROLS.curatedSourceRequired
      : NCLEX_SERVE_QUALITY_CONTROLS.curatedSourceRequired;
  if (requireCurated && !isNclexCuratedItem({ tags: item.tags, source: opts?.source ?? null })) {
    issues.push("not_curated_source");
  }

  return [...new Set(issues)];
}

export function hasNclexDistractorRationales(item: BankItem): boolean {
  const explanation = item.explanation?.trim() ?? "";
  if (
    /Why other options are incorrect/i.test(explanation) &&
    /Incorrect —/i.test(explanation)
  ) {
    return true;
  }
  if (explanation.includes("## Why the other options are wrong")) return true;
  const distractor = item.distractorRationale ?? {};
  const wrongCount = item.options.filter(
    (o) => o.trim().toLowerCase() !== item.correctAnswer.trim().toLowerCase()
  ).length;
  return wrongCount > 0 && Object.keys(distractor).length >= Math.min(3, wrongCount);
}

export function hasNclexEvidenceAnchor(item: BankItem): boolean {
  const explanation = item.explanation?.trim() ?? "";
  return hasStructuredGuidelineReferences(item) || explanationHasSocietyTieIn(explanation);
}

function assessNclexItemQualityInternal(
  item: BankItem,
  mode: NclexQualityMode,
  opts?: { source?: string | null }
): NclexQualityVerdict {
  const score = scoreNclexBankItem(item);
  const controls =
    mode === "best" ? NCLEX_BOARD_QUALITY_CONTROLS : NCLEX_SERVE_QUALITY_CONTROLS;
  const issues = collectHardIssues(item, mode, opts);

  const vignette = resolveNclexVignette(item);
  if (!vignette || vignette.length < controls.minVignetteLength) issues.push("missing_vignette");

  const explanation = item.explanation?.trim() ?? "";
  if (explanation.length < controls.minExplanationLength) issues.push("explanation_too_short");

  if (controls.requireDistractorRationales && !hasNclexDistractorRationales(item)) {
    issues.push("missing_distractor_rationales");
  } else if (
    mode === "best" &&
    !/Incorrect —/i.test(explanation) &&
    !item.explanation?.includes("## Why the other options are wrong")
  ) {
    issues.push("weak_distractor_rationales");
  }

  if (mode === "best" && NCLEX_BOARD_QUALITY_CONTROLS.requireGuidelineReferences) {
    if (!hasStructuredGuidelineReferences(item)) issues.push("missing_guideline_reference");
  } else if (
    mode === "serve" &&
    NCLEX_SERVE_QUALITY_CONTROLS.requireGuidelineReferences &&
    !hasNclexEvidenceAnchor(item)
  ) {
    issues.push("missing_guideline_reference");
  }

  const minScore =
    mode === "best" ? NCLEX_BOARD_QUALITY_CONTROLS.minBestScore : NCLEX_SERVE_MIN_SCORE;
  if (score < minScore) {
    issues.push(mode === "best" ? "score_below_best_bar" : "score_below_serve_bar");
  }

  const uniqueIssues = [...new Set(issues)];
  const hardIssues = uniqueIssues.filter((code) => !SERVE_SOFT_ISSUES.has(code));

  let tier: NclexQualityTier = "reject";
  if (mode === "best") {
    if (uniqueIssues.length === 0) tier = "best";
    else if (uniqueIssues.length === 1 && uniqueIssues[0] === "not_curated_source" && score >= 0.78) {
      tier = "acceptable";
    }
  } else if (hardIssues.length === 0 && score >= NCLEX_SERVE_MIN_SCORE) {
    tier = uniqueIssues.length === 0 ? "best" : "serve";
  }

  const ok = mode === "best" ? tier === "best" : tier === "best" || tier === "serve";
  return { ok, score, tier, issues: uniqueIssues };
}

export function assessNclexItemQuality(
  item: BankItem,
  opts?: { source?: string | null; mode?: NclexQualityMode }
): NclexQualityVerdict {
  return assessNclexItemQualityInternal(item, opts?.mode ?? "best", opts);
}

export function assessNclexServeQuality(
  item: BankItem,
  opts?: { source?: string | null }
): NclexQualityVerdict {
  return assessNclexItemQualityInternal(item, "serve", opts);
}

export function isNclexBestQuality(item: BankItem, opts?: { source?: string | null }): boolean {
  return assessNclexItemQuality(item, opts).tier === "best";
}

export function isNclexServeQuality(item: BankItem, opts?: { source?: string | null }): boolean {
  return assessNclexServeQuality(item, opts).ok;
}
