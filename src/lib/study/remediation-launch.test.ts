import { describe, expect, it } from "vitest";
import {
  countEligibleWeakTopics,
  decideRemediationLaunch,
  decisionFromRemediationPayload,
  emptyModeFromLaunchQuery,
} from "./remediation-launch";

describe("remediation launch", () => {
  it("shows an empty state when nothing is eligible", () => {
    expect(
      decideRemediationLaunch({
        mode: "review_incorrect",
        eligibleCount: 0,
        requestedCount: 25,
      })
    ).toEqual({
      status: "empty",
      mode: "review_incorrect",
      available: 0,
      message: "0 incorrect items to review.",
    });
    expect(
      decideRemediationLaunch({
        mode: "weak_areas",
        eligibleCount: 0,
        requestedCount: 25,
      }).status
    ).toBe("empty");
  });

  it("launches the smaller of the eligible pool and the requested count", () => {
    expect(
      decideRemediationLaunch({
        mode: "review_incorrect",
        eligibleCount: 7,
        requestedCount: 25,
      })
    ).toMatchObject({ status: "launch", available: 7, count: 7 });
    expect(
      decideRemediationLaunch({
        mode: "weak_areas",
        eligibleCount: 4,
        requestedCount: 3,
      })
    ).toMatchObject({ status: "launch", count: 3 });
  });

  it("surfaces API errors instead of treating them as an empty set", () => {
    const decision = decisionFromRemediationPayload({
      mode: "review_incorrect",
      ok: false,
      requestedCount: 25,
      body: { error: "Database unavailable", code: "DB" },
    });
    expect(decision).toEqual({
      status: "error",
      mode: "review_incorrect",
      message: "Database unavailable",
    });
  });

  it("maps explicit empty codes to the empty state", () => {
    expect(
      decisionFromRemediationPayload({
        mode: "weak_areas",
        ok: true,
        requestedCount: 25,
        body: { code: "NO_WEAK_AREAS", weakTopicCount: 0 },
      }).status
    ).toBe("empty");
    expect(emptyModeFromLaunchQuery("review-empty")).toBe("review_incorrect");
    expect(emptyModeFromLaunchQuery("weak-empty")).toBe("weak_areas");
  });

  it("counts only in-scope topics that cleared the weak bar", () => {
    const count = countEligibleWeakTopics(
      [
        { tag: "subject:management-of-care", attempts: 8, misses: 5, missRate: 0.625 },
        { tag: "subject:pharmacology", attempts: 8, misses: 5, missRate: 0.625 },
        { tag: "subject:management-of-care", attempts: 1, misses: 1, missRate: 1 },
        { tag: "tag:high-yield", attempts: 6, misses: 4, missRate: 0.66 },
      ],
      "management-of-care"
    );
    expect(count).toBe(1);
  });
});
