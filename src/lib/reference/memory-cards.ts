import { getUserExamPreference } from "@/lib/edtech/exam-preference";
import type { ExamSlug } from "@/types/edtech";
import { filterMemoryCards, getMemoryCardsForExam } from "./seeds";
import type { MemoryCard, MemoryCardKind } from "./types";

export type MemoryCardQuery = {
  query?: string;
  subject?: string;
  kind?: MemoryCardKind | "all";
};

/** Load memory cards for the user's exam (or override slug). */
export async function loadMemoryCards(
  userId: string,
  examSlug?: ExamSlug
): Promise<{ examSlug: ExamSlug; cards: MemoryCard[] }> {
  const pref = examSlug ? { examSlug } : await getUserExamPreference(userId);
  const slug = (examSlug ?? pref?.examSlug ?? "nclex") as ExamSlug;
  return { examSlug: slug, cards: getMemoryCardsForExam(slug) };
}

export function queryMemoryCards(cards: MemoryCard[], opts: MemoryCardQuery): MemoryCard[] {
  return filterMemoryCards(cards, opts);
}

/** Future: map weak-area topic keys → memory card ids for Stats integration. */
export const WEAK_AREA_MEMORY_CARD_MAP: Record<string, string[]> = {
  cardiology: ["naplex-hf-four-pillars", "usmle-stemi-path", "usmle-acs-spectrum"],
  cardiovascular: ["usmle-stemi-path", "usmle-acs-spectrum", "usmle-acs-antithrombotics"],
  "renal-electrolytes": ["usmle-hyperkalemia", "usmle-aki-fena", "all-anion-gap"],
  "endocrine-dm": ["usmle-dka-orders", "usmle-hhs-vs-dka"],
  "neurology-stroke": ["usmle-stroke-tpa", "usmle-tpa-exclusions"],
  pharmacology: ["naplex-reversal-chart", "naplex-hit-rule"],
  "critical-care": ["nclex-sepsis-bundle", "nclex-shock-types"],
  "federal-law": ["mpje-cii-rules", "mpje-schedules"],
};
