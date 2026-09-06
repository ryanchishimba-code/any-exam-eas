/**
 * USMLE content spine — maps 2026 granular topics onto the official organ-system spine.
 */
import type { UsmleStepLevel } from "./types";
import {
  type UsmleOrganSystemId,
  type UsmleOfficialPhysicianTaskId,
  USMLE_ORGAN_SYSTEMS,
  organSystemWeightsForStep,
  sourceNoteForStep,
} from "./official-content-model";
import {
  USMLE_STEP1_TOPIC_GROUPS,
  USMLE_STEP2_TOPIC_GROUPS,
  USMLE_STEP3_TOPIC_GROUPS,
  USMLE_CROSS_CUTTING_TOPICS,
  type Usmle2026Topic,
} from "./blueprint-topics-2026";
import type { ExamBlueprint } from "@/lib/engine/blueprints";

export type UsmleTopicNode = {
  slug: string;
  label: string;
  /** Primary organ system for navigation / mastery. */
  systemId: UsmleOrganSystemId;
  /** Additional systems when integrative. */
  systems: UsmleOrganSystemId[];
  stepLevel: UsmleStepLevel;
  highYield: boolean;
  /** Legacy categoryId from 2026 topic groups (for migration). */
  legacyCategoryId: string;
};

/** Map legacy blueprint category ids → spine organ system. */
export const LEGACY_CATEGORY_TO_SYSTEM: Record<string, UsmleOrganSystemId> = {
  cardiovascular: "cardiovascular",
  "respiratory-renal": "respiratory-renal",
  gastrointestinal: "gastrointestinal",
  "reproductive-endocrine": "reproductive-endocrine",
  "hematology-immunology": "blood-lymph-immune",
  musculoskeletal: "msk-skin",
  "behavioral-nervous": "behavioral-nervous",
  "pharmacology-microbiology": "multisystem",
  "biochemistry-genetics": "biostats-epi",
  "internal-medicine": "multisystem",
  "surgery-acute-care": "multisystem",
  pediatrics: "human-development",
  obgyn: "reproductive-endocrine",
  psychiatry: "behavioral-nervous",
  surgery: "multisystem",
  ccs: "multisystem",
  biostatistics: "biostats-epi",
  ethics: "social-sciences",
  "pharm-advertising": "biostats-epi",
  anatomy: "msk-skin",
  physiology: "multisystem",
  pathology: "multisystem",
  pharmacology: "multisystem",
  biochemistry: "biostats-epi",
  microbiology: "blood-lymph-immune",
  neurology: "behavioral-nervous",
  pulmonology: "respiratory-renal",
  nephrology: "respiratory-renal",
  cardiology: "cardiovascular",
  "emergency-medicine": "multisystem",
};

