import { describe, expect, it } from "vitest";
import { NCLEX_HIGH_YIELD_TOPICS } from "./seeds/high-yield-nclex";
import {
  clampTopicIndex,
  filterHighYieldTopics,
  resolveTopicAtIndex,
  topicIdForSelection,
} from "./topic-selection";
import { practiceTopicHref } from "./practice-links";
import { EXAM_CATALOG, EXAM_SLUGS } from "./exams";
import { ALL_HIGH_YIELD_TOPICS, getHighYieldTopic, getHighYieldTopics } from "./seeds";

describe("filterHighYieldTopics", () => {
  it("returns all topics when no filters applied", () => {
    const result = filterHighYieldTopics(NCLEX_HIGH_YIELD_TOPICS, "", "all");
    expect(result).toHaveLength(NCLEX_HIGH_YIELD_TOPICS.length);
  });

  it("filters by category", () => {
    const safety = filterHighYieldTopics(NCLEX_HIGH_YIELD_TOPICS, "", "Safety");
    expect(safety.every((t) => t.category === "Safety")).toBe(true);
    expect(safety.some((t) => t.slug === "infection-control")).toBe(true);
  });

  it("filters by search term in title", () => {
    const result = filterHighYieldTopics(NCLEX_HIGH_YIELD_TOPICS, "electrolyte", "all");
    expect(result.some((t) => t.slug === "electrolytes")).toBe(true);
  });
});

describe("resolveTopicAtIndex", () => {
  const topics = NCLEX_HIGH_YIELD_TOPICS;

  it("returns null when index is null", () => {
    expect(resolveTopicAtIndex(topics, null)).toBeNull();
  });

  it("returns the topic at the selected index", () => {
    const filtered = filterHighYieldTopics(topics, "", "all");
    const picked = resolveTopicAtIndex(filtered, 3);
    expect(picked?.id).toBe(filtered[3].id);
    expect(picked?.title).toBe(filtered[3].title);
  });

  it("returns null for out-of-range index", () => {
    expect(resolveTopicAtIndex(topics, 999)).toBeNull();
  });
});

describe("topic selection connects card click to correct topic", () => {
  it("maps index 0 to first filtered topic", () => {
    const id = topicIdForSelection(NCLEX_HIGH_YIELD_TOPICS, "", "all", 0);
    expect(id).toBe(NCLEX_HIGH_YIELD_TOPICS[0].id);
  });

  it("maps filtered index to infection-control when searching", () => {
    const id = topicIdForSelection(NCLEX_HIGH_YIELD_TOPICS, "infection", "all", 0);
    const topic = NCLEX_HIGH_YIELD_TOPICS.find((t) => t.id === id);
    expect(topic?.slug).toBe("infection-control");
  });

  it("maps category-filtered index correctly", () => {
    const safety = filterHighYieldTopics(NCLEX_HIGH_YIELD_TOPICS, "", "Safety");
    const id = topicIdForSelection(NCLEX_HIGH_YIELD_TOPICS, "", "Safety", 0);
    expect(id).toBe(safety[0].id);
  });
});

describe("clampTopicIndex", () => {
  it("clamps high index to last item", () => {
    expect(clampTopicIndex(10, 5)).toBe(4);
  });

  it("clamps negative to 0", () => {
    expect(clampTopicIndex(-1, 5)).toBe(0);
  });
});

describe("practiceTopicHref connects topic to question bank", () => {
  it("uses exam fieldId and topic practiceTopicSlug", () => {
    const topic = NCLEX_HIGH_YIELD_TOPICS[0];
    const href = practiceTopicHref("nclex", topic.practiceTopicSlug, 10);
    expect(href).toContain(`field=${EXAM_CATALOG.nclex.fieldId}`);
    expect(href).toContain(`subjectId=${topic.practiceTopicSlug}`);
    expect(href).toContain("count=10");
    expect(href).toContain("mode=bank");
  });

  it("each exam links practice to its own field and topic slug", () => {
    for (const slug of EXAM_SLUGS) {
      const topic = ALL_HIGH_YIELD_TOPICS.find((t) => t.examSlug === slug)!;
      const href = practiceTopicHref(slug, topic.practiceTopicSlug);
      const url = new URL(href, "http://localhost");
      expect(url.searchParams.get("field")).toBe(EXAM_CATALOG[slug].fieldId);
      expect(url.searchParams.get("subjectId")).toBe(topic.practiceTopicSlug);
    }
  });
});

describe("seed integrity — selection targets exist", () => {
  it("every topic has practiceTopicSlug defaulting to slug", () => {
    for (const topic of ALL_HIGH_YIELD_TOPICS) {
      expect(topic.practiceTopicSlug).toBeTruthy();
      expect(topic.id).toBe(`${topic.examSlug}-${topic.slug}`);
    }
  });

  it("getHighYieldTopic resolves by slug for each exam", () => {
    for (const topic of ALL_HIGH_YIELD_TOPICS) {
      const found = getHighYieldTopic(topic.examSlug, topic.slug);
      expect(found?.id).toBe(topic.id);
    }
  });

  it("has at least the expected topic floor per exam (base seeds plus review modules)", () => {
    const minimumByExam: Partial<Record<(typeof EXAM_SLUGS)[number], number>> = {
      "aanp-fnp": 10,
      "npte-pt": 10,
    };
    for (const slug of EXAM_SLUGS) {
      const topics = getHighYieldTopics(slug);
      expect(topics.length).toBeGreaterThanOrEqual(minimumByExam[slug] ?? 15);
    }
  });
});
