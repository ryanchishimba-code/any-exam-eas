import { REVIEW_MODULE_TOPICS } from "@/lib/edtech/seeds/review-module-topics";
import { getMemoryCardsByReviewModuleSlug } from "@/lib/library/seeds";
import type { MemoryCard } from "@/lib/library/types";
import type { ExamSlug } from "@/types/edtech";

/** Human-readable titles for review module slugs (links, rationales). */
export const REVIEW_MODULE_TITLES: Record<string, string> = Object.fromEntries(
  REVIEW_MODULE_TOPICS.map((t) => [t.slug, t.title])
);

export function getReviewModuleTitle(slug: string): string {
  return REVIEW_MODULE_TITLES[slug] ?? slug.replace(/-/g, " ");
}

export function getRelatedMemoryCards(
  examSlug: ExamSlug,
  reviewModuleSlug: string
): MemoryCard[] {
  return getMemoryCardsByReviewModuleSlug(examSlug, reviewModuleSlug);
}
