/** Query keys that narrow a question-bank session beyond subjectId. */
export const TOPIC_PRACTICE_FILTER_PARAMS = [
  "blueprintTopics",
  "nclexPreset",
  "aanpFnpPreset",
  "naplexTopic",
  "usmleTopic",
  "panceTopic",
  "aanpFnpTopic",
  "nptePtTopic",
] as const;

export type TopicPracticeFilterParam = (typeof TOPIC_PRACTICE_FILTER_PARAMS)[number];

/** Copy topic-practice filters from a launcher URL onto an /api/questions query. */
export function appendTopicPracticeFiltersToQuery(
  target: URLSearchParams,
  source: Pick<URLSearchParams, "get">
): void {
  for (const key of TOPIC_PRACTICE_FILTER_PARAMS) {
    const value = source.get(key)?.trim();
    if (value) target.set(key, value);
  }
}

/** Preserve topic-practice filters when rewriting the question-bank URL. */
export function mergeTopicPracticeFiltersIntoQuery(
  target: URLSearchParams,
  source: Pick<URLSearchParams, "get">
): void {
  appendTopicPracticeFiltersToQuery(target, source);
}
