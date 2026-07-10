import { describe, expect, it } from "vitest";
import {
  aiTutorExamLabel,
  isAiTutorFieldId,
  resolveAiTutorFieldId,
} from "./ai-tutor-fields";

describe("ai-tutor-fields", () => {
  it("enables NCLEX, NAPLEX, and all USMLE steps", () => {
    expect(isAiTutorFieldId("nursing")).toBe(true);
    expect(isAiTutorFieldId("nclex")).toBe(true);
    expect(isAiTutorFieldId("pharmacy")).toBe(true);
    expect(isAiTutorFieldId("naplex")).toBe(true);
    expect(isAiTutorFieldId("usmle-step-1")).toBe(true);
    expect(isAiTutorFieldId("usmle-step-2")).toBe(true);
    expect(isAiTutorFieldId("usmle-step-3")).toBe(true);
  });

  it("disables other board fields", () => {
    expect(isAiTutorFieldId("pance")).toBe(false);
    expect(isAiTutorFieldId("aanp-fnp")).toBe(false);
    expect(isAiTutorFieldId("npte-pt")).toBe(false);
  });

  it("labels exams for UI copy", () => {
    expect(aiTutorExamLabel("nursing")).toBe("NCLEX");
    expect(aiTutorExamLabel("pharmacy")).toBe("NAPLEX");
    expect(aiTutorExamLabel("usmle-step-2")).toBe("USMLE");
    expect(resolveAiTutorFieldId("usmle-step-2-ck")).toBe("usmle-step-2");
  });
});
