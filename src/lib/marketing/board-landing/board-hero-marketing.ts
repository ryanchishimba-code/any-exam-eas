import { TRIAL_DAYS } from "@/lib/billing-config";
import type { BoardSlug } from "@/lib/marketing/board-landing/board-theme";
import {
  PANCE_HERO_TESTIMONIAL_SEED_ID,
  consentedSeedById,
} from "@/lib/testimonials/consented-seed";

const panceHeroTestimonialSeed = consentedSeedById(PANCE_HERO_TESTIMONIAL_SEED_ID);
if (!panceHeroTestimonialSeed) {
  throw new Error(`Missing consented seed: ${PANCE_HERO_TESTIMONIAL_SEED_ID}`);
}

export const BOARD_LANDING_HERO_TRIAL_LABEL = "Start 5-day free trial";

export const BOARD_LANDING_HERO_QUIZ_LABEL = "Try the free quiz";

export const BOARD_LANDING_HERO_QUIZ_HREF = "#quiz";

export type BoardHeroTestimonial = {
  name: string;
  quote: string;
  /** Board label shown beside the name. */
  board: string;
};

export type BoardHeroMarketingCopy = {
  headline: string;
  subline: string;
  testimonial: BoardHeroTestimonial | null;
};

const BOARD_HERO_MARKETING: Record<BoardSlug, BoardHeroMarketingCopy> = {
  nclex: {
    headline: "NCLEX-RN questions that match the current test plan.",
    subline:
      "Next Generation case studies, explanations for every choice, and a readiness score for weak areas.",
    testimonial: {
      name: "Nathan C.",
      quote: "The best questions I've found for NCLEX prep.",
      board: "NCLEX-RN",
    },
  },
  naplex: {
    headline: "NAPLEX questions for the calculations and the drugs.",
    subline: "Pharmacy calculations, drug vignettes, flashcards, and explanations that show the work.",
    testimonial: {
      name: "Frank C.",
      quote: "The drug cards were a game changer.",
      board: "NAPLEX",
    },
  },
  usmle: {
    headline: "USMLE vignettes for Step 1, Step 2 CK, and Step 3.",
    subline: "Step-style practice questions with explanations for every choice and timed practice exams.",
    testimonial: null,
  },
  "aanp-fnp": {
    headline: "AANP FNP vignettes across the lifespan, explained.",
    subline: "Family nurse practitioner practice questions, flashcards, a study guide, and timed practice exams.",
    testimonial: {
      name: "Mag B.",
      quote: "I couldn't believe the price for everything I got.",
      board: "AANP FNP",
    },
  },
  pance: {
    headline: "PANCE vignettes that show where the reasoning slips.",
    subline: "Physician assistant practice questions, flashcards, a study guide, and timed practice exams.",
    testimonial: {
      name: panceHeroTestimonialSeed.name,
      quote: panceHeroTestimonialSeed.quote,
      board: "PANCE",
    },
  },
  "npte-pt": {
    headline: "NPTE-PT questions that explain the clinical why.",
    subline: "Physical therapy scenarios, explanations for each choice, timed practice exams, and 3D anatomy.",
    testimonial: null,
  },
};

export function boardHeroMarketingCopy(slug: BoardSlug): BoardHeroMarketingCopy {
  return BOARD_HERO_MARKETING[slug];
}

/** Drop the hero quote from the band under the photo so it is not shown twice. */
export function storiesBelowHero<T extends { quote: string }>(
  stories: readonly T[],
  heroQuote: string | null | undefined
): T[] {
  if (!heroQuote) return [...stories];
  return stories.filter((story) => story.quote !== heroQuote);
}

/** Factual stand-in for boards with no consented review. Omits a count when it is unknown. */
export function boardHeroProofFacts(
  offer: { liveQuestions: string | null; proPrice: string } | null | undefined
): string[] {
  const facts: string[] = [];
  const count = offer?.liveQuestions?.trim();
  if (count) facts.push(`${count} questions`);
  facts.push("Cited rationales");
  facts.push(`${TRIAL_DAYS}-day free trial, no card required`);
  return facts;
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
