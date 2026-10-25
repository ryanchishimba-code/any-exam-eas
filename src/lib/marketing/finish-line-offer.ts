import type { BillingInterval } from "@/lib/billing-config";
import { INTERVAL_MONTHS } from "@/lib/billing-config";

export const FINISH_LINE_TERMS_PATH = "/finish-line-refund-terms";

export const FINISH_LINE_MIN_PLAN_MONTHS = 4;

export const FINISH_LINE_HERO_LINE =
  "Do the work. If you don't pass, get your plan price back.";

/** Shown under the hero line on every badge (before the See terms link). */
export const FINISH_LINE_FINE_PRINT_BEFORE_TERMS =
  "On 4-month or longer plans. Meet every condition. Taxes and fees excluded.";

export const FINISH_LINE_FAQ_QUESTION = "Does this mean I'm guaranteed to pass?";

export const FINISH_LINE_FAQ_ANSWER =
  "No. No course can promise a passing result. If you meet every condition in our Finish Line Refund terms and still don't pass, we'll refund the net plan price you paid (taxes, payment fees, and add-ons excluded).";

const FORBIDDEN_OFFER_WORDS = [
  "guarantee",
  "guaranteed",
  "risk-free",
  "money-back",
] as const;

function parseEnvFlag(raw: string | undefined): boolean {
  const value = raw?.trim().toLowerCase() ?? "";
  if (value === "true" || value === "1") return true;
  if (value === "false" || value === "0" || value === "") return false;
  return false;
}

/** When false, offer UI and the terms route are hidden (default off until counsel review). */
export function isFinishLineOfferEnabled(): boolean {
  return parseEnvFlag(process.env.OFFER_FINISH_LINE_ENABLED);
}

export function isFinishLineEligibleInterval(interval: BillingInterval): boolean {
  return INTERVAL_MONTHS[interval] >= FINISH_LINE_MIN_PLAN_MONTHS;
}

/** Guardrail for marketing copy in tests and CI. */
export function assertFinishLineCopySafe(text: string): void {
  const lower = text.toLowerCase();
  for (const word of FORBIDDEN_OFFER_WORDS) {
    if (lower.includes(word)) {
      throw new Error(`Finish Line copy must not include "${word}"`);
    }
  }
}
