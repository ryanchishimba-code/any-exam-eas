import { describe, expect, it } from "vitest";
import {
  formatExamDateLong,
  formatExamDateShort,
  formatMmddyyyyDigits,
  isoToMmddyyyy,
  parseMmddyyyy,
  isIsoWithinBounds,
} from "./exam-date-utils";

describe("formatExamDateLong", () => {
  it("formats a calendar date without Intl so server and browser text match", () => {
    const long = formatExamDateLong("2026-10-15");
    expect(long).toBe("Thursday, October 15, 2026");
    expect([...long].every((char) => char.charCodeAt(0) < 128)).toBe(true);
    expect(formatExamDateShort("2026-10-15")).toBe("Oct 15, 2026");
    expect(formatExamDateLong("not-a-date")).toBe("not-a-date");
  });
});

describe("exam-date-utils typed entry", () => {
  it("round-trips ISO dates through mm/dd/yyyy (MMDDYYYY)", () => {
    expect(isoToMmddyyyy("2026-07-03")).toBe("07/03/2026");
    expect(parseMmddyyyy("07/03/2026")).toBe("2026-07-03");
    expect(parseMmddyyyy("07032026")).toBe("2026-07-03");
  });

  it("formats digits with slashes while typing", () => {
    expect(formatMmddyyyyDigits("07")).toBe("07");
    expect(formatMmddyyyyDigits("0703")).toBe("07/03");
    expect(formatMmddyyyyDigits("07032026")).toBe("07/03/2026");
  });

  it("rejects invalid calendar dates", () => {
    expect(parseMmddyyyy("02/30/2026")).toBeNull();
    expect(parseMmddyyyy("01/32/2026")).toBeNull();
    expect(parseMmddyyyy("07/03")).toBeNull();
  });

  it("enforces min/max bounds", () => {
    expect(isIsoWithinBounds("2026-07-03", { minDate: "2026-07-03" })).toBe(true);
    expect(isIsoWithinBounds("2026-07-02", { minDate: "2026-07-03" })).toBe(false);
    expect(isIsoWithinBounds("2000-01-01", { maxDate: "2008-07-03" })).toBe(true);
  });
});
