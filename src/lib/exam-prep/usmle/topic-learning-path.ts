/**
 * Recommended USMLE study sequences — flagship review modules first, then granular topics.
 */
import type { HighYieldTopic } from "@/types/edtech";
import type { UsmleStepLevel } from "@/lib/exam-prep/usmle/types";
import {
  USMLE_STEP1_TOPIC_GROUPS,
  USMLE_STEP2_TOPIC_GROUPS,
  USMLE_STEP3_TOPIC_GROUPS,
} from "@/lib/exam-prep/usmle/blueprint-topics-2026";

/** Step 1 — basic sciences in lecture-replacement order (Pathoma → Pharm → Phys → Biochem → Micro → Anatomy). */
export const USMLE_STEP1_LEARNING_PATH: string[] = [
  "pathology-neoplasia",
  "pharmacology-moa",
  "physiology-systems",
  "biochemistry-metabolism",
  "microbiology-immunology",
  "anatomy-embryology",
  ...USMLE_STEP1_TOPIC_GROUPS.flatMap((g) => g.topics.map((t) => t.slug)),
  "biostatistics-interpretation",
  "diagnostic-test-interpretation",
  "pharmacology-interactions",
];

/** Step 2 CK — high-yield clinical systems (internal medicine clerkship order). */
export const USMLE_STEP2_LEARNING_PATH: string[] = [
  "acute-coronary-syndrome",
  "cardiovascular",
  "pulmonary",
  "infectious-disease",
  "renal-electrolytes",
  "endocrine-dm",
  "neurology-stroke",
  "gastroenterology",
  "hematology-oncology",
  "rheumatology",
  "obstetrics",
  "pediatrics",
  "psychiatry",
  "emergency-toxicology",
  "dermatology-allergic",
  ...USMLE_STEP2_TOPIC_GROUPS.flatMap((g) => g.topics.map((t) => t.slug)),
  "ethics-biostats",
  "emergency-acls",
  "sdoh-health-equity",
];

/** Step 3 — CCS + biostatistics + ethics + evidence appraisal. */
export const USMLE_STEP3_LEARNING_PATH: string[] = [
  "ccs-case-management",
  "biostatistics-epidemiology",
  "medical-ethics-legal",
  "pharmaceutical-ads-abstracts",
  "ethics-biostats",
  ...USMLE_STEP3_TOPIC_GROUPS.flatMap((g) => g.topics.map((t) => t.slug)),
  "biostatistics-interpretation",
  "ethics-professionalism",
  "diagnostic-test-interpretation",
];

export function getUsmleLearningPath(step: UsmleStepLevel): string[] {
  if (step === "step1") return USMLE_STEP1_LEARNING_PATH;
  if (step === "step3") return USMLE_STEP3_LEARNING_PATH;
  return USMLE_STEP2_LEARNING_PATH;
}

export function sortTopicsByUsmlePath(
  topics: HighYieldTopic[],
  step: UsmleStepLevel
): HighYieldTopic[] {
  const path = getUsmleLearningPath(step);
  const order = new Map(path.map((slug, i) => [slug, i]));
  return [...topics].sort((a, b) => {
    const ia = order.get(a.slug) ?? 999;
    const ib = order.get(b.slug) ?? 999;
    if (ia !== ib) return ia - ib;
    return a.title.localeCompare(b.title);
  });
}

export function getNextUsmleTopicInPath(
  topics: HighYieldTopic[],
  progressMap: Record<string, { reviewCount: number }>,
  step: UsmleStepLevel
): HighYieldTopic | null {
  const path = getUsmleLearningPath(step);
  const bySlug = new Map(topics.map((t) => [t.slug, t]));
  for (const slug of path) {
    const topic = bySlug.get(slug);
    if (!topic) continue;
    if ((progressMap[topic.id]?.reviewCount ?? 0) === 0) return topic;
  }
  return sortTopicsByUsmlePath(topics, step)[0] ?? null;
}
