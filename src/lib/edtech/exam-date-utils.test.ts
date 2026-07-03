import { describe, expect, it } from "vitest";
import {
  isoToMmddyyyy,
  parseMmddyyyy,
  isIsoWithinBounds,
} from "./exam-date-utils";

describe("exam-date-utils typed entry", () => {
  it("round-trips ISO dates through mmddyyyy", () => {
    expect(isoToMmddyyyy("2026-07-03")).toBe("07032026");
    expect(parseMmddyyyy("07032026")).toBe("2026-07-03");
  });

  it("rejects invalid calendar dates", () => {
    expect(parseMmddyyyy("02302026")).toBeNull();
    expect(parseMmddyyyy("13012026")).toBeNull();
    expect(parseMmddyyyy("0703")).toBeNull();
  });

  it("enforces min/max bounds", () => {
    expect(isIsoWithinBounds("2026-07-03", { minDate: "2026-07-03" })).toBe(true);
    expect(isIsoWithinBounds("2026-07-02", { minDate: "2026-07-03" })).toBe(false);
    expect(isIsoWithinBounds("2000-01-01", { maxDate: "2008-07-03" })).toBe(true);
  });
});
