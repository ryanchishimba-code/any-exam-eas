/**
 * AANPCB FNP learning paths — domain foundations + 12 system-based clinical modules.
 */
import {
  AANP_FNP_2026_TOPIC_GROUPS,
  aanpFnpSystemModuleSlug,
} from "@/lib/exam-prep/aanp-fnp/blueprint-topics-2026";
import type { AanpFnpClinicalSystemId } from "@/lib/exam-prep/aanp-fnp/types";
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
    description:
      "System-based primary care vignettes — cardiovascular through dermatology/ENT with guideline-directed therapy.",
    audience: "Clinical rotations",
  },
  {
    id: "board-crunch",
    label: "Board crunch",
    description: "Timed blocks, weak-area drills, and full-length 135-question AANP FNP simulations.",
    audience: "Pre-certification dedicated",
  },
];

const DOMAIN_MODULES: TopicModuleDefinition[] = [
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
    id: "aanp-evaluate-outcomes",
    examSlug: "aanp-fnp",
    slug: "aanp-evaluate-domain",
    stage: "board-crunch",
    system: "Evaluate",
    title: "Outcomes & Follow-Up",
    overview: "Monitor treatment response, adverse effects, and modify plans — Domain IV (15%).",
    skills: ["evaluate"],
    estimatedMinutes: 30,
    reviewTopicSlug: "aanp-evaluate-domain",
    questions: { practiceTopicSlug: "evaluate", reviewCount: 15, curatedOnly: true },
    tags: ["evaluate", "monitoring"],
    sortOrder: 3,
  },
];

const SYSTEM_STAGE: Record<string, TopicModuleStage> = {
  "very-high": "clinical-application",
  high: "clinical-application",
  standard: "systems-review",
};

const SYSTEM_SKILLS: Record<string, TopicModuleDefinition["skills"]> = {
  cardiovascular: ["diagnosis", "next_step", "pharm_moa"],
  pulmonary: ["diagnosis", "next_step"],
  endocrine: ["next_step", "pharm_moa", "interpretation"],
  "infectious-disease": ["diagnosis", "next_step"],
  gastrointestinal: ["diagnosis", "next_step"],
  musculoskeletal: ["diagnosis", "next_step"],
  neurology: ["diagnosis", "next_step"],
  "psychiatry-behavioral": ["diagnosis", "next_step", "assess"],
  "womens-health": ["assess", "next_step"],
  pediatrics: ["assess", "diagnosis"],
  geriatrics: ["assess", "next_step", "evaluate"],
  "dermatology-ent": ["diagnosis", "next_step"],
};

function buildSystemModules(): TopicModuleDefinition[] {
  return AANP_FNP_2026_TOPIC_GROUPS.map((group, index) => {
    const slug = aanpFnpSystemModuleSlug(group.categoryId);
    const topTopics = group.topics.slice(0, 3).map((t) => t.label).join(", ");
    return {
      id: `aanp-sys-${group.categoryId}`,
      examSlug: "aanp-fnp",
      slug,
      stage: SYSTEM_STAGE[group.yield] ?? "clinical-application",
      system: group.label,
      title: `${group.label} Primary Care`,
      overview: `${group.yield === "very-high" ? "Very high yield — " : ""}Case vignettes: ${topTopics}, and more.`,
      skills: SYSTEM_SKILLS[group.categoryId] ?? ["diagnosis", "next_step"],
      estimatedMinutes: group.yield === "very-high" ? 40 : 35,
      reviewTopicSlug: slug,
      questions: {
        practiceTopicSlug: group.categoryId,
        reviewCount: group.yield === "very-high" ? 20 : 15,
        curatedOnly: true,
      },
      tags: [group.categoryId, group.yield, "system-module"],
      sortOrder: 10 + index,
    };
  });
}

const LIFESPAN_MODULES: TopicModuleDefinition[] = [
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
    sortOrder: 90,
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
    sortOrder: 91,
  },
];

/** AANP FNP topic modules — domains, 12 body systems, and lifespan high-yield. */
export const AANP_FNP_TOPIC_MODULES: TopicModuleDefinition[] = [
  ...DOMAIN_MODULES,
  ...buildSystemModules(),
  ...LIFESPAN_MODULES,
];

const AANP_STAGE_TO_MODULE: Record<AanpFnpLearningStage["id"], TopicModuleStage[]> = {
  "domain-foundations": ["foundations"],
  "clinical-integration": ["clinical-application", "systems-review"],
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

export function getAanpFnpSystemModuleByClinicalSystem(
  clinicalSystem: AanpFnpClinicalSystemId
): TopicModuleDefinition | undefined {
  return getAanpFnpModuleBySlug(aanpFnpSystemModuleSlug(clinicalSystem));
}
