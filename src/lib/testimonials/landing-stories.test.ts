import { describe, expect, it } from "vitest";
import { landingTestimonialStories } from "./landing-stories";

describe("landingTestimonialStories", () => {
  it("uses consented seeds when the database is empty", () => {
    const stories = landingTestimonialStories([], "nclex");
    expect(stories.map((story) => story.name)).toEqual(["Nathan C.", "Priscilla J."]);
  });

  it("shows PANCE seeds on /pance only", () => {
    const stories = landingTestimonialStories([], "pance");
    expect(stories.map((story) => story.name)).toEqual(["Nick B.", "N., PA"]);
    expect(stories[0]?.quote).toBe(
      "With everything premium becoming expensive, it's a welcome sight to see premium material."
    );
    expect(stories[1]?.quote).toBe(
      "Great website to study for PANCE, with a question bank as well as videos for learning. I would recommend anyexameasy.com to all future PAs, and current PAs can use it to study for PANRE."
    );
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
