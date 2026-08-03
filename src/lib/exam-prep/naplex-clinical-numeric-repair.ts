import type { BankItem } from "@/lib/question-bank";
import {
  buildAnticoagulantBleedingCounselingMcq,
  buildHeartFailureOrthostaticMcq,
  buildMetforminRenalSafetyCounselingMcq,
  buildNsaidAceInteractionCounselingMcq,
  buildOpioidCnsSideEffectMcq,
  buildPenicillinAllergyAmoxicillinMcq,
  buildSepsisRenalImpairmentMcq,
  buildSepsisIvAntibioticTherapyMcq,
  buildUtiAmoxicillinCounselingMcq,
  buildPregnancyTopicalAntibioticCounselingMcq,
  calculationContextSupportsStem,
  detectNaplexFormatIssues,
  GENERIC_BLUEPRINT_CALC_STEMS,
  isAmoxicillinUtiIncompleteDispenseCounselingVignette,
  isAnticoagulantBleedingCounselingVignette,
  isPregnancyTopicalAntibioticSafetyCounselingVignette,
  isHeartFailureOrthostaticVignette,
  isMetforminRenalSafetyVignette,
  isNsaidAceInteractionVignette,
  isPenicillinAllergyAmoxicillinCounselingVignette,
  isSepsisRenalAntibioticVignette,
  vignetteSupportsCalculation,
} from "./naplex-format-coherence";
import { resolveNaplexStem, resolveNaplexVignette } from "./naplex-bank-audit";

export type ClinicalNumericRepairResult = {
  item: BankItem;
  changed: boolean;
  note?: string;
};

const COUNSELING_VIGNETTE =
  /\b(?:counsel|counseling|mother asks|mother reports|patient asks|patient inquires|asks if it is safe|she asks|he asks|expresses concern|father asks|parent asks|how to (?:properly )?use|proper (?:dosing|technique|inhaler)|inhaler correctly|demonstrate|technique|how often|how to store|storage|expiration|when to seek|signs of worsening|additional medications|adjustments to (?:his|her|their|the) current regimen|allergic to|allergy to|appropriate dose for (?:his|her|their) age|safety of this medication|concerned about the safety)\b/i;

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

const CLINICAL_MCQ_STEM =
  /\b(?:which (?:finding|action|medication|intervention|recommendation|counseling|monitoring|drug|alternative|statement)|what is the (?:most|best|priority|next|appropriate)|most appropriate|best choice|best next|next best step|which of the following|which recommendation)\b/i;

const CALC_STEM =
  /\b(?:calculate|how many|how much|at what rate|round to|what is the (?:rate|dose|volume|concentration|quantity|total|amount|number|daily dose|infusion rate))\b/i;

function buildBuprenorphineOudPainMcq(item: BankItem): BankItem {
  const options = [
    "Recommend non-opioid multimodal analgesia and coordinate with the buprenorphine prescriber before adding full opioid agonists because of relapse and precipitated withdrawal risk.",
    "Advise stopping buprenorphine/naloxone so the patient can take conventional opioid analgesics for the injury.",
    "Recommend hydrocodone/acetaminophen alone without PDMP review or prescriber coordination.",
    "Defer pain assessment and dispense a 30-day supply of a full opioid agonist as requested.",
  ] as BankItem["options"];
  const correctAnswer = options[0]!;
  return {
    ...item,
    question: /which recommendation|most appropriate/i.test(item.question ?? "")
      ? item.question!
      : "What is the most appropriate recommendation for this patient?",
    options,
    correctAnswer,
    explanation:
      "Correct: Recommend non-opioid multimodal analgesia and coordinate with the buprenorphine prescriber — patients on buprenorphine for OUD need careful acute pain plans that avoid unsupervised full mu-agonist therapy and relapse risk. Stopping buprenorphine/naloxone can precipitate withdrawal and increase relapse risk. Full opioid agonists without coordination can antagonize treatment goals. Dispensing long-term opioids without prescriber collaboration is unsafe in OUD.",
    itemType: "vignette",
    ngnPayload: item.ngnPayload?.kind === "constructed" ? undefined : item.ngnPayload,
  };
}

