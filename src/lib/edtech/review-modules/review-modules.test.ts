import { describe, expect, it } from "vitest";
import { defineReviewModuleTopic } from "./build-topic";
import { REVIEW_MODULE_CONTENT_BY_SLUG, SEPSIS_MODULE } from "./content";
import {
  REVIEW_MODULE_SECTION_ORDER,
  type ReviewModuleSection,
} from "./types";
import { REVIEW_MODULE_TOPICS, mergeReviewModules } from "../seeds/review-module-topics";
import { NAPLEX_HIGH_YIELD_TOPICS } from "../seeds/high-yield-naplex";
import { NCLEX_HIGH_YIELD_TOPICS } from "../seeds/high-yield-nclex";
import { AANP_FNP_HIGH_YIELD_TOPICS } from "../seeds/high-yield-aanp-fnp";
import { getMemoryCardsByReviewModuleSlug } from "@/lib/reference/seeds";

function sectionHasContent(section: ReviewModuleSection): boolean {
  return (
    (section.paragraphs?.length ?? 0) > 0 ||
    (section.bullets?.length ?? 0) > 0 ||
    (section.tables?.length ?? 0) > 0
  );
}

describe("review module content", () => {
  it("defines flagship textbook modules", () => {
    expect(Object.keys(REVIEW_MODULE_CONTENT_BY_SLUG).length).toBeGreaterThanOrEqual(15);
    expect(REVIEW_MODULE_TOPICS.length).toBeGreaterThanOrEqual(15);
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
    expect(merged[0].slug).toBe("infection-control");
    expect(merged[0].reviewModule?.sections).toHaveLength(8);
    expect(merged.some((t) => t.category === "Review Modules")).toBe(true);
  });

  it("injects review modules ahead of base topics for NAPLEX with HF first", () => {
    const merged = mergeReviewModules(NAPLEX_HIGH_YIELD_TOPICS, "naplex");
    expect(merged[0].slug).toBe("heart-failure-gdmt");
    expect(merged[0].reviewModule?.sections).toHaveLength(8);
    expect(merged.some((t) => t.category === "Review Modules")).toBe(true);
  });

  it("injects review modules for AANP FNP with ACS first", () => {
    const merged = mergeReviewModules(AANP_FNP_HIGH_YIELD_TOPICS, "aanp-fnp");
    expect(merged[0].slug).toBe("acute-coronary-syndrome");
    expect(merged[0].reviewModule?.sections).toHaveLength(8);
    expect(merged.some((t) => t.slug === "aanp-diagnose-domain" && t.reviewModule)).toBe(true);
  });
});

describe("NCLEX memory cards ↔ deep dive modules", () => {
  const nclexModules = REVIEW_MODULE_TOPICS.filter((t) => t.examSlug === "nclex");

  for (const mod of nclexModules) {
    it(`${mod.slug} has memory cards linked for deep dive`, () => {
      const cards = getMemoryCardsByReviewModuleSlug("nclex", mod.slug);
      expect(cards.length).toBeGreaterThanOrEqual(6);
      for (const card of cards) {
        expect(card.reviewModuleSlug).toBe(mod.slug);
        expect(card.practiceTopicSlug).toBe(mod.practiceTopicSlug);
      }
    });
  }
});

describe("PANCE memory cards ↔ deep dive modules", () => {
  const panceModules = REVIEW_MODULE_TOPICS.filter((t) => t.examSlug === "pance");

  for (const mod of panceModules) {
    it(`${mod.slug} has memory cards linked for deep dive`, () => {
      const cards = getMemoryCardsByReviewModuleSlug("pance", mod.slug);
      expect(cards.length).toBeGreaterThanOrEqual(6);
      for (const card of cards) {
        expect(card.reviewModuleSlug).toBe(mod.slug);
      }
    });
  }
});

describe("AANP FNP memory cards ↔ deep dive modules", () => {
  const aanpModules = REVIEW_MODULE_TOPICS.filter((t) => t.examSlug === "aanp-fnp");

  for (const mod of aanpModules) {
    it(`${mod.slug} has memory cards linked for deep dive`, () => {
      const cards = getMemoryCardsByReviewModuleSlug("aanp-fnp", mod.slug);
      expect(cards.length).toBeGreaterThanOrEqual(6);
      for (const card of cards) {
        expect(card.reviewModuleSlug).toBe(mod.slug);
      }
    });
  }
});
