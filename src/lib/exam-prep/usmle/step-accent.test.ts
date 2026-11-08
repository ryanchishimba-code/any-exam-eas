import { describe, expect, it } from "vitest";
import { defaultUsmleFieldId, defaultUsmleStepLevel } from "@/lib/exam-prep/usmle/steps";
import { usmleStepAccentBadge } from "@/lib/exam-prep/usmle/step-accent";

describe("default USMLE step", () => {
  it("uses one step when nothing is saved", () => {
    expect(defaultUsmleStepLevel()).toBe("step2");
    expect(defaultUsmleFieldId()).toBe("usmle-step-2");
  });
});

describe("usmleStepAccentBadge", () => {
  it("keeps Recommended on Step 2 CK when that bank is the largest", () => {
    expect(usmleStepAccentBadge("step2", "step2")).toBe("Recommended");
    expect(usmleStepAccentBadge("step1", "step2")).toBeUndefined();
    expect(usmleStepAccentBadge("step3", "step2")).toBeUndefined();
  });

  it("marks a larger other step without taking Recommended off Step 2 CK", () => {
    expect(usmleStepAccentBadge("step1", "step1")).toBe("Largest bank");
    expect(usmleStepAccentBadge("step2", "step1")).toBe("Recommended");
    expect(usmleStepAccentBadge("step3", "step1")).toBeUndefined();
  });
});
