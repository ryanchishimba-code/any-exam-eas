import type { HighYieldTopic } from "@/types/edtech";

/** Filter topics by category chip and search query. */
export function filterHighYieldTopics(
  topics: HighYieldTopic[],
  query: string,
  category: string
): HighYieldTopic[] {
  const q = query.trim().toLowerCase();
  return topics.filter((t) => {
    if (category !== "all" && t.category !== category) return false;
    if (!q) return true;
    return (
      t.title.toLowerCase().includes(q) ||
      t.overview.toLowerCase().includes(q) ||
      t.summary.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.keyConcepts.some((c) => c.toLowerCase().includes(q))
    );
  });
}

/** Resolve the topic for a grid/panel index — null when nothing selected or out of range. */
export function resolveTopicAtIndex(
  filtered: HighYieldTopic[],
  index: number | null
): HighYieldTopic | null {
  if (index === null || index < 0 || index >= filtered.length) return null;
  return filtered[index] ?? null;
}

/** Clamp navigation index when the filtered list shrinks. */
export function clampTopicIndex(index: number, length: number): number {
  if (length <= 0) return 0;
  return Math.min(Math.max(0, index), length - 1);
}

/** Verify a user's card click index maps to the expected topic id. */
export function topicIdForSelection(
  topics: HighYieldTopic[],
  query: string,
  category: string,
  selectedIndex: number
): string | null {
  const filtered = filterHighYieldTopics(topics, query, category);
  return resolveTopicAtIndex(filtered, selectedIndex)?.id ?? null;
}
