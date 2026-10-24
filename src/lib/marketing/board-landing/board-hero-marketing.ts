import type { BoardSlug } from "@/lib/marketing/board-landing/board-theme";

export const BOARD_LANDING_HERO_TRIAL_LABEL = "Start 5-day free trial";

export const BOARD_LANDING_HERO_QUIZ_LABEL = "Try 10 free questions";

export const BOARD_LANDING_HERO_QUIZ_HREF = "#quiz";

export type BoardHeroTestimonial = {
  name: string;
  quote: string;
};

export type BoardHeroMarketingCopy = {
  headline: string;
  subline: string;
  testimonial: BoardHeroTestimonial | null;
};

const BOARD_HERO_MARKETING: Record<BoardSlug, BoardHeroMarketingCopy> = {
  nclex: {
    headline: "NCLEX-RN practice that feels like the real exam.",
    subline: "Next Gen case studies, real explanations and a 5-day free trial.",
    testimonial: {
      name: "Nathan C.",
      quote: "The best questions I've found for NCLEX prep.",
    },
  },
  naplex: {
    headline: "Know every drug the NAPLEX asks about.",
    subline: "Drug cards, calculations and explanations for $27.99/mo.",
    testimonial: {
      name: "Frank C.",
      quote: "The drug cards were a game changer.",
    },
  },
  usmle: {
    headline: "Every USMLE answer, explained like a tutor would.",
    subline:
      "Step 1 and Step 2 practice questions with a full explanation for every answer.",
    testimonial: null,
  },
  "aanp-fnp": {
    headline: "Premium FNP prep without the premium price.",
    subline: "AANP FNP practice questions across the lifespan, explained, for $27.99/mo.",
    testimonial: {
      name: "Mag B.",
      quote: "I couldn't believe the price for everything I got.",
    },
  },
  pance: {
    headline: "Premium PANCE prep that won't break your budget.",
    subline: "Practice questions mapped to every organ system on the PANCE blueprint.",
    testimonial: {
      name: "Nick B.",
      quote:
        "With everything premium becoming expensive, it's a welcome sight to see premium material.",
    },
  },
  "npte-pt": {
    headline: "NPTE-PT practice built for PTs, not borrowed from other exams.",
    subline: "PT-specific questions, explanations and a full adaptive mock exam.",
    testimonial: null,
  },
};

export function boardHeroMarketingCopy(slug: BoardSlug): BoardHeroMarketingCopy {
  return BOARD_HERO_MARKETING[slug];
}

type BoardHeroModelFields = {
  h1Lead: string;
  h1Accent: string;
  heroWhyUs: string;
  heroTestimonial: BoardHeroTestimonial | null;
};

/** Marketing hero copy for the six board hub pages (does not change meta title or JSON-LD). */
export function withBoardHeroMarketing<T extends BoardHeroModelFields>(slug: BoardSlug, model: T): T {
  const copy = boardHeroMarketingCopy(slug);
  return {
    ...model,
    h1Lead: copy.headline,
    h1Accent: "",
    heroWhyUs: copy.subline,
    heroTestimonial: copy.testimonial,
  };
}
