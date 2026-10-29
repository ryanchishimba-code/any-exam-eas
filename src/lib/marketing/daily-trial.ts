import { landingTrialHrefForExam } from "@/lib/landing/trial-href";
import { consentedSeedById } from "@/lib/testimonials/consented-seed";

/** One consented quote per board. USMLE and NPTE have none — the CTA omits the quote. */
const DAILY_TRIAL_QUOTE_ID: Record<string, string> = {
  nclex: "seed_testimonials_2026_09_27_nathan",
  naplex: "seed_testimonials_2026_10_24_frank_c",
  pance: "seed_testimonials_2026_10_24_nick_b",
  "aanp-fnp": "seed_testimonials_2026_10_24_mag_b",
};

export type DailyTrialQuote = {
  name: string;
  exam: string;
  quote: string;
};

export function dailyTrialQuote(examSlug: string): DailyTrialQuote | null {
  const id = DAILY_TRIAL_QUOTE_ID[examSlug];
  if (!id) return null;
  const row = consentedSeedById(id);
  if (!row) return null;
  return { name: row.name, exam: row.exam, quote: row.quote };
}

/** Signup prefilled with the board the visitor just practiced. */
export function dailyTrialHref(examSlug: string): string {
  const base = landingTrialHrefForExam(examSlug);
  const extra = new URLSearchParams({
    utm_source: "daily",
    utm_medium: "qotd",
    utm_campaign: "free_trial",
  });
  return `${base}&${extra.toString()}`;
}

export function isDailySignupArrival(utmSource: string | null | undefined): boolean {
  return utmSource === "daily";
}

export type DailyCtaPlacement = "sticky" | "below_question" | "after_answer";
export type DailyCtaLocation = "card" | "sticky" | "below_question";

/** The pitch after an answer is the card. The other two placements keep their names. */
export function dailyCtaLocation(placement: DailyCtaPlacement): DailyCtaLocation {
  if (placement === "after_answer") return "card";
  return placement;
}

export type DailySignupAttribution = {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  board?: string;
};

/** Row written only when the new account arrived from the daily question. */
export function signupFromDailyProperties(
  input: DailySignupAttribution
): {
  board: string;
  utm_source: string;
  utm_medium?: string;
  utm_campaign?: string;
} | null {
  if (input.utmSource !== "daily") return null;
  return {
    board: input.board?.trim() || "unset",
    utm_source: input.utmSource,
    ...(input.utmMedium ? { utm_medium: input.utmMedium } : {}),
    ...(input.utmCampaign ? { utm_campaign: input.utmCampaign } : {}),
  };
}
