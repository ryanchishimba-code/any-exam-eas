import { describe, expect, it } from "vitest";
import type { UserAccess } from "@/lib/access-control";
import type { StudyUsageSnapshot } from "@/lib/study/usage-limits";
import {
  resolveDashboardUpgradeContext,
  shouldShowDashboardUpgradeBanner,
} from "@/lib/dashboard/upgrade-banner";

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
      daysRemaining: 2,
      canStartCheckout: false,
      needsPaymentMethod: false,
    },
    ...partial,
  };
}

const usage: StudyUsageSnapshot = {
  plan: "trial",
  usedToday: 0,
  remainingToday: null,
  limits: {
    dailyQuestions: null,
    trialLifetimeQuestions: 150,
    maxPerSession: null,
    maxTimedExamLength: null,
    allowPresetExams: true,
    allowShortMocks: true,
    allowFullLengthMocks: true,
    trialMockAllowance: null,
    allowAdaptive: true,
  },
  usedTrialTotal: 40,
  remainingTrialTotal: 110,
  mockExamsThisMonth: 0,
  usedTrialMocks: null,
  remainingTrialMocks: null,
};

describe("resolveDashboardUpgradeContext", () => {
  it("shows for trial users", () => {
    const ctx = resolveDashboardUpgradeContext(mockAccess({ role: "trial" }), usage);
    expect(ctx?.variant).toBe("trial");
  });

  it("shows for free tier users", () => {
    const ctx = resolveDashboardUpgradeContext(
      mockAccess({
        role: "free",
        hasPremiumAccess: false,
        hasFreeTierAccess: true,
        subscription: {
          ...mockAccess({}).subscription,
          hasAccess: false,
          hasFreeAccess: true,
          status: "trial_expired",
          daysRemaining: 0,
        },
      }),
      { ...usage, plan: "free", remainingTrialTotal: 12 }
    );
    expect(ctx?.variant).toBe("free");
  });

  it("hides for active Pro subscribers", () => {
    expect(
      resolveDashboardUpgradeContext(
        mockAccess({
          role: "subscriber",
          subscription: {
            ...mockAccess({}).subscription,
            status: "active",
            tier: "pro",
          },
        }),
        usage
      )
    ).toBeNull();
  });

  it("hides for staff", () => {
    expect(
      resolveDashboardUpgradeContext(mockAccess({ role: "staff" }), usage)
    ).toBeNull();
  });
});

describe("shouldShowDashboardUpgradeBanner", () => {
  it("returns false only for active Pro", () => {
    expect(
      shouldShowDashboardUpgradeBanner(
        mockAccess({
          role: "subscriber",
          subscription: {
            ...mockAccess({}).subscription,
            status: "active",
            tier: "pro",
          },
        })
      )
    ).toBe(false);
    expect(shouldShowDashboardUpgradeBanner(mockAccess({ role: "trial" }))).toBe(true);
  });
});
