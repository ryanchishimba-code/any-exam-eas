import { describe, expect, it } from "vitest";
import {
  isNclexDelegationStem,
  maxDelegationServeCount,
  NCLEX_DELEGATION_SERVE_CAP,
} from "./delegation-balance";

describe("nclex delegation balance", () => {
  it("detects delegation stems", () => {
    expect(
      isNclexDelegationStem("Which task is appropriate for the nurse to delegate to UAP?")
    ).toBe(true);
    expect(isNclexDelegationStem("Which nursing action should the nurse take first?")).toBe(false);
  });

  it("caps delegation serve count at 5%", () => {
    expect(maxDelegationServeCount(6938)).toBe(Math.floor(6938 * NCLEX_DELEGATION_SERVE_CAP));
    expect(maxDelegationServeCount(80)).toBe(4);
  });
});
