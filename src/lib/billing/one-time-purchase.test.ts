import { describe, expect, it } from "vitest";
import {
  addMonths,
  extendOneTimeAccess,
  oneTimeAccessActive,
  oneTimeAccessEnd,
} from "./one-time-purchase";

describe("addMonths", () => {
  it("clamps to the last valid day instead of spilling into the next month", () => {
    expect(addMonths(new Date("2026-01-31T12:00:00Z"), 1).getUTCMonth()).toBe(1);
    expect(addMonths(new Date("2026-01-31T12:00:00Z"), 1).getUTCDate()).toBe(28);
  });

  it("handles leap years", () => {
    const end = addMonths(new Date("2028-01-31T12:00:00Z"), 1);
    expect(end.getUTCMonth()).toBe(1);
    expect(end.getUTCDate()).toBe(29);
  });

  it("rolls the year over for 12 months", () => {
    const end = addMonths(new Date("2026-06-15T12:00:00Z"), 12);
    expect(end.getUTCFullYear()).toBe(2027);
    expect(end.getUTCMonth()).toBe(5);
  });
});

describe("oneTimeAccessEnd", () => {
  it("buys the same length of access as the matching interval", () => {
    const from = new Date("2026-03-10T00:00:00Z");
    expect(oneTimeAccessEnd("monthly", from).toISOString()).toBe("2026-04-10T00:00:00.000Z");
    expect(oneTimeAccessEnd("quarterly", from).toISOString()).toBe("2026-06-10T00:00:00.000Z");
    expect(oneTimeAccessEnd("semiannual", from).toISOString()).toBe("2026-09-10T00:00:00.000Z");
    expect(oneTimeAccessEnd("yearly", from).toISOString()).toBe("2027-03-10T00:00:00.000Z");
  });
});

describe("extendOneTimeAccess", () => {
  const now = new Date("2026-03-10T00:00:00Z");

  it("stacks onto remaining time so an early renewal loses nothing", () => {
    const currentEnd = new Date("2026-04-01T00:00:00Z");
    expect(extendOneTimeAccess(currentEnd, "monthly", now).toISOString()).toBe(
      "2026-05-01T00:00:00.000Z"
    );
  });

  it("starts from now when the previous window already lapsed", () => {
    const lapsed = new Date("2026-02-01T00:00:00Z");
    expect(extendOneTimeAccess(lapsed, "monthly", now).toISOString()).toBe(
      "2026-04-10T00:00:00.000Z"
    );
  });

  it("starts from now for a first purchase", () => {
    expect(extendOneTimeAccess(null, "yearly", now).toISOString()).toBe(
      "2027-03-10T00:00:00.000Z"
    );
  });
});

describe("oneTimeAccessActive", () => {
  const now = new Date("2026-03-10T00:00:00Z");

  it("is active while the window is open", () => {
    expect(
      oneTimeAccessActive(
        { purchaseType: "one_time", accessEndsAt: new Date("2026-04-01T00:00:00Z") },
        now
      )
    ).toBe(true);
  });

  it("is inactive once the window closes", () => {
    expect(
      oneTimeAccessActive(
        { purchaseType: "one_time", accessEndsAt: new Date("2026-03-01T00:00:00Z") },
        now
      )
    ).toBe(false);
  });

  it("ignores recurring subscriptions and missing data", () => {
    expect(
      oneTimeAccessActive(
        { purchaseType: "subscription", accessEndsAt: new Date("2027-01-01T00:00:00Z") },
        now
      )
    ).toBe(false);
    expect(oneTimeAccessActive({ purchaseType: "one_time", accessEndsAt: null }, now)).toBe(
      false
    );
    expect(oneTimeAccessActive(null, now)).toBe(false);
  });
});
