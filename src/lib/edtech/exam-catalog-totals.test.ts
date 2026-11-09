import { describe, expect, it } from "vitest";
import { catalogFieldsToCount, sumFieldCounts } from "./exam-catalog-totals";

describe("exam catalog totals", () => {
  it("adds Step 1 and Step 3 once without double-counting Step 2", () => {
    const fields = catalogFieldsToCount([
      "nursing",
      "usmle-step-2",
      "pharmacy",
    ]);
    expect(fields).toEqual([
      "nursing",
      "usmle-step-2",
      "pharmacy",
      "usmle-step-1",
      "usmle-step-3",
    ]);
    expect(
      sumFieldCounts(fields, {
        nursing: 10,
        "usmle-step-1": 2041,
        "usmle-step-2": 1765,
        "usmle-step-3": 4783,
        pharmacy: 5,
      })
    ).toBe(10 + 2041 + 1765 + 4783 + 5);
  });
});
