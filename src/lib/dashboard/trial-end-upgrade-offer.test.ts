import { describe, expect, it } from "vitest";
import { TRIAL_UPGRADE_OFFER_MS } from "@/lib/billing/trial-upgrade-offer";
import { dashboardTrialEndOfferHref } from "./upgrade-banner";
import {
  shouldResolveTrialEndOffer,
  trialEndUpgradeOfferEligibility,
  type TrialEndOfferEligibilityInput,
} from "./trial-end-upgrade-offer";

const NOW = new Date("2026-11-15T12:00:00.000Z");
const USER = "user_1";

function input(
  overrides: Partial<TrialEndOfferEligibilityInput> = {}
): TrialEndOfferEligibilityInput {
  return {
    userId: USER,
    role: "free",
    subscriptionStatus: "trial_expired",
    trialEndsAt: new Date(NOW.getTime() - 2 * 60 * 60 * 1000),
    questionsAnswered: 4,
    paid: false,
    offer: {
      id: "offer_1",
      userId: USER,
      expiresAt: new Date(NOW.getTime() + 60 * 60 * 1000),
      redeemedAt: null,
    },
    now: NOW,
    ...overrides,
  };
}

describe("trialEndUpgradeOfferEligibility", () => {
  it("shows the offer when the trial ended within 48 hours and the student has practiced", () => {
    expect(trialEndUpgradeOfferEligibility(input())).toEqual({ show: true });
  });

  it("still shows the offer at exactly 48 hours after the trial ended", () => {
    expect(
      trialEndUpgradeOfferEligibility(
        input({ trialEndsAt: new Date(NOW.getTime() - TRIAL_UPGRADE_OFFER_MS) })
      )
    ).toEqual({ show: true });
  });

  it("hides the offer during an active trial", () => {
    expect(
      trialEndUpgradeOfferEligibility(
        input({
          role: "trial",
          subscriptionStatus: "trialing",
          trialEndsAt: new Date(NOW.getTime() + 2 * 24 * 60 * 60 * 1000),
        })
      )
    ).toEqual({ show: false, reason: "in_trial" });
  });

  it("hides the offer when the trial ended more than 48 hours ago", () => {
    expect(
      trialEndUpgradeOfferEligibility(
        input({ trialEndsAt: new Date(NOW.getTime() - TRIAL_UPGRADE_OFFER_MS - 1) })
      )
    ).toEqual({ show: false, reason: "ended_too_long_ago" });
  });

  it("hides the offer when the student has not answered a question", () => {
    expect(trialEndUpgradeOfferEligibility(input({ questionsAnswered: 0 }))).toEqual({
      show: false,
      reason: "no_questions",
    });
  });

  it("hides the offer when the account has already paid", () => {
    expect(trialEndUpgradeOfferEligibility(input({ paid: true }))).toEqual({
      show: false,
      reason: "paid",
    });
  });

  it("hides a used offer", () => {
    const offer = input().offer;
    expect(
      trialEndUpgradeOfferEligibility(
        input({
          offer: offer
            ? { ...offer, redeemedAt: new Date(NOW.getTime() - 60_000) }
            : null,
        })
      )
    ).toEqual({ show: false, reason: "used" });
  });

  it("hides an expired offer", () => {
    const offer = input().offer;
    expect(
      trialEndUpgradeOfferEligibility(
        input({
          offer: offer ? { ...offer, expiresAt: new Date(NOW.getTime() - 1000) } : null,
        })
      )
    ).toEqual({ show: false, reason: "expired" });
  });

  it("hides the offer for staff and active subscribers", () => {
    expect(trialEndUpgradeOfferEligibility(input({ role: "staff" }))).toEqual({
      show: false,
      reason: "invalid",
    });
    expect(
      trialEndUpgradeOfferEligibility(
        input({ role: "subscriber", subscriptionStatus: "active" })
      )
    ).toEqual({ show: false, reason: "invalid" });
  });

  it("reads a cached ISO trial end", () => {
    expect(
      trialEndUpgradeOfferEligibility(
        input({
          trialEndsAt: new Date(NOW.getTime() - 2 * 60 * 60 * 1000).toISOString(),
        })
      )
    ).toEqual({ show: true });
  });

  it("does not look up an offer while the trial is still running or before any practice", () => {
    const midTrial = input({
      role: "trial",
      subscriptionStatus: "trialing",
      trialEndsAt: new Date(NOW.getTime() + 24 * 60 * 60 * 1000),
    });
    const { paid: _paid, offer: _offer, ...mid } = midTrial;
    expect(shouldResolveTrialEndOffer(mid)).toBe(false);

    const untouched = input({ questionsAnswered: 0 });
    const { paid: _paid2, offer: _offer2, ...noPractice } = untouched;
    expect(shouldResolveTrialEndOffer(noPractice)).toBe(false);

    const ready = input();
    const { paid: _paid3, offer: _offer3, ...open } = ready;
    expect(shouldResolveTrialEndOffer(open)).toBe(true);
  });

  it("builds the upgrade link the banner uses", () => {
    expect(dashboardTrialEndOfferHref("tok_abc")).toBe("/upgrade?offer=tok_abc");
  });
});
