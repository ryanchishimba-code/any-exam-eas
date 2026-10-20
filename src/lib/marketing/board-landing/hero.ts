import { TRIAL_DAYS } from "@/lib/billing-config";
import { formatPlanUsd } from "@/lib/billing-plans";
import {
  formatExactQuestionCount,
  scoredQuestionCount,
  type BoardQuestionUnits,
} from "@/lib/counts";
import type { BoardLandingModel } from "@/lib/marketing/board-landing/model";
import { typicalPrepForExam } from "@/lib/marketing/board-landing/typical-prep";
import type { ExamSeoKey } from "@/lib/seo/exam-config";
import { formatLandingHeroTrialLine, formatMonthlyPrice } from "@/lib/site";

export function boardHeroOffer(
  examKey: ExamSeoKey,
  units: BoardQuestionUnits | null,
  options?: { questionNoun?: string }
): NonNullable<BoardLandingModel["heroOffer"]> {
  const typical = typicalPrepForExam(examKey);
  const price = formatMonthlyPrice("pro");
  const noun = options?.questionNoun ?? "questions";
  return {
    liveQuestions: units ? formatExactQuestionCount(scoredQuestionCount(units)) : null,
    proPrice: `${price}/mo`,
    typicalPrice: formatPlanUsd(typical.amountUsd),
    typicalPeriod: typical.periodLabel,
    questionNoun: noun,
    trialLine: formatLandingHeroTrialLine(),
  };
}

export function boardHeroChips(
  offer: NonNullable<BoardLandingModel["heroOffer"]>,
  middle: string,
  third: string
): NonNullable<BoardLandingModel["heroChips"]> {
  const period = offer.typicalPeriod ?? "30-day prep";
  return [
    {
      id: "price",
      text: `${offer.proPrice} vs ${offer.typicalPrice} typical ${period} · ${TRIAL_DAYS}-day free trial`,
    },
    { id: "middle", text: middle },
    { id: "third", text: third },
  ];
}
