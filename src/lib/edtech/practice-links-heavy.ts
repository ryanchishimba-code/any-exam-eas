import type { ExamSlug, HighYieldTopic } from "@/types/edtech";
import { resolveNclexTopicPracticeParams } from "@/lib/exam-prep/nclex/topic-practice";
import { resolveNaplexTopicPracticeParams } from "@/lib/exam-prep/naplex/topic-practice";
import {
  resolveUsmleTopicFieldId,
  resolveUsmleTopicPracticeParams,
} from "@/lib/exam-prep/usmle/topic-practice";
import { resolvePanceTopicPracticeParams } from "@/lib/exam-prep/pance/topic-practice";
import { resolveAanpFnpTopicPracticeParams } from "@/lib/exam-prep/aanp-fnp/topic-practice";
import { resolveNptePtTopicPracticeParams } from "@/lib/exam-prep/npte-pt/topic-practice";
import { EXAM_CATALOG } from "@/lib/edtech/exams";
import {
  practiceTopicHref,
  type TopicPracticeReturnContext,
} from "@/lib/edtech/practice-links-core";

/** Practice href aligned to a Study Hub card (NCLEX uses blueprint topic filters). */
export function highYieldTopicPracticeHref(
  examSlug: ExamSlug,
  topic: HighYieldTopic,
  count = 10,
  returnTo?: TopicPracticeReturnContext
): string {
  if (examSlug === "nclex") {
    const params = resolveNclexTopicPracticeParams(topic);
    return practiceTopicHref(
      examSlug,
      params.subjectId,
      count,
      returnTo ?? { topicSlug: topic.slug, topicTitle: topic.title },
      {
        blueprintTopics: params.blueprintTopics,
        nclexPreset: params.nclexPreset,
      }
    );
  }

  if (examSlug === "naplex") {
    const params = resolveNaplexTopicPracticeParams(topic);
    return practiceTopicHref(
      examSlug,
      params.subjectId,
      count,
      returnTo ?? { topicSlug: topic.slug, topicTitle: topic.title },
      {
        blueprintTopics: params.blueprintTopics,
        naplexTopic: params.topicSlug,
      }
    );
  }

  if (examSlug === "usmle") {
    const params = resolveUsmleTopicPracticeParams(topic);
    return practiceTopicHref(
      examSlug,
      params.subjectId,
      count,
      returnTo ?? { topicSlug: topic.slug, topicTitle: topic.title },
      {
        blueprintTopics: params.blueprintTopics,
        usmleTopic: params.topicSlug,
        fieldId: params.fieldId,
      }
    );
  }

  if (examSlug === "pance") {
    const params = resolvePanceTopicPracticeParams(topic);
    return practiceTopicHref(
      examSlug,
      params.subjectId,
      count,
      returnTo ?? { topicSlug: topic.slug, topicTitle: topic.title },
      {
        blueprintTopics: params.blueprintTopics,
        panceTopic: params.topicSlug,
      }
    );
  }

  if (examSlug === "aanp-fnp") {
    const params = resolveAanpFnpTopicPracticeParams(topic);
    return practiceTopicHref(
      examSlug,
      params.subjectId,
      count,
      returnTo ?? { topicSlug: topic.slug, topicTitle: topic.title },
      {
        blueprintTopics: params.blueprintTopics,
        aanpFnpTopic: params.topicSlug,
      }
    );
  }

  if (examSlug === "npte-pt") {
    const params = resolveNptePtTopicPracticeParams(topic);
    return practiceTopicHref(
      examSlug,
      params.subjectId,
      count,
      returnTo ?? { topicSlug: topic.slug, topicTitle: topic.title },
      {
        blueprintTopics: params.blueprintTopics,
        nptePtTopic: params.topicSlug,
      }
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
