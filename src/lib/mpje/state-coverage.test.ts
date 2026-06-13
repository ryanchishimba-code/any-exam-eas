import { describe, expect, it } from "vitest";
import {
  getMpjeStateCoverageTier,
  MPJE_SUBSTANTIVE_STATE_CODES,
  MPJE_TEMPLATED_STATE_CODES,
} from "./state-coverage";

describe("mpje state-coverage", () => {
  it("classifies Oklahoma as substantive", () => {
    expect(getMpjeStateCoverageTier("OK")).toBe("substantive");
  });

  it("classifies major states as templated", () => {
    for (const code of MPJE_TEMPLATED_STATE_CODES) {
      expect(getMpjeStateCoverageTier(code)).toBe("templated");
    }
  });

  it("classifies other states as federal baseline", () => {
    expect(getMpjeStateCoverageTier("OH")).toBe("federal-baseline");
    expect(getMpjeStateCoverageTier("WA")).toBe("federal-baseline");
  });

  it("keeps substantive tier small and explicit", () => {
    expect(MPJE_SUBSTANTIVE_STATE_CODES).toEqual(["OK"]);
  });
});