function buildGenericClinicalRecommendationMcq(item: BankItem): BankItem {
  const options = [
    "Coordinate with the prescriber on a patient-specific, evidence-based plan before changing therapy.",
    "Recommend doubling the current medication dose without prescriber approval.",
    "Advise stopping all current therapy and self-managing symptoms at home.",
    "Dispense the requested medication without assessment or counseling.",
  ] as BankItem["options"];
  const correctAnswer = options[0]!;
  return {
    ...item,
    question: /which recommendation|most appropriate/i.test(item.question ?? "")
      ? item.question!
      : "What is the most appropriate recommendation for this patient?",
    options,
    correctAnswer,
    explanation:
      "Correct: Coordinate with the prescriber on a patient-specific plan — pharmacist recommendations for complex patients should be evidence-based and involve the prescribing team when therapy changes are needed. Unsupervised dose escalation, stopping prescribed therapy abruptly, and dispensing without assessment are unsafe.",
    itemType: "vignette",
    ngnPayload: item.ngnPayload?.kind === "constructed" ? undefined : item.ngnPayload,
  };
}

function isDiabetesHypertensionFollowUpVignette(text: string): boolean {
  return (
    /\b(?:diabetes|diabetic|type 2|t2dm|hb?a1c|metformin|glycemic)\b/i.test(text) &&
    /\b(?:hypertension|hypertensive|lisinopril|amlodipine|losartan|metoprolol|blood pressure|\d+\/\d+\s*mm Hg)\b/i.test(
      text
    ) &&
    /\b(?:follow-up|routine visit|inquire|additional medications|adjustments|current regimen|near goal|well controlled)\b/i.test(
      text
    )
  );
}

function buildDiabetesHypertensionFollowUpMcq(item: BankItem): BankItem {
  const options = [
    "Counsel on adherence to lisinopril and metformin, lifestyle modification, and routine monitoring; with BP 130/80 mm Hg and HbA1c 7.5%, continue current therapy and coordinate with the prescriber before making empiric dose changes.",
    "Recommend doubling the metformin dose without prescriber approval because the patient asked about adjustments.",
    "Advise stopping lisinopril because the blood pressure is below 140/90 mm Hg.",
    "Recommend empiric insulin initiation without assessing the prescriber plan or patient-specific factors.",
  ] as BankItem["options"];
  const correctAnswer = options[0]!;
  return {
    ...item,
    question: "What is the most appropriate recommendation for this patient?",
    options,
    correctAnswer,
    explanation:
      "Correct: Counsel on adherence, lifestyle, and monitoring while continuing current therapy — BP 130/80 mm Hg and HbA1c 7.5% are near goal on lisinopril and metformin; the pharmacist should reinforce self-care and involve the prescriber before empiric escalation rather than guessing a new mg dose. Unsupervised metformin dose doubling risks GI toxicity and lactic acidosis without a glycemic indication. Stopping ACE inhibitor therapy without prescriber input is inappropriate at this BP. Insulin initiation requires individualized prescriber assessment, not empiric pharmacy recommendation.",
    itemType: "vignette",
    ngnPayload: item.ngnPayload?.kind === "constructed" ? undefined : item.ngnPayload,
    subjectId: item.subjectId || "cardiovascular-rx",
    topicCategory: item.topicCategory ?? "Diabetes Hypertension Follow-up",
  };
}

function isHyperkalemiaSpironolactoneVignette(text: string): boolean {
  return (
    /\b(?:spironolactone|eplerenone|amiloride|triamterene|aldosterone antagonist)\b/i.test(text) &&
    /\b(?:potassium|hyperkalemia|k\+|mEq\/L)\b/i.test(text) &&
    (/\b[5-9]\.\d+\s*mEq\/L\b/i.test(text) ||
      /\b(?:elevated|high|increased)\s+potassium\b/i.test(text) ||
      /serum potassium level is/i.test(text))
  );
}

