import { describe, expect, it } from "vitest";
import { summarizeBillingCycle } from "@/lib/crm/billing-cycle";
import { summarizeConsentForList } from "@/lib/legal/consent-record";

describe("summarizeBillingCycle", () => {
  it("labels active subscriptions as paid members with renew date", () => {
    const end = new Date();
    end.setUTCDate(end.getUTCDate() + 10);
    const summary = summarizeBillingCycle({
      status: "active",
      plan: "subscribe",
      planInterval: "yearly",
      trialEndsAt: null,
      currentPeriodEnd: end,
      canceledAt: null,
      compAccessUntil: null,
    });
    expect(summary.urgency).toBe("soon");
    expect(summary.label).toBe("Paid member");
    expect(summary.detail).toMatch(/Yearly · renews/);
    expect(summary.detail).toMatch(/\(10d\)/);
    expect(summary.renewsAt).toBe(end.toISOString());
  });

  it("labels trials with expiry date", () => {
    const end = new Date();
    end.setUTCDate(end.getUTCDate() + 4);
    const summary = summarizeBillingCycle({
      status: "trialing",
      plan: "trial",
      planInterval: null,
      trialEndsAt: end,
      currentPeriodEnd: null,
      canceledAt: null,
      compAccessUntil: null,
    });
    expect(summary.urgency).toBe("trial");
    expect(summary.label).toBe("On trial · 4d left");
    expect(summary.detail).toMatch(/^Expires /);
  });

  it("flags past due subscriptions", () => {
    const summary = summarizeBillingCycle({
      status: "past_due",
      plan: "subscribe",
      planInterval: "monthly",
      trialEndsAt: null,
      currentPeriodEnd: new Date(),
      canceledAt: null,
      compAccessUntil: null,
    });
    expect(summary.urgency).toBe("past_due");
    expect(summary.label).toBe("Payment failed");
  });
});

describe("summarizeConsentForList", () => {
  it("marks inferred consent when no record exists", () => {
    const created = new Date("2024-01-15T12:00:00.000Z");
    const summary = summarizeConsentForList(null, created);
    expect(summary.source).toBe("inferred");
    expect(summary.acceptedAt).toBe(created.toISOString());
  });
});
