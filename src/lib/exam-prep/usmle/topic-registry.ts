/**
 * USMLE high-yield topic registry — step-aware domain taxonomy for Study Hub navigation.
 */
import type { HighYieldTopic } from "@/types/edtech";
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

/** Step 1 — basic science disciplines (First Aid / Pathoma lecture order). */
export const USMLE_STEP1_DOMAINS: UsmleStudyDomain[] = [
  {
    id: "usmle-s1-pathology",
    label: "Pathology & Neoplasia (~22%)",
    shortLabel: "Pathology",
    weightPct: 22,
    sortOrder: 0,
    stepLevel: "step1",
  },
  {
    id: "usmle-s1-pharmacology",
    label: "Pharmacology (~18%)",
    shortLabel: "Pharmacology",
    weightPct: 18,
    sortOrder: 1,
    stepLevel: "step1",
  },
  {
    id: "usmle-s1-physiology",
    label: "Physiology & Systems Integration (~16%)",
    shortLabel: "Physiology",
    weightPct: 16,
    sortOrder: 2,
    stepLevel: "step1",
  },
  {
    id: "usmle-s1-biochemistry",
    label: "Biochemistry & Genetics (~14%)",
    shortLabel: "Biochemistry",
    weightPct: 14,
    sortOrder: 3,
    stepLevel: "step1",
  },
  {
    id: "usmle-s1-micro-immuno",
    label: "Microbiology & Immunology (~14%)",
    shortLabel: "Micro/Immuno",
    weightPct: 14,
    sortOrder: 4,
    stepLevel: "step1",
  },
  {
    id: "usmle-s1-anatomy",
    label: "Anatomy & Embryology (~8%)",
    shortLabel: "Anatomy",
    weightPct: 8,
    sortOrder: 5,
    stepLevel: "step1",
  },
  {
    id: "usmle-s1-biostatistics",
    label: "Biostatistics & Behavioral (~8%)",
    shortLabel: "Biostatistics",
    weightPct: 8,
    sortOrder: 6,
    stepLevel: "step1",
  },
];

/** Step 2 CK — clerkship-aligned organ systems. */
export const USMLE_STEP2_DOMAINS: UsmleStudyDomain[] = [
  {
    id: "usmle-s2-cardiopulmonary",
    label: "Cardiovascular & Pulmonary (~25%)",
    shortLabel: "Cardiopulmonary",
    weightPct: 25,
    sortOrder: 0,
    stepLevel: "step2",
  },
  {
    id: "usmle-s2-nephro-endocrine",
    label: "Renal, Endocrine & Electrolytes (~18%)",
    shortLabel: "Renal/Endocrine",
    weightPct: 18,
    sortOrder: 1,
    stepLevel: "step2",
  },
  {
    id: "usmle-s2-gi-hepatology",
    label: "GI & Hepatology (~12%)",
    shortLabel: "GI/Hepatology",
    weightPct: 12,
    sortOrder: 2,
    stepLevel: "step2",
  },
  {
    id: "usmle-s2-infectious",
    label: "Infectious Disease (~12%)",
    shortLabel: "Infectious",
    weightPct: 12,
    sortOrder: 3,
    stepLevel: "step2",
  },
  {
    id: "usmle-s2-neuro",
    label: "Neurology (~10%)",
    shortLabel: "Neurology",
    weightPct: 10,
    sortOrder: 4,
    stepLevel: "step2",
  },
  {
    id: "usmle-s2-heme-rheum",
    label: "Hematology, Oncology & Rheumatology (~10%)",
    shortLabel: "Heme/Rheum",
    weightPct: 10,
    sortOrder: 5,
    stepLevel: "step2",
  },
  {
    id: "usmle-s2-ob-peds",
    label: "OB/GYN & Pediatrics (~10%)",
    shortLabel: "OB/Peds",
    weightPct: 10,
    sortOrder: 6,
    stepLevel: "step2",
  },
  {
    id: "usmle-s2-psych",
    label: "Psychiatry (~6%)",
    shortLabel: "Psychiatry",
    weightPct: 6,
    sortOrder: 7,
    stepLevel: "step2",
  },
  {
    id: "usmle-s2-emergency",
    label: "Emergency & Toxicology (~5%)",
    shortLabel: "Emergency",
    weightPct: 5,
    sortOrder: 8,
    stepLevel: "step2",
  },
  {
    id: "usmle-s2-derm",
    label: "Dermatology & Allergy (~2%)",
    shortLabel: "Derm/Allergy",
    weightPct: 2,
    sortOrder: 9,
    stepLevel: "step2",
  },
];

/** Step 3 — CCS, biostatistics, ethics, evidence appraisal. */
export const USMLE_STEP3_DOMAINS: UsmleStudyDomain[] = [
  {
    id: "usmle-s3-ccs",
    label: "CCS Case Management (~35%)",
    shortLabel: "CCS",
    weightPct: 35,
    sortOrder: 0,
    stepLevel: "step3",
  },
  {
    id: "usmle-s3-biostatistics",
    label: "Biostatistics & Epidemiology (~25%)",
    shortLabel: "Biostatistics",
    weightPct: 25,
    sortOrder: 1,
    stepLevel: "step3",
  },
  {
    id: "usmle-s3-ethics",
    label: "Ethics & Legal Medicine (~20%)",
    shortLabel: "Ethics",
    weightPct: 20,
    sortOrder: 2,
    stepLevel: "step3",
  },
  {
    id: "usmle-s3-evidence",
    label: "Pharmaceutical Ads & Abstracts (~20%)",
    shortLabel: "Evidence",
    weightPct: 20,
    sortOrder: 3,
    stepLevel: "step3",
  },
];

