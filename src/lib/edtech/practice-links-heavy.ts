import type { ExamSlug, HighYieldTopic } from "@/types/edtech";
import { EXAM_CATALOG } from "@/lib/edtech/exams";
import {
  practiceTopicHref,
  type TopicPracticeReturnContext,
} from "@/lib/edtech/practice-links-core";
import { resolveUsmleTopicFieldId } from "@/lib/exam-prep/usmle/topic-practice";
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
  if (
    examSlug === "nclex" ||
    examSlug === "naplex" ||
    examSlug === "usmle" ||
    examSlug === "pance" ||
    examSlug === "aanp-fnp" ||
    examSlug === "npte-pt"
  ) {
    return topicNodePracticeHref(
      node,
      count,
      returnTo ?? { topicSlug: topic.slug, topicTitle: topic.title }
    );
  }

  const fieldId = EXAM_CATALOG[examSlug].fieldId;
  const resolvedFieldId =
    fieldId.startsWith("usmle") ? resolveUsmleTopicFieldId(topic) : fieldId;

  return practiceTopicHref(
    examSlug,
    topic.practiceTopicSlug,
    count,
    returnTo ?? { topicSlug: topic.slug, topicTitle: topic.title },
    fieldId.startsWith("usmle") ? { fieldId: resolvedFieldId } : undefined
  );
}

export { highYieldTopicPracticeHref as default };
