import type { BankItem } from "@/lib/question-bank";
import {
  alignNaplexBankItemAnswers,
  correctAnswerMatchesOption,
  extractExplanationCorrectText,
  indexOfMatchingOption,
  inferCorrectFromDistractors,
  inferCorrectFromExplanationRecommendation,
  inferCorrectFromWrongOptionsSection,
} from "./naplex-answer-align";
import { resolveNaplexStem, resolveNaplexVignette } from "./naplex-bank-audit";
import { repairClinicalNumericMismatch } from "./naplex-clinical-numeric-repair";

export type NaplexFormatIssue = {
  code:
    | "naplex_stem_format_mismatch"
    | "naplex_conflicting_lead_ins"
    | "naplex_mcq_missing_correct_option"
    | "naplex_calc_stem_on_mcq"
    | "naplex_orphan_calc_stem"
    | "naplex_clinical_vignette_unrelated_calc"
    | "naplex_clinical_stem_numeric_options"
    | "naplex_clinical_vignette_unrelated_options";
  message: string;
  severity: "error";
};

/** Generic calculation stems from blueprint slot rotation — must not attach to non-calc vignettes. */
export const GENERIC_BLUEPRINT_CALC_STEMS = [
  "Calculate the dose in mg. Round to the nearest whole number.",
  "Calculate the dose in mg.",
  "How many tablets should be dispensed for this order?",
  "At what rate (mL/hr) should the infusion pump be set? Round to the nearest whole number.",
  "At what rate (mL/hr) should the infusion pump be set?",
  "What is the total volume in mL? Round to one decimal place.",
  "What is the total volume in mL?",
  "How many milligrams of drug are required for this preparation?",
  "Calculate the concentration in mg/mL. Round to two decimal places.",
  "Calculate the concentration in mg/mL.",
] as const;

const MCQ_CLINICAL_VIGNETTE =
  /\b(?:addiction|substance abuse|non-opioid|concern about|exploring|counsel|counseling|alternative therap|most appropriate|next best step|which (?:recommendation|action|finding|medication|alternative)|patient asks|mother asks|expresses concern|monitoring parameter|drug interaction|therapeutic change|immediate follow-up)\b/i;

const CALC_ORDER_CONTEXT =
  /\b(?:order(?:ed)?|Rx:|dispense|infus(?:e|ion)|prepare|compound|dilut|reconstitut|available (?:suspension|vial|stock|concentrate)|bag contains|mg\/kg|mcg\/kg|mg\/m²|mL\/hr|every \d+ hours?.*\d+\s*mg|q\d+h.*\d+\s*mg|round to (?:one|two|nearest))\b/i;

/** Symptom/vital presentation without dispensing order data — calc stem must address the clinical problem. */
const CLINICAL_PRESENTATION_VIGNETTE =
  /\b(?:reports (?:feeling|having|more|worsening|that)|complains of|symptoms?(?:\s+worsen|\s+include)?|shortness of breath|short of breath|\bsob\b|wheezing|cough(?:ing)?(?:\s+that|\s+which)?|exacerbation|worsening|nocturnal|at night|blood pressure (?:is )?\d+|mm Hg|vital signs|oxygen saturation|heart rate (?:of|is)|dizziness|constipation|muscle ache|edema|headache|blurred vision|palpitations|fatigue|nausea|vomiting|fever|rash|bleeding|pain)\b/i;

const MCQ_LEAD_IN =
  /\b(?:which (?:finding|action|medication|intervention|recommendation|counseling|monitoring|drug|alternative|statement|laboratory)|what is the (?:most|best|priority|next|appropriate|expected)|most appropriate|best choice|best next|next best step|select all|which of the following|what counseling|expected (?:duration|time frame))\b/i;

const CALC_LEAD_IN =
  /\b(?:calculate|how many|how much|at what rate|round to|what is the (?:rate|dose|volume|concentration|quantity|total|amount|number|daily dose|infusion rate))\b/i;

const NUMERIC_ANSWER = /^\s*-?\d+(?:\.\d+)?\s*(?:mg|mcg|g|mL|ml|mL\/hr|mcg\/mL|mEq|units|%|tablets|capsules|hr|hours?)?\s*$/i;

function blob(item: BankItem): string {
  const vignette = resolveNaplexVignette(item);
  const stem = resolveNaplexStem(item);
  return [vignette, stem, item.question].filter(Boolean).join("\n");
}

function hasMcqOptions(item: BankItem): boolean {
  return item.options.filter((o) => o.trim().length > 2).length >= 4;
}

function isNumericOnlyOption(option: string): boolean {
  const trimmed = option.trim();
  if (!trimmed) return false;
  if (NUMERIC_ANSWER.test(trimmed)) return true;
  return /^\d+(?:\.\d+)?$/.test(trimmed);
}

function allOptionsNumericOnly(options: string[]): boolean {
  const usable = options.filter((o) => o.trim().length > 0);
  return usable.length >= 4 && usable.every(isNumericOnlyOption);
}

function isClinicalMcqStem(item: BankItem): boolean {
  const stem = resolveNaplexStem(item);
  return MCQ_LEAD_IN.test(stem) && !CALC_LEAD_IN.test(stem);
}

function isNumericAnswer(answer: string): boolean {
  const trimmed = answer.trim();
  if (!trimmed) return false;
  if (NUMERIC_ANSWER.test(trimmed)) return true;
  return /^\d+(?:\.\d+)?$/.test(trimmed.replace(/[^\d.]/g, ""));
}

export function isGenericBlueprintCalcStem(stem: string): boolean {
  const normalized = stem.trim();
  return GENERIC_BLUEPRINT_CALC_STEMS.some(
    (template) => normalized === template || normalized.startsWith(template.replace(/\.$/, ""))
  );
}

/** True when vignette contains enough order/dispensing data to support a calculation stem. */
export function vignetteSupportsCalculation(item: BankItem): boolean {
  const vignette = resolveNaplexVignette(item);
  if (!vignette || vignette.length < 20) return false;

  const numericAnchors =
    vignette.match(
      /\d+(?:\.\d+)?\s*(?:mg\/kg|mcg\/kg|mg\/m²|mg\/mL|mcg\/mL|mL\/hr|g\/kg|mEq\/mL|units\/mL|mg\/\d+\s*mL)/gi
    ) ?? [];
  if (numericAnchors.length >= 1) return true;

  const dosePairs =
    vignette.match(/\d+(?:\.\d+)?\s*(?:mg|mcg|g|mL|L|units|tablets?|capsules?|mEq)/gi) ?? [];
  const hasOrder = CALC_ORDER_CONTEXT.test(vignette);
  if (hasOrder && dosePairs.length >= 2) return true;

  if (/\d+\s*(?:mg|mcg|g|mL)\b.*(?:every|q\d+h|over \d+|× \d+ day)/i.test(vignette)) return true;
  if (/(?:BSA|CrCl|ideal body weight|IBW|4-2-1|alligation|C1V1)/i.test(vignette)) return true;

  return false;
}

/** True when the stem alone states enough numeric order data to perform the calculation. */
export function stemIsSelfContainedCalc(stem: string): boolean {
  const s = stem.trim();
  if (!s || !CALC_LEAD_IN.test(s)) return false;

  const hasDaySupply = /\d+\s*-?\s*day/i.test(s);
  const hasScheduledDose =
    /\d+(?:\.\d+)?\s*(?:mg|mcg|g|units)\b.{0,48}(?:daily|every|q\d+h|\/day|once|twice|per day|po\b)/i.test(
      s
    );
  if (hasDaySupply && hasScheduledDose) return true;
  if (/how many tablets/i.test(s) && hasDaySupply && /\d+(?:\.\d+)?\s*(?:mg|mcg)/i.test(s)) {
    return true;
  }

  if (/(?:mg\/kg|mcg\/kg|mg\/m²)/i.test(s) && /(?:weighing|weight|\d+\s*kg\b)/i.test(s)) {
    return true;
  }

  if (
    /\d+(?:\.\d+)?\s*(?:mg|mcg|g)\b.{0,48}\d+(?:\.\d+)?\s*mL\b|\d+(?:\.\d+)?\s*mg\/mL/i.test(
      s
    )
  ) {
    return true;
  }

  if (
    /\d+(?:\.\d+)?\s*mL\b.{0,48}(?:over|in)\s*\d+(?:\.\d+)?\s*(?:h|hr|hours?)/i.test(s)
  ) {
    return true;
  }

  if (
    /\d+(?:\.\d+)?\s*(?:mg|mcg)\b.{0,32}over\s*\d+(?:\.\d+)?\s*(?:h|hr|hours?)/i.test(s) &&
    /\d+(?:\.\d+)?\s*mL\b/i.test(s)
  ) {
    return true;
  }

  if (/(?:alligation|C1V1|4-2-1|dextrose|normal saline|NS\b|D5W|dilute to \d+)/i.test(s)) {
    return true;
  }

  return false;
}

/** mg/mL concentration prompts need mass/volume data — mcg/actuation or mg/kg/day alone is not enough. */
export function concentrationStemLacksSolvableInputs(text: string): boolean {
  if (!/\bconcentration\b|\bmg\/mL\b/i.test(text)) return false;

  const hasSolvableConcInputs =
    (/\d+(?:\.\d+)?\s*mL\b/i.test(text) &&
      /\b(?:per actuation|per spray|net contents|suspension|canister contains|delivers|reconstitut)\b/i.test(
        text
      )) ||
    /\d+(?:\.\d+)?\s*mg\/(?:5\s*mL|\d+\s*mL)/i.test(text) ||
    /(?:alligation|C1V1|dilute to \d+(?:\.\d+)?\s*mL)/i.test(text) ||
    (/(?:mcg|mg)\/mL/i.test(text) &&
      /(?:mcg|mg)\/kg\/min/i.test(text) &&
      /\d+\s*kg\b/i.test(text));

  return !hasSolvableConcInputs;
}

/** Tablet dispense calculations require an explicit day supply or course duration. */
export function hasTabletDispenseDaySupply(text: string): boolean {
  return /\d+\s*-?\s*day|\bfor \d+\s*days\b|\b(?:x|×)\s*\d+\s*day|day supply|\d+\s*days?\s+(?:supply|course|duration)/i.test(
    text
  );
}

/** Calculation lead-in must match the numeric data present (dose vs concentration vs rate). */
export function calcStemMatchesVignetteData(item: BankItem): boolean {
  const stem = resolveNaplexStem(item).trim();
  const vignette = resolveNaplexVignette(item);
  const blob = [vignette, stem].filter(Boolean).join("\n");

  const asksConcentration =
    /\bconcentration\b/i.test(stem) || /^Calculate the concentration in mg\/mL/i.test(stem);
  if (asksConcentration) {
    return !concentrationStemLacksSolvableInputs(blob);
  }

  if (/mL\/hr|infusion pump|infusion rate/i.test(stem)) {
    if (/\d+(?:\.\d+)?\s*mL\b.{0,48}(?:over|in)\s*\d+(?:\.\d+)?\s*(?:h|hr|hours?)/i.test(blob)) {
      return true;
    }
    // Weight-based continuous infusion: ordered mcg/kg/min (or mg/kg/min) + bag strength in mcg/mL or mg/mL.
    if (
      /(?:mcg|mg)\/kg\/min/i.test(blob) &&
      /\d+\s*kg\b/i.test(blob) &&
      /(?:mcg|mg)\/mL/i.test(blob)
    ) {
      return true;
    }
    return false;
  }

  if (/total volume in mL/i.test(stem)) {
    return /reconstitut|dilut|compound|prepare \d+\s*mL|C1V1|alligation/i.test(blob);
  }

  if (/how many tablets/i.test(stem)) {
    if (stemIsSelfContainedCalc(stem)) return true;
    if (!hasTabletDispenseDaySupply(blob)) return false;
    return (
      /\d+(?:\.\d+)?\s*(?:mg|mcg|g)\b/i.test(blob) &&
      /(?:every \d+|q\d+h|times daily|twice daily|three times|once daily|tid|bid|qid)/i.test(blob)
    );
  }

  if (/calculate the dose in mg|milligrams of drug are required|for this preparation/i.test(stem)) {
    if (/mg\/kg|mcg\/kg/i.test(vignette) && /\d+\s*kg\b/i.test(vignette)) return true;
    return /reconstitut|compound|prepare\s+\d|dilut|alligation|C1V1|vial contains|add to.*\d+\s*mL|final volume|suspension.*\d+/i.test(
      blob
    );
  }

  if (/total daily dose|calculate the total daily dose/i.test(stem)) {
    return (
      /\d+(?:\.\d+)?\s*(?:mg|mcg|g)\b.*(?:every|q\d+h|\/day|daily|times daily|three times|twice)/i.test(
        blob
      ) || (/mg\/kg|mcg\/kg/i.test(vignette) && /\d+\s*kg\b/i.test(vignette))
    );
  }

  return true;
}

/** Vignette or stem provides calculable inputs for a calculation lead-in. */
export function calculationContextSupportsStem(item: BankItem): boolean {
  const stem = resolveNaplexStem(item);
  const text = [resolveNaplexVignette(item), stem].filter(Boolean).join("\n");
  if (concentrationStemLacksSolvableInputs(text)) return false;
  if (!calcStemMatchesVignetteData(item)) return false;
  if (vignetteSupportsCalculation(item)) return true;
  return stemIsSelfContainedCalc(stem);
}

export function orphanGenericCalcStemIssue(item: BankItem): { codes: string[] } | null {
  const itemType = item.itemType ?? "mcq";
  if (itemType !== "constructed_response") return null;

  const stem = resolveNaplexStem(item);
  if (!CALC_LEAD_IN.test(stem)) return null;
  if (clinicalVignetteUnrelatedCalcIssue(item)) return null;
  if (calculationContextSupportsStem(item)) return null;

  return { codes: ["naplex_orphan_calc_stem"] };
}

/** Self-contained calc stem (order data only in stem) on a symptom-driven clinical vignette. */
export function clinicalVignetteUnrelatedCalcIssue(item: BankItem): { codes: string[] } | null {
  const itemType = item.itemType ?? "mcq";
  if (itemType !== "constructed_response") return null;

  const stem = resolveNaplexStem(item);
  const vignette = resolveNaplexVignette(item);
  if (!CALC_LEAD_IN.test(stem) || !stemIsSelfContainedCalc(stem)) return null;
  if (!vignette || vignette.length < 50) return null;
  if (vignetteSupportsCalculation(item)) return null;
  if (CALC_ORDER_CONTEXT.test(vignette)) return null;
  if (!CLINICAL_PRESENTATION_VIGNETTE.test(vignette)) return null;

  return { codes: ["naplex_clinical_vignette_unrelated_calc"] };
}

/** Counseling-intent clinical vignette paired with a dispense/calculation stem (even if technically calculable). */
export function clinicalCounselingIntentCalcMismatchIssue(item: BankItem): { codes: string[] } | null {
  const itemType = item.itemType ?? "mcq";
  if (
    itemType !== "constructed_response" &&
    itemType !== "mcq" &&
    itemType !== "vignette" &&
    itemType !== "case_based"
  ) {
    return null;
  }

  const stem = resolveNaplexStem(item);
  const vignette = resolveNaplexVignette(item);
  if (!CALC_LEAD_IN.test(stem) || !vignette) return null;

  const dispenseCalcStem =
    /how many tablets|dispense|total volume|calculate the (?:dose|total daily dose)|milligrams of drug are required|mL\/hr|infusion pump|infusion rate/i.test(
      stem
    );
  if (!dispenseCalcStem) return null;

  if (isAnticoagulantBleedingRiskCounselingVignette(vignette)) {
    return { codes: ["naplex_clinical_vignette_unrelated_calc"] };
  }

  if (isNsaidAceInteractionCounselingVignette(vignette)) {
    return { codes: ["naplex_clinical_vignette_unrelated_calc"] };
  }

  if (isPenicillinAllergyAmoxicillinVignette(vignette)) {
    return { codes: ["naplex_clinical_vignette_unrelated_calc"] };
  }

  if (isMetforminRenalSafetyCounselingVignette(vignette)) {
    return { codes: ["naplex_clinical_vignette_unrelated_calc"] };
  }

  if (isAmoxicillinUtiIncompleteDispenseVignette(vignette, stem)) {
    return { codes: ["naplex_clinical_vignette_unrelated_calc"] };
  }

  if (isPregnancyTopicalAntibioticSafetyVignette(vignette)) {
    return { codes: ["naplex_clinical_vignette_unrelated_calc"] };
  }

  return null;
}

export function detectClinicalCounselingIntentCalcMismatch(item: BankItem): NaplexFormatIssue | null {
  const issue = clinicalCounselingIntentCalcMismatchIssue(item);
  if (!issue) return null;
  return {
    code: "naplex_clinical_vignette_unrelated_calc",
    message:
      "Counseling-focused clinical vignette is paired with an unrelated dispense or calculation stem (e.g. tablet count when the patient asks about bleeding risk).",
    severity: "error",
  };
}

export function detectClinicalVignetteUnrelatedCalc(item: BankItem): NaplexFormatIssue | null {
  const issue = clinicalVignetteUnrelatedCalcIssue(item);
  if (!issue) return null;
  return {
    code: "naplex_clinical_vignette_unrelated_calc",
    message:
      "Clinical symptom vignette is paired with an unrelated self-contained calculation stem (e.g. tablet dispense when the case asks about worsening COPD).",
    severity: "error",
  };
}

export function detectOrphanGenericCalcStem(item: BankItem): NaplexFormatIssue | null {
  const issue = orphanGenericCalcStemIssue(item);
  if (!issue) return null;
  return {
    code: "naplex_orphan_calc_stem",
    message:
      "Calculation stem lacks calculable order data in the vignette and stem (e.g. generic volume/dose prompt on a counseling-only case).",
    severity: "error",
  };
}

function inferMcqStemFromVignette(vignette: string): string {
  const v = vignette.toLowerCase();
  if (/addiction|non-opioid|substance abuse|concern about.*(?:addict|opioid)/.test(v)) {
    return "Which alternative therapy is most appropriate?";
  }
  if (/counsel|mother asks|patient asks|counseling point/.test(v)) {
    return "Which counseling point is most important?";
  }
  if (/drug interaction|concomitant|polypharmacy/.test(v)) {
    return "Which drug interaction poses the greatest risk?";
  }
  if (/laboratory|lab value|a1c|creatinine|potassium|inr/.test(v)) {
    return "Which laboratory value warrants a therapeutic change?";
  }
  if (/monitor|follow-up|parameter/.test(v)) {
    return "Which monitoring parameter is most critical?";
  }
  if (/emergency|severe|chest pain|st-segment|st elevation/.test(v)) {
    return "What is the next best step in management?";
  }
  return "Which recommendation is most appropriate for this patient?";
}

export function detectNaplexFormatIssues(item: BankItem): NaplexFormatIssue[] {
  const issues: NaplexFormatIssue[] = [];
  const itemType = item.itemType ?? "mcq";
  const stem = resolveNaplexStem(item);
  const text = blob(item);
  const mcqStem = MCQ_LEAD_IN.test(stem);
  const calcStem = CALC_LEAD_IN.test(stem);

  const questionMarks = stem.split("?").length - 1;
  if (questionMarks > 1) {
    issues.push({
      code: "naplex_conflicting_lead_ins",
      message: "Stem contains multiple question prompts — only one lead-in is allowed.",
      severity: "error",
    });
  }

  if (
    itemType === "constructed_response" &&
    hasMcqOptions(item) &&
    !calcStem
  ) {
    issues.push({
      code: "naplex_stem_format_mismatch",
      message:
        "Calculation item uses a multiple-choice lead-in with four options — should be vignette MCQ, not numeric entry.",
      severity: "error",
    });
  } else if (
    itemType === "constructed_response" &&
    mcqStem &&
    !calcStem &&
    !hasMcqOptions(item) &&
    !isNumericAnswer(item.correctAnswer)
  ) {
    issues.push({
      code: "naplex_stem_format_mismatch",
      message:
        "Calculation item uses a multiple-choice lead-in (e.g. Which finding…) but correctAnswer is not numeric.",
      severity: "error",
    });
  }

  if (
    (itemType === "mcq" || itemType === "vignette" || itemType === "case_based") &&
    calcStem &&
    isNumericAnswer(item.correctAnswer) &&
    hasMcqOptions(item) &&
    !correctAnswerMatchesOption(item.options, item.correctAnswer, itemType)
  ) {
    issues.push({
      code: "naplex_calc_stem_on_mcq",
      message: "MCQ item has a calculation lead-in and numeric correctAnswer not present in options.",
      severity: "error",
    });
  }

  if (
    (itemType === "mcq" || itemType === "vignette" || itemType === "case_based") &&
    hasMcqOptions(item) &&
    item.correctAnswer.trim() &&
    !correctAnswerMatchesOption(item.options, item.correctAnswer, itemType) &&
    !item.correctAnswer.includes("|||")
  ) {
    issues.push({
      code: "naplex_mcq_missing_correct_option",
      message: "MCQ correctAnswer does not match any option — item is unscorable.",
      severity: "error",
    });
  }

  if (/enter (?:a |your )?numeric answer/i.test(text) && mcqStem && itemType !== "constructed_response") {
    issues.push({
      code: "naplex_stem_format_mismatch",
      message: "Stem embeds numeric-entry instructions alongside a multiple-choice lead-in.",
      severity: "error",
    });
  }

  if (
    (itemType === "mcq" || itemType === "vignette" || itemType === "case_based") &&
    hasMcqOptions(item) &&
    isClinicalMcqStem(item) &&
    allOptionsNumericOnly(item.options)
  ) {
    issues.push({
      code: "naplex_clinical_stem_numeric_options",
      message:
        "Clinical or counseling MCQ stem expects qualitative answer choices, but all options are bare numeric values.",
      severity: "error",
    });
  }

  if (
    (itemType === "mcq" || itemType === "vignette" || itemType === "case_based") &&
    hasMcqOptions(item) &&
    calcStem &&
    allOptionsNumericOnly(item.options) &&
    !calculationContextSupportsStem(item)
  ) {
    issues.push({
      code: "naplex_clinical_stem_numeric_options",
      message:
        "Generic calculation stem on a clinical vignette is paired with bare numeric MCQ options without solvable order data.",
      severity: "error",
    });
  }

  const orphanCalc = detectOrphanGenericCalcStem(item);
  if (orphanCalc) issues.push(orphanCalc);

  const unrelatedClinicalCalc = detectClinicalVignetteUnrelatedCalc(item);
  if (unrelatedClinicalCalc) issues.push(unrelatedClinicalCalc);

  const counselingCalcMismatch = detectClinicalCounselingIntentCalcMismatch(item);
  if (counselingCalcMismatch) issues.push(counselingCalcMismatch);

  const unrelatedOptions = detectClinicalVignetteUnrelatedOptions(item);
  if (unrelatedOptions) issues.push(unrelatedOptions);

  return issues;
}

