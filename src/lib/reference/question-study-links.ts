import { deepDiveTopicHref } from "@/lib/edtech/practice-links";
import { getReviewModuleTitle } from "@/lib/edtech/topic-graph";
import { REVIEW_MODULE_TOPICS } from "@/lib/edtech/seeds/review-module-topics";
import type { StudyQuestion } from "@/lib/questions/types";
import type { ExamSlug } from "@/types/edtech";
import { getExamTopicStudyLinks, type ExamTopicStudyLinks } from "./exam-topic-bridge";

export type RelatedDeepDive = {
  slug: string;
  title: string;
  href: string;
};

export type QuestionStudyContext = {
  reviewModuleSlug?: string;
  subjectId?: string;
  tags?: string[];
  topicCategory?: string;
  ngnPayload?: Record<string, unknown> | null;
};

export type ResolvedQuestionStudyLinks = {
  primaryDeepDive?: RelatedDeepDive;
  relatedDeepDives: RelatedDeepDive[];
  memoryCardIds: string[];
  keyTakeaway?: string;
  topicLinks: ExamTopicStudyLinks;
};

function readPayloadMeta(ctx: QuestionStudyContext): {
  reviewModuleSlug?: string;
  memoryCardIds?: string[];
  keyTakeaway?: string;
} {
  const payload = ctx.ngnPayload;
  if (!payload) {
    return { reviewModuleSlug: ctx.reviewModuleSlug };
  }
  const reviewModuleSlug =
    typeof payload.reviewModuleSlug === "string"
      ? payload.reviewModuleSlug
      : typeof payload.reviewModuleTopic === "string"
        ? payload.reviewModuleTopic
        : ctx.reviewModuleSlug;
  const memoryCardIds = Array.isArray(payload.memoryCardIds)
    ? payload.memoryCardIds.map(String)
    : undefined;
  const keyTakeaway =
    typeof payload.keyTakeaway === "string" ? payload.keyTakeaway : undefined;
  return { reviewModuleSlug, memoryCardIds, keyTakeaway };
}

function topicCandidates(ctx: QuestionStudyContext, reviewModuleSlug?: string): string[] {
  const raw = [
    reviewModuleSlug,
    ctx.subjectId,
    ctx.topicCategory,
    ...(ctx.tags ?? []),
  ].filter(Boolean) as string[];
  return [...new Set(raw)];
}

function findReviewModuleSlug(examSlug: ExamSlug, topic: string): string | undefined {
  const mod = REVIEW_MODULE_TOPICS.find(
    (m) =>
      m.examSlug === examSlug &&
      (m.slug === topic || m.practiceTopicSlug === topic)
  );
  return mod?.slug;
}

function buildDeepDive(examSlug: ExamSlug, slug: string): RelatedDeepDive {
  return {
    slug,
    title: getReviewModuleTitle(slug),
    href: deepDiveTopicHref(examSlug, slug),
  };
}

/** Resolve deep dives, memory cards, and topic links for a question or exam review item. */
export function resolveQuestionStudyLinks(
  examSlug: ExamSlug,
  ctx: QuestionStudyContext
): ResolvedQuestionStudyLinks {
  const meta = readPayloadMeta(ctx);
  const candidates = topicCandidates(ctx, meta.reviewModuleSlug);
  const primaryTopic = candidates[0] ?? "general";
  const topicLinks = getExamTopicStudyLinks(examSlug, primaryTopic);

  const seen = new Set<string>();
  const relatedDeepDives: RelatedDeepDive[] = [];

  for (const topic of candidates) {
    const slug = findReviewModuleSlug(examSlug, topic);
    if (!slug || seen.has(slug)) continue;
    seen.add(slug);
    relatedDeepDives.push(buildDeepDive(examSlug, slug));
  }

  if (meta.reviewModuleSlug && !seen.has(meta.reviewModuleSlug)) {
    const slug = meta.reviewModuleSlug;
    if (REVIEW_MODULE_TOPICS.some((m) => m.examSlug === examSlug && m.slug === slug)) {
      relatedDeepDives.unshift(buildDeepDive(examSlug, slug));
    }
  }

  const primaryDeepDive = relatedDeepDives[0];
  const memoryCardIds =
    meta.memoryCardIds?.length ? meta.memoryCardIds : topicLinks.memoryCardIds;

  return {
    primaryDeepDive,
    relatedDeepDives,
    memoryCardIds,
    keyTakeaway: meta.keyTakeaway,
    topicLinks,
  };
}

export function resolveStudyLinksFromQuestion(
  examSlug: ExamSlug,
  question: StudyQuestion
): ResolvedQuestionStudyLinks {
  return resolveQuestionStudyLinks(examSlug, {
    subjectId: question.subjectId,
    tags: question.tags,
    ngnPayload: question.ngnPayload as Record<string, unknown> | null | undefined,
  });
}
