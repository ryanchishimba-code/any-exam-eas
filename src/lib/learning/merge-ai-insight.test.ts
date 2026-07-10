import { describe, expect, it } from "vitest";
import { mergeAiTutorInsight } from "./merge-ai-insight";
import type { LearningInsight } from "./types";

const base: LearningInsight = {
  summary: "Rule-based summary",
  whyCorrect: "Rule correct",
  whyIncorrect: { "Option A": "Rule wrong A" },
  keyTakeaways: ["Takeaway 1"],
  pearls: ["Pearl 1"],
  relatedConcepts: ["concept-a"],
  commonTraps: [],
};

describe("mergeAiTutorInsight", () => {
  it("prefers AI fields when present", () => {
    const merged = mergeAiTutorInsight(base, {
      summary: "AI summary",
      whyCorrect: "AI correct",
      whyIncorrect: { "Option B": "AI wrong B" },
      keyTakeaways: ["AI takeaway"],
      pearls: ["AI pearl"],
      relatedConcepts: ["concept-b"],
    });

    expect(merged.summary).toBe("AI summary");
    expect(merged.whyCorrect).toBe("AI correct");
    expect(merged.whyIncorrect["Option A"]).toBe("Rule wrong A");
    expect(merged.whyIncorrect["Option B"]).toBe("AI wrong B");
    expect(merged.keyTakeaways).toEqual(["AI takeaway"]);
  });
});
