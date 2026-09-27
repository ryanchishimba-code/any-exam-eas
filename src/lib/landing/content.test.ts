import { describe, expect, it } from "vitest";
import {
  LANDING_HERO_HEADLINE,
  LANDING_HERO_SUBLINE_BODY,
  LANDING_SUCCESS_STORIES,
  formatExamHeroEyebrow,
  formatExamHeroHeadline,
  formatExamHeroTrialOffer,
  formatExamHubSubline,
  formatExamLiveCountLine,
  formatHeroTotalCountLine,
  landingTrialHrefForExam,
} from "./content";
import { formatPricingCheckoutTrialOffer } from "@/lib/site";

describe("homepage hero copy", () => {
  it("defaults to a passing promise with a six-board offer subline", () => {
    expect(LANDING_HERO_HEADLINE).toMatch(/doubtful to confident/i);
    expect(formatExamHeroEyebrow("nclex")).toBe("NCLEX prep");
    expect(formatExamHeroHeadline("nclex")).toMatch(/NCLEX/);
    expect(LANDING_HERO_SUBLINE_BODY).toMatch(/one login/i);
    expect(LANDING_HERO_SUBLINE_BODY).toMatch(/six boards/i);
    expect(LANDING_HERO_SUBLINE_BODY).toMatch(/27\.99/);
    expect(LANDING_HERO_SUBLINE_BODY).toMatch(/no payment method required/i);
    expect(LANDING_HERO_SUBLINE_BODY).not.toMatch(/no card/i);
    expect(LANDING_HERO_SUBLINE_BODY).not.toMatch(/5 days free/i);
    expect(LANDING_HERO_SUBLINE_BODY).not.toMatch(/rent money/i);
  });

  it("labels the six-board total instead of an unlabeled single-bank count", () => {
    expect(formatHeroTotalCountLine("46,285")).toBe(
      "46,285 active questions across six boards"
    );
    expect(formatHeroTotalCountLine("")).toBeNull();
    expect(formatExamLiveCountLine("NCLEX", "5,660")).toBe("5,660 active NCLEX questions");
    expect(formatExamLiveCountLine("NCLEX", "")).toBeNull();
  });

  it("keeps exam= deep links on board chips", () => {
    expect(landingTrialHrefForExam("nclex")).toBe(
      "/signup?plan=trial&interval=monthly&tier=pro&exam=nclex"
    );
    expect(landingTrialHrefForExam("naplex")).toContain("exam=naplex");
  });

  it("keeps the trial offer identical to checkout", () => {
    expect(formatExamHeroTrialOffer()).toBe(
      "5-day free trial · no payment method required · then $27.99/mo"
    );
    expect(formatExamHeroTrialOffer()).toBe(formatPricingCheckoutTrialOffer());
    expect(formatExamHeroTrialOffer()).not.toMatch(/no card/i);
  });

  it("does not ship invented student testimonials as a static fallback", () => {
    expect(LANDING_SUCCESS_STORIES).toEqual([]);
  });

  it("uses board-specific hub sublines for non-NCLEX ATF", () => {
    expect(formatExamHubSubline("naplex")).toMatch(/calculations/i);
    expect(formatExamHubSubline("usmle")).toMatch(/step-day/i);
    expect(formatExamHubSubline("pance")).toMatch(/NCCPA/i);
    expect(formatExamHubSubline()).toMatch(/NGN/i);
  });
});
