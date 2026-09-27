import { describe, expect, it } from "vitest";
import {
  hasExamDateInThePast,
  quoteToStore,
  shouldShowPassCheckIn,
} from "@/lib/learning/pass-check-in";

const day = (iso: string) => new Date(`${iso}T12:00:00.000Z`);

describe("pass check-in eligibility", () => {
  it("stays quiet for a new account with a future exam date", () => {
    expect(
      shouldShowPassCheckIn({
        now: day("2026-09-27"),
        accountCreatedAt: day("2026-09-20"),
        examDates: ["2026-11-01"],
        latest: null,
      })
    ).toBe(false);
  });

  it("shows for an account that is 30 days old", () => {
    expect(
      shouldShowPassCheckIn({
        now: day("2026-09-27"),
        accountCreatedAt: day("2026-08-28"),
        examDates: [],
        latest: null,
      })
    ).toBe(true);
  });

  it("shows when an exam date is in the past, even for a new account", () => {
    expect(hasExamDateInThePast(["2026-09-20"], day("2026-09-27"))).toBe(true);
    expect(
      shouldShowPassCheckIn({
        now: day("2026-09-27"),
        accountCreatedAt: day("2026-09-20"),
        examDates: ["2026-09-20"],
        latest: null,
      })
    ).toBe(true);
  });

  it("hides after a pass or a miss, and snoozes haven't-taken", () => {
    const base = {
      now: day("2026-09-27"),
      accountCreatedAt: day("2026-01-01"),
      examDates: ["2026-09-01"],
    };
    expect(
      shouldShowPassCheckIn({
        ...base,
        latest: { result: "passed", recordedAt: day("2026-09-02") },
      })
    ).toBe(false);
    expect(
      shouldShowPassCheckIn({
        ...base,
        latest: { result: "not_yet", recordedAt: day("2026-09-02") },
      })
    ).toBe(false);
    expect(
      shouldShowPassCheckIn({
        ...base,
        latest: { result: "not_taken", recordedAt: day("2026-09-20") },
      })
    ).toBe(false);
    expect(
      shouldShowPassCheckIn({
        ...base,
        latest: { result: "not_taken", recordedAt: day("2026-09-01") },
      })
    ).toBe(true);
  });

  it("stores a quote only with consent", () => {
    expect(quoteToStore("  The daily set helped.  ", true)).toEqual({
      quote: "The daily set helped.",
      shareQuoteConsent: true,
    });
    expect(quoteToStore("The daily set helped.", false)).toEqual({
      quote: null,
      shareQuoteConsent: false,
    });
    expect(quoteToStore("   ", true)).toEqual({ quote: null, shareQuoteConsent: false });
  });
});
