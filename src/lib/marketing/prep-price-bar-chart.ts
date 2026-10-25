import { TRIAL_DAYS } from "@/lib/billing-config";
import { formatPlanUsd } from "@/lib/billing-plans";
import { TIER_MONTHLY_USD } from "@/lib/subscription-tiers";
import type { ExamSeoKey } from "@/lib/seo/exam-config";

export type PrepPriceBar = {
  id: string;
  label: string;
  amountLabel: string;
  sublabel: string;
  fillPct: number;
  highlight: boolean;
};

export type PrepPriceBarChartData = {
  heading: string;
  lede: string;
  bars: PrepPriceBar[];
  textAlternative: string;
};

function buildProOnlyChart(ledeSuffix: string): PrepPriceBarChartData {
  const proUsd = TIER_MONTHLY_USD.pro;
  const amount = `${formatPlanUsd(proUsd)}/mo`;
  return {
    heading: "Simple pricing",
    lede: `${TRIAL_DAYS}-day free trial · no payment method to start · ${ledeSuffix}`,
    bars: [
      {
        id: "ours",
        label: "AnyExamEasy Pro",
        amountLabel: amount,
        sublabel: ledeSuffix,
        fillPct: 100,
        highlight: true,
      },
    ],
    textAlternative: `AnyExamEasy Pro is ${amount} for ${ledeSuffix.toLowerCase()}.`,
  };
}

export function buildPrepPriceBarChartData(examKey: ExamSeoKey): PrepPriceBarChartData {
  return buildProOnlyChart("Six boards · one plan");
}

/** Homepage: monthly Pro for all six boards. */
export function buildHomePrepPriceBarChartData(): PrepPriceBarChartData {
  return buildProOnlyChart("All six boards");
}
