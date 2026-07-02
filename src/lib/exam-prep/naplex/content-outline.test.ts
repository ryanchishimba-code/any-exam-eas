import { describe, expect, it } from "vitest";
import {
  NAPLEX_CONTENT_OUTLINE,
  NAPLEX_HIGH_YIELD_FOCUS_AREAS,
  NAPLEX_OUTLINE_SOURCE,
} from "./content-outline";

describe("NAPLEX content outline", () => {
  it("defines five NABP domains that sum to 100%", () => {
    expect(NAPLEX_CONTENT_OUTLINE).toHaveLength(5);
    const total = NAPLEX_CONTENT_OUTLINE.reduce((sum, d) => sum + d.weight, 0);
    expect(total).toBeCloseTo(1, 5);
  });

  it("weights Domain 3 as the heaviest (~40%)", () => {
    const domain3 = NAPLEX_CONTENT_OUTLINE.find((d) => d.id === "naplex-area3-treatment-planning");
    expect(domain3?.weight).toBe(0.4);
    expect(domain3?.topics.some((t) => /cardiovascular/i.test(t))).toBe(true);
    expect(domain3?.topics.some((t) => /infectious/i.test(t))).toBe(true);
  });

  it("includes calculations in foundational knowledge", () => {
    const domain1 = NAPLEX_CONTENT_OUTLINE.find((d) => d.id === "naplex-area1-foundations");
    expect(domain1?.topics.some((t) => /calculations/i.test(t))).toBe(true);
    expect(domain1?.highYieldTopics).toContain("calculations");
  });

  it("lists high-yield focus areas for study planning", () => {
    expect(NAPLEX_HIGH_YIELD_FOCUS_AREAS.length).toBeGreaterThanOrEqual(6);
    expect(NAPLEX_HIGH_YIELD_FOCUS_AREAS.some((f) => /Calculations/i.test(f))).toBe(true);
  });

  it("references the May 2025 NABP outline", () => {
    expect(NAPLEX_OUTLINE_SOURCE).toContain("May 1, 2025");
  });
});