/** Topic-level overrides when legacy category is too coarse. */
const TOPIC_SYSTEM_OVERRIDES: Record<string, UsmleOrganSystemId> = {
  // Step 1
  "atherosclerosis-mechanisms": "cardiovascular",
  "heart-failure-pathophysiology": "cardiovascular",
  "hypertension-mechanisms": "cardiovascular",
  "acs-pathophysiology": "cardiovascular",
  "arrhythmia-electrophysiology": "cardiovascular",
  "valvular-disease-mechanisms": "cardiovascular",
  "ards-pathology": "respiratory-renal",
  "asthma-copd-pathology": "respiratory-renal",
  "glomerular-diseases": "respiratory-renal",
  "acid-base-physiology": "respiratory-renal",
  "aki-mechanisms": "respiratory-renal",
  "pe-pathophysiology": "respiratory-renal",
  "liver-pathology": "gastrointestinal",
  "ibd-mechanisms": "gastrointestinal",
  malabsorption: "gastrointestinal",
  "pancreatitis-enzymes": "gastrointestinal",
  "gi-bleeding-sources": "gastrointestinal",
  "hepatitis-serology": "gastrointestinal",
  "diabetes-pathophysiology": "reproductive-endocrine",
  "thyroid-disorders": "reproductive-endocrine",
  "adrenal-disorders": "reproductive-endocrine",
  "pcos-endocrine": "reproductive-endocrine",
  "preeclampsia-mechanism": "reproductive-endocrine",
  "contraception-pharmacology": "reproductive-endocrine",
  "leukemia-classification": "blood-lymph-immune",
  "anemia-workup": "blood-lymph-immune",
  "tumor-markers": "blood-lymph-immune",
  hypersensitivity: "blood-lymph-immune",
  "transplant-immunology": "blood-lymph-immune",
  "coagulation-cascade": "blood-lymph-immune",
  "rheumatoid-arthritis": "msk-skin",
  "lupus-pathology": "msk-skin",
  "gout-crystals": "msk-skin",
  "osteoporosis-bone": "msk-skin",
  myopathies: "msk-skin",
  "collagen-disorders": "msk-skin",
  "stroke-localization": "behavioral-nervous",
  "ms-pathology": "behavioral-nervous",
  neurodegenerative: "behavioral-nervous",
  "seizure-mechanisms": "behavioral-nervous",
  "cranial-nerve-lesions": "behavioral-nervous",
  "psychiatric-pharmacology": "behavioral-nervous",
  "drug-moa-side-effects": "multisystem",
  "autonomic-pharmacology": "multisystem",
  "antibiotic-mechanisms": "blood-lymph-immune",
  "antiviral-agents": "blood-lymph-immune",
  "gram-positive-organisms": "blood-lymph-immune",
  "gram-negative-fungi-parasites": "blood-lymph-immune",
  "metabolic-pathways": "biostats-epi",
  "inborn-errors": "biostats-epi",
  "lysosomal-storage": "biostats-epi",
  "dna-repair-genetics": "biostats-epi",
  "study-designs": "biostats-epi",
  "sensitivity-specificity": "biostats-epi",

  // Step 2 clinical
  "acs-management": "cardiovascular",
  "chf-management": "cardiovascular",
  "arrhythmias-management": "cardiovascular",
  "valvular-disease-clinical": "cardiovascular",
  "pneumonia-workup": "respiratory-renal",
  "pe-workup": "respiratory-renal",
  "copd-asthma-exacerbation": "respiratory-renal",
  "gi-bleed-management": "gastrointestinal",
  "pancreatitis-hepatitis": "gastrointestinal",
  "aki-ckd-electrolytes": "respiratory-renal",
  "nephrotic-nephritic": "respiratory-renal",
  "diabetes-dka-management": "reproductive-endocrine",
  "thyroid-storm": "reproductive-endocrine",
  "sepsis-bundles": "multisystem",
  "hiv-opportunistic": "blood-lymph-immune",
  "rheumatology-autoimmune": "msk-skin",
  "stroke-management": "behavioral-nervous",
  "seizures-headaches": "behavioral-nervous",
  "dementia-workup": "behavioral-nervous",
  "preventive-screening": "social-sciences",
  "pre-post-op-care": "multisystem",
  "trauma-atls": "multisystem",
  "appendicitis-cholecystitis": "gastrointestinal",
  "bowel-obstruction": "gastrointestinal",
  "hernia-management": "gastrointestinal",
  "burns-management": "msk-skin",
  "developmental-milestones": "human-development",
  "pediatric-infections": "human-development",
  "congenital-heart-disease": "cardiovascular",
  "vaccination-schedules": "human-development",
  "child-abuse-red-flags": "social-sciences",
  "febrile-infant": "human-development",
  "prenatal-care": "reproductive-endocrine",
  "preeclampsia-eclampsia": "reproductive-endocrine",
  "labor-delivery": "reproductive-endocrine",
  "gyn-cancers": "reproductive-endocrine",
  contraception: "reproductive-endocrine",
  "menstrual-disorders": "reproductive-endocrine",
  "depression-bipolar": "behavioral-nervous",
  "schizophrenia-psychosis": "behavioral-nervous",
  "anxiety-disorders": "behavioral-nervous",
  "suicide-risk": "behavioral-nervous",
  "substance-use-disorders": "behavioral-nervous",
  "personality-disorders": "behavioral-nervous",

  // Step 3 / cross-cut
  "ambulatory-chronic-care": "multisystem",
  "inpatient-orders": "multisystem",
  "next-best-step": "multisystem",
  "lab-interpretation": "biostats-epi",
  "cost-effective-care": "social-sciences",
  "emergency-management": "multisystem",
  "post-op-fever": "multisystem",
  "acute-abdomen-ccs": "gastrointestinal",
  "ccs-initial-workup": "multisystem",
  "ccs-monitoring-escalation": "multisystem",
  "ccs-discharge-planning": "social-sciences",
  "ccs-orders-sequence": "multisystem",
  "nnt-arr": "biostats-epi",
  "sensitivity-specificity-lr": "biostats-epi",
  "study-design-appraisal": "biostats-epi",
  "informed-consent-capacity": "social-sciences",
  "confidentiality-reporting": "social-sciences",
  "end-of-life-ethics": "social-sciences",
  "well-child-preventive": "human-development",
  "pediatric-ccs": "human-development",
  "ob-labor-ccs": "reproductive-endocrine",
  "postpartum-complications": "reproductive-endocrine",
  "psychiatric-hospitalization": "behavioral-nervous",
  "medication-monitoring": "behavioral-nervous",
  "pharmaceutical-ads-abstracts": "biostats-epi",
  "biostatistics-interpretation": "biostats-epi",
  "ethics-professionalism": "social-sciences",
  "sdoh-health-equity": "social-sciences",
  "diagnostic-test-interpretation": "biostats-epi",
  "pharmacology-interactions": "multisystem",
  "emergency-acls": "cardiovascular",
};

