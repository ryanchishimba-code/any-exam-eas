/**
 * USMLE high-yield topic registry — step-aware domain taxonomy for Study Hub navigation.
 */
import type { DrugClassId } from "@/lib/drugs300/drug-classes";
import type { HighYieldTopic } from "@/types/edtech";
import type { UsmleStudyPresetId } from "@/lib/exam-prep/usmle/study-presets";
import type { UsmleStepLevel } from "@/lib/exam-prep/usmle/types";
import {
  USMLE_STEP1_TOPIC_GROUPS,
  USMLE_STEP2_TOPIC_GROUPS,
  USMLE_STEP3_TOPIC_GROUPS,
  USMLE_CROSS_CUTTING_TOPICS,
} from "@/lib/exam-prep/usmle/blueprint-topics-2026";

export type UsmleStudyDomainId = string;

export type UsmleStudyDomain = {
  id: UsmleStudyDomainId;
  label: string;
  shortLabel: string;
  weightPct: number;
  sortOrder: number;
  stepLevel: UsmleStepLevel;
};

/** Step-aware Study Hub domains = official organ-system spine. */
function buildOrganSystemDomains(step: UsmleStepLevel): UsmleStudyDomain[] {
  // Lazy import avoided — midpoints inlined from official midpoints / 100 for display.
  const midpoints: Record<UsmleStepLevel, Record<string, number>> = {
    step1: {
      "human-development": 2,
      "blood-lymph-immune": 11,
      "behavioral-nervous": 12,
      "msk-skin": 10,
      cardiovascular: 9,
      "respiratory-renal": 13,
      gastrointestinal: 8,
      "reproductive-endocrine": 14,
      multisystem: 10,
      "biostats-epi": 5,
      "social-sciences": 8,
    },
    step2: {
      "human-development": 3,
      "blood-lymph-immune": 8,
      "behavioral-nervous": 12,
      "msk-skin": 9,
      cardiovascular: 9,
      "respiratory-renal": 12,
      gastrointestinal: 8,
      "reproductive-endocrine": 10,
      multisystem: 6,
      "biostats-epi": 4,
      "social-sciences": 12,
    },
    step3: {
      "human-development": 2,
      "blood-lymph-immune": 8,
      "behavioral-nervous": 12,
      "msk-skin": 8,
      cardiovascular: 10,
      "respiratory-renal": 12,
      gastrointestinal: 8,
      "reproductive-endocrine": 10,
      multisystem: 8,
      "biostats-epi": 8,
      "social-sciences": 10,
    },
  };
  const labels: Record<string, { label: string; short: string }> = {
    "human-development": { label: "Human Development", short: "Development" },
    "blood-lymph-immune": { label: "Blood / Lymph / Immune", short: "Heme/Immune" },
    "behavioral-nervous": { label: "Behavioral Health & Nervous Systems", short: "Neuro/Psych" },
    "msk-skin": { label: "Musculoskeletal & Skin", short: "MSK/Skin" },
    cardiovascular: { label: "Cardiovascular System", short: "CV" },
    "respiratory-renal": { label: "Respiratory & Renal / Urinary", short: "Resp/Renal" },
    gastrointestinal: { label: "Gastrointestinal System", short: "GI" },
    "reproductive-endocrine": { label: "Reproductive & Endocrine", short: "Repro/Endo" },
    multisystem: { label: "Multisystem Processes & Disorders", short: "Multisystem" },
    "biostats-epi": { label: "Biostatistics & Epidemiology", short: "Biostats" },
    "social-sciences": { label: "Ethics, Communication & SBP", short: "Ethics/SBP" },
  };
  const order = Object.keys(labels);
  return order.map((id, i) => {
    const pct = midpoints[step][id] ?? 5;
    const meta = labels[id]!;
    return {
      id: `usmle-${id}`,
      label: `${meta.label} (~${pct}%)`,
      shortLabel: meta.short,
      weightPct: pct,
      sortOrder: i,
      stepLevel: step,
    };
  });
}

