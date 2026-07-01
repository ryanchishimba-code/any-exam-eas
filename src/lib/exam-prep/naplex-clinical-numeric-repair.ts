import type { BankItem } from "@/lib/question-bank";
import {
  detectNaplexFormatIssues,
  GENERIC_BLUEPRINT_CALC_STEMS,
  vignetteSupportsCalculation,
} from "./naplex-format-coherence";
import { resolveNaplexStem, resolveNaplexVignette } from "./naplex-bank-audit";

export type ClinicalNumericRepairResult = {
  item: BankItem;
  changed: boolean;
  note?: string;
};

const COUNSELING_VIGNETTE =
  /\b(?:counsel|counseling|mother asks|patient asks|father asks|parent asks|how to (?:properly )?use|proper (?:dosing|technique|inhaler)|inhaler correctly|demonstrate|technique|how often|how to store|storage|expiration|when to seek|signs of worsening)\b/i;

function optionUnit(options: string[]): string | null {
  for (const opt of options) {
    const m = opt.trim().match(/\d+(?:\.\d+)?\s*(mg\/mL|mcg\/mL|mL\/hr|mg|mcg|mL|tablets?|capsules?|g|%)/i);
    if (m?.[1]) return m[1].toLowerCase().replace(/s$/, "");
  }
  if (options.every((o) => /^\d+(?:\.\d+)?$/.test(o.trim()))) return "ratio";
  return null;
}

function inferCalcStem(unit: string | null, explanation: string): string {
  const expl = explanation.toLowerCase();
  if (unit === "tablet" || unit === "capsule" || /\btablets?\b/.test(expl)) {
    return "How many tablets should be dispensed for this order?";
  }
  if (unit === "ml/hr" || /\binfusion rate\b|\bmL\/hr\b/.test(expl)) {
    return "At what rate (mL/hr) should the infusion pump be set? Round to the nearest whole number.";
  }
  if (unit === "ml" || (unit === "ratio" && /\bvolume\b|\btotal volume\b/.test(expl))) {
    return "What is the total volume in mL? Round to one decimal place.";
  }
  if (unit === "mg/ml" || unit === "mcg/ml" || (unit === "ratio" && /\bconcentration\b/.test(expl))) {
    return "Calculate the concentration in mg/mL. Round to two decimal places.";
  }
  if (/\bdaily dose\b|\btotal daily\b|\bper day\b/.test(expl)) {
    return "Calculate the total daily dose in mg. Round to the nearest whole number.";
  }
  if (/\binitial dose\b|\bstarting dose\b|\bappropriate dose\b/.test(expl)) {
    return "Calculate the dose in mg. Round to the nearest whole number.";
  }
  return GENERIC_BLUEPRINT_CALC_STEMS[0];
}

function buildAlbuterolInhalerCounseling(item: BankItem): BankItem {
  const options = [
    "Use a spacer with the MDI, shake the inhaler, and give 1–2 puffs every 4–6 hours as needed for wheezing or chest tightness.",
    "Use the rescue inhaler only when the child has audible wheezing at rest.",
    "Give 4 mg by mouth every hour until wheezing resolves.",
    "Rinse the mouth with water after each albuterol puff to prevent oral thrush.",
  ] as BankItem["options"];
  const correctAnswer = options[0]!;
  return {
    ...item,
    question: "Which counseling point is most important?",
    options,
    correctAnswer,
    explanation:
      "Correct: Use a spacer with the MDI, shake the inhaler, and give 1–2 puffs every 4–6 hours as needed — pediatric albuterol MDI therapy is typically 90 mcg per actuation (1–2 puffs) every 4–6 hours as needed. Spacers improve drug delivery in children. Waiting for audible wheezing alone can delay treatment. Oral albuterol 4 mg hourly is not standard rescue therapy for MDI users. Rinsing after albuterol is unnecessary; that counseling applies to inhaled corticosteroids.",
    itemType: "vignette",
    ngnPayload: item.ngnPayload?.kind === "constructed" ? undefined : item.ngnPayload,
  };
}

