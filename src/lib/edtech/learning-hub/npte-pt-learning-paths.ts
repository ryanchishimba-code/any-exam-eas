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

import type { TopicModuleDefinition } from "@/types/edtech";

export const NPTE_PT_LEARNING_PATH_MODULES: TopicModuleDefinition[] = [
  {
    slug: "msk-fundamentals",
    title: "Musculoskeletal Essentials",
    stage: "foundation",
    skills: ["examination", "intervention"],
    practiceTopicSlug: "musculoskeletal",
    reviewTopicSlug: "msk-rehabilitation",
    sortOrder: 0,
  },
  {
    slug: "neuro-rehab",
    title: "Neuromuscular Rehabilitation",
    stage: "core",
    skills: ["examination", "intervention"],
    practiceTopicSlug: "neuromuscular-nervous",
    reviewTopicSlug: "stroke-rehabilitation",
    sortOrder: 1,
  },
  {
    slug: "cardiopulmonary-rehab",
    title: "Cardiopulmonary Rehabilitation",
    stage: "core",
    skills: ["examination", "intervention"],
    practiceTopicSlug: "cardiovascular-pulmonary",
    reviewTopicSlug: "cardiopulmonary-rehab",
    sortOrder: 2,
  },
  {
    slug: "modalities-safety",
    title: "Modalities & Safety",
    stage: "application",
    skills: ["intervention"],
    practiceTopicSlug: "therapeutic-modalities",
    reviewTopicSlug: "therapeutic-modalities",
    sortOrder: 3,
  },
];
