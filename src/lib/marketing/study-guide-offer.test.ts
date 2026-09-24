import { describe, expect, it } from "vitest";
import {
  isStudyGuideCallback,
  studyGuideOfferCards,
  studyGuideTrialLine,
} from "./study-guide-offer";

describe("study guide offer copy", () => {
  it("states the 5-day trial and monthly price without a discount", () => {
    const line = studyGuideTrialLine();
    expect(line).toMatch(/5-day free trial/i);
    expect(line).toMatch(/no payment method/i);
    expect(line).toMatch(/\$27\.99\/mo/);
    expect(line).not.toMatch(/%/);
  });

  it("sends each book to trial or sign-in, not the manuscript", () => {
    const cards = studyGuideOfferCards();
    expect(cards.map((card) => card.exam)).toEqual(["nclex", "naplex", "aanp-fnp"]);
    for (const card of cards) {
      expect(card.trialHref).toContain("/signup?plan=trial");
      expect(card.trialHref).not.toContain("/study-guide");
      expect(card.signInHref).toMatch(/^\/login\?callbackUrl=/);
      expect(card.body).toMatch(/bookmarks and highlights/i);
    }
  });

  it("recognizes study-guide login callbacks", () => {
    expect(isStudyGuideCallback("/nclex/study-guide/cardiac")).toBe(true);
    expect(isStudyGuideCallback("/naplex/study-guide")).toBe(true);
    expect(isStudyGuideCallback("/dashboard")).toBe(false);
  });
});
