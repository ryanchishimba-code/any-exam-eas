import {
  formatExactQuestionCount,
  scoredQuestionCount,
  type BoardQuestionUnits,
} from "@/lib/counts";
import { COMPETITOR_PRICE_AS_OF } from "@/lib/marketing/legal-copy";
import { formatTypicalPrepRangeLabel } from "@/lib/marketing/board-landing/typical-prep-range";
import { TIER_MONTHLY_USD } from "@/lib/subscription-tiers";
import { formatPlanUsd } from "@/lib/billing-plans";
import { COMPETITOR_PRICING } from "@/lib/seo/competitor-comparison";
import { NCLEX_NGN_SERVE_TARGETS, NCLEX_PUBLISHED_SERVE_TOTAL } from "@/lib/exam-prep/nclex/types";

const NGN_VISUAL_TARGET = Object.entries(NCLEX_NGN_SERVE_TARGETS).reduce((sum, [key, value]) => {
  if (key === "case_study") return sum;
  return sum + value;
}, 0);

export type NclexCompareBar = {
  id: string;
  label: string;
  sublabel: string;
  amountLabel: string;
  /** 0–100 width for the primary fill. */
  fillPct: number;
  /** Optional lighter range extension (typical prep high end). */
  rangePct?: number;
  highlight: boolean;
};

export type NclexCompareChartData = {
  heading: string;
  lede: string;
  priceAsOf: string;
  bars: NclexCompareBar[];
  /** Screen-reader / text alternative summary. */
  textAlternative: string;
  inventoryNote: string | null;
};

function clampPct(value: number, min = 8, max = 100): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

export function buildNclexCompareChartData(units: BoardQuestionUnits | null): NclexCompareChartData {
  const proUsd = TIER_MONTHLY_USD.pro;
  const typical30d = COMPETITOR_PRICING.uworldNclex30d;
  const typicalRange = formatTypicalPrepRangeLabel("nclex");
  const { lowUsd, highUsd } = {
    lowUsd: COMPETITOR_PRICING.archerNclexFrom,
    highUsd: COMPETITOR_PRICING.kaplanNclexSelfPaced180d,
  };
  const priceMax = Math.max(proUsd, typical30d, highUsd);
  const proPct = clampPct((proUsd / priceMax) * 100);
  const typical30Pct = clampPct((typical30d / priceMax) * 100);
  const typicalHighPct = clampPct((highUsd / priceMax) * 100);
  const typicalLowPct = clampPct((lowUsd / priceMax) * 100);

  const bars: NclexCompareBar[] = [
    {
      id: "pro-monthly",
      label: "AnyExamEasy Pro",
      sublabel: "Monthly — NCLEX plus five other boards",
      amountLabel: `${formatPlanUsd(proUsd)}/mo`,
      fillPct: proPct,
      highlight: true,
    },
    {
      id: "typical-30d",
      label: "Typical 30-day prep",
      sublabel: `Public list price we checked · ${COMPETITOR_PRICE_AS_OF}`,
      amountLabel: formatPlanUsd(typical30d),
      fillPct: typical30Pct,
      highlight: false,
    },
    {
      id: "typical-range",
      label: "Typical prep range",
      sublabel: "Unnamed vendors from public listings",
      amountLabel: typicalRange,
      fillPct: typicalLowPct,
      rangePct: Math.max(0, typicalHighPct - typicalLowPct),
      highlight: false,
    },
  ];

  let inventoryNote: string | null = null;
  if (units && scoredQuestionCount(units) > 0) {
    const total = scoredQuestionCount(units);
    const ngn = units.bankNgnStyle + units.standaloneNgn;
    const cases = units.caseStudies;
    const caseTarget = NCLEX_NGN_SERVE_TARGETS.case_study ?? 180;
    bars.push(
      {
        id: "live-questions",
        label: "Live NCLEX questions",
        sublabel: "Served from the current bank snapshot",
        amountLabel: formatExactQuestionCount(total),
        fillPct: clampPct((total / NCLEX_PUBLISHED_SERVE_TOTAL) * 100),
        highlight: true,
      },
      {
        id: "live-ngn",
        label: "NGN-style items",
        sublabel: "Standalone and case-linked NGN in the live bank",
        amountLabel: formatExactQuestionCount(ngn),
        fillPct: ngn > 0 ? clampPct((ngn / NGN_VISUAL_TARGET) * 100) : 0,
        highlight: true,
      }
    );
    if (cases > 0) {
      bars.push({
        id: "live-cases",
        label: "NGN case studies",
        sublabel: "Published multi-step cases in the bank",
        amountLabel: formatExactQuestionCount(cases),
        fillPct: clampPct((cases / caseTarget) * 100),
        highlight: true,
      });
    }
    inventoryNote = `${formatExactQuestionCount(total)} live questions, ${formatExactQuestionCount(ngn)} NGN-style items${
      cases > 0 ? `, ${formatExactQuestionCount(cases)} case studies` : ""
    }.`;
  }

  const textAlternative = [
    `AnyExamEasy Pro costs ${formatPlanUsd(proUsd)} per month.`,
    `Typical 30-day NCLEX prep lists around ${formatPlanUsd(typical30d)} as of ${COMPETITOR_PRICE_AS_OF}.`,
    `Typical prep from public listings ranges ${typicalRange}.`,
    inventoryNote,
  ]
    .filter(Boolean)
    .join(" ");

  return {
    heading: "Prep cost and live bank depth",
    lede: "Real Pro pricing and typical prep list prices — plus live counts when the bank lookup succeeds.",
    priceAsOf: COMPETITOR_PRICE_AS_OF,
    bars,
    textAlternative,
    inventoryNote,
  };
}
