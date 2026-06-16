import { describe, expect, it } from "vitest";
import {
  getExamTopicStudyLinks,
  getWeakTopicsFromBreakdown,
  topicNameToSlug,
} from "./exam-topic-bridge";

describe("exam-topic-bridge", () => {
  it("normalizes topic names to slugs", () => {
    expect(topicNameToSlug("Cardiology")).toBe("cardiology");
    expect(topicNameToSlug("tag:physiological-adaptation")).toBe("physiological-adaptation");
  });

  it("returns reference and practice links for known topics", () => {
    const links = getExamTopicStudyLinks("usmle", "Cardiology");
    expect(links.referenceHref).toContain("/reference");
    expect(links.practiceHref).toContain("count=10");
    expect(links.memoryCardIds.length).toBeGreaterThan(0);
    expect(links.anatomyStructures.length).toBeGreaterThan(0);
  });

  it("filters weak topics below threshold", () => {
    const breakdown = [
      { topic: "Cardiology", correct: 2, total: 10, pct: 20 },
      { topic: "Nephrology", correct: 8, total: 10, pct: 80 },
    ];
    const weak = getWeakTopicsFromBreakdown(breakdown, 70);
    expect(weak).toHaveLength(1);
    expect(weak[0]?.topic).toBe("Cardiology");
  });
});
