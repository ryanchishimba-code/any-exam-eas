/**
 * USMLE 2026 full-exam slot planning — organ systems + physician tasks + format mix.
 */
import {
  allocateQuestionsByBlueprint,
  type ExamBlueprint,
} from "@/lib/engine/blueprints";
import type {
  UsmleGenerationSlot,
  UsmlePhysicianTaskId,
  UsmleQuestionFormat,
  UsmleStepLevel,
} from "./types";

/** USMLE Step 1 — integrated organ systems (2026 content outline weights). */
export const USMLE_STEP1_2026_BLUEPRINT: ExamBlueprint = {
  fieldId: "usmle-step-1",
  examName: "USMLE Step 1",
  sourceNote:
    "USMLE Content Outline 2026 — Step 1 integrated organ systems: Repro/Endocrine 12–16%, Resp/Renal 11–15%, Behavioral/Nervous 10–14%, Cardiovascular 8–12%, GI 8–10%, MSK 7–9%, Heme/Immuno 7–9%, Biochem/Genetics 6–8%",
  vignetteMinRatio: 0.55,
  ngnMix: [
    { format: "lab_interpretation", weight: 0.12, label: "Lab interpretation" },
    { format: "image_based", weight: 0.08, label: "Image / exhibit" },
    { format: "sequential", weight: 0.06, label: "Multi-step sequential" },
    { format: "biostats", weight: 0.05, label: "Biostatistics / epidemiology" },
  ],
  categories: [
    {
      id: "reproductive-endocrine",
      label: "Reproductive / Endocrine",
      weight: 0.14,
      subjectIds: ["obgyn", "internal-medicine", "physiology"],
      highYieldTopics: [
        "diabetes pathophysiology",
        "thyroid disorders",
        "adrenal insufficiency",
        "PCOS",
        "preeclampsia mechanism",
        "DKA biochemistry",
        "contraception pharmacology",
        "hypogonadism",
      ],
    },
    {
      id: "respiratory-renal",
      label: "Respiratory / Renal",
      weight: 0.13,
      subjectIds: ["pulmonology", "nephrology", "physiology"],
      highYieldTopics: [
        "acid-base",
        "AKI mechanisms",
        "nephrotic syndrome",
        "COPD pathophysiology",
        "pulmonary embolism",
        "tubular defects",
        "ventilation-perfusion",
        "pneumonia organisms",
      ],
    },
    {
      id: "behavioral-nervous",
      label: "Behavioral Health / Nervous",
      weight: 0.12,
      subjectIds: ["psychiatry", "neurology", "pathology"],
      highYieldTopics: [
        "depression pharmacology",
        "schizophrenia",
        "stroke localization",
        "multiple sclerosis",
        "seizure mechanisms",
        "dementia pathology",
        "substance use",
        "cranial nerve lesions",
      ],
    },
    {
      id: "cardiovascular",
      label: "Cardiovascular",
      weight: 0.1,
      subjectIds: ["cardiology", "pathology", "pharmacology"],
      highYieldTopics: [
        "heart failure mechanisms",
        "ACS pathophysiology",
        "arrhythmia electrophysiology",
        "valvular disease",
        "hypertension pharmacology",
        "cholesterol metabolism",
        "shock hemodynamics",
        "ECG interpretation",
      ],
    },
    {
      id: "gastrointestinal",
      label: "Gastrointestinal",
      weight: 0.09,
      subjectIds: ["internal-medicine", "pathology"],
      highYieldTopics: [
        "liver cirrhosis",
        "IBD mechanisms",
        "PUD acid secretion",
        "pancreatitis enzymes",
        "biliary obstruction",
        "celiac disease",
        "GI bleeding sources",
        "hepatitis serology",
      ],
    },
    {
      id: "musculoskeletal",
      label: "Musculoskeletal / Skin",
      weight: 0.08,
      subjectIds: ["pathology", "anatomy"],
      highYieldTopics: [
        "autoimmune arthritis",
        "osteoporosis",
        "gout crystals",
        "dermatology histology",
        "nerve entrapment",
        "bone tumors",
        "collagen disorders",
        "myopathies",
      ],
    },
    {
      id: "hematology-immunology",
      label: "Hematology / Immunology",
      weight: 0.08,
      subjectIds: ["hematology", "microbiology", "pathology"],
      highYieldTopics: [
        "anemia workup",
        "coagulation cascade",
        "hypersensitivity",
        "HIV immunology",
        "leukemia classification",
        "transfusion reactions",
        "complement deficiency",
        "autoimmune hemolysis",
      ],
    },
    {
      id: "biochemistry-genetics",
      label: "Biochemistry / Genetics",
      weight: 0.07,
      subjectIds: ["biochemistry", "pathology"],
      highYieldTopics: [
        "inborn errors of metabolism",
        "lysosomal storage",
        "DNA repair defects",
        "enzyme kinetics",
        "vitamin deficiencies",
        "glycolysis/gluconeogenesis",
        "lipid disorders",
        "molecular inheritance",
      ],
    },
    {
      id: "pharmacology-microbiology",
      label: "Pharmacology / Microbiology",
      weight: 0.19,
      subjectIds: ["pharmacology", "microbiology"],
      highYieldTopics: [
        "autonomic pharmacology",
        "antibiotic mechanisms",
        "antiviral agents",
        "chemotherapy MOA",
        "toxicology antidotes",
        "gram-positive organisms",
        "gram-negative organisms",
        "fungal/parasitic pathogens",
      ],
    },
  ],
};