/** Acute asthma exacerbation vignette paired with an orphan or uncalculable calculation stem. */
function isAsthmaExacerbationMismatch(item: BankItem): boolean {
  const vignette = resolveNaplexVignette(item).toLowerCase();
  if (!CALC_LEAD_IN.test(resolveNaplexStem(item))) return false;
  return (
    /asthma exacerbation|acute asthma|status asthmaticus/.test(vignette) ||
    (/asthma/.test(vignette) &&
      /exacerbation|emergency department|\bspo?₂?\s*(?:of\s*)?8[0-9]\b|oxygen saturation (?:of )?8[0-9]|heart rate (?:of )?1[0-2]\d/.test(
        vignette
      ))
  );
}

/** Outpatient asthma follow-up with poor control signs paired with a calculation stem. */
function isAsthmaPoorControlVignette(vignette: string): boolean {
  const v = vignette.toLowerCase();
  const onMaintenance =
    /fluticasone|salmeterol|budesonide|maintenance|advair|symbicort|breo|wixela|ics\/laba|controller/.test(
      v
    );
  const poorControl =
    /more than twice|twice (?:a |per )week|2 times|more frequently than prescribed|more frequently|nighttime|nocturnal|awakening|poor control|uncontrolled|asthma control|frequent.*symptoms|still experiences|concerned about.*control|worsening symptoms|concerned about his worsening|concerned about her worsening/.test(
      v
    );
  if (/\basthma\b/.test(v) && onMaintenance && poorControl) return true;
  if (
    /\basthma\b/.test(v) &&
    /albuterol|levalbuterol|rescue inhaler|\bsaba\b/.test(v) &&
    poorControl
  ) {
    return true;
  }
  return (
    /\basthma\b/.test(v) &&
    /follow-up|follow up|clinic|office visit|presents for a visit|refill|pharmacy/.test(v) &&
    poorControl
  );
}

function isAsthmaPoorControlMismatch(item: BankItem): boolean {
  const vignette = resolveNaplexVignette(item).toLowerCase();
  if (!/\basthma\b/.test(vignette)) return false;
  if (!CALC_LEAD_IN.test(resolveNaplexStem(item))) return false;
  if (isAsthmaExacerbationMismatch(item)) return false;
  return isAsthmaPoorControlVignette(vignette);
}

function isAsthmaClinicalCalcMismatch(item: BankItem): boolean {
  return isAsthmaExacerbationMismatch(item) || isAsthmaPoorControlMismatch(item);
}

function buildAsthmaPoorControlMcq(item: BankItem): BankItem {
  const vignette =
    resolveNaplexVignette(item) ||
    "A patient with asthma on maintenance and rescue inhalers reports frequent rescue use and nocturnal symptoms at a clinic follow-up visit.";
  const sabaOnly = /albuterol|levalbuterol|rescue inhaler|\bsaba\b/i.test(vignette) &&
    !/fluticasone|salmeterol|budesonide|maintenance|advair|symbicort|controller|ics\/laba/i.test(
      vignette
    );
  const options = sabaOnly
    ? ([
        "Counsel that increased rescue inhaler use and worsening symptoms suggest poor asthma control; recommend prescriber follow-up for daily controller therapy and demonstrate proper albuterol use (typically 1–2 puffs every 4–6 hours as needed) rather than unsupervised mg dose escalation without weight-based prescriber guidance.",
        "Recommend increasing the albuterol dose to 8 mg every hour until symptoms resolve without contacting the prescriber.",
        "Advise stopping all asthma medications because rescue inhaler use means the child has outgrown asthma.",
        "Counsel that frequent rescue inhaler use is expected and does not require evaluation or controller therapy.",
      ] as BankItem["options"])
    : ([
        "Recommend follow-up with the prescriber for step-up therapy and counsel against increasing controller inhaler use beyond the prescribed regimen because nocturnal symptoms indicate uncontrolled asthma.",
        "Advise using fluticasone/salmeterol more frequently throughout the day until nighttime symptoms resolve.",
        "Recommend stopping the maintenance inhaler and using albuterol alone until daytime symptoms improve.",
        "Counsel that nighttime symptoms are expected on maintenance therapy and do not require a therapy change.",
      ] as BankItem["options"]);
  const correctAnswer = options[0]!;
  return {
    ...item,
    vignette,
    scenario: vignette,
    question: "Which recommendation is most appropriate for this patient?",
    options,
    correctAnswer,
    explanation: sabaOnly
      ? "Correct: Increased albuterol use with worsening symptoms suggests uncontrolled asthma — the pharmacist should recommend prescriber follow-up for controller therapy and proper rescue inhaler technique rather than guessing a weight-based mg dose without clinical data. Unsupervised dose escalation to high oral-equivalent mg doses is unsafe. Stopping therapy or dismissing frequent rescue use ignores guideline-based asthma management."
      : "Correct: Recommend follow-up with the prescriber for step-up therapy and counsel against increasing controller use beyond the prescribed regimen — nocturnal symptoms and overuse of ICS/LABA suggest uncontrolled asthma; assess adherence, inhaler technique, triggers, and need for escalation per guidelines rather than unsupervised dose changes. Extra controller puffs without prescriber direction is unsafe and does not replace step-up therapy. Stopping ICS/LABA in favor of SABA alone worsens control. Nocturnal symptoms are a marker of poor control and require intervention.",
    itemType: "vignette",
    ngnPayload: undefined,
    subjectId: item.subjectId || "respiratory-rx",
    topicCategory: item.topicCategory ?? "Asthma Control",
  };
}

function buildAsthmaClinicalMcqRepair(item: BankItem): BankItem {
  if (isAsthmaExacerbationMismatch(item)) return buildAsthmaExacerbationMcq(item);
  return buildAsthmaPoorControlMcq(item);
}

function parsePediatricDoseDivisions(vignette: string): number {
  if (/three times daily|\btid\b|three doses|q8h|every 8 hours/i.test(vignette)) return 3;
  if (/four times daily|\bqid\b|four doses|q6h|every 6 hours/i.test(vignette)) return 4;
  if (/once daily|\bq24h\b|one dose|daily\b/i.test(vignette) && !/divided/i.test(vignette)) return 1;
  if (/two doses|twice daily|\bbid\b|divided into two|q12h|every 12 hours/i.test(vignette)) return 2;
  const divided = vignette.match(/divided into (\d+) doses/i);
  if (divided?.[1]) return Math.max(1, parseInt(divided[1], 10));
  return 2;
}

/** mg/kg/day vignette paired with concentration, volume, or other mismatched calc stem. */
function isPediatricMgKgDoseCalcMismatch(item: BankItem): boolean {
  const vignette = resolveNaplexVignette(item);
  if (!/mg\/kg|mcg\/kg/i.test(vignette) || !/\d+\s*kg\b/i.test(vignette)) return false;
  // Continuous IV infusion (mcg/kg/min) is a pump-rate calculation, not mg/kg/day per-dose math.
  if (/(?:mcg|mg)\/kg\/min/i.test(vignette)) return false;
  if (!CALC_LEAD_IN.test(resolveNaplexStem(item))) return false;
  return !calcStemMatchesVignetteData(item);
}

function buildPediatricMgKgDoseCalc(item: BankItem): BankItem {
  const vignette =
    resolveNaplexVignette(item) ||
    "A pediatric patient requires weight-based antibiotic dosing divided into multiple daily doses.";
  const weightMatch = vignette.match(/(\d+(?:\.\d+)?)\s*kg\b/i);
  const mgKgMatch = vignette.match(/(\d+(?:\.\d+)?)\s*mg\/kg\/day/i);
  const weight = weightMatch ? parseFloat(weightMatch[1]!) : 0;
  const mgKg = mgKgMatch ? parseFloat(mgKgMatch[1]!) : 0;
  const divisions = parsePediatricDoseDivisions(vignette);
  const dailyDose = weight * mgKg;
  const perDose = Math.round(dailyDose / divisions);

  return {
    ...item,
    vignette,
    scenario: vignette,
    question: "Calculate the dose in mg for each divided dose. Round to the nearest whole number.",
    correctAnswer: String(perDose),
    explanation: `Daily dose = ${mgKg} mg/kg/day × ${weight} kg = ${dailyDose} mg/day. Divided into ${divisions} dose${divisions === 1 ? "" : "s"} → ${dailyDose} mg ÷ ${divisions} = ${perDose} mg per dose.`,
    itemType: "constructed_response",
    ngnPayload: { kind: "constructed", unit: "mg" },
    subjectId: item.subjectId || "medication-dispensing",
    topicCategory: item.topicCategory ?? "Pediatric Dosing",
  };
}

const OPIOID_COUNSELING_VIGNETTE =
  /\b(?:hydrocodone|hydromorphone|oxycodone|tramadol|morphine|fentanyl|methadone|oxymorphone|meperidine|opioid|chronic pain|forgets to take|more frequently than prescribed|missed dose|gabapentin.*(?:hydromorphone|hydrocodone|oxycodone|morphine)|constipation|dizziness|confusion|sedation|somnolence|addiction|non-opioid)\b/i;

/** Chronic opioid counseling vignette with orphan dispense/volume/calc stem and no liquid order data. */
function isOpioidClinicalCounselingMismatch(item: BankItem): boolean {
  const vignette = resolveNaplexVignette(item).toLowerCase();
  if (!CALC_LEAD_IN.test(resolveNaplexStem(item))) return false;
  if (!orphanGenericCalcStemIssue(item)) return false;
  return OPIOID_COUNSELING_VIGNETTE.test(vignette);
}

function buildOpioidAlternativeTherapyMcq(item: BankItem): BankItem {
  const vignette =
    resolveNaplexVignette(item) ||
    "A patient with chronic pain taking hydrocodone/acetaminophen asks about non-opioid options.";
  const options = [
    "Initiate physical therapy and scheduled acetaminophen monotherapy when appropriate",
    "Switch to extended-release oxycodone for smoother analgesia",
    "Recommend NSAID monotherapy without gastric-risk assessment",
    "Continue hydrocodone/acetaminophen and defer non-opioid discussion",
  ] as BankItem["options"];
  const correctAnswer = options[0]!;
  return {
    ...item,
    vignette,
    scenario: vignette,
    question: "Which alternative therapy is most appropriate?",
    options,
    correctAnswer,
    explanation:
      "Correct: Initiate physical therapy and scheduled acetaminophen monotherapy when appropriate — for stable chronic pain with opioid concern, multimodal non-opioid strategies are preferred when clinically appropriate. Extended-release oxycodone escalation increases opioid exposure. NSAIDs require gastric and renal risk assessment. Deferring non-opioid discussion misses an opportunity for safer pain management.",
    itemType: "vignette",
    ngnPayload: undefined,
    subjectId: item.subjectId || "patient-counseling",
    topicCategory: item.topicCategory ?? "Opioid Counseling",
  };
}

function buildOpioidCnsSideEffectCounselingMcq(item: BankItem): BankItem {
  const vignette =
    resolveNaplexVignette(item) ||
    "An older adult on scheduled tramadol for chronic pain reports dizziness and confusion.";
  const opioid = /\btramadol\b/i.test(vignette)
    ? "tramadol"
    : /\bhydrocodone\b/i.test(vignette)
      ? "hydrocodone"
      : /\boxycodone\b/i.test(vignette)
        ? "oxycodone"
        : "the opioid";
  const options = [
    `Counsel that dizziness and confusion may indicate CNS adverse effects or excessive opioid exposure in an older adult; recommend contacting the prescriber for reassessment, fall-risk precautions, and avoid unsupervised dose escalation of ${opioid}.`,
    `Recommend increasing ${opioid} to every 4 hours without prescriber approval to improve pain control despite confusion.`,
    "Advise stopping lisinopril and atorvastatin immediately because they are the most likely cause of opioid-related dizziness.",
    "Counsel that dizziness and confusion are expected with chronic pain therapy and do not require prescriber notification.",
  ] as BankItem["options"];
  const correctAnswer = options[0]!;
  return {
    ...item,
    vignette,
    scenario: vignette,
    question: "Which counseling point is most important?",
    options,
    correctAnswer,
    explanation:
      `Correct: Counsel on CNS adverse effects and prescriber follow-up — dizziness and confusion in an older adult on ${opioid} may signal sedation, drug interaction, or excessive opioid exposure; the pharmacist should recommend prescriber reassessment and fall-risk precautions rather than calculating a new mg dose. Unsupervised dose escalation increases respiratory depression and delirium risk. Lisinopril and atorvastatin are less likely primary causes of acute confusion than opioid CNS effects in this context. Dismissing symptoms delays needed safety evaluation.`,
    itemType: "vignette",
    ngnPayload: undefined,
    subjectId: item.subjectId || "patient-counseling",
    topicCategory: item.topicCategory ?? "Opioid CNS Side Effects",
  };
}

function buildOpioidSideEffectCounselingMcq(item: BankItem): BankItem {
  const vignette =
    resolveNaplexVignette(item) ||
    "A patient taking hydrocodone/acetaminophen with gabapentin reports dizziness and constipation.";
  const options = [
    "Counsel on additive CNS depression with gabapentin, constipation prevention, and daily acetaminophen limits from the combination product.",
    "Recommend increasing hydrocodone frequency to every 4 hours without prescriber approval.",
    "Advise stopping gabapentin immediately to resolve dizziness while continuing opioids.",
    "Recommend additional over-the-counter acetaminophen for breakthrough pain without checking total daily dose.",
  ] as BankItem["options"];
  const correctAnswer = options[0]!;
  return {
    ...item,
    vignette,
    scenario: vignette,
    question: "Which counseling point is most important?",
    options,
    correctAnswer,
    explanation:
      "Correct: Counsel on additive CNS depression with gabapentin, constipation prevention, and daily acetaminophen limits — opioids plus gabapentin increase sedation and fall risk; combination hydrocodone/acetaminophen products contribute to total APAP exposure (max 3–4 g/day in healthy adults unless directed otherwise). Unapproved dose escalation is unsafe. Abrupt gabapentin discontinuation can cause withdrawal and does not replace opioid safety counseling. Extra OTC acetaminophen can cause hepatotoxicity.",
    itemType: "vignette",
    ngnPayload: undefined,
    subjectId: item.subjectId || "patient-counseling",
    topicCategory: item.topicCategory ?? "Opioid Counseling",
  };
}

function buildOpioidAdherenceCounselingMcq(item: BankItem): BankItem {
  const vignette =
    resolveNaplexVignette(item) ||
    "A patient on scheduled opioid analgesia reports missed doses and taking medication more frequently than prescribed.";
  const options = [
    "Counsel not to exceed the prescribed maximum daily dose, use a dosing log or pill organizer, and contact the prescriber if pain remains uncontrolled rather than taking extra doses.",
    "Recommend taking an additional opioid dose whenever pain returns early, even if it exceeds the prescribed daily maximum.",
    "Advise stopping gabapentin and ibuprofen so the opioid can be taken more frequently for better pain control.",
    "Suggest doubling the next dose after a missed dose to catch up without contacting the prescriber.",
  ] as BankItem["options"];
  const correctAnswer = options[0]!;
  return {
    ...item,
    vignette,
    scenario: vignette,
    question: "Which counseling point is most important?",
    options,
    correctAnswer,
    explanation:
      "Correct: Counsel not to exceed the prescribed maximum daily dose and contact the prescriber if pain is uncontrolled — PRN opioids still have maximum daily limits; extra doses increase respiratory depression and misuse risk, especially with gabapentin co-therapy. Early redosing beyond the prescribed interval is unsafe. Stopping adjuvant analgesics does not fix adherence problems. Doubling doses after missed doses can cause toxicity without prescriber guidance.",
    itemType: "vignette",
    ngnPayload: undefined,
    subjectId: item.subjectId || "patient-counseling",
    topicCategory: item.topicCategory ?? "Opioid Adherence",
  };
}

function buildOpioidClinicalCounselingMcq(item: BankItem): BankItem {
  const v = resolveNaplexVignette(item).toLowerCase();
  if (/addiction|non-opioid|substance abuse|concern about.*(?:addict|opioid)/.test(v)) {
    return buildOpioidAlternativeTherapyMcq(item);
  }
  if (/forget|forgot|more frequently|extra dose|missed dose|adherence|takes it more|often forgets/.test(v)) {
    return buildOpioidAdherenceCounselingMcq(item);
  }
  if (/dizziness|confusion|sedation|somnolence/.test(v)) {
    if (/gabapentin|hydrocodone\/acetaminophen|hydrocodone.*acetaminophen|apap|tylenol/.test(v)) {
      return buildOpioidSideEffectCounselingMcq(item);
    }
    return buildOpioidCnsSideEffectCounselingMcq(item);
  }
  if (/constipation/.test(v)) {
    return buildOpioidSideEffectCounselingMcq(item);
  }
  return buildOpioidAdherenceCounselingMcq(item);
}

function isCopdWorseningVignette(vignette: string): boolean {
  const v = vignette.toLowerCase();
  const copdContext =
    /\b(?:copd|chronic obstructive|emphysema|chronic bronchitis)\b/.test(v) ||
    /tiotropium|umeclidinium|aclidinium|glycopyrrolate|indacaterol|olodaterol|vilanterol|breo ellipta|spiriva|incruse|trelegy|breztri/.test(
      v
    );
  const respiratorySymptoms =
    /shortness of breath|short of breath|\bsob\b|wheezing|cough|worsening|exacerbation|nocturnal|at night|more breath/.test(
      v
    );
  return copdContext && respiratorySymptoms;
}

function buildCopdWorseningMcq(item: BankItem): BankItem {
  const vignette =
    resolveNaplexVignette(item) ||
    "A patient with COPD on maintenance bronchodilator therapy reports worsening dyspnea and nocturnal cough at a pharmacy visit.";
  const options = [
    "Recommend that the patient contact the prescriber promptly because worsening dyspnea and nocturnal cough may indicate a COPD exacerbation requiring treatment adjustment (e.g., short-acting bronchodilator, systemic corticosteroids, or antibiotics as indicated).",
    "Dispense the requested refills without assessment and advise that nighttime cough and shortness of breath are expected with COPD and do not require evaluation.",
    "Advise stopping tiotropium because it is causing the cough and nocturnal symptoms.",
    "Recommend increasing amlodipine to 10 mg daily without prescriber contact to improve blood pressure control.",
  ] as BankItem["options"];
  const correctAnswer = options[0]!;
  return {
    ...item,
    vignette,
    scenario: vignette,
    question: "Which recommendation is most appropriate for this patient?",
    options,
    correctAnswer,
    explanation:
      "Correct: Recommend prompt prescriber follow-up for possible COPD exacerbation — increased dyspnea and nocturnal cough suggest worsening airflow obstruction that may need SABA, systemic corticosteroids, antibiotics, or therapy adjustment per GOLD guidelines; the pharmacist should not dismiss respiratory symptoms during a refill visit. Dismissing symptoms delays needed care. Stopping LAMA therapy without evaluation is inappropriate. Unsupervised amlodipine dose escalation is unsafe and does not address the primary respiratory complaint.",
    itemType: "vignette",
    ngnPayload: undefined,
    subjectId: item.subjectId || "respiratory-rx",
    topicCategory: item.topicCategory ?? "COPD Exacerbation",
  };
}

const IV_ANTIBIOTIC_VIGNETTE =
  /\b(?:piperacillin|tazobactam|cef(?:triaxone|epime|azolin|podoxime|dinir|uroxime)|vancomycin|meropenem|ertapenem|imipenem|zosyn|ampicillin|sulbactam|azithromycin|levofloxacin|ciprofloxacin|metronidazole|clindamycin|linezolid|daptomycin|antibiotic|antimicrobial)\b/i;

function extractIvAntibioticLabel(vignette: string): string {
  const named = vignette.match(
    /\b(piperacillin(?:[- ]tazobactam)?|cef(?:triaxone|epime|azolin|podoxime)|vancomycin|meropenem|ampicillin(?:[- ]sulbactam)?|azithromycin|levofloxacin|ciprofloxacin|metronidazole|clindamycin)\b/i
  );
  if (named?.[1]) return named[1].replace(/\s+/g, "-");
  const ivOrder = vignette.match(/\b([a-z]+(?:[-/][a-z]+)?)\s+\d+(?:\.\d+)?\s*g\s+iv\b/i);
  if (ivOrder?.[1]) return ivOrder[1];
  return "the prescribed IV antibiotic";
}

function hasClinicallySignificantRenalImpairment(vignette: string): boolean {
  const v = vignette.toLowerCase();
  if (/\b(?:dialysis|esrd|end-stage renal|oliguria|anuria)\b/.test(v)) return true;
  if (/\b(?:elevated creatinine|decreased urine output|reduced urine output)\b/.test(v)) return true;
  if (/\b(?:aki|acute kidney injury|acute renal failure)\b/.test(v)) return true;

  const egfrMatch = v.match(/\begfr\s*(?:of\s*|is\s*)?(?:approximately\s*)?(\d+(?:\.\d+)?)/);
  if (egfrMatch) {
    const egfr = parseFloat(egfrMatch[1]!);
    if (egfr < 60) return true;
    if (
      egfr >= 60 &&
      /\b(?:renal impairment|renal insufficiency|ckd|chronic kidney disease|adjust.*renal|renal dose)\b/.test(v)
    ) {
      return true;
    }
    if (egfr >= 60 && /\b(?:stable|within normal|normal renal function)\b/.test(v)) return false;
  }

  if (/\b(?:renal impairment|kidney disease|ckd|chronic kidney disease)\b/.test(v)) {
    if (egfrMatch && parseFloat(egfrMatch[1]!) >= 60 && /\b(?:stable|unchanged)\b/.test(v)) return false;
    return true;
  }

  const crclMatch = v.match(/\bcrcl\s*(?:of\s*)?(\d+(?:\.\d+)?)/);
  if (crclMatch && parseFloat(crclMatch[1]!) < 60) return true;

  return false;
}

