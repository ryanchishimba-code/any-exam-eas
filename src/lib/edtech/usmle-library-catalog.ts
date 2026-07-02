import type { UsmleStepLevel } from "@/lib/exam-prep/usmle/types";
import { getUsmle2026Topic } from "@/lib/exam-prep/usmle/blueprint-topics-2026";
import { getExamBlueprint } from "@/lib/engine/blueprints";
import type { MemoryCard } from "@/lib/library/types";
import { usmleFieldIdToStepLevel } from "@/lib/exam-prep/usmle/steps";
import type { HighYieldTopic } from "@/types/edtech";

export type UsmleLibraryStep = UsmleStepLevel;

const STEP1_SLUGS = new Set([
  "pathology-neoplasia",
  "pharmacology-moa",
  "physiology-systems",
  "biochemistry-metabolism",
  "microbiology-immunology",
  "anatomy-embryology",
]);

const STEP3_ONLY_SLUGS = new Set([
  "biostatistics-epidemiology",
  "medical-ethics-legal",
  "ccs-case-management",
  "pharmaceutical-ads-abstracts",
]);

/** Default clinical high-yield slugs — shared Step 2 CK + Step 3 Day 1 content. */
const CLINICAL_SLUGS = new Set([
  "cardiovascular",
  "pulmonary",
  "neurology-stroke",
  "gastroenterology",
  "renal-electrolytes",
  "endocrine-dm",
  "infectious-disease",
  "hematology-oncology",
  "rheumatology",
  "obstetrics",
  "pediatrics",
  "psychiatry",
  "emergency-toxicology",
  "ethics-biostats",
  "dermatology-allergic",
  "acute-coronary-syndrome",
]);

export function resolveUsmleLibraryStep(fieldId?: string | null): UsmleLibraryStep {
  return usmleFieldIdToStepLevel(fieldId ?? "") ?? "step2";
}

const CROSS_CUTTING_2026_SLUGS = new Set([
  "biostatistics-interpretation",
  "ethics-professionalism",
  "sdoh-health-equity",
  "diagnostic-test-interpretation",
  "pharmacology-interactions",
  "emergency-acls",
]);

export function usmleStepsForTopicSlug(slug: string): UsmleLibraryStep[] {
  const from2026 = getUsmle2026Topic(slug);
  if (from2026) return [from2026.stepLevel];
  if (CROSS_CUTTING_2026_SLUGS.has(slug)) return ["step1", "step2", "step3"];
  if (STEP1_SLUGS.has(slug)) return ["step1"];
  if (STEP3_ONLY_SLUGS.has(slug)) return ["step3"];
  if (CLINICAL_SLUGS.has(slug)) return ["step2", "step3"];
  return ["step2", "step3"];
}

export function tagUsmleTopicSteps(topic: HighYieldTopic): HighYieldTopic {
  if (topic.examSlug !== "usmle") return topic;
  return {
    ...topic,
    usmleSteps: topic.usmleSteps ?? usmleStepsForTopicSlug(topic.slug),
  };
}

export function topicMatchesUsmleStep(topic: HighYieldTopic, step: UsmleLibraryStep): boolean {
  if (topic.examSlug !== "usmle") return true;
  const steps = topic.usmleSteps ?? usmleStepsForTopicSlug(topic.slug);
  return steps.includes(step);
}

export function cardMatchesUsmleStep(card: MemoryCard, step: UsmleLibraryStep): boolean {
  if (card.examSlug !== "usmle") return true;
  if (!card.usmleSteps?.length) return step !== "step1";
  return card.usmleSteps.includes(step);
}

export function filterHighYieldTopicsForUsmleStep(
  topics: HighYieldTopic[],
  step: UsmleLibraryStep
): HighYieldTopic[] {
  return topics
    .map(tagUsmleTopicSteps)
    .filter((t) => topicMatchesUsmleStep(t, step));
}

export function filterMemoryCardsForUsmleStep(
  cards: MemoryCard[],
  step: UsmleLibraryStep
): MemoryCard[] {
  return cards.filter((c) => cardMatchesUsmleStep(c, step));
}

export type UsmleBoardCoverageRow = {
  categoryId: string;
  label: string;
  weightPercent: number;
  libraryTopicSlugs: string[];
  hasDeepDive: boolean;
  hasMemoryCards: boolean;
};

/** Map blueprint categories to library topic slugs for coverage reporting. */
export function getUsmleBoardCoverage(
  fieldId: string,
  topics: HighYieldTopic[],
  cards: MemoryCard[]
): UsmleBoardCoverageRow[] {
  const blueprint = getExamBlueprint(fieldId);
  if (!blueprint) return [];

  const topicBySlug = new Map(topics.map((t) => [t.slug, tagUsmleTopicSteps(t)]));

  const categoryTopicMap: Record<string, string[]> = {
    anatomy: ["anatomy-embryology"],
    physiology: ["physiology-systems"],
    pathology: ["pathology-neoplasia"],
    pharmacology: ["pharmacology-moa", "pharmaceutical-ads-abstracts"],
    biochemistry: ["biochemistry-metabolism"],
    microbiology: ["microbiology-immunology"],
    cardiovascular: ["cardiovascular", "acute-coronary-syndrome"],
    respiratory: ["pulmonary"],
    gastrointestinal: ["gastroenterology"],
    endocrine: ["endocrine-dm"],
    "infectious-disease": ["infectious-disease"],
    "internal-medicine": ["renal-electrolytes", "hematology-oncology", "rheumatology", "dermatology-allergic"],
    neurology: ["neurology-stroke"],
    pediatrics: ["pediatrics"],
    obgyn: ["obstetrics"],
    psychiatry: ["psychiatry"],
    surgery: ["emergency-toxicology", "gastroenterology"],
    "emergency-medicine": ["emergency-toxicology"],
    biostatistics: ["biostatistics-epidemiology", "ethics-biostats"],
    ethics: ["medical-ethics-legal", "ethics-biostats"],
    "pharm-advertising": ["pharmaceutical-ads-abstracts"],
    ccs: ["ccs-case-management"],
  };

  return blueprint.categories.map((cat) => {
    const slugs = categoryTopicMap[cat.id] ?? [];
    const matched = slugs.map((s) => topicBySlug.get(s)).filter(Boolean) as HighYieldTopic[];
    const hasDeepDive = matched.some((t) => Boolean(t.reviewModule));
    const subjectIds = cat.subjectIds ?? [];
    const hasMemoryCards = cards.some((c) => {
      const slugMatch = slugs.some(
        (s) =>
          c.reviewModuleSlug === s ||
          c.practiceTopicSlug === topicBySlug.get(s)?.practiceTopicSlug
      );
      const subjectMatch = subjectIds.some(
        (sid) =>
          c.practiceTopicSlug === sid ||
          c.subject.toLowerCase().replace(/\s+/g, "-") === sid ||
          c.subject.toLowerCase().includes(sid.replace(/-/g, " "))
      );
      return slugMatch || subjectMatch;
    });

    return {
      categoryId: cat.id,
      label: cat.label,
      weightPercent: Math.round(cat.weight * 100),
      libraryTopicSlugs: slugs.filter((s) => topicBySlug.has(s)),
      hasDeepDive,
      hasMemoryCards,
    };
  });
}
