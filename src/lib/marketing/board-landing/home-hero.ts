import { TRIAL_DAYS } from "@/lib/billing-config";
import { formatPlanUsd } from "@/lib/billing-plans";
import { COMPETITOR_PRICING } from "@/lib/seo/competitor-comparison";
import { formatMonthlyPrice } from "@/lib/site";
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
    trialLine: `${TRIAL_DAYS}-day free trial · no payment method to start`,
  };
}

export function buildHomeHeroChips(band: HomeHeroBand): { id: string; text: string }[] {
  return [
    {
      id: "price",
      text: `${band.proPrice} vs ${band.typicalPrice} typical ${band.typicalPeriod} · ${TRIAL_DAYS}-day free trial`,
    },
    {
      id: "boards",
      text: "Six boards—NCLEX, USMLE, NAPLEX, PANCE, AANP FNP, and NPTE-PT—on one plan.",
    },
    {
      id: "explained",
      text: "Every answer explained, with sources on bank items when stored.",
    },
  ];
}

/** Typical single-exam reference used in home FAQ only (not named on the page). */
export const HOME_TYPICAL_NCLEX_30D = formatPlanUsd(COMPETITOR_PRICING.uworldNclex30d);
