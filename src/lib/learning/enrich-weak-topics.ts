import type { ExamSlug } from "@/types/edtech";
import { getExamTopicStudyLinks } from "@/lib/library/exam-topic-bridge";
import type { WeakTopicRow } from "@/lib/learning/student-dashboard";
import {
  topicNodeFromConceptKey,
  topicNodePracticeHref,
} from "@/lib/topics/topic-node";

/** Resolve study links on the server — keeps `@/lib/edtech/seeds` out of client bundles. */
export function enrichWeakTopicsWithStudyLinks(
  examSlug: ExamSlug,
  weakTopics: WeakTopicRow[],
  options?: { fieldId?: string }
): WeakTopicRow[] {
  return weakTopics.map((topic) => {
    const slug = topic.id.replace(/^(tag|subject):/, "");
    const links = getExamTopicStudyLinks(examSlug, slug, {
      fieldId: options?.fieldId,
    });
    const node = topicNodeFromConceptKey(examSlug, topic.id, {
      fieldId: options?.fieldId,
      label: topic.name,
    });
    const practiceHref = topicNodePracticeHref(node, 15);
    return {
      ...topic,
      studyLinks: {
        deepDiveHref: links.deepDiveHref,
        libraryHref: links.libraryHref,
        practiceHref,
        anatomyStructures: links.anatomyStructures,
      },
    };
  });
}
