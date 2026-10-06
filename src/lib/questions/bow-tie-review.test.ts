import { describe, expect, it } from "vitest";
import { bowTieReviewColumns } from "./bow-tie-review";

describe("bowTieReviewColumns", () => {
  it("shows the condition column with the student pick and the keyed condition", () => {
    const columns = bowTieReviewColumns({
      question: "Choose the condition, 2 actions to take, and 2 parameters to monitor.",
      options: ["Start fluids", "Give morphine", "Urine output", "Pain score"],
      correctAnswer: "Hypovolemia|||Start fluids|||Urine output",
      selected: "Sepsis|||Give morphine|||Pain score",
      ngnFormat: "bow_tie",
      bowTie: {
        condition: "Hypovolemia",
        conditionOptions: ["Hypovolemia", "Sepsis"],
        actions: ["Start fluids", "Give morphine"],
        monitors: ["Urine output", "Pain score"],
      },
    });
    expect(columns?.conditions.map((row) => row.text)).toEqual(["Hypovolemia", "Sepsis"]);
    expect(columns?.conditions.find((row) => row.text === "Hypovolemia")?.correct).toBe(true);
    expect(columns?.conditions.find((row) => row.text === "Sepsis")?.selected).toBe(true);
    expect(columns?.parameters).toHaveLength(2);
  });
});
