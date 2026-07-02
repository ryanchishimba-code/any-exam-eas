import { describe, expect, it } from "vitest";
import {
  NPTE_PT_2026_TOPIC_GROUPS,
  NPTE_PT_CONTENT_CATEGORY_IDS,
  NPTE_PT_CROSS_CUTTING_TOPICS,
  allNptePt2026TopicSlugs,
  pickNptePt2026BlueprintTopic,
  pickNptePt2026ContentCategory,
} from "./blueprint-topics-2026";

describe("NPTE-PT 2026 topic catalog", () => {
  it("covers all 14 FSBPT content categories", () => {
    expect(NPTE_PT_2026_TOPIC_GROUPS).toHaveLength(14);
    expect(NPTE_PT_CONTENT_CATEGORY_IDS).toHaveLength(14);
  });

  it("expands musculoskeletal and neuromuscular as very-high yield", () => {
    const msk = NPTE_PT_2026_TOPIC_GROUPS.find((g) => g.categoryId === "musculoskeletal");
    const neuro = NPTE_PT_2026_TOPIC_GROUPS.find((g) => g.categoryId === "neuromuscular-nervous");
    expect(msk?.yield).toBe("very-high");
    expect(neuro?.yield).toBe("very-high");
    expect(msk?.topics.length).toBeGreaterThanOrEqual(15);
    expect(neuro?.topics.length).toBeGreaterThanOrEqual(10);
  });

  it("includes spine, shoulder, knee, and vestibular high-yield topics", () => {
    const slugs = allNptePt2026TopicSlugs();
    expect(slugs).toContain("lumbar-low-back-pain");
    expect(slugs).toContain("rotator-cuff-impingement");
    expect(slugs).toContain("acl-rehab-phases");
    expect(slugs).toContain("balance-vestibular-disorders");
    expect(slugs).toContain("stroke-cva-hemiplegia");
  });

  it("topic slugs are unique", () => {
    const slugs = allNptePt2026TopicSlugs();
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("pickNptePt2026BlueprintTopic returns known slugs", () => {
    const slug = pickNptePt2026BlueprintTopic("musculoskeletal", 2, 5);
    expect(allNptePt2026TopicSlugs()).toContain(slug);
  });

  it("pickNptePt2026ContentCategory returns valid category ids", () => {
    const category = pickNptePt2026ContentCategory(3, 7);
    expect(NPTE_PT_CONTENT_CATEGORY_IDS).toContain(category);
  });

  it("defines cross-cutting red flags and FITT topics", () => {
    const slugs = NPTE_PT_CROSS_CUTTING_TOPICS.map((t) => t.slug);
    expect(slugs).toContain("red-flags-referral");
    expect(slugs).toContain("exercise-prescription-fitt");
  });
});
