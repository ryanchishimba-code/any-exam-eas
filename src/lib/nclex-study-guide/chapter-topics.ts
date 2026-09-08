/**
 * Curated bridge from Study Guide chapters to the NCLEX high-yield topic
 * vocabulary in `NCLEX_TOPIC_REGISTRY`.
 *
 * `sg_chapters` carries no taxonomy of its own, so there is nothing to join on.
 * The mapping is hand-written rather than derived from chapter titles because a
 * wrong match on clinical content is worse for a candidate than no match at all
 * — "Renal & Fluids" should not fuzzy-match "Reduction of Risk".
 *
 * Topic slugs are validated against the registry in `chapter-topics.test.ts`,
 * so a renamed or retired topic fails the suite instead of rendering a dead link.
 */

/** Chapter slug (from `slugFromFilename` at ingest) → related topic slugs, most relevant first. */
export const CHAPTER_TOPIC_SLUGS: Record<string, readonly string[]> = {
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

export function getTopicSlugsForChapter(chapterSlug: string): readonly string[] {
  return CHAPTER_TOPIC_SLUGS[chapterSlug] ?? [];
}
