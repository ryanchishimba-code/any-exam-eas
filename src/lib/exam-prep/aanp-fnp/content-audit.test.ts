import { describe, expect, it } from "vitest";
import {
  differentKeyGroups,
  garbledOptions,
  optionTypeMismatch,
  type FnpAuditItem,
} from "./content-audit";

function item(partial: Partial<FnpAuditItem> & Pick<FnpAuditItem, "id" | "question">): FnpAuditItem {
  return {
    options: ["Observe", "Reassure", "Refer", "Repeat the exam"],
    correctAnswer: "Observe",
    ...partial,
  };
}

describe("FNP content audit candidates", () => {
  it("groups near-identical stems that do not share a key", () => {
    const stem =
      "An 8-year-old child with ADHD has taken methylphenidate for 6 weeks with no improvement in school reports. Appetite and sleep are stable. What is the most appropriate next step?";
    const groups = differentKeyGroups([
      item({ id: "a", question: stem, correctAnswer: "Increase the dose" }),
      item({
        id: "b",
        question: stem.replace("8-year-old", "9-year-old"),
        correctAnswer: "Switch to an amphetamine-based medication",
      }),
      item({ id: "c", question: "A different cough question for an adult smoker.", correctAnswer: "Chest x-ray" }),
    ]);
    expect(groups).toHaveLength(1);
    expect(groups[0]?.map((row) => row.id).sort()).toEqual(["a", "b"]);
  });

  it("flags a diagnostic ask whose options are treatments", () => {
    expect(
      optionTypeMismatch(
        item({
          id: "d",
          question: "What is the most appropriate initial diagnostic study?",
          options: [
            "Administer the HPV vaccine",
            "Start ACE inhibitor therapy",
            "Prescribe metformin",
            "Give ibuprofen",
          ],
        })
      )
    ).toBe(true);
  });

  it("flags garbled option text", () => {
    expect(garbledOptions(item({ id: "g", question: "Next step?", options: ["Anal ing side effects", "Observe"] }))).toEqual([
      "Anal ing side effects",
    ]);
  });
});