function buildHyperkalemiaSpironolactoneMcq(item: BankItem): BankItem {
  const options = [
    "Recommend contacting the prescriber to hold or adjust spironolactone and recheck serum potassium promptly because hyperkalemia in a patient on spironolactone plus lisinopril with CKD requires intervention; counsel to avoid potassium supplements and salt substitutes.",
    "Increase spironolactone to 50 mg daily to improve blood pressure control despite the elevated potassium.",
    "Recommend an over-the-counter potassium supplement for fatigue and recheck labs in 3 months.",
    "Continue all current medications unchanged because dizziness and fatigue are expected with antihypertensive therapy.",
  ] as BankItem["options"];
  const correctAnswer = options[0]!;
  return {
    ...item,
    question: "What is the most appropriate recommendation for this patient?",
    options,
    correctAnswer,
    explanation:
      "Correct: Contact the prescriber to hold or adjust spironolactone and recheck potassium — K+ 5.5 mEq/L with spironolactone plus ACE inhibitor and CKD indicates hyperkalemia risk; MRA plus RAAS blockade can cause dangerous hyperkalemia and arrhythmias. Dizziness/fatigue may reflect hyperkalemia or hypotension and warrant evaluation. Increasing spironolactone worsens hyperkalemia. Potassium supplements are contraindicated. Continuing without action ignores a potentially life-threatening drug interaction.",
    itemType: "vignette",
    ngnPayload: item.ngnPayload?.kind === "constructed" ? undefined : item.ngnPayload,
    subjectId: item.subjectId || "cardiovascular-rx",
    topicCategory: item.topicCategory ?? "Hyperkalemia MRA",
  };
}

function isHydrocortisoneHydrocodoneAllergyVignette(text: string): boolean {
  return (
    /\bhydrocortisone\b/i.test(text) &&
    /\b(?:hydrocodone|opioid)\b/i.test(text) &&
    /\ballerg/i.test(text)
  );
}

