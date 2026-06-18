import type { BankItem } from "./question-bank";
import type { SubjectArea } from "./subjects/types";
import { TOP_500_DRUGS } from "./drugs300/catalog";
import { polishNaplexBankItem } from "./engine/polish/naplex-polish";
import { polishNclexBankItem } from "./engine/polish/nclex-polish";
import { polishUsmleBankItem } from "./engine/polish/usmle-polish";
import { polishMpjeBankItem } from "./engine/polish/mpje-polish";
import { formatClinicalVignette } from "./engine/prompts/vignette";
import {
  normalizeUsmleBankItemFields,
  usmleBankItemHasClinicalScenario,
} from "./exam-prep/usmle-clinical-gate";

/** @deprecated Use SubjectArea */
type FieldSubject = SubjectArea;

/** Minimum active MCQs required per field + subject area. */
export const MIN_QUESTIONS_PER_SUBJECT = 2000;

const AGES = [
  2, 4, 6, 8, 11, 14, 17, 19, 22, 25, 28, 31, 34, 37, 40, 43, 46, 49, 52, 55, 58, 61, 64, 67, 70,
  73, 76, 79, 82, 85,
];

const SEXES = ["male", "female", "nonbinary adult"] as const;

const SETTINGS = [
  "emergency department",
  "primary care clinic",
  "inpatient ward",
  "ICU",
  "outpatient specialty clinic",
  "urgent care",
  "preoperative holding area",
  "post-anesthesia care unit",
  "labor and delivery",
  "pediatric clinic",
];

const SYMPTOMS = [
  "chest pain",
  "shortness of breath",
  "fever",
  "altered mental status",
  "abdominal pain",
  "syncope",
  "weakness",
  "rash",
  "headache",
  "cough",
  "nausea",
  "palpitations",
  "edema",
  "hematuria",
  "joint swelling",
  "back pain",
  "sore throat",
  "dizziness",
  "weight loss",
  "polyuria",
];

const LABS = [
  "hyponatremia",
  "hyperkalemia",
  "metabolic acidosis",
  "respiratory alkalosis",
  "elevated troponin",
  "leukocytosis",
  "anemia",
  "thrombocytopenia",
  "elevated creatinine",
  "elevated ALT",
  "positive blood cultures",
  "elevated D-dimer",
  "low bicarbonate",
  "hyperglycemia",
  "hypoglycemia",
];

const NURSING_CLIENTS = [
  "postoperative day 1 after cholecystectomy",
  "new admission with COPD exacerbation",
  "client receiving chemotherapy with neutropenia",
  "pregnant client at 38 weeks with decreased fetal movement",
  "adolescent with new-onset type 1 diabetes",
  "older adult with hip fracture and delirium",
  "client with active suicidal ideation",
  "client on continuous heparin infusion",
  "client with stage IV pressure injury",
  "client reporting domestic violence",
];

const DRUG_CLASSES = [
  "ACE inhibitor",
  "beta-blocker",
  "loop diuretic",
  "statin",
  "PPI",
  "SSRI",
  "antipsychotic",
  "insulin",
  "oral hypoglycemic",
  "anticoagulant",
  "antiplatelet",
  "bronchodilator",
  "inhaled corticosteroid",
  "opioid",
  "benzodiazepine",
  "antibiotic",
  "antiviral",
  "antifungal",
  "chemotherapy agent",
  "antiemetic",
];

function pick<T>(arr: readonly T[], index: number, salt = 0): T {
  return arr[(index + salt) % arr.length]!;
}

function fourOptions(
  correct: string,
  wrongs: [string, string, string],
  correctSlot: number
): [string, string, string, string] {
  const options: string[] = ["", "", "", ""];
  options[correctSlot % 4] = correct;
  let w = 0;
  for (let i = 0; i < 4; i++) {
    if (i !== correctSlot % 4) options[i] = wrongs[w++]!;
  }
  return options as [string, string, string, string];
}

function item(
  subjectId: string,
  question: string,
  options: [string, string, string, string],
  correctAnswer: string,
  explanation: string,
  tags: string[] = ["generated", "bulk-bank"]
): BankItem {
  return { subjectId, question, options, correctAnswer, explanation, tags };
}

function expandConcepts(subject: FieldSubject): string[] {
  const fromHints = subject.examHints.split(/[,;]+/).map((s) => s.trim());
  const merged = [...subject.keywords, ...fromHints, subject.label];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const c of merged) {
    const concept = c?.trim();
    if (!concept) continue;
    const key = concept.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(concept);
  }
  return out;
}

