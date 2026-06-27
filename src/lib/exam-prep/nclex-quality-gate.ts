import type { BankItem } from "@/lib/question-bank";
import { auditBankItem } from "@/lib/exam-prep/bank-audit";
import { auditNclexBankItem, resolveNclexStem, resolveNclexVignette } from "./nclex-bank-audit";
import { NCLEX_BOARD_QUALITY_CONTROLS } from "./nclex-board-quality";
import { isGenericCommunicationBankItem, isGenericInterventionBankItem, isGenericPharmacologyBankItem, isGenericRiskBankItem, isGenericTeachingBankItem } from "@/lib/engine/polish/nclex-generic-checks";
import { scoreNclexBankItem } from "@/lib/engine/polish/nclex-polish";
import { isNclexCuratedItem } from "@/lib/question-bank/nclex-curated";
import { hasStructuredGuidelineReferences } from "./enrich-guidelines";

export const NCLEX_BEST_MIN_SCORE = NCLEX_BOARD_QUALITY_CONTROLS.minBestScore;
const BLOCKING_ERROR_CODES = new Set(["generic_risk_distractors","distractors_all_benign","generic_teaching_distractors","teaching_unstable_vignette","stem_option_category_mismatch","malformed_finding_option","stable_unstable_mismatch","generic_delegation_correct","generic_communication_distractors","generic_pharmacology_distractors","clinical_medication_vignette_mismatch","delegation_wrong_subject"]);
const BLOCKING_WARN_CODES = new Set(["duplicate_vignette_in_stem","answer_leaked_in_vignette"]);
const CARTOON_OPTION_PATTERNS = [/^Discourage questions to keep the discharge process efficient$/i,/^Assume understanding because the client nodded/i,/^You shouldn't feel that way/i,/overreacting so they can adjust/i,/Use another client's medication if the MAR is unavailable/i,/Administer .+ without verifying the client's identity or allergy history/i,/Document administration before giving the medication/i,/^Complete routine comfort measures for all other assigned clients before addressing abnormal findings$/i,/^Wait until the next scheduled assessment round to recheck vital signs despite acute changes$/i,/^Restrict all oral intake for 24 hours without provider order or further assessment$/i];

export type NclexQualityVerdict = { ok: boolean; score: number; tier: "best" | "acceptable" | "reject"; issues: string[] };

export function assessNclexItemQuality(item: BankItem, opts?: { source?: string | null }): NclexQualityVerdict {
  const score = scoreNclexBankItem(item);
  const issues: string[] = [];
  const shared = auditBankItem(item, "nursing");
  const nclex = auditNclexBankItem(item);
  for (const issue of [...shared.issues, ...nclex.issues]) {
    if (issue.severity === "error" && BLOCKING_ERROR_CODES.has(issue.code)) issues.push(issue.code);
    if (issue.severity === "warn" && BLOCKING_WARN_CODES.has(issue.code)) issues.push(issue.code);
  }
  if (!shared.ok) issues.push(...shared.issues.filter((i) => i.severity === "error").map((i) => i.code));
  if (!nclex.ok) issues.push(...nclex.issues.filter((i) => i.severity === "error").map((i) => i.code));
  const vignette = resolveNclexVignette(item);
  if (!vignette || vignette.length < 40) issues.push("missing_vignette");
  const explanation = item.explanation?.trim() ?? "";
  if (explanation.length < 120) issues.push("explanation_too_short");
  if (!/Why other options are incorrect/i.test(explanation)) issues.push("missing_distractor_rationales");
  if (!/Incorrect —/i.test(explanation)) issues.push("weak_distractor_rationales");
  if (isGenericRiskBankItem(item)) issues.push("generic_risk_distractors");
  if (isGenericTeachingBankItem(item)) issues.push("generic_teaching_distractors");
  if (isGenericCommunicationBankItem(item)) issues.push("generic_communication_distractors");
  if (isGenericPharmacologyBankItem(item)) issues.push("generic_pharmacology_distractors");
  if (isGenericInterventionBankItem(item)) issues.push("generic_intervention_distractors");
  const stem = resolveNclexStem(item);
  if (/confirms effective patient education|evaluates whether the client understands|therapeutic communication|before administering|infection control|which finding|medication safety|priority action|assess first|see first/i.test(stem)) {
    if (item.options.filter((o) => CARTOON_OPTION_PATTERNS.some((re) => re.test(o.trim()))).length >= 1) issues.push("cartoon_distractors");
  }
  if (NCLEX_BOARD_QUALITY_CONTROLS.curatedSourceRequired && !isNclexCuratedItem({ tags: item.tags, source: opts?.source ?? null })) issues.push("not_curated_source");
  if (NCLEX_BOARD_QUALITY_CONTROLS.requireGuidelineReferences && !hasStructuredGuidelineReferences(item)) {
    issues.push("missing_guideline_reference");
  }
  if (score < NCLEX_BEST_MIN_SCORE) issues.push("score_below_best_bar");
  const uniqueIssues = [...new Set(issues)];
  let tier: NclexQualityVerdict["tier"] = "reject";
  if (uniqueIssues.length === 0) tier = "best";
  else if (uniqueIssues.length === 1 && uniqueIssues[0] === "not_curated_source" && score >= 0.78) tier = "acceptable";
  return { ok: tier === "best", score, tier, issues: uniqueIssues };
}

export function isNclexBestQuality(item: BankItem, opts?: { source?: string | null }): boolean {
  return assessNclexItemQuality(item, opts).tier === "best";
}