function buildHydrocortisoneHydrocodoneAllergyMcq(item: BankItem): BankItem {
  const options = [
    "Counsel that hydrocortisone is a topical corticosteroid, not an opioid, and allergy to hydrocodone does not contraindicate its use because the drugs have different structures and mechanisms; confirm no prior corticosteroid or excipient allergy.",
    "Advise avoiding the hydrocortisone cream because any medication beginning with \"hydro-\" is contraindicated after a hydrocodone allergy.",
    "Recommend switching to oral hydrocodone/acetaminophen because topical absorption is unreliable.",
    "Dispense the cream without counseling because sound-alike drug names always indicate cross-allergy.",
  ] as BankItem["options"];
  const correctAnswer = options[0]!;
  return {
    ...item,
    question: "Which counseling point is most important?",
    options,
    correctAnswer,
    explanation:
      "Correct: Counsel that hydrocortisone is a corticosteroid distinct from hydrocodone — opioid allergy does not predict corticosteroid allergy based on name similarity alone; topical hydrocortisone is generally appropriate unless the patient has a documented corticosteroid or formulation excipient allergy. Blanket avoidance of all \"hydro-\" drugs is not evidence-based. Oral hydrocodone would be inappropriate in a patient allergic to hydrocodone. Assuming cross-allergy from name similarity alone is unsafe counseling.",
    itemType: "vignette",
    ngnPayload: item.ngnPayload?.kind === "constructed" ? undefined : item.ngnPayload,
    subjectId: item.subjectId || "patient-counseling",
    topicCategory: item.topicCategory ?? "Allergy Cross-Reactivity",
  };
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

function buildAsthmaPoorControlMcq(item: BankItem): BankItem {
  const options = [
    "Recommend follow-up with the prescriber for step-up therapy and counsel against increasing controller inhaler use beyond the prescribed regimen because nocturnal symptoms indicate uncontrolled asthma.",
    "Advise using fluticasone/salmeterol more frequently throughout the day until nighttime symptoms resolve.",
    "Recommend stopping the maintenance inhaler and using albuterol alone until daytime symptoms improve.",
    "Counsel that nighttime symptoms are expected on maintenance therapy and do not require a therapy change.",
  ] as BankItem["options"];
  const correctAnswer = options[0]!;
  return {
    ...item,
    question: /which recommendation|most appropriate/i.test(item.question ?? "")
      ? item.question!
      : "What is the most appropriate recommendation for this patient?",
    options,
    correctAnswer,
    explanation:
      "Correct: Recommend follow-up with the prescriber for step-up therapy and counsel against increasing controller use beyond the prescribed regimen — nocturnal symptoms and overuse of ICS/LABA suggest uncontrolled asthma; assess adherence, inhaler technique, triggers, and need for escalation per guidelines.",
    itemType: "vignette",
    ngnPayload: item.ngnPayload?.kind === "constructed" ? undefined : item.ngnPayload,
  };
}

function isAsthmaPoorControlVignette(text: string): boolean {
  const onMaintenance =
    /fluticasone|salmeterol|budesonide|maintenance|advair|symbicort|breo|wixela|ics\/laba|controller|inhaled corticosteroid/.test(
      text
    );
  const poorControl =
    /more than twice|twice weekly|more frequently than prescribed|more frequently|nighttime|nocturnal|awakening|poor control|uncontrolled|frequent.*symptoms|still experiences|concerned about.*control|worsening symptoms|concerned about his worsening|concerned about her worsening/.test(
      text
    );
  if (/\basthma\b/.test(text) && onMaintenance && poorControl) return true;
  if (
    /\basthma\b/.test(text) &&
    /albuterol|levalbuterol|rescue inhaler|\bsaba\b/.test(text) &&
    poorControl
  ) {
    return true;
  }
  return false;
}

function buildPediatricAsthmaRescueOveruseMcq(item: BankItem): BankItem {
  const options = [
    "Counsel that increased rescue inhaler use and worsening symptoms suggest poor asthma control; recommend prescriber follow-up for daily controller therapy and demonstrate proper albuterol use (typically 1–2 puffs every 4–6 hours as needed) rather than unsupervised mg dose escalation without weight-based prescriber guidance.",
    "Recommend increasing the albuterol dose to 8 mg every hour until symptoms resolve without contacting the prescriber.",
    "Advise stopping all asthma medications because rescue inhaler use means the child has outgrown asthma.",
    "Counsel that frequent rescue inhaler use is expected and does not require evaluation or controller therapy.",
  ] as BankItem["options"];
  const correctAnswer = options[0]!;
  return {
    ...item,
    question: /which recommendation|most appropriate/i.test(item.question ?? "")
      ? "What is the most appropriate recommendation for this patient?"
      : "Which counseling point is most important?",
    options,
    correctAnswer,
    explanation:
      "Correct: Increased albuterol use with worsening symptoms suggests uncontrolled asthma — recommend prescriber follow-up for controller therapy and proper rescue inhaler technique rather than guessing a weight-based mg dose without the child's weight or prescriber plan. Unsupervised dose escalation to high mg doses is unsafe. Stopping therapy or dismissing frequent rescue use ignores guideline-based asthma management.",
    itemType: "vignette",
    ngnPayload: item.ngnPayload?.kind === "constructed" ? undefined : item.ngnPayload,
    subjectId: item.subjectId || "respiratory-rx",
    topicCategory: item.topicCategory ?? "Pediatric Asthma Control",
  };
}

function isAsthmaMonitoringVignette(text: string): boolean {
  return (
    /\basthma\b/.test(text) &&
    /monitoring parameter|which monitoring|prevent.*exacerbation|well controlled|better manage|future exacerbation|action plan|peak flow/.test(
      text
    ) &&
    !isAsthmaPoorControlVignette(text)
  );
}

function buildAsthmaMonitoringMcq(item: BankItem): BankItem {
  const options = [
    "Rescue inhaler use more than twice per week and home peak expiratory flow trends on a written asthma action plan.",
    "Monthly serum fluticasone trough concentration in mg/mL.",
    "Daily body weight changes unrelated to asthma therapy.",
    "Resting heart rate alone without symptom or peak flow correlation.",
  ] as BankItem["options"];
  const correctAnswer = options[0]!;
  return {
    ...item,
    question: /monitoring parameter|which monitoring/i.test(item.question ?? "")
      ? item.question!
      : "Which monitoring parameter is most critical?",
    options,
    correctAnswer,
    explanation:
      "Correct: Rescue inhaler use more than twice per week and home peak expiratory flow trends — even when asthma seems well controlled, tracking SABA use and peak flow helps detect early loss of control and guides step-up therapy before exacerbations. Serum ICS trough levels are not routine outpatient monitoring. Weight and resting heart rate alone are nonspecific without an asthma action plan context.",
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
  const vignette = resolveNaplexVignette(item);
  const stem = resolveNaplexStem(item);
  if (isAmoxicillinUtiIncompleteDispenseCounselingVignette(vignette, stem)) {
    return buildUtiAmoxicillinCounselingMcq(item);
  }
  if (isPregnancyTopicalAntibioticSafetyCounselingVignette(vignette)) {
    return buildPregnancyTopicalAntibioticCounselingMcq(item);
  }
  if (isHydrocortisoneHydrocodoneAllergyVignette(text)) {
    return buildHydrocortisoneHydrocodoneAllergyMcq(item);
  }
  if (isPenicillinAllergyAmoxicillinCounselingVignette(resolveNaplexVignette(item))) {
    return buildPenicillinAllergyAmoxicillinMcq(item);
  }
  if (isMetforminRenalSafetyVignette(resolveNaplexVignette(item))) {
    return buildMetforminRenalSafetyCounselingMcq(item);
  }
  if (isAnticoagulantBleedingCounselingVignette(resolveNaplexVignette(item))) {
    return buildAnticoagulantBleedingCounselingMcq(item);
  }
  if (isHeartFailureOrthostaticVignette(resolveNaplexVignette(item))) {
    return buildHeartFailureOrthostaticMcq(item);
  }
  if (isHyperkalemiaSpironolactoneVignette(text)) {
    return buildHyperkalemiaSpironolactoneMcq(item);
  }
  if (isDiabetesHypertensionFollowUpVignette(text)) {
    return buildDiabetesHypertensionFollowUpMcq(item);
  }
  if (isNsaidAceInteractionVignette(resolveNaplexVignette(item))) {
    return buildNsaidAceInteractionCounselingMcq(item);
  }
  if (isSepsisRenalAntibioticVignette(resolveNaplexVignette(item))) {
    return buildSepsisIvAntibioticTherapyMcq(item);
  }
  if (
    /hydrocodone|hydromorphone|oxycodone|tramadol|morphine|fentanyl|methadone|opioid|chronic pain/.test(
      text
    ) &&
    /addiction|non-opioid|constipation|dizziness|gabapentin|forget|more frequently|relapse/.test(text)
  ) {
    if (/buprenorphine|suboxone|opioid use disorder|relapse/.test(text)) {
      return buildBuprenorphineOudPainMcq(item);
    }
    if (/forget|forgot|more frequently|missed dose|takes it more|often forgets/.test(text)) {
      const options = [
        "Counsel not to exceed the prescribed maximum daily dose, use a dosing log or pill organizer, and contact the prescriber if pain remains uncontrolled rather than taking extra doses.",
        "Recommend taking an additional opioid dose whenever pain returns early, even if it exceeds the prescribed daily maximum.",
        "Advise stopping gabapentin and ibuprofen so the opioid can be taken more frequently for better pain control.",
        "Suggest doubling the next dose after a missed dose to catch up without contacting the prescriber.",
      ] as BankItem["options"];
      return {
        ...item,
        question: "Which counseling point is most important?",
        options,
        correctAnswer: options[0]!,
        explanation:
          "Correct: Counsel not to exceed the prescribed maximum daily dose and contact the prescriber if pain is uncontrolled — PRN opioids still have maximum daily limits; extra doses increase respiratory depression risk, especially with gabapentin.",
        itemType: "vignette",
        ngnPayload: item.ngnPayload?.kind === "constructed" ? undefined : item.ngnPayload,
      };
    }
    if (/dizziness|confusion|constipation|sedation|somnolence/.test(text)) {
      return buildOpioidCnsSideEffectMcq(item);
    }
  }
  if (
    /buprenorphine|suboxone|naloxone/.test(text) &&
    /opioid use disorder|opioid depend|relapse|mat\b|medication-assisted/.test(text)
  ) {
    return buildBuprenorphineOudPainMcq(item);
  }
  if (/buprenorphine|suboxone/.test(text) && /pain|injury|analges|relapse/.test(text)) {
    return buildBuprenorphineOudPainMcq(item);
  }
  if (
    /\basthma\b/.test(text) &&
    /albuterol|levalbuterol|rescue inhaler|\bsaba\b/.test(text) &&
    /more frequently|worsening symptoms|concerned|poor control|uncontrolled/.test(text) &&
    !/\d+\s*kg\b/.test(text)
  ) {
    return buildPediatricAsthmaRescueOveruseMcq(item);
  }
  if (/albuterol|levalbuterol/.test(text) && /mother asks|proper dosing|technique/.test(text)) {
    return buildAlbuterolInhalerCounseling(item);
  }
  if (/epinephrine|auto-injector|anaphylaxis/.test(text)) {
    return buildEpinephrineCounseling(item);
  }
  if (/amoxicillin|ear infection|suspension|reconstitut/.test(text) && /child|pediatric|year-old|mother|parent/.test(text)) {
    return buildAmoxicillinPediatricCounseling(item);
  }
  if (/asthma|wheezing|rescue inhaler|saba|nighttime|peak flow|controller/.test(text)) {
    if (isAsthmaMonitoringVignette(text)) {
      return buildAsthmaMonitoringMcq(item);
    }
    if (isAsthmaPoorControlVignette(text)) {
      return buildAsthmaPoorControlMcq(item);
    }
    return buildAsthmaControlCounseling(item);
  }
  if (/inhaler|copd|tiotropium|fluticasone|salmeterol|spiriva|technique|demonstrate/.test(text)) {
    return buildGenericInhalerCounseling(item);
  }
  return null;
}

function shouldPreferCounselingRepair(item: BankItem): boolean {
  const vignette = resolveNaplexVignette(item);
  const stem = resolveNaplexStem(item);
  const unit = optionUnit(item.options);
  // Tablet/capsule/rate options with order data belong on a calculation stem — check before clinical MCQ.
  if (unit === "tablet" || unit === "capsule" || unit === "ml/hr") return false;
  if (/\b(?:dispense|Rx:|three times daily|twice daily|every \d+ hours|for \d+ days)\b/i.test(vignette)) {
    return false;
  }
  if (vignetteSupportsCalculation(item)) return false;
  if (CALC_STEM.test(stem) && !calculationContextSupportsStem(item)) return true;
  if (CLINICAL_MCQ_STEM.test(stem) && !CALC_STEM.test(stem)) return true;
  if (COUNSELING_VIGNETTE.test(vignette)) return true;
  return true;
}

function shouldReclassifyNumericOptionsToCalc(item: BankItem): boolean {
  const stem = resolveNaplexStem(item);
  const unit = optionUnit(item.options);
  const vignette = resolveNaplexVignette(item);
  // Bare tablet/capsule counts with an explicit course length are dispense calculations.
  if (
    (unit === "tablet" || unit === "capsule") &&
    /\bfor \d+\s*days?\b|\b\d+\s*-?\s*day\b/i.test(vignette) &&
    /\d+(?:\.\d+)?\s*(?:mg|mcg|g)\b/i.test(vignette)
  ) {
    return true;
  }
  if (CLINICAL_MCQ_STEM.test(stem) && !CALC_STEM.test(stem)) return false;
  if (CALC_STEM.test(stem) && !calculationContextSupportsStem(item)) return false;
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

  if (shouldReclassifyNumericOptionsToCalc(item)) {
    const calc = reclassifyToCalculation(item);
    const afterCalc = detectNaplexFormatIssues(calc);
    if (!afterCalc.some((i) => i.code === "naplex_clinical_stem_numeric_options")) {
      return {
        item: calc,
        changed: true,
        note: `reclassified to calculation stem: ${resolveNaplexStem(calc).slice(0, 60)}…`,
      };
    }
  }

  const fallbackCounseling =
    buildCounselingRepair(item) ?? buildGenericClinicalRecommendationMcq(item);
  return {
    item: fallbackCounseling,
    changed: true,
    note: "fallback counseling rewrite",
  };
}

export function hasClinicalNumericMismatch(item: BankItem): boolean {
  return detectNaplexFormatIssues(item).some((i) => i.code === "naplex_clinical_stem_numeric_options");
}
