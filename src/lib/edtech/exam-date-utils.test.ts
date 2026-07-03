import { describe, expect, it } from "vitest";
import {
  formatDdmmyyyyDigits,
  isoToDdmmyyyy,
  parseDdmmyyyy,
  isIsoWithinBounds,
} from "./exam-date-utils";

describe("exam-date-utils typed entry", () => {
  it("round-trips ISO dates through dd/mm/yyyy", () => {
    expect(isoToDdmmyyyy("2026-07-03")).toBe("03/07/2026");
    expect(parseDdmmyyyy("03/07/2026")).toBe("2026-07-03");
    expect(parseDdmmyyyy("03072026")).toBe("2026-07-03");
  });

  it("formats digits with slashes while typing", () => {
    expect(formatDdmmyyyyDigits("03")).toBe("03");
    expect(formatDdmmyyyyDigits("0307")).toBe("03/07");
    expect(formatDdmmyyyyDigits("03072026")).toBe("03/07/2026");
  });

  it("rejects invalid calendar dates", () => {
    expect(parseDdmmyyyy("30/02/2026")).toBeNull();
    expect(parseDdmmyyyy("32/01/2026")).toBeNull();
    expect(parseDdmmyyyy("03/07")).toBeNull();
  });

  it("enforces min/max bounds", () => {
    expect(isIsoWithinBounds("2026-07-03", { minDate: "2026-07-03" })).toBe(true);
    expect(isIsoWithinBounds("2026-07-02", { minDate: "2026-07-03" })).toBe(false);
    expect(isIsoWithinBounds("2000-01-01", { maxDate: "2008-07-03" })).toBe(true);
  });
});
