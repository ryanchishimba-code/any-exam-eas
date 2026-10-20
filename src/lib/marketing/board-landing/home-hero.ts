import { formatPlanUsd } from "@/lib/billing-plans";
import { COMPETITOR_PRICING } from "@/lib/seo/competitor-comparison";
import { formatLandingHeroTrialLine, formatMonthlyPrice } from "@/lib/site";
import { UWORLD_THREE_EXAM_MIN } from "@/lib/seo/competitor-comparison";

export type HomeHeroBand = {
  liveTotal: string | null;
  proPrice: string;
  typicalPrice: string;
  typicalPeriod: string;
  trialLine: string;
};

export function buildHomeHeroBand(liveTotal: string | null): HomeHeroBand {
  const price = formatMonthlyPrice("pro");
  const typical = formatPlanUsd(UWORLD_THREE_EXAM_MIN);
  return {
    liveTotal: liveTotal?.trim() || null,
    proPrice: `${price}/mo`,
    typicalPrice: typical,
    typicalPeriod: "three-exam prep bundle",
    trialLine: formatLandingHeroTrialLine(),
  };
}

export function buildHomeHeroChips(_band: HomeHeroBand): { id: string; text: string }[] {
  return [
    {
      id: "boards",
      text: "Six boards—NCLEX, USMLE, NAPLEX, PANCE, AANP FNP, and NPTE-PT—on one plan.",
    },
    {
      id: "explained",
      text: "Detailed rationales with sources on scored bank items.",
    },
    {
      id: "readiness",
      text: "Readiness score and Roadmap in your dashboard.",
    },
  ];
}

/** Typical single-exam reference used in home FAQ only (not named on the page). */
export const HOME_TYPICAL_NCLEX_30D = formatPlanUsd(COMPETITOR_PRICING.uworldNclex30d);