function resolveSystem(slug: string, legacyCategoryId: string): UsmleOrganSystemId {
  return (
    TOPIC_SYSTEM_OVERRIDES[slug] ??
    LEGACY_CATEGORY_TO_SYSTEM[legacyCategoryId] ??
    "multisystem"
  );
}

function buildNodes(): UsmleTopicNode[] {
  const nodes: UsmleTopicNode[] = [];
  const groups: { step: UsmleStepLevel; groups: typeof USMLE_STEP1_TOPIC_GROUPS }[] = [
    { step: "step1", groups: USMLE_STEP1_TOPIC_GROUPS },
    { step: "step2", groups: USMLE_STEP2_TOPIC_GROUPS },
    { step: "step3", groups: USMLE_STEP3_TOPIC_GROUPS },
  ];
  for (const { step, groups: gs } of groups) {
    for (const g of gs) {
      for (const t of g.topics) {
        const systemId = resolveSystem(t.slug, g.categoryId);
        nodes.push({
          slug: t.slug,
          label: t.label,
          systemId,
          systems: [systemId],
          stepLevel: step,
          highYield: true,
          legacyCategoryId: g.categoryId,
        });
      }
    }
  }
  for (const t of USMLE_CROSS_CUTTING_TOPICS) {
    const systemId = resolveSystem(t.slug, "biostatistics");
    nodes.push({
      slug: t.slug,
      label: t.label,
      systemId,
      systems: [systemId],
      stepLevel: "step2",
      highYield: true,
      legacyCategoryId: "cross-cutting",
    });
  }
  return nodes;
}

export const USMLE_TOPIC_NODES: UsmleTopicNode[] = buildNodes();

const NODE_BY_SLUG = new Map(USMLE_TOPIC_NODES.map((n) => [n.slug, n]));

export function getUsmleTopicNode(slug: string): UsmleTopicNode | undefined {
  return NODE_BY_SLUG.get(slug);
}

