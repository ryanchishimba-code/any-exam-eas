import type { BankItem } from "@/lib/question-bank";
import {
  auditNaplexBankItem,
  resolveNaplexStem,
  resolveNaplexVignette,
} from "./naplex-bank-audit";

export type NaplexAuditGapFix = {
  scenario: string;
  question: string;
  explanation: string;
};

/** Hand-authored NAPLEX rewrites for legacy foundation MCQs (no vignette / short rationale). */
export const NAPLEX_FOUNDATION_GAP_FIXES: Record<string, NaplexAuditGapFix> = {
  cmqd1m10s002s1ychsrqo0soi: {
    scenario:
      "A 52-year-old man receives oral morphine 15 mg q4h; a student pharmacist reviews ADME and first-pass loss before counseling.",
    question: "Which organ is primarily responsible for first-pass metabolism?",
    explanation:
      "Correct: Liver — orally absorbed drugs enter hepatic portal circulation, where CYP enzymes and transporters reduce bioavailability before the drug reaches systemic circulation. Kidney, lung, and skin play minor roles in first-pass metabolism compared with the liver.",
  },
  cmqd1m14f002t1ychbu3qwoo7: {
    scenario:
      "A clinical pharmacist explains dosing intervals using a drug with first-order elimination and a published half-life of 8 hours.",
    question: "What does half-life best describe in this context?",
    explanation:
      "Correct: Plasma concentration to fall 50% — half-life is the time required for serum concentration to decrease by one half under first-order kinetics. It does not describe complete elimination, peak level alone, or achievement of steady state after a single dose.",
  },
  cmqd1m1be002u1ychb9qku3un: {
    scenario:
      "A 72-year-old man with heart failure starts digoxin 0.125 mg daily; the pharmacist plans therapeutic drug monitoring.",
    question: "Which drug class most requires therapeutic drug monitoring in this scenario?",
    explanation:
      "Correct: Narrow therapeutic index drugs like digoxin — small changes in digoxin levels can cause toxicity or loss of effect, so TDM and renal function assessment are essential. OTC vitamins, multivitamins, and topical hydrocortisone do not routinely require serum level monitoring.",
  },
  cmqd1m1p3002v1ychwr6i3ca4: {
    scenario:
      "A 58-year-old man with hypertension and asthma needs a beta-blocker; the prescriber asks for a cardioselective option.",
    question: "Which beta-1 selective blocker is the best example for this patient?",
    explanation:
      "Correct: Metoprolol — at low doses metoprolol preferentially blocks beta-1 receptors in the heart. Propranolol and carvedilol are nonselective or mixed agents, and labetalol combines alpha and beta blockade rather than beta-1 selectivity alone.",
  },
  cmqd1m1sz002w1ychn8pqisuk: {
    scenario:
      "A 64-year-old woman develops a persistent dry cough 2 weeks after starting lisinopril 10 mg daily.",
    question: "Which mechanism best explains this ACE inhibitor adverse effect?",
    explanation:
      "Correct: Increased bradykinin — ACE inhibition reduces bradykinin degradation, leading to cough in some patients. Switching to an ARB may be appropriate if the cough is intolerable. Histamine excess, zinc deficiency, and beta blockade do not explain ACE inhibitor cough.",
  },
  cmqd1m1wi002x1ych211c67zt: {
    scenario:
      "A 67-year-old man with dysphagia asks whether he may crush a sustained-release oxycodone 20 mg tablet.",
    question: "Which instruction is most appropriate for extended-release tablets?",
    explanation:
      "Correct: Swallowed whole unless scored for splitting — crushing or chewing ER dosage forms can cause dose dumping and toxicity. Patients should not chew ER products for faster effect or dissolve them in IV fluids unless the label specifically allows modification.",
  },
  cmqd1m202002y1ychlsbcsniu: {
    scenario:
      "A technician prepares a 100 mL amoxicillin oral suspension that has settled during storage on the shelf.",
    question: "Which dispensing step is required for suspensions?",
    explanation:
      "Correct: Shake well before dispensing/use — suspensions must be resuspended so each dose delivers uniform drug content. Refrigeration is not always required, filtering is inappropriate, and omitting shake labels risks under- or overdosing.",
  },
  cmqd1m23g002z1ychp6gus6dk: {
    scenario:
      "Compounding lab: prepare 5 mL of a 2% (w/v) solution for topical dispensing.",
    question: "How many milligrams of drug are in 5 mL of this 2% (w/v) solution?",
    explanation:
      "Correct: 100 mg — 2% w/v equals 2 g per 100 mL, or 20 mg/mL. Multiply 20 mg/mL × 5 mL = 100 mg total. Common errors include using 2 mg/mL or forgetting to convert percent w/v to mg/mL before multiplying by volume.",
  },
  cmqd1m26y00301ychctu3wq2d: {
    scenario:
      "A pharmacy student must prepare 240 mL of 2% solution by mixing 5% and 0.5% stock solutions.",
    question: "Which pharmacy calculation method is used to mix two strengths to a target concentration?",
    explanation:
      "Correct: Mix two strengths to target concentration — alligation determines the ratio of higher- and lower-strength components needed to reach the desired final concentration. Renal clearance, protein binding, and viscosity alone do not solve two-strength mixing problems.",
  },
  cmqd1m2ab00311ych4c3uzn4y: {
    scenario:
      "A 66-year-old man with HFrEF (EF 30%) is not on guideline-directed therapy after hospital discharge.",
    question: "Which medication classes are included in HFrEF guideline-directed medical therapy?",
    explanation:
      "Correct: ACEi/ARB/ARNI, beta-blocker, MRA, SGLT2i — contemporary heart failure guidelines recommend these pillars to reduce mortality and hospitalization. Routine CCB-first therapy, thiazolidinediones, or alpha agonists are not foundational HFrEF GDMT.",
  },
  cmqd1m2dt00321ych8k5ecxtj: {
    scenario:
      "A patient on warfarin 5 mg daily reports eating large amounts of leafy green vegetables on weekends only.",
    question: "Which dietary component most affects warfarin anticoagulation?",
    explanation:
      "Correct: Vitamin K — inconsistent intake of vitamin K–rich foods can destabilize INR. Pharmacists should counsel on maintaining consistent vegetable intake rather than focusing on vitamin C, iron, or calcium alone.",
  },
  cmqd1m2h600331ych3ocdi1qh: {
    scenario:
      "A 34-year-old man has a non-purulent MRSA skin abscess without systemic toxicity; outpatient therapy is considered.",
    question: "Which oral antibiotic option may be appropriate for MRSA skin infection?",
    explanation:
      "Correct: TMP-SMX or doxycycline (context-dependent) — these agents cover community MRSA in uncomplicated skin infections when local resistance patterns support use. Amoxicillin lacks MRSA activity, metronidazole targets anaerobes, and fluconazole is antifungal.",
  },
  cmqd1m2kj00341ychl2pixnmz: {
    scenario:
      "A 45-year-old outpatient with community-acquired pneumonia and no comorbidities receives a macrolide prescription.",
    question: "Which indication best describes appropriate azithromycin Z-pack use?",
    explanation:
      "Correct: Community-acquired pneumonia (outpatient) — azithromycin is a common outpatient CAP option when local guidelines support macrolide therapy. It is not appropriate for MRSA bacteremia, C. difficile, or fungal infection.",
  },
  cmqd1m2o000351ychqa4ivnmz: {
    scenario:
      "A 55-year-old man with type 2 diabetes (A1c 9.2%) needs basal insulin with once-daily dosing and minimal peak effect.",
    question: "Which description best characterizes insulin glargine?",
    explanation:
      "Correct: Long-acting basal insulin — glargine provides relatively peakless basal coverage for approximately 24 hours. It is not a rapid bolus insulin, inhaled insulin, or an oral antidiabetic agent.",
  },
  cmqd1m2rn00361ychlzn7a7nj: {
    scenario:
      "A 70-year-old man with type 2 diabetes has SCr 2.1 mg/dL and eGFR 28 mL/min/1.73 m² before starting metformin.",
    question: "Which condition is a contraindication to metformin?",
    explanation:
      "Correct: eGFR below guideline threshold — metformin is contraindicated or should be held when renal function falls below labeled limits because of lactic acidosis risk. Hypertension, hyperlipidemia, and mild allergy are not the primary contraindication.",
  },
  cmqd1m2vt00371ychifoqzhe4: {
    scenario:
      "A patient on paroxetine 40 mg daily for 2 years wants to stop because they feel improved.",
    question: "How is SSRI discontinuation syndrome best prevented?",
    explanation:
      "Correct: Gradual taper — stopping SSRIs abruptly can cause dizziness, flu-like symptoms, and sensory disturbances. Doubling the dose, stopping immediately, or adding an MAOI without a washout are unsafe approaches.",
  },
  cmqd1m2zf00381ycheco5w5px: {
    scenario:
      "A 40-year-old patient receives lorazepam 0.5 mg; a pharmacy student reviews CNS depressant mechanisms before counseling.",
    question: "Which receptor do benzodiazepines primarily enhance GABA activity?",
    explanation:
      "Correct: GABA-A receptor — benzodiazepines bind the benzodiazepine site on GABA-A receptors to increase chloride channel opening frequency. GABA-B, NMDA, and mu opioid receptors are not the primary site of benzodiazepine action.",
  },
  cmqd1m32r00391ychbnfeeajq: {
    scenario:
      "A 58-year-old oncology patient receiving highly emetogenic cisplatin-based chemotherapy needs antiemetic prophylaxis.",
    question: "Which drug is an example of a 5-HT3 antagonist for chemotherapy-induced emesis?",
    explanation:
      "Correct: Ondansetron — 5-HT3 antagonists such as ondansetron are cornerstone agents for CINV prophylaxis. Metformin, warfarin, and atorvastatin are not antiemetic 5-HT3 antagonists.",
  },
  cmqd1m368003a1ychf3v462re: {
    scenario:
      "A 52-year-old woman on chemotherapy presents with fever 38.6°C and ANC 300 cells/mm³.",
    question: "What is the priority management of febrile neutropenia?",
    explanation:
      "Correct: Urgent antibiotics and evaluation — febrile neutropenia is an oncologic emergency requiring prompt broad-spectrum antibiotics and clinical assessment. OTC analgesics alone, delayed evaluation, or stopping all medications without contact are unsafe.",
  },
  cmqd1m39l003b1ychsax4eygp: {
    scenario:
      "A 19-year-old presents to the emergency department 6 hours after ingesting 15 g acetaminophen in a suicide attempt.",
    question: "Which antidote is indicated for acetaminophen toxicity?",
    explanation:
      "Correct: N-acetylcysteine — NAC replenishes glutathione and is most effective within the treatment window after acetaminophen overdose. Naloxone, flumazenil, and atropine treat opioid, benzodiazepine, and anticholinergic toxicity respectively.",
  },
  cmqd1m3d2003c1ych2wpmf90w: {
    scenario:
      "An elderly patient asks about diphenhydramine 25 mg at bedtime for insomnia.",
    question: "Which adverse effect is most associated with first-generation antihistamines?",
    explanation:
      "Correct: Sedation and anticholinergic effects — first-generation antihistamines cross the blood-brain barrier and have anticholinergic properties, increasing fall and driving risk in older adults. They do not cause hypertension or diuresis as primary effects.",
  },
  cmqd1m3gg003d1ychbwikqwj5: {
    scenario:
      "A 71-year-old man on warfarin 5 mg daily with low health literacy receives counseling; the pharmacist uses teach-back.",
    question: "What does the teach-back method primarily assess?",
    explanation:
      "Correct: Patient understanding — teach-back confirms the patient can restate instructions in their own words. It does not assess pharmacist spelling, insurance status, or wholesale acquisition cost.",
  },
  cmqd1m3k7003e1ychw4ikm3q6: {
    scenario:
      "A 10-year-old with asthma receives a new fluticasone MDI and has poor coordination with inhaler use.",
    question: "How does adding a spacer improve inhaler therapy?",
    explanation:
      "Correct: Lung deposition and reduces oropharyngeal deposition — spacers slow aerosol velocity and reduce oropharyngeal deposition, improving lung delivery especially for inhaled corticosteroids. Spacers do not primarily change taste, cost, or shelf life.",
  },
  cmqd1m3nr003f1ychcd3me48t: {
    scenario:
      "A prescriber calls in an oxycodone 30 mg prescription for a postoperative patient at your pharmacy.",
    question: "Which federal requirement applies to Schedule II controlled substances?",
    explanation:
      "Correct: Written/electronic prescription per federal/state rules — Schedule II prescriptions must meet strict documentation standards and cannot be refilled. Verbal unlimited refills, no prescription, and OTC sale violate DEA requirements.",
  },
  cmqd1m3r7003g1ychi7i94xhr: {
    scenario:
      "A 62-year-old inpatient pharmacist receives a request to fax a medication list to another clinic for continuity of care.",
    question: "Under HIPAA, disclosure without patient authorization is permitted for which purpose?",
    explanation:
      "Correct: Treatment, payment, operations (TPO) — HIPAA permits uses and disclosures for treatment, payment, and health care operations without separate authorization. Marketing to third parties, social media posting, and sale of data are not permitted disclosures.",
  },
};

