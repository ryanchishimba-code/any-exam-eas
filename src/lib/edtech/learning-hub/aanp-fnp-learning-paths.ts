import type { TopicModuleDefinition, TopicModuleStage } from "./topic-module-template";

/** AANPCB FNP patient age groups — cross-cutting blueprint dimension. */
export const AANP_FNP_AGE_GROUPS = [
  { id: "newborn", label: "Newborn (0–28 days)", weight: 0.02 },
  { id: "infant", label: "Infant (1–12 months)", weight: 0.03 },
  { id: "toddler", label: "Toddler (1–3 years)", weight: 0.04 },
  { id: "child", label: "Child (3–12 years)", weight: 0.04 },
  { id: "adolescent", label: "Adolescent (13–17 years)", weight: 0.09 },
  { id: "young-adult", label: "Young Adult (18–39 years)", weight: 0.22 },
  { id: "middle-adult", label: "Middle Adult (40–64 years)", weight: 0.26 },
  { id: "older-adult", label: "Older Adult (65+ years)", weight: 0.3 },
] as const;

export type AanpFnpLearningStage = {
  id: "domain-foundations" | "clinical-integration" | "board-crunch";
  label: string;
  description: string;
  audience: string;
};

export const AANP_FNP_LEARNING_STAGES: AanpFnpLearningStage[] = [
  {
    id: "domain-foundations",
    label: "Domain foundations",
    description: "Assess, Diagnose, Plan, and Evaluate skills weighted to the AANPCB blueprint.",
    audience: "Didactic / early clinical",
  },
  {
    id: "clinical-integration",
    label: "Clinical integration",
    description: "Lifespan vignettes across cardiovascular, pulmonary, endocrine, women's health, and more.",
    audience: "Clinical rotations",
  },
  {
    id: "board-crunch",
    label: "Board crunch",
    description: "Timed blocks, weak-area drills, and full-length 135-question AANP FNP simulations.",
    audience: "Pre-certification dedicated",
  },
];

/** AANP FNP topic modules mapped to blueprint domains and deep-dive content. */
export const AANP_FNP_TOPIC_MODULES: TopicModuleDefinition[] = [
  {
    id: "aanp-assess-screening",
    examSlug: "aanp-fnp",
    slug: "aanp-assess-domain",
    stage: "foundations",
    system: "Assess",
    title: "Health Assessment & Diagnostics",
    overview: "Screening, physical exam, and next-best diagnostic test selection — Domain I (32%).",
    skills: ["assess", "diagnosis"],
    estimatedMinutes: 35,
    reviewTopicSlug: "aanp-assess-domain",
    questions: { practiceTopicSlug: "assess", reviewCount: 15, curatedOnly: true },
    tags: ["assess", "screening", "high-yield"],
    sortOrder: 0,
  },
  {
    id: "aanp-diagnose-reasoning",
    examSlug: "aanp-fnp",
    slug: "aanp-diagnose-domain",
    stage: "clinical-application",
    system: "Diagnose",
    title: "Diagnosis & Clinical Reasoning",
    overview: "Differential diagnosis and data synthesis — Domain II (26.5%).",
    skills: ["diagnosis"],
    estimatedMinutes: 35,
    reviewTopicSlug: "aanp-diagnose-domain",
    questions: { practiceTopicSlug: "diagnose", reviewCount: 15, curatedOnly: true },
    tags: ["diagnose", "high-yield"],
    sortOrder: 1,
  },
  {
    id: "aanp-plan-therapeutics",
    examSlug: "aanp-fnp",
    slug: "aanp-plan-domain",
    stage: "clinical-application",
    system: "Plan",
    title: "Therapeutics & Care Planning",
    overview: "Pharmacologic and non-pharmacologic management — Domain III (26.5%).",
    skills: ["next_step"],
    estimatedMinutes: 35,
    reviewTopicSlug: "aanp-plan-domain",
    questions: { practiceTopicSlug: "plan", reviewCount: 15, curatedOnly: true },
    tags: ["plan", "pharmacotherapy"],
    sortOrder: 2,
  },
  {
    id: "aanp-cardio-acs",
    examSlug: "aanp-fnp",
    slug: "acute-coronary-syndrome",
    stage: "clinical-application",
    system: "Cardiovascular",
    title: "Acute Coronary Syndrome",
    overview: "STEMI vs NSTEMI pathways for AANP FNP cardiovascular vignettes.",
    skills: ["diagnosis", "next_step"],
    estimatedMinutes: 35,
    reviewTopicSlug: "acute-coronary-syndrome",
    questions: { practiceTopicSlug: "cardiovascular", reviewCount: 15, curatedOnly: true },
    tags: ["cardiovascular", "acs"],
    sortOrder: 3,
  },
  {
    id: "aanp-geri-high-yield",
    examSlug: "aanp-fnp",
    slug: "aanp-geriatrics-high-yield",
    stage: "board-crunch",
    system: "Geriatrics",
    title: "Older Adult Care",
    overview: "Polypharmacy, falls, delirium — largest lifespan share (~30%).",
    skills: ["assess", "next_step"],
    estimatedMinutes: 30,
    reviewTopicSlug: "aanp-geriatrics-high-yield",
    questions: { practiceTopicSlug: "geriatrics", reviewCount: 20, curatedOnly: true },
    tags: ["geriatrics", "Beers"],
    sortOrder: 4,
  },
  {
    id: "aanp-peds-high-yield",
    examSlug: "aanp-fnp",
    slug: "aanp-pediatrics-high-yield",
    stage: "clinical-application",
    system: "Pediatrics",
    title: "Pediatric Primary Care",
    overview: "Well-child, febrile infant, immunizations — newborn through adolescent.",
    skills: ["assess", "diagnosis"],
    estimatedMinutes: 30,
    reviewTopicSlug: "aanp-pediatrics-high-yield",
    questions: { practiceTopicSlug: "pediatrics", reviewCount: 15, curatedOnly: true },
    tags: ["pediatrics", "lifespan"],
    sortOrder: 5,
  },
];

const AANP_STAGE_TO_MODULE: Record<AanpFnpLearningStage["id"], TopicModuleStage[]> = {
  "domain-foundations": ["foundations"],
  "clinical-integration": ["clinical-application"],
  "board-crunch": ["board-crunch"],
};

export function aanpFnpModulesForStage(
  stageId: AanpFnpLearningStage["id"]
): TopicModuleDefinition[] {
  const stages = AANP_STAGE_TO_MODULE[stageId];
  return AANP_FNP_TOPIC_MODULES.filter((m) => stages.includes(m.stage));
}

export function getAanpFnpModuleBySlug(slug: string): TopicModuleDefinition | undefined {
  return AANP_FNP_TOPIC_MODULES.find((m) => m.slug === slug);
}
