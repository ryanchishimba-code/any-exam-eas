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

/**
 * Launcher params for topic-practice deep links.
 * Prefer the browser address bar so Next.js hook lag cannot drop blueprintTopics.
 */
export function topicPracticeLaunchSearchParams(
  searchParams: Pick<URLSearchParams, "get" | "toString">
): URLSearchParams {
  const fromHook = new URLSearchParams(searchParams.toString());
  if (typeof window === "undefined") return fromHook;
  const fromBrowser = new URLSearchParams(window.location.search);
  const merged = new URLSearchParams(fromHook.toString());
  for (const key of TOPIC_PRACTICE_FILTER_PARAMS) {
    const value = fromBrowser.get(key)?.trim() || fromHook.get(key)?.trim();
    if (value) merged.set(key, value);
  }
  const subjectFromBrowser = fromBrowser.get("subjectId")?.trim();
  const subjectFromHook = fromHook.get("subjectId")?.trim();
  if (subjectFromBrowser && !merged.get("subjectId")) {
    merged.set("subjectId", subjectFromBrowser);
  } else if (subjectFromHook && !merged.get("subjectId")) {
    merged.set("subjectId", subjectFromHook);
  }
  return merged;
}
