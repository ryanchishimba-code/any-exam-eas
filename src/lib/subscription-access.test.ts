import { describe, expect, it } from "vitest";
import type { Subscription } from "@prisma/client";
import {
  accessRoleForSubscription,
  applyCompOverlay,
  type UserAccess,
} from "@/lib/access-control";
import { tierHasFeature, type SubscriptionFeature } from "@/lib/subscription-features";
import { STUDY_USAGE_LIMITS, resolveStudyUsagePlan } from "@/lib/study/usage-limits";
import {
  compPassCanStartPaidCheckout,
  evaluateSubscriptionAccess,
  normalizeSubscriptionForRead,
} from "@/lib/subscription-access";

function sub(partial: Partial<Subscription>): Subscription {
  return {
    id: "sub_1",
    userId: "user_1",
    stripeCustomerId: null,
    stripeSubscriptionId: null,
    status: "inactive",
    plan: "trial",
    planTier: "pro",
    planInterval: "monthly",
    trialEndsAt: null,
    currentPeriodEnd: null,
    gracePeriodEndsAt: null,
    compAccessUntil: null,
    canceledAt: null,
    trialReminderForEndsAt: null,
    billingReminderForPeriodEnd: null,
    welcomeEmailSentAt: null,
    purchaseType: "subscription",
    accessEndsAt: null,
    stripePaymentIntentId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...partial,
  } as Subscription;
}

