import { describe, expect, it } from "vitest";
import type { Subscription } from "@prisma/client";
import { evaluateSubscriptionAccess } from "@/lib/subscription-access";

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

  it("denies past_due and canceled", () => {
    expect(evaluateSubscriptionAccess(sub({ status: "past_due" })).hasAccess).toBe(false);
    expect(evaluateSubscriptionAccess(sub({ status: "canceled" })).hasAccess).toBe(false);
  });
});
