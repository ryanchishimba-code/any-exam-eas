import { describe, expect, it } from "vitest";
import { defineReviewModuleTopic } from "./build-topic";
import { REVIEW_MODULE_CONTENT_BY_SLUG, SEPSIS_MODULE } from "./content";
import {
  REVIEW_MODULE_SECTION_ORDER,
  type ReviewModuleSection,
} from "./types";
import { REVIEW_MODULE_TOPICS, mergeReviewModules } from "../seeds/review-module-topics";
import { NCLEX_HIGH_YIELD_TOPICS } from "../seeds/high-yield-nclex";

function sectionHasContent(section: ReviewModuleSection): boolean {
  return (
    (section.paragraphs?.length ?? 0) > 0 ||
    (section.bullets?.length ?? 0) > 0 ||
    (section.tables?.length ?? 0) > 0
  );
}

describe("review module content", () => {
  it("defines five flagship textbook modules", () => {
    expect(Object.keys(REVIEW_MODULE_CONTENT_BY_SLUG)).toHaveLength(5);
    expect(REVIEW_MODULE_TOPICS).toHaveLength(5);
  });

  for (const [slug, content] of Object.entries(REVIEW_MODULE_CONTENT_BY_SLUG)) {
    it(`${slug} has all eight textbook sections with content`, () => {
      expect(content.sections).toHaveLength(8);
      const ids = content.sections.map((s) => s.id);
      expect(ids).toEqual(REVIEW_MODULE_SECTION_ORDER);

      for (const section of content.sections) {
        expect(section.title.trim().length).toBeGreaterThan(0);
        expect(sectionHasContent(section)).toBe(true);
      }
    });
  }

  it("sepsis module includes hour-1 bundle and comparison tables", () => {
    const core = SEPSIS_MODULE.sections.find((s) => s.id === "core-concepts");
    expect(core?.bullets?.some((b) => /Hour-1 bundle/i.test(b))).toBe(true);

    const comparisons = SEPSIS_MODULE.sections.find((s) => s.id === "comparisons");
    expect(comparisons?.tables?.length).toBeGreaterThan(0);
  });
});

describe("defineReviewModuleTopic", () => {
  it("maps module sections onto legacy HighYieldTopic fields", () => {
    const topic = defineReviewModuleTopic({
      examSlug: "nclex",
      slug: "sepsis-shock",
      title: "Sepsis & Shock",
      overview: "Test overview",
      practiceTopicSlug: "critical-care",
      reviewModule: SEPSIS_MODULE,
    });

    expect(topic.id).toBe("nclex-sepsis-shock");
    expect(topic.category).toBe("Review Modules");
    expect(topic.reviewModule?.sections).toHaveLength(8);
    expect(topic.keyConcepts.length).toBeGreaterThan(0);
    expect(topic.mustKnowFacts.length).toBeGreaterThan(0);
    expect(topic.pearls.length).toBeGreaterThan(0);
    expect(topic.pitfalls.length).toBeGreaterThan(0);
  });
});

describe("mergeReviewModules", () => {
  it("injects review modules ahead of base topics for NCLEX", () => {
    const merged = mergeReviewModules(NCLEX_HIGH_YIELD_TOPICS, "nclex");
    expect(merged[0].slug).toBe("sepsis-shock");
    expect(merged[0].reviewModule?.sections).toHaveLength(8);
    expect(merged.some((t) => t.category === "Review Modules")).toBe(true);
  });
});
