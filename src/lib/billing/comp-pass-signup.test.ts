import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Subscription } from "@prisma/client";

const prismaMock = vi.hoisted(() => ({
  subscription: {
    findUnique: vi.fn(),
    update: vi.fn(),
    create: vi.fn(),
  },
  trialEligibility: {
    findUnique: vi.fn(),
    upsert: vi.fn(),
  },
}));

vi.mock("@/lib/prisma", () => ({ prisma: prismaMock }));
vi.mock("@/lib/trial-eligibility", () => ({
  hasConsumedTrial: vi.fn(async () => false),
  recordTrialUsed: vi.fn(),
}));
vi.mock("@/lib/trial-email-triggers", () => ({
  triggerWelcomeTrialEmail: vi.fn(),
}));
vi.mock("@/lib/billing/trial-alert", () => ({
  scheduleTrialStartAlert: vi.fn(),
}));

import { hasConsumedTrial } from "@/lib/trial-eligibility";
import { startCardFreeTrialForUser } from "@/lib/billing/start-app-trial";
import { getReactivationInfo } from "@/lib/reactivation";
import { resolveSignupEntitlement } from "@/lib/user-auth";
import { activeCompSubscriptionWhere } from "@/lib/admin/marketing-report";
import { evaluateSubscriptionAccess } from "@/lib/subscription-access";

function row(partial: Partial<Subscription>): Subscription {
  return {
    id: "sub_row",
    userId: "user_comp",
    stripeCustomerId: null,
    stripeSubscriptionId: null,
    status: "inactive",
    plan: "comp",
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

describe("complimentary pass versus the 5-day trial", () => {
  beforeEach(() => {
    vi.mocked(hasConsumedTrial).mockResolvedValue(false);
    prismaMock.subscription.findUnique.mockReset();
    prismaMock.subscription.update.mockReset();
  });

  it("does not start the app trial or its welcome email when a pass code is present", () => {
    const withPass = resolveSignupEntitlement("trial", "RN-TEST-AA");
    expect(withPass.startsAppTrial).toBe(false);
    expect(withPass.sendsWelcomeTrialEmail).toBe(false);
    expect(withPass.sendsVerificationEmail).toBe(true);

    const plainTrial = resolveSignupEntitlement("trial", "");
    expect(plainTrial.startsAppTrial).toBe(true);
    expect(plainTrial.sendsWelcomeTrialEmail).toBe(true);
  });

  it("refuses to start a 5-day trial on top of a pass, including after the date", async () => {
    prismaMock.subscription.findUnique.mockResolvedValue(
      row({ compAccessUntil: new Date("2026-10-01T00:00:00.000Z"), plan: "comp", status: "inactive" })
    );
    const result = await startCardFreeTrialForUser({
      userId: "user_comp",
      email: "comp-pass@example.com",
    });
    expect(result).toEqual({ started: false });
    expect(prismaMock.subscription.update).not.toHaveBeenCalled();
  });

  it("sends a lapsed pass to paid checkout instead of another free trial", async () => {
    const subscription = row({
      compAccessUntil: new Date("2026-10-01T00:00:00.000Z"),
      plan: "comp",
      status: "inactive",
    });
    const access = evaluateSubscriptionAccess(subscription);
    const info = await getReactivationInfo({
      email: "comp-pass@example.com",
      subscription,
      access,
    });
    expect(info.trialAvailable).toBe(false);
    expect(info.checkoutPlan).toBe("subscribe");
    expect(info.checkoutPath).toContain("plan=subscribe");
    expect(info.checkoutPath).not.toContain("plan=trial");
    expect(access.hasAccess).toBe(false);
    expect(access.canStartCheckout).toBe(true);
    expect(access.needsPaymentMethod).toBe(false);
  });

  it("still offers the 5-day trial when the account never used a pass", async () => {
    const subscription = row({ plan: "trial", status: "inactive", compAccessUntil: null });
    const info = await getReactivationInfo({
      email: "new@example.com",
      subscription,
      access: evaluateSubscriptionAccess(subscription),
    });
    expect(info.trialAvailable).toBe(true);
    expect(info.checkoutPlan).toBe("trial");
  });

  it("lists pass holders and leftover days, not a live paid subscription", () => {
    const where = activeCompSubscriptionWhere(new Date("2026-10-27T00:00:00.000Z"));
    expect(where.compAccessUntil).toEqual({ gt: new Date("2026-10-27T00:00:00.000Z") });
    expect(JSON.stringify(where)).toContain("stripeSubscriptionId");
    expect(JSON.stringify(where)).toContain("one_time");
  });
});
