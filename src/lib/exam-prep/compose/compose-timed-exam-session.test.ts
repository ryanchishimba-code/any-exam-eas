import { describe, expect, it } from "vitest";
import {
  fieldSupportsBlueprintTimedExam,
} from "./compose-timed-exam-session";

describe("fieldSupportsBlueprintTimedExam", () => {
  it("supports all board full-exam fields", () => {
    for (const fieldId of [
      "nursing",
      "pharmacy",
      "pance",
      "aanp-fnp",
      "npte-pt",
      "usmle-step-1",
      "usmle-step-2",
      "usmle-step-3",
    ]) {
      expect(fieldSupportsBlueprintTimedExam(fieldId)).toBe(true);
    }
  });

  it("does not support non-blueprint fields", () => {
    expect(fieldSupportsBlueprintTimedExam("mpje")).toBe(false);
  });
});
