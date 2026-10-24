import { describe, expect, it } from "vitest";
import { boardStatStripFigures } from "./stat-strip";

describe("boardStatStripFigures", () => {
  it("keeps up to three numeric stats and drops non-numeric labels", () => {
    expect(
      boardStatStripFigures([
        { value: "108", label: "Questions" },
        { value: "Aligned", label: "NCSBN test plan" },
        { value: "4", label: "Case studies" },
        { value: "12", label: "NGN items" },
      ])
    ).toEqual([
      { value: "108", label: "Questions" },
      { value: "4", label: "Case studies" },
      { value: "12", label: "NGN items" },
    ]);
  });
});
