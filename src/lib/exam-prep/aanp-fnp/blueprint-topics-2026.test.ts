import { describe, expect, it } from "vitest";
import {
  AANP_FNP_2026_TOPIC_GROUPS,
  AANP_FNP_CLINICAL_SYSTEM_IDS,
  AANP_FNP_CONTENT_CATEGORIES,
  AANP_FNP_LIFESPAN_BANDS,
  allAanpFnp2026TopicSlugs,
  pickAanpFnp2026BlueprintTopic,
  pickAanpFnp2026ClinicalSystem,
} from "./blueprint-topics-2026";

describe("AANP FNP 2026 topic catalog", () => {
  it("covers 12 body-system modules including very-high-yield cardiovascular", () => {
    expect(AANP_FNP_2026_TOPIC_GROUPS.length).toBe(12);
    const cv = AANP_FNP_2026_TOPIC_GROUPS.find((g) => g.categoryId === "cardiovascular");
    expect(cv?.yield).toBe("very-high");
    expect(cv?.topics.length).toBeGreaterThanOrEqual(6);
  });

  it("content category weights sum to 1", () => {
    const sum = AANP_FNP_CONTENT_CATEGORIES.reduce((acc, c) => acc + c.weight, 0);
    expect(sum).toBeCloseTo(1, 2);
  });

  it("lifespan band weights sum to 1", () => {
    const sum = AANP_FNP_LIFESPAN_BANDS.reduce((acc, b) => acc + b.weight, 0);
    expect(sum).toBeCloseTo(1, 2);
  });

  it("topic slugs are unique", () => {
    const slugs = allAanpFnp2026TopicSlugs();
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("pickAanpFnp2026BlueprintTopic returns known slugs", () => {
    const slug = pickAanpFnp2026BlueprintTopic("cardiovascular", 2, 5);
    expect(allAanpFnp2026TopicSlugs()).toContain(slug);
  });

  it("pickAanpFnp2026ClinicalSystem returns valid system ids", () => {
    const system = pickAanpFnp2026ClinicalSystem(3, 7);
    expect(AANP_FNP_CLINICAL_SYSTEM_IDS).toContain(system);
  });
});