export const USMLE_STEP1_DOMAINS: UsmleStudyDomain[] = buildOrganSystemDomains("step1");
export const USMLE_STEP2_DOMAINS: UsmleStudyDomain[] = buildOrganSystemDomains("step2");
export const USMLE_STEP3_DOMAINS: UsmleStudyDomain[] = buildOrganSystemDomains("step3");

export type UsmleTopicMeta = {
  studyDomain: UsmleStudyDomainId;
  blueprintTopicSlugs?: string[];
  relatedDrugClasses?: Exclude<DrugClassId, "all">[];
  top500DrugSlugs?: string[];
  relatedPresetIds?: UsmleStudyPresetId[];
  primary?: boolean;
};

/** Maps blueprint categoryId / spine system → study domain per step. */
const STEP1_CATEGORY_DOMAIN: Record<string, UsmleStudyDomainId> = {
  cardiovascular: "usmle-cardiovascular",
  "respiratory-renal": "usmle-respiratory-renal",
  gastrointestinal: "usmle-gastrointestinal",
  "reproductive-endocrine": "usmle-reproductive-endocrine",
  "hematology-immunology": "usmle-blood-lymph-immune",
  "blood-lymph-immune": "usmle-blood-lymph-immune",
  musculoskeletal: "usmle-msk-skin",
  "msk-skin": "usmle-msk-skin",
  "behavioral-nervous": "usmle-behavioral-nervous",
  "pharmacology-microbiology": "usmle-multisystem",
  "biochemistry-genetics": "usmle-biostats-epi",
  "biostats-epi": "usmle-biostats-epi",
  "human-development": "usmle-human-development",
  multisystem: "usmle-multisystem",
  "social-sciences": "usmle-social-sciences",
  anatomy: "usmle-msk-skin",
  physiology: "usmle-multisystem",
  pathology: "usmle-multisystem",
  pharmacology: "usmle-multisystem",
  biochemistry: "usmle-biostats-epi",
  microbiology: "usmle-blood-lymph-immune",
};

const STEP2_CATEGORY_DOMAIN: Record<string, UsmleStudyDomainId> = {
  ...STEP1_CATEGORY_DOMAIN,
  "internal-medicine": "usmle-multisystem",
  "surgery-acute-care": "usmle-multisystem",
  pediatrics: "usmle-human-development",
  obgyn: "usmle-reproductive-endocrine",
  psychiatry: "usmle-behavioral-nervous",
  cardiology: "usmle-cardiovascular",
  pulmonology: "usmle-respiratory-renal",
  nephrology: "usmle-respiratory-renal",
  neurology: "usmle-behavioral-nervous",
  "emergency-medicine": "usmle-multisystem",
};

const STEP3_CATEGORY_DOMAIN: Record<string, UsmleStudyDomainId> = {
  ...STEP2_CATEGORY_DOMAIN,
  surgery: "usmle-multisystem",
  ccs: "usmle-multisystem",
  biostatistics: "usmle-biostats-epi",
  ethics: "usmle-social-sciences",
  "pharm-advertising": "usmle-biostats-epi",
};