/** USMLE Step 2 CK — clinical disciplines (2026 content outline weights). */
export const USMLE_STEP2_2026_BLUEPRINT: ExamBlueprint = {
  fieldId: "usmle-step-2",
  examName: "USMLE Step 2 CK",
  sourceNote:
    "USMLE Content Outline 2026 — Step 2 CK: Internal Medicine 55–65%, Pediatrics 17–27%, Surgery 8–12%, Psychiatry 5–8%, OB/GYN 8–12%",
  vignetteMinRatio: 0.75,
  ngnMix: [
    { format: "lab_interpretation", weight: 0.1, label: "Lab interpretation" },
    { format: "image_based", weight: 0.07, label: "Image / exhibit" },
    { format: "sequential", weight: 0.08, label: "Multi-step sequential" },
    { format: "ethics", weight: 0.04, label: "Ethics / professionalism" },
  ],
  categories: [
    {
      id: "internal-medicine",
      label: "Internal Medicine",
      weight: 0.6,
      subjectIds: ["internal-medicine", "cardiology", "pulmonology", "nephrology"],
      highYieldTopics: [
        "ACS management",
        "heart failure GDMT",
        "sepsis bundles",
        "DKA/HHS",
        "AKI workup",
        "COPD exacerbation",
        "hepatitis management",
        "anemia evaluation",
        "hypertension",
        "infectious disease antibiotics",
      ],
    },
    {
      id: "pediatrics",
      label: "Pediatrics",
      weight: 0.22,
      subjectIds: ["pediatrics"],
      highYieldTopics: [
        "vaccine schedule",
        "febrile infant",
        "neonatal jaundice",
        "asthma in children",
        "UTI in pediatrics",
        "development milestones",
        "child abuse red flags",
        "Kawasaki disease",
      ],
    },
    {
      id: "surgery-acute-care",
      label: "Surgery / Acute Care",
      weight: 0.1,
      subjectIds: ["emergency-medicine"],
      highYieldTopics: [
        "acute abdomen",
        "appendicitis",
        "bowel obstruction",
        "trauma ATLS",
        "post-op complications",
        "cholecystitis",
        "testicular torsion",
        "burns management",
      ],
    },
    {
      id: "obgyn",
      label: "OB/GYN",
      weight: 0.05,
      subjectIds: ["obgyn"],
      highYieldTopics: [
        "preeclampsia",
        "ectopic pregnancy",
        "labor complications",
        "contraception",
        "abnormal uterine bleeding",
        "STIs in pregnancy",
      ],
    },
    {
      id: "psychiatry",
      label: "Psychiatry",
      weight: 0.03,
      subjectIds: ["psychiatry"],
      highYieldTopics: [
        "major depression",
        "bipolar disorder",
        "psychosis workup",
        "suicide risk",
        "substance withdrawal",
        "eating disorders",
      ],
    },
  ],
};

const PHYSICIAN_TASKS: UsmlePhysicianTaskId[] = [
  "diagnosis",
  "health-maintenance",
  "clinical-intervention",
  "pharmacotherapy",
  "interpretation",
  "communication",
  "professionalism",
];

const STEP1_STEM_FORMATS = [
  "Which of the following best explains the patient's finding?",
  "What is the most likely mechanism of this patient's condition?",
  "Which anatomic structure is most likely injured?",
  "Which laboratory finding is most consistent with this diagnosis?",
  "Which microorganism is the most likely cause?",
  "Which drug mechanism best accounts for this adverse effect?",
  "Which enzyme deficiency is most likely?",
  "Which histologic finding is most expected?",
  "Which pathophysiologic process best explains these findings?",
  "Which of the following is the most likely diagnosis?",
] as const;

const STEP2_STEM_FORMATS = [
  "Which of the following is the most likely diagnosis?",
  "What is the most appropriate next step in management?",
  "Which of the following is the best initial test?",
  "Which medication is most appropriate for this patient?",
  "Which of the following is the most likely complication?",
  "What is the most appropriate preventive measure?",
  "Which finding is most consistent with this condition?",
  "Which of the following is the most appropriate referral?",
  "What is the most likely underlying cause?",
  "Which of the following is contraindicated in this patient?",
] as const;