function medicineVignette(params: {
  age: number;
  sex: string;
  setting: string;
  symptom: string;
  concept: string;
  lab: string;
  index: number;
}): string {
  return formatClinicalVignette({
    age: params.age,
    sex: params.sex,
    setting: params.setting,
    chiefComplaint: `${params.symptom} worsening over 24 hours`,
    history: `Past medical history is significant for risk factors related to ${params.concept}. Current medications and allergies are reviewed.`,
    exam: `Vitals are notable for findings consistent with ${params.symptom}; focused exam supports ${params.concept}`,
    labs: `${params.lab}; additional studies pending`,
  });
}

function buildMedicineQuestion(subject: FieldSubject, index: number, fieldId: string): BankItem {
  const concepts = expandConcepts(subject);
  const concept = pick(concepts, index, 3);
  const age = pick(AGES, index, 1);
  const sex = pick(SEXES, index, 2);
  const setting = pick(SETTINGS, index, 4);
  const symptom = pick(SYMPTOMS, index, 5);
  const lab = pick(LABS, index, 6);
  const template = index % 8;
  const slot = index % 4;
  const vignette = medicineVignette({ age, sex, setting, symptom, concept, lab, index });

  let seed: BankItem;

  switch (template) {
    case 0: {
      const correct = `Focused ${concept} evaluation with targeted history and exam`;
      const q = `${vignette}\n\nWhich initial approach is most appropriate for suspected ${concept}?`;
      seed = item(
        subject.id,
        q,
        fourOptions(
          correct,
          [
            "Defer all assessment until imaging is completed",
            "Treat unrelated symptoms without evaluation",
            "Discharge without vital signs or documentation",
          ],
          slot
        ),
        correct,
        `${subject.label}: ${concept} requires structured assessment (${subject.textbookRefs}).`
      );
      break;
    }
    case 1: {
      const correct = `${lab} consistent with the leading diagnosis`;
      const q = `${vignette}\n\nWhich laboratory interpretation is most accurate for this presentation?`;
      seed = item(
        subject.id,
        q,
        fourOptions(
          correct,
          [
            "Normal variant requiring no follow-up in every patient",
            "Artifact that invalidates all clinical findings",
            "Unrelated to the presenting problem in all cases",
          ],
          slot
        ),
        correct,
        `Integrate ${lab} with clinical context for ${concept} (${subject.examHints}).`
      );
      break;
    }
    case 2: {
      const correct = `Pathophysiology of ${concept} explains the dominant finding`;
      const q = `${vignette}\n\nWhich pathophysiologic process is most likely responsible for this patient's presentation?`;
      seed = item(
        subject.id,
        q,
        fourOptions(
          correct,
          [
            "Random symptom association without mechanism",
            "Only psychological causes in all patients",
            "Exclusive nutritional deficiency in every case",
          ],
          slot
        ),
        correct,
        `Mechanism-based teaching for ${concept} (${subject.textbookRefs}).`
      );
      break;
    }
    case 3: {
      const correct = `Order the test that directly clarifies ${concept}`;
      const q = `${vignette}\n\nWhich diagnostic step is most appropriate next?`;
      seed = item(
        subject.id,
        q,
        fourOptions(
          correct,
          [
            "Broad unguided testing unrelated to the presentation",
            "Delay evaluation for 6 months in unstable patients",
            "Rely only on family history without examination",
          ],
          slot
        ),
        correct,
        `Evidence-aligned workup for ${subject.label} (${subject.examHints}).`
      );
      break;
    }
    case 4: {
      const correct = `First-line therapy targeting ${concept}`;
      const q = `${vignette}\n\nWhich management approach is most appropriate?`;
      seed = item(
        subject.id,
        q,
        fourOptions(
          correct,
          [
            "Withhold all treatment until subspecialty referral in 1 year",
            "Use contraindicated therapy for unrelated conditions",
            "Ignore guideline-directed therapy",
          ],
          slot
        ),
        correct,
        `Therapeutic approach for ${concept} in ${subject.label}.`
      );
      break;
    }
    case 5: {
      const correct = `Recognize complication linked to ${concept}`;
      const q = `${vignette}\n\nWhich complication should be highest on the differential?`;
      seed = item(
        subject.id,
        q,
        fourOptions(
          correct,
          [
            "Benign finding never associated with morbidity",
            "Unrelated diagnosis from a different organ system only",
            "Normal postoperative course in all settings",
          ],
          slot
        ),
        correct,
        `Monitor for complications when managing ${concept}.`
      );
      break;
    }
    case 6: {
      const correct = `Patient safety measure specific to ${concept}`;
      const q = `${vignette}\n\nWhich safety consideration is most relevant for this patient?`;
      seed = item(
        subject.id,
        q,
        fourOptions(
          correct,
          [
            "Skip infection prevention in all cases",
            "Avoid documenting allergies and medications",
            "Ignore fall risk in every patient",
          ],
          slot
        ),
        correct,
        `Safety and quality care for ${subject.label} topics.`
      );
      break;
    }
    default: {
      const correct = `Apply guideline-based management principles for ${concept}`;
      const q = `${vignette}\n\nWhich principle should guide this patient's management?`;
      seed = item(
        subject.id,
        q,
        fourOptions(
          correct,
          [
            `Disregard established guidelines for ${concept}`,
            `Base the decision on a single unrelated symptom`,
            `Defer all clinical reasoning to patient preference alone`,
          ],
          slot
        ),
        correct,
        `Aligned with ${subject.textbookRefs} and ${subject.examHints}.`
      );
    }
  }

  let polished = polishUsmleBankItem(seed, fieldId, subject.id, subject.label, index).item;
  let normalized = normalizeUsmleBankItemFields(polished);
  if (!usmleBankItemHasClinicalScenario(normalized)) {
    polished = polishUsmleBankItem(seed, fieldId, subject.id, subject.label, index + 997).item;
    normalized = normalizeUsmleBankItemFields(polished);
  }
  return normalized;
}

