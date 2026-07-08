import type { ExamSlug } from "@/types/edtech";
import { getExamTopicStudyLinks } from "@/lib/library/exam-topic-bridge";
import type { WeakTopicRow } from "@/lib/learning/student-dashboard";

/** Resolve study links on the server — keeps `@/lib/edtech/seeds` out of client bundles. */
export function enrichWeakTopicsWithStudyLinks(
  examSlug: ExamSlug,
  weakTopics: WeakTopicRow[]
): WeakTopicRow[] {
  return weakTopics.map((topic) => {
    const slug = topic.id.replace(/^(tag|subject):/, "");
    const links = getExamTopicStudyLinks(examSlug, slug);
    return {
      ...topic,
      studyLinks: {
        deepDiveHref: links.deepDiveHref,
        libraryHref: links.libraryHref,
        practiceHref: links.practiceHref,
        anatomyStructures: links.anatomyStructures,
      },
    };
  });
}
