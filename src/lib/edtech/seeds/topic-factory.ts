import type { ExamSlug, HighYieldTopic } from "@/types/edtech";

type TopicInput = Omit<HighYieldTopic, "id" | "examSlug" | "sortOrder"> & {
  sortOrder?: number;
};

/** Consistent id/slug wiring for static high-yield topic seeds. */
export function defineExamTopics(examSlug: ExamSlug, topics: TopicInput[]): HighYieldTopic[] {
  return topics.map((t, i) => ({
    ...t,
    id: `${examSlug}-${t.slug}`,
    examSlug,
    sortOrder: t.sortOrder ?? i + 1,
    practiceTopicSlug: t.practiceTopicSlug ?? t.slug,
  }));
}
