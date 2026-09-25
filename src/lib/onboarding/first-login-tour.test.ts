import { describe, expect, it } from "vitest";
import { firstLoginTourSteps, visibleTourSteps } from "@/lib/onboarding/first-login-tour";
import {
  isFirstLoginTourEligible,
  isTourSchemaGap,
  isTourSeen,
  mergeTourRecord,
} from "@/lib/onboarding/tour-record";

const steps = firstLoginTourSteps("NCLEX");

describe("first-login tour eligibility", () => {
  const base = {
    seen: false,
    attemptCount: 0,
    examSelected: true,
    pathname: "/dashboard",
    signedIn: true,
  };

  it("shows only for a signed-in learner with zero attempts who has not seen it", () => {
    expect(isFirstLoginTourEligible(base)).toBe(true);
  });

  it("does not show for existing learners with prior attempts", () => {
    expect(isFirstLoginTourEligible({ ...base, attemptCount: 1 })).toBe(false);
    expect(isFirstLoginTourEligible({ ...base, attemptCount: 240 })).toBe(false);
    expect(isFirstLoginTourEligible({ ...base, attemptCount: null })).toBe(false);
  });

  it("does not show again once the account has a tour record", () => {
    expect(isFirstLoginTourEligible({ ...base, seen: true })).toBe(false);
  });

  it("stays off practice routes and unsigned sessions", () => {
    expect(isFirstLoginTourEligible({ ...base, pathname: "/question-bank" })).toBe(false);
    expect(isFirstLoginTourEligible({ ...base, pathname: "/full-exam/nclex" })).toBe(false);
    expect(isFirstLoginTourEligible({ ...base, signedIn: false })).toBe(false);
    expect(isFirstLoginTourEligible({ ...base, examSelected: false })).toBe(false);
  });

  it("lets settings replay ignore the once-only gate", () => {
    expect(
      isFirstLoginTourEligible({ ...base, seen: true, attemptCount: 40, replay: true })
    ).toBe(true);
  });
});

describe("first-login tour steps", () => {
  it("skips the study guide when that anchor is not visible", () => {
    const visible = new Set(["today", "bank", "review-incorrect", "readiness"]);
    const shown = visibleTourSteps(steps, "desktop", (anchor) => visible.has(anchor));
    expect(shown.map((step) => step.id)).toEqual(["today", "bank", "readiness"]);
  });

  it("uses the stats tab instead of the readiness panel on mobile", () => {
    const visible = new Set(["today", "bank", "stats"]);
    const shown = visibleTourSteps(steps, "mobile", (anchor) => visible.has(anchor));
    expect(shown.map((step) => step.id)).toEqual(["today", "bank", "readiness"]);
    expect(shown[2]?.title).toBe("See when you're ready");
  });

  it("interpolates the board name for every board, not only NCLEX", () => {
    const naplex = firstLoginTourSteps("NAPLEX");
    const fnp = firstLoginTourSteps("AANP FNP");
    expect(naplex[0]?.body).toContain("NAPLEX");
    expect(fnp[2]?.body).toContain("AANP FNP");
    expect(naplex.every((step) => !/NCLEX/.test(step.body))).toBe(true);
  });
});

describe("tour persistence record", () => {
  it("writes seen on show and keeps the original timestamp", () => {
    const first = mergeTourRecord(
      { examTestDates: { nclex: "2026-12-01" } },
      { status: "shown", step: 0, device: "desktop", at: "2026-09-25T00:00:00.000Z" }
    );
    expect(isTourSeen(first)).toBe(true);
    expect(first.examTestDates).toEqual({ nclex: "2026-12-01" });

    const second = mergeTourRecord(JSON.stringify(first), {
      status: "skipped",
      step: 1,
      device: "mobile",
      at: "2026-09-25T01:00:00.000Z",
    });
    const record = (second.tours as { "firstLogin.v1": { status: string; at: string; step: number } })[
      "firstLogin.v1"
    ];
    expect(record.status).toBe("skipped");
    expect(record.step).toBe(1);
    expect(record.at).toBe("2026-09-25T00:00:00.000Z");
  });

  it("treats a missing preference column as a schema gap", () => {
    expect(isTourSchemaGap({ code: "P2022" })).toBe(true);
    expect(isTourSchemaGap({ code: "P2021" })).toBe(true);
    expect(isTourSchemaGap(new Error("offline"))).toBe(false);
  });
});