export type UsmleTopicMeta = {
  studyDomain: UsmleStudyDomainId;
  blueprintTopicSlugs?: string[];
  primary?: boolean;
};

/** Maps blueprint categoryId → study domain per step. */
const STEP1_CATEGORY_DOMAIN: Record<string, UsmleStudyDomainId> = {
  cardiovascular: "usmle-s1-pathology",
  "respiratory-renal": "usmle-s1-physiology",
  gastrointestinal: "usmle-s1-pathology",
  "reproductive-endocrine": "usmle-s1-pathology",
  "hematology-immunology": "usmle-s1-micro-immuno",
  musculoskeletal: "usmle-s1-pathology",
  "behavioral-nervous": "usmle-s1-anatomy",
  "pharmacology-microbiology": "usmle-s1-pharmacology",
  "biochemistry-genetics": "usmle-s1-biochemistry",
};

const STEP2_CATEGORY_DOMAIN: Record<string, UsmleStudyDomainId> = {
  "internal-medicine": "usmle-s2-cardiopulmonary",
  "surgery-acute-care": "usmle-s2-emergency",
  pediatrics: "usmle-s2-ob-peds",
  obgyn: "usmle-s2-ob-peds",
  psychiatry: "usmle-s2-psych",
};

const STEP3_CATEGORY_DOMAIN: Record<string, UsmleStudyDomainId> = {
  "internal-medicine": "usmle-s3-ccs",
  surgery: "usmle-s3-ccs",
  ccs: "usmle-s3-ccs",
  biostatistics: "usmle-s3-biostatistics",
  ethics: "usmle-s3-ethics",
  "pharm-advertising": "usmle-s3-evidence",
};

/** Flagship review-module and broad topic slugs — explicit domain mapping. */
const USMLE_TOPIC_REGISTRY: Record<string, UsmleTopicMeta> = {
  // Step 1 flagship modules
  "pathology-neoplasia": { studyDomain: "usmle-s1-pathology", primary: true },
  "pharmacology-moa": { studyDomain: "usmle-s1-pharmacology", primary: true },
  "physiology-systems": { studyDomain: "usmle-s1-physiology", primary: true },
  "biochemistry-metabolism": { studyDomain: "usmle-s1-biochemistry", primary: true },
  "microbiology-immunology": { studyDomain: "usmle-s1-micro-immuno", primary: true },
  "anatomy-embryology": { studyDomain: "usmle-s1-anatomy", primary: true },

  // Step 2 flagship modules
  "acute-coronary-syndrome": { studyDomain: "usmle-s2-cardiopulmonary", primary: true },
  cardiovascular: { studyDomain: "usmle-s2-cardiopulmonary", primary: true },
  pulmonary: { studyDomain: "usmle-s2-cardiopulmonary", primary: true },
  "renal-electrolytes": { studyDomain: "usmle-s2-nephro-endocrine", primary: true },
  "endocrine-dm": { studyDomain: "usmle-s2-nephro-endocrine", primary: true },
  gastroenterology: { studyDomain: "usmle-s2-gi-hepatology", primary: true },
  "infectious-disease": { studyDomain: "usmle-s2-infectious", primary: true },
  "neurology-stroke": { studyDomain: "usmle-s2-neuro", primary: true },
  "hematology-oncology": { studyDomain: "usmle-s2-heme-rheum", primary: true },
  rheumatology: { studyDomain: "usmle-s2-heme-rheum", primary: true },
  obstetrics: { studyDomain: "usmle-s2-ob-peds", primary: true },
  pediatrics: { studyDomain: "usmle-s2-ob-peds", primary: true },
  psychiatry: { studyDomain: "usmle-s2-psych", primary: true },
  "emergency-toxicology": { studyDomain: "usmle-s2-emergency", primary: true },
  "dermatology-allergic": { studyDomain: "usmle-s2-derm", primary: true },
  "ethics-biostats": { studyDomain: "usmle-s3-biostatistics" },

  // Step 3 flagship modules
  "biostatistics-epidemiology": { studyDomain: "usmle-s3-biostatistics", primary: true },
  "medical-ethics-legal": { studyDomain: "usmle-s3-ethics", primary: true },
  "ccs-case-management": { studyDomain: "usmle-s3-ccs", primary: true },
  "pharmaceutical-ads-abstracts": { studyDomain: "usmle-s3-evidence", primary: true },

  // Cross-cutting 2026 topics
  "biostatistics-interpretation": { studyDomain: "usmle-s3-biostatistics" },
  "ethics-professionalism": { studyDomain: "usmle-s3-ethics" },
  "sdoh-health-equity": { studyDomain: "usmle-s3-ethics" },
  "diagnostic-test-interpretation": { studyDomain: "usmle-s3-biostatistics" },
  "pharmacology-interactions": { studyDomain: "usmle-s1-pharmacology" },
  "emergency-acls": { studyDomain: "usmle-s2-emergency" },
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
      out[t.slug] = { studyDomain: "usmle-s3-biostatistics", blueprintTopicSlugs: [t.slug] };
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
  for (const [slug, meta] of Object.entries(FULL_REGISTRY)) {
    if (meta.blueprintTopicSlugs?.some((b) => b.toLowerCase() === blueprintSlug.toLowerCase())) {
      return slug;
    }
  }
  return undefined;
}

export function usmleStepFromShortLabel(label?: string | null): UsmleStepLevel {
  if (!label) return "step2";
  if (label.includes("1")) return "step1";
  if (label.includes("3")) return "step3";
  return "step2";
}
