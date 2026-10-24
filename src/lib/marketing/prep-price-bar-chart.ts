import { formatPlanUsd } from "@/lib/billing-plans";
import { COMPETITOR_PRICE_AS_OF } from "@/lib/marketing/legal-copy";
import { typicalPrepForExam } from "@/lib/marketing/board-landing/typical-prep";
import { TIER_MONTHLY_USD } from "@/lib/subscription-tiers";
import { AEE_MONTHLY, COMPETITOR_PRICING, formatUsd } from "@/lib/seo/competitor-comparison";
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
  priceAsOf: string;
  bars: PrepPriceBar[];
  saveUsd: number | null;
  saveLabel: string | null;
  textAlternative: string;
};

function clampPct(value: number, min = 10, max = 100): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

export function buildPrepPriceBarChartData(examKey: ExamSeoKey): PrepPriceBarChartData {
  const proUsd = TIER_MONTHLY_USD.pro;
  const typical = typicalPrepForExam(examKey);
  const typicalUsd = typical.amountUsd;
  const priceMax = Math.max(proUsd, typicalUsd);
  const proPct = clampPct((proUsd / priceMax) * 100);
  const typicalPct = clampPct((typicalUsd / priceMax) * 100);
  const saveUsd = typicalUsd > proUsd ? typicalUsd - proUsd : null;

  const bars: PrepPriceBar[] = [
    {
      id: "ours",
      label: "AnyExamEasy",
      amountLabel: `${formatPlanUsd(proUsd)}/mo`,
      sublabel: "Six boards · one plan",
      fillPct: proPct,
      highlight: true,
    },
    {
      id: "typical",
      label: "Typical prep",
      amountLabel: formatPlanUsd(typicalUsd),
      sublabel: `${typical.periodLabel} · public list price`,
      fillPct: typicalPct,
      highlight: false,
    },
  ];

  const textAlternative = [
    `AnyExamEasy Pro is ${formatPlanUsd(proUsd)} per month.`,
    `Typical prep lists around ${formatPlanUsd(typicalUsd)} for ${typical.periodLabel} as of ${typical.asOf}.`,
    saveUsd ? `That is about ${formatUsd(saveUsd)} less than one typical prep period on Pro.` : null,
  ]
    .filter(Boolean)
    .join(" ");

  return {
    heading: "AnyExamEasy vs typical prep",
    lede: "",
    priceAsOf: typical.asOf,
    bars,
    saveUsd,
    saveLabel: saveUsd ? `Save ${formatUsd(saveUsd)}` : null,
    textAlternative,
  };
}

/** Homepage: monthly Pro vs typical 30-day NCLEX list price (unnamed). */
export function buildHomePrepPriceBarChartData(): PrepPriceBarChartData {
  const proUsd = AEE_MONTHLY;
  const typicalUsd = COMPETITOR_PRICING.uworldNclex30d;
  const priceMax = Math.max(proUsd, typicalUsd);
  const saveUsd = typicalUsd > proUsd ? typicalUsd - proUsd : null;

  const bars: PrepPriceBar[] = [
    {
      id: "ours",
      label: "AnyExamEasy",
      amountLabel: `${formatPlanUsd(proUsd)}/mo`,
      sublabel: "All six boards",
      fillPct: clampPct((proUsd / priceMax) * 100),
      highlight: true,
    },
    {
      id: "typical",
      label: "Typical prep",
      amountLabel: formatPlanUsd(typicalUsd),
      sublabel: `30-day prep · ${COMPETITOR_PRICE_AS_OF}`,
      fillPct: clampPct((typicalUsd / priceMax) * 100),
      highlight: false,
    },
  ];

  return {
    heading: "AnyExamEasy vs typical prep",
    lede: "",
    priceAsOf: COMPETITOR_PRICE_AS_OF,
    bars,
    saveUsd,
    saveLabel: saveUsd ? `Save ${formatUsd(saveUsd)}` : null,
    textAlternative: `AnyExamEasy is ${formatPlanUsd(proUsd)} per month. Typical 30-day prep lists around ${formatPlanUsd(typicalUsd)}.`,
  };
}
