/**
 * Curated bridge from Study Guide chapters to each exam's high-yield topic
 * vocabulary (`NCLEX_TOPIC_REGISTRY`, `NAPLEX_TOPIC_REGISTRY`).
 *
 * `sg_chapters` carries no taxonomy of its own, so there is nothing to join on.
 * The mapping is hand-written rather than derived from chapter titles because a
 * wrong match on clinical content is worse for a candidate than no match at all
 * — "Renal & Fluids" should not fuzzy-match "Reduction of Risk".
 *
 * Keyed by exam because chapter slugs collide between books: both have
 * `exam-strategy`, `endocrine`, `respiratory`, and `quick-reference`.
 *
 * Topic slugs are validated against the registries in `chapter-topics.test.ts`,
 * so a renamed or retired topic fails the suite instead of rendering a dead link.
 */

import type { StudyGuideExam } from "./guide-registry";

/** Chapter slug (from `slugFromFilename` at ingest) → topic slugs, most relevant first. */
type ChapterTopicMap = Record<string, readonly string[]>;

const NCLEX_CHAPTER_TOPICS: ChapterTopicMap = {
  // Front and back matter are navigational, not clinical — deliberately empty.
  "front-matter": [],
  "exam-strategy": ["sata-mastery", "bow-tie-ngn", "case-study-ngn"],
  "fundamentals-safety": ["infection-control", "pain-opioids", "pre-post-procedure"],
  "management-of-care": [
    "prioritization",
    "delegation",
    "legal-ethical",
    "disaster-triage",
    "quality-improvement",
  ],
  cardiac: [
    "cardiovascular",
    "cardiovascular-meds-nursing",
    "anticoagulation-nursing",
    "sepsis-shock",
  ],
  respiratory: ["respiratory"],
  neuro: ["neurologic"],
  endocrine: ["diabetes"],
  "renal-fluids": ["renal", "electrolytes", "iv-fluids-blood-products", "critical-lab-values"],
  "gi-hepatic": ["gi-emergencies"],
  "other-medsurg": ["burns-trauma", "heme-oncology", "chemotherapy-toxicity"],
  "maternity-newborn": ["prenatal-labor-monitoring", "postpartum", "newborn-assessment"],
  pediatrics: ["pediatrics", "developmental-milestones", "immunization-schedules"],
  psych: ["psychiatric", "psychotropics-nursing"],
  pharmacology: [
    "medication-safety",
    "dosage-calculations",
    "drug-interactions-antidotes",
    "antibiotics-nursing",
    "sig-code-abbreviations",
  ],
  "quick-reference": ["critical-lab-values", "dosage-calculations"],
  "back-matter": [],
};

/**
 * NAPLEX mapping, derived from each chapter's own `## Topic X — …` headings
 * rather than from its title, so the pairings follow the manuscript.
 */
const NAPLEX_CHAPTER_TOPICS: ChapterTopicMap = {
  "front-matter": [],
  // Item-type frameworks and study plans. The registry has no counterpart, and
  // an approximate match here would be worse than offering nothing.
  "exam-strategy": [],
  "foundational-knowledge": [
    "biostatistics-study-design",
    "pharmacokinetics-pk-pd",
    "compounding-basics",
  ],
  calculations: [
    "calculations-workshop",
    "calculations-drip-rates",
    "calculations-creatinine-clearance",
    "compounding-basics",
  ],
  "medication-use-process": [
    "medication-safety-ismp",
    "adverse-drug-reactions",
    "immunizations",
    "controlled-substances",
    "sig-code-abbreviations",
  ],
  cardiology: [
    "antihypertensive-drug-classes",
    "dyslipidemia-statins",
    "heart-failure-gdmt",
    "anticoagulation-reversal",
    "drug-interactions-qt-prolongation",
  ],
  "infectious-disease": [
    "antibiotics-stewardship",
    "cap-pneumonia-regimens",
    "hiv-opportunistic-infections",
    "hepatitis-liver-disease",
  ],
  endocrine: [
    "insulin-diabetes-management",
    "thyroid-pharmacotherapy",
    "contraception-womens-health",
  ],
  respiratory: ["asthma-copd-inhalers"],
  "neuro-psych": ["psychotropics-monitoring", "seizure-epilepsy", "pain-opioid-management"],
  "renal-hepatic": [
    "renal-ckd-pharmacotherapy",
    "calculations-creatinine-clearance",
    "hepatitis-liver-disease",
  ],
  "onc-heme": ["oncology-supportive-care"],
  "otc-selfcare": ["otc-triage", "patient-counseling"],
  "special-populations": [
    "pediatric-pharmacy",
    "geriatrics-beers",
    "special-populations-pregnancy-lactation",
  ],
  "professional-practice-ops": [
    "hipaa-pharmacy-ethics",
    "pharmacy-management",
    "controlled-substances",
  ],
  "quick-reference": [
    "toxicology-antidotes",
    "tdm-monitoring",
    "sig-code-abbreviations",
    "calculations-creatinine-clearance",
  ],
  "back-matter": [],
};

/**
 * AANP FNP mapping — domain / lifespan / system high-yield modules that exist
 * in `AANP_FNP_HIGH_YIELD_TOPICS`. Navigational chapters stay empty on purpose.
 */
const AANP_FNP_CHAPTER_TOPICS: ChapterTopicMap = {
  "front-matter": [],
  "exam-strategy": [],
  "clinical-reasoning": ["aanp-assess-domain", "aanp-diagnose-domain"],
  "health-promotion-screening": ["aanp-plan-domain", "aanp-assess-domain"],
  cardiology: ["aanp-system-cardiovascular"],
  pulmonary: ["aanp-system-pulmonary"],
  endocrine: ["aanp-system-endocrine"],
  "gi-hepatic": ["aanp-system-gastrointestinal"],
  // No dedicated renal system module — UTI/GU themes live under ID; Evaluate covers monitoring.
  "renal-gu": ["aanp-system-infectious-disease", "aanp-evaluate-domain"],
  "womens-health": ["aanp-system-womens-health"],
  "pediatrics-lifespan": [
    "aanp-pediatrics-high-yield",
    "aanp-geriatrics-high-yield",
    "aanp-system-pediatrics",
    "aanp-system-geriatrics",
  ],
  "psych-neuro": [
    "aanp-system-psychiatry-behavioral",
    "aanp-system-neurology",
  ],
  "msk-derm": ["aanp-system-musculoskeletal", "aanp-system-dermatology-ent"],
  "ent-eyes-heme-id": [
    "aanp-system-dermatology-ent",
    "aanp-system-infectious-disease",
  ],
  "pharmacology-prescribing": ["aanp-plan-domain", "aanp-evaluate-domain"],
  "quick-reference": ["sig-code-abbreviations", "aanp-evaluate-domain"],
  "back-matter": [],
};

export const CHAPTER_TOPICS_BY_EXAM: Record<StudyGuideExam, ChapterTopicMap> = {
  nclex: NCLEX_CHAPTER_TOPICS,
  naplex: NAPLEX_CHAPTER_TOPICS,
  "aanp-fnp": AANP_FNP_CHAPTER_TOPICS,
};

export function getTopicSlugsForChapter(
  exam: StudyGuideExam,
  chapterSlug: string
): readonly string[] {
  return CHAPTER_TOPICS_BY_EXAM[exam]?.[chapterSlug] ?? [];
}
