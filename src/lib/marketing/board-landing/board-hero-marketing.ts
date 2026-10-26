import { TRIAL_DAYS } from "@/lib/billing-config";
import { formatPlanUsd } from "@/lib/billing-plans";
import type { BoardSlug } from "@/lib/marketing/board-landing/board-theme";
import { TIER_MONTHLY_USD } from "@/lib/subscription-tiers";

export const BOARD_LANDING_HERO_TRIAL_LABEL = "Start 5-day free trial";

function boardHeroPriceTrialSuffix(): string {
  return `${formatPlanUsd(TIER_MONTHLY_USD.pro)}/mo after a ${TRIAL_DAYS}-day free trial.`;
}

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
    headline: "NCLEX-RN practice with every answer explained.",
    subline: `NGN case studies, explained rationales, and timed mocks. ${boardHeroPriceTrialSuffix()}`,
    testimonial: {
      name: "Nathan C.",
      quote: "The best questions I've found for NCLEX prep.",
    },
  },
  naplex: {
    headline: "NAPLEX questions. Every answer explained.",
    subline: `Drug questions, calculations, and timed mocks. ${boardHeroPriceTrialSuffix()}`,
    testimonial: {
      name: "Frank C.",
      quote: "The drug cards were a game changer.",
    },
  },
  usmle: {
    headline: "USMLE practice with every answer explained.",
    subline: `Step-style vignettes, explained rationales, and timed mocks. ${boardHeroPriceTrialSuffix()}`,
    testimonial: null,
  },
  "aanp-fnp": {
    headline: "FNP practice with every vignette explained.",
    subline: `Lifespan vignettes, explained rationales, and mocks. ${boardHeroPriceTrialSuffix()}`,
    testimonial: {
      name: "Mag B.",
      quote: "I couldn't believe the price for everything I got.",
    },
  },
  pance: {
    headline: "PANCE practice with every vignette explained.",
    subline: `Organ-system vignettes, explained rationales, and mocks. ${boardHeroPriceTrialSuffix()}`,
    testimonial: {
      name: "Nick B.",
      quote:
        "With everything premium becoming expensive, it's a welcome sight to see premium material.",
    },
  },
  "npte-pt": {
    headline: "NPTE-PT practice written for physical therapists.",
    subline: `PT-specific scenarios, explained rationales, and a full mock. ${boardHeroPriceTrialSuffix()}`,
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