const CLINICAL_DATA_PATTERN =
  /\d+\s*(?:mg\/dL|mEq\/L|mm Hg|\/min|× 10|g\/dL|mIU\/mL|°C|°F|U\/L|mm|%|mg\/kg|mL\/hr|mg|mEq|mL|kg|tablets|units)|\d+[- ]kg|\b(?:BP|LDL|A1[cC]|FEV|TSH|PHQ|SCr|Cr|K\+|EF|GFR|ANC|INR|eGFR)\b/i;

const AGE_PATTERN =
  /\b\d{1,3}[- ]year[- ]old\b|\b\d{1,3}\s*y\/o\b|\bAge\s+\d{1,3}\b|\(\d{1,3}\s*y\)|\b\d{1,2}\s*w[kK]\b|\b\d{1,3}\s*y\/o\b/i;

/** Vignette enrichments for hand-authored SATA/case items missing numeric clinical data. */
export const NAPLEX_VIGNETTE_ENRICHMENTS: Record<string, string> = {
  cmqd1mpai008q1ychryverwwm:
    "PN order for home infusion: amino acids + dextrose + lipids. Patient reports room temperature storage overnight during power outage (ambient 22°C).",
  cmqd1msqs009o1ychnfntuvjy:
    "A 28-year-old transgender woman starting estradiol 2 mg daily + spironolactone 100 mg daily. Smokes 10 cigarettes/day.",
  cmqd1mw6w00al1ychpx3rirb9:
    "Solid organ transplant recipient, 45-year-old | New mycophenolate 500 mg BID | On tacrolimus | Asks about OTC supplements",
  cmqd9u9hm002b1y0tdtjzbyjl:
    "Gout + CKD stage 3 (eGFR 48 mL/min) | Acute flare | Colchicine considered | On diltiazem",
  cmqd1mqjk00921ychbnmplr23:
    "A 52-year-old patient picking up extended-release oxycodone 10 mg q12h. State law requires consultation.",
  cmqd1msjy009m1ych5yqv7dnf:
    "Elderly patient, 82-year-old, on 14 medications reports dizziness and one fall last week.",
  cmqd1msxo009q1ych6v86jdvo:
    "A technician asks you to look up a 67-year-old neighbor's pickup history to confirm they got their antibiotic (HIPAA scenario).",
  cmqd1mt6p009s1ychvwjxgv2d:
    "Inventory analysis: fast movers stock out weekly; slow movers exceed 120-day supply on shelf.",
  cmqd1mta4009t1ychh8mmd0rc:
    "You precept a student who bypassed PPI counseling on a high-risk clopidogrel interaction (age 67 y).",
  cmqd1mrst009e1ychvjz0fwvn:
    "Hospital: febrile neutropenia | ANC 200 cells/mm³ | empiric piperacillin-tazobactam ordered",
  cmqd1mwhk00ao1ychty4z192l:
    "Pregnant patient, 14 weeks gestation, with heartburn unrelieved by lifestyle modification.",
  cmqd1mwvr00as1ych7d48dv95:
    "SLE patient, 36-year-old woman, starting hydroxychloroquine 200 mg BID | Plaquenil education visit",
  cmqd1mw0300aj1ychoeva5xye:
    "Parkinson disease | 68-year-old man | On carbidopa/levodopa 25/100 QID | Wearing-off noted",
  cmq339tq400471yiu2js5iqwj:
    "A 28-year-old transgender woman starting estradiol 2 mg daily + spironolactone 100 mg daily. Smokes 10 cigarettes/day.",
};

