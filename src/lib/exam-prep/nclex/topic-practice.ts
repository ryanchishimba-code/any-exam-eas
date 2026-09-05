import { MIXED_SUBJECT_ID } from "@/lib/edtech/practice-links-core";
import type { HighYieldTopic } from "@/types/edtech";
import { NCLEX_STUDY_PRESETS, type NclexStudyPreset, type NclexStudyPresetId } from "./study-presets";
import { getNclexTopicMeta } from "./topic-registry";

export type NclexTopicPracticeParams = {
  /** Client Needs or legacy subject bucket for the initial DB pull. */
  subjectId: string;
  /** Granular 2026 blueprint slugs — practice items must match one of these. */
  blueprintTopics?: string[];
  /** Optional preset filter (NGN strategy cards, preset-only blocks). */
  nclexPreset?: string;
};

/** Presets that narrow by clinical content — safe to stack with blueprint filters. */
const TOPIC_PRACTICE_CONTENT_PRESETS = new Set<NclexStudyPresetId>([
  "prioritization-workshop",
  "sata-mastery",
  "dosage-calc-sprint",
  "maternal-newborn-block",
  "pharm-high-alert-block",
  "psych-communication-block",
  "electrolytes-block",
  "peds-block",
  "legal-ethical-block",
]);

function pickTopicPracticePreset(
  topic: HighYieldTopic,
  blueprintTopics?: string[]
): NclexStudyPreset | undefined {
  for (const presetId of topic.relatedPresetIds ?? []) {
    if (blueprintTopics?.length && !TOPIC_PRACTICE_CONTENT_PRESETS.has(presetId)) {
      continue;
    }
    const preset = NCLEX_STUDY_PRESETS.find((p) => p.id === presetId);
    if (preset) return preset;
  }
  return undefined;
}

const TOPIC_SUBJECT_OVERRIDES: Partial<Record<string, string>> = {
  pediatrics: "pediatrics-nursing",
  postpartum: "maternal-child",
  "newborn-assessment": "maternal-child",
  "critical-lab-values": "reduction-risk",
  "chemotherapy-toxicity": "reduction-risk",
};

function resolveNclexTopicSubjectId(topic: HighYieldTopic, preset?: NclexStudyPreset): string {
  const override = TOPIC_SUBJECT_OVERRIDES[topic.slug];
  if (override) return override;

  const domain = getNclexTopicMeta(topic.slug).clientNeedsDomain;
  if (domain === "physiological-adaptation") return "physiological-adaptation";
  if (domain === "health-promotion") return "health-promotion";

  if (preset?.subjectId) return preset.subjectId;
  return topic.practiceTopicSlug;
}

/**
 * Resolve question-bank filters for a high-yield NCLEX topic card.
 * Prefers blueprintTopicSlugs so practice matches what the Study Hub module teaches.
 */
export function resolveNclexTopicPracticeParams(topic: HighYieldTopic): NclexTopicPracticeParams {
  const blueprintTopics = topic.blueprintTopicSlugs?.filter(Boolean);

  if (topic.clientNeedsDomain === "ngn-strategy") {
    const presetId = topic.relatedPresetIds?.[0];
    const preset = presetId ? NCLEX_STUDY_PRESETS.find((p) => p.id === presetId) : undefined;
    return {
      subjectId: preset?.subjectId ?? MIXED_SUBJECT_ID,
      nclexPreset: preset?.nclexPreset ?? presetId,
    };
  }

  if (blueprintTopics && blueprintTopics.length > 0) {
    const preset = pickTopicPracticePreset(topic, blueprintTopics);
    return {
      subjectId: resolveNclexTopicSubjectId(topic, preset),
      blueprintTopics,
      nclexPreset: preset?.nclexPreset,
    };
  }

  const presetId = topic.relatedPresetIds?.[0] as NclexStudyPresetId | undefined;
  if (presetId) {
    const preset = NCLEX_STUDY_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      return {
        subjectId: resolveNclexTopicSubjectId(topic, preset),
        nclexPreset: preset.nclexPreset,
        blueprintTopics: preset.blueprintTopic ? [preset.blueprintTopic] : undefined,
      };
    }
  }

  return { subjectId: resolveNclexTopicSubjectId(topic) };
}
