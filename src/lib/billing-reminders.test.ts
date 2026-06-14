import { describe, expect, it } from "vitest";
import { isWithin24HourReminderWindow } from "./billing-reminders";

describe("isWithin24HourReminderWindow", () => {
  it("matches targets ~24 hours ahead", () => {
    const now = new Date("2026-06-15T12:00:00Z");
    const target = new Date("2026-06-16T12:00:00Z");
    expect(isWithin24HourReminderWindow(target, now)).toBe(true);
  });

  it("ignores targets too soon", () => {
    const now = new Date("2026-06-15T12:00:00Z");
    const target = new Date("2026-06-15T20:00:00Z");
    expect(isWithin24HourReminderWindow(target, now)).toBe(false);
  });

  it("ignores targets too far out", () => {
    const now = new Date("2026-06-15T12:00:00Z");
    const target = new Date("2026-06-18T12:00:00Z");
    expect(isWithin24HourReminderWindow(target, now)).toBe(false);
  });
});
