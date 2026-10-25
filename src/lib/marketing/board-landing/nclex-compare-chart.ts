import {
  formatExactQuestionCount,
  publishedNgnItemCount,
  scoredQuestionCount,
  type BoardQuestionUnits,
} from "@/lib/counts";
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
  fillPct: number;
  highlight: boolean;
};

export type NclexCompareChartData = {
  heading: string;
  lede: string;
  bars: NclexCompareBar[];
  textAlternative: string;
  inventoryNote: string | null;
};

function clampPct(value: number, min = 8, max = 100): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

/** Live bank depth bars for NCLEX (#257) — prices use {@link buildPrepPriceBarChartData}. */
export function buildNclexCompareChartData(units: BoardQuestionUnits | null): NclexCompareChartData {
  const bars: NclexCompareBar[] = [];
  let inventoryNote: string | null = null;

  if (units && scoredQuestionCount(units) > 0) {
    const total = scoredQuestionCount(units);
    const ngn = publishedNgnItemCount(units);
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
        label: "Published NGN items",
        sublabel: "Scored case-study items plus standalone bow-tie and trend",
        amountLabel: formatExactQuestionCount(ngn),
        fillPct: ngn > 0 ? clampPct((ngn / NGN_VISUAL_TARGET) * 100) : 0,
        highlight: true,
      }
    );

    if (cases > 0) {
      bars.push({
        id: "live-cases",
        label: "NGN case studies",
        sublabel: "Published multi-step cases",
        amountLabel: formatExactQuestionCount(cases),
        fillPct: clampPct((cases / caseTarget) * 100),
        highlight: true,
      });
    }

    inventoryNote = `${formatExactQuestionCount(total)} live questions, ${formatExactQuestionCount(ngn)} published NGN items${
      cases > 0 ? `, ${formatExactQuestionCount(cases)} case studies` : ""
    }.`;
  }

  const textAlternative =
    inventoryNote ??
    "Live NCLEX question totals appear when the bank lookup succeeds. Bar lengths scale to internal serve targets for layout only.";

  return {
    heading: "Live NCLEX bank depth",
    lede: "",
    bars,
    textAlternative,
    inventoryNote,
  };
}
