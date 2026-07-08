import type { HighYieldTopic } from "@/types/edtech";
import type { AanpFnpClinicalSystemId, AanpFnpDomainId } from "./types";
import { getAanpFnpTopicMeta } from "./topic-registry";

export type AanpFnpTopicPracticeParams = {
  fieldId: string;
  subjectId: string;
  blueprintTopics?: string[];
  topicSlug?: string;
  blueprintDomain?: AanpFnpDomainId;
  clinicalSystem?: AanpFnpClinicalSystemId;
  lifespanBand?: "pediatrics" | "geriatrics";
};

const TOPIC_SUBJECT_OVERRIDES: Partial<Record<string, string>> = {
  "sig-code-abbreviations": "plan",
};

function resolveBlueprintTopics(topic: HighYieldTopic): string[] {
  const meta = getAanpFnpTopicMeta(topic.slug);
  if (meta.blueprintTopicSlugs?.length) return [...meta.blueprintTopicSlugs];
  return [topic.slug];
}

function resolveAanpFnpTopicSubjectId(topic: HighYieldTopic): string {
  const meta = getAanpFnpTopicMeta(topic.slug);
  if (meta.clinicalSystem) return meta.clinicalSystem;
  if (meta.blueprintDomain) return meta.blueprintDomain;
  if (meta.lifespanBand === "geriatrics") return "geriatrics";
  if (meta.lifespanBand === "pediatrics") return "pediatrics";
  return TOPIC_SUBJECT_OVERRIDES[topic.slug] ?? topic.practiceTopicSlug;
}

export function resolveAanpFnpTopicPracticeParams(topic: HighYieldTopic): AanpFnpTopicPracticeParams {
  const meta = getAanpFnpTopicMeta(topic.slug);
  return {
    fieldId: "aanp-fnp",
    subjectId: resolveAanpFnpTopicSubjectId(topic),
    blueprintTopics: resolveBlueprintTopics(topic),
    topicSlug: topic.slug,
    blueprintDomain: meta.blueprintDomain,
    clinicalSystem: meta.clinicalSystem,
    lifespanBand: meta.lifespanBand,
  };
}