const HIGH_YIELD_BY_SYSTEM: Record<string, string[]> = {};
for (const bp of [
  ...USMLE_STEP1_2026_BLUEPRINT.categories,
  ...USMLE_STEP2_2026_BLUEPRINT.categories,
]) {
  HIGH_YIELD_BY_SYSTEM[bp.id] = bp.highYieldTopics ?? [];
}

function resolveStepLevel(examNumber: number, override?: UsmleStepLevel): UsmleStepLevel {
  if (override) return override;
  return examNumber % 2 === 1 ? "step1" : "step2";
}

function resolveBlueprint(stepLevel: UsmleStepLevel): ExamBlueprint {
  return stepLevel === "step1" ? USMLE_STEP1_2026_BLUEPRINT : USMLE_STEP2_2026_BLUEPRINT;
}

function resolveSubjectId(slot: { categoryId: string; subjectIds?: string[] }, index: number): string {
  const ids = slot.subjectIds ?? ["internal-medicine"];
  return ids[index % ids.length]!;
}

function resolveQuestionFormat(ngnFormat?: string): UsmleQuestionFormat {
  if (ngnFormat === "lab_interpretation") return "lab_interpretation";
  if (ngnFormat === "image_based") return "image_based";
  if (ngnFormat === "sequential") return "sequential";
  if (ngnFormat === "biostats") return "biostats";
  if (ngnFormat === "ethics") return "ethics";
  return "vignette";
}

function pickTopic(systemId: string, index: number, examSeed: number): string {
  const topics = HIGH_YIELD_BY_SYSTEM[systemId] ?? ["high-yield clinical integration"];
  return topics[(index + examSeed) % topics.length]!;
}

function pickPhysicianTask(index: number, examSeed: number): UsmlePhysicianTaskId {
  return PHYSICIAN_TASKS[(index + examSeed) % PHYSICIAN_TASKS.length]!;
}

function pickStemFormat(stepLevel: UsmleStepLevel, index: number, examSeed: number): string {
  const formats = stepLevel === "step1" ? STEP1_STEM_FORMATS : STEP2_STEM_FORMATS;
  return formats[(index + examSeed) % formats.length]!;
}

/** Vary question count within 75–85 per exam. */
export function resolveExamQuestionCount(examNumber: number): number {
  return 75 + ((examNumber * 3) % 11);
}

/** Plan all slots for one full-length USMLE block-style practice exam. */
export function planUsmleFullExamSlots(params: {
  examNumber: number;
  questionCount?: number;
  stepLevel?: UsmleStepLevel;
}): UsmleGenerationSlot[] {
  const { examNumber } = params;
  const stepLevel = resolveStepLevel(examNumber, params.stepLevel);
  const questionCount = params.questionCount ?? resolveExamQuestionCount(examNumber);
  const examSeed = examNumber * 29;
  const blueprint = resolveBlueprint(stepLevel);
  const baseSlots = allocateQuestionsByBlueprint(questionCount, blueprint);

  return baseSlots.map((slot, slotIndex) => {
    const questionFormat = resolveQuestionFormat(slot.ngnFormat);
    const subjectId = resolveSubjectId(slot, slotIndex + examSeed);

    return {
      ...slot,
      slotIndex,
      stepLevel,
      subjectId,
      blueprintSystem: slot.categoryId,
      blueprintTopic: pickTopic(slot.categoryId, slotIndex, examSeed),
      physicianTask: pickPhysicianTask(slotIndex, examSeed),
      difficulty: 2 + ((slotIndex + examSeed) % 4),
      stemFormat: pickStemFormat(stepLevel, slotIndex, examSeed),
      questionFormat,
    };
  });
}

export function resolveExamTitle(examNumber: number, stepLevel: UsmleStepLevel): string {
  const label =
    stepLevel === "step1" ? "Step 1" : stepLevel === "step3" ? "Step 3" : "Step 2 CK";
  return `USMLE ${label} Practice Exam ${examNumber}`;
}

export function summarizeExamBlueprint(slots: UsmleGenerationSlot[]): Record<string, number> {
  const summary: Record<string, number> = {};
  for (const slot of slots) {
    summary[slot.categoryLabel] = (summary[slot.categoryLabel] ?? 0) + 1;
  }
  return summary;
}

export function summarizeExamFormats(slots: UsmleGenerationSlot[]): Record<string, number> {
  const summary: Record<string, number> = {};
  for (const slot of slots) {
    summary[slot.questionFormat] = (summary[slot.questionFormat] ?? 0) + 1;
  }
  return summary;
}

export function summarizeExamTasks(slots: UsmleGenerationSlot[]): Record<string, number> {
  const summary: Record<string, number> = {};
  for (const slot of slots) {
    summary[slot.physicianTask] = (summary[slot.physicianTask] ?? 0) + 1;
  }
  return summary;
}