/** Flagship review-module and broad topic slugs — explicit domain mapping. */
const USMLE_TOPIC_REGISTRY: Record<string, UsmleTopicMeta> = {
  // Step 1 flagship modules
  "pathology-neoplasia": {
    studyDomain: "usmle-multisystem",
    primary: true,
    relatedPresetIds: ["step1-path-drill"],
  },
  "pharmacology-moa": {
    studyDomain: "usmle-multisystem",
    primary: true,
    relatedDrugClasses: ["cardiovascular", "antibiotics", "cns-psych", "endocrine"],
    top500DrugSlugs: ["metoprolol", "lisinopril", "amoxicillin", "sertraline", "metformin"],
    relatedPresetIds: ["step1-pharm-drill"],
  },
  "physiology-systems": { studyDomain: "usmle-respiratory-renal", primary: true },
  "biochemistry-metabolism": { studyDomain: "usmle-biostats-epi", primary: true },
  "microbiology-immunology": {
    studyDomain: "usmle-blood-lymph-immune",
    primary: true,
    relatedDrugClasses: ["antibiotics", "immunologic-other"],
    top500DrugSlugs: ["amoxicillin", "azithromycin", "vancomycin"],
  },
  "anatomy-embryology": { studyDomain: "usmle-msk-skin", primary: true },

  // Step 2 flagship modules
  "acute-coronary-syndrome": {
    studyDomain: "usmle-cardiovascular",
    primary: true,
    relatedDrugClasses: ["cardiovascular", "pain-inflammation"],
    top500DrugSlugs: ["aspirin", "metoprolol", "lisinopril", "atorvastatin", "heparin"],
    relatedPresetIds: ["step2-cardiology-block"],
  },
  cardiovascular: {
    studyDomain: "usmle-cardiovascular",
    primary: true,
    relatedDrugClasses: ["cardiovascular"],
    top500DrugSlugs: ["metoprolol", "furosemide", "amlodipine", "losartan"],
    relatedPresetIds: ["step2-cardiology-block"],
  },
  pulmonary: {
    studyDomain: "usmle-respiratory-renal",
    primary: true,
    relatedDrugClasses: ["respiratory"],
    top500DrugSlugs: ["albuterol", "montelukast", "prednisone"],
    relatedPresetIds: ["step2-pulmonary-block"],
  },
  "renal-electrolytes": {
    studyDomain: "usmle-respiratory-renal",
    primary: true,
    relatedDrugClasses: ["cardiovascular", "endocrine"],
    top500DrugSlugs: ["furosemide", "hydrochlorothiazide", "potassium-chloride"],
  },
  "endocrine-dm": {
    studyDomain: "usmle-reproductive-endocrine",
    primary: true,
    relatedDrugClasses: ["endocrine"],
    top500DrugSlugs: ["metformin", "insulin-glargine", "levothyroxine", "glucagon"],
    relatedPresetIds: ["step2-endocrine-block"],
  },
  gastroenterology: {
    studyDomain: "usmle-gastrointestinal",
    primary: true,
    relatedDrugClasses: ["gastrointestinal"],
    top500DrugSlugs: ["omeprazole", "pantoprazole", "ondansetron"],
  },
  "infectious-disease": {
    studyDomain: "usmle-blood-lymph-immune",
    primary: true,
    relatedDrugClasses: ["antibiotics"],
    top500DrugSlugs: ["vancomycin", "azithromycin", "amoxicillin", "ciprofloxacin"],
    relatedPresetIds: ["step2-id-block"],
  },
  "neurology-stroke": {
    studyDomain: "usmle-behavioral-nervous",
    primary: true,
    relatedDrugClasses: ["cardiovascular", "cns-psych"],
    top500DrugSlugs: ["alteplase", "levetiracetam", "aspirin"],
  },
  "hematology-oncology": {
    studyDomain: "usmle-blood-lymph-immune",
    primary: true,
    relatedDrugClasses: ["immunologic-other"],
  },
  rheumatology: { studyDomain: "usmle-blood-lymph-immune", primary: true },
  obstetrics: { studyDomain: "usmle-human-development", primary: true },
  pediatrics: { studyDomain: "usmle-human-development", primary: true },
  psychiatry: {
    studyDomain: "usmle-behavioral-nervous",
    primary: true,
    relatedDrugClasses: ["cns-psych"],
    top500DrugSlugs: ["sertraline", "escitalopram", "bupropion", "gabapentin"],
    relatedPresetIds: ["step2-psych-block"],
  },
  "emergency-toxicology": {
    studyDomain: "usmle-multisystem",
    primary: true,
    relatedDrugClasses: ["pain-inflammation", "cns-psych"],
    top500DrugSlugs: ["naloxone", "epinephrine", "acetaminophen"],
  },
  "dermatology-allergic": {
    studyDomain: "usmle-msk-skin",
    primary: true,
    blueprintTopicSlugs: ["dermatology-allergic"],
    relatedDrugClasses: ["respiratory", "immunologic-other"],
  },
  "ethics-biostats": { studyDomain: "usmle-biostats-epi" },

  // Step 3 flagship modules
  "biostatistics-epidemiology": {
    studyDomain: "usmle-biostats-epi",
    primary: true,
    relatedPresetIds: ["step3-biostats-sprint"],
  },
  "medical-ethics-legal": { studyDomain: "usmle-social-sciences", primary: true },
  "ccs-case-management": {
    studyDomain: "usmle-multisystem",
    primary: true,
    relatedPresetIds: ["step3-ccs-drill"],
  },
  "pharmaceutical-ads-abstracts": { studyDomain: "usmle-biostats-epi", primary: true, blueprintTopicSlugs: ["pharmaceutical-ads-abstracts"] },
  "next-best-step": {
    studyDomain: "usmle-multisystem",
    primary: true,
    relatedPresetIds: ["step3-ccs-drill"],
  },
  "ccs-monitoring-escalation": {
    studyDomain: "usmle-multisystem",
    primary: true,
    relatedPresetIds: ["step3-ccs-drill"],
  },
  "ccs-initial-workup": {
    studyDomain: "usmle-multisystem",
    primary: true,
    relatedPresetIds: ["step3-ccs-drill"],
  },
  "ambulatory-chronic-care": {
    studyDomain: "usmle-multisystem",
    primary: true,
  },
  "nnt-arr": {
    studyDomain: "usmle-biostats-epi",
    primary: true,
    relatedPresetIds: ["step3-biostats-sprint"],
  },

  // Cross-cutting 2026 topics
  "biostatistics-interpretation": { studyDomain: "usmle-biostats-epi" },
  "ethics-professionalism": { studyDomain: "usmle-social-sciences" },
  "sdoh-health-equity": { studyDomain: "usmle-social-sciences" },
  "diagnostic-test-interpretation": { studyDomain: "usmle-biostats-epi" },
  "pharmacology-interactions": {
    studyDomain: "usmle-multisystem",
    relatedDrugClasses: ["cardiovascular", "antibiotics", "cns-psych", "endocrine"],
    top500DrugSlugs: ["warfarin", "simvastatin", "sertraline"],
  },
  "emergency-acls": {
    studyDomain: "usmle-multisystem",
    relatedDrugClasses: ["cardiovascular"],
    top500DrugSlugs: ["epinephrine", "amiodarone", "atropine"],
  },
  "sig-code-abbreviations": {
    studyDomain: "usmle-multisystem",
    blueprintTopicSlugs: ["drug-moa-side-effects", "pharmacology-interactions"],
  },
};

