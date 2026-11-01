import { describe, expect, it } from "vitest";
import {
  TRIAL_EMAIL_LIABILITY_LINE,
  upgradeEmailUrl,
} from "@/lib/email/trial-lifecycle-emails";
import {
  classifyTrialLifecycleEmail,
  isTrialEndedEmailWindow,
  isTrialReminderWindow,
} from "@/lib/billing/trial-lifecycle-mail";

const now = new Date("2026-11-01T12:00:00.000Z");

function hoursFromNow(hours: number): Date {
  return new Date(now.getTime() + hours * 60 * 60 * 1000);
}

describe("trial lifecycle email windows", () => {
  it("selects the day-before reminder and skips test accounts", () => {
    const trialEndsAt = hoursFromNow(24);
    expect(isTrialReminderWindow(trialEndsAt, now)).toBe(true);
    expect(
      classifyTrialLifecycleEmail(
        {
          status: "trialing",
          trialEndsAt,
          stripeSubscriptionId: null,
          trialReminderForEndsAt: null,
          email: "student@example.com",
          accountStatus: "active",
          reminderLogged: false,
          endedLogged: false,
        },
        now
      )
    ).toBe("reminder_1d");
    expect(
      classifyTrialLifecycleEmail(
        {
          status: "trialing",
          trialEndsAt,
          stripeSubscriptionId: null,
          trialReminderForEndsAt: null,
          email: "qa@anyexameasy.test",
          accountStatus: "active",
          reminderLogged: false,
          endedLogged: false,
        },
        now
      )
    ).toBe("skip_test");
  });

  it("selects a card-free trial that ended inside the lookback and not a Stripe trial", () => {
    const trialEndsAt = hoursFromNow(-5);
    expect(isTrialEndedEmailWindow(trialEndsAt, now)).toBe(true);
    expect(
      classifyTrialLifecycleEmail(
        {
          status: "trial_expired",
          trialEndsAt,
          stripeSubscriptionId: null,
          trialReminderForEndsAt: trialEndsAt,
          email: "student@example.com",
          accountStatus: "active",
          reminderLogged: true,
          endedLogged: false,
        },
        now
      )
    ).toBe("trial_ended");
    expect(
      classifyTrialLifecycleEmail(
        {
          status: "trial_expired",
          trialEndsAt,
          stripeSubscriptionId: "sub_123",
          trialReminderForEndsAt: null,
          email: "student@example.com",
          accountStatus: "active",
          reminderLogged: false,
          endedLogged: false,
        },
        now
      )
    ).toBeNull();
  });

  it("does not promise a passing result", () => {
    expect(TRIAL_EMAIL_LIABILITY_LINE.toLowerCase()).toContain("does not guarantee");
    expect(TRIAL_EMAIL_LIABILITY_LINE.toLowerCase()).not.toMatch(/you will pass|pass rate|%/);
    expect(upgradeEmailUrl("trial-ended")).toContain("from=email-trial-ended");
  });
});
