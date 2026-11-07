import { describe, expect, it } from "vitest";
import {
  buildMidTrialStudyNudge,
  buildTrialEndingBillingNote,
  dashboardEmailUrl,
  trialEndingContinueLine,
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
    expect(upgradeEmailUrl("trial-ended")).toContain("/checkout?");
    expect(upgradeEmailUrl("trial-ended")).toContain("plan=subscribe");
    expect(upgradeEmailUrl("trial-ended")).toContain("from=email-trial-ended");
  });
});

describe("trial ending continue line", () => {
  it("does not tell a card-free trial to cancel", () => {
    expect(trialEndingContinueLine(false)).not.toMatch(/cancel/i);
    expect(trialEndingContinueLine()).toContain("did not ask for a card");
    expect(trialEndingContinueLine(true)).toContain("cancel in Settings");
  });
});

describe("mid-trial study nudge", () => {
  it("uses one title for the subject and the heading, and names the board", () => {
    const message = buildMidTrialStudyNudge({
      name: "Jordan",
      examName: "NCLEX",
      startUrl: "https://www.anyexameasy.com/question-bank?field=nursing&mode=bank&count=10",
    });
    expect(message.subject).toBe("Start 10 NCLEX questions");
    expect(message.html).toContain(">Start 10 NCLEX questions<");
    expect(message.text).toContain("have not answered a question yet");
    expect(message.text).toContain("About 2 to 3 days");
    expect(message.text).not.toMatch(/two days left/i);
    expect(message.text).not.toMatch(/upgrade/i);
    expect(message.text).toContain("does not guarantee a score");
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