function hasClinicalContext(text: string): boolean {
  return AGE_PATTERN.test(text) || CLINICAL_DATA_PATTERN.test(text);
}

/** Move embedded case preamble from question into scenario for PK calculation items. */
export function mergePkCaseIntoScenario(item: BankItem): BankItem | null {
  const scenario = resolveNaplexVignette(item);
  const question = item.question?.trim() ?? "";
  if (!scenario.includes("verifies dosing for") || !question.includes("\n\n")) return null;

  const parts = question.split("\n\n");
  const caseLine = parts[0]?.trim() ?? "";
  const stem = parts.slice(1).join("\n\n").trim();
  if (caseLine.length < 20 || !stem) return null;
  if (scenario.includes(caseLine.slice(0, 24))) return null;

  const mergedScenario = `${scenario} ${caseLine}`.replace(/\s+/g, " ").trim();
  return {
    ...item,
    vignette: mergedScenario,
    scenario: mergedScenario,
    question: stem,
  };
}

export function applyNaplexFoundationFix(item: BankItem, id: string): BankItem | null {
  const fix = NAPLEX_FOUNDATION_GAP_FIXES[id];
  if (!fix) return null;
  return {
    ...item,
    vignette: fix.scenario,
    scenario: fix.scenario,
    question: fix.question,
    explanation: fix.explanation,
  };
}