describe("evaluateSubscriptionAccess", () => {
  it("grants premium during an active app-native trial", () => {
    const trialEndsAt = new Date(Date.now() + 3 * 86400000);
    const access = evaluateSubscriptionAccess(
      sub({ status: "trialing", trialEndsAt, plan: "trial" })
    );
    expect(access.hasAccess).toBe(true);
    expect(access.hasFreeAccess).toBe(false);
    expect(access.status).toBe("trialing");
  });

  it("locks study after trial expires (free dashboard only)", () => {
    const trialEndsAt = new Date(Date.now() - 86400000);
    const access = evaluateSubscriptionAccess(
      sub({ status: "trialing", trialEndsAt })
    );
    expect(access.hasAccess).toBe(false);
    expect(access.hasFreeAccess).toBe(true);
    expect(access.status).toBe("trial_expired");
    expect(access.canStartCheckout).toBe(true);
  });

  it("requires a Stripe subscription id for durable active access", () => {
    const orphan = evaluateSubscriptionAccess(sub({ status: "active" }));
    expect(orphan.hasAccess).toBe(false);
    expect(orphan.status).toBe("inactive");
    expect(orphan.canStartCheckout).toBe(true);

    const paid = evaluateSubscriptionAccess(
      sub({
        status: "active",
        stripeSubscriptionId: "sub_live_123",
        stripeCustomerId: "cus_live_123",
      })
    );
    expect(paid.hasAccess).toBe(true);
    expect(paid.status).toBe("active");
  });

  it("allows active status when complimentary access is still valid", () => {
    const access = evaluateSubscriptionAccess(
      sub({
        status: "active",
        compAccessUntil: new Date(Date.now() + 86400000),
      })
    );
    expect(access.hasAccess).toBe(true);
    expect(access.status).toBe("active");
  });

  it("unlocks every board for a pass with no Stripe subscription", () => {
    const until = new Date(Date.now() + 30 * 86400000);
    const access = evaluateSubscriptionAccess(
      sub({
        status: "inactive",
        plan: "comp",
        planTier: "pro",
        compAccessUntil: until,
        stripeCustomerId: null,
        stripeSubscriptionId: null,
      })
    );
    expect(access.hasAccess).toBe(true);
    expect(access.hasFreeAccess).toBe(false);
    expect(access.status).toBe("active");
    expect(access.tier).toBe("pro");
    expect(access.needsPaymentMethod).toBe(false);
    expect(access.canStartCheckout).toBe(false);
    expect(access.daysRemaining).toBe(30);
    expect(accessRoleForSubscription(false, access)).toBe("subscriber");
    expect(resolveStudyUsagePlan({ role: "subscriber" } as UserAccess)).toBe("pro");
    expect(STUDY_USAGE_LIMITS.pro.trialLifetimeQuestions).toBeNull();
    const features: SubscriptionFeature[] = [
      "question_bank",
      "practice_exams",
      "roadmap_tools",
      "lab_values",
      "clinical_calculators",
      "drug_database",
      "deep_dive_modules",
      "advanced_analytics",
      "spaced_repetition",
      "priority_updates",
      "unlimited_mock_exams",
      "exportable_notes",
      "enhanced_explanations",
      "flashcards",
      "ai_tutor",
      "anatomy_explorer",
    ];
    for (const feature of features) {
      expect(tierHasFeature(access.tier, feature)).toBe(true);
    }
  });

  it("falls back with no access and no card when a pass lapses", () => {
    const access = evaluateSubscriptionAccess(
      sub({
        status: "inactive",
        plan: "comp",
        planTier: "pro",
        compAccessUntil: new Date(Date.now() - 60_000),
        stripeCustomerId: null,
        stripeSubscriptionId: null,
      })
    );
    expect(access.hasAccess).toBe(false);
    expect(access.hasFreeAccess).toBe(false);
    expect(access.status).toBe("inactive");
    expect(access.needsPaymentMethod).toBe(false);
    expect(access.canStartCheckout).toBe(true);
    expect(access.daysRemaining).toBe(0);
    expect(accessRoleForSubscription(false, access)).toBe("expired");

    const base = evaluateSubscriptionAccess(
      sub({ status: "inactive", compAccessUntil: new Date(Date.now() - 60_000) })
    );
    const overlay = applyCompOverlay(
      sub({ compAccessUntil: new Date(Date.now() - 60_000) }),
      base
    );
    expect(overlay.hasAccess).toBe(false);
    expect(overlay.needsPaymentMethod).toBe(false);
  });

  it("denies past_due and canceled", () => {
    expect(evaluateSubscriptionAccess(sub({ status: "past_due" })).hasAccess).toBe(false);
    expect(evaluateSubscriptionAccess(sub({ status: "canceled" })).hasAccess).toBe(false);
  });

  it("keeps a paid subscription in front of leftover pass days", () => {
    const until = new Date(Date.now() + 20 * 86400000);
    const access = evaluateSubscriptionAccess(
      sub({
        status: "active",
        plan: "subscribe",
        stripeSubscriptionId: "sub_live_123",
        compAccessUntil: until,
      })
    );
    expect(access.hasAccess).toBe(true);
    expect(access.daysRemaining).toBeNull();
    expect(compPassCanStartPaidCheckout(access, "sub_live_123")).toBe(false);
    const overlay = applyCompOverlay(
      sub({
        status: "active",
        stripeSubscriptionId: "sub_live_123",
        compAccessUntil: until,
      }),
      access
    );
    expect(overlay.daysRemaining).toBeNull();
  });

  it("resumes leftover pass days after a Stripe subscription is canceled or past due", () => {
    const until = new Date(Date.now() + 12 * 86400000);
    for (const status of ["canceled", "past_due"] as const) {
      const access = evaluateSubscriptionAccess(
        sub({
          status,
          plan: "subscribe",
          stripeSubscriptionId: status === "canceled" ? null : "sub_live_123",
          compAccessUntil: until,
        })
      );
      expect(access.hasAccess).toBe(true);
      expect(access.status).toBe("active");
      expect(access.canStartCheckout).toBe(false);
      expect(access.daysRemaining).toBe(12);
    }
  });

  describe("one-time purchases", () => {
    const oneTime = (accessEndsAt: Date | null) =>
      sub({
        status: "active",
        purchaseType: "one_time",
        accessEndsAt,
        stripeCustomerId: "cus_live_123",
        stripePaymentIntentId: "pi_live_123",
      });

    it("grants premium without a Stripe subscription while the window is open", () => {
      const access = evaluateSubscriptionAccess(
        oneTime(new Date(Date.now() + 10 * 86400000))
      );
      expect(access.hasAccess).toBe(true);
      expect(access.status).toBe("active");
      expect(access.needsPaymentMethod).toBe(false);
      // Nothing renews it, so buying more time must stay available.
      expect(access.canStartCheckout).toBe(true);
      expect(access.daysRemaining).toBe(10);
    });

    it("denies premium once the window lapses", () => {
      const access = evaluateSubscriptionAccess(oneTime(new Date(Date.now() - 86400000)));
      expect(access.hasAccess).toBe(false);
      expect(access.status).toBe("inactive");
      expect(access.canStartCheckout).toBe(true);
    });

    it("denies an active one-time row with no access window", () => {
      expect(evaluateSubscriptionAccess(oneTime(null)).hasAccess).toBe(false);
    });

    it("expires a lapsed window on read, since no Stripe event will", () => {
      const lapsed = normalizeSubscriptionForRead(oneTime(new Date(Date.now() - 1000)));
      expect(lapsed?.status).toBe("inactive");

      const open = normalizeSubscriptionForRead(oneTime(new Date(Date.now() + 86400000)));
      expect(open?.status).toBe("active");
    });
  });
});
