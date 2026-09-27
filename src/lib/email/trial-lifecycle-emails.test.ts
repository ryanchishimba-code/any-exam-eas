import { describe, expect, it } from "vitest";
import {
  buildTrialEndingBillingNote,
  dashboardEmailUrl,
  upgradeEmailUrl,
} from "@/lib/email/trial-lifecycle-emails";

describe("trial lifecycle email URLs", () => {
  it("builds dashboard link from app base", () => {
    expect(dashboardEmailUrl()).toMatch(/\/dashboard$/);
  });

  it("builds upgrade links with email context", () => {
    expect(upgradeEmailUrl("welcome")).toContain("/pricing?");
    expect(upgradeEmailUrl("welcome")).toContain("from=email-welcome");
    expect(upgradeEmailUrl("welcome")).toContain("highlight=pro");
    expect(upgradeEmailUrl("trial-ending")).toContain("/checkout?");
    expect(upgradeEmailUrl("trial-ending")).toContain("plan=subscribe");
    expect(upgradeEmailUrl("trial-ending")).toContain("from=email-trial-ending");
  });
});

describe("trial ending billing note", () => {
  it("omits the checkout payment-method sentence for card-free trials", () => {
    const note = buildTrialEndingBillingNote({
      legacyStripeTrial: false,
      planInterval: "monthly",
      amountUsd: 27.99,
    });
    expect(note.html).toBe("");
    expect(note.text).toBe("");
    expect(`${note.html} ${note.text}`).not.toContain("You added a payment method at checkout");

    const missingFlag = buildTrialEndingBillingNote({
      planInterval: "monthly",
      amountUsd: 27.99,
    });
    expect(missingFlag.html).not.toContain("You added a payment method at checkout");
  });

  it("keeps the payment-method sentence for a legacy Stripe trial", () => {
    const note = buildTrialEndingBillingNote({
      legacyStripeTrial: true,
      planInterval: "monthly",
      amountUsd: 27.99,
    });
    expect(note.html).toContain("You added a payment method at checkout");
    expect(note.text).toContain("Payment note:");
  });
});