export function resolveOrganSystemId(
  blueprintDomain?: string | null,
  blueprintTopic?: string | null,
  legacyCategory?: string | null
): UsmleOrganSystemId | null {
  if (blueprintTopic) {
    const node = NODE_BY_SLUG.get(blueprintTopic);
    if (node) return node.systemId;
    const override = TOPIC_SYSTEM_OVERRIDES[blueprintTopic];
    if (override) return override;
  }
  if (blueprintDomain && LEGACY_CATEGORY_TO_SYSTEM[blueprintDomain]) {
    return LEGACY_CATEGORY_TO_SYSTEM[blueprintDomain];
  }
  if (blueprintDomain && USMLE_ORGAN_SYSTEMS.some((s) => s.id === blueprintDomain)) {
    return blueprintDomain as UsmleOrganSystemId;
  }
  if (legacyCategory && LEGACY_CATEGORY_TO_SYSTEM[legacyCategory]) {
    return LEGACY_CATEGORY_TO_SYSTEM[legacyCategory];
  }
  return null;
}

export function topicsForOrganSystem(
  systemId: UsmleOrganSystemId,
  step?: UsmleStepLevel
): UsmleTopicNode[] {
  return USMLE_TOPIC_NODES.filter(
    (n) => n.systemId === systemId && (step == null || n.stepLevel === step)
  );
}

/** Subject ids preferred for generation by organ system. */
export const SYSTEM_SUBJECT_HINTS: Record<UsmleOrganSystemId, string[]> = {
  "human-development": ["pediatrics", "physiology"],
  "blood-lymph-immune": ["pathology", "microbiology", "internal-medicine"],
  "behavioral-nervous": ["neurology", "psychiatry", "pathology"],
  "msk-skin": ["pathology", "anatomy", "internal-medicine"],
  cardiovascular: ["cardiology", "physiology", "pathology"],
  "respiratory-renal": ["pulmonology", "nephrology", "physiology"],
  gastrointestinal: ["internal-medicine", "pathology"],
  "reproductive-endocrine": ["obgyn", "internal-medicine", "physiology"],
  multisystem: ["internal-medicine", "emergency-medicine", "pathology"],
  "biostats-epi": ["biochemistry", "internal-medicine"],
  "social-sciences": ["psychiatry", "internal-medicine"],
};

/** Build ExamBlueprint from official organ-system midpoints. */
export function buildSpineExamBlueprint(
  fieldId: string,
  examName: string,
  step: UsmleStepLevel,
  options?: { vignetteMinRatio?: number }
): ExamBlueprint {
  const weights = organSystemWeightsForStep(step);
  return {
    fieldId,
    examName,
    sourceNote: sourceNoteForStep(step),
    vignetteMinRatio: options?.vignetteMinRatio ?? (step === "step1" ? 0.55 : 0.75),
    categories: USMLE_ORGAN_SYSTEMS.map((sys) => {
      const topics = topicsForOrganSystem(sys.id, step)
        .slice(0, 8)
        .map((t) => t.label);
      return {
        id: sys.id,
        label: sys.label,
        weight: weights[sys.id] ?? 0.05,
        subjectIds: SYSTEM_SUBJECT_HINTS[sys.id] ?? ["internal-medicine"],
        highYieldTopics:
          topics.length > 0
            ? topics
            : [sys.shortLabel, "high-yield mechanisms", "clinical vignettes"],
      };
    }),
  };
}

/** Map official physician task → legacy generation task when needed. */
export function legacyPhysicianTaskFromOfficial(
  task: UsmleOfficialPhysicianTaskId
): string {
  switch (task) {
    case "foundational-science":
    case "lab-studies":
      return "interpretation";
    case "diagnosis":
    case "history-physical":
    case "prognosis":
      return "diagnosis";
    case "health-maintenance":
      return "health-maintenance";
    case "pharmacotherapy":
      return "pharmacotherapy";
    case "clinical-intervention":
    case "mixed-management":
      return "clinical-intervention";
    case "communication-sbp":
      return "communication";
    case "pbli":
      return "interpretation";
    default:
      return "diagnosis";
  }
}

export function listSpineOrganSystemIds(): UsmleOrganSystemId[] {
  return USMLE_ORGAN_SYSTEMS.map((s) => s.id);
}

export type { Usmle2026Topic };