function buildGenericInhalerCounseling(item: BankItem): BankItem {
  const options = [
    "Demonstrate proper inhaler technique and confirm the patient can repeat the steps correctly.",
    "Advise using the rescue inhaler on a fixed hourly schedule regardless of symptoms.",
    "Recommend stopping the maintenance inhaler once symptoms improve.",
    "Counsel that rinsing the mouth after every rescue inhaler use is required to prevent thrush.",
  ] as BankItem["options"];
  const correctAnswer = options[0]!;
  return {
    ...item,
    question: /counseling point/i.test(item.question ?? "")
      ? item.question!
      : "Which counseling point is most important?",
    options,
    correctAnswer,
    explanation:
      "Correct: Demonstrate proper inhaler technique — effective inhalation requires coordination, device-specific steps, and return demonstration. Rescue inhalers are used as needed, not on a fixed schedule. Maintenance therapy should not be stopped without prescriber guidance. Mouth rinsing after inhaled corticosteroids reduces thrush risk; it is not routinely required after short-acting beta-agonists alone.",
    itemType: "vignette",
    ngnPayload: item.ngnPayload?.kind === "constructed" ? undefined : item.ngnPayload,
  };
}

function buildAsthmaControlCounseling(item: BankItem): BankItem {
  const options = [
    "Rescue inhaler use more than twice weekly suggests poor control; recommend follow-up to assess the need for a daily controller.",
    "Increase the rescue inhaler dose without contacting the prescriber.",
    "Stop the daily controller once daytime symptoms improve.",
    "Use the rescue inhaler before every meal to prevent symptoms.",
  ] as BankItem["options"];
  const correctAnswer = options[0]!;
  return {
    ...item,
    question: /counseling point|recommendation|next best step/i.test(item.question ?? "")
      ? item.question!.replace(/Which recommendation.*/, "Which counseling point is most important?")
      : "Which counseling point is most important?",
    options,
    correctAnswer,
    explanation:
      "Correct: Rescue inhaler use more than twice weekly suggests poor control — guideline-based asthma care recommends controller therapy and follow-up when SABA use exceeds this threshold. Rescue dose should not be increased without prescriber evaluation. Controllers should not be stopped when symptoms briefly improve. Scheduled pre-meal rescue use is not standard asthma management.",
    itemType: "vignette",
    ngnPayload: item.ngnPayload?.kind === "constructed" ? undefined : item.ngnPayload,
  };
}

function buildAmoxicillinPediatricCounseling(item: BankItem): BankItem {
  const options = [
    "Shake the suspension well before each dose and complete the full antibiotic course even if symptoms improve.",
    "Store the reconstituted suspension at room temperature indefinitely after mixing.",
    "Double the next dose if one dose is missed.",
    "Stop the antibiotic once fever resolves.",
  ] as BankItem["options"];
  const correctAnswer = options[0]!;
  return {
    ...item,
    question: "Which counseling point is most important?",
    options,
    correctAnswer,
    explanation:
      "Correct: Shake the suspension well before each dose and complete the full course — reconstituted amoxicillin suspensions require resuspension for accurate dosing, and premature discontinuation increases treatment failure and resistance. Most suspensions require refrigeration after reconstitution for a limited beyond-use date. Missed doses should not be doubled without pharmacist or prescriber guidance.",
    itemType: "vignette",
    ngnPayload: item.ngnPayload?.kind === "constructed" ? undefined : item.ngnPayload,
  };
}

function buildEpinephrineCounseling(item: BankItem): BankItem {
  const options = [
    "Inject into the outer thigh, call emergency services, and seek immediate medical evaluation after use.",
    "Oral epinephrine tablets are preferred for anaphylaxis in adults.",
    "The auto-injector may be stored in a hot car for convenience.",
    "A second dose should never be given even if symptoms persist.",
  ] as BankItem["options"];
  const correctAnswer = options[0]!;
  return {
    ...item,
    question: "Which counseling point is most important?",
    options,
    correctAnswer,
    explanation:
      "Correct: Inject into the outer thigh and call emergency services — epinephrine auto-injectors are for intramuscular anaphylaxis treatment, and patients need emergency evaluation after use. Oral epinephrine is not appropriate for anaphylaxis. Auto-injectors should be stored according to label temperature requirements. A second dose may be given per action plan if symptoms persist.",
    itemType: "vignette",
    ngnPayload: item.ngnPayload?.kind === "constructed" ? undefined : item.ngnPayload,
  };
}

