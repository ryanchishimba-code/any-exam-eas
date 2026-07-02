import { describe, expect, it } from "vitest";
import type { UserAccess } from "@/lib/access-control";
import {
  clampStudySessionSize,
  resolveStudyUsagePlan,
  STUDY_USAGE_LIMITS,
} from "@/lib/study/usage-limits-config";

function mockAccess(partial: Partial<UserAccess>): UserAccess {
  return {
    userId: "u1",
    role: "trial",
    accountStatus: "active",
    emailVerified: true,
    hasPremiumAccess: true,
    hasFreeTierAccess: false,
    hasAppAccess: true,
    hasStudyAccess: true,
    subscription: {
      hasAccess: true,
      hasFreeAccess: false,
      status: "trialing",
      tier: "pro",
      planDuration: "yearly",
      trialEndsAt: null,
      daysRemaining: 10,
      canStartCheckout: false,
      needsPaymentMethod: false,
    },
    ...partial,
  };
}

describe("resolveStudyUsagePlan", () => {
  it("maps trial, pro, and staff roles", () => {
    expect(resolveStudyUsagePlan(mockAccess({ role: "trial" }))).toBe("trial");
    expect(
      resolveStudyUsagePlan(
        mockAccess({
          role: "subscriber",
          subscription: {
            ...mockAccess({}).subscription,
            status: "active",
            tier: "pro",
          },
        })
      )
    ).toBe("pro");
    expect(resolveStudyUsagePlan(mockAccess({ role: "staff" }))).toBe("staff");
  });
});

describe("clampStudySessionSize", () => {
  it("does not cap trial or paid sessions", () => {
    expect(clampStudySessionSize("trial", 50, false)).toBe(50);
    expect(clampStudySessionSize("pro", 50, false)).toBe(50);
    expect(clampStudySessionSize("pro", 200, true)).toBe(200);
    expect(clampStudySessionSize("trial", 225, true)).toBe(225);
    expect(clampStudySessionSize("free", 100, true)).toBe(10);
  });
});

describe("trial limits", () => {
  it("uses lifetime cap with full Pro feature access during trial", () => {
    expect(STUDY_USAGE_LIMITS.trial.dailyQuestions).toBeNull();
    expect(STUDY_USAGE_LIMITS.trial.trialLifetimeQuestions).toBe(150);
    expect(STUDY_USAGE_LIMITS.trial.trialMockAllowance).toBeNull();
    expect(STUDY_USAGE_LIMITS.trial.trialFullAdaptiveAllowance).toBe(1);
    expect(STUDY_USAGE_LIMITS.trial.allowShortMocks).toBe(true);
    expect(STUDY_USAGE_LIMITS.trial.allowFullLengthMocks).toBe(true);
    expect(STUDY_USAGE_LIMITS.trial.allowAdaptive).toBe(true);
  });

  it("restricts post-trial free tier to 20 lifetime questions", () => {
    expect(STUDY_USAGE_LIMITS.free.trialLifetimeQuestions).toBe(20);
    expect(STUDY_USAGE_LIMITS.free.allowShortMocks).toBe(false);
    expect(resolveStudyUsagePlan(mockAccess({ role: "free", hasPremiumAccess: false }))).toBe(
      "free"
    );
  });
});