function build2026Registry(): Record<string, UsmleTopicMeta> {
  const out: Record<string, UsmleTopicMeta> = {};

  for (const group of USMLE_STEP1_TOPIC_GROUPS) {
    const domain = STEP1_CATEGORY_DOMAIN[group.categoryId] ?? "usmle-s1-pathology";
    for (const t of group.topics) {
      out[t.slug] = { studyDomain: domain, blueprintTopicSlugs: [t.slug] };
    }
  }
  for (const group of USMLE_STEP2_TOPIC_GROUPS) {
    const domain = STEP2_CATEGORY_DOMAIN[group.categoryId] ?? "usmle-s2-cardiopulmonary";
    for (const t of group.topics) {
      // Refine IM topics to correct organ-system domains
      const refined = refineStep2InternalMedicineDomain(t.slug, domain);
      out[t.slug] = { studyDomain: refined, blueprintTopicSlugs: [t.slug] };
    }
  }
  for (const group of USMLE_STEP3_TOPIC_GROUPS) {
    const domain = STEP3_CATEGORY_DOMAIN[group.categoryId] ?? "usmle-s3-ccs";
    for (const t of group.topics) {
      out[t.slug] = { studyDomain: domain, blueprintTopicSlugs: [t.slug] };
    }
  }
  for (const t of USMLE_CROSS_CUTTING_TOPICS) {
    if (!out[t.slug]) {
      out[t.slug] = { studyDomain: "usmle-biostats-epi", blueprintTopicSlugs: [t.slug] };
    }
  }
  return out;
}

