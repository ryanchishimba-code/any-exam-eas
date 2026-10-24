import type { LandingSuccessStory } from "@/lib/landing/content";
import { testimonialsForBoard } from "@/lib/marketing/why-trust-it";
import type { ExamSeoKey } from "@/lib/seo/exam-config";
import { mergeHomeTestimonials } from "@/lib/testimonials/home-stories";

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
  const merged = mergeHomeTestimonials(published);
  const pool =
    examKey && examKey.length > 0
      ? (() => {
          const matched = testimonialsForBoard(merged, examKey);
          return matched.length > 0 ? matched : merged;
        })()
      : merged;
  return pool.slice(0, 3).map(toCard);
}
