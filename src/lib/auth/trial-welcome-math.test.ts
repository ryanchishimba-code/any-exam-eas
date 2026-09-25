import { describe, expect, it } from "vitest";
import {
  approvedTrialOfferLine,
  isTrialHalfway,
  resolveDisplayedTrial,
  resolveTrialLengthDays,
  trialDayCaption,
  trialDayNumber,
  trialUrgencyMessage,
  trialUrgencyTone,
} from "@/lib/auth/trial-welcome-math";

describe("trial welcome length", () => {
  it("uses the 5-day plan when the payload omits a length", () => {
    expect(resolveTrialLengthDays(undefined)).toBe(5);
    expect(resolveTrialLengthDays(null)).toBe(5);
    expect(resolveDisplayedTrial({})).toEqual({ daysRemaining: 5, trialDays: 5 });
    expect(
      resolveDisplayedTrial({ statusDays: undefined, pendingDays: undefined, statusTrialDays: undefined })
    ).toEqual({ daysRemaining: 5, trialDays: 5 });
  });

  it("does not fall back to a 14-day trial", () => {
    const shown = resolveDisplayedTrial({ statusDays: 5, pendingDays: 14 });
    expect(shown.trialDays).toBe(5);
    expect(shown.daysRemaining).toBe(5);
    expect(trialUrgencyMessage(shown.daysRemaining, shown.trialDays)).not.toMatch(/halfway/i);
  });

  it("day 1 of 5 is full access, not halfway", () => {
    expect(trialDayNumber(5, 5)).toBe(1);
    expect(isTrialHalfway(5, 5)).toBe(false);
    expect(trialUrgencyTone(5, 5)).toBe("calm");
    expect(trialUrgencyMessage(5, 5)).toBe("Day 1 of 5 · full access");
    expect(trialDayCaption(5, 5)).toBe("Day 1 of 5");
  });

  it("day 3 of 5 is halfway", () => {
    expect(trialDayNumber(3, 5)).toBe(3);
    expect(isTrialHalfway(3, 5)).toBe(true);
    expect(trialUrgencyTone(3, 5)).toBe("moderate");
    expect(trialUrgencyMessage(3, 5)).toBe("You're halfway through — keep the momentum.");
    expect(trialDayCaption(3, 5)).toBe("Day 3 of 5");
  });

  it("day 5 is the last day and names the monthly price, not a percent off", () => {
    expect(trialDayNumber(1, 5)).toBe(5);
    expect(isTrialHalfway(1, 5)).toBe(false);
    expect(trialUrgencyTone(1, 5)).toBe("urgent");
    expect(trialUrgencyMessage(1, 5)).toBe("Last day of your trial — then $27.99/mo");
    expect(trialDayCaption(1, 5)).toBe("Day 5 of 5");
    expect(trialUrgencyMessage(1, 5)).not.toMatch(/% off|percent off/i);
    expect(approvedTrialOfferLine()).toBe(
      "5-day free trial · no payment method required · then $27.99/mo"
    );
    expect(approvedTrialOfferLine()).not.toMatch(/% off|percent off/i);
  });
});
