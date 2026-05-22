import type { BankItem } from "./question-bank";
import type { FieldSubject } from "./field-subjects";

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
  const out: string[] = [];
  for (const c of merged) {
    if (!c) continue;
    out.push(c);
    out.push(`${c} assessment`);
    out.push(`${c} management`);
    out.push(`${c} complications`);
    out.push(`${c} prevention`);
  }
  return out;
}

function buildMedicineQuestion(subject: FieldSubject, index: number): BankItem {
  const concepts = expandConcepts(subject);
  const concept = pick(concepts, index, 3);
  const age = pick(AGES, index, 1);
  const sex = pick(SEXES, index, 2);
  const setting = pick(SETTINGS, index, 4);
  const symptom = pick(SYMPTOMS, index, 5);
  const lab = pick(LABS, index, 6);
  const template = index % 8;
  const slot = index % 4;

  switch (template) {
    case 0: {
      const correct = `Focused ${concept} evaluation with targeted history and exam`;
      const q = `Case ${index + 1}: A ${age}-year-old ${sex} in the ${setting} reports ${symptom}. Which initial approach is most appropriate for suspected ${concept}?`;
      return item(
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
    }
    case 1: {
      const correct = `${lab} consistent with the leading diagnosis`;
      const q = `Case ${index + 1}: During workup for ${concept} in ${subject.label}, labs show ${lab}. Which interpretation is most accurate?`;
      return item(
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
    }
    case 2: {
      const correct = `Pathophysiology of ${concept} explains the dominant finding`;
      const q = `Case ${index + 1}: A student reviewing ${subject.label} asks why ${symptom} may occur in ${concept}. Which explanation is best?`;
      return item(
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
    }
    case 3: {
      const correct = `Order the test that directly clarifies ${concept}`;
      const q = `Case ${index + 1}: Which diagnostic step is most appropriate next for ${concept} when ${symptom} is the chief concern?`;
      return item(
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
    }
    case 4: {
      const correct = `First-line therapy targeting ${concept}`;
      const q = `Case ${index + 1}: Stable ${sex} with ${concept}-related ${symptom}. Which management principle is most appropriate?`;
      return item(
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
    }
    case 5: {
      const correct = `Recognize complication linked to ${concept}`;
      const q = `Case ${index + 1}: A hospitalized patient with ${concept} develops worsening ${symptom}. Which complication should be highest on the differential?`;
      return item(
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
    }
    case 6: {
      const correct = `Patient safety measure specific to ${concept}`;
      const q = `Case ${index + 1}: Which safety consideration is most relevant when caring for a patient with ${concept}?`;
      return item(
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
    }
    default: {
      const correct = `High-yield fact about ${concept} in ${subject.label}`;
      const q = `Case ${index + 1}: Which statement about ${concept} is most accurate for ${subject.label} board preparation?`;
      return item(
        subject.id,
        q,
        fourOptions(
          correct,
          [
            `Outdated practice no longer taught for ${concept}`,
            `Confuses ${concept} with an unrelated discipline`,
            `Opposite of established ${concept} principles`,
          ],
          slot
        ),
        correct,
        `Aligned with ${subject.textbookRefs} and ${subject.examHints}.`
      );
    }
  }
}

function buildNursingQuestion(subject: FieldSubject, index: number): BankItem {
  const concepts = expandConcepts(subject);
  const concept = pick(concepts, index, 7);
  const client = pick(NURSING_CLIENTS, index, 8);
  const template = index % 7;
  const slot = index % 4;

  switch (template) {
    case 0: {
      const correct = `Unstable airway, breathing, or circulation related to ${concept}`;
      const q = `NCLEX ${index + 1}: Four clients are assigned to you. Which client should be assessed first based on ${concept}?`;
      return item(
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
    }
    case 1: {
      const correct = `Delegate only tasks within scope; RN retains accountability for ${concept}`;
      const q = `NCLEX ${index + 1}: The RN delegates tasks for a ${client}. Which action related to ${concept} is appropriate to delegate to unlicensed assistive personnel?`;
      return item(
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
    }
    case 2: {
      const correct = `Standard precautions plus transmission-based precautions when indicated for ${concept}`;
      const q = `NCLEX ${index + 1}: Which infection control measure is most appropriate for ${concept}?`;
      return item(
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
    }
    case 3: {
      const correct = `Therapeutic communication supporting ${concept}`;
      const q = `NCLEX ${index + 1}: A client with ${client} expresses anxiety about ${concept}. Which nurse response is most therapeutic?`;
      return item(
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
    }
    case 4: {
      const correct = `Verify rights, dose, route, time, and client for ${concept}`;
      const q = `NCLEX ${index + 1}: Before medication administration involving ${concept}, which nursing action is essential?`;
      return item(
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
    }
    case 5: {
      const correct = `Teach-back to confirm understanding of ${concept}`;
      const q = `NCLEX ${index + 1}: Discharge teaching for ${client} includes ${concept}. Which method best evaluates learning?`;
      return item(
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
    }
    default: {
      const correct = `Evidence-based nursing intervention for ${concept}`;
      const q = `NCLEX ${index + 1}: Which nursing intervention best supports ${concept} for a client with ${client}?`;
      return item(
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
}

function buildPharmacyQuestion(subject: FieldSubject, index: number): BankItem {
  const concepts = expandConcepts(subject);
  const concept = pick(concepts, index, 9);
  const drug = pick(DRUG_CLASSES, index, 10);
  const template = index % 7;
  const slot = index % 4;

  switch (template) {
    case 0: {
      const dose = 5 + (index % 45) * 2;
      const weight = 50 + (index % 35);
      const correct = `${(dose * weight).toFixed(0)} mg daily in divided doses per protocol`;
      const q = `NAPLEX ${index + 1}: Calculate a weight-based dose of ${dose} mg/kg/day for a ${weight}-kg patient receiving therapy for ${concept}. Which total daily dose is correct?`;
      return item(
        subject.id,
        q,
        fourOptions(
          correct,
          [`${dose} mg once daily regardless of weight`, `${weight} mg daily`, `${(dose + weight).toFixed(0)} mg every 12 hours`],
          slot
        ),
        correct,
        `Pharmacy calculations for ${subject.label} (${subject.examHints}).`
      );
    }
    case 1: {
      const correct = `${drug} mechanism relevant to ${concept}`;
      const q = `NAPLEX ${index + 1}: Which mechanism of action best describes how ${drug} supports management of ${concept}?`;
      return item(
        subject.id,
        q,
        fourOptions(
          correct,
          [
            "No receptor interaction in any tissue",
            "Identical effect to unrelated drug class in all cases",
            "Contraindicated mechanism for this indication",
          ],
          slot
        ),
        correct,
        `Pharmacology: ${subject.textbookRefs}.`
      );
    }
    case 2: {
      const correct = `Monitor for interaction between ${drug} and concurrent therapy for ${concept}`;
      const q = `NAPLEX ${index + 1}: A patient on ${drug} starts a new medication for ${concept}. What is the priority pharmacist action?`;
      return item(
        subject.id,
        q,
        fourOptions(
          correct,
          [
            "Ignore the new prescription",
            "Recommend doubling both drugs without review",
            "Discontinue all chronic medications permanently",
          ],
          slot
        ),
        correct,
        `Drug interaction screening (${subject.label}).`
      );
    }
    case 3: {
      const correct = `Counsel on adherence, adverse effects, and monitoring for ${concept}`;
      const q = `NAPLEX ${index + 1}: Which counseling point is most important for ${drug} used in ${concept}?`;
      return item(
        subject.id,
        q,
        fourOptions(
          correct,
          [
            "Stop therapy without informing the prescriber if any question arises",
            "Share medication with family members with similar symptoms",
            "Skip monitoring labs in all patients",
          ],
          slot
        ),
        correct,
        `Patient counseling (${subject.examHints}).`
      );
    }
    case 4: {
      const correct = `Recognize serious adverse effect linked to ${drug}`;
      const q = `NAPLEX ${index + 1}: Which adverse effect should be highlighted when dispensing ${drug} for ${concept}?`;
      return item(
        subject.id,
        q,
        fourOptions(
          correct,
          [
            "Mild taste change that never requires action",
            "Beneficial effect requiring no monitoring",
            "Effect that only occurs with placebo",
          ],
          slot
        ),
        correct,
        `Safety monitoring for ${subject.label}.`
      );
    }
    case 5: {
      const correct = `Verify indication, dose, and legal requirements for ${concept}`;
      const q = `NAPLEX ${index + 1}: Which professional practice standard applies when dispensing controlled medications related to ${concept}?`;
      return item(
        subject.id,
        q,
        fourOptions(
          correct,
          [
            "Unlimited refills without documentation",
            "Share prescription data publicly",
            "Bypass inventory controls",
          ],
          slot
        ),
        correct,
        `Pharmacy law & ethics (${subject.textbookRefs}).`
      );
    }
    default: {
      const correct = `Select therapy class appropriate for ${concept}`;
      const q = `NAPLEX ${index + 1}: Which therapeutic choice is most appropriate for ${concept} per guideline-based pharmacy practice?`;
      return item(
        subject.id,
        q,
        fourOptions(
          correct,
          [
            "Therapy with no evidence for the indication",
            "Dose above maximum labeled without justification",
            "Avoid all monitoring parameters",
          ],
          slot
        ),
        correct,
        `${subject.contentArea}: ${subject.examHints}.`
      );
    }
  }
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
    case "medicine":
    default:
      return buildMedicineQuestion(subject, index);
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