function isSepsisRenalImpairmentVignette(vignette: string): boolean {
  const v = vignette.toLowerCase();
  const sepsisContext = /\b(?:sepsis|septic|bacteremia|febrile neutropenia)\b/.test(v);
  const ivAntibiotic =
    IV_ANTIBIOTIC_VIGNETTE.test(v) || /\d+(?:\.\d+)?\s*g\s+iv\b/i.test(v);
  return sepsisContext && hasClinicallySignificantRenalImpairment(v) && ivAntibiotic;
}

function isSepsisIvAntibioticTherapyVignette(vignette: string): boolean {
  const v = vignette.toLowerCase();
  const sepsisContext =
    /\b(?:sepsis|septic|bacteremia|febrile neutropenia|\bicu\b|intensive care)\b/.test(v);
  const ivAntibiotic =
    IV_ANTIBIOTIC_VIGNETTE.test(v) || /\d+(?:\.\d+)?\s*g\s+iv\b/i.test(v);
  return sepsisContext && ivAntibiotic;
}

export function isSepsisRenalAntibioticVignette(vignette: string): boolean {
  return isSepsisIvAntibioticTherapyVignette(vignette);
}

export function isSepsisIvAntibioticTherapyCounselingVignette(vignette: string): boolean {
  return isSepsisIvAntibioticTherapyVignette(vignette);
}

export function isAnticoagulantBleedingCounselingVignette(vignette: string): boolean {
  return isAnticoagulantCounselingVignette(vignette) || isAnticoagulantBleedingRiskCounselingVignette(vignette);
}

export function isNsaidAceInteractionVignette(vignette: string): boolean {
  return isNsaidAceInteractionCounselingVignette(vignette);
}

export function buildNsaidAceInteractionCounselingMcq(item: BankItem): BankItem {
  return buildNsaidAceInteractionMcq(item);
}

export function isPenicillinAllergyAmoxicillinCounselingVignette(vignette: string): boolean {
  return isPenicillinAllergyAmoxicillinVignette(vignette);
}

export function buildPenicillinAllergyAmoxicillinMcq(item: BankItem): BankItem {
  return buildPenicillinAllergyCounselingMcq(item);
}

export function isMetforminRenalSafetyVignette(vignette: string): boolean {
  return isMetforminRenalSafetyCounselingVignette(vignette);
}

export function buildMetforminRenalSafetyCounselingMcq(item: BankItem): BankItem {
  return buildMetforminRenalSafetyMcq(item);
}

export function buildOpioidCnsSideEffectMcq(item: BankItem): BankItem {
  return buildOpioidCnsSideEffectCounselingMcq(item);
}

export function buildAnticoagulantBleedingCounselingMcq(item: BankItem): BankItem {
  return buildAnticoagulantClinicalMcq(item);
}

export function isHeartFailureOrthostaticVignette(vignette: string): boolean {
  return isHeartFailureOrthostaticHypotensionVignette(vignette);
}

export function buildHeartFailureOrthostaticMcq(item: BankItem): BankItem {
  return buildHeartFailureOrthostaticHypotensionMcq(item);
}

export function buildSepsisRenalImpairmentMcq(item: BankItem): BankItem {
  const vignette =
    resolveNaplexVignette(item) ||
    "A patient with sepsis and renal impairment is receiving IV antibiotic therapy and takes metformin at home.";
  const abx = extractIvAntibioticLabel(vignette);
  const abxDisplay = abx.replace(/-/g, "/");
  const hasMetformin = /metformin/i.test(vignette);
  const renalAdjustmentCorrect = hasMetformin
    ? `Hold metformin because of acute sepsis with reduced renal function and lactic acidosis risk, and verify that ${abxDisplay} dose and interval are appropriate for current kidney function per protocol or pharmacy reference.`
    : `Recommend renal dose adjustment of ${abxDisplay} per current kidney function and institutional protocol, monitor creatinine and urine output, and coordinate with the prescriber before changing therapy.`;
  const options = [
    renalAdjustmentCorrect,
    hasMetformin
      ? `Continue metformin at the home dose and ${abxDisplay} without renal or acute-illness review.`
      : `Continue ${abxDisplay} at standard intervals without renal dose review because sepsis requires maximum antibiotic exposure.`,
    `Discontinue ${abxDisplay} and substitute oral cephalexin monotherapy for sepsis coverage.`,
    `Increase ${abxDisplay} total daily dose to maintain peak concentrations in renal impairment without prescriber consultation.`,
  ] as BankItem["options"];
  const correctAnswer = options[0]!;
  return {
    ...item,
    vignette,
    scenario: vignette,
    question: "Which recommendation is most appropriate regarding this patient's medication therapy?",
    options,
    correctAnswer,
    explanation: hasMetformin
      ? `Correct: Hold metformin and verify ${abxDisplay} against renal function — metformin should be held when acute sepsis and reduced kidney function increase lactic acidosis risk; IV antibiotic interval and dose must be reconciled with current renal function per institutional or manufacturer guidance. Continuing metformin during sepsis with AKI/CKD is unsafe. Oral cephalexin monotherapy is inadequate for serious sepsis. Unsupervised dose escalation can cause toxicity when renal clearance is impaired.`
      : `Correct: Recommend renal dose adjustment of ${abxDisplay} and close monitoring — sepsis with CKD/AKI (elevated creatinine, decreased urine output) requires reconciling beta-lactam interval and dose with current kidney function per protocol; piperacillin-tazobactam often needs extended dosing intervals as renal function declines. Continuing standard dosing without review risks accumulation and toxicity. Oral cephalexin monotherapy is inadequate for serious sepsis. Empiric total daily dose escalation without renal assessment is unsafe.`,
    itemType: "vignette",
    ngnPayload: undefined,
    subjectId: item.subjectId || "infectious-disease-rx",
    topicCategory: item.topicCategory ?? "Sepsis Renal Dosing",
  };
}

function buildSepsisVancomycinTherapyMcq(item: BankItem): BankItem {
  const vignette =
    resolveNaplexVignette(item) ||
    "A patient with sepsis in the ICU is receiving ceftriaxone and a new order for IV vancomycin.";
  const options = [
    "Verify vancomycin dose and interval against patient weight, renal function, and institutional protocol; recommend therapeutic drug monitoring (trough or AUC/MIC) and monitor renal function and ototoxicity because empiric vancomycin in sepsis requires pharmacokinetic follow-up rather than a one-time preparation calculation.",
    "Administer vancomycin without dose verification or drug-level monitoring because the eGFR is within normal limits.",
    "Discontinue ceftriaxone when vancomycin is added because dual IV therapy is never appropriate in sepsis.",
    "Empirically double the vancomycin dose without weight-based or renal assessment to maximize immediate bactericidal effect.",
  ] as BankItem["options"];
  const correctAnswer = options[0]!;
  return {
    ...item,
    vignette,
    scenario: vignette,
    question: "Which recommendation is most appropriate regarding this patient's medication therapy?",
    options,
    correctAnswer,
    explanation:
      "Correct: Verify vancomycin dosing and plan TDM — empiric vancomycin in ICU sepsis (often combined with a beta-lactam such as ceftriaxone) requires weight- and renal-based dose confirmation, subsequent trough or AUC monitoring, and nephrotoxicity/ototoxicity surveillance even when baseline eGFR is normal because acute illness can alter pharmacokinetics. Normal eGFR does not eliminate monitoring requirements. Ceftriaxone plus vancomycin is a common empiric combination for severe infection when MRSA coverage is needed. Unsupervised dose doubling increases toxicity risk without protocol justification.",
    itemType: "vignette",
    ngnPayload: undefined,
    subjectId: item.subjectId || "infectious-disease-rx",
    topicCategory: item.topicCategory ?? "Sepsis Vancomycin TDM",
  };
}

export function buildSepsisIvAntibioticTherapyMcq(item: BankItem): BankItem {
  const vignette = resolveNaplexVignette(item);
  if (isSepsisRenalImpairmentVignette(vignette)) return buildSepsisRenalImpairmentMcq(item);
  if (/vancomycin/i.test(vignette)) return buildSepsisVancomycinTherapyMcq(item);
  const abx = extractIvAntibioticLabel(vignette || "");
  const abxDisplay = abx.replace(/-/g, "/");
  const options = [
    `Verify ${abxDisplay} dose, interval, and duration against patient weight, renal function, infection source, and institutional sepsis protocol; monitor clinical response and coordinate with the prescriber before changing therapy.`,
    `Continue ${abxDisplay} at standard doses without renal or protocol review because sepsis requires maximum immediate exposure.`,
    `Discontinue ${abxDisplay} and substitute oral cephalexin monotherapy for sepsis coverage.`,
    `Increase ${abxDisplay} total daily dose without weight, renal, or prescriber review.`,
  ] as BankItem["options"];
  const correctAnswer = options[0]!;
  return {
    ...item,
    vignette: vignette || item.vignette,
    scenario: vignette || item.scenario,
    question: "Which recommendation is most appropriate regarding this patient's medication therapy?",
    options,
    correctAnswer,
    explanation: `Correct: Verify ${abxDisplay} against patient-specific factors and sepsis protocol — ICU sepsis therapy requires reconciling empiric IV antibiotic selection and dosing with weight, renal function, suspected source, and local guidelines, with ongoing monitoring for efficacy and toxicity. Empiric dose escalation without assessment is unsafe. Oral cephalexin monotherapy is inadequate for serious sepsis. Ignoring renal and weight parameters risks toxicity or under-dosing.`,
    itemType: "vignette",
    ngnPayload: undefined,
    subjectId: item.subjectId || "infectious-disease-rx",
    topicCategory: item.topicCategory ?? "Sepsis Antibiotic Therapy",
  };
}

function isHeartFailureOrthostaticHypotensionVignette(vignette: string): boolean {
  const v = vignette.toLowerCase();
  const hfContext = /\b(?:heart failure|\bhf\b|\bchf\b|hfrEF|hfref|cardiomyopathy)\b/.test(v);
  const diuretic = /\b(?:furosemide|bumetanide|torsemide|diuretic|lasix)\b/.test(v);
  const orthostatic =
    /\b(?:dizzy|dizziness|lightheaded|light-headed|upon standing|when standing|orthostatic|postural hypotension)\b/.test(
      v
    );
  const hypotension =
    /\b(?:hypotension|low blood pressure|\b\d{2,3}\/5\d\b|\b\d{2,3}\/4\d\b|\b\d{2,3}\/3\d\b)/.test(v) ||
    /blood pressure is 9[0-9]\/|blood pressure is 8[0-9]\//.test(v);
  return hfContext && diuretic && orthostatic && hypotension;
}

function buildHeartFailureOrthostaticHypotensionMcq(item: BankItem): BankItem {
  const vignette =
    resolveNaplexVignette(item) ||
    "A patient with heart failure on furosemide, lisinopril, and metoprolol reports dizziness on standing with low blood pressure.";
  const options = [
    "Counsel on slow position changes, assess for over-diuresis and orthostatic hypotension, and recommend contacting the prescriber to review furosemide and antihypertensive therapy before making dose changes.",
    "Recommend increasing furosemide to relieve dizziness because lightheadedness always indicates persistent volume overload.",
    "Advise stopping lisinopril, metoprolol, and furosemide immediately without prescriber contact.",
    "Recommend additional salt and fluid loading at home without medical evaluation because the blood pressure is low.",
  ] as BankItem["options"];
  const correctAnswer = options[0]!;
  return {
    ...item,
    vignette,
    scenario: vignette,
    question: "Which recommendation is most appropriate for this patient?",
    options,
    correctAnswer,
    explanation:
      "Correct: Counsel on orthostatic symptoms and coordinate with the prescriber — dizziness on standing with BP 90/60 mm Hg in a patient on furosemide plus lisinopril and metoprolol suggests orthostatic hypotension and possible over-diuresis; the pharmacist should assess volume status and involve the prescriber before adjusting diuretic or GDMT doses. Increasing furosemide may worsen hypotension if the patient is dry. Abruptly stopping all HF and antihypertensive therapy is unsafe. Unsupervised salt/fluid loading can worsen heart failure congestion.",
    itemType: "vignette",
    ngnPayload: undefined,
    subjectId: item.subjectId || "cardiovascular-rx",
    topicCategory: item.topicCategory ?? "Heart Failure Orthostatic Hypotension",
  };
}

function isAnticoagulantCounselingVignette(vignette: string): boolean {
  const v = vignette.toLowerCase();
  const anticoag =
    /\b(?:apixaban|eliquis|rivaroxaban|xarelto|dabigatran|pradaxa|edoxaban|savaysa|warfarin|coumadin|doac|anticoagulant)\b/.test(
      v
    );
  const indication =
    /\b(?:atrial fibrillation|\bafib\b|\baf\b|stroke prevention|venous thromboembolism|\bvte\b|dvt|pe\b|pulmonary embolism)\b/.test(
      v
    );
  const clinicalContext =
    /\b(?:bruising|bleeding|hematoma|melena|hematuria|refill|denies any significant bleeding|reports experiencing|concerned about|worried about|bleeding risk|bleeding risks)\b/.test(
      v
    );
  return anticoag && (indication || clinicalContext) && clinicalContext;
}

function isAnticoagulantBleedingRiskCounselingVignette(vignette: string): boolean {
  const v = vignette.toLowerCase();
  const anticoag =
    /\b(?:apixaban|eliquis|rivaroxaban|xarelto|dabigatran|pradaxa|edoxaban|savaysa|warfarin|coumadin|doac|anticoagulant)\b/.test(
      v
    );
  const counselingIntent =
    /\b(?:concerned about|worried about).*(?:bleeding|hemorrhage)|bleeding risk|bleeding risks\b/.test(v) ||
    (/\b(?:crcl|creatinine clearance|egfr|renal function)\b/.test(v) &&
      /\b(?:concerned|worried|bleeding)\b/.test(v));
  return anticoag && counselingIntent;
}

function buildAnticoagulantBleedingRiskMcq(item: BankItem): BankItem {
  const vignette =
    resolveNaplexVignette(item) ||
    "A patient with atrial fibrillation on apixaban asks about bleeding risk and renal function.";
  const doac = /\bapixaban|eliquis\b/i.test(vignette)
    ? "apixaban"
    : /\brivaroxaban|xarelto\b/i.test(vignette)
      ? "rivaroxaban"
      : /\bwarfarin|coumadin\b/i.test(vignette)
        ? "warfarin"
        : "the anticoagulant";
  const options = [
    `Counsel on signs of serious bleeding, when to contact the prescriber, and not to stop ${doac} without guidance; verify the prescribed dose remains appropriate for renal function and labeling criteria for dose reduction before focusing on dispense quantity.`,
    `Recommend stopping ${doac} immediately because any bleeding concern contraindicates anticoagulation in atrial fibrillation.`,
    `Advise switching to aspirin 81 mg daily alone for stroke prevention without prescriber consultation.`,
    `Dispense the 30-day supply without counseling because tablet quantity is the only pharmacist responsibility.`,
  ] as BankItem["options"];
  const correctAnswer = options[0]!;
  return {
    ...item,
    vignette,
    scenario: vignette,
    question: "Which counseling point is most important?",
    options,
    correctAnswer,
    explanation:
      `Correct: Counsel on bleeding signs and verify ${doac} dosing — patients on DOACs need clear guidance on when to seek care and should not stop therapy without prescriber input; apixaban dose (5 mg vs 2.5 mg twice daily) must be reconciled with age, weight, renal function, and labeling criteria, especially when CrCl is reduced or bleeding is a concern. Stopping anticoagulation abruptly increases thrombotic stroke risk in atrial fibrillation. Aspirin monotherapy is not equivalent stroke prevention for most AF patients indicated for anticoagulation. Dispense quantity is secondary to safety counseling and dose verification.`,
    itemType: "vignette",
    ngnPayload: undefined,
    subjectId: item.subjectId || "cardiovascular-rx",
    topicCategory: item.topicCategory ?? "Anticoagulation Counseling",
  };
}

function buildAnticoagulantClinicalMcq(item: BankItem): BankItem {
  const vignette = resolveNaplexVignette(item);
  if (isAnticoagulantBleedingRiskCounselingVignette(vignette)) {
    return buildAnticoagulantBleedingRiskMcq(item);
  }
  return buildAnticoagulantBruisingMcq(item);
}

function buildAnticoagulantBruisingMcq(item: BankItem): BankItem {
  const vignette =
    resolveNaplexVignette(item) ||
    "A patient with atrial fibrillation on apixaban reports mild bruising at a pharmacy refill visit.";
  const doac = /\bapixaban|eliquis\b/i.test(vignette)
    ? "apixaban"
    : /\brivaroxaban|xarelto\b/i.test(vignette)
      ? "rivaroxaban"
      : /\bwarfarin|coumadin\b/i.test(vignette)
        ? "warfarin"
        : "the anticoagulant";
  const options = [
    `Counsel that mild bruising can occur with ${doac}; review signs of serious bleeding (e.g., melena, hematuria, severe headache, prolonged bleeding), advise contacting the prescriber for significant bleeding, and not to stop ${doac} without prescriber guidance.`,
    `Recommend stopping ${doac} immediately because any bruising indicates life-threatening hemorrhage.`,
    `Advise switching to aspirin 81 mg daily alone for stroke prevention in atrial fibrillation.`,
    `Dispense the refill without assessment because mild bruising never warrants counseling on anticoagulants.`,
  ] as BankItem["options"];
  const correctAnswer = options[0]!;
  return {
    ...item,
    vignette,
    scenario: vignette,
    question: "Which counseling point is most important?",
    options,
    correctAnswer,
    explanation:
      `Correct: Counsel on expected vs serious bleeding with ${doac} — minor bruising is common with DOACs; patients need clear guidance on when to seek care and should not stop anticoagulation without prescriber direction because stroke prevention benefit usually outweighs minor bruising. Stopping ${doac} abruptly increases thrombotic stroke risk in atrial fibrillation. Aspirin monotherapy is inferior to anticoagulation for stroke prevention in most AF patients indicated for DOAC therapy. Refill visits are an opportunity to assess bleeding and adherence.`,
    itemType: "vignette",
    ngnPayload: undefined,
    subjectId: item.subjectId || "cardiovascular-rx",
    topicCategory: item.topicCategory ?? "Anticoagulation Counseling",
  };
}

function isMetforminRenalSafetyCounselingVignette(vignette: string): boolean {
  const v = vignette.toLowerCase();
  const metforminContext = /\bmetformin\b/.test(v);
  const renalContext =
    /\b(?:chronic kidney disease|\bckd\b|renal impairment|egfr|gfr|creatinine|reduced renal)\b/.test(v) ||
    /\begfr\s*\d+|\d+\s*mL\/min/i.test(v);
  const safetyConcern =
    /\b(?:concerned about|worried about|expresses concern|safety of this medication|safe to take|lactic acidosis|given his renal|given her renal)\b/.test(
      v
    );
  return metforminContext && renalContext && safetyConcern;
}

function buildMetforminRenalSafetyMcq(item: BankItem): BankItem {
  const vignette =
    resolveNaplexVignette(item) ||
    "A patient with chronic kidney disease on metformin asks about medication safety given reduced renal function.";
  const options = [
    "Counsel that metformin requires renal monitoring and prescriber-guided dosing: it is contraindicated if eGFR is below 30 mL/min/1.73 m²; when eGFR is 30–44 mL/min/1.73 m² use caution with dose reduction (often maximum 1000 mg/day), monitor renal function regularly, and seek care for lactic acidosis symptoms rather than selecting a new mg dose without prescriber input.",
    "Recommend increasing metformin to 1250 mg daily without prescriber approval because glycemic control is the priority.",
    "Advise that metformin is safe at any dose whenever the patient feels well, regardless of eGFR.",
    "Recommend stopping metformin permanently at eGFR 45 mL/min without contacting the prescriber or discussing glycemic alternatives.",
  ] as BankItem["options"];
  const correctAnswer = options[0]!;
  return {
    ...item,
    vignette,
    scenario: vignette,
    question: "Which counseling point is most important?",
    options,
    correctAnswer,
    explanation:
      "Correct: Counsel on metformin renal thresholds and prescriber coordination — metformin is contraindicated when eGFR falls below 30 because of lactic acidosis risk; in the 30–44 mL/min/1.73 m² range, use caution with dose limits and ongoing renal monitoring per labeling and guidelines. Empiric dose escalation without renal assessment is unsafe. Dismissing renal function ignores a major contraindication domain. Abrupt discontinuation without prescriber discussion may worsen glycemic control without a planned alternative.",
    itemType: "vignette",
    ngnPayload: undefined,
    subjectId: item.subjectId || "cardiovascular-rx",
    topicCategory: item.topicCategory ?? "Metformin Renal Safety",
  };
}

function isAmoxicillinUtiIncompleteDispenseVignette(vignette: string, stem?: string): boolean {
  const blob = [vignette, stem].filter(Boolean).join("\n").toLowerCase();
  if (hasTabletDispenseDaySupply(blob)) return false;
  if (isPenicillinAllergyAmoxicillinVignette(vignette)) return false;
  return (
    /\bamoxicillin\b/.test(blob) &&
    /\buti\b|urinary tract infection/.test(blob) &&
    /\b(?:500\s*mg|three times daily|tid|t\.i\.d\.)\b/.test(blob)
  );
}