function buildCounselingRepair(item: BankItem): BankItem | null {
  const text = `${resolveNaplexVignette(item)} ${item.question ?? ""}`.toLowerCase();
  if (/albuterol|levalbuterol/.test(text) && /inhaler|mdi|puff|wheezing|mother asks|proper dosing|technique/.test(text)) {
    return buildAlbuterolInhalerCounseling(item);
  }
  if (/epinephrine|auto-injector|anaphylaxis/.test(text)) {
    return buildEpinephrineCounseling(item);
  }
  if (/amoxicillin|ear infection|suspension|reconstitut/.test(text) && /child|pediatric|year-old|mother|parent/.test(text)) {
    return buildAmoxicillinPediatricCounseling(item);
  }
  if (/asthma|wheezing|rescue inhaler|saba|nighttime|peak flow|controller/.test(text)) {
    return buildAsthmaControlCounseling(item);
  }
  if (/inhaler|copd|tiotropium|fluticasone|salmeterol|spiriva|technique|demonstrate/.test(text)) {
    return buildGenericInhalerCounseling(item);
  }
  return null;
}

function shouldPreferCounselingRepair(item: BankItem): boolean {
  const vignette = resolveNaplexVignette(item);
  if (!COUNSELING_VIGNETTE.test(vignette)) return false;
  const unit = optionUnit(item.options);
  if (unit === "tablet" || unit === "capsule" || unit === "ml/hr") return false;
  if (vignetteSupportsCalculation(item)) return false;
  if (/\b(?:dispense|Rx:|three times daily|twice daily|every \d+ hours|for \d+ days)\b/i.test(vignette)) {
    return false;
  }
  return true;
}

function reclassifyToCalculation(item: BankItem): BankItem {
  const unit = optionUnit(item.options);
  const question = inferCalcStem(unit, item.explanation ?? "");
  return {
    ...item,
    question,
    itemType: "vignette",
    ngnPayload: item.ngnPayload?.kind === "constructed" ? undefined : item.ngnPayload,
  };
}

/** Repair clinical/counseling MCQ stems paired with bare numeric answer choices. */
export function repairClinicalNumericMismatch(item: BankItem): ClinicalNumericRepairResult {
  const issues = detectNaplexFormatIssues(item);
  if (!issues.some((i) => i.code === "naplex_clinical_stem_numeric_options")) {
    return { item, changed: false };
  }

  if (shouldPreferCounselingRepair(item)) {
    const counseled = buildCounselingRepair(item);
    if (counseled) {
      const after = detectNaplexFormatIssues(counseled);
      if (!after.some((i) => i.code === "naplex_clinical_stem_numeric_options")) {
        return { item: counseled, changed: true, note: "rewrote counseling vignette with qualitative MCQ options" };
      }
    }
  }

  const calc = reclassifyToCalculation(item);
  const afterCalc = detectNaplexFormatIssues(calc);
  if (!afterCalc.some((i) => i.code === "naplex_clinical_stem_numeric_options")) {
    return {
      item: calc,
      changed: true,
      note: `reclassified to calculation stem: ${resolveNaplexStem(calc).slice(0, 60)}…`,
    };
  }

  const fallbackCounseling = buildCounselingRepair(item) ?? buildGenericInhalerCounseling(item);
  return {
    item: fallbackCounseling,
    changed: true,
    note: "fallback counseling rewrite",
  };
}

export function hasClinicalNumericMismatch(item: BankItem): boolean {
  return detectNaplexFormatIssues(item).some((i) => i.code === "naplex_clinical_stem_numeric_options");
}
