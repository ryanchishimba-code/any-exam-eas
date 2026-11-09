import { describe, expect, it } from "vitest";
import {
  PROCEDURAL_TOPUP_EXCLUDED_FIELDS,
  proceduralTopUpExcluded,
} from "@/lib/sync-question-bank";

describe("procedural top-up exclusion", () => {
  it("does not generate USMLE items", () => {
    expect(proceduralTopUpExcluded("usmle-step-1")).toBe(true);
    expect(proceduralTopUpExcluded("usmle-step-2")).toBe(true);
    expect(proceduralTopUpExcluded("usmle-step-3")).toBe(true);
  });

  it("still skips the boards that were already curated-only", () => {
    for (const fieldId of ["nursing", "pharmacy", "pance", "aanp-fnp", "npte-pt"]) {
      expect(proceduralTopUpExcluded(fieldId)).toBe(true);
    }
  });

  it("leaves no practice board on the generator", () => {
    expect([...PROCEDURAL_TOPUP_EXCLUDED_FIELDS].sort()).toEqual([
      "aanp-fnp",
      "npte-pt",
      "nursing",
      "pance",
      "pharmacy",
      "usmle-step-1",
      "usmle-step-2",
      "usmle-step-3",
    ]);
  });
});
