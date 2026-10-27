import { beforeEach, describe, expect, it, vi } from "vitest";
import type Stripe from "stripe";

const compUntil = new Date("2026-12-01T00:00:00.000Z");

const state = vi.hoisted(() => ({
  row: {
    userId: "user_comp",
    compAccessUntil: new Date("2026-12-01T00:00:00.000Z"),
    stripeSubscriptionId: null as string | null,
    stripeCustomerId: null as string | null,
    status: "inactive",
    plan: "comp",
  },
  subs: new Map<string, Stripe.Subscription>(),
  event: null as Stripe.Event | null,
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    subscription: {
      findUnique: vi.fn(async () => ({ ...state.row })),
      findFirst: vi.fn(async () => ({ userId: state.row.userId })),
      update: vi.fn(async ({ data }: { data: Record<string, unknown> }) => {
        if (Object.prototype.hasOwnProperty.call(data, "compAccessUntil")) {
          throw new Error("webhook wrote compAccessUntil");
        }
        state.row = {
          ...state.row,
          ...data,
          compAccessUntil: state.row.compAccessUntil,
        } as typeof state.row;
        return state.row;
      }),
    },
    user: {
      findUnique: vi.fn(async () => ({ email: "comp-pass@example.com", name: "Comp" })),
    },
  },
}));

vi.mock("@/lib/stripe", async () => {
  const actual = await vi.importActual<typeof import("@/lib/stripe")>("@/lib/stripe");
  return {
    ...actual,
    stripe: {
      webhooks: {
        constructEvent: () => {
          if (!state.event) throw new Error("missing event");
          return state.event;
        },
      },
      subscriptions: {
        retrieve: async (id: string) => {
          const found = state.subs.get(id);
          if (!found) throw new Error(`missing ${id}`);
          return found;
        },
        update: async () => ({}),
        cancel: async () => ({}),
      },
    },
  };
});

vi.mock("@/lib/email/billing-emails", () => ({
  sendPaymentFailedEmail: vi.fn(async () => ({ ok: true })),
  sendSubscriptionActiveEmail: vi.fn(async () => ({ ok: true })),
}));

vi.mock("@/lib/analytics/events", () => ({ trackEvent: vi.fn() }));
vi.mock("@/lib/analytics/conversions", () => ({ saveTypedConversion: vi.fn() }));
vi.mock("@/lib/billing/trial-alert", () => ({ scheduleTrialStartAlert: vi.fn() }));
vi.mock("@/lib/trial-eligibility", () => ({
  recordTrialUsed: vi.fn(),
  hasConsumedTrial: vi.fn(async () => false),
}));
vi.mock("@/lib/cache", () => ({ invalidateSubscriptionStatusCache: vi.fn() }));

import { POST } from "./route";
import { evaluateSubscriptionAccess } from "@/lib/subscription-access";
import type { Subscription } from "@prisma/client";

function asSubscription(): Subscription {
  return {
    id: "sub_row",
    userId: state.row.userId,
    stripeCustomerId: state.row.stripeCustomerId,
    stripeSubscriptionId: state.row.stripeSubscriptionId,
    status: state.row.status,
    plan: state.row.plan,
    planTier: "pro",
    planInterval: "monthly",
    trialEndsAt: null,
    currentPeriodEnd: null,
    gracePeriodEndsAt: null,
    compAccessUntil: state.row.compAccessUntil,
    canceledAt: null,
    trialReminderForEndsAt: null,
    billingReminderForPeriodEnd: null,
    welcomeEmailSentAt: null,
    purchaseType: "subscription",
    accessEndsAt: null,
    stripePaymentIntentId: null,
    createdAt: new Date("2026-10-27T00:00:00.000Z"),
    updatedAt: new Date("2026-10-27T00:00:00.000Z"),
  } as Subscription;
}

function paidSub(status: Stripe.Subscription.Status): Stripe.Subscription {
  return {
    id: "sub_paid_1",
    status,
    metadata: { plan: "subscribe", tier: "pro", interval: "monthly", userId: "user_comp" },
    trial_end: null,
    customer: "cus_comp_1",
    items: { data: [] },
  } as unknown as Stripe.Subscription;
}

function event(type: string, object: object): Stripe.Event {
  return {
    id: `evt_${type}`,
    type,
    livemode: false,
    data: { object },
  } as Stripe.Event;
}

async function post(type: string, object: object) {
  state.event = event(type, object);
  process.env.STRIPE_SECRET_KEY = "sk_test_comp_channel";
  process.env.STRIPE_WEBHOOK_SECRET = "whsec_test";
  const response = await POST(
    new Request("https://preview.example/api/stripe/webhook", {
      method: "POST",
      headers: { "stripe-signature": "test" },
      body: "{}",
    })
  );
  expect(response.status).toBe(200);
}

describe("comp pass webhook route", () => {
  beforeEach(() => {
    state.row = {
      userId: "user_comp",
      compAccessUntil: compUntil,
      stripeSubscriptionId: null,
      stripeCustomerId: null,
      status: "inactive",
      plan: "comp",
    };
    state.subs.clear();
    state.event = null;
  });

  it("checkout, subscription, and invoice events leave the pass date in place", async () => {
    const active = paidSub("active");
    state.subs.set(active.id, active);

    await post("checkout.session.completed", {
      metadata: { userId: "user_comp", plan: "subscribe", tier: "pro", interval: "monthly" },
      mode: "subscription",
      customer: "cus_comp_1",
      subscription: active.id,
    });
    expect(state.row.compAccessUntil).toEqual(compUntil);
    expect(state.row.stripeSubscriptionId).toBe("sub_paid_1");
    expect(state.row.status).toBe("active");
    expect(evaluateSubscriptionAccess(asSubscription()).daysRemaining).toBeNull();

    await post("customer.subscription.updated", active);
    expect(state.row.compAccessUntil).toEqual(compUntil);
    expect(evaluateSubscriptionAccess(asSubscription()).hasAccess).toBe(true);

    await post("invoice.paid", { subscription: active.id });
    expect(state.row.compAccessUntil).toEqual(compUntil);

    await post("invoice.payment_failed", { subscription: active.id });
    expect(state.row.compAccessUntil).toEqual(compUntil);
    expect(state.row.status).toBe("past_due");
    expect(evaluateSubscriptionAccess(asSubscription()).hasAccess).toBe(true);

    const canceled = paidSub("canceled");
    state.subs.set(canceled.id, canceled);
    await post("customer.subscription.deleted", canceled);
    expect(state.row.compAccessUntil).toEqual(compUntil);
    expect(state.row.stripeSubscriptionId).toBeNull();
    const access = evaluateSubscriptionAccess(asSubscription());
    expect(access.hasAccess).toBe(true);
    expect(access.needsPaymentMethod).toBe(false);
    expect(access.daysRemaining).toBeGreaterThan(0);
  });
});
