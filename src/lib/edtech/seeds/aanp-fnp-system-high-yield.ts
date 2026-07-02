/**
 * High-yield AANP FNP system modules for Roadmap / Deep Dive — derived from 2026 topic registry.
 */
import type { HighYieldTopic } from "@/types/edtech";
import {
  AANP_FNP_2026_TOPIC_GROUPS,
  aanpFnpSystemModuleSlug,
  computeAanpFnpClinicalSystemWeightMap,
} from "@/lib/exam-prep/aanp-fnp/blueprint-topics-2026";

const SYSTEM_WEIGHTS = computeAanpFnpClinicalSystemWeightMap();

const YIELD_TAG: Record<string, string> = {
  "very-high": "very-high-yield",
  high: "high-yield",
  standard: "standard-yield",
};

type SystemTopicInput = Omit<HighYieldTopic, "id" | "examSlug" | "sortOrder"> & {
  sortOrder?: number;
};

export const AANP_FNP_SYSTEM_HIGH_YIELD_TOPICS: SystemTopicInput[] =
  AANP_FNP_2026_TOPIC_GROUPS.map((group) => {
    const weightPct = Math.round((SYSTEM_WEIGHTS[group.categoryId] ?? 0) * 100);
    const slug = aanpFnpSystemModuleSlug(group.categoryId);
    const topicList = group.topics.map((t) => t.label).join("; ");
    return {
      slug,
      category: `${group.label} (${weightPct}% bank weight)`,
      title: `${group.label} — Primary Care Vignettes`,
      overview: `System-based AANP FNP module: ${topicList}.`,
      summary: [
        `${group.label} (${YIELD_TAG[group.yield] ?? "high-yield"}) covers outpatient FNP management across the lifespan.`,
        `High-yield topics: ${topicList}.`,
        "Practice with case vignettes emphasizing next-best-step questions, guideline-directed therapy, and pharmacology cross-references.",
      ].join("\n\n"),
      keyConcepts: group.topics.map((t) => t.label),
      mustKnowFacts: [
        `Clinical system slug: ${group.categoryId}`,
        `Yield tier: ${group.yield}`,
      ],
      pearls: [
        "Anchor on epidemiology + key finding + timeline before rare diagnoses.",
        "Always check pregnancy status, renal/hepatic function, and age before selecting pharmacotherapy.",
      ],
      pitfalls: [
        "Selecting correct drug class but wrong agent for comorbidity",
        "Ordering exhaustive workups instead of the single best next diagnostic step",
      ],
      practiceTopicSlug: group.categoryId,
    };
  });
