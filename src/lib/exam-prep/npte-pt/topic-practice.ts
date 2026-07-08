import type { HighYieldTopic } from "@/types/edtech";
import { getNptePtTopicMeta } from "./topic-registry";

export type NptePtTopicPracticeParams = {
  fieldId: string;
  subjectId: string;
  blueprintTopics?: string[];
  topicSlug?: string;
};

const TOPIC_SUBJECT_OVERRIDES: Partial<Record<string, string>> = {
  "sig-code-abbreviations": "professional-responsibilities",
};

function resolveBlueprintTopics(topic: HighYieldTopic): string[] {
  const meta = getNptePtTopicMeta(topic.slug);
  if (meta.blueprintTopicSlugs?.length) return [...meta.blueprintTopicSlugs];
  const fromPractice = getNptePtTopicMeta(topic.practiceTopicSlug);
  if (fromPractice.blueprintTopicSlugs?.length) return [...fromPractice.blueprintTopicSlugs];
  return [topic.slug];
}

function resolveNptePtTopicSubjectId(topic: HighYieldTopic): string {
  const meta = getNptePtTopicMeta(topic.slug);
  if (meta.contentCategory) return meta.contentCategory;
  return TOPIC_SUBJECT_OVERRIDES[topic.slug] ?? topic.practiceTopicSlug;
}

export function resolveNptePtTopicPracticeParams(topic: HighYieldTopic): NptePtTopicPracticeParams {
  return {
    fieldId: "npte-pt",
    subjectId: resolveNptePtTopicSubjectId(topic),
    blueprintTopics: resolveBlueprintTopics(topic),
    topicSlug: topic.slug,
  };
}