export function isAmoxicillinUtiIncompleteDispenseCounselingVignette(vignette: string, stem?: string): boolean {
  return isAmoxicillinUtiIncompleteDispenseVignette(vignette, stem);
}

export function buildUtiAmoxicillinCounselingMcq(item: BankItem): BankItem {
  const vignette =
    resolveNaplexVignette(item) ||
    "A patient presents with a new prescription for amoxicillin for a urinary tract infection.";
  const options = [
    "Counsel to take amoxicillin exactly as prescribed for the full course, complete all dispensed tablets even if UTI symptoms improve, maintain adequate hydration, and contact the prescriber if fever, flank pain, or vomiting occurs; amoxicillin is generally compatible with lisinopril when renal function is stable—verify the prescribed day supply on the Rx before calculating dispense quantity.",
    "Advise stopping amoxicillin once dysuria resolves to minimize antibiotic exposure.",
    "Recommend avoiding amoxicillin because of a dangerous interaction with lisinopril that requires switching antihypertensive therapy.",
    "Dispense 21 tablets as the standard UTI quantity without confirming the prescribed duration on the prescription.",
  ] as BankItem["options"];
  const correctAnswer = options[0]!;
  return {
    ...item,
    vignette,
    scenario: vignette,
    question: "Which counseling point is most important?",
    options,
    correctAnswer,
    explanation:
      "Correct: Counsel on completing the full antibiotic course and verifying Rx duration — uncomplicated UTI amoxicillin regimens require finishing all prescribed doses even when symptoms improve; dispense quantity depends on the prescribed day supply (e.g., 500 mg three times daily for 7 days = 21 tablets). Amoxicillin does not have a clinically significant interaction with lisinopril when renal function is stable. Stopping early increases relapse and resistance risk. There is no lisinopril contraindication requiring therapy change. Assuming a fixed tablet count without verifying duration is a dispensing error.",
    itemType: "vignette",
    ngnPayload: undefined,
    subjectId: item.subjectId || "patient-counseling",
    topicCategory: item.topicCategory ?? "UTI Antibiotic Counseling",
  };
}

function isPregnancyTopicalAntibioticSafetyVignette(vignette: string): boolean {
  const v = vignette.toLowerCase();
  const pregnant =
    /\b(?:pregnan|gravid|gestation|trimester|unborn|fetus|fetal)\b/.test(v) ||
    /\b\d+\s*-?\s*week(?:s)?\s*(?:gestation|pregnant|ga\b)/.test(v);
  const topicalAbx =
    /\btopical antibiotic\b/.test(v) ||
    (/\btopical\b/.test(v) &&
      /\b(?:antibiotic|mupirocin|clindamycin|erythromycin|metronidazole|bacitracin|neomycin|polymyxin|skin infection|impetigo)\b/.test(
        v
      ));
  const safetyConcern =
    /\b(?:concerned about|worried about|asks about|safety of|safe for|risk to).*(?:unborn|baby|child|fetus|pregnancy|pregnan)\b/.test(
      v
    ) ||
    /\b(?:safe during pregnancy|teratogen|harm (?:to )?(?:the )?(?:baby|fetus|unborn))\b/.test(v);
  return pregnant && topicalAbx && safetyConcern;
}

export function isPregnancyTopicalAntibioticSafetyCounselingVignette(vignette: string): boolean {
  return isPregnancyTopicalAntibioticSafetyVignette(vignette);
}

export function buildPregnancyTopicalAntibioticCounselingMcq(item: BankItem): BankItem {
  const vignette =
    resolveNaplexVignette(item) ||
    "A pregnant patient is prescribed a topical antibiotic for a skin infection and asks about fetal safety.";
  const options = [
    "Counsel that a prescribed topical antibiotic for a localized skin infection generally has limited systemic absorption compared with oral therapy, but pregnancy safety depends on the specific agent, gestational age, and treated area; review product labeling, use only as directed on the prescribed site, and encourage follow-up with her prescriber or obstetric provider if concerns persist.",
    "Reassure the patient that all topical medications are completely safe in pregnancy and no product-specific safety review is needed.",
    "Refuse to dispense any topical antibiotic during pregnancy regardless of indication or prescriber order.",
    "Recommend switching to a high-dose oral antibiotic without prescriber consultation because topical therapy is always contraindicated in pregnancy.",
  ] as BankItem["options"];
  const correctAnswer = options[0]!;
  return {
    ...item,
    vignette,
    scenario: vignette,
    question: "Which counseling point is most important?",
    options,
    correctAnswer,
    explanation:
      "Correct: Counsel on limited systemic exposure with appropriate topical use while verifying agent-specific pregnancy information — many commonly prescribed topical antibiotics (e.g., mupirocin, clindamycin, erythromycin) are used for localized skin infections with relatively low systemic absorption when applied to a limited area as directed, but safety assessment must consider the specific drug, amount used, duration, and gestational age per labeling and guidelines. Blanket reassurance ignores product-specific teratogenic or labeling concerns. Refusing all topical antibiotics or switching to oral therapy without prescriber input is inappropriate when a localized infection has been evaluated.",
    itemType: "vignette",
    ngnPayload: undefined,
    subjectId: item.subjectId || "patient-counseling",
    topicCategory: item.topicCategory ?? "Pregnancy Medication Safety",
  };
}

function isPenicillinAllergyAmoxicillinVignette(vignette: string): boolean {
  const v = vignette.toLowerCase();
  const betaLactamRx =
    /\b(?:amoxicillin|ampicillin|augmentin|amoxicillin-clavulanate|penicillin v|penicillin vk)\b/.test(v);
  const allergyHistory =
    /\b(?:allergic to penicillin|penicillin allergy|allergy to penicillin|severe allergic reaction to penicillin)\b/.test(
      v
    ) ||
    (/\bpenicillin\b/.test(v) &&
      /\b(?:allerg|anaphylaxis|hives|urticaria|difficulty breathing|angioedema|severe reaction)\b/.test(v));
  return betaLactamRx && allergyHistory;
}

function buildPenicillinAllergyCounselingMcq(item: BankItem): BankItem {
  const vignette =
    resolveNaplexVignette(item) ||
    "A patient with a history of severe penicillin allergy presents with a prescription for amoxicillin and is concerned about taking it.";
  const options = [
    "Do not dispense amoxicillin; counsel that a history of severe penicillin allergy with hives and difficulty breathing is a contraindication to aminopenicillins and contact the prescriber for a non–beta-lactam alternative appropriate for the infection.",
    "Dispense amoxicillin because most documented penicillin allergies are not clinically significant.",
    "Recommend taking amoxicillin with diphenhydramine to prevent an allergic reaction.",
    "Counsel that amoxicillin has no cross-reactivity with penicillin and may be taken safely.",
  ] as BankItem["options"];
  const correctAnswer = options[0]!;
  return {
    ...item,
    vignette,
    scenario: vignette,
    question: "Which recommendation is most appropriate for this patient?",
    options,
    correctAnswer,
    explanation:
      "Correct: Do not dispense amoxicillin and contact the prescriber — severe penicillin allergy with hives and respiratory symptoms indicates type I hypersensitivity risk; amoxicillin is an aminopenicillin and is contraindicated. The pharmacist should facilitate a non–beta-lactam alternative based on infection type and local guidelines. Dismissing allergy history is unsafe. Antihistamine premedication does not prevent anaphylaxis and is not appropriate outpatient management for a contraindicated drug. Amoxicillin shares beta-lactam cross-reactivity with penicillin.",
    itemType: "vignette",
    ngnPayload: undefined,
    subjectId: item.subjectId || "patient-counseling",
    topicCategory: item.topicCategory ?? "Penicillin Allergy",
  };
}

function isNsaidAceInteractionCounselingVignette(vignette: string): boolean {
  const v = vignette.toLowerCase();
  const nsaid =
    /\b(?:ibuprofen|naproxen|ketorolac|nsaid|diclofenac|celecoxib|meloxicam|indomethacin)\b/.test(v);
  const aceArb =
    /\b(?:lisinopril|enalapril|losartan|valsartan|ramipril|benazepril|captopril|ace inhibitor|\barb\b|olmesartan|telmisartan)\b/.test(
      v
    );
  const interactionConcern =
    /\b(?:interaction|interactions|concerned about|worried about|potential interaction|drug interaction)\b/.test(
      v
    );
  return nsaid && aceArb && interactionConcern;
}

function buildNsaidAceInteractionMcq(item: BankItem): BankItem {
  const vignette =
    resolveNaplexVignette(item) ||
    "A patient taking lisinopril for hypertension also uses ibuprofen for chronic pain and asks about drug interactions.";
  const nsaid = /\bibuprofen\b/i.test(vignette)
    ? "ibuprofen"
    : /\bnaproxen\b/i.test(vignette)
      ? "naproxen"
      : "the NSAID";
  const options = [
    `Counsel that chronic ${nsaid} use with lisinopril can reduce antihypertensive efficacy and increase the risk of renal dysfunction and hyperkalemia; recommend discussing NSAID alternatives (e.g., acetaminophen, topical agents, physical therapy) with the prescriber and monitoring blood pressure and renal function.`,
    `Recommend continuing ${nsaid} at maximum over-the-counter doses indefinitely because blood pressure is currently normal and no side effects are reported.`,
    "Advise stopping lisinopril and atorvastatin immediately so ibuprofen can be used without interaction concern.",
    "Counsel that NSAIDs have no clinically relevant interactions with ACE inhibitors in patients with well-controlled blood pressure.",
  ] as BankItem["options"];
  const correctAnswer = options[0]!;
  return {
    ...item,
    vignette,
    scenario: vignette,
    question: "Which counseling point is most important?",
    options,
    correctAnswer,
    explanation:
      `Correct: Counsel on ACE inhibitor–NSAID interaction — chronic ${nsaid} with lisinopril can antagonize blood pressure control and impair renal perfusion, increasing risk of acute kidney injury and hyperkalemia even when BP appears well controlled; discuss safer analgesic options and monitoring with the prescriber. Continuing high-dose NSAIDs because BP is normal today ignores delayed renal and BP effects. Stopping cardiovascular preventive therapy is inappropriate. NSAIDs are not interaction-free with ACE inhibitors.`,
    itemType: "vignette",
    ngnPayload: undefined,
    subjectId: item.subjectId || "patient-counseling",
    topicCategory: item.topicCategory ?? "NSAID ACE Interaction",
  };
}

function buildOrphanClinicalCalcMcqRepair(item: BankItem): BankItem {
  const vignette = resolveNaplexVignette(item);
  const stem = resolveNaplexStem(item);
  if (isAmoxicillinUtiIncompleteDispenseVignette(vignette, stem)) {
    return buildUtiAmoxicillinCounselingMcq(item);
  }
  if (isPregnancyTopicalAntibioticSafetyVignette(vignette)) {
    return buildPregnancyTopicalAntibioticCounselingMcq(item);
  }
  if (isAnaphylaxisEmergencyOptionsMismatch(item)) return buildAnaphylaxisEmergencyMcq(item);
  if (isSeverePreeclampsiaOptionsMismatch(item)) return buildSeverePreeclampsiaEmergencyMcq(item);
  if (isPsychiatricSuicideRiskOptionsMismatch(item)) return buildPsychiatricSuicideRiskMcq(item);
  if (isPsychiatricUnitPrioritizationOptionsMismatch(item)) {
    return buildPsychiatricUnitPrioritizationMcq(item);
  }
  if (isPostpartumHemorrhageOptionsMismatch(item)) return buildPostpartumHemorrhageEmergencyMcq(item);
  if (isEmergencyDepartmentPrioritizationOptionsMismatch(item)) {
    return buildEmergencyDepartmentPrioritizationMcq(item);
  }
  if (isPediatricEdPrioritizationOptionsMismatch(item)) return buildPediatricEdPrioritizationMcq(item);
  if (isLaborDeliveryPrioritizationOptionsMismatch(item)) return buildLaborDeliveryPrioritizationMcq(item);
  if (isMedSurgPrioritizationOptionsMismatch(item)) return buildMedSurgPrioritizationMcq(item);
  if (isAcuteDecompensatedHeartFailureOptionsMismatch(item)) {
    return buildAcuteDecompensatedHeartFailureMcq(item);
  }
  if (isUpperGiBleedOptionsMismatch(item)) return buildUpperGiBleedEmergencyMcq(item);
  if (isWarfarinBleedingOptionsMismatch(item)) return buildWarfarinBleedingMcq(item);
  if (isMetforminRenalSafetyCounselingVignette(vignette)) return buildMetforminRenalSafetyMcq(item);
  if (isPenicillinAllergyAmoxicillinVignette(vignette)) return buildPenicillinAllergyCounselingMcq(item);
  if (isNsaidAceInteractionCounselingVignette(vignette)) return buildNsaidAceInteractionMcq(item);
  if (isHeartFailureOrthostaticHypotensionVignette(vignette)) {
    return buildHeartFailureOrthostaticHypotensionMcq(item);
  }
  if (isAnticoagulantCounselingVignette(vignette)) return buildAnticoagulantClinicalMcq(item);
  if (isSepsisIvAntibioticTherapyVignette(vignette)) return buildSepsisIvAntibioticTherapyMcq(item);
  if (isCopdWorseningVignette(vignette)) return buildCopdWorseningMcq(item);
  if (isAsthmaClinicalCalcMismatch(item)) return buildAsthmaClinicalMcqRepair(item);
  if (OPIOID_COUNSELING_VIGNETTE.test(vignette)) return buildOpioidClinicalCounselingMcq(item);
  return buildGenericClinicalPresentationMcq(item);
}

function buildGenericClinicalPresentationMcq(item: BankItem): BankItem {
  const vignette = resolveNaplexVignette(item) || item.scenario || "";
  const options = [
    "Coordinate with the prescriber on a patient-specific, evidence-based plan before changing therapy.",
    "Recommend doubling the current medication dose without prescriber approval.",
    "Advise stopping all current therapy and self-managing symptoms at home.",
    "Dispense the requested medication without assessment or counseling.",
  ] as BankItem["options"];
  const correctAnswer = options[0]!;
  return {
    ...item,
    vignette,
    scenario: vignette,
    question: inferMcqStemFromVignette(vignette),
    options,
    correctAnswer,
    explanation:
      "Correct: Coordinate with the prescriber on a patient-specific plan — when a patient reports new or worsening symptoms during a pharmacy visit, the pharmacist should assess urgency and involve the prescribing team when therapy changes may be needed. Unsupervised dose escalation, stopping prescribed therapy abruptly, and dispensing without assessment are unsafe.",
    itemType: "vignette",
    ngnPayload: undefined,
  };
}

function buildClinicalVignetteUnrelatedCalcMcq(item: BankItem): BankItem {
  return buildOrphanClinicalCalcMcqRepair(item);
}

function buildAsthmaExacerbationMcq(item: BankItem): BankItem {
  const vignette =
    resolveNaplexVignette(item) ||
    "A patient presents to the emergency department with an acute asthma exacerbation and hypoxemia despite home controller and rescue inhaler therapy.";
  const options = [
    "Recommend continued short-acting beta-agonist bronchodilator therapy with supplemental oxygen and systemic corticosteroids per acute asthma protocol.",
    "Discharge with instructions to continue home fluticasone/salmeterol only and schedule albuterol every 4 hours around the clock.",
    "Start high-dose inhaled corticosteroid monotherapy without bronchodilator escalation.",
    "Counsel that mouth rinsing after each albuterol puff is required to prevent oral candidiasis.",
  ] as BankItem["options"];
  const correctAnswer = options[0]!;
  return {
    ...item,
    vignette,
    scenario: vignette,
    question: "What is the most appropriate pharmacist recommendation at this time?",
    options,
    correctAnswer,
    explanation:
      "Correct: Recommend continued short-acting beta-agonist bronchodilator therapy with supplemental oxygen and systemic corticosteroids — acute asthma exacerbation with hypoxemia and tachycardia in the emergency department requires escalation of bronchodilator therapy, oxygen to correct SpO₂, and systemic corticosteroids. Discharging on home controller therapy alone is unsafe with active exacerbation and hypoxemia. ICS monotherapy without SABA escalation does not treat acute bronchospasm. Mouth rinsing prevents thrush after inhaled corticosteroids, not after albuterol alone.",
    itemType: "vignette",
    ngnPayload: undefined,
    subjectId: item.subjectId || "respiratory-rx",
    topicCategory: item.topicCategory ?? "Asthma Exacerbation",
  };
}

/** Hypertensive emergency vignette mis-labeled as constructed_response / numeric entry. */
function isHypertensiveEmergencyMismatch(item: BankItem): boolean {
  const text = blob(item).toLowerCase();
  return (
    (/210\s*\/\s*120|210\/120/.test(text) || /blood pressure is 2\d{2}/.test(text)) &&
    /headache/.test(text) &&
    (/blurred vision|visual/.test(text) || /amlodipine/.test(text)) &&
    (/amlodipine/.test(text) || /lisinopril/.test(text)) &&
    (MCQ_LEAD_IN.test(resolveNaplexStem(item)) ||
      /which finding requires immediate follow-up/i.test(resolveNaplexStem(item)))
  );
}

const SCREENING_LIFESTYLE_OPTION =
  /\b(?:body mass index|\bbmi\b|waist circumference|daytime fatigue|difficulty sleeping|poor sleep|sedentary lifestyle|weight loss counseling)\b/i;

const OB_WELLNESS_MISPLACED_OPTION =
  /\b(?:safe weight loss|weight loss during pregnancy|small, frequent meals|manage nausea|dietitian|nutritional counseling|hydration status)\b/i;

function allOptionsScreeningLifestyle(options: string[]): boolean {
  const usable = options.filter((o) => o.trim().length > 2);
  return usable.length >= 4 && usable.every((o) => SCREENING_LIFESTYLE_OPTION.test(o));
}

function allOptionsObstetricWellnessMisplaced(options: string[]): boolean {
  const usable = options.filter((o) => o.trim().length > 2);
  return usable.length >= 4 && usable.every((o) => OB_WELLNESS_MISPLACED_OPTION.test(o));
}

const PROCEDURE_PREP_MISPLACED_OPTION =
  /\b(?:during the procedure|procedure is routine|clear liquid diet|what to expect during|importance of the clear liquid)\b/i;

function allOptionsProcedurePrepMisplaced(options: string[]): boolean {
  const usable = options.filter((o) => o.trim().length > 2);
  return (
    usable.length >= 4 &&
    usable.filter((o) => PROCEDURE_PREP_MISPLACED_OPTION.test(o) || /discuss (?:his|her|their) anxiety further/i.test(o))
      .length >= 3
  );
}

const POSTOP_MEDICAL_MISPLACED_OPTION =
  /\b(?:pain medication|iv fluid rate|abdomen for distension|abdominal distension|encourage the client to ambulate|ambulate in the hallway)\b/i;

function allOptionsPostOpMedicalMisplaced(options: string[]): boolean {
  const usable = options.filter((o) => o.trim().length > 2);
  return usable.length >= 4 && usable.filter((o) => POSTOP_MEDICAL_MISPLACED_OPTION.test(o)).length >= 3;
}

const PPH_MISPLACED_OPTION =
  /\b(?:lethargy|oxygen flow rate|deep breaths|chest x-ray|chest x ray|encourage the client to take deep breaths)\b/i;

const COLON_SCREENING_MISPLACED_OPTION =
  /\b(?:colon cancer|colonoscopy|colorectal|screening recommendations)\b/i;

function allOptionsPostpartumHemorrhageMisplaced(options: string[]): boolean {
  const usable = options.filter((o) => o.trim().length > 2);
  return usable.length >= 4 && usable.every((o) => PPH_MISPLACED_OPTION.test(o));
}

const PPH_RECOVERY_MISPLACED_OPTION =
  /\b(?:absence of flatus|anxiety about recovery|severe abdominal pain|stable vital signs)\b/i;

function allOptionsPostpartumRecoveryMisplaced(options: string[]): boolean {
  const usable = options.filter((o) => o.trim().length > 2);
  return usable.length >= 4 && usable.every((o) => PPH_RECOVERY_MISPLACED_OPTION.test(o));
}

function allOptionsColonCancerScreeningMisplaced(options: string[]): boolean {
  const usable = options.filter((o) => o.trim().length > 2);
  return usable.length >= 4 && usable.every((o) => COLON_SCREENING_MISPLACED_OPTION.test(o));
}

const WOUND_CARE_MISPLACED_OPTION =
  /\b(?:hydrocolloid dressing|change positions every 2 hours|proper nutrition to promote healing|size and appearance of the wound|wound care|turning schedule)\b/i;

function allOptionsWoundCareMisplaced(options: string[]): boolean {
  const usable = options.filter((o) => o.trim().length > 2);
  return usable.length >= 4 && usable.every((o) => WOUND_CARE_MISPLACED_OPTION.test(o));
}

const GENERAL_WELLNESS_MISPLACED_OPTION =
  /\b(?:registered dietitian|balanced diet rich in fruits|personalized exercise plan|regular health screenings|health screenings|exercise plan|nutritional counseling)\b/i;

function allOptionsGeneralWellnessMisplaced(options: string[]): boolean {
  const usable = options.filter((o) => o.trim().length > 2);
  return usable.length >= 4 && usable.every((o) => GENERAL_WELLNESS_MISPLACED_OPTION.test(o));
}

const FIRE_SAFETY_MISPLACED_OPTION =
  /\b(?:escape plan in case of fire|smoke detectors|flammable materials away from heat|test smoke detectors monthly|fire safety)\b/i;

function allOptionsFireSafetyMisplaced(options: string[]): boolean {
  const usable = options.filter((o) => o.trim().length > 2);
  return usable.length >= 4 && usable.every((o) => FIRE_SAFETY_MISPLACED_OPTION.test(o));
}

const CHART_REVIEW_MISPLACED_OPTION =
  /\b(?:history of gastrointestinal bleeding|taking atorvastatin|prescription for lisinopril|low-sodium diet|atorvastatin at bedtime)\b/i;

