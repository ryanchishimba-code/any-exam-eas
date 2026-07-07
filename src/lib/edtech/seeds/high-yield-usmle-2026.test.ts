import { describe, expect, it } from "vitest";
import { allUsmle2026TopicSlugs, USMLE_CROSS_CUTTING_TOPICS } from "@/lib/exam-prep/usmle/blueprint-topics-2026";
import { USMLE_2026_HIGH_YIELD_TOPICS } from "@/lib/edtech/seeds/high-yield-usmle-2026";
import { USMLE_2026_STUDY_CONTENT } from "@/lib/edtech/seeds/usmle-2026-high-yield-content";

describe("USMLE 2026 high-yield modules", () => {
  it("covers all blueprint topic slugs plus cross-cutting themes", () => {
    const slugs = new Set(USMLE_2026_HIGH_YIELD_TOPICS.map((t) => t.slug));
    const blueprintSlugs = allUsmle2026TopicSlugs();
    for (const slug of blueprintSlugs) {
      expect(slugs.has(slug)).toBe(true);
    }
    expect(slugs.has("biostatistics-interpretation")).toBe(true);
    expect(slugs.has("emergency-acls")).toBe(true);
  });

  it("has deep curated content for every module slug (no template-only gaps)", () => {
    const required = [
      ...allUsmle2026TopicSlugs(),
      ...USMLE_CROSS_CUTTING_TOPICS.map((t) => t.slug),
    ];
    for (const slug of required) {
      const content = USMLE_2026_STUDY_CONTENT[slug];
      expect(content, `missing content for ${slug}`).toBeDefined();
      expect(content!.keyConcepts!.length).toBeGreaterThanOrEqual(5);
      expect(content!.pearls!.length).toBeGreaterThanOrEqual(1);
      expect(content!.pitfalls!.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("assigns unique slugs", () => {
    const slugs = USMLE_2026_HIGH_YIELD_TOPICS.map((t) => t.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("Step 2 internal medicine modules include acs-management", () => {
    const acs = USMLE_2026_HIGH_YIELD_TOPICS.find((t) => t.slug === "acs-management");
    expect(acs?.usmleSteps).toEqual(["step2"]);
    expect(acs?.keyConcepts.length).toBeGreaterThan(3);
  });
});
