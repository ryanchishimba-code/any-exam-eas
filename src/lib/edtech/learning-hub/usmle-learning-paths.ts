import type { TopicModuleDefinition } from "./topic-module-template";

export type UsmleLearningStage = {
  id: "foundations" | "clerkship" | "board-crunch";
  label: string;
  description: string;
  fieldId: "usmle-step-1" | "usmle-step-2" | "usmle-step-3";
  audience: string;
};

export const USMLE_LEARNING_STAGES: UsmleLearningStage[] = [
  {
    id: "foundations",
    label: "Foundations",
    description: "Mechanisms, pathophysiology, and basic science vignettes (pre-clinical / Step 1).",
    fieldId: "usmle-step-1",
    audience: "M1–M2",
  },
  {
    id: "clerkship",
    label: "Clinical clerkships",
    description: "Diagnosis, initial workup, and next-best-step management (Step 2 CK).",
    fieldId: "usmle-step-2",
    audience: "M3",
  },
  {
    id: "board-crunch",
    label: "Board crunch",
    description: "Timed blocks, weak-area drills, and high-yield systems review (M4 / dedicated).",
    fieldId: "usmle-step-2",
    audience: "M3–M4",
  },
];

/** Flagship USMLE topic modules — expand over time; each maps to review + Q-bank practice. */
export const USMLE_TOPIC_MODULES: TopicModuleDefinition[] = [
  {
    id: "usmle-cardio-acs",
    examSlug: "usmle",
    slug: "acute-coronary-syndrome",
    stage: "clerkship",
    system: "Cardiovascular",
    title: "Acute Coronary Syndrome",
    overview: "ECG patterns, troponin kinetics, antithrombotics, and reperfusion decisions.",
    skills: ["diagnosis", "next_step"],
    estimatedMinutes: 35,
    reviewTopicSlug: "acute-coronary-syndrome",
    questions: { practiceTopicSlug: "cardiology", reviewCount: 15, challengeCount: 5, curatedOnly: true },
    tags: ["cardiology", "acs", "high-yield"],
    sortOrder: 0,
  },
  {
    id: "usmle-renal-aki",
    examSlug: "usmle",
    slug: "acute-kidney-injury",
    stage: "clerkship",
    system: "Renal",
    title: "Acute Kidney Injury",
    overview: "Prerenal vs intrinsic vs postrenal; FENa, casts, and initial management.",
    skills: ["diagnosis", "interpretation", "next_step"],
    estimatedMinutes: 30,
    questions: { practiceTopicSlug: "nephrology", reviewCount: 12, challengeCount: 5, curatedOnly: true },
    tags: ["nephrology", "renal", "high-yield"],
    sortOrder: 1,
  },
  {
    id: "usmle-neuro-stroke",
    examSlug: "usmle",
    slug: "acute-ischemic-stroke",
    stage: "clerkship",
    system: "Neurology",
    title: "Acute Ischemic Stroke",
    overview: "NIHSS, CT exclusion of hemorrhage, tPA/thrombectomy windows, and AF embolism.",
    skills: ["diagnosis", "next_step"],
    estimatedMinutes: 30,
    questions: { practiceTopicSlug: "neurology", reviewCount: 12, challengeCount: 5, curatedOnly: true },
    tags: ["neurology", "stroke", "high-yield"],
    sortOrder: 2,
  },
  {
    id: "usmle-id-meningitis",
    examSlug: "usmle",
    slug: "bacterial-meningitis",
    stage: "clerkship",
    system: "Infectious Disease",
    title: "Bacterial Meningitis",
    overview: "CSF interpretation, empiric antibiotics, dexamethasone timing, and sick contacts.",
    skills: ["diagnosis", "next_step"],
    estimatedMinutes: 25,
    questions: { practiceTopicSlug: "microbiology", reviewCount: 10, challengeCount: 5, curatedOnly: true },
    tags: ["infectious-disease", "meningitis"],
    sortOrder: 3,
  },
  {
    id: "usmle-pulm-chf",
    examSlug: "usmle",
    slug: "acute-decompensated-hf",
    stage: "clerkship",
    system: "Pulmonary / Cardiovascular",
    title: "Acute Decompensated Heart Failure",
    overview: "Volume status, BNP, diuresis, afterload reduction, and when to escalate care.",
    skills: ["diagnosis", "next_step", "complication"],
    estimatedMinutes: 30,
    questions: { practiceTopicSlug: "cardiology", reviewCount: 12, curatedOnly: true },
    tags: ["cardiology", "heart-failure"],
    sortOrder: 4,
  },
  {
    id: "usmle-path-mechanism",
    examSlug: "usmle",
    slug: "pathophysiology-mechanisms",
    stage: "foundations",
    system: "Pathophysiology",
    title: "Mechanism & Pathophysiology",
    overview: "Link presentation to underlying mechanism — core Step 1 reasoning pattern.",
    skills: ["mechanism"],
    estimatedMinutes: 25,
    questions: { practiceTopicSlug: "pathology", reviewCount: 15, curatedOnly: true },
    tags: ["pathology", "mechanism", "step1"],
    sortOrder: 10,
  },
  {
    id: "usmle-pharm-moa",
    examSlug: "usmle",
    slug: "pharmacology-moa",
    stage: "foundations",
    system: "Pharmacology",
    title: "Pharmacology MOA",
    overview: "Drug class mechanisms, adverse effects, and clinical selection anchors.",
    skills: ["pharm_moa"],
    estimatedMinutes: 25,
    questions: { practiceTopicSlug: "pharmacology", reviewCount: 15, curatedOnly: true },
    tags: ["pharmacology", "moa", "step1"],
    sortOrder: 11,
  },
  {
    id: "usmle-board-mixed",
    examSlug: "usmle",
    slug: "board-crunch-mixed",
    stage: "board-crunch",
    system: "Mixed",
    title: "Mixed Timed Block",
    overview: "40-question exam-style block pulling weak systems and high-yield tags.",
    skills: ["diagnosis", "next_step"],
    estimatedMinutes: 60,
    questions: { practiceTopicSlug: "internal-medicine", reviewCount: 40, curatedOnly: true },
    tags: ["mixed", "timed"],
    sortOrder: 20,
  },
];

export function modulesForStage(stageId: UsmleLearningStage["id"]): TopicModuleDefinition[] {
  return USMLE_TOPIC_MODULES.filter((m) => m.stage === stageId).sort(
    (a, b) => a.sortOrder - b.sortOrder
  );
}

export function getUsmleModuleBySlug(slug: string): TopicModuleDefinition | undefined {
  return USMLE_TOPIC_MODULES.find((m) => m.slug === slug);
}