function allOptionsChartReviewMisplaced(options: string[]): boolean {
  const usable = options.filter((o) => o.trim().length > 2);
  return usable.length >= 4 && usable.every((o) => CHART_REVIEW_MISPLACED_OPTION.test(o));
}

const AMBULATION_FALL_MISPLACED_OPTION =
  /\b(?:pain level before ambulation|provide a walker|ambulate with assistance|fall prevention strategies|encourage the client to ambulate)\b/i;

function allOptionsAmbulationFallPreventionMisplaced(options: string[]): boolean {
  const usable = options.filter((o) => o.trim().length > 2);
  return usable.length >= 4 && usable.every((o) => AMBULATION_FALL_MISPLACED_OPTION.test(o));
}

const MEDICATION_COUNSELING_MISPLACED_OPTION =
  /\b(?:take the medication with food|potential side effects|renal function before administration|completing the full course of antibiotics|full course of antibiotics)\b/i;

function allOptionsMedicationCounselingMisplaced(options: string[]): boolean {
  const usable = options.filter((o) => o.trim().length > 2);
  return usable.length >= 4 && usable.every((o) => MEDICATION_COUNSELING_MISPLACED_OPTION.test(o));
}

const MINOR_FINDING_MISPLACED_OPTION =
  /\b(?:headache that is relieved by acetaminophen|blood pressure is \d{2,3}\/\d{2,3}|recent nosebleeds|occasional bruising)\b/i;

function allOptionsMinorFindingMisplaced(options: string[]): boolean {
  const usable = options.filter((o) => o.trim().length > 2);
  return usable.length >= 4 && usable.every((o) => MINOR_FINDING_MISPLACED_OPTION.test(o));
}

function countAssignmentRooms(vignette: string): number {
  return vignette.match(/\broom \d+\b/gi)?.length ?? 0;
}

function extractAssignmentRoomCases(vignette: string): Array<{ room: string; text: string }> {
  const re = /\b(?:In\s+)?Room\s+(\d+)\b/gi;
  const markers: Array<{ room: string; start: number }> = [];
  let match: RegExpExecArray | null;
  while ((match = re.exec(vignette)) !== null) {
    markers.push({ room: match[1]!, start: match.index + match[0].length });
  }
  return markers.map((entry, index) => ({
    room: entry.room,
    text: vignette
      .slice(entry.start, markers[index + 1]?.start ?? vignette.length)
      .trim()
      .replace(/^(?:\s*[:,]\s*|\s+(?:contains|has)\s+)/i, "")
      .replace(/\.\s*$/, ""),
  }));
}

const DIABETIC_EYE_MISPLACED_OPTION =
  /\b(?:eye exam|diabetic retinopathy|need for eye exams|schedule an eye exam)\b/i;

function allOptionsDiabeticEyeCareMisplaced(options: string[]): boolean {
  const usable = options.filter((o) => o.trim().length > 2);
  return (
    usable.length >= 4 &&
    usable.filter(
      (o) =>
        DIABETIC_EYE_MISPLACED_OPTION.test(o) || /document the discussion in the client'?s chart/i.test(o)
    ).length >= 3
  );
}

const DIABETES_EDUCATION_MISPLACED_OPTION =
  /\b(?:blood glucose monitoring|signs and symptoms of hypoglycemia|injection techniques|dietary modifications)\b/i;

function allOptionsDiabetesEducationMisplaced(options: string[]): boolean {
  const usable = options.filter((o) => o.trim().length > 2);
  return usable.length >= 4 && usable.every((o) => DIABETES_EDUCATION_MISPLACED_OPTION.test(o));
}

const WARFARIN_MISPLACED_OPTION =
  /\b(?:inr monitoring|elevated inr|hold the next dose of warfarin|administer vitamin k|warfarin)\b/i;

function allOptionsWarfarinAnticoagMisplaced(options: string[]): boolean {
  const usable = options.filter((o) => o.trim().length > 2);
  return usable.length >= 4 && usable.every((o) => WARFARIN_MISPLACED_OPTION.test(o));
}

const FLU_VACCINE_MISPLACED_OPTION =
  /\b(?:flu vaccine|influenza vaccine|contraindications to the vaccine|follow-up appointment for the vaccine)\b/i;

function allOptionsFluVaccineMisplaced(options: string[]): boolean {
  const usable = options.filter((o) => o.trim().length > 2);
  return usable.length >= 4 && usable.every((o) => FLU_VACCINE_MISPLACED_OPTION.test(o));
}

const OPIOID_AIRWAY_MISPLACED_OPTION =
  /\b(?:naloxone|intubate|secure the airway|high-flow nasal cannula|supplemental oxygen via high-flow)\b/i;

function allOptionsOpioidAirwayMisplaced(options: string[]): boolean {
  const usable = options.filter((o) => o.trim().length > 2);
  return (
    usable.length >= 4 &&
    usable.filter(
      (o) =>
        OPIOID_AIRWAY_MISPLACED_OPTION.test(o) || /monitor vital signs every 5 minutes/i.test(o)
    ).length >= 3
  );
}

function isAnaphylaxisEmergencyVignette(vignette: string): boolean {
  const v = vignette.toLowerCase();
  if (/\b(?:anaphylaxis|anaphylactic)\b/.test(v)) return true;
  return (
    /\b(?:urticaria|hives|stridor|angioedema|facial swelling|tongue swelling)\b/.test(v) &&
    /\b(?:hypotension|bp\s*\d{2}\/\d{2}|allerg|ceftriaxone|cef(?:triaxone|epime)|epinephrine)\b/.test(v)
  );
}

function optionsRelateToAnaphylaxis(options: string[]): boolean {
  return options.some((o) =>
    /epinephrine|hypotension|stridor|urticaria|airway|anaphy|ceftriaxone|angioedema|facial.*swelling|tongue swelling|discontinuation of the triggering|stop the (?:infusion|antibiotic)/i.test(
      o
    )
  );
}

