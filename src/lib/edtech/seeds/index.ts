import type { ExamSlug, HighYieldTopic } from "@/types/edtech";
import { NCLEX_HIGH_YIELD_TOPICS } from "./high-yield-nclex";
import { NCLEX_EXTENDED_TOPICS } from "./high-yield-nclex-extended";
import { enrichNclexTopics } from "@/lib/exam-prep/nclex/topic-registry";
import { USMLE_HIGH_YIELD_TOPICS } from "./high-yield-usmle";
import { USMLE_2026_HIGH_YIELD_TOPICS } from "./high-yield-usmle-2026";
import { USMLE_STEP1_HIGH_YIELD_TOPICS } from "./high-yield-usmle-step1";
import { USMLE_STEP3_HIGH_YIELD_TOPICS } from "./high-yield-usmle-step3";
import { NAPLEX_HIGH_YIELD_TOPICS } from "./high-yield-naplex";
import { NAPLEX_EXTENDED_TOPICS } from "./high-yield-naplex-extended";
import { enrichNaplexTopics } from "@/lib/exam-prep/naplex/topic-registry";
import { PANCE_HIGH_YIELD_TOPICS } from "./high-yield-pance";
import { AANP_FNP_HIGH_YIELD_TOPICS } from "./high-yield-aanp-fnp";
import { NPTE_PT_HIGH_YIELD_TOPICS } from "./high-yield-npte-pt";
import { mergeReviewModules } from "./review-module-topics";
import { tagUsmleTopicSteps } from "@/lib/edtech/usmle-library-catalog";

const USMLE_ALL_TOPICS = [
  ...USMLE_HIGH_YIELD_TOPICS,
  ...USMLE_STEP1_HIGH_YIELD_TOPICS,
  ...USMLE_STEP3_HIGH_YIELD_TOPICS,
  ...USMLE_2026_HIGH_YIELD_TOPICS,
].map(tagUsmleTopicSteps);

export const HIGH_YIELD_BY_EXAM: Record<ExamSlug, HighYieldTopic[]> = {
  nclex: enrichNclexTopics(
    mergeReviewModules([...NCLEX_HIGH_YIELD_TOPICS, ...NCLEX_EXTENDED_TOPICS], "nclex")
  ),
  usmle: mergeReviewModules(USMLE_ALL_TOPICS, "usmle"),
  naplex: enrichNaplexTopics(
    mergeReviewModules([...NAPLEX_HIGH_YIELD_TOPICS, ...NAPLEX_EXTENDED_TOPICS], "naplex")
  ),
  pance: mergeReviewModules(PANCE_HIGH_YIELD_TOPICS, "pance"),
  "aanp-fnp": mergeReviewModules(AANP_FNP_HIGH_YIELD_TOPICS, "aanp-fnp"),
  "npte-pt": mergeReviewModules(NPTE_PT_HIGH_YIELD_TOPICS, "npte-pt"),
};

export function getHighYieldTopics(examSlug: ExamSlug): HighYieldTopic[] {
  return HIGH_YIELD_BY_EXAM[examSlug] ?? [];
}

export function getHighYieldTopic(examSlug: ExamSlug, topicSlug: string): HighYieldTopic | undefined {
  return getHighYieldTopics(examSlug).find((t) => t.slug === topicSlug);
}

export function getTopicCategories(examSlug: ExamSlug): string[] {
  const cats = new Set(getHighYieldTopics(examSlug).map((t) => t.category));
  return [...cats].sort();
}

export const ALL_HIGH_YIELD_TOPICS: HighYieldTopic[] = [
  ...HIGH_YIELD_BY_EXAM.nclex,
  ...HIGH_YIELD_BY_EXAM.usmle,
  ...HIGH_YIELD_BY_EXAM.naplex,
  ...HIGH_YIELD_BY_EXAM.pance,
  ...HIGH_YIELD_BY_EXAM["aanp-fnp"],
  ...HIGH_YIELD_BY_EXAM["npte-pt"],
];
