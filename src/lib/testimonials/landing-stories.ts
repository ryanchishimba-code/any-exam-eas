import type { LandingSuccessStory } from "@/lib/landing/content";
import { testimonialsForBoard } from "@/lib/marketing/why-trust-it";
import type { ExamSeoKey } from "@/lib/seo/exam-config";
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

/** All consented seeds plus approved DB rows (for board landings). */
function mergeBoardTestimonials(published: LandingSuccessStory[]): LandingSuccessStory[] {
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

  return stories.filter((story) => story.quote.trim() !== FOUNDER_NOTE.quote);
}

export type LandingTestimonialCard = {
  name: string;
  exam: string;
  quote: string;
  initials: string;
  rating?: number;
};

function toCard(story: LandingSuccessStory): LandingTestimonialCard {
  const rating = story.rating;
  return {
    name: story.name,
    exam: story.exam,
    quote: story.quote,
    initials: story.initials,
    rating:
      typeof rating === "number" && rating >= 1 && rating <= 5 ? Math.round(rating) : undefined,
  };
}

/** Consented DB rows plus seeds (#111/#113). Board-specific when possible; otherwise general. */
export function landingTestimonialStories(
  published: LandingSuccessStory[],
  examKey?: ExamSeoKey
): LandingTestimonialCard[] {
  const merged = mergeBoardTestimonials(published);
  const pool =
    examKey && examKey.length > 0 ? testimonialsForBoard(merged, examKey) : merged;
  return pool.slice(0, 3).map(toCard);
}
