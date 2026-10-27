import { describe, expect, it } from "vitest";
import {
  ABOUT_AFFILIATION,
  ABOUT_HERO_ACCENT,
  ABOUT_HERO_HEADLINE,
  ABOUT_HERO_LEAD,
  ABOUT_PRODUCT_FEATURES,
  ABOUT_PULL_QUOTE,
  founderStoryParagraphs,
} from "@/lib/marketing/about-copy";
import { formatMonthlyPrice } from "@/lib/site";

describe("about founder copy", () => {
  it("uses the suggested headline and keeps the pull quote in his words", () => {
    expect(`${ABOUT_HERO_LEAD} ${ABOUT_HERO_ACCENT}`).toBe(ABOUT_HERO_HEADLINE);
    expect(ABOUT_HERO_HEADLINE.toLowerCase()).not.toMatch(/\bpass\b/);
    expect(ABOUT_PULL_QUOTE).toBe("This is my gift to my former self.");
    expect(ABOUT_AFFILIATION).toBe(
      "AnyExamEasy is not affiliated with NABP, NCSBN, or any official exam body."
    );
  });

  it("interpolates the live monthly price and does not bake in an amount", () => {
    const story = founderStoryParagraphs("$0.01").join(" ");
    expect(story).toContain("At $0.01 a month, that's the break-even point");
    expect(story).not.toContain("$27.99");
    expect(story).toContain(ABOUT_PULL_QUOTE);
    expect(story.toLowerCase()).not.toMatch(/\byou will pass\b/);

    const live = founderStoryParagraphs(formatMonthlyPrice("pro")).join(" ");
    expect(live).toContain(`At ${formatMonthlyPrice("pro")} a month`);
  });

  it("lists only the five features he named", () => {
    expect(ABOUT_PRODUCT_FEATURES).toEqual([
      "Adaptive Roadmap that focuses you on weak areas",
      "Deep Dives opened straight from missed questions",
      "Full-length exam simulations",
      "Rationales with sources, built to show you why an answer is right",
      "One plan covering six boards: NAPLEX, NCLEX, and more",
    ]);
  });
});
