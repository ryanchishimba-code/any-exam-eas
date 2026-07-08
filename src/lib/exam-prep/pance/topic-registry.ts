import type { HighYieldTopic } from "@/types/edtech";
import { PANCE_KNOWLEDGE_AREAS, type PanceKnowledgeArea } from "./content-outline";

export type PanceTopicMeta = {
  blueprintTopicSlugs?: string[];
};

const EXTRA_REGISTRY: Record<string, PanceTopicMeta> = {
  "acute-coronary-syndrome": {
    blueprintTopicSlugs: ["ACS", "heart failure", "hypertension", "AFib"],
  },
  "infectious-disease": {
    blueprintTopicSlugs: ["sepsis", "pneumonia", "MRSA", "HIV", "antibiotic"],
  },
  "controlled-substances-pance": {
    blueprintTopicSlugs: [
      "informed consent",
      "scope of practice",
      "mandatory reporting",
      "HIPAA",
      "opioid",
    ],
  },
  "insulin-diabetes-management": {
    blueprintTopicSlugs: ["diabetes", "DKA", "hypoglycemia", "insulin"],
  },
  "copd-exacerbation": {
    blueprintTopicSlugs: ["COPD", "asthma", "pneumonia", "PE"],
  },
  "sepsis-shock": {
    blueprintTopicSlugs: ["sepsis", "shock", "lactate", "vasopressor"],
  },
  "professional-practice": {
    blueprintTopicSlugs: [
      "informed consent",
      "scope of practice",
      "mandatory reporting",
      "HIPAA",
      "error disclosure",
      "capacity assessment",
    ],
  },
  "sig-code-abbreviations": {
    blueprintTopicSlugs: ["prescription sig", "abbreviation", "medication order", "units"],
  },
};

function knowledgeAreaForTopic(slug: string, practiceTopicSlug?: string): PanceKnowledgeArea | undefined {
  return PANCE_KNOWLEDGE_AREAS.find(
    (a) =>
      a.id === slug ||
      a.subjectIds.includes(slug) ||
      (practiceTopicSlug ? a.subjectIds.includes(practiceTopicSlug) : false)
  );
}

export function getPanceTopicMeta(slug: string): PanceTopicMeta {
  if (EXTRA_REGISTRY[slug]) return EXTRA_REGISTRY[slug]!;
  const area = knowledgeAreaForTopic(slug);
  if (area) return { blueprintTopicSlugs: area.highYieldTopics };
  return {};
}

export function enrichPanceTopic(topic: HighYieldTopic): HighYieldTopic {
  const meta = getPanceTopicMeta(topic.slug);
  const blueprintTopicSlugs =
    meta.blueprintTopicSlugs ??
    getPanceTopicMeta(topic.practiceTopicSlug).blueprintTopicSlugs ??
    topic.blueprintTopicSlugs;
  return blueprintTopicSlugs?.length ? { ...topic, blueprintTopicSlugs } : topic;
}

export function enrichPanceTopics(topics: HighYieldTopic[]): HighYieldTopic[] {
  return topics.map(enrichPanceTopic);
}
