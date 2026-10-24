import { describe, expect, it } from "vitest";
import {
  aggregateAttemptsByBlueprintCategory,
  resolveBlueprintCategoryIdForAttempt,
} from "./attempt-blueprint-attribution";

describe("attempt blueprint attribution", () => {
  it("maps pharmacology-nursing attempts to the pharmacology category", () => {
    expect(
      resolveBlueprintCategoryIdForAttempt("nursing", { subjectId: "pharmacology-nursing" })
    ).toBe("pharmacology");
  });

  it("maps legacy med-surg to physiological adaptation", () => {
    expect(resolveBlueprintCategoryIdForAttempt("nursing", { subjectId: "med-surg" })).toBe(
      "physiological-adaptation"
    );
  });

  it("counts distinct items per blueprint category", () => {
    const { statsByCategory, seenByCategory } = aggregateAttemptsByBlueprintCategory("npte-pt", [
      { subjectId: "musculoskeletal", correct: true, bankItemId: "a" },
      { subjectId: "musculoskeletal", correct: false, bankItemId: "a" },
      { subjectId: "musculoskeletal", correct: true, bankItemId: "b" },
    ]);
    expect(statsByCategory.get("musculoskeletal")).toEqual({ attempts: 3, correct: 2 });
    expect(seenByCategory.get("musculoskeletal")).toBe(2);
  });
});
