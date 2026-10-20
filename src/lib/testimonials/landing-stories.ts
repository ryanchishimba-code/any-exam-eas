import type { LandingSuccessStory } from "@/lib/landing/content";
import { testimonialsForBoard } from "@/lib/marketing/why-trust-it";
import type { ExamSeoKey } from "@/lib/seo/exam-config";
import { mergeHomeTestimonials } from "@/lib/testimonials/home-stories";

export type LandingTestimonialCard = {
  name: string;
  exam: string;
  quote: string;
  initials: string;
};

function toCard(story: LandingSuccessStory): LandingTestimonialCard {
  return {
    name: story.name,
    exam: story.exam,
    quote: story.quote,
    initials: story.initials,
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
