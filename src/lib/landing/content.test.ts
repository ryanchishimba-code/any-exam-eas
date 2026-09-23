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
import {
  FALLBACK_QUESTION_COUNTS,
  formatExactServeReadyCount,
  getPublishedQuestionStats,
} from "@/lib/marketing/bank-stats";

describe("homepage hero copy", () => {
  it("defaults to an NCLEX-specific job with a six-board offer subline", () => {
    expect(LANDING_HERO_HEADLINE).toMatch(/NCLEX/i);
    expect(formatExamHeroEyebrow("nclex")).toBe("NCLEX prep");
    expect(formatExamHeroHeadline("nclex")).toBe(LANDING_HERO_HEADLINE);
    expect(LANDING_HERO_SUBLINE_BODY).toMatch(/one login/i);
    expect(LANDING_HERO_SUBLINE_BODY).toMatch(/six boards/i);
    expect(LANDING_HERO_SUBLINE_BODY).toMatch(/27\.99/);
    expect(LANDING_HERO_SUBLINE_BODY).not.toMatch(/rent money/i);
  });

  it("labels the six-board total instead of an unlabeled single-bank count", () => {
    expect(formatHeroTotalCountLine(FALLBACK_QUESTION_COUNTS.total)).toBe(
      `${FALLBACK_QUESTION_COUNTS.total} questions across six boards`
    );
    expect(formatHeroTotalCountLine("7,581 serve-ready questions")).toBe(
      "7,581 questions across six boards"
    );
    expect(formatExamLiveCountLine("NCLEX", "8,327")).toBe("8,327 active NCLEX questions");
  });

  it("keeps exam= deep links on board chips", () => {
    expect(landingTrialHrefForExam("nclex")).toBe(
      "/signup?plan=trial&interval=monthly&tier=pro&exam=nclex"
    );
    expect(landingTrialHrefForExam("naplex")).toContain("exam=naplex");
  });

  it("labels the NCLEX published-floor count for exam-hub marketing", () => {
    const published = getPublishedQuestionStats();
    expect(
      formatExamLiveCountLine(
        "NCLEX",
        formatExactServeReadyCount(published.perBoard.nclex)
      )
    ).toBe("8,327 active NCLEX questions");
    expect(formatExamHeroTrialOffer()).toBe("5-day free trial · no card · then $27.99/mo");
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
