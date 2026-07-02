import { describe, expect, it } from "vitest";
import {
  NCLEX_2026_CLIENT_NEEDS,
  allNclex2026TopicSlugs,
  pickNclex2026BlueprintTopic,
} from "./blueprint-topics-2026";

describe("NCLEX 2026 topic catalog", () => {
  it("category weights sum to 1.0", () => {
    const sum = NCLEX_2026_CLIENT_NEEDS.reduce((n, c) => n + c.weight, 0);
    expect(sum).toBeCloseTo(1, 5);
  });

  it("has at least 8 topics per Client Needs category", () => {
    for (const cat of NCLEX_2026_CLIENT_NEEDS) {
      expect(cat.topics.length).toBeGreaterThanOrEqual(8);
    }
  });

  it("topic slugs are unique", () => {
    const slugs = allNclex2026TopicSlugs();
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("pickNclex2026BlueprintTopic returns known slugs", () => {
    const slug = pickNclex2026BlueprintTopic("pharmacology-nursing", 3, 1);
    expect(allNclex2026TopicSlugs()).toContain(slug);
  });
});
