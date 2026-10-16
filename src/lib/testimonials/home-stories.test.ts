import { describe, expect, it } from "vitest";
import type { LandingSuccessStory } from "@/lib/landing/content";
import { FOUNDER_NOTE } from "@/lib/testimonials/consented-seed";
import { mergeHomeTestimonials } from "@/lib/testimonials/home-stories";

function story(partial: Partial<LandingSuccessStory> & Pick<LandingSuccessStory, "name" | "quote">): LandingSuccessStory {
  return {
    exam: "NCLEX-RN student",
    initials: "XX",
    outcome: "",
    avatarGradient: "linear-gradient(135deg, #0f766e, #0a2540)",
    ...partial,
  };
}

describe("homepage testimonials", () => {
  it("shows Nathan and Priscilla even when the database is empty", () => {
    const stories = mergeHomeTestimonials([]);
    expect(stories.map((item) => item.name)).toEqual(["Nathan C.", "Priscilla J."]);
    expect(stories.some((item) => item.quote === FOUNDER_NOTE.quote)).toBe(false);
  });

  it("prefers a published row for the same name and keeps other real quotes", () => {
    const stories = mergeHomeTestimonials([
      story({ name: "Nathan C.", quote: "The best questions I've found for NCLEX prep.", exam: "NCLEX" }),
      story({ name: "Avery L.", quote: "Clear rationales." }),
      story({ name: "Founder", quote: FOUNDER_NOTE.quote }),
    ]);
    expect(stories.map((item) => item.name)).toEqual(["Nathan C.", "Priscilla J.", "Avery L."]);
    expect(stories[0]?.exam).toBe("NCLEX");
  });
});
