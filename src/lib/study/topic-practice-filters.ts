import { labelForNclex2026TopicSlug } from "@/lib/exam-prep/nclex/blueprint-topics-2026";
import { expandNclexBlueprintTopicMatchers } from "@/lib/exam-prep/nclex/blueprint-topic-aliases";
import { TOPIC_PRACTICE_FILTER_PARAMS } from "@/lib/study/topic-practice-query";

export type TopicPracticeLaunchFilters = {
  blueprintTopics?: string[];
  nclexPreset?: string;
  aanpFnpPreset?: string;
  naplexTopic?: string;
  usmleTopic?: string;
  panceTopic?: string;
  aanpFnpTopic?: string;
  nptePtTopic?: string;
};

function splitCsv(value: string | null | undefined): string[] {
  if (!value?.trim()) return [];
  return value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

/** Read topic-practice narrowing params from a question-bank launcher URL. */
export function parseTopicPracticeLaunchFilters(
  source: Pick<URLSearchParams, "get">
): TopicPracticeLaunchFilters {
  const filters: TopicPracticeLaunchFilters = {};
  const blueprint = splitCsv(source.get("blueprintTopics"));
  if (blueprint.length) filters.blueprintTopics = blueprint;

  for (const key of TOPIC_PRACTICE_FILTER_PARAMS) {
    if (key === "blueprintTopics") continue;
    const value = source.get(key)?.trim();
    if (value) filters[key] = value;
  }
  return filters;
}

export function topicPracticeFiltersActive(filters: TopicPracticeLaunchFilters): boolean {
  if (filters.blueprintTopics?.length) return true;
  return Boolean(
    filters.nclexPreset ||
      filters.aanpFnpPreset ||
      filters.naplexTopic ||
      filters.usmleTopic ||
      filters.panceTopic ||
      filters.aanpFnpTopic ||
      filters.nptePtTopic
  );
}

/** Short label for the blueprint topic chip in session preview. */
export function topicPracticeBlueprintLabel(
  fieldId: string,
  blueprintTopics: string[] | undefined
): string | null {
  if (!blueprintTopics?.length) return null;
  const primary = blueprintTopics[0]!;
  if (fieldId === "nursing") {
    const label = labelForNclex2026TopicSlug(primary);
    const short = label.split("(")[0]?.trim() || label;
    if (blueprintTopics.length === 1) return short;
    return `${short} +${blueprintTopics.length - 1}`;
  }
  if (blueprintTopics.length === 1) {
    return primary.replace(/-/g, " ");
  }
  return `${primary.replace(/-/g, " ")} +${blueprintTopics.length - 1}`;
}

export function topicPracticePreviewTitle(params: {
  fieldId: string;
  subjectLabel: string;
  filters: TopicPracticeLaunchFilters;
}): string {
  const topicLabel = topicPracticeBlueprintLabel(params.fieldId, params.filters.blueprintTopics);
  if (topicLabel) return `${topicLabel} · ${params.subjectLabel}`;
  return params.subjectLabel;
}

/** DB blueprintTopic values to count for NCLEX topic practice (includes alias matchers). */
export function nclexBlueprintTopicsForCount(blueprintTopics: string[]): string[] {
  return [...new Set(expandNclexBlueprintTopicMatchers(blueprintTopics))];
}
