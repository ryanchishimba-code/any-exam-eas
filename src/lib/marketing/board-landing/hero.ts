import { TRIAL_DAYS } from "@/lib/billing-config";
import {
  formatExactQuestionCount,
  scoredQuestionCount,
  type BoardQuestionUnits,
} from "@/lib/counts";
import type { BoardLandingModel } from "@/lib/marketing/board-landing/model";
import type { ExamSeoKey } from "@/lib/seo/exam-config";
import { boardLandingH1 } from "@/lib/marketing/board-landing/board-landing-copy";
import { formatLandingHeroTrialLine, formatMonthlyPrice, formatTrialLabel } from "@/lib/site";

/** SEO H1 plus factual subline (count when known — never a pass guarantee). */
export function boardLandingHeroHeadline(
  boardLabel: string,
  units: BoardQuestionUnits | null
): { h1Lead: string; h1Accent: string } {
  const price = formatMonthlyPrice("pro");
  const h1Lead = boardLandingH1(boardLabel);
  if (units && scoredQuestionCount(units) > 0) {
    const count = formatExactQuestionCount(scoredQuestionCount(units));
    return { h1Lead, h1Accent: `${count} questions · explained · ${price}/mo` };
  }
  return { h1Lead, h1Accent: `Explained rationales · ${price}/mo` };
}

export function boardLandingTrustPills(): string[] {
  return [formatTrialLabel(), "No payment method to start", "Cancel in Settings"];
}

export function boardHeroOffer(
  _examKey: ExamSeoKey,
  units: BoardQuestionUnits | null,
  options?: { questionNoun?: string }
): NonNullable<BoardLandingModel["heroOffer"]> {
  const price = formatMonthlyPrice("pro");
  const noun = options?.questionNoun ?? "questions";
  return {
    liveQuestions: units ? formatExactQuestionCount(scoredQuestionCount(units)) : null,
    proPrice: `${price}/mo`,
    questionNoun: noun,
    trialLine: formatLandingHeroTrialLine(),
  };
}

export function boardHeroChips(
  offer: NonNullable<BoardLandingModel["heroOffer"]>,
  middle: string,
  third: string
): NonNullable<BoardLandingModel["heroChips"]> {
  return [
    {
      id: "price",
      text: `${offer.proPrice} · ${TRIAL_DAYS}-day free trial`,
    },
    { id: "middle", text: middle },
    { id: "third", text: third },
  ];
}
