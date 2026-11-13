import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { isAdminPath } from "@/lib/admin/routes";
import { isInternalTestEmail } from "@/lib/test-accounts";
import {
  EXCLUDED_EMAIL_SUFFIXES,
  attemptFieldIdsForBoard,
  chicagoDateKey,
  chicagoMidnightUtc,
  classifyLeaderboardPlan,
  leaderboardWindow,
  parseLeaderboardFilters,
  streaksFromStudyDays,
} from "@/lib/admin/leaderboard-rules";

function internalTestEmailSuffixesFromSource(): string[] {
  const source = readFileSync("src/lib/test-accounts.ts", "utf8");
  return [...source.matchAll(/endsWith\("([^"]+)"\)/g)].map((match) => match[1]!);
}

describe("admin leaderboard route", () => {
  it("stays on the admin path the middleware already guards", () => {
    expect(isAdminPath("/admin/leaderboard")).toBe(true);
    expect(isAdminPath("/leaderboard")).toBe(false);
  });
});

describe("classifyLeaderboardPlan", () => {
  const now = new Date("2026-11-13T18:00:00.000Z");

  it("treats a missing subscription as free", () => {
    expect(classifyLeaderboardPlan(null, now)).toBe("free");
  });

  it("keeps a live trial as trial even when Stripe already has an id", () => {
    expect(
      classifyLeaderboardPlan(
        {
          status: "trialing",
          stripeSubscriptionId: "sub_123",
          trialEndsAt: new Date("2026-11-20T00:00:00.000Z"),
        },
        now
      )
    ).toBe("trial");
  });

  it("counts an expired trial as free", () => {
    expect(
      classifyLeaderboardPlan(
        { status: "trialing", trialEndsAt: new Date("2026-11-01T00:00:00.000Z") },
        now
      )
    ).toBe("free");
    expect(classifyLeaderboardPlan({ status: "trial_expired" }, now)).toBe("free");
  });

  it("counts a live Stripe subscription and an open pay-once window as paid", () => {
    expect(
      classifyLeaderboardPlan({ status: "active", stripeSubscriptionId: "sub_live" }, now)
    ).toBe("paid");
    expect(
      classifyLeaderboardPlan(
        {
          status: "active",
          purchaseType: "one_time",
          accessEndsAt: new Date("2027-01-01T00:00:00.000Z"),
        },
        now
      )
    ).toBe("paid");
  });

  it("counts open complimentary access as paid and ignores a lapsed window", () => {
    expect(
      classifyLeaderboardPlan({ status: "inactive", compAccessUntil: new Date("2026-12-01T00:00:00.000Z") }, now)
    ).toBe("paid");
    expect(
      classifyLeaderboardPlan(
        {
          status: "active",
          purchaseType: "one_time",
          accessEndsAt: new Date("2026-11-01T00:00:00.000Z"),
        },
        now
      )
    ).toBe("free");
    expect(classifyLeaderboardPlan({ status: "past_due", stripeSubscriptionId: "sub_due" }, now)).toBe(
      "free"
    );
  });
});

describe("Chicago study days", () => {
  it("rolls the calendar at America/Chicago midnight, including daylight time", () => {
    expect(chicagoDateKey(new Date("2026-11-13T04:30:00.000Z"))).toBe("2026-11-12");
    expect(chicagoDateKey(new Date("2026-11-13T06:00:00.000Z"))).toBe("2026-11-13");
    expect(chicagoMidnightUtc("2026-11-13").toISOString()).toBe("2026-11-13T06:00:00.000Z");
    expect(chicagoMidnightUtc("2026-07-15").toISOString()).toBe("2026-07-15T05:00:00.000Z");
  });

  it("starts the 7-day window on the Chicago day six days before today", () => {
    const window = leaderboardWindow(new Date("2026-11-13T18:00:00.000Z"));
    expect(window.today).toBe("2026-11-13");
    expect(window.windowStartDate).toBe("2026-11-07");
    expect(window.windowStart.toISOString()).toBe("2026-11-07T06:00:00.000Z");
  });
});

describe("streaksFromStudyDays", () => {
  const today = "2026-11-13";

  it("returns zeros when there are no study days", () => {
    expect(streaksFromStudyDays([], today)).toEqual({ current: 0, longest: 0 });
  });

  it("keeps a streak that was active today or yesterday", () => {
    expect(streaksFromStudyDays(["2026-11-13"], today)).toEqual({ current: 1, longest: 1 });
    expect(streaksFromStudyDays(["2026-11-11", "2026-11-12"], today)).toEqual({
      current: 2,
      longest: 2,
    });
  });

  it("breaks the current streak after a missed Chicago day and still keeps the longest", () => {
    expect(
      streaksFromStudyDays(
        ["2026-11-01", "2026-11-02", "2026-11-03", "2026-11-12", "2026-11-13"],
        today
      )
    ).toEqual({ current: 2, longest: 3 });
    expect(streaksFromStudyDays(["2026-11-10", "2026-11-11"], today)).toEqual({
      current: 0,
      longest: 2,
    });
  });

  it("ignores duplicate days and unsorted input", () => {
    expect(
      streaksFromStudyDays(["2026-11-13", "2026-11-12", "2026-11-13", "2026-11-11"], today)
    ).toEqual({ current: 3, longest: 3 });
  });
});

describe("leaderboard filters and exclusions", () => {
  it("falls back to the default view for unknown query values", () => {
    expect(parseLeaderboardFilters({ metric: "nope", window: "30d", board: "sat", plan: "comp" })).toEqual({
      metric: "questions",
      window: "all",
      board: "all",
      plan: "all",
    });
    expect(
      parseLeaderboardFilters({ metric: "streak", window: "7d", board: "AANP-FNP", plan: "trial" })
    ).toEqual({
      metric: "streak",
      window: "7d",
      board: "aanp-fnp",
      plan: "trial",
    });
  });

  it("excludes the same internal inboxes the app already rejects", () => {
    expect(internalTestEmailSuffixesFromSource().sort()).toEqual([...EXCLUDED_EMAIL_SUFFIXES].sort());
    for (const suffix of EXCLUDED_EMAIL_SUFFIXES) {
      expect(isInternalTestEmail(`student${suffix}`)).toBe(true);
    }
    expect(isInternalTestEmail("student@example.com")).toBe(false);
  });

  it("counts every USMLE step and leaves retired medicine rows out", () => {
    const usmle = attemptFieldIdsForBoard("usmle");
    expect(usmle).toEqual(expect.arrayContaining(["usmle-step-1", "usmle-step-2", "usmle-step-3"]));
    expect(usmle).not.toContain("medicine");
    expect(attemptFieldIdsForBoard("nclex")).toContain("nursing");
    expect(attemptFieldIdsForBoard("npte-pt")).toContain("npte-pt");
  });
});
