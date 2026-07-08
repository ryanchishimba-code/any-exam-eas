import type { HighYieldTopic } from "@/types/edtech";
import { getNaplexTopicMeta } from "./topic-registry";
import { isNaplexCalcTopicSlug } from "./calc-topic-qa";

export type NaplexTopicPracticeParams = {
  /** Pharmacy subject bucket for the initial DB pull. */
  subjectId: string;
  /** Registry blueprint labels — practice items must match one of these. */
  blueprintTopics?: string[];
  /** Study Hub topic slug — enables calc subtopic filters. */
  topicSlug?: string;
};

/** Subject overrides when practiceTopicSlug would pull the wrong bank bucket. */
const TOPIC_SUBJECT_OVERRIDES: Partial<Record<string, string>> = {
  "renal-ckd-pharmacotherapy": "pharmacology",
  "calculations-workshop": "compounding-calculations",
  "calculations-drip-rates": "compounding-calculations",
  "calculations-creatinine-clearance": "pharmacokinetics",
  "compounding-basics": "pharmaceutics",
  "adverse-drug-reactions": "patient-counseling",
  "tdm-monitoring": "pharmacokinetics",
  "immunizations": "patient-counseling",
  "contraception-womens-health": "patient-counseling",
  "hiv-opportunistic-infections": "pharmacology",
};

function resolveNaplexTopicSubjectId(topic: HighYieldTopic): string {
  const override = TOPIC_SUBJECT_OVERRIDES[topic.slug];
  if (override) return override;

  const domain = getNaplexTopicMeta(topic.slug).contentDomain;
  if (domain === "naplex-area1-foundations" && isNaplexCalcTopicSlug(topic.slug)) {
    return "compounding-calculations";
  }

  return topic.practiceTopicSlug;
}

/**
 * Resolve question-bank filters for a high-yield NAPLEX topic card.
 * Prefers blueprintTopicSlugs so practice matches what the Study Hub module teaches.
 */
export function resolveNaplexTopicPracticeParams(topic: HighYieldTopic): NaplexTopicPracticeParams {
  const blueprintTopics = topic.blueprintTopicSlugs?.filter(Boolean);

  if (blueprintTopics && blueprintTopics.length > 0) {
    return {
      subjectId: resolveNaplexTopicSubjectId(topic),
      blueprintTopics,
      topicSlug: topic.slug,
    };
  }

  return {
    subjectId: resolveNaplexTopicSubjectId(topic),
    topicSlug: topic.slug,
  };
}