const INSULIN_ADMIN_MISPLACED_OPTION =
  /\b(?:insulin lispro|six rights|mar is unavailable|another client'?s medication|document administration before giving)\b/i;

function allOptionsInsulinAdminMisplaced(options: string[]): boolean {
  const usable = options.filter((o) => o.trim().length > 2);
  return usable.length >= 4 && usable.filter((o) => INSULIN_ADMIN_MISPLACED_OPTION.test(o)).length >= 3;
}

export function isAnaphylaxisEmergencyOptionsMismatch(item: BankItem): boolean {
  const vignette = resolveNaplexVignette(item);
  if (!isAnaphylaxisEmergencyVignette(vignette) || !hasMcqOptions(item)) return false;
  if (allOptionsScreeningLifestyle(item.options)) return true;
  if (allOptionsInsulinAdminMisplaced(item.options)) return true;
  const stem = resolveNaplexStem(item);
  return (
    (/requires immediate nursing follow-up|finding requires immediate|take first to ensure client safety|nursing action should the nurse take first|immediate intervention|most appropriate immediate action/i.test(
      stem
    ) ||
      /assessment finding should the nurse address first|finding should the nurse address/i.test(stem)) &&
    !optionsRelateToAnaphylaxis(item.options)
  );
}

function isSeverePreeclampsiaVignette(vignette: string): boolean {
  const v = vignette.toLowerCase();
  const preeclampsia =
    /\b(?:preeclampsia|pre-eclampsia|eclampsia|hellp)\b/.test(v) ||
    (/\b(?:pregnan|gestation|trimester|weeks gestation|labor and delivery)\b/.test(v) &&
      /\b(?:proteinuria|3\+ protein|\+\+\+ protein|epigastric pain|clonus|hyperreflexia)\b/.test(v));
  const severeFeatures =
    /\bsevere features\b/.test(v) ||
    /\b(?:epigastric pain|clonus|hyperreflexia|severe headache)\b/.test(v) ||
    /\bbp\s*(?:of\s*)?(?:1[6-9]\d|2\d{2})\s*\/\s*(?:10[0-9]|[89]\d)\b/.test(v) ||
    /(?:1[6-9]\d|2\d{2})\s*\/\s*(?:10[0-9]|[89]\d)\s*mm\s*hg/i.test(v);
  return preeclampsia && severeFeatures;
}

function optionsRelateToPreeclampsia(options: string[]): boolean {
  return options.some((o) =>
    /magnesium|eclampsia|preeclampsia|blood pressure|antihypertensive|seizure|clonus|epigastric|delivery|labetalol|hydralazine|hellp|nicardipine/i.test(
      o
    )
  );
}

export function isSeverePreeclampsiaOptionsMismatch(item: BankItem): boolean {
  const vignette = resolveNaplexVignette(item);
  if (!isSeverePreeclampsiaVignette(vignette) || !hasMcqOptions(item)) return false;
  if (allOptionsObstetricWellnessMisplaced(item.options)) return true;
  return (
    /assessment finding should the nurse address first|finding should the nurse address/i.test(
      resolveNaplexStem(item)
    ) && !optionsRelateToPreeclampsia(item.options)
  );
}

function isPsychiatricSuicideRiskVignette(vignette: string): boolean {
  const v = vignette.toLowerCase();
  const psychContext =
    /\b(?:psychiatric|inpatient psych|mental health unit|behavioral health)\b/.test(v) ||
    /\b(?:major depressive|depression|suicidal ideation|suicide|self-harm|overdose plan)\b/.test(v);
  const suicideRisk =
    /\b(?:suicidal ideation|suicide|plan to overdose|goodbye note|don't want to be here|kill myself|end my life)\b/.test(
      v
    );
  return psychContext && suicideRisk;
}

function optionsRelateToPsychiatricSuicideRisk(options: string[]): boolean {
  return options.some((o) =>
    /suicide|suicidal|self-harm|1:1|one-to-one|constant observation|q15|safety precaution|lethal means|goodbye|hopelessness|contract for safety|do not leave|line-of-sight/i.test(
      o
    )
  );
}

export function isPsychiatricSuicideRiskOptionsMismatch(item: BankItem): boolean {
  const vignette = resolveNaplexVignette(item);
  if (!isPsychiatricSuicideRiskVignette(vignette) || !hasMcqOptions(item)) return false;
  if (allOptionsProcedurePrepMisplaced(item.options)) return true;
  if (allOptionsPostOpMedicalMisplaced(item.options)) return true;
  return (
    /assessment finding should the nurse address first|finding should the nurse address/i.test(
      resolveNaplexStem(item)
    ) && !optionsRelateToPsychiatricSuicideRisk(item.options)
  );
}

function isPsychiatricUnitPrioritizationVignette(vignette: string, stem?: string): boolean {
  const blob = [vignette, stem].filter(Boolean).join("\n").toLowerCase();
  const roomCount = countAssignmentRooms(vignette);
  const multiClient =
    /\b(?:four clients|assigned(?:\s+to)?\s+four|four assigned clients|assignment context)\b/.test(blob) ||
    roomCount >= 3;
  const psychUnit =
    /\b(?:inpatient psychiatric|psychiatric unit|mental health unit|behavioral health unit)\b/.test(blob) ||
    (roomCount >= 3 &&
      /\b(?:depression|suicidal|alcohol withdrawal|manic episode|grief|safety contract)\b/.test(vignette));
  return multiClient && psychUnit;
}

function optionsRelateToPsychiatricPrioritization(options: string[]): boolean {
  return options.some((o) =>
    /room \d+|suicide|suicidal|self-harm|withdrawal|manic|depression|goodbye|see first|highest priority|alcohol withdrawal|safety contract/i.test(
      o
    )
  );
}

function scorePsychiatricUrgency(text: string): number {
  const t = text.toLowerCase();
  if (
    /\b(?:goodbye note|how i would do it|suicidal|kill myself|end my life)\b/.test(t) ||
    (/\bdepression\b/.test(t) && /\b(?:plan|goodbye|poor eye contact)\b/.test(t))
  ) {
    return 100;
  }
  if (/\b(?:alcohol withdrawal|last drink|tremors|diaphoresis)\b/.test(t) && /\bhr\s*1[0-2]\d|hr 124\b/.test(t)) {
    return 85;
  }
  if (/\b(?:manic|pacing|pressured speech|refused.*lithium)\b/.test(t)) {
    return 50;
  }
  if (/\b(?:grief|tearful|denies si|safety contract|voluntary admission)\b/.test(t)) {
    return 20;
  }
  return 0;
}

function summarizePsychiatricCase(text: string): string {
  const t = text.toLowerCase();
  if (/\b(?:goodbye note|how i would do it)\b/.test(t) || (/\bdepression\b/.test(t) && /\bplan\b/.test(t))) {
    return "19-year-old with depression, stated suicide plan, and written goodbye note";
  }
  if (/\b(?:alcohol withdrawal|last drink)\b/.test(t)) {
    return "45-year-old in alcohol withdrawal with tachycardia, tremors, and diaphoresis";
  }
  if (/\b(?:manic|pacing|pressured speech)\b/.test(t)) {
    return "28-year-old in manic episode with pacing and pressured speech who refused lithium";
  }
  if (/\b(?:grief|safety contract)\b/.test(t)) {
    return "52-year-old voluntary admission for grief with safety contract and no SI/HI";
  }
  return text.length > 120 ? `${text.slice(0, 117)}...` : text;
}

export function isPsychiatricUnitPrioritizationOptionsMismatch(item: BankItem): boolean {
  const vignette = resolveNaplexVignette(item);
  const stem = resolveNaplexStem(item);
  if (!isPsychiatricUnitPrioritizationVignette(vignette, stem) || !hasMcqOptions(item)) return false;
  if (allOptionsMinorFindingMisplaced(item.options)) return true;
  return (
    /highest priority|see first|which client|assess first|prioritize for immediate assessment/i.test(stem) &&
    !optionsRelateToPsychiatricPrioritization(item.options)
  );
}

function isPostpartumHemorrhageVignette(vignette: string): boolean {
  const v = vignette.toLowerCase();
  return (
    /\b(?:postpartum hemorrhage|postpartum haemorrhage|\bpph\b)\b/.test(v) ||
    (/\b(?:labor and delivery|postpartum|vaginal delivery)\b/.test(v) &&
      /\b(?:blood loss|hemorrhage|haemorrhage|boggy uterus|fundal massage|saturated.*pad|uterine atony)\b/.test(v))
  );
}

function optionsRelateToPostpartumHemorrhage(options: string[]): boolean {
  return options.some((o) =>
    /uterotonic|oxytocin|pitocin|methylergonovine|methergine|carboprost|hemabate|misoprostol|cytotec|fundal massage|boggy uterus|blood loss|hemorrhage|haemorrhage|fluid resuscitation|transfusion|bleeding|uterine atony/i.test(
      o
    )
  );
}

export function isPostpartumHemorrhageOptionsMismatch(item: BankItem): boolean {
  const vignette = resolveNaplexVignette(item);
  if (!isPostpartumHemorrhageVignette(vignette) || !hasMcqOptions(item)) return false;
  if (optionsRelateToPostpartumHemorrhage(item.options)) return false;
  if (allOptionsPostpartumHemorrhageMisplaced(item.options)) return true;
  if (allOptionsPostpartumRecoveryMisplaced(item.options)) return true;
  return (
    (/requires immediate nursing follow-up|finding requires immediate/i.test(resolveNaplexStem(item)) ||
      /assessment finding should the nurse address first|finding should the nurse address/i.test(
        resolveNaplexStem(item)
      )) &&
    !optionsRelateToPostpartumHemorrhage(item.options)
  );
}

function isPediatricEdPrioritizationVignette(vignette: string, stem?: string): boolean {
  const blob = [vignette, stem].filter(Boolean).join("\n").toLowerCase();
  const roomCount = countAssignmentRooms(vignette);
  const multiClient =
    /\b(?:four clients|assigned(?:\s+to)?\s+four|four assigned clients)\b/.test(blob) || roomCount >= 3;
  const pediatricEd =
    /\b(?:pediatric emergency|peds ed|pediatric ed|children'?s emergency)\b/.test(blob) ||
    (/\b(?:week-old|\d+-week-old|(?:[0-9]|1[0-7])-year-old)\b/.test(vignette) &&
      /\bemergency\b/.test(blob));
  return multiClient && pediatricEd;
}

function extractEdRoomCases(vignette: string): Array<{ room: string; text: string }> {
  return extractAssignmentRoomCases(vignette);
}

function scoreEdUrgency(text: string): number {
  const t = text.toLowerCase();
  if (
    /\b(?:urticaria|stridor|angioedema|facial|tongue swelling)\b/.test(t) &&
    (/\b(?:ceftriaxone|cef(?:triaxone|epime)|allerg|anaphy)\b/.test(t) ||
      /\bbp\s*(?:of\s*)?(?:7[0-9]|8[0-4])\//.test(t))
  ) {
    return 100;
  }
  if (/\b(?:substernal pressure|chest pain|troponin|diaphoresis|myocardial)\b/.test(t)) {
    return 85;
  }
  if (/\b(?:glucose 3[89]\d|glucose 4\d\d|out of insulin|dka|diabetic ketoacidosis)\b/.test(t)) {
    return 70;
  }
  if (/\b(?:psych|anxiety|contract for safety|suicidal plan|voluntary psych)\b/.test(t)) {
    return 20;
  }
  return 0;
}

function summarizeEdCase(text: string): string {
  const t = text.toLowerCase();
  if (/\b(?:urticaria|stridor|ceftriaxone)\b/.test(t)) {
    return "34-year-old with anaphylaxis after IV ceftriaxone (hypotension, urticaria, angioedema, stridor, hypoxemia)";
  }
  if (/\b(?:substernal pressure|troponin)\b/.test(t)) {
    return "58-year-old with substernal chest pressure and diaphoresis, troponin pending";
  }
  if (/\b(?:glucose 3[89]\d|glucose 4\d\d|out of insulin)\b/.test(t)) {
    return "57-year-old with hyperglycemia after 48 hours without insulin";
  }
  if (/\b(?:psych|anxiety|contract for safety)\b/.test(t)) {
    return "22-year-old voluntary psych admission with stable vitals and no suicidal plan";
  }
  return text.length > 120 ? `${text.slice(0, 117)}...` : text;
}

function isEmergencyDepartmentPrioritizationVignette(vignette: string, stem?: string): boolean {
  const blob = [vignette, stem].filter(Boolean).join("\n").toLowerCase();
  const roomCount = vignette.match(/\broom \d+\b/gi)?.length ?? 0;
  const multiClient =
    /\b(?:four clients|assigned four|four assigned clients|assignment context)\b/.test(blob) ||
    roomCount >= 3;
  const edUnit =
    /\b(?:emergency department|\bed\b)\b/.test(blob) &&
    !/\b(?:pediatric emergency|peds ed|pediatric ed|children'?s emergency)\b/.test(blob);
  return multiClient && edUnit;
}

function optionsRelateToEdPrioritization(options: string[]): boolean {
  return options.some((o) =>
    /room \d+|anaphy|epinephrine|stridor|urticaria|ceftriaxone|chest pain|troponin|hyperglycemia|glucose|see first|highest priority|prioritize/i.test(
      o
    )
  );
}

export function isEmergencyDepartmentPrioritizationOptionsMismatch(item: BankItem): boolean {
  const vignette = resolveNaplexVignette(item);
  const stem = resolveNaplexStem(item);
  if (!isEmergencyDepartmentPrioritizationVignette(vignette, stem) || !hasMcqOptions(item)) return false;
  if (allOptionsFireSafetyMisplaced(item.options)) return true;
  return (
    /highest priority|see first|which client|prioritize for immediate assessment|assess first/i.test(stem) &&
    !optionsRelateToEdPrioritization(item.options)
  );
}

function optionsRelateToPediatricPrioritization(options: string[]): boolean {
  return options.some((o) =>
    /room \d+|asthma|spo?₂?|hypox|retractions|infant|lethargic|fracture|vomiting|see first|highest priority|forearm deformity/i.test(
      o
    )
  );
}

function extractPediatricEdRoomCases(vignette: string): Array<{ room: string; text: string }> {
  return extractAssignmentRoomCases(vignette);
}

function scorePediatricEdUrgency(text: string): number {
  const t = text.toLowerCase();
  if (
    /\basthma\b/.test(t) &&
    (/\bspo?₂?\s*8[0-9]|88%|retractions|short phrases|rr\s*3[0-9]/i.test(t))
  ) {
    return 100;
  }
  if (/\b(?:week-old|infant)\b/.test(t) && /\b(?:lethargic|102|fever|poor feeding|capillary refill)/i.test(t)) {
    return 80;
  }
  if (/\b(?:deformity|fracture|fall)\b/.test(t) && /\bneurovascular intact/i.test(t)) {
    return 50;
  }
  if (/\b(?:vomiting|diarrhea)\b/.test(t) && /\balert\b/.test(t)) {
    return 30;
  }
  return 0;
}

function summarizePediatricEdCase(text: string): string {
  const t = text.toLowerCase();
  if (/\basthma\b/.test(t)) {
    return "9-year-old with asthma exacerbation, SpO₂ 88% on room air, intercostal retractions, and tachypnea";
  }
  if (/\b(?:week-old|infant)\b/.test(t)) {
    return "6-week-old infant with fever, lethargy, and poor feeding";
  }
  if (/\b(?:deformity|fracture|fall)\b/.test(t)) {
    return "14-year-old with forearm deformity after a fall but intact neurovascular status";
  }
  if (/\b(?:vomiting|diarrhea)\b/.test(t)) {
    return "4-year-old with vomiting and diarrhea who remains alert and drinking";
  }
  return text.length > 120 ? `${text.slice(0, 117)}...` : text;
}

export function isPediatricEdPrioritizationOptionsMismatch(item: BankItem): boolean {
  const vignette = resolveNaplexVignette(item);
  const stem = resolveNaplexStem(item);
  if (!isPediatricEdPrioritizationVignette(vignette, stem) || !hasMcqOptions(item)) return false;
  if (allOptionsColonCancerScreeningMisplaced(item.options)) return true;
  if (allOptionsWoundCareMisplaced(item.options)) return true;
  if (allOptionsChartReviewMisplaced(item.options)) return true;
  if (allOptionsAmbulationFallPreventionMisplaced(item.options)) return true;
  if (allOptionsMedicationCounselingMisplaced(item.options)) return true;
  return (
    /highest priority|see first|which client|prioritize for immediate assessment/i.test(stem) &&
    !optionsRelateToPediatricPrioritization(item.options)
  );
}

function isLaborDeliveryPrioritizationVignette(vignette: string, stem?: string): boolean {
  const blob = [vignette, stem].filter(Boolean).join("\n").toLowerCase();
  const roomCount = vignette.match(/\broom \d+\b/gi)?.length ?? 0;
  const multiClient =
    /\b(?:four clients|assigned four|four assigned clients|assignment context)\b/.test(blob) ||
    roomCount >= 3;
  const ldUnit =
    /\b(?:labor and delivery|\bl&d\b|postpartum hour|active labor|cervical exam|g1p0)\b/.test(blob) ||
    (/\b\d+ weeks\b/.test(vignette) &&
      /\b(?:preeclampsia|fetal movement|uterus boggy|postpartum)\b/.test(vignette));
  return multiClient && ldUnit;
}

function optionsRelateToObstetricPrioritization(options: string[]): boolean {
  return options.some((o) =>
    /room \d+|preeclampsia|postpartum hemorrhage|fetal movement|active labor|see first|highest priority|magnesium|uterotonic|clonus|boggy uterus/i.test(
      o
    )
  );
}

function extractLaborDeliveryRoomCases(vignette: string): Array<{ room: string; text: string }> {
  const re = /\bRoom\s+(\d+)\s*:\s*/gi;
  const markers: Array<{ room: string; start: number }> = [];
  let match: RegExpExecArray | null;
  while ((match = re.exec(vignette)) !== null) {
    markers.push({ room: match[1]!, start: match.index + match[0].length });
  }
  return markers.map((entry, index) => ({
    room: entry.room,
    text: vignette.slice(entry.start, markers[index + 1]?.start ?? vignette.length).trim().replace(/\.\s*$/, ""),
  }));
}

function scoreLaborDeliveryUrgency(text: string): number {
  const t = text.toLowerCase();
  if (
    (/\b(?:clonus|hyperreflexia|epigastric pain)\b/.test(t) || /\b1(?:6[89]|7\d)\/\d{2,3}\b/.test(t)) &&
    /\b(?:protein|headache|\bg1p0\b|\d+ weeks)\b/.test(t)
  ) {
    return 100;
  }
  if (/\b(?:boggy|saturated perineal pad|postpartum hour|heavy bleeding)\b/.test(t)) {
    return 90;
  }
  if (/\bdecreased fetal movement\b/.test(t)) {
    return 70;
  }
  if (/\b(?:active labor|cervical exam|\d+ cm)\b/.test(t)) {
    return 40;
  }
  return 0;
}

function summarizeLaborDeliveryCase(text: string): string {
  const t = text.toLowerCase();
  if (/\b(?:clonus|hyperreflexia|epigastric|168\/104)\b/.test(t) && /\b(?:protein|headache|\bg1p0\b)/.test(t)) {
    return "29-year-old at 36 weeks with preeclampsia with severe features (BP 168/104, headache, epigastric pain, 3+ protein, clonus)";
  }
  if (/\b(?:boggy|saturated perineal pad|postpartum)\b/.test(t)) {
    return "postpartum client with boggy uterus and heavy bleeding";
  }
  if (/\bdecreased fetal movement\b/.test(t)) {
    return "client with decreased fetal movement requiring fetal assessment";
  }
  if (/\b(?:active labor|cervical exam)\b/.test(t)) {
    return "stable active labor at 7 cm";
  }
  return text.length > 120 ? `${text.slice(0, 117)}...` : text;
}

export function isLaborDeliveryPrioritizationOptionsMismatch(item: BankItem): boolean {
  const vignette = resolveNaplexVignette(item);
  const stem = resolveNaplexStem(item);
  if (!isLaborDeliveryPrioritizationVignette(vignette, stem) || !hasMcqOptions(item)) return false;
  if (allOptionsWarfarinAnticoagMisplaced(item.options)) return true;
  if (allOptionsGeneralWellnessMisplaced(item.options)) return true;
  if (allOptionsObstetricWellnessMisplaced(item.options)) return true;
  return (
    /highest priority|see first|which client|assess first/i.test(stem) &&
    !optionsRelateToObstetricPrioritization(item.options)
  );
}

function isMedSurgPrioritizationVignette(vignette: string, stem?: string): boolean {
  const blob = [vignette, stem].filter(Boolean).join("\n").toLowerCase();
  const roomCount = countAssignmentRooms(vignette);
  const multiClient =
    /\b(?:four clients|assigned(?:\s+to)?\s+four|four assigned clients|assignment context)\b/.test(blob) ||
    roomCount >= 3;
  const medSurg =
    /\b(?:medical-surgical|med-surg|med surg)\b/.test(blob) ||
    (roomCount >= 3 &&
      /\b(?:post-op|heart failure|\bcopd\b|atrial fibrillation|pca morphine|knee replacement)\b/.test(
        vignette
      ));
  return multiClient && medSurg && roomCount >= 3;
}

function scoreMedSurgUrgency(text: string): number {
  const t = text.toLowerCase();
  if (/\b(?:rr\s*8|respiratory rate 8|pinpoint pupils|pca morphine)\b/.test(t) && /\b(?:somnolen|opioid|morphine)\b/.test(t)) {
    return 100;
  }
  if (/\b(?:copd|accessory muscle|spo?₂?\s*86|short phrases)\b/.test(t)) {
    return 85;
  }
  if (/\b(?:heart failure|crackles|88\/54|hypotension)\b/.test(t) && /\bbp\s*(?:of\s*)?88\//.test(t)) {
    return 80;
  }
  if (/\b(?:atrial fibrillation|hr 138|new onset)\b/.test(t)) {
    return 50;
  }
  return 0;
}

function summarizeMedSurgCase(text: string): string {
  const t = text.toLowerCase();
  if (/\b(?:pca morphine|pinpoint pupils|rr\s*8)\b/.test(t)) {
    return "post-op day 1 on PCA morphine with RR 8/min, somnolence, and pinpoint pupils";
  }
  if (/\b(?:heart failure|crackles)\b/.test(t)) {
    return "heart failure with hypotension, crackles, and SpO₂ 91% on 2 L NC";
  }
  if (/\b(?:copd|accessory muscle)\b/.test(t)) {
    return "COPD exacerbation with accessory muscle use and SpO₂ 86%";
  }
  if (/\b(?:atrial fibrillation|hr 138)\b/.test(t)) {
    return "new-onset atrial fibrillation with HR 138, dizzy but alert on telemetry";
  }
  return text.length > 120 ? `${text.slice(0, 117)}...` : text;
}

const CANONICAL_MEDSURG_ASSIGNMENT_VIGNETTE =
  "The nurse is assigned four clients on a medical-surgical unit. Room 518: 58-year-old man post-op day 1 knee replacement on PCA morphine. RR 8, SpO₂ 91% on room air, somnolent but arousable, pinpoint pupils. Room 523: 68-year-old woman with heart failure, BP 88/54, HR 112, crackles bilaterally, SpO₂ 91% on 2 L NC, weight up 2 kg. Room 510: 72-year-old man COPD exacerbation, RR 32, SpO₂ 86% on 2 L, accessory muscle use, speaking in short phrases. Room 516: 61-year-old woman new onset atrial fibrillation, HR 138 irregular, BP 104/70, dizzy but alert, on telemetry.";

function optionsRelateToMedSurgPrioritization(options: string[]): boolean {
  return options.some((o) =>
    /room \d+|respiratory rate|spo?₂?|morphine|opioid|naloxone|heart failure|copd|atrial fibrillation|see first|highest priority|hypotension|crackles/i.test(
      o
    )
  );
}

export function isMedSurgPrioritizationOptionsMismatch(item: BankItem): boolean {
  const vignette = resolveNaplexVignette(item);
  const stem = resolveNaplexStem(item);
  if (!isMedSurgPrioritizationVignette(vignette, stem) || !hasMcqOptions(item)) return false;
  if (allOptionsFluVaccineMisplaced(item.options)) return true;
  return (
    /highest priority|see first|which client/i.test(stem) &&
    !optionsRelateToMedSurgPrioritization(item.options)
  );
}

function isAcuteDecompensatedHeartFailureVignette(vignette: string): boolean {
  const v = vignette.toLowerCase();
  return (
    /\b(?:acute decompensated heart failure|decompensated heart failure|\badhf\b|fluid overload|volume overload)\b/.test(
      v
    ) ||
    (/\b(?:heart failure|\bhf\b|\bchf\b)\b/.test(v) &&
      /\b(?:furosemide|crackles|pitting edema|weight up|2\+ edema|jugular)\b/.test(v))
  );
}

function optionsRelateToHeartFailureDecompensation(options: string[]): boolean {
  return options.some((o) =>
    /furosemide|diuretic|fluid|overload|crackles|edema|hypotension|orthostatic|oxygen|heart failure|weight gain|lasix|afterload|preload|prescriber/i.test(
      o
    )
  );
}

export function isAcuteDecompensatedHeartFailureOptionsMismatch(item: BankItem): boolean {
  const vignette = resolveNaplexVignette(item);
  if (!isAcuteDecompensatedHeartFailureVignette(vignette) || !hasMcqOptions(item)) return false;
  if (allOptionsDiabeticEyeCareMisplaced(item.options)) return true;
  return (
    (/requires immediate nursing follow-up|finding requires immediate/i.test(resolveNaplexStem(item)) ||
      /assessment finding should the nurse address first|finding should the nurse address/i.test(
        resolveNaplexStem(item)
      )) &&
    !optionsRelateToHeartFailureDecompensation(item.options)
  );
}

function isWarfarinBleedingVignette(vignette: string): boolean {
  const v = vignette.toLowerCase();
  const anticoag =
    /\b(?:warfarin|coumadin|\binr\b|anticoagulation|deep vein thrombosis|\bdvt\b)\b/.test(v);
  const bleedingOrSupratherapeutic =
    /\b(?:nosebleed|epistaxis|melena|tarry stool|dark stool|gum bleeding|hematuria|bleeding|hemorrhage)\b/.test(
      v
    ) || /\binr\s*(?:of\s*)?(?:[4-9]\.\d|[4-9]\b|3\.[5-9])/.test(v);
  return anticoag && bleedingOrSupratherapeutic;
}

function optionsRelateToWarfarinBleeding(options: string[]): boolean {
  return options.some((o) =>
    /warfarin|inr|vitamin k|hold.*dose|bleed|melena|epistaxis|nosebleed|reversal|anticoag|notify|prescriber|provider|hemoglobin|ffp|prothrombin complex|tarry stool/i.test(
      o
    )
  );
}

export function isWarfarinBleedingOptionsMismatch(item: BankItem): boolean {
  const vignette = resolveNaplexVignette(item);
  if (!isWarfarinBleedingVignette(vignette) || !hasMcqOptions(item)) return false;
  if (allOptionsOpioidAirwayMisplaced(item.options)) return true;
  return (
    (/requires immediate nursing follow-up|finding requires immediate/i.test(resolveNaplexStem(item)) ||
      /assessment finding should the nurse address first|finding should the nurse address/i.test(
        resolveNaplexStem(item)
      )) &&
    !optionsRelateToWarfarinBleeding(item.options)
  );
}

function isUpperGiBleedHemorrhageVignette(vignette: string): boolean {
  const v = vignette.toLowerCase();
  const bleedContext =
    /\b(?:upper gastrointestinal bleed|upper gi bleed|\bugib\b|gastrointestinal bleed|gi bleed|melena|hematemesis|coffee-ground|peptic ulcer)\b/.test(
      v
    );
  const instability =
    /\b(?:hypotension|pale|cool extremities|lightheaded|capillary refill|hemoglobin|hgb)\b/.test(v) ||
    /\bbp\s*(?:of\s*)?\d{2}\/\d{2}\b/.test(v) ||
    /\b(?:7\.\d|8\.\d)\s*g\/dl\b/.test(v);
  return bleedContext && instability;
}

function optionsRelateToGiBleed(options: string[]): boolean {
  return options.some((o) =>
    /bleed|hemorrhage|melena|hemoglobin|transfusion|iv access|fluid resuscitation|notify|prescriber|endoscopy|ppi|aspirin|orthostatic|hypotension|blood pressure/i.test(
      o
    )
  );
}

export function isUpperGiBleedOptionsMismatch(item: BankItem): boolean {
  const vignette = resolveNaplexVignette(item);
  if (!isUpperGiBleedHemorrhageVignette(vignette) || !hasMcqOptions(item)) return false;
  if (allOptionsDiabetesEducationMisplaced(item.options)) return true;
  return (
    (/requires immediate nursing follow-up|finding requires immediate/i.test(resolveNaplexStem(item)) ||
      /assessment finding should the nurse address first|finding should the nurse address/i.test(
        resolveNaplexStem(item)
      )) &&
    !optionsRelateToGiBleed(item.options)
  );
}

export function clinicalVignetteUnrelatedOptionsIssue(item: BankItem): { codes: string[] } | null {
  if (isAnaphylaxisEmergencyOptionsMismatch(item)) {
    return { codes: ["naplex_clinical_vignette_unrelated_options"] };
  }
  if (isSeverePreeclampsiaOptionsMismatch(item)) {
    return { codes: ["naplex_clinical_vignette_unrelated_options"] };
  }
  if (isPsychiatricSuicideRiskOptionsMismatch(item)) {
    return { codes: ["naplex_clinical_vignette_unrelated_options"] };
  }
  if (isPsychiatricUnitPrioritizationOptionsMismatch(item)) {
    return { codes: ["naplex_clinical_vignette_unrelated_options"] };
  }
  if (isPostpartumHemorrhageOptionsMismatch(item)) {
    return { codes: ["naplex_clinical_vignette_unrelated_options"] };
  }
  if (isEmergencyDepartmentPrioritizationOptionsMismatch(item)) {
    return { codes: ["naplex_clinical_vignette_unrelated_options"] };
  }
  if (isPediatricEdPrioritizationOptionsMismatch(item)) {
    return { codes: ["naplex_clinical_vignette_unrelated_options"] };
  }
  if (isLaborDeliveryPrioritizationOptionsMismatch(item)) {
    return { codes: ["naplex_clinical_vignette_unrelated_options"] };
  }
  if (isMedSurgPrioritizationOptionsMismatch(item)) {
    return { codes: ["naplex_clinical_vignette_unrelated_options"] };
  }
  if (isAcuteDecompensatedHeartFailureOptionsMismatch(item)) {
    return { codes: ["naplex_clinical_vignette_unrelated_options"] };
  }
  if (isUpperGiBleedOptionsMismatch(item)) {
    return { codes: ["naplex_clinical_vignette_unrelated_options"] };
  }
  if (isWarfarinBleedingOptionsMismatch(item)) {
    return { codes: ["naplex_clinical_vignette_unrelated_options"] };
  }
  return null;
}

export function detectClinicalVignetteUnrelatedOptions(item: BankItem): NaplexFormatIssue | null {
  const issue = clinicalVignetteUnrelatedOptionsIssue(item);
  if (!issue) return null;
  return {
    code: "naplex_clinical_vignette_unrelated_options",
    message:
      "Acute clinical emergency vignette is paired with unrelated wellness or lifestyle answer choices instead of appropriate emergency management.",
    severity: "error",
  };
}

export function buildSeverePreeclampsiaEmergencyMcq(item: BankItem): BankItem {
  const vignette =
    resolveNaplexVignette(item) ||
    "A pregnant patient at term develops preeclampsia with severe features including elevated blood pressure, proteinuria, headache, epigastric pain, and clonus.";
  const options = [
    "Recognize preeclampsia with severe features as an obstetric emergency; initiate magnesium sulfate for seizure prophylaxis, antihypertensive therapy per protocol, close maternal-fetal monitoring, and coordinate expedited delivery evaluation.",
    "Provide counseling on safe weight loss during pregnancy as the priority intervention.",
    "Encourage small, frequent meals for nausea without addressing blood pressure or neurologic symptoms.",
    "Refer to a dietitian for nutritional counseling before initiating magnesium or blood pressure management.",
  ] as BankItem["options"];
  const correctAnswer = options[0]!;
  return {
    ...item,
    vignette,
    scenario: vignette,
    question: "What is the most appropriate immediate action?",
    options,
    correctAnswer,
    explanation:
      "Correct: Treat as preeclampsia with severe features — BP 168/104 mmHg, 3+ proteinuria, severe headache, epigastric pain, and clonus indicate severe disease with eclampsia/HELLP risk. Management requires magnesium sulfate seizure prophylaxis, controlled antihypertensive therapy, maternal-fetal monitoring, and delivery planning per ACOG guidance. Weight-loss counseling, nausea meal advice, or dietitian referral alone ignore life-threatening hypertension and neurologic warning signs. Hydration assessment alone does not address the primary obstetric emergency.",
    itemType: "vignette",
    ngnPayload: undefined,
    subjectId: item.subjectId || "patient-counseling",
    topicCategory: item.topicCategory ?? "Severe Preeclampsia",
  };
}

export function buildPsychiatricUnitPrioritizationMcq(item: BankItem): BankItem {
  const vignette =
    resolveNaplexVignette(item) ||
    "A nurse on an inpatient psychiatric unit is assigned multiple clients requiring prioritization.";
  const roomCases = extractAssignmentRoomCases(vignette);
  const priorityCase =
    roomCases.length > 0
      ? [...roomCases].sort((a, b) => scorePsychiatricUrgency(b.text) - scorePsychiatricUrgency(a.text))[0]!
      : null;
  const priorityRoom = priorityCase?.room ?? "135";
  const priorityLabel = priorityCase
    ? `Room ${priorityCase.room} — ${summarizePsychiatricCase(priorityCase.text)}`
    : "Room 135 — 19-year-old with depression, stated suicide plan, and written goodbye note";

  const distractorCases = roomCases.filter((c) => c.room !== priorityRoom);
  const defaultDistractors = [
    { room: "132", text: "45-year-old in alcohol withdrawal with tachycardia, tremors, and diaphoresis" },
    { room: "138", text: "28-year-old in manic episode with pacing and pressured speech who refused lithium" },
    { room: "129", text: "52-year-old voluntary admission for grief with safety contract and no SI/HI" },
  ];
  const distractors =
    distractorCases.length >= 3
      ? distractorCases.slice(0, 3)
      : defaultDistractors.filter((d) => d.room !== priorityRoom);

  const options = [
    `${priorityLabel}; assess this client first because imminent suicide risk takes priority.`,
    `Room ${distractors[0]?.room ?? "132"} — ${summarizePsychiatricCase(distractors[0]?.text ?? "45-year-old in alcohol withdrawal with tachycardia, tremors, and diaphoresis")}; defer assessment until minor headache complaints are addressed.`,
    `Room ${distractors[1]?.room ?? "138"} — ${summarizePsychiatricCase(distractors[1]?.text ?? "28-year-old in manic episode with pacing and pressured speech who refused lithium")}; prioritize routine blood pressure documentation before suicide risk assessment.`,
    `Room ${distractors[2]?.room ?? "129"} — ${summarizePsychiatricCase(distractors[2]?.text ?? "52-year-old voluntary admission for grief with safety contract and no SI/HI")}; see this client before the patient with a stated suicide plan and goodbye note.`,
  ] as BankItem["options"];
  const correctAnswer = options[0]!;
  return {
    ...item,
    vignette,
    scenario: vignette,
    question: "Four clients require attention. Which client is the highest priority for the nurse to see first?",
    options,
    correctAnswer,
    explanation:
      `Correct: See Room ${priorityRoom} first — depression with a stated suicide plan and written goodbye note indicates high imminent self-harm risk requiring immediate assessment, suicide precautions, and prescriber notification. Alcohol withdrawal with tachycardia (Room 132) is also urgent but typically follows active suicidal ideation with plan and means. Manic episode and stable grief admission are lower triage priorities. Headache relief, routine blood pressure values, nosebleeds, and bruising are unrelated to psychiatric unit triage.`,
    itemType: "vignette",
    ngnPayload: undefined,
    subjectId: item.subjectId || "patient-counseling",
    topicCategory: item.topicCategory ?? "Psychiatric Unit Prioritization",
  };
}

export function buildPsychiatricSuicideRiskMcq(item: BankItem): BankItem {
  const vignette =
    resolveNaplexVignette(item) ||
    "An inpatient with major depressive disorder and active suicidal ideation is admitted after expressing a plan to overdose.";
  const options = [
    "Implement suicide precautions immediately: maintain continuous or line-of-sight observation, remove access to lethal means, conduct a focused suicide risk assessment (plan, intent, means), and notify the prescriber per unit protocol.",
    "Provide pre-procedure teaching about what to expect during the procedure.",
    "Reassure the patient that the upcoming procedure is routine and low risk.",
    "Explain clear-liquid diet instructions before addressing suicidal statements or the goodbye note.",
  ] as BankItem["options"];
  const correctAnswer = options[0]!;
  return {
    ...item,
    vignette,
    scenario: vignette,
    question: "What is the most appropriate immediate action?",
    options,
    correctAnswer,
    explanation:
      "Correct: Implement suicide precautions and urgent risk assessment — active suicidal ideation with a stated overdose plan and a written goodbye note indicates high imminent risk on an inpatient psychiatric unit. Priority actions include continuous or line-of-sight observation, removal of lethal means, focused assessment of plan/intent/means, and prescriber notification per protocol. Pre-procedure teaching, routine reassurance, or diet instructions ignore acute suicide risk and are unsafe delays.",
    itemType: "vignette",
    ngnPayload: undefined,
    subjectId: item.subjectId || "patient-counseling",
    topicCategory: item.topicCategory ?? "Suicide Risk Precautions",
  };
}

export function buildPostpartumHemorrhageEmergencyMcq(item: BankItem): BankItem {
  const vignette =
    resolveNaplexVignette(item) ||
    "A postpartum patient develops heavy vaginal bleeding with a boggy uterus and tachycardia shortly after delivery.";
  const options = [
    "Recognize postpartum hemorrhage from uterine atony; continue fundal massage, administer uterotonic therapy per protocol (e.g., oxytocin, methylergonovine, or carboprost), establish IV access with fluid/blood resuscitation, quantify blood loss, notify the provider immediately, and prepare for surgical escalation if bleeding persists.",
    "Notify the healthcare provider of lethargy as the sole priority without addressing ongoing hemorrhage or hypotension.",
    "Increase the oxygen flow rate without uterotonic therapy or hemorrhage assessment.",
    "Prepare the client for a chest X-ray before managing the boggy uterus and active bleeding.",
  ] as BankItem["options"];
  const correctAnswer = options[0]!;
  return {
    ...item,
    vignette,
    scenario: vignette,
    question: "What is the most appropriate immediate action?",
    options,
    correctAnswer,
    explanation:
      "Correct: Treat postpartum hemorrhage from uterine atony — saturated perineal pad, boggy uterus above the umbilicus, tachycardia, and hypotension (94/60) after delivery indicate ongoing hemorrhage with early shock. Management requires continued fundal massage, uterotonic medications, IV resuscitation, blood loss quantification, immediate provider notification, and readiness for procedural escalation. Lethargy is not the documented finding and does not replace hemorrhage management. Oxygen titration or chest imaging does not address uterine atony as the primary cause of bleeding.",
    itemType: "vignette",
    ngnPayload: undefined,
    subjectId: item.subjectId || "patient-counseling",
    topicCategory: item.topicCategory ?? "Postpartum Hemorrhage",
  };
}

export function buildEmergencyDepartmentPrioritizationMcq(item: BankItem): BankItem {
  const vignette =
    resolveNaplexVignette(item) ||
    "A nurse in an emergency department is assigned multiple clients requiring prioritization.";
  const roomCases = extractEdRoomCases(vignette);
  const priorityCase =
    roomCases.length > 0
      ? [...roomCases].sort((a, b) => scoreEdUrgency(b.text) - scoreEdUrgency(a.text))[0]!
      : null;
  const priorityRoom = priorityCase?.room ?? "136";
  const priorityLabel = priorityCase
    ? `Room ${priorityCase.room} — ${summarizeEdCase(priorityCase.text)}`
    : "Room 136 — 34-year-old with anaphylaxis after IV ceftriaxone (hypotension, urticaria, angioedema, stridor, hypoxemia)";

  const distractorCases = roomCases.filter((c) => c.room !== priorityRoom);
  const defaultDistractors = [
    { room: "139", text: "58-year-old with substernal chest pressure and diaphoresis, troponin pending" },
    { room: "134", text: "57-year-old with hyperglycemia after 48 hours without insulin" },
    { room: "143", text: "22-year-old voluntary psych admission with stable vitals and no suicidal plan" },
  ];
  const distractors =
    distractorCases.length >= 3
      ? distractorCases.slice(0, 3)
      : defaultDistractors.filter((d) => d.room !== priorityRoom);

  const options = [
    `${priorityLabel}; assess this client first because anaphylaxis with airway compromise is an immediate life threat.`,
    `Room ${distractors[0]?.room ?? "139"} — ${summarizeEdCase(distractors[0]?.text ?? "58-year-old with substernal chest pressure and diaphoresis, troponin pending")}; defer assessment until fire safety education is completed.`,
    `Room ${distractors[1]?.room ?? "134"} — ${summarizeEdCase(distractors[1]?.text ?? "57-year-old with hyperglycemia after 48 hours without insulin")}; prioritize smoke detector counseling before treating hyperglycemia.`,
    `Room ${distractors[2]?.room ?? "143"} — ${summarizeEdCase(distractors[2]?.text ?? "22-year-old voluntary psych admission with stable vitals and no suicidal plan")}; see this client before the hypotensive patient with stridor.`,
  ] as BankItem["options"];
  const correctAnswer = options[0]!;
  return {
    ...item,
    vignette,
    scenario: vignette,
    question: "Four clients require attention. Which client is the highest priority for the nurse to see first?",
    options,
    correctAnswer,
    explanation:
      `Correct: See Room ${priorityRoom} first — anaphylaxis after IV ceftriaxone with BP 74/42 mmHg, tachycardia, hypoxemia, urticaria, angioedema, and stridor is an immediate airway and circulation emergency requiring epinephrine, airway support, IV fluids, oxygen, and discontinuation of the offending agent. Chest pain with troponin pending and severe hyperglycemia are urgent but the patient with stridor and shock physiology takes ABC priority. Stable voluntary psych admission is lowest acuity. Fire escape plans and smoke detector counseling are unrelated to ED triage.`,
    itemType: "vignette",
    ngnPayload: undefined,
    subjectId: item.subjectId || "patient-counseling",
    topicCategory: item.topicCategory ?? "Emergency Department Prioritization",
  };
}

export function buildPediatricEdPrioritizationMcq(item: BankItem): BankItem {
  const vignette =
    resolveNaplexVignette(item) ||
    "A nurse in a pediatric emergency department is assigned multiple clients requiring prioritization.";
  const roomCases = extractPediatricEdRoomCases(vignette);
  const priorityCase =
    roomCases.length > 0
      ? [...roomCases].sort((a, b) => scorePediatricEdUrgency(b.text) - scorePediatricEdUrgency(a.text))[0]!
      : null;
  const priorityRoom = priorityCase?.room ?? "107";
  const priorityLabel = priorityCase
    ? `Room ${priorityCase.room} — ${summarizePediatricEdCase(priorityCase.text)}`
    : "Room 107 — 9-year-old with asthma exacerbation, SpO₂ 88% on room air, intercostal retractions, and tachypnea";

  const distractorCases = roomCases.filter((c) => c.room !== priorityRoom);
  const defaultDistractors = [
    { room: "110", text: "6-week-old infant with fever, lethargy, and poor feeding" },
    { room: "113", text: "14-year-old with forearm deformity after a fall but intact neurovascular status" },
    { room: "106", text: "4-year-old with vomiting and diarrhea who remains alert and drinking" },
  ];
  const distractors =
    distractorCases.length >= 3
      ? distractorCases.slice(0, 3)
      : defaultDistractors.filter((d) => d.room !== priorityRoom);

  const options = [
    `${priorityLabel}; assess this client first because airway and breathing compromise take priority.`,
    `Room ${distractors[0]?.room ?? "110"} — ${summarizePediatricEdCase(distractors[0]?.text ?? "6-week-old infant with fever, lethargy, and poor feeding")}; defer assessment until all lower-acuity clients are seen.`,
    `Room ${distractors[1]?.room ?? "113"} — ${summarizePediatricEdCase(distractors[1]?.text ?? "14-year-old with forearm deformity after a fall but intact neurovascular status")}; this musculoskeletal injury outranks hypoxemia.`,
    `Room ${distractors[2]?.room ?? "106"} — ${summarizePediatricEdCase(distractors[2]?.text ?? "4-year-old with vomiting and diarrhea who remains alert and drinking")}; prioritize this client before the hypoxemic child with retractions.`,
  ] as BankItem["options"];
  const correctAnswer = options[0]!;
  return {
    ...item,
    vignette,
    scenario: vignette,
    question: "Four clients require attention. Which client is the highest priority for the nurse to see first?",
    options,
    correctAnswer,
    explanation:
      `Correct: See Room ${priorityRoom} first — the child with known asthma, hypoxemia (SpO₂ 88%), tachypnea, retractions, and short phrases of speech has acute respiratory compromise. ABC prioritization places unstable airway/breathing before the febrile lethargic infant, the stable neurovascular fracture, and the alert dehydrated toddler. Chart review items such as medication history or diet orders are unrelated to pediatric ED triage.`,
    itemType: "vignette",
    ngnPayload: undefined,
    subjectId: item.subjectId || "patient-counseling",
    topicCategory: item.topicCategory ?? "Pediatric ED Prioritization",
  };
}

export function buildLaborDeliveryPrioritizationMcq(item: BankItem): BankItem {
  const vignette =
    resolveNaplexVignette(item) ||
    "A nurse on a labor and delivery unit is assigned multiple obstetric clients requiring prioritization.";
  const roomCases = extractLaborDeliveryRoomCases(vignette);
  const priorityCase =
    roomCases.length > 0
      ? [...roomCases].sort((a, b) => scoreLaborDeliveryUrgency(b.text) - scoreLaborDeliveryUrgency(a.text))[0]!
      : null;
  const priorityRoom = priorityCase?.room ?? "42";
  const priorityLabel = priorityCase
    ? `Room ${priorityCase.room} — ${summarizeLaborDeliveryCase(priorityCase.text)}`
    : "Room 42 — 29-year-old at 36 weeks with preeclampsia with severe features (BP 168/104, headache, epigastric pain, 3+ protein, clonus)";

  const distractorCases = roomCases.filter((c) => c.room !== priorityRoom);
  const defaultDistractors = [
    { room: "44", text: "postpartum client with boggy uterus and heavy bleeding" },
    { room: "47", text: "client with decreased fetal movement requiring fetal assessment" },
    { room: "40", text: "stable active labor at 7 cm" },
  ];
  const distractors =
    distractorCases.length >= 3
      ? distractorCases.slice(0, 3)
      : defaultDistractors.filter((d) => d.room !== priorityRoom);

  const options = [
    `${priorityLabel}; assess this client first because eclampsia risk takes priority.`,
    `Room ${distractors[0]?.room ?? "44"} — ${summarizeLaborDeliveryCase(distractors[0]?.text ?? "postpartum client with boggy uterus and heavy bleeding")}; defer assessment until wellness counseling is completed.`,
    `Room ${distractors[1]?.room ?? "47"} — ${summarizeLaborDeliveryCase(distractors[1]?.text ?? "client with decreased fetal movement requiring fetal assessment")}; prioritize diet and exercise education before fetal assessment.`,
    `Room ${distractors[2]?.room ?? "40"} — ${summarizeLaborDeliveryCase(distractors[2]?.text ?? "stable active labor at 7 cm")}; see this client before the hypertensive client with clonus.`,
  ] as BankItem["options"];
  const correctAnswer = options[0]!;
  return {
    ...item,
    vignette,
    scenario: vignette,
    question: "Four clients require attention. Which client is the highest priority for the nurse to see first?",
    options,
    correctAnswer,
    explanation:
      `Correct: See Room ${priorityRoom} first — preeclampsia with severe features (BP ≥160/110, headache, epigastric pain, proteinuria, clonus) is an obstetric emergency requiring immediate evaluation and magnesium sulfate/antihypertensive therapy per protocol. Postpartum hemorrhage and decreased fetal movement also require prompt assessment but severe antepartum preeclampsia with neurologic findings typically takes priority over stable labor. Dietitian referral, exercise planning, and general health screening are unrelated to acute labor and delivery triage.`,
    itemType: "vignette",
    ngnPayload: undefined,
    subjectId: item.subjectId || "patient-counseling",
    topicCategory: item.topicCategory ?? "Labor Delivery Prioritization",
  };
}

export function buildMedSurgPrioritizationMcq(item: BankItem): BankItem {
  let vignette = resolveNaplexVignette(item) || CANONICAL_MEDSURG_ASSIGNMENT_VIGNETTE;
  let roomCases = extractAssignmentRoomCases(vignette);
  if (roomCases.length < 3) {
    vignette = CANONICAL_MEDSURG_ASSIGNMENT_VIGNETTE;
    roomCases = extractAssignmentRoomCases(vignette);
  }

  const priorityCase =
    roomCases.length > 0
      ? [...roomCases].sort((a, b) => scoreMedSurgUrgency(b.text) - scoreMedSurgUrgency(a.text))[0]!
      : null;
  const priorityRoom = priorityCase?.room ?? "518";
  const priorityLabel = priorityCase
    ? `Room ${priorityCase.room} — ${summarizeMedSurgCase(priorityCase.text)}`
    : "Room 518 — post-op day 1 on PCA morphine with RR 8/min, somnolence, and pinpoint pupils";

  const distractorCases = roomCases.filter((c) => c.room !== priorityRoom);
  const defaultDistractors = [
    { room: "523", text: "heart failure with hypotension, crackles, and SpO₂ 91% on 2 L NC" },
    { room: "510", text: "COPD exacerbation with accessory muscle use and SpO₂ 86%" },
    { room: "516", text: "new-onset atrial fibrillation with HR 138, dizzy but alert on telemetry" },
  ];
  const distractors =
    distractorCases.length >= 3
      ? distractorCases.slice(0, 3)
      : defaultDistractors.filter((d) => d.room !== priorityRoom);

  const options = [
    `${priorityLabel}; assess this client first for opioid-induced respiratory depression and prepare for naloxone and airway support.`,
    `Room ${distractors[0]?.room ?? "523"} — ${summarizeMedSurgCase(distractors[0]?.text ?? "heart failure with hypotension, crackles, and SpO₂ 91% on 2 L NC")}; see this client first for diuretic titration and fluid restriction teaching.`,
    `Room ${distractors[1]?.room ?? "510"} — ${summarizeMedSurgCase(distractors[1]?.text ?? "COPD exacerbation with accessory muscle use and SpO₂ 86%")}; prioritize bronchodilator nebulizer and oxygen escalation before the somnolent PCA patient.`,
    `Room ${distractors[2]?.room ?? "516"} — ${summarizeMedSurgCase(distractors[2]?.text ?? "new-onset atrial fibrillation with HR 138, dizzy but alert on telemetry")}; assess for rate control and anticoagulation counseling before the patient with RR 8 on PCA morphine.`,
  ] as BankItem["options"];
  const correctAnswer = options[0]!;
  return {
    ...item,
    vignette,
    scenario: vignette,
    question: "Four clients require attention. Which client is the highest priority for the nurse to see first?",
    options,
    correctAnswer,
    explanation:
      `Correct: See Room ${priorityRoom} first — RR 8/min on PCA morphine with somnolence and pinpoint pupils indicates opioid-induced respiratory depression, an immediate airway emergency requiring assessment, possible naloxone, and PCA hold/adjustment. Room 510 COPD exacerbation (SpO₂ 86%) and Room 523 heart failure decompensation are urgent but the patient with impending respiratory failure from opioids takes ABC priority. Room 516 has rapid AF but is alert with BP 104/70. Influenza vaccine tasks are unrelated to acute inpatient triage.`,
    itemType: "vignette",
    ngnPayload: undefined,
    subjectId: item.subjectId || "patient-counseling",
    topicCategory: item.topicCategory ?? "Med-Surg Prioritization",
  };
}

export function buildAcuteDecompensatedHeartFailureMcq(item: BankItem): BankItem {
  const vignette =
    resolveNaplexVignette(item) ||
    "A patient with acute decompensated heart failure on IV diuretic therapy develops worsening congestion and hypotension.";
  const options = [
    "Notify the prescriber immediately for worsening volume overload with weight gain, crackles, edema, hypoxemia, and hypotension with orthostatic dizziness; reassess diuretic response, oxygen needs, and volume status before pursuing unrelated preventive screenings.",
    "Schedule an eye exam as the priority follow-up while congestion and hypotension are actively worsening.",
    "Document a preventive counseling discussion in the chart without addressing the 2.5-kg weight gain, crackles, or BP 88/54 mmHg.",
    "Educate about diabetic retinopathy before notifying the prescriber about acute heart failure decompensation.",
  ] as BankItem["options"];
  const correctAnswer = options[0]!;
  return {
    ...item,
    vignette,
    scenario: vignette,
    question: "What is the most appropriate immediate action?",
    options,
    correctAnswer,
    explanation:
      "Correct: Notify the prescriber and reassess acute decompensated heart failure — weight up 2.5 kg, bilateral crackles, 2+ pitting edema, SpO₂ 91% on supplemental oxygen, and BP 88/54 with dizziness on standing indicate worsening congestion with hemodynamic compromise on IV furosemide. The nurse/pharmacist must escalate assessment of diuresis, perfusion, and oxygenation rather than prioritize diabetic eye screening. Eye exams and retinopathy education are important in chronic diabetes care but do not address this acute cardiopulmonary deterioration. Charting alone without clinical escalation is unsafe.",
    itemType: "vignette",
    ngnPayload: undefined,
    subjectId: item.subjectId || "cardiovascular-rx",
    topicCategory: item.topicCategory ?? "Acute Decompensated Heart Failure",
  };
}

export function buildWarfarinBleedingMcq(item: BankItem): BankItem {
  const vignette =
    resolveNaplexVignette(item) ||
    "A patient on warfarin for deep vein thrombosis develops a supratherapeutic INR with epistaxis and melena.";
  const options = [
    "Supratherapeutic INR of 4.8 with epistaxis and dark tarry stools indicating anticoagulant-related bleeding",
    "Unilateral calf swelling and warmth consistent with known deep vein thrombosis",
    "Blood pressure 126/80 mmHg within expected limits",
    "Respiratory rate 16 breaths/min without signs of respiratory compromise",
  ] as BankItem["options"];
  const correctAnswer = options[0]!;
  return {
    ...item,
    vignette,
    scenario: vignette,
    question: "Which finding requires immediate nursing follow-up?",
    options,
    correctAnswer,
    explanation:
      "Correct: INR 4.8 exceeds the usual therapeutic range and, together with epistaxis and melena, indicates active anticoagulant-related bleeding that requires immediate provider notification, holding warfarin, hemoglobin assessment, and possible reversal per protocol. Calf swelling and warmth reflect the underlying DVT and are expected unless acute compartment syndrome is suspected. Stable blood pressure and normal respiratory rate do not override the bleeding risk from supratherapeutic anticoagulation.",
    itemType: "vignette",
    ngnPayload: undefined,
    subjectId: item.subjectId || "patient-counseling",
    topicCategory: item.topicCategory ?? "Warfarin Bleeding",
  };
}

export function buildUpperGiBleedEmergencyMcq(item: BankItem): BankItem {
  const vignette =
    resolveNaplexVignette(item) ||
    "A patient with an upper gastrointestinal bleed develops hypotension, tachycardia, and symptomatic anemia.";
  const options = [
    "Recognize hemodynamic instability from acute upper GI bleeding; establish large-bore IV access, initiate fluid resuscitation and transfusion per protocol for hemoglobin 7.2 g/dL with hypotension, hold nonessential antiplatelet therapy such as aspirin pending prescriber direction, notify the provider immediately, and prepare for urgent endoscopic evaluation.",
    "Discuss regular blood glucose monitoring while the client is pale with BP 90/56 mmHg and active melena.",
    "Teach hypoglycemia symptoms before addressing orthostatic lightheadedness and anemia.",
    "Instruct on insulin injection technique instead of escalating care for ongoing GI hemorrhage.",
  ] as BankItem["options"];
  const correctAnswer = options[0]!;
  return {
    ...item,
    vignette,
    scenario: vignette,
    question: "What is the most appropriate immediate action?",
    options,
    correctAnswer,
    explanation:
      "Correct: Treat unstable upper GI bleeding — melena with BP 90/56 mmHg, HR 118, hemoglobin 7.2 g/dL, pallor, cool extremities, delayed capillary refill, and orthostatic symptoms indicate significant hemorrhage with hypovolemia. Priorities include IV access, volume resuscitation, transfusion evaluation, holding aspirin when appropriate, provider notification, and urgent source control/endoscopy. Diabetes self-management education is not the immediate priority during active hemorrhagic shock physiology.",
    itemType: "vignette",
    ngnPayload: undefined,
    subjectId: item.subjectId || "patient-counseling",
    topicCategory: item.topicCategory ?? "Upper GI Bleed",
  };
}

export function buildAnaphylaxisEmergencyMcq(item: BankItem): BankItem {
  const vignette =
    resolveNaplexVignette(item) ||
    "A patient develops anaphylaxis shortly after IV antibiotic administration in the emergency department.";
  const options = [
    "Recommend immediate intramuscular epinephrine, secure the airway, IV fluid resuscitation, supplemental oxygen, and discontinuation of the triggering antibiotic; update allergy documentation because beta-lactam cross-reactivity may contribute in patients with penicillin allergy.",
    "Continue ceftriaxone and administer oral diphenhydramine alone because the infection requires uninterrupted beta-lactam therapy.",
    "Defer epinephrine until laboratory confirmation of IgE-mediated allergy is available.",
    "Counsel on weight management and sleep hygiene before addressing hypotension and stridor.",
  ] as BankItem["options"];
  const correctAnswer = options[0]!;
  return {
    ...item,
    vignette,
    scenario: vignette,
    question: "What is the most appropriate immediate action?",
    options,
    correctAnswer,
    explanation:
      "Correct: Recommend immediate IM epinephrine and supportive care — anaphylaxis with hypotension (74/42), tachycardia, hypoxemia, urticaria, angioedema, and stridor after ceftriaxone in a patient with documented penicillin allergy is a medical emergency requiring epinephrine first, airway management, fluids, oxygen, and stopping the offending agent. Cross-reactivity between penicillins and cephalosporins can occur. Antihistamine monotherapy is insufficient for hemodynamic compromise. Delaying epinephrine for lab confirmation is unsafe. Lifestyle counseling is inappropriate during acute anaphylaxis.",
    itemType: "vignette",
    ngnPayload: undefined,
    subjectId: item.subjectId || "patient-counseling",
    topicCategory: item.topicCategory ?? "Anaphylaxis Emergency",
  };
}

function buildHypertensiveEmergencyMcq(item: BankItem): BankItem {
  const vignette =
    resolveNaplexVignette(item) ||
    "A 40-year-old man with hypertension presents to the emergency department with sudden severe headache and blurred vision.";
  const options = [
    "Continue home antihypertensives and arrange outpatient follow-up within 1 week",
    "Give clonidine 0.2 mg orally once and discharge if blood pressure improves",
    "Start continuous IV nicardipine with a goal to lower systolic blood pressure by about 10–20% over the first hour",
    "Give IV hydralazine 20 mg bolus and target systolic blood pressure below 120 mmHg within 30 minutes",
  ] as BankItem["options"];
  const correctAnswer = options[2]!;
  return {
    ...item,
    vignette,
    scenario: vignette,
    question:
      "Which intervention is most appropriate in the emergency department at this time?",
    options,
    correctAnswer,
    explanation:
      "Correct: Start continuous IV nicardipine with a goal to lower systolic blood pressure by about 10–20% over the first hour — this is hypertensive emergency (BP ≥180/120 mmHg with symptoms suggesting acute end-organ involvement). ACC/AHA recommends parenteral therapy in a monitored setting with controlled initial reduction (~10–20% SBP in the first hour), not immediate normalization. Continue home antihypertensives alone is insufficient for symptomatic severe hypertension. Oral clonidine is not first-line for hypertensive emergency and discharge is unsafe. IV hydralazine with rapid normalization risks cerebral hypoperfusion in neurologic presentations.",
    itemType: "vignette",
    ngnPayload: undefined,
    subjectId: item.subjectId || "cardiovascular-rx",
    topicCategory: item.topicCategory ?? "Hypertensive Emergency",
  };
}

/** Pull keyed option text from constructed-response payload segments (AI calc artifacts). */
function inferCorrectFromConstructedPayload(item: BankItem): string | null {
  const payload = item.ngnPayload;
  if (!payload || payload.kind !== "constructed") return null;
  const segments = payload.segments as Array<{ text?: string }> | undefined;
  if (!Array.isArray(segments)) return null;
  for (const seg of segments) {
    const text = seg.text?.trim();
    if (!text) continue;
    const idx = indexOfMatchingOption(item.options, text);
    if (idx >= 0) return item.options[idx]!;
  }
  return null;
}

/** True when a bare integer answer is unlikely to be a real calculation result. */
function isCorruptedConstructedNumericAnswer(item: BankItem): boolean {
  const answer = item.correctAnswer.trim();
  if (!/^\d+(?:\.\d+)?$/.test(answer)) return false;
  const stem = resolveNaplexStem(item);
  if (CALC_LEAD_IN.test(stem)) return false;
  if (MCQ_LEAD_IN.test(stem) && hasMcqOptions(item)) return true;
  const n = parseFloat(answer);
  return Number.isFinite(n) && n > 0 && n <= item.options.length * 4;
}

/** Find an option whose text appears in the explanation body. */
function inferCorrectFromExplanationBody(item: BankItem): string | null {
  const explanation = item.explanation?.trim() ?? "";
  if (!explanation) return null;
  const lower = explanation.toLowerCase();
  let best: { option: string; index: number } | null = null;
  for (let i = 0; i < item.options.length; i++) {
    const option = item.options[i]!.trim();
    if (option.length < 12) continue;
    if (!lower.includes(option.toLowerCase())) continue;
    if (!best || option.length > best.option.length) {
      best = { option, index: i };
    }
  }
  return best?.option ?? null;
}

/** Match bare numeric keys (e.g. "4.5", "30") to the one option containing that value. */
function inferCorrectFromNumericInOptions(item: BankItem): string | null {
  const answer = item.correctAnswer.trim();
  if (!/^\d+(?:\.\d+)?$/.test(answer)) return null;
  const escaped = answer.replace(".", "\\.");
  const pattern = new RegExp(`\\b${escaped}\\b`);
  const matches = item.options.filter((o) => pattern.test(o));
  if (matches.length === 1) return matches[0]!;
  return null;
}

/** Match option text using dose/time phrases repeated in the explanation body. */
function inferCorrectFromExplanationContext(item: BankItem): string | null {
  const explanation = item.explanation?.trim().toLowerCase() ?? "";
  if (explanation.length < 40) return null;

  type Scored = { option: string; score: number };
  const scored: Scored[] = item.options.map((option) => {
    const words = option
      .toLowerCase()
      .split(/[^a-z0-9%/]+/)
      .filter((w) => w.length > 2);
    const score = words.reduce((sum, word) => sum + (explanation.includes(word) ? 1 : 0), 0);
    return { option, score };
  });

  const best = scored.reduce<Scored | null>(
    (acc, row) => (!acc || row.score > acc.score ? row : acc),
    null
  );
  if (!best || best.score < 3) return null;

  const tied = scored.filter((row) => row.score === best.score);
  return tied.length === 1 ? tied[0]!.option : null;
}

/** Recover schedule answers corrupted into one integer (e.g. 12512 → 125 mg q12h). */
function inferCorrectFromConcatenatedSchedule(item: BankItem): string | null {
  const answer = item.correctAnswer.trim();
  if (!/^\d{4,6}$/.test(answer)) return null;
  for (const option of item.options) {
    const digits = option.replace(/\D/g, "");
    if (digits && answer.includes(digits) && digits.length >= 3) return option;
  }
  return null;
}

/** Last resort: small integer keys may be 1-based option indices from bad generation. */
function inferCorrectFromOptionIndex(item: BankItem): string | null {
  const n = parseInt(item.correctAnswer.trim(), 10);
  if (!Number.isFinite(n) || n < 1 || n > item.options.length) return null;
  if (item.options.length !== 4) return null;
  // Only when the stored answer is a single digit index, not a clinical quantity.
  if (!/^[1-4]$/.test(item.correctAnswer.trim())) return null;
  return item.options[n - 1] ?? null;
}

function resolveMcqCorrectAnswer(item: BankItem): string | null {
  const options = item.options;
  const stored = item.correctAnswer.trim();

  if (correctAnswerMatchesOption(options, stored, "mcq")) {
    const idx = indexOfMatchingOption(options, stored);
    return idx >= 0 ? options[idx]! : stored;
  }

  if (isCorruptedConstructedNumericAnswer(item)) {
    const fromNumericOption = inferCorrectFromNumericInOptions(item);
    if (fromNumericOption) return fromNumericOption;

    const fromIndex = inferCorrectFromOptionIndex(item);
    if (fromIndex) return fromIndex;
  } else if (isNumericAnswer(stored) && CALC_LEAD_IN.test(resolveNaplexStem(item))) {
    return null;
  }

  const fromExplanation = extractExplanationCorrectText(item.explanation ?? "");
  if (fromExplanation) {
    const idx = indexOfMatchingOption(options, fromExplanation);
    if (idx >= 0) return options[idx]!;
  }

  const fromWrongSection = inferCorrectFromWrongOptionsSection(options, item.explanation ?? "");
  if (fromWrongSection) return fromWrongSection;

  const fromPriority = inferCorrectFromExplanationRecommendation(options, item.explanation ?? "");
  if (fromPriority) return fromPriority;

  const fromBody = inferCorrectFromExplanationBody(item);
  if (fromBody) return fromBody;

  const fromNumericOption = inferCorrectFromNumericInOptions(item);
  if (fromNumericOption) return fromNumericOption;

  const fromPayload = inferCorrectFromConstructedPayload(item);
  if (fromPayload) return fromPayload;

  const fromDistractors = inferCorrectFromDistractors(options, item.distractorRationale);
  if (fromDistractors) return fromDistractors;

  const fromContext = inferCorrectFromExplanationContext(item);
  if (fromContext) return fromContext;

  const fromSchedule = inferCorrectFromConcatenatedSchedule(item);
  if (fromSchedule) return fromSchedule;

  const fromIndex = inferCorrectFromOptionIndex(item);
  if (fromIndex) return fromIndex;

  return null;
}

function reclassifyConstructedToMcq(item: BankItem): BankItem | null {
  if (!hasMcqOptions(item)) return null;

  const resolved = resolveMcqCorrectAnswer(item);
  if (!resolved) return null;

  const withoutCalcPayload =
    item.ngnPayload?.kind === "constructed"
      ? { ...item, ngnPayload: undefined }
      : item;

  return {
    ...withoutCalcPayload,
    itemType: "vignette",
    options: item.options,
    correctAnswer: resolved,
  };
}

function reclassifyMcqToConstructed(item: BankItem): BankItem | null {
  const numeric = item.correctAnswer.replace(/[^\d.]/g, "").replace(/^\.+|\.+$/g, "").trim();
  if (!/\d/.test(numeric)) return null;
  const unitMatch = item.correctAnswer.match(/\b(mg|mcg|g|mL|mL\/hr|mEq|units|%|tablets|capsules)\b/i);
  const unit = unitMatch?.[1] ?? "mg";
  return {
    ...item,
    itemType: "constructed_response",
    options: [],
    correctAnswer: numeric,
    ngnPayload: { kind: "constructed", unit },
  };
}

function stripConflictingLeadIns(item: BankItem): BankItem | null {
  const stem = resolveNaplexStem(item);
  if ((stem.split("?").length - 1) <= 1) return null;

  const parts = stem
    .split("?")
    .map((p) => p.trim())
    .filter(Boolean);
  if (parts.length < 2) return null;

  const kept =
    parts.find((p) => MCQ_LEAD_IN.test(p) || CALC_LEAD_IN.test(p)) ??
    parts[parts.length - 1];
  const question = `${kept}?`.replace(/\?\?$/, "?");
  return { ...item, question };
}

export type NaplexFormatFixResult = {
  item: BankItem;
  changed: boolean;
  note?: string;
};

/** Rule-based repairs for stem/format/answer alignment defects. */
export function fixNaplexFormatCoherence(item: BankItem): NaplexFormatFixResult {
  let working = { ...item };
  let changed = false;
  let note: string | undefined;

  const beforeIssues = detectNaplexFormatIssues(working);
  if (beforeIssues.length === 0) {
    return { item: working, changed: false };
  }

  const stripped = stripConflictingLeadIns(working);
  if (stripped) {
    working = stripped;
    changed = true;
    note = "removed conflicting lead-ins";
  }

  if (isHypertensiveEmergencyMismatch(working)) {
    working = buildHypertensiveEmergencyMcq(working);
    changed = true;
    note = "rewrote hypertensive emergency as MCQ";
    return { item: working, changed, note };
  }

  if (isAnaphylaxisEmergencyOptionsMismatch(working)) {
    working = buildAnaphylaxisEmergencyMcq(working);
    changed = true;
    note = "rewrote anaphylaxis emergency vignette with unrelated screening options → emergency MCQ";
    return { item: working, changed, note };
  }

  if (isSeverePreeclampsiaOptionsMismatch(working)) {
    working = buildSeverePreeclampsiaEmergencyMcq(working);
    changed = true;
    note = "rewrote severe preeclampsia vignette with unrelated wellness options → emergency MCQ";
    return { item: working, changed, note };
  }

  if (isPsychiatricSuicideRiskOptionsMismatch(working)) {
    working = buildPsychiatricSuicideRiskMcq(working);
    changed = true;
    note = "rewrote psychiatric suicide-risk vignette with unrelated procedure options → safety MCQ";
    return { item: working, changed, note };
  }

  if (isPsychiatricUnitPrioritizationOptionsMismatch(working)) {
    working = buildPsychiatricUnitPrioritizationMcq(working);
    changed = true;
    note = "rewrote psychiatric unit prioritization vignette with unrelated options → triage MCQ";
    return { item: working, changed, note };
  }

  if (isPostpartumHemorrhageOptionsMismatch(working)) {
    working = buildPostpartumHemorrhageEmergencyMcq(working);
    changed = true;
    note = "rewrote postpartum hemorrhage vignette with unrelated respiratory options → emergency MCQ";
    return { item: working, changed, note };
  }

  if (isEmergencyDepartmentPrioritizationOptionsMismatch(working)) {
    working = buildEmergencyDepartmentPrioritizationMcq(working);
    changed = true;
    note = "rewrote emergency department prioritization vignette with unrelated options → triage MCQ";
    return { item: working, changed, note };
  }

  if (isPediatricEdPrioritizationOptionsMismatch(working)) {
    working = buildPediatricEdPrioritizationMcq(working);
    changed = true;
    note = "rewrote pediatric ED prioritization vignette with unrelated options → triage MCQ";
    return { item: working, changed, note };
  }

  if (isLaborDeliveryPrioritizationOptionsMismatch(working)) {
    working = buildLaborDeliveryPrioritizationMcq(working);
    changed = true;
    note = "rewrote labor and delivery prioritization vignette with unrelated options → triage MCQ";
    return { item: working, changed, note };
  }

  if (isMedSurgPrioritizationOptionsMismatch(working)) {
    working = buildMedSurgPrioritizationMcq(working);
    changed = true;
    note = "rewrote med-surg prioritization vignette with unrelated flu vaccine options → triage MCQ";
    return { item: working, changed, note };
  }

  if (isAcuteDecompensatedHeartFailureOptionsMismatch(working)) {
    working = buildAcuteDecompensatedHeartFailureMcq(working);
    changed = true;
    note = "rewrote acute decompensated heart failure vignette with unrelated diabetic eye options → clinical MCQ";
    return { item: working, changed, note };
  }

  if (isUpperGiBleedOptionsMismatch(working)) {
    working = buildUpperGiBleedEmergencyMcq(working);
    changed = true;
    note = "rewrote upper GI bleed vignette with unrelated diabetes education options → hemorrhage MCQ";
    return { item: working, changed, note };
  }

  if (isWarfarinBleedingOptionsMismatch(working)) {
    working = buildWarfarinBleedingMcq(working);
    changed = true;
    note = "rewrote warfarin bleeding vignette with unrelated opioid/airway options → anticoagulant bleed MCQ";
    return { item: working, changed, note };
  }

  if (clinicalVignetteUnrelatedCalcIssue(working)) {
    const wasCopd = isCopdWorseningVignette(resolveNaplexVignette(working));
    working = buildClinicalVignetteUnrelatedCalcMcq(working);
    changed = true;
    note = wasCopd
      ? "rewrote COPD clinical vignette with unrelated tablet calc → exacerbation MCQ"
      : "rewrote clinical vignette with unrelated self-contained calc → clinical MCQ";
    return { item: working, changed, note };
  }

  if (
    clinicalCounselingIntentCalcMismatchIssue(working) &&
    isAnticoagulantBleedingRiskCounselingVignette(resolveNaplexVignette(working))
  ) {
    working = buildAnticoagulantBleedingRiskMcq(working);
    changed = true;
    note = "rewrote anticoagulant bleeding-risk vignette with dispense calc → counseling MCQ";
    return { item: working, changed, note };
  }

  if (
    clinicalCounselingIntentCalcMismatchIssue(working) &&
    isNsaidAceInteractionCounselingVignette(resolveNaplexVignette(working))
  ) {
    working = buildNsaidAceInteractionMcq(working);
    changed = true;
    note = "rewrote NSAID/ACE inhibitor interaction vignette with unrelated infusion calc → counseling MCQ";
    return { item: working, changed, note };
  }

  if (
    clinicalCounselingIntentCalcMismatchIssue(working) &&
    isPenicillinAllergyAmoxicillinVignette(resolveNaplexVignette(working))
  ) {
    working = buildPenicillinAllergyCounselingMcq(working);
    changed = true;
    note = "rewrote penicillin allergy amoxicillin vignette with unrelated volume calc → allergy MCQ";
    return { item: working, changed, note };
  }

  if (
    clinicalCounselingIntentCalcMismatchIssue(working) &&
    isMetforminRenalSafetyCounselingVignette(resolveNaplexVignette(working))
  ) {
    working = buildMetforminRenalSafetyMcq(working);
    changed = true;
    note = "rewrote metformin renal safety vignette with unrelated dose calc → counseling MCQ";
    return { item: working, changed, note };
  }

  if (
    clinicalCounselingIntentCalcMismatchIssue(working) &&
    isAmoxicillinUtiIncompleteDispenseVignette(
      resolveNaplexVignette(working),
      resolveNaplexStem(working)
    )
  ) {
    working = buildUtiAmoxicillinCounselingMcq(working);
    changed = true;
    note = "rewrote UTI amoxicillin vignette with incomplete tablet dispense calc → counseling MCQ";
    return { item: working, changed, note };
  }

  if (
    clinicalCounselingIntentCalcMismatchIssue(working) &&
    isPregnancyTopicalAntibioticSafetyVignette(resolveNaplexVignette(working))
  ) {
    working = buildPregnancyTopicalAntibioticCounselingMcq(working);
    changed = true;
    note = "rewrote pregnancy topical antibiotic safety vignette with unrelated dose calc → counseling MCQ";
    return { item: working, changed, note };
  }

  if (isAsthmaClinicalCalcMismatch(working) && orphanGenericCalcStemIssue(working)) {
    const wasExacerbation = isAsthmaExacerbationMismatch(working);
    working = buildAsthmaClinicalMcqRepair(working);
    changed = true;
    note = wasExacerbation
      ? "rewrote asthma exacerbation orphan calc → ED management MCQ"
      : "rewrote asthma poor-control orphan calc → step-up therapy MCQ";
    return { item: working, changed, note };
  }

  if (isPediatricMgKgDoseCalcMismatch(working) && orphanGenericCalcStemIssue(working)) {
    working = buildPediatricMgKgDoseCalc(working);
    changed = true;
    note = "retargeted mismatched concentration stem → pediatric mg/kg per-dose calculation";
    return { item: working, changed, note };
  }

  if (isOpioidClinicalCounselingMismatch(working)) {
    working = buildOpioidClinicalCounselingMcq(working);
    changed = true;
    note = "rewrote opioid counseling orphan calc → clinical MCQ";
    return { item: working, changed, note };
  }

  if (
    orphanGenericCalcStemIssue(working) &&
    isSepsisIvAntibioticTherapyVignette(resolveNaplexVignette(working))
  ) {
    working = buildSepsisIvAntibioticTherapyMcq(working);
    changed = true;
    note = isSepsisRenalImpairmentVignette(resolveNaplexVignette(working))
      ? "rewrote sepsis renal impairment orphan prep calc → clinical MCQ"
      : "rewrote sepsis ICU antibiotic orphan prep calc → clinical MCQ";
    return { item: working, changed, note };
  }

  if (
    orphanGenericCalcStemIssue(working) &&
    isAnticoagulantCounselingVignette(resolveNaplexVignette(working))
  ) {
    working = buildAnticoagulantClinicalMcq(working);
    changed = true;
    note = "rewrote anticoagulant counseling orphan tablet calc → bleeding MCQ";
    return { item: working, changed, note };
  }

  if (
    orphanGenericCalcStemIssue(working) &&
    isHeartFailureOrthostaticHypotensionVignette(resolveNaplexVignette(working))
  ) {
    working = buildHeartFailureOrthostaticHypotensionMcq(working);
    changed = true;
    note = "rewrote heart failure orthostatic orphan volume calc → clinical MCQ";
    return { item: working, changed, note };
  }

  const clinicalNumeric = repairClinicalNumericMismatch(working);
  if (clinicalNumeric.changed) {
    working = clinicalNumeric.item;
    changed = true;
    note = clinicalNumeric.note;
  }

  if (orphanGenericCalcStemIssue(working)) {
    const vignette = resolveNaplexVignette(working) || working.vignette || working.scenario || "";
    const mcqStem = inferMcqStemFromVignette(vignette);
    if (isPediatricMgKgDoseCalcMismatch(working)) {
      working = buildPediatricMgKgDoseCalc(working);
      changed = true;
      note = "repaired orphan calc stem → pediatric mg/kg per-dose calculation";
    } else if (isAsthmaClinicalCalcMismatch(working)) {
      const wasExacerbation = isAsthmaExacerbationMismatch(working);
      working = buildAsthmaClinicalMcqRepair(working);
      changed = true;
      note = wasExacerbation
        ? "repaired orphan calc stem → asthma exacerbation MCQ"
        : "repaired orphan calc stem → asthma step-up therapy MCQ";
    } else if (isOpioidClinicalCounselingMismatch(working)) {
      working = buildOpioidClinicalCounselingMcq(working);
      changed = true;
      note = "repaired orphan calc stem → opioid counseling MCQ";
    } else if (hasMcqOptions(working)) {
      const mcq = reclassifyConstructedToMcq({
        ...working,
        question: mcqStem,
        ngnPayload: working.ngnPayload?.kind === "constructed" ? undefined : working.ngnPayload,
      });
      if (mcq) {
        working = mcq;
        changed = true;
        note = "repaired orphan calc stem → clinical vignette MCQ";
      }
    } else {
      working = buildOrphanClinicalCalcMcqRepair(working);
      changed = true;
      note = isSepsisIvAntibioticTherapyVignette(vignette)
        ? "repaired orphan prep calc → sepsis antibiotic therapy MCQ"
        : "repaired orphan calc stem → clinical MCQ";
    }
  }

  const itemType = working.itemType ?? "mcq";
  if (itemType === "constructed_response" && hasMcqOptions(working)) {
    const mcq = reclassifyConstructedToMcq(working);
    if (mcq) {
      working = mcq;
      changed = true;
      note = "reclassified constructed_response → vignette MCQ";
    }
  }

  if (
    (working.itemType === "mcq" || working.itemType === "vignette") &&
    CALC_LEAD_IN.test(resolveNaplexStem(working)) &&
    isNumericAnswer(working.correctAnswer) &&
    !correctAnswerMatchesOption(working.options, working.correctAnswer, working.itemType)
  ) {
    const calc = reclassifyMcqToConstructed(working);
    if (calc) {
      working = calc;
      changed = true;
      note = "reclassified MCQ → constructed_response calculation";
    }
  }

  const aligned = alignNaplexBankItemAnswers(working);
  if (aligned.changed) {
    working = aligned.item;
    changed = true;
    note = note ? `${note}; ${aligned.note}` : aligned.note;
  }

  return { item: working, changed, note };
}

export function itemHasFormatCoherenceIssue(item: BankItem): boolean {
  return (
    detectNaplexFormatIssues(item).length > 0 ||
    orphanGenericCalcStemIssue(item) !== null ||
    clinicalVignetteUnrelatedCalcIssue(item) !== null ||
    clinicalCounselingIntentCalcMismatchIssue(item) !== null ||
    clinicalVignetteUnrelatedOptionsIssue(item) !== null
  );
}

/** Full prep pipeline for serve/timed exams: format repair then answer alignment. */
export function prepareNaplexBankItem(item: BankItem): BankItem {
  const formatFixed = fixNaplexFormatCoherence(item);
  const aligned = alignNaplexBankItemAnswers(formatFixed.item);
  return aligned.item;
}
