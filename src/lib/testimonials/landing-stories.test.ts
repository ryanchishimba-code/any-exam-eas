import { describe, expect, it } from "vitest";
import { landingTestimonialStories } from "./landing-stories";

describe("landingTestimonialStories", () => {
  it("uses consented seeds when the database is empty", () => {
    const stories = landingTestimonialStories([], "nclex");
    expect(stories.map((story) => story.name)).toEqual(["Nathan C.", "Priscilla J."]);
  });

  it("shows no quotes when the board has no matching exam field", () => {
    const stories = landingTestimonialStories([], "pance");
    expect(stories).toEqual([]);
  });

  it("shows NAPLEX seeds on /naplex only", () => {
    const stories = landingTestimonialStories([], "naplex");
    expect(stories.map((story) => story.name)).toEqual(["Steven", "Frank C."]);
    expect(stories.map((story) => story.quote)).toEqual([
      "Easy to study and amazing prep.",
      "The drug cards were a game changer.",
    ]);
  });

  it("shows AANP FNP seeds on /aanp-fnp only", () => {
    const stories = landingTestimonialStories([], "aanp-fnp");
    expect(stories.map((story) => story.name)).toEqual(["Mag B."]);
    expect(stories[0]?.quote).toBe("I couldn't believe the price for everything I got.");
  });
});
