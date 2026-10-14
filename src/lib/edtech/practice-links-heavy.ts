import type { ExamSlug, HighYieldTopic } from "@/types/edtech";
import { type TopicPracticeReturnContext } from "@/lib/edtech/practice-links-core";
import {
  topicNodeFromHighYield,
  topicNodePracticeHref,
} from "@/lib/topics/topic-node";

/** Practice href aligned to a Study Hub card (NCLEX uses blueprint topic filters). */
export function highYieldTopicPracticeHref(
  examSlug: ExamSlug,
  topic: HighYieldTopic,
  count = 10,
  returnTo?: TopicPracticeReturnContext
): string {
  const node = topicNodeFromHighYield(examSlug, topic);
  return topicNodePracticeHref(
    node,
    count,
    returnTo ?? { topicSlug: topic.slug, topicTitle: topic.title }
  );
}

export { highYieldTopicPracticeHref as default };