function buildNursingQuestion(subject: FieldSubject, index: number): BankItem {
  const concepts = expandConcepts(subject);
  const concept = pick(concepts, index, 7);
  const client = pick(NURSING_CLIENTS, index, 8);
  const template = index % 7;
  const slot = index % 4;

  let seed: BankItem;

  switch (template) {
    case 0: {
      const correct = `Unstable airway, breathing, or circulation related to ${concept}`;
      const q = `NCLEX ${index + 1}: Four clients are assigned to you. Which client should be assessed first based on ${concept}?`;
      seed = item(
        subject.id,
        q,
        fourOptions(
          correct,
          [
            "Stable client requesting discharge teaching only",
            "Client with scheduled routine screening in 2 weeks",
            "Client with chronic stable pain rated 2/10",
          ],
          slot
        ),
        correct,
        `NCLEX prioritization: address life-threatening problems first (${subject.contentArea}).`
      );
      break;
    }
    case 1: {
      const correct = `Delegate only tasks within scope; RN retains accountability for ${concept}`;
      const q = `NCLEX ${index + 1}: The RN delegates tasks for a ${client}. Which action related to ${concept} is appropriate to delegate to unlicensed assistive personnel?`;
      seed = item(
        subject.id,
        q,
        fourOptions(
          correct,
          [
            "Initial comprehensive assessment for unstable chest pain",
            "Teaching a new insulin self-administration technique",
            "Triage decisions for four newly admitted clients",
          ],
          slot
        ),
        correct,
        `Delegation rules for ${subject.label} (${subject.examHints}).`
      );
      break;
    }
    case 2: {
      const correct = `Standard precautions plus transmission-based precautions when indicated for ${concept}`;
      const q = `NCLEX ${index + 1}: Which infection control measure is most appropriate for ${concept}?`;
      seed = item(
        subject.id,
        q,
        fourOptions(
          correct,
          [
            "Reuse single-dose vials on multiple clients",
            "Skip hand hygiene between clients",
            "Store clean and soiled supplies together",
          ],
          slot
        ),
        correct,
        `Safety & infection control: ${subject.textbookRefs}.`
      );
      break;
    }
    case 3: {
      const correct = `Therapeutic communication supporting ${concept}`;
      const q = `NCLEX ${index + 1}: A client with ${client} expresses anxiety about ${concept}. Which nurse response is most therapeutic?`;
      seed = item(
        subject.id,
        q,
        fourOptions(
          correct,
          [
            "You shouldn't feel that way; others have it worse",
            "Let's not talk about that right now",
            "I'll tell the physician you are overreacting",
          ],
          slot
        ),
        correct,
        `Psychosocial integrity and communication (${subject.examHints}).`
      );
      break;
    }
    case 4: {
      const correct = `Verify rights, dose, route, time, and client for ${concept}`;
      const q = `NCLEX ${index + 1}: Before medication administration involving ${concept}, which nursing action is essential?`;
      seed = item(
        subject.id,
        q,
        fourOptions(
          correct,
          [
            "Administer without checking allergies",
            "Use another client's medication if convenient",
            "Skip documentation to save time",
          ],
          slot
        ),
        correct,
        `Pharmacological therapies: safe medication administration.`
      );
      break;
    }
    case 5: {
      const correct = `Teach-back to confirm understanding of ${concept}`;
      const q = `NCLEX ${index + 1}: Discharge teaching for ${client} includes ${concept}. Which method best evaluates learning?`;
      seed = item(
        subject.id,
        q,
        fourOptions(
          correct,
          [
            "Assume understanding if the client nods",
            "Provide only written materials in a language the client does not read",
            "Avoid allowing questions",
          ],
          slot
        ),
        correct,
        `Health promotion and patient education (${subject.label}).`
      );
      break;
    }
    default: {
      const correct = `Evidence-based nursing intervention for ${concept}`;
      const q = `NCLEX ${index + 1}: Which nursing intervention best supports ${concept} for a client with ${client}?`;
      seed = item(
        subject.id,
        q,
        fourOptions(
          correct,
          [
            "Delay intervention until all other clients are discharged",
            "Ignore provider orders and institutional policies",
            "Withhold comfort measures in all situations",
          ],
          slot
        ),
        correct,
        `${subject.contentArea}: ${subject.examHints}.`
      );
    }
  }

  return polishNclexBankItem(seed, subject.id, subject.label, index).item;
}

