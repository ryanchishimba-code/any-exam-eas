import { describe, expect, it } from "vitest";
import {
  buildTrialStatusBarModel,
  isTrialDay4ReminderWindow,
  trialDaysRemaining,
  trialHoursRemaining,
  trialIsUrgent,
  trialStatusBarMessage,
} from "@/lib/trial/trial-status";

describe("trial status math", () => {
  const endsAt = new Date("2026-10-30T18:00:00.000Z");

  it("counts whole days remaining with ceiling", () => {
    const now = new Date("2026-10-28T19:00:00.000Z");
    expect(trialDaysRemaining(endsAt, now)).toBe(2);
    expect(trialHoursRemaining(endsAt, now)).toBeLessThanOrEqual(48);
    expect(trialIsUrgent(endsAt, now)).toBe(true);
  });

  it("does not mark urgency when more than 48h remain", () => {
    const now = new Date("2026-10-27T12:00:00.000Z");
    expect(trialHoursRemaining(endsAt, now)).toBeGreaterThan(48);
    expect(trialIsUrgent(endsAt, now)).toBe(false);
  });

  it("switches bar copy in the urgent window", () => {
    const urgent = buildTrialStatusBarModel({
      trialEndsAt: endsAt,
      usedTrialTotal: 120,
      now: new Date("2026-10-29T12:00:00.000Z"),
    });
    expect(urgent.urgent).toBe(true);
    expect(trialStatusBarMessage(urgent)).toContain("Your trial ends");
    expect(trialStatusBarMessage(urgent)).toContain("Friday");

    const calm = buildTrialStatusBarModel({
      trialEndsAt: endsAt,
      usedTrialTotal: 12,
      now: new Date("2026-10-26T12:00:00.000Z"),
    });
    expect(calm.urgent).toBe(false);
    expect(trialStatusBarMessage(calm)).toMatch(/days left in your free trial/);
    expect(trialStatusBarMessage(calm)).toContain("12 of 100");
  });

  it("detects day-4 email window before urgency", () => {
    const now = new Date("2026-10-28T10:00:00.000Z");
    expect(isTrialDay4ReminderWindow(endsAt, now)).toBe(true);
    expect(trialIsUrgent(endsAt, now)).toBe(false);
  });
});
