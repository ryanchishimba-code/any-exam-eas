import { describe, expect, it } from "vitest";
import { landingTestimonialStories } from "./landing-stories";

describe("landingTestimonialStories", () => {
  it("uses consented seeds when the database is empty", () => {
    const stories = landingTestimonialStories([], "nclex");
    expect(stories.map((story) => story.name)).toEqual(["Nathan C.", "Priscilla J."]);
  });

  it("falls back to general quotes when a board has no match", () => {
    const stories = landingTestimonialStories([], "pance");
    expect(stories.length).toBeGreaterThan(0);
    expect(stories[0]?.name).toBe("Nathan C.");
  });
});