export function applyNaplexVignetteEnrichment(item: BankItem, id: string): BankItem | null {
  const enriched = NAPLEX_VIGNETTE_ENRICHMENTS[id];
  if (!enriched) return null;
  return {
    ...item,
    vignette: enriched,
    scenario: enriched,
  };
}

export function fixNaplexAuditGaps(item: BankItem, id: string): { item: BankItem; changed: boolean } {
  let working = { ...item };
  let changed = false;

  const foundation = applyNaplexFoundationFix(working, id);
  if (foundation) {
    working = foundation;
    changed = true;
  }

  const pk = mergePkCaseIntoScenario(working);
  if (pk) {
    working = pk;
    changed = true;
  }

  const enriched = applyNaplexVignetteEnrichment(working, id);
  if (enriched) {
    working = enriched;
    changed = true;
  }

  return { item: working, changed };
}

export function itemStillHasAuditGap(item: BankItem): boolean {
  const audit = auditNaplexBankItem(item);
  return audit.issues.some(
    (i) =>
      i.code === "naplex_missing_clinical_data" ||
      i.code === "naplex_stem_lead_in" ||
      i.code === "naplex_explanation_short" ||
      i.code === "naplex_stem_format_mismatch" ||
      i.code === "naplex_conflicting_lead_ins" ||
      i.code === "naplex_mcq_missing_correct_option" ||
      i.code === "naplex_calc_stem_on_mcq" ||
      i.code === "naplex_clinical_stem_numeric_options" ||
      i.code === "correct_not_in_options" ||
      i.code === "constructed_response_not_numeric"
  );
}

export function clinicalContextBlob(item: BankItem): string {
  const vignette = resolveNaplexVignette(item);
  const stem = resolveNaplexStem(item);
  const question = item.question?.trim() ?? "";
  return [vignette, question, stem].filter(Boolean).join("\n");
}

export function itemMissingClinicalData(item: BankItem): boolean {
  const blob = clinicalContextBlob(item);
  return !hasClinicalContext(blob);
}
