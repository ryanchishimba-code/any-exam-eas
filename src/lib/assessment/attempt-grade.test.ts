import { describe, expect, it } from "vitest";
import { applyStoredGrade, draftForNgnItem, gradeNgnResponse } from "@/lib/assessment/attempt-grade";
import { tagsForStoredAttempt } from "@/lib/study/practice-format";
import type { NgnItem } from "@/lib/assessment/types";

function sata(maxPoints = 2): NgnItem {
  return {
    id: "SATA1",
    version: 1,
    itemType: "bowtie",
    caseId: null,
    caseStep: null,
    cjmmFunction: [],
    timepoint: null,
    responseFormat: "mr_sata",
    scoringRule: "plus_minus",
    maxPoints,
    stem: "Select the findings that matter.",
    payload: { keys: ["a", "b"] },
    rationale: {
      short: "",
      expanded: { perOption: {}, cjmmCoaching: "", pointsLost: "", takeaway: "" },
    },
    clientNeeds: { subcategory: "Management of Care" },
    references: [],
    rnFlags: [],
  };
}

describe("NGN attempt scoring", () => {
  it("records partial credit as a miss and full credit as correct", () => {
    const item = sata();
    expect(gradeNgnResponse(item, ["a"]).points).toBe(1);
    const partial = draftForNgnItem({
      item,
      response: ["a"],
      subjectId: "management-of-care",
    });
    expect(partial.correct).toBe(false);
    expect(partial.questionKey).toBe("ngn:SATA1:v1");
    expect(partial.bankItemId).toBe(partial.questionKey);
    expect(JSON.parse(partial.selectedAnswer ?? "{}")).toMatchObject({ points: 1, maxPoints: 2 });

    const full = draftForNgnItem({ item, response: ["a", "b"], subjectId: "management-of-care" });
    expect(full.correct).toBe(true);
    expect(JSON.parse(full.selectedAnswer ?? "{}").points).toBe(2);

    const storedTags = tagsForStoredAttempt(partial.tags, "ngn");
    expect(storedTags.some((tag) => tag.includes("practice-format:ngn"))).toBe(true);
  });

  it("rescores from the stored item so a client cannot mark a miss correct", () => {
    const item = sata();
    const draft = draftForNgnItem({ item, response: ["a", "c"] });
    draft.correct = true;
    const graded = applyStoredGrade(draft, item);
    expect(graded.correct).toBe(false);
    expect(JSON.parse(graded.selectedAnswer ?? "{}").points).toBe(0);
    expect(applyStoredGrade(draft, null).correct).toBe(false);
  });
});
