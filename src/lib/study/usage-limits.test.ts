import { describe, expect, it } from "vitest";
import type { UserAccess } from "@/lib/access-control";
import { TRIAL_LIFETIME_QUESTIONS } from "@/lib/billing-config";
import {
  clampStudySessionSize,
  resolveStudyUsagePlan,
  STUDY_USAGE_LIMITS,
  trialLifetimeCapDecision,
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
    expect(clampStudySessionSize("free", 100, false)).toBe(0);
  });
});

describe("trial limits", () => {
  it("uses lifetime cap with full Pro feature access during trial", () => {
    expect(STUDY_USAGE_LIMITS.trial.dailyQuestions).toBeNull();
    expect(STUDY_USAGE_LIMITS.trial.trialLifetimeQuestions).toBe(TRIAL_LIFETIME_QUESTIONS);
    expect(TRIAL_LIFETIME_QUESTIONS).toBe(100);
    expect(STUDY_USAGE_LIMITS.trial.trialMockAllowance).toBeNull();
    expect(STUDY_USAGE_LIMITS.trial.trialFullAdaptiveAllowance).toBe(1);
    expect(STUDY_USAGE_LIMITS.trial.allowShortMocks).toBe(true);
    expect(STUDY_USAGE_LIMITS.trial.allowFullLengthMocks).toBe(true);
    expect(STUDY_USAGE_LIMITS.trial.allowAdaptive).toBe(true);
  });

  it("sends learners already past the cap to upgrade, not a partial session", () => {
    expect(trialLifetimeCapDecision(150, 10, TRIAL_LIFETIME_QUESTIONS)).toBe("upgrade");
    expect(trialLifetimeCapDecision(TRIAL_LIFETIME_QUESTIONS, 1, TRIAL_LIFETIME_QUESTIONS)).toBe(
      "upgrade"
    );
    expect(trialLifetimeCapDecision(90, 20, TRIAL_LIFETIME_QUESTIONS)).toBe("short");
    expect(trialLifetimeCapDecision(20, 10, TRIAL_LIFETIME_QUESTIONS)).toBe("allow");
  });

  it("locks post-trial free tier to zero study questions", () => {
    expect(STUDY_USAGE_LIMITS.free.trialLifetimeQuestions).toBe(0);
    expect(STUDY_USAGE_LIMITS.free.maxPerSession).toBe(0);
    expect(STUDY_USAGE_LIMITS.free.allowShortMocks).toBe(false);
    expect(resolveStudyUsagePlan(mockAccess({ role: "free", hasPremiumAccess: false }))).toBe(
      "free"
    );
  });
});
