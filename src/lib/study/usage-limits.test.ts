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
    subscription: {
      hasAccess: true,
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
  it("maps trial, basic, pro, and staff roles", () => {
    expect(resolveStudyUsagePlan(mockAccess({ role: "trial" }))).toBe("trial");
    expect(
      resolveStudyUsagePlan(
        mockAccess({
          role: "subscriber",
          subscription: {
            ...mockAccess({}).subscription,
            status: "active",
            tier: "basic",
          },
        })
      )
    ).toBe("basic");
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
  it("caps trial sessions but not paid plans", () => {
    expect(clampStudySessionSize("trial", 50, false)).toBe(
      STUDY_USAGE_LIMITS.trial.maxPerSession
    );
    expect(clampStudySessionSize("basic", 50, false)).toBe(50);
    expect(clampStudySessionSize("pro", 200, true)).toBe(200);
    expect(clampStudySessionSize("trial", 100, true)).toBe(
      STUDY_USAGE_LIMITS.trial.maxTimedExamLength
    );
  });
});

describe("trial limits", () => {
  it("uses lifetime cap instead of daily cap during trial", () => {
    expect(STUDY_USAGE_LIMITS.trial.dailyQuestions).toBeNull();
    expect(STUDY_USAGE_LIMITS.trial.trialLifetimeQuestions).toBe(60);
    expect(STUDY_USAGE_LIMITS.trial.trialMockAllowance).toBe(1);
    expect(STUDY_USAGE_LIMITS.trial.allowShortMocks).toBe(true);
    expect(STUDY_USAGE_LIMITS.basic.allowShortMocks).toBe(true);
    expect(STUDY_USAGE_LIMITS.basic.allowFullLengthMocks).toBe(false);
  });

  it("restricts post-trial free tier to 20 lifetime questions", () => {
    expect(STUDY_USAGE_LIMITS.free.trialLifetimeQuestions).toBe(20);
    expect(STUDY_USAGE_LIMITS.free.allowShortMocks).toBe(false);
    expect(resolveStudyUsagePlan(mockAccess({ role: "free", hasPremiumAccess: false }))).toBe(
      "free"
    );
  });
});
