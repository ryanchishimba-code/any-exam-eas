/**
 * Recommended NCLEX study sequence — mirrors the 4-week plan and blueprint weights.
 * Topics appear in pedagogical order (judgment → pharm → clinical → NGN).
 */
export type NclexLearningPhase = {
  id: string;
  title: string;
  description: string;
  topicSlugs: string[];
};

export const NCLEX_LEARNING_PHASES: NclexLearningPhase[] = [
  {
    id: "foundation",
    title: "Foundation & Judgment",
    description: "Safety, prioritization, delegation, and legal basics — start here.",
    topicSlugs: [
      "infection-control",
      "prioritization",
      "delegation",
      "legal-ethical",
      "disaster-triage",
      "quality-improvement",
    ],
  },
  {
    id: "pharm-core",
    title: "Pharmacology Core",
    description: "High-alert meds, calculations, anticoagulation, and antidotes.",
    topicSlugs: [
      "medication-safety",
      "dosage-calculations",
      "anticoagulation-nursing",
      "drug-interactions-antidotes",
      "iv-fluids-blood-products",
    ],
  },
  {
    id: "pharm-systems",
    title: "Pharm by System",
    description: "Cardiovascular, antibiotics, psychotropics, and pain management.",
    topicSlugs: [
      "cardiovascular-meds-nursing",
      "antibiotics-nursing",
      "psychotropics-nursing",
      "pain-opioids",
    ],
  },
  {
    id: "clinical-acute",
    title: "Acute Clinical",
    description: "Sepsis, electrolytes, and major organ systems.",
    topicSlugs: [
      "sepsis-shock",
      "electrolytes",
      "cardiovascular",
      "respiratory",
      "diabetes",
      "renal",
      "neurologic",
      "gi-emergencies",
      "heme-oncology",
      "burns-trauma",
    ],
  },
  {
    id: "specialty",
    title: "Maternal, Peds & Psych",
    description: "OB, newborn, immunizations, development, and mental health.",
    topicSlugs: [
      "postpartum",
      "prenatal-labor-monitoring",
      "newborn-assessment",
      "pediatrics",
      "immunization-schedules",
      "developmental-milestones",
      "psychiatric",
    ],
  },
  {
    id: "risk-reduction",
    title: "Risk Reduction & Labs",
    description: "Critical values, procedures, and chemo monitoring.",
    topicSlugs: [
      "critical-lab-values",
      "pre-post-procedure",
      "chemotherapy-toxicity",
    ],
  },
  {
    id: "ngn",
    title: "NGN Exam Strategy",
    description: "SATA, bow-tie, and unfolding case study techniques.",
    topicSlugs: ["sata-mastery", "bow-tie-ngn", "case-study-ngn"],
  },
];

/** Flat ordered slug list for Continue Learning and panel navigation. */
export const NCLEX_LEARNING_PATH_ORDER: string[] = NCLEX_LEARNING_PHASES.flatMap(
  (p) => p.topicSlugs
);

const PATH_INDEX = new Map(
  NCLEX_LEARNING_PATH_ORDER.map((slug, index) => [slug, index] as const)
);

export function nclexPathIndex(slug: string): number {
  return PATH_INDEX.get(slug) ?? 9999;
}

export function sortTopicsByNclexPath<T extends { slug: string }>(topics: T[]): T[] {
  return [...topics].sort((a, b) => nclexPathIndex(a.slug) - nclexPathIndex(b.slug));
}
