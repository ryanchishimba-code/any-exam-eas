import type { ExamSeoKey } from "@/lib/seo/exam-config";
import { COMPETITOR_PRICING } from "@/lib/seo/competitor-comparison";
import { formatPlanUsd } from "@/lib/billing-plans";
import { NAPLEX_TYPICAL_LIST_PRICE_USD } from "@/lib/marketing/board-landing/naplex";

/** Unnamed typical prep price band from public list prices in {@link COMPETITOR_PRICING}. */
export function typicalPrepRangeUsd(examKey: ExamSeoKey): { lowUsd: number; highUsd: number } {
  switch (examKey) {
    case "nclex":
      return {
        lowUsd: COMPETITOR_PRICING.archerNclexFrom,
        highUsd: COMPETITOR_PRICING.kaplanNclexSelfPaced180d,
      };
    case "naplex":
      return {
        lowUsd: COMPETITOR_PRICING.uworldNaplexQbank60d,
        highUsd: COMPETITOR_PRICING.rxprepNaplexCourse180d,
      };
    case "usmle":
      return {
        lowUsd: COMPETITOR_PRICING.uworldNclex30d,
        highUsd: COMPETITOR_PRICING.uworldStep2_30d,
      };
    case "pance":
    case "aanp-fnp":
    case "npte-pt":
      return {
        lowUsd: COMPETITOR_PRICING.archerNclexFrom,
        highUsd: COMPETITOR_PRICING.uworldStep2_30d,
      };
    default:
      return {
        lowUsd: COMPETITOR_PRICING.archerNclexFrom,
        highUsd: COMPETITOR_PRICING.uworldNclex30d,
      };
  }
}

export function formatTypicalPrepRangeLabel(examKey: ExamSeoKey): string {
  const { lowUsd, highUsd } = typicalPrepRangeUsd(examKey);
  if (lowUsd === highUsd) return formatPlanUsd(lowUsd);
  return `${formatPlanUsd(lowUsd)}–${formatPlanUsd(highUsd)}`;
}

export function naplexTypicalPrepRangeLabel(): string {
  const low = COMPETITOR_PRICING.uworldNaplexQbank60d;
  const high = NAPLEX_TYPICAL_LIST_PRICE_USD;
  if (low === high) return formatPlanUsd(low);
  return `${formatPlanUsd(low)}–${formatPlanUsd(high)}`;
}
