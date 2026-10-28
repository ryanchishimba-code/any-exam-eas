import { describe, expect, it } from "vitest";
import { conversionBeaconSchema } from "@/lib/analytics/conversion-schema";
import { readSignupUtms } from "@/lib/auth/signup-utms";
import { tallyDailyQuestionEvents } from "@/lib/admin/daily-question-events";

describe("readSignupUtms", () => {
  it("keeps source, medium, and campaign from the signup body", () => {
    expect(
      readSignupUtms({
        utm_source: " daily ",
        utm_medium: "qotd",
        utm_campaign: "free_trial",
        utm_content: "ignored",
      })
    ).toEqual({
      utmSource: "daily",
      utmMedium: "qotd",
      utmCampaign: "free_trial",
    });
  });

  it("accepts camelCase and drops non-strings", () => {
    expect(
      readSignupUtms({
        utmSource: "daily",
        utmMedium: 4,
        utmCampaign: "",
      })
    ).toEqual({ utmSource: "daily" });
  });

  it("caps each tag at 120 characters", () => {
    const utmSource = readSignupUtms({ utm_source: "d".repeat(200) }).utmSource;
    expect(utmSource).toHaveLength(120);
  });
});

describe("daily question conversion names", () => {
  it("accepts the three events on the existing conversion beacon", () => {
    for (const eventName of ["daily_answer", "daily_trial_cta_click", "signup_from_daily"]) {
      expect(conversionBeaconSchema.safeParse({ eventName, properties: { board: "nclex" } }).success).toBe(
        true
      );
    }
  });
});

describe("tallyDailyQuestionEvents", () => {
  it("counts only the daily question events", () => {
    expect(
      tallyDailyQuestionEvents([
        { eventName: "daily_answer", count: 4 },
        { eventName: "daily_trial_cta_click", count: 2 },
        { eventName: "signup_completed", count: 9 },
      ])
    ).toEqual({
      daily_answer: 4,
      daily_trial_cta_click: 2,
      signup_from_daily: 0,
    });
  });
});
