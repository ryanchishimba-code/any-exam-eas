import { describe, expect, it } from "vitest";
import { getAllAnatomyStructures } from "@/lib/anatomy/systems/catalog/queries";
import {
  parseTopicPracticeLaunchFilters,
  topicPracticeFiltersActive,
} from "@/lib/study/topic-practice-filters";
import {
  resolveAnatomyStructurePractice,
  structurePracticeHref,
} from "./structure-practice";

describe("resolveAnatomyStructurePractice", () => {
  it("maps heart (cardiovascular) to NCLEX physiological adaptation + cardiac blueprint", () => {
    const { subjectId, filters } = resolveAnatomyStructurePractice(
      "nclex",
      "cardiovascular"
    );
    expect(subjectId).toBe("physiological-adaptation");
    expect(filters.fieldId).toBe("nursing");
    expect(filters.blueprintTopics).toContain("cardiac-emergencies");
  });

  it("keeps PANCE cardiovascular on the cardiovascular subject", () => {
    const { subjectId, filters } = resolveAnatomyStructurePractice(
      "pance",
      "cardiovascular"
    );
    expect(subjectId).toBe("cardiovascular");
    expect(filters.fieldId).toBe("pance");
    expect(filters.panceTopic).toBe("cardiovascular");
  });
});

describe("structurePracticeHref", () => {
  it("embeds NCLEX topic filters and anatomy return params for heart", () => {
    const href = structurePracticeHref(
      "nclex",
      { id: "heart", name: "Heart", practiceTopicSlug: "cardiovascular" },
      10
    );
    const url = new URL(href, "http://localhost");
    expect(url.searchParams.get("field")).toBe("nursing");
    expect(url.searchParams.get("subjectId")).toBe("physiological-adaptation");
    expect(url.searchParams.get("blueprintTopics")).toContain("cardiac-emergencies");
    expect(url.searchParams.get("style")).toBe("standard");
    expect(url.searchParams.get("returnStructure")).toBe("heart");
    expect(url.searchParams.get("returnStructureName")).toBe("Heart");
  });

  it("encodes blueprintTopics on every NCLEX structure practice link when resolved", () => {
    for (const structure of getAllAnatomyStructures()) {
      const { filters } = resolveAnatomyStructurePractice("nclex", structure.practiceTopicSlug);
      const href = structurePracticeHref("nclex", structure, 10);
      const url = new URL(href, "http://localhost");
      const parsed = parseTopicPracticeLaunchFilters(url.searchParams);
      if (filters.blueprintTopics?.length) {
        expect(url.searchParams.get("blueprintTopics")).toBeTruthy();
        expect(parsed.blueprintTopics?.length).toBeGreaterThan(0);
        expect(topicPracticeFiltersActive(parsed)).toBe(true);
      }
      expect(url.searchParams.get("style")).toBe("standard");
    }
  });

  it("uses USMLE board field and cardiovascular filters for heart", () => {
    const href = structurePracticeHref(
      "usmle",
      { id: "heart", name: "Heart", practiceTopicSlug: "cardiovascular" },
      10
    );
    const url = new URL(href, "http://localhost");
    expect(url.searchParams.get("field")).toMatch(/^usmle-step-/);
    expect(url.searchParams.get("subjectId")).not.toBe("__mixed__");
    expect(url.searchParams.get("returnStructure")).toBe("heart");
  });
});
