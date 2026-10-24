import { describe, expect, it } from "vitest";
import { practiceFieldIdForExamSession } from "./practice-field-id";

describe("practiceFieldIdForExamSession", () => {
  it("uses the session row field for each USMLE step", () => {
    expect(
      practiceFieldIdForExamSession({ fieldId: "usmle-step-1" }, "usmle")
    ).toBe("usmle-step-1");
    expect(
      practiceFieldIdForExamSession({ fieldId: "usmle-step-3" }, "usmle")
    ).toBe("usmle-step-3");
  });

  it("falls back to the catalog default when fieldId is missing", () => {
    expect(practiceFieldIdForExamSession({ fieldId: null }, "usmle")).toBe("usmle-step-2");
    expect(practiceFieldIdForExamSession({ fieldId: null }, "nclex")).toBe("nursing");
  });
});
