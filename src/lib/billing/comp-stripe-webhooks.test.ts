import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Subscription } from "@prisma/client";
import type Stripe from "stripe";

const updates: Array<Record<string, unknown>> = [];

vi.mock("@/lib/prisma", () => ({
  prisma: {
    subscription: {
      update: vi.fn(async ({ data }: { data: Record<string, unknown> }) => {
        updates.push(data);
        return data;
      }),
    },
  },
}));

import { applyCompOverlay } from "@/lib/access-control";
import {
  applySubscriptionFromStripe,
  buildStripeSubscriptionWrite,
  invoicePaymentFailedWrite,
} from "@/lib/stripe";
import {
  compPassCanStartPaidCheckout,
  evaluateSubscriptionAccess,
} from "@/lib/subscription-access";

const COMP_UNTIL = new Date("2026-12-01T00:00:00.000Z");

function compSubscription(partial: Partial<Subscription> = {}): Subscription {
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
    compAccessUntil: COMP_UNTIL,
    canceledAt: null,
    trialReminderForEndsAt: null,
    billingReminderForPeriodEnd: null,
    welcomeEmailSentAt: null,
    purchaseType: "subscription",
    accessEndsAt: null,
    stripePaymentIntentId: null,
    createdAt: new Date("2026-10-27T00:00:00.000Z"),
    updatedAt: new Date("2026-10-27T00:00:00.000Z"),
    ...partial,
  } as Subscription;
}

function stripeSubscription(status: Stripe.Subscription.Status, id = "sub_paid_1"): Stripe.Subscription {
  return {
    id,
    status,
    metadata: { plan: "subscribe", tier: "pro", interval: "monthly", userId: "user_comp" },
    trial_end: null,
    customer: "cus_comp_1",
    items: { data: [] },
  } as unknown as Stripe.Subscription;
}

function applyWrite(row: Subscription, data: Record<string, unknown>): Subscription {
  expect(data).not.toHaveProperty("compAccessUntil");
  return { ...row, ...data, compAccessUntil: row.compAccessUntil };
}

describe("Stripe webhooks and a complimentary pass", () => {
  beforeEach(() => {
    updates.length = 0;
  });

  it("never includes compAccessUntil on checkout, subscription, or invoice writes", () => {
    const checkout = buildStripeSubscriptionWrite({
      stripeSub: stripeSubscription("active"),
      stripeCustomerId: "cus_comp_1",
      planTier: "pro",
      planInterval: "monthly",
      plan: "subscribe",
    });
    const updated = buildStripeSubscriptionWrite({
      stripeSub: stripeSubscription("active"),
      stripeCustomerId: "cus_comp_1",
      planTier: "pro",
      planInterval: "monthly",
    });
    const deleted = buildStripeSubscriptionWrite({
      stripeSub: stripeSubscription("canceled"),
      stripeCustomerId: "cus_comp_1",
      planTier: "pro",
      planInterval: "monthly",
    });
    for (const data of [checkout, updated, deleted, invoicePaymentFailedWrite]) {
      expect(data).not.toHaveProperty("compAccessUntil");
    }
    expect(invoicePaymentFailedWrite).toEqual({ status: "past_due", gracePeriodEndsAt: null });
  });

  it("turns a pass into a paid subscription without adding the leftover days or clearing them", () => {
    const row = compSubscription();
    const data = buildStripeSubscriptionWrite({
      stripeSub: stripeSubscription("active"),
      stripeCustomerId: "cus_comp_1",
      planTier: "pro",
      planInterval: "yearly",
      plan: "subscribe",
      currentPeriodEnd: new Date("2027-10-27T00:00:00.000Z"),
    });
    const next = applyWrite(row, data);
    expect(next.compAccessUntil).toEqual(COMP_UNTIL);
    expect(next.stripeSubscriptionId).toBe("sub_paid_1");
    expect(next.stripeCustomerId).toBe("cus_comp_1");
    expect(next.status).toBe("active");
    expect(next.plan).toBe("subscribe");
    const access = evaluateSubscriptionAccess(next);
    expect(access.hasAccess).toBe(true);
    expect(access.daysRemaining).toBeNull();
    expect(compPassCanStartPaidCheckout(access, next.stripeSubscriptionId)).toBe(false);
  });

  it("resumes the pass when the paid subscription is deleted and does not clear the date", () => {
    const row = compSubscription({
      status: "active",
      plan: "subscribe",
      stripeCustomerId: "cus_comp_1",
      stripeSubscriptionId: "sub_paid_1",
    });
    const data = buildStripeSubscriptionWrite({
      stripeSub: stripeSubscription("canceled"),
      stripeCustomerId: "cus_comp_1",
      planTier: "pro",
      planInterval: "yearly",
    });
    const next = applyWrite(row, data);
    expect(next.compAccessUntil).toEqual(COMP_UNTIL);
    expect(next.stripeSubscriptionId).toBeNull();
    expect(next.status).toBe("canceled");
    const access = evaluateSubscriptionAccess(next);
    expect(access.hasAccess).toBe(true);
    expect(access.canStartCheckout).toBe(false);
    expect(access.needsPaymentMethod).toBe(false);
    expect(access.daysRemaining).toBeGreaterThan(0);
  });

  it("keeps pass access when an invoice fails and when a later invoice is paid", () => {
    const row = compSubscription({
      status: "active",
      plan: "subscribe",
      stripeCustomerId: "cus_comp_1",
      stripeSubscriptionId: "sub_paid_1",
    });
    const failed = applyWrite(row, invoicePaymentFailedWrite);
    expect(failed.compAccessUntil).toEqual(COMP_UNTIL);
    expect(evaluateSubscriptionAccess(failed).hasAccess).toBe(true);

    const paid = applyWrite(
      failed,
      buildStripeSubscriptionWrite({
        stripeSub: stripeSubscription("active"),
        stripeCustomerId: "cus_comp_1",
        planTier: "pro",
        planInterval: "monthly",
      })
    );
    expect(paid.compAccessUntil).toEqual(COMP_UNTIL);
    expect(paid.status).toBe("active");
    expect(evaluateSubscriptionAccess(paid).hasAccess).toBe(true);
    expect(evaluateSubscriptionAccess(paid).daysRemaining).toBeNull();
  });

  it("ends access with checkout available and no card once the pass date has passed", () => {
    const lapsed = compSubscription({
      compAccessUntil: new Date("2026-10-01T00:00:00.000Z"),
    });
    const access = evaluateSubscriptionAccess(lapsed);
    expect(access.hasAccess).toBe(false);
    expect(access.needsPaymentMethod).toBe(false);
    expect(access.canStartCheckout).toBe(true);
    expect(access.daysRemaining).toBe(0);
    const overlay = applyCompOverlay(lapsed, access);
    expect(overlay.hasAccess).toBe(false);
  });

  it("applySubscriptionFromStripe persists the write without the pass date", async () => {
    await applySubscriptionFromStripe("user_comp", stripeSubscription("active"), "cus_comp_1");
    expect(updates).toHaveLength(1);
    expect(updates[0]).not.toHaveProperty("compAccessUntil");
    expect(updates[0]).toMatchObject({
      stripeCustomerId: "cus_comp_1",
      stripeSubscriptionId: "sub_paid_1",
      status: "active",
      plan: "subscribe",
    });

    await applySubscriptionFromStripe("user_comp", stripeSubscription("canceled"), "cus_comp_1");
    expect(updates[1]).not.toHaveProperty("compAccessUntil");
    expect(updates[1]).toMatchObject({
      stripeSubscriptionId: null,
      status: "canceled",
    });
  });
});
