import { formatLandingHeroTrialLine, formatMonthlyPrice } from "@/lib/site";

export type HomeHeroBand = {
  liveTotal: string | null;
  proPrice: string;
  trialLine: string;
};

export function buildHomeHeroBand(liveTotal: string | null): HomeHeroBand {
  const price = formatMonthlyPrice("pro");
  return {
    liveTotal: liveTotal?.trim() || null,
    proPrice: `${price}/mo`,
    trialLine: formatLandingHeroTrialLine(),
  };
}

/** One line under the H1 — uses the same live total label as metadata/JSON-LD. */
export function buildHomeHeroBenefitLine(liveTotal: string | null): string | null {
  const count = liveTotal?.trim();
  if (!count) return null;
  return `${count} board-style questions across six exams on one plan.`;
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
