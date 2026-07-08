import type { HighYieldTopic } from "@/types/edtech";
import { getPanceTopicMeta } from "./topic-registry";

export type PanceTopicPracticeParams = {
  fieldId: string;
  subjectId: string;
  blueprintTopics?: string[];
  topicSlug?: string;
};

const TOPIC_SUBJECT_OVERRIDES: Partial<Record<string, string>> = {
  "sig-code-abbreviations": "pharmacology",
  "infectious-disease": "infectious-diseases",
  "controlled-substances-pance": "professional-practice",
};

function resolveBlueprintTopics(topic: HighYieldTopic): string[] {
  const meta = getPanceTopicMeta(topic.slug);
  if (meta.blueprintTopicSlugs?.length) return [...meta.blueprintTopicSlugs];
  const fromPractice = getPanceTopicMeta(topic.practiceTopicSlug);
  if (fromPractice.blueprintTopicSlugs?.length) return [...fromPractice.blueprintTopicSlugs];
  return [topic.slug];
}

function resolvePanceTopicSubjectId(topic: HighYieldTopic): string {
  return TOPIC_SUBJECT_OVERRIDES[topic.slug] ?? topic.practiceTopicSlug;
}

export function resolvePanceTopicPracticeParams(topic: HighYieldTopic): PanceTopicPracticeParams {
  return {
    fieldId: "pance",
    subjectId: resolvePanceTopicSubjectId(topic),
    blueprintTopics: resolveBlueprintTopics(topic),
    topicSlug: topic.slug,
  };
}
