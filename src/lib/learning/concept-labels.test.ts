import { describe, expect, it } from "vitest";
import {
  formatConceptLabel,
  isInternalMasteryConceptKey,
  studentFacingConceptLabel,
} from "./concept-labels";

describe("isInternalMasteryConceptKey", () => {
  it("flags generation batch keys", () => {
    expect(isInternalMasteryConceptKey("batch-nclex-gap-2026-07-05-zm54j9")).toBe(true);
    expect(isInternalMasteryConceptKey("tag:batch-nclex-gap-2026-07-06-ausp9q")).toBe(true);
    expect(isInternalMasteryConceptKey("Batch Nclex Gap 2026 07 05 Zm54j9")).toBe(true);
  });

  it("flags exam-level placeholders", () => {
    expect(isInternalMasteryConceptKey("exam-level")).toBe(true);
    expect(isInternalMasteryConceptKey("subject:exam_level")).toBe(true);
  });

  it("keeps real topics", () => {
    expect(isInternalMasteryConceptKey("subject:management-of-care")).toBe(false);
    expect(isInternalMasteryConceptKey("physiological-adaptation")).toBe(false);
    expect(isInternalMasteryConceptKey("tag:fluid-balance-io")).toBe(false);
  });
});

describe("studentFacingConceptLabel", () => {
  it("returns null for internal keys", () => {
    expect(studentFacingConceptLabel("batch-nclex-gap-2026-07-05-zm54j9")).toBeNull();
  });

  it("prefers subject labels", () => {
    expect(
      studentFacingConceptLabel("subject:management-of-care", {
        subjectLabel: "Management of Care",
      })
    ).toBe("Management of Care");
  });

  it("title-cases student-facing slugs", () => {
    expect(formatConceptLabel("subject:basic-care-and-comfort")).toBe(
      "Basic Care And Comfort"
    );
  });
});
