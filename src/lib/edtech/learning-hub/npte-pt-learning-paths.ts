import type { TopicModuleDefinition, TopicModuleStage } from "./topic-module-template";

/** FSBPT NPTE-PT process categories for roadmap task dimension. */
export const NPTE_PT_TASK_CATEGORIES = [
  {
    id: "examination",
    label: "Physical Therapy Examination",
    weight: 0.18,
    description: "Tests/measures, outcome tools, systems review, movement analysis",
  },
  {
    id: "evaluation-diagnosis-prognosis",
    label: "Evaluation, Differential Diagnosis & Prognosis",
    weight: 0.24,
    description: "Clinical reasoning, diagnosis, prognosis, goal setting",
  },
  {
    id: "interventions",
    label: "Interventions",
    weight: 0.21,
    description: "Therapeutic exercise, manual therapy, modalities, patient education",
  },
] as const;

export type NptePtLearningStage = {
  id: "systems-review" | "clinical-application" | "board-crunch";
  label: string;
  description: string;
  audience: string;
};

export const NPTE_PT_LEARNING_STAGES: NptePtLearningStage[] = [
  {
    id: "systems-review",
    label: "Systems review",
    description: "Body-system vignettes weighted to the FSBPT content outline.",
    audience: "Didactic / early clinical",
  },
  {
    id: "clinical-application",
    label: "Clinical application",
    description: "Examination, intervention selection, and outcome-measure interpretation.",
    audience: "Clinical rotations",
  },
  {
    id: "board-crunch",
    label: "Board crunch",
    description: "Timed blocks, weak-area drills, and full-length 250-question NPTE-PT simulations.",
    audience: "Pre-NPTE dedicated",
  },
];

/** NPTE-PT topic modules mapped to FSBPT systems and deep-dive content. */
export const NPTE_PT_TOPIC_MODULES: TopicModuleDefinition[] = [
  {
    id: "npte-msk-fundamentals",
    examSlug: "npte-pt",
    slug: "msk-rehabilitation",
    stage: "systems-review",
    system: "Musculoskeletal",
    title: "Musculoskeletal Essentials",
    overview: "Rotator cuff, spine, post-op ortho, manual therapy, and outcome measures — highest-yield MSK domain.",
    skills: ["assess", "next_step"],
    estimatedMinutes: 35,
    reviewTopicSlug: "msk-rehabilitation",
    questions: { practiceTopicSlug: "musculoskeletal", reviewCount: 20, curatedOnly: true },
    tags: ["msk", "high-yield"],
    sortOrder: 0,
  },
  {
    id: "npte-neuro-rehab",
    examSlug: "npte-pt",
    slug: "stroke-rehabilitation",
    stage: "clinical-application",
    system: "Neuromuscular",
    title: "Neuromuscular Rehabilitation",
    overview: "Stroke, SCI, TBI, Parkinson, gait, and balance training — core neuromuscular content.",
    skills: ["assess", "next_step"],
    estimatedMinutes: 35,
    reviewTopicSlug: "stroke-rehabilitation",
    questions: { practiceTopicSlug: "neuromuscular-nervous", reviewCount: 20, curatedOnly: true },
    tags: ["neuro", "high-yield"],
    sortOrder: 1,
  },
  {
    id: "npte-cardiopulmonary",
    examSlug: "npte-pt",
    slug: "cardiopulmonary-rehab",
    stage: "clinical-application",
    system: "Cardiopulmonary",
    title: "Cardiopulmonary Rehabilitation",
    overview: "COPD, CHF, post-MI rehab, oxygen titration, and airway clearance techniques.",
    skills: ["assess", "next_step"],
    estimatedMinutes: 30,
    reviewTopicSlug: "cardiopulmonary-rehab",
    questions: { practiceTopicSlug: "cardiovascular-pulmonary", reviewCount: 15, curatedOnly: true },
    tags: ["cardiopulmonary", "high-yield"],
    sortOrder: 2,
  },
  {
    id: "npte-modalities",
    examSlug: "npte-pt",
    slug: "therapeutic-modalities",
    stage: "clinical-application",
    system: "Modalities",
    title: "Therapeutic Modalities & Safety",
    overview: "Ultrasound, TENS, NMES, cryotherapy, heat, and contraindication screening.",
    skills: ["next_step"],
    estimatedMinutes: 25,
    reviewTopicSlug: "therapeutic-modalities",
    questions: { practiceTopicSlug: "therapeutic-modalities", reviewCount: 12, curatedOnly: true },
    tags: ["modalities", "safety"],
    sortOrder: 3,
  },
  {
    id: "npte-board-block",
    examSlug: "npte-pt",
    slug: "npte-blueprint-block",
    stage: "board-crunch",
    system: "Mixed",
    title: "Blueprint Mixed Block",
    overview: "Timed mixed-system practice across FSBPT body systems and non-systems categories.",
    skills: ["assess", "next_step"],
    estimatedMinutes: 60,
    questions: { practiceTopicSlug: "musculoskeletal", reviewCount: 50, curatedOnly: false },
    tags: ["timed", "mixed"],
    sortOrder: 4,
  },
];

const NPTE_STAGE_TO_MODULE: Record<NptePtLearningStage["id"], TopicModuleStage[]> = {
  "systems-review": ["systems-review", "foundations"],
  "clinical-application": ["clinical-application"],
  "board-crunch": ["board-crunch"],
};

export function nptePtModulesForStage(
  stageId: NptePtLearningStage["id"]
): TopicModuleDefinition[] {
  const stages = NPTE_STAGE_TO_MODULE[stageId];
  return NPTE_PT_TOPIC_MODULES.filter((m) => stages.includes(m.stage));
}

export function getNptePtModuleBySlug(slug: string): TopicModuleDefinition | undefined {
  return NPTE_PT_TOPIC_MODULES.find((m) => m.slug === slug);
}
