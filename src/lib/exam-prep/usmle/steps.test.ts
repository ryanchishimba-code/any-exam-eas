import { describe, expect, it } from "vitest";
import {
  resolveUsmleFieldId,
  USMLE_COMBINED_TARGET,
  USMLE_STEPS,
} from "./steps";
import { normalizeFieldId } from "@/lib/subjects/field-ids";

describe("usmle steps", () => {
  it("preserves distinct step field ids", () => {
    expect(normalizeFieldId("usmle-step-1")).toBe("usmle-step-1");
    expect(normalizeFieldId("usmle-step-2")).toBe("usmle-step-2");
    expect(normalizeFieldId("usmle-step-3")).toBe("usmle-step-3");
  });

  it("does not collapse step 1 or 3 into step 2", () => {
    expect(normalizeFieldId("step-1")).toBe("usmle-step-1");
    expect(normalizeFieldId("step-3")).toBe("usmle-step-3");
    expect(normalizeFieldId("step-1")).not.toBe("usmle-step-2");
  });

  it("defaults generic usmle alias to step 2", () => {
    expect(resolveUsmleFieldId("usmle")).toBe("usmle-step-2");
  });

  it("defines all three steps with targets", () => {
    expect(USMLE_STEPS).toHaveLength(3);
    expect(USMLE_COMBINED_TARGET).toBe(
      USMLE_STEPS.reduce((sum, step) => sum + step.targetQuestions, 0)
    );
  });

  it("defines per-step serve QA floors aligned with board difficulty", () => {
    expect(USMLE_STEPS.find((s) => s.fieldId === "usmle-step-1")?.serveMinQaScore).toBe(7.5);
    expect(USMLE_STEPS.find((s) => s.fieldId === "usmle-step-2")?.serveMinQaScore).toBe(8);
    expect(USMLE_STEPS.find((s) => s.fieldId === "usmle-step-3")?.serveMinQaScore).toBe(7.5);
  });
});