function refineStep2InternalMedicineDomain(slug: string, defaultDomain: UsmleStudyDomainId): UsmleStudyDomainId {
  if (
    slug.includes("pneumonia") ||
    slug.includes("copd") ||
    slug.includes("pe-") ||
    slug.includes("asthma")
  ) {
    return "usmle-s2-cardiopulmonary";
  }
  if (
    slug.includes("aki") ||
    slug.includes("nephro") ||
    slug.includes("diabetes") ||
    slug.includes("thyroid") ||
    slug.includes("dka") ||
    slug.includes("electrolyte")
  ) {
    return "usmle-s2-nephro-endocrine";
  }
  if (
    slug.includes("gi-") ||
    slug.includes("pancreatitis") ||
    slug.includes("hepatitis") ||
    slug.includes("cirrhosis")
  ) {
    return "usmle-s2-gi-hepatology";
  }
  if (slug.includes("hiv") || slug.includes("sepsis") || slug.includes("infection")) {
    return "usmle-s2-infectious";
  }
  if (slug.includes("stroke") || slug.includes("seizure") || slug.includes("headache") || slug.includes("dementia")) {
    return "usmle-s2-neuro";
  }
  if (slug.includes("rheumat") || slug.includes("lupus") || slug.includes("autoimmune")) {
    return "usmle-s2-heme-rheum";
  }
  if (slug.includes("acs") || slug.includes("chf") || slug.includes("arrhythmia") || slug.includes("valvular")) {
    return "usmle-s2-cardiopulmonary";
  }
  if (slug.includes("preventive") || slug.includes("screening")) {
    return "usmle-s2-cardiopulmonary";
  }
  return defaultDomain;
}

const FULL_REGISTRY: Record<string, UsmleTopicMeta> = {
  ...build2026Registry(),
  ...USMLE_TOPIC_REGISTRY,
};

const ALL_DOMAINS = [...USMLE_STEP1_DOMAINS, ...USMLE_STEP2_DOMAINS, ...USMLE_STEP3_DOMAINS];
const DOMAIN_BY_ID = new Map(ALL_DOMAINS.map((d) => [d.id, d]));

/** Blueprint category id → primary topic slug, keyed by USMLE field id. */
const USMLE_CATEGORY_PRIMARY: Record<string, Record<string, string>> = {
  "usmle-step-1": {
    anatomy: "anatomy-embryology",
    physiology: "physiology-systems",
    pathology: "pathology-neoplasia",
    pharmacology: "pharmacology-moa",
    biochemistry: "biochemistry-metabolism",
    microbiology: "microbiology-immunology",
  },
  "usmle-step-2": {
    cardiovascular: "acute-coronary-syndrome",
    respiratory: "pulmonary",
    gastrointestinal: "gastroenterology",
    endocrine: "endocrine-dm",
    "infectious-disease": "infectious-disease",
    "internal-medicine": "renal-electrolytes",
    surgery: "emergency-toxicology",
    pediatrics: "pediatrics",
    obgyn: "obstetrics",
    psychiatry: "psychiatry",
    "emergency-medicine": "emergency-toxicology",
  },
  "usmle-step-3": {
    "internal-medicine": "cardiovascular",
    surgery: "emergency-toxicology",
    pediatrics: "pediatrics",
    obgyn: "obstetrics",
    psychiatry: "psychiatry",
    biostatistics: "biostatistics-epidemiology",
    ethics: "medical-ethics-legal",
    "pharm-advertising": "pharmaceutical-ads-abstracts",
    ccs: "ccs-case-management",
  },
};

