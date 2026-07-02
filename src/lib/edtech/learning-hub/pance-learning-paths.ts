import type { TopicModuleDefinition } from "./topic-module-template";
import { PANCE_TASK_AREAS } from "@/lib/exam-prep/pance/content-outline";

/** NCCPA PANCE task areas (2026 blueprint) — used in prompts and roadmap labels. */
export const PANCE_TASK_CATEGORIES = PANCE_TASK_AREAS.map((task) => ({
  id: task.id,
  label: task.label,
  weight: task.weight,
}));

export type PanceLearningStage = {
  id: "systems-review" | "clinical-application" | "board-crunch";
  label: string;
  description: string;
  audience: string;
};

export const PANCE_LEARNING_STAGES: PanceLearningStage[] = [
  {
    id: "systems-review",
    label: "Systems review",
    description: "Organ-system vignettes weighted to the NCCPA medical content blueprint.",
    audience: "Didactic / clinical year",
  },
  {
    id: "clinical-application",
    label: "Clinical application",
    description: "Diagnosis, labs, pharmacotherapy, and next-step management tasks.",
    audience: "Clinical rotations",
  },
  {
    id: "board-crunch",
    label: "Board crunch",
    description: "Timed blocks, weak-area drills, and full-length 300-question PANCE simulations.",
    audience: "Pre-PANCE dedicated",
  },
];

/** PANCE topic modules mapped to NCCPA systems and deep-dive content. */
export const PANCE_TOPIC_MODULES: TopicModuleDefinition[] = [
  {
    id: "pance-cardio-acs",
    examSlug: "pance",
    slug: "acute-coronary-syndrome",
    stage: "clinical-application",
    system: "Cardiovascular",
    title: "Acute Coronary Syndrome",
    overview: "STEMI vs NSTEMI, antithrombotics, and reperfusion — highest-weight cardiovascular topic.",
    skills: ["diagnosis", "next_step"],
    estimatedMinutes: 35,
    reviewTopicSlug: "acute-coronary-syndrome",
    questions: { practiceTopicSlug: "cardiovascular", reviewCount: 15, challengeCount: 5, curatedOnly: true },
    tags: ["cardiovascular", "acs", "high-yield"],
    sortOrder: 0,
  },
  {
    id: "pance-hypertension",
    examSlug: "pance",
    slug: "primary-care-hypertension",
    stage: "clinical-application",
    system: "Cardiovascular",
    title: "Hypertension Management",
    overview: "JNC/ACC approach — diagnosis, first-line therapy, monitoring, and geriatric considerations.",
    skills: ["diagnosis", "next_step"],
    estimatedMinutes: 30,
    questions: { practiceTopicSlug: "cardiovascular", reviewCount: 15, curatedOnly: true },
    tags: ["cardiovascular", "HTN"],
    sortOrder: 1,
  },
  {
    id: "pance-pulm-copd",
    examSlug: "pance",
    slug: "copd-exacerbation",
    stage: "clinical-application",
    system: "Pulmonary",
    title: "COPD Exacerbation",
    overview: "ABCs, bronchodilators, steroids, antibiotics when indicated, and NIPPV criteria.",
    skills: ["diagnosis", "next_step"],
    estimatedMinutes: 30,
    questions: { practiceTopicSlug: "pulmonary", reviewCount: 12, curatedOnly: true },
    tags: ["pulmonary", "copd"],
    sortOrder: 2,
  },
  {
    id: "pance-id-sepsis",
    examSlug: "pance",
    slug: "sepsis-bundle",
    stage: "clinical-application",
    system: "Infectious Diseases",
    title: "Sepsis Recognition & Bundle",
    overview: "qSOFA/SIRS, early antibiotics, fluids, and source control.",
    skills: ["diagnosis", "next_step"],
    estimatedMinutes: 30,
    reviewTopicSlug: "sepsis-shock",
    questions: { practiceTopicSlug: "infectious-diseases", reviewCount: 12, curatedOnly: true },
    tags: ["infectious-diseases", "sepsis"],
    sortOrder: 3,
  },
  {
    id: "pance-neuro-stroke",
    examSlug: "pance",
    slug: "acute-ischemic-stroke",
    stage: "clinical-application",
    system: "Neurologic",
    title: "Acute Ischemic Stroke",
    overview: "NIHSS, CT exclusion of hemorrhage, tPA/thrombectomy windows.",
    skills: ["diagnosis", "next_step"],
    estimatedMinutes: 30,
    questions: { practiceTopicSlug: "neurologic", reviewCount: 12, curatedOnly: true },
    tags: ["neurologic", "stroke"],
    sortOrder: 4,
  },
  {
    id: "pance-endo-dka",
    examSlug: "pance",
    slug: "dka-management",
    stage: "clinical-application",
    system: "Endocrine",
    title: "Diabetic Ketoacidosis",
    overview: "Fluids, insulin drip, potassium repletion, and search for precipitant.",
    skills: ["diagnosis", "next_step"],
    estimatedMinutes: 25,
    questions: { practiceTopicSlug: "endocrine", reviewCount: 10, curatedOnly: true },
    tags: ["endocrine", "dka"],
    sortOrder: 5,
  },
  {
    id: "pance-psych-depression",
    examSlug: "pance",
    slug: "depression-anxiety",
    stage: "clinical-application",
    system: "Psychiatry",
    title: "Depression & Anxiety",
    overview: "Screening tools, SSRI selection, suicide risk, and follow-up monitoring.",
    skills: ["diagnosis", "next_step"],
    estimatedMinutes: 30,
    questions: { practiceTopicSlug: "psychiatry", reviewCount: 15, curatedOnly: true },
    tags: ["psychiatry", "mental-health"],
    sortOrder: 6,
  },
  {
    id: "pance-repro-prenatal",
    examSlug: "pance",
    slug: "prenatal-first-visit",
    stage: "systems-review",
    system: "Reproductive",
    title: "First Prenatal Visit",
    overview: "Initial prenatal assessment, labs, counseling, and referral triggers.",
    skills: ["diagnosis", "next_step"],
    estimatedMinutes: 25,
    questions: { practiceTopicSlug: "reproductive", reviewCount: 12, curatedOnly: true },
    tags: ["reproductive", "prenatal", "pediatric"],
    sortOrder: 7,
  },
  {
    id: "pance-board-block",
    examSlug: "pance",
    slug: "pance-blueprint-block",
    stage: "board-crunch",
    system: "Mixed blueprint",
    title: "300-Question Blueprint Block",
    overview: "Mixed NCCPA content and task categories mirroring real PANCE distribution.",
    skills: ["diagnosis", "next_step", "interpretation"],
    estimatedMinutes: 300,
    questions: { practiceTopicSlug: "cardiovascular", reviewCount: 50, curatedOnly: true },
    tags: ["mixed", "timed", "full-length"],
    sortOrder: 20,
  },
];

export function panceModulesForStage(
  stage: PanceLearningStage["id"]
): TopicModuleDefinition[] {
  return PANCE_TOPIC_MODULES.filter((m) => m.stage === stage).sort(
    (a, b) => a.sortOrder - b.sortOrder
  );
}

export function getPanceModuleBySlug(slug: string): TopicModuleDefinition | undefined {
  return PANCE_TOPIC_MODULES.find((m) => m.slug === slug);
}
