import type { ExamSeoKey } from "@/lib/seo/exam-config";
import { COMPETITOR_PRICING } from "@/lib/seo/competitor-comparison";
import { COMPETITOR_PRICE_AS_OF } from "@/lib/marketing/legal-copy";
import {
  NAPLEX_TYPICAL_LIST_PRICE_AS_OF,
  NAPLEX_TYPICAL_LIST_PRICE_USD,
} from "@/lib/marketing/board-landing/naplex";

export type TypicalPrepQuote = {
  amountUsd: number;
  periodLabel: string;
  asOf: string;
};

/** Public list prices we checked — never names a vendor on the landing page. */
export function typicalPrepForExam(examKey: ExamSeoKey): TypicalPrepQuote {
  switch (examKey) {
    case "nclex":
      return {
        amountUsd: COMPETITOR_PRICING.uworldNclex30d,
        periodLabel: "30-day prep",
        asOf: COMPETITOR_PRICE_AS_OF,
      };
    case "usmle":
      return {
        amountUsd: COMPETITOR_PRICING.uworldStep2_30d,
        periodLabel: "30-day prep",
        asOf: COMPETITOR_PRICE_AS_OF,
      };
    case "naplex":
      return {
        amountUsd: NAPLEX_TYPICAL_LIST_PRICE_USD,
        periodLabel: "60-day prep",
        asOf: NAPLEX_TYPICAL_LIST_PRICE_AS_OF,
      };
    case "pance":
    case "aanp-fnp":
    case "npte-pt":
      return {
        amountUsd: COMPETITOR_PRICING.uworldStep2_30d,
        periodLabel: "30-day prep",
        asOf: COMPETITOR_PRICE_AS_OF,
      };
    default:
      return {
        amountUsd: COMPETITOR_PRICING.uworldNclex30d,
        periodLabel: "30-day prep",
        asOf: COMPETITOR_PRICE_AS_OF,
      };
  }
}
