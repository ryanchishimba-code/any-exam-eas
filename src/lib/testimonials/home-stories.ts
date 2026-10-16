import type { LandingSuccessStory } from "@/lib/landing/content";
import { CONSENTED_TESTIMONIAL_SEEDS, FOUNDER_NOTE } from "@/lib/testimonials/consented-seed";

function initialsFor(name: string): string {
  return name
    .split(/\s+/)
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function fromSeed(seed: (typeof CONSENTED_TESTIMONIAL_SEEDS)[number]): LandingSuccessStory {
  return {
    quote: seed.quote,
    name: seed.name,
    exam: seed.exam,
    initials: initialsFor(seed.name),
    outcome: "",
    avatarGradient: "linear-gradient(135deg, #0f766e, #0a2540)",
  };
}

/**
 * Real consented quotes only. Seeds fill in when the database row is absent.
 * The founder line is not a student testimonial.
 */
export function mergeHomeTestimonials(published: LandingSuccessStory[]): LandingSuccessStory[] {
  const approved = published.filter((story) => story.quote?.trim() && story.name?.trim());
  const byName = new Map(approved.map((story) => [story.name.trim().toLowerCase(), story]));
  const stories: LandingSuccessStory[] = CONSENTED_TESTIMONIAL_SEEDS.map((seed) => {
    return byName.get(seed.name.trim().toLowerCase()) ?? fromSeed(seed);
  });

  for (const story of approved) {
    const key = story.name.trim().toLowerCase();
    if (stories.some((item) => item.name.trim().toLowerCase() === key)) continue;
    if (story.quote.trim() === FOUNDER_NOTE.quote) continue;
    stories.push(story);
  }

  return stories.filter((story) => story.quote.trim() !== FOUNDER_NOTE.quote).slice(0, 4);
}