function buildPharmacyQuestion(subject: FieldSubject, index: number): BankItem {
  const drug = TOP_500_DRUGS[index % TOP_500_DRUGS.length]!;
  const concept = pick(expandConcepts(subject), index, 9);
  const template = index % 7;
  const slot = index % 4;

  let seed: BankItem;

  switch (template) {
    case 0: {
      const dose = 2 + (index % 8);
      const weight = 55 + (index % 35);
      const correct = `${dose * weight} mg/day in divided doses`;
      seed = item(
        subject.id,
        `NAPLEX ${index + 1}: Calculate ${drug.generic} at ${dose} mg/kg/day for a ${weight}-kg patient with ${concept}. Which total daily dose is correct?`,
        fourOptions(
          correct,
          [`${dose} mg once daily regardless of weight`, `${weight} mg daily`, `${(dose + weight).toFixed(0)} mg every 12 hours`],
          slot
        ),
        correct,
        `Pharmacy calculations for ${drug.generic} (${subject.label}).`
      );
      break;
    }
    case 1:
      seed = item(
        subject.id,
        `NAPLEX ${index + 1}: Which mechanism of action best describes how ${drug.generic} supports management of ${concept}?`,
        fourOptions(
          `${drug.generic} mechanism relevant to ${concept}`,
          ["No receptor interaction in any tissue", "Identical effect to unrelated drug class in all cases", "Contraindicated mechanism for this indication"],
          slot
        ),
        `${drug.generic} mechanism relevant to ${concept}`,
        `Pharmacology: ${subject.textbookRefs}.`
      );
      break;
    case 2:
      seed = item(
        subject.id,
        `NAPLEX ${index + 1}: A patient on ${drug.generic} starts a new medication for ${concept}. What is the priority pharmacist action?`,
        fourOptions(
          `Monitor for interaction between ${drug.generic} and concurrent therapy for ${concept}`,
          ["Ignore the new prescription", "Recommend doubling both drugs without review", "Discontinue all chronic medications permanently"],
          slot
        ),
        `Monitor for interaction between ${drug.generic} and concurrent therapy for ${concept}`,
        `Drug interaction screening (${subject.label}).`
      );
      break;
    case 3:
      seed = item(
        subject.id,
        `NAPLEX ${index + 1}: Which counseling point is most important for ${drug.generic} used in ${concept}?`,
        fourOptions(
          `Counsel on adherence, adverse effects, and monitoring for ${concept}`,
          ["Stop therapy without informing the prescriber if any question arises", "Share medication with family members with similar symptoms", "Skip monitoring labs in all patients"],
          slot
        ),
        `Counsel on adherence, adverse effects, and monitoring for ${concept}`,
        `Patient counseling (${subject.examHints}).`
      );
      break;
    case 4:
      seed = item(
        subject.id,
        `NAPLEX ${index + 1}: Which adverse effect should be highlighted when dispensing ${drug.generic} for ${concept}?`,
        fourOptions(
          `Recognize serious adverse effect linked to ${drug.generic}`,
          ["Mild taste change that never requires action", "Beneficial effect requiring no monitoring", "Effect that only occurs with placebo"],
          slot
        ),
        `Recognize serious adverse effect linked to ${drug.generic}`,
        `Safety monitoring for ${subject.label}.`
      );
      break;
    case 5:
      seed = item(
        subject.id,
        `NAPLEX ${index + 1}: Which professional practice standard applies when dispensing controlled medications related to ${drug.generic} and ${concept}?`,
        fourOptions(
          `Verify indication, dose, and legal requirements for ${concept}`,
          ["Unlimited refills without documentation", "Share prescription data publicly", "Bypass inventory controls"],
          slot
        ),
        `Verify indication, dose, and legal requirements for ${concept}`,
        `Pharmacy law & ethics (${subject.textbookRefs}).`
      );
      break;
    default:
      seed = item(
        subject.id,
        `NAPLEX ${index + 1}: Which therapeutic choice is most appropriate for ${concept} using ${drug.generic} per guideline-based pharmacy practice?`,
        fourOptions(
          `Select therapy class appropriate for ${concept}`,
          ["Therapy with no evidence for the indication", "Dose above maximum labeled without justification", "Avoid all monitoring parameters"],
          slot
        ),
        `Select therapy class appropriate for ${concept}`,
        `${subject.contentArea}: ${subject.examHints}.`
      );
  }

  return polishNaplexBankItem(seed, subject.id, subject.label, index).item;
}

