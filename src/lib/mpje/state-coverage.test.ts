import { describe, expect, it } from "vitest";
import {
  getMpjeStateCoverageTier,
  MPJE_SUBSTANTIVE_STATE_CODES,
  MPJE_TEMPLATED_STATE_CODES,
} from "./state-coverage";

describe("mpje state-coverage", () => {
  it("classifies substantive states including IL, NJ, GA", () => {
    for (const code of MPJE_SUBSTANTIVE_STATE_CODES) {
      expect(getMpjeStateCoverageTier(code)).toBe("substantive");
    }
  });

  it("classifies California as templated", () => {
    expect(getMpjeStateCoverageTier("CA")).toBe("templated");
  });

  it("classifies other states as federal baseline", () => {
    expect(getMpjeStateCoverageTier("WA")).toBe("federal-baseline");
    expect(getMpjeStateCoverageTier("MI")).toBe("federal-baseline");
  });

  it("keeps substantive and templated tiers explicit", () => {
    expect(MPJE_SUBSTANTIVE_STATE_CODES).toEqual([
      "OK",
      "TX",
      "FL",
      "NY",
      "PA",
      "OH",
      "IL",
      "NJ",
      "GA",
    ]);
    expect(MPJE_TEMPLATED_STATE_CODES).toEqual(["CA"]);
  });
});
