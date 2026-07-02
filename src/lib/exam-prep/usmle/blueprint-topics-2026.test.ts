import { describe, expect, it } from "vitest";
import {
  USMLE_STEP1_TOPIC_GROUPS,
  USMLE_STEP2_TOPIC_GROUPS,
  USMLE_STEP3_TOPIC_GROUPS,
  allUsmle2026TopicSlugs,
  pickUsmle2026BlueprintTopic,
} from "./blueprint-topics-2026";

describe("USMLE 2026 topic catalog", () => {
  it("Step 2 internal medicine has broad clinical coverage", () => {
    const im = USMLE_STEP2_TOPIC_GROUPS.find((g) => g.categoryId === "internal-medicine");
    expect(im?.topics.length).toBeGreaterThanOrEqual(15);
  });

  it("Step 1 groups cover organ systems and pharmacology", () => {
    expect(USMLE_STEP1_TOPIC_GROUPS.length).toBeGreaterThanOrEqual(8);
    const pharm = USMLE_STEP1_TOPIC_GROUPS.find((g) => g.categoryId === "pharmacology-microbiology");
    expect(pharm?.topics.length).toBeGreaterThanOrEqual(5);
  });

  it("Step 3 includes CCS topics", () => {
    const ccs = USMLE_STEP3_TOPIC_GROUPS.find((g) => g.categoryId === "ccs");
    expect(ccs?.topics.length).toBeGreaterThanOrEqual(3);
  });

  it("topic slugs are unique", () => {
    const slugs = allUsmle2026TopicSlugs();
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("pickUsmle2026BlueprintTopic returns known slugs", () => {
    const slug = pickUsmle2026BlueprintTopic("step2", "internal-medicine", 2, 5);
    expect(allUsmle2026TopicSlugs()).toContain(slug);
  });
});