function buildMpjeQuestion(subject: FieldSubject, index: number): BankItem {
  const concept = pick(expandConcepts(subject), index, 7);
  const slot = index % 4;
  const templates = [
    `MPJE ${index + 1}: A pharmacist at a community pharmacy receives a questionable controlled substance prescription related to ${concept}. What is the required legal action?`,
    `MPJE ${index + 1}: Which federal or state regulation governs ${concept} in this pharmacy practice scenario?`,
    `MPJE ${index + 1}: A board inspector identifies a potential violation involving ${concept}. What standard applies?`,
    `MPJE ${index + 1}: A patient requests confidential prescription information regarding ${concept}. Which privacy rule controls disclosure?`,
    `MPJE ${index + 1}: A pharmacy technician's action raises a scope-of-practice concern about ${concept}. What is the pharmacist's legal obligation?`,
  ];
  const stem = templates[index % templates.length]!;

  const seed: BankItem = item(
    subject.id,
    stem,
    fourOptions(
      `Apply the governing pharmacy law and board standard for ${concept}`,
      [
        "Ignore federal and state requirements when the prescriber insists",
        "Allow technicians to perform all pharmacist duties without supervision",
        "Share patient records with any requesting party without authorization",
      ],
      slot
    ),
    `Apply the governing pharmacy law and board standard for ${concept}`,
    `MPJE jurisprudence: ${subject.textbookRefs}.`
  );

  return polishMpjeBankItem(seed, subject.id, subject.label, index, {
    variant: "uniform",
  }).item;
}

export function buildBulkQuestion(
  fieldId: string,
  subject: FieldSubject,
  index: number
): BankItem {
  switch (fieldId) {
    case "nursing":
      return buildNursingQuestion(subject, index);
    case "pharmacy":
      return buildPharmacyQuestion(subject, index);
    case "pance":
      return buildMedicineQuestion(subject, index, fieldId);
    case "aanp-fnp":
      return buildMedicineQuestion(subject, index, fieldId);
    case "npte-pt":
      return buildMedicineQuestion(subject, index, fieldId);
    case "usmle-step-1":
    case "usmle-step-2":
      return buildMedicineQuestion(subject, index, fieldId);
    case "medicine":
    default:
      return buildMedicineQuestion(subject, index, fieldId);
  }
}

/** Generate exactly `count` unique bulk items starting at `startIndex`. */
export function generateBulkQuestionsForSubject(
  fieldId: string,
  subject: FieldSubject,
  startIndex: number,
  count: number
): BankItem[] {
  const items: BankItem[] = [];
  for (let i = 0; i < count; i++) {
    items.push(buildBulkQuestion(fieldId, subject, startIndex + i));
  }
  return items;
}
