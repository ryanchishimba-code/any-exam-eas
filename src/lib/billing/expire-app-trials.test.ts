import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Subscription } from "@prisma/client";

const prismaMock = vi.hoisted(() => ({
  subscription: {
    updateMany: vi.fn(),
    findUnique: vi.fn(),
  },
}));

vi.mock("@/lib/prisma", () => ({ prisma: prismaMock }));

import { prisma } from "@/lib/prisma";
import {
  appTrialShouldExpire,
  expireElapsedAppTrials,
  expiredAppTrialWhere,
} from "@/lib/billing/expire-app-trials";
import { expireTrialIfNeeded } from "@/lib/subscription-access";

const now = new Date("2026-10-28T12:00:00.000Z");
const past = new Date("2026-10-27T12:00:00.000Z");
const future = new Date("2026-11-27T12:00:00.000Z");

function sub(partial: Partial<Subscription>): Subscription {
  return {
    id: "sub_card_free",
    userId: "user_1",
    stripeCustomerId: null,
    stripeSubscriptionId: null,
    status: "trialing",
    plan: "trial",
    planTier: "pro",
    planInterval: "monthly",
    trialEndsAt: past,
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
    createdAt: now,
    updatedAt: now,
    ...partial,
  } as Subscription;
}

describe("app trial expiry", () => {
  beforeEach(() => {
    prismaMock.subscription.updateMany.mockReset();
    prismaMock.subscription.findUnique.mockReset();
    prismaMock.subscription.updateMany.mockResolvedValue({ count: 1 });
    prismaMock.subscription.findUnique.mockImplementation(async () =>
      sub({ status: "trial_expired" })
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("expires a card-free trial whose end is already past", async () => {
    const row = sub({});
    expect(appTrialShouldExpire(row, now)).toBe(true);

    const updated = await expireTrialIfNeeded(row, now);
    expect(prisma.subscription.updateMany).toHaveBeenCalledWith({
      where: { id: row.id, ...expiredAppTrialWhere(now) },
      data: { status: "trial_expired" },
    });
    expect(updated?.status).toBe("trial_expired");
  });

  it("skips Stripe-linked rows", async () => {
    const row = sub({ stripeSubscriptionId: "sub_live_123" });
    expect(appTrialShouldExpire(row, now)).toBe(false);
    expect(await expireTrialIfNeeded(row, now)).toBe(row);
    expect(prisma.subscription.updateMany).not.toHaveBeenCalled();
  });

  it("skips a blank Stripe id because it is not SQL null", () => {
    expect(appTrialShouldExpire(sub({ stripeSubscriptionId: "" }), now)).toBe(false);
  });

  it("skips a future complimentary pass", async () => {
    const row = sub({ compAccessUntil: future });
    expect(appTrialShouldExpire(row, now)).toBe(false);
    expect(await expireTrialIfNeeded(row, now)).toBe(row);
    expect(prisma.subscription.updateMany).not.toHaveBeenCalled();
  });

  it("still expires a card-free trial whose pass has already lapsed", () => {
    expect(appTrialShouldExpire(sub({ compAccessUntil: past }), now)).toBe(true);
  });

  it("skips trials that have not ended", async () => {
    const row = sub({ trialEndsAt: future });
    expect(appTrialShouldExpire(row, now)).toBe(false);
    expect(await expireTrialIfNeeded(row, now)).toBe(row);
    expect(prisma.subscription.updateMany).not.toHaveBeenCalled();
  });

  it("does not expire a trial at the exact end instant", () => {
    expect(appTrialShouldExpire(sub({ trialEndsAt: now }), now)).toBe(false);
    expect(expiredAppTrialWhere(now).trialEndsAt).toEqual({ lt: now });
  });

  it("is idempotent for rows that are already trial_expired", async () => {
    const row = sub({ status: "trial_expired" });
    expect(appTrialShouldExpire(row, now)).toBe(false);
    expect(await expireTrialIfNeeded(row, now)).toBe(row);
    expect(prisma.subscription.updateMany).not.toHaveBeenCalled();
  });

  it("updates only the shared where-clause and logs the changed count", async () => {
    prismaMock.subscription.updateMany.mockResolvedValue({ count: 18 });
    const info = vi.spyOn(console, "info").mockImplementation(() => {});

    const result = await expireElapsedAppTrials(now);

    expect(prisma.subscription.updateMany).toHaveBeenCalledWith({
      where: expiredAppTrialWhere(now),
      data: { status: "trial_expired" },
    });
    expect(expiredAppTrialWhere(now)).toEqual({
      status: "trialing",
      trialEndsAt: { lt: now },
      stripeSubscriptionId: null,
      OR: [{ compAccessUntil: null }, { compAccessUntil: { lte: now } }],
    });
    expect(result).toEqual({ expired: 18 });
    expect(info).toHaveBeenCalledWith("[cron/expire-trials] changed", { count: 18 });
  });
});