const USMLE_SUBJECT_PRIMARY: Record<string, string> = {
  cardiology: "acute-coronary-syndrome",
  pulmonology: "pulmonary",
  nephrology: "renal-electrolytes",
  pharmacology: "pharmacology-moa",
  pathology: "pathology-neoplasia",
  physiology: "physiology-systems",
  biochemistry: "biochemistry-metabolism",
  microbiology: "microbiology-immunology",
  anatomy: "anatomy-embryology",
  psychiatry: "psychiatry",
  pediatrics: "pediatrics",
  obgyn: "obstetrics",
  "emergency-medicine": "emergency-toxicology",
  "internal-medicine": "renal-electrolytes",
};

export function getUsmleStudyDomains(step: UsmleStepLevel): UsmleStudyDomain[] {
  if (step === "step1") return USMLE_STEP1_DOMAINS;
  if (step === "step3") return USMLE_STEP3_DOMAINS;
  return USMLE_STEP2_DOMAINS;
}

export function getUsmleStudyDomain(id: string): UsmleStudyDomain | undefined {
  return DOMAIN_BY_ID.get(id);
}

export function getUsmleTopicMeta(slug: string): Partial<UsmleTopicMeta> {
  return FULL_REGISTRY[slug] ?? {};
}

export function enrichUsmleTopic(topic: HighYieldTopic): HighYieldTopic {
  const meta = FULL_REGISTRY[topic.slug];
  if (!meta) return topic;
  const domain = getUsmleStudyDomain(meta.studyDomain);
  return {
    ...topic,
    category: domain?.label ?? topic.category,
    clientNeedsDomain: meta.studyDomain,
    blueprintTopicSlugs: meta.blueprintTopicSlugs ?? topic.blueprintTopicSlugs,
    relatedDrugClasses: meta.relatedDrugClasses,
    top500DrugSlugs: meta.top500DrugSlugs,
    relatedPresetIds: meta.relatedPresetIds,
  };
}

export function enrichUsmleTopics(topics: HighYieldTopic[]): HighYieldTopic[] {
  return topics.map(enrichUsmleTopic);
}

export function groupUsmleTopicsByDomain(
  topics: HighYieldTopic[],
  step: UsmleStepLevel
): Array<{ domain: UsmleStudyDomain; topics: HighYieldTopic[] }> {
  const domains = getUsmleStudyDomains(step);
  return domains
    .map((domain) => ({
      domain,
      topics: topics.filter((t) => t.clientNeedsDomain === domain.id),
    }))
    .filter((g) => g.topics.length > 0);
}

export function resolveUsmleTopicSlugForBlueprint(blueprintSlug: string): string | undefined {
  const normalized = blueprintSlug.toLowerCase();
  if (FULL_REGISTRY[blueprintSlug]?.studyDomain) return blueprintSlug;
  for (const [slug, meta] of Object.entries(FULL_REGISTRY)) {
    if (meta.blueprintTopicSlugs?.some((b) => b.toLowerCase() === normalized)) {
      return slug;
    }
  }
  return undefined;
}

export function resolveUsmleTopicSlugForCategory(
  categoryId: string,
  fieldId: string
): string | undefined {
  return USMLE_CATEGORY_PRIMARY[fieldId]?.[categoryId];
}

export function resolveUsmleTopicSlugForSubject(
  subjectId: string,
  fieldId?: string
): string | undefined {
  const fromSubject = USMLE_SUBJECT_PRIMARY[subjectId];
  if (fromSubject) return fromSubject;
  if (fieldId) {
    return USMLE_CATEGORY_PRIMARY[fieldId]?.[subjectId];
  }
  return undefined;
}

export function usmleStepFromShortLabel(label?: string | null): UsmleStepLevel {
  if (!label) return "step2";
  if (label.includes("1")) return "step1";
  if (label.includes("3")) return "step3";
  return "step2";
}
