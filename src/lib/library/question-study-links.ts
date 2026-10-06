import { deepDiveTopicHref } from "@/lib/edtech/practice-links-core";
import { getReviewModuleTitle } from "@/lib/edtech/topic-graph";
import { REVIEW_MODULE_TOPICS } from "@/lib/edtech/seeds/review-module-topics";
import {
  getAnatomyStructuresForMemoryCardIds,
  getAnatomyStructuresForStructureIds,
  getAnatomyStructuresForTopicSlug,
  mergeAnatomyStructureLinks,
  type AnatomyStructureLink,
} from "@/lib/anatomy/topic-links";
import { inferAnatomyStructuresFromText } from "@/lib/anatomy/structure-inference";
import { resolveStructureIdsForStudyItem } from "@/lib/exam-prep/anatomy-study-meta";
import type { StudyQuestion } from "@/lib/questions/types";
import type { ExamSlug } from "@/types/edtech";
import { getExamTopicStudyLinks, type ExamTopicStudyLinks } from "./exam-topic-bridge";
import {
  resolveRelatedCards,
  resolveRelatedDrug,
  resolveStudyGuideSection,
  type RelatedCardsLink,
  type RelatedDrugLink,
  type StudyGuideSectionLink,
} from "@/lib/learning/remediation-loop";
import { MEMORY_CARDS } from "./seeds";

export type { AnatomyStructureLink };

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
  /** Question stem + rationale text for topic search. */
  stem?: string;
  /** Clinical stem only. Anatomy links ignore the rationale so headings cannot match a bone. */
  anatomyText?: string;
  ngnPayload?: Record<string, unknown> | null;
};

export type LabeledMemoryCard = {
  id: string;
  title: string;
};

export type ResolvedQuestionStudyLinks = {
  primaryDeepDive?: RelatedDeepDive;
  relatedDeepDives: RelatedDeepDive[];
  memoryCardIds: string[];
  /** Cards with a real title that matches the stem. Unlabeled chips stay hidden. */
  memoryCards: LabeledMemoryCard[];
  anatomyStructures: AnatomyStructureLink[];
  keyTakeaway?: string;
  topicLinks: ExamTopicStudyLinks;
  /** Study-guide chapter when this board ships one for the topic. */
  studyGuide?: StudyGuideSectionLink;
  /** Catalog drug or drug class tied to the miss. */
  relatedDrug?: RelatedDrugLink;
  relatedCards?: RelatedCardsLink;
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

  const cardStructureIds = memoryCardIds.flatMap((id) => {
    const card = MEMORY_CARDS.find((c) => c.id === id);
    return card?.structureIds ?? [];
  });

  const payloadStructureIds = Array.isArray(ctx.ngnPayload?.structureIds)
    ? ctx.ngnPayload!.structureIds.map(String)
    : [];

  const inferredStructureIds =
    payloadStructureIds.length >= 3
      ? payloadStructureIds
      : resolveStructureIdsForStudyItem({
          reviewModuleSlug: meta.reviewModuleSlug,
          subjectId: ctx.subjectId,
          topicCategory: ctx.topicCategory,
          blueprintSystem:
            typeof ctx.ngnPayload?.blueprintSystem === "string"
              ? ctx.ngnPayload.blueprintSystem
              : undefined,
          blueprintTopic:
            typeof ctx.ngnPayload?.blueprintTopic === "string"
              ? ctx.ngnPayload.blueprintTopic
              : undefined,
          memoryCardIds: meta.memoryCardIds,
          text: ctx.stem,
        });

  const explicitStructureIds = [...payloadStructureIds, ...inferredStructureIds, ...cardStructureIds];

  const fromCards = getAnatomyStructuresForMemoryCardIds(memoryCardIds, {
    structureIds: explicitStructureIds,
  });
  const fromTopic =
    topicLinks.anatomyStructures.length > 0
      ? topicLinks.anatomyStructures
      : getAnatomyStructuresForTopicSlug(topicLinks.topicKey, {
          memoryCardIds,
          structureIds: explicitStructureIds,
        });
  const anatomySource = (ctx.anatomyText ?? ctx.stem)?.trim() ?? "";
  const fromText = anatomySource
    ? inferAnatomyStructuresFromText(anatomySource, { limit: 3 })
    : [];
  const fromResolved = getAnatomyStructuresForStructureIds(inferredStructureIds, 3);

  const mergedAnatomy = mergeAnatomyStructureLinks(
    fromCards,
    fromTopic,
    fromResolved,
    fromText
  ).filter((link) => {
    if (link.system !== "skeletal") return true;
    return structureNameInText(link.name, anatomySource);
  });
  const scene = (ctx.anatomyText ?? ctx.stem ?? "").trim();
  const anatomyStructures = (scene ? confidentAnatomy(mergedAnatomy, fromText, scene) : mergedAnatomy)
    .filter((link) => link.system !== "skeletal" || structureNameInText(link.name, scene))
    .slice(0, 3);

  const explicitDrugs = Array.isArray(ctx.ngnPayload?.top500Drugs)
    ? ctx.ngnPayload.top500Drugs.map(String)
    : undefined;
  let studyGuide = resolveStudyGuideSection(examSlug, candidates) ?? undefined;
  let relatedDrug =
    resolveRelatedDrug({
      examSlug,
      topicKeys: candidates,
      explicit: explicitDrugs,
      text: explicitDrugs?.length ? undefined : ctx.stem,
    }) ?? undefined;
  const relatedCards = resolveRelatedCards(examSlug, candidates) ?? undefined;
  let deepDives = relatedDeepDives;
  let primary = primaryDeepDive;
  if (scene) {
    deepDives = relatedDeepDives.filter(
      (dive) => titleMatchesText(dive.title, scene) || titleMatchesText(dive.slug.replace(/-/g, " "), scene)
    );
    primary = deepDives[0];
    if (studyGuide && !guideMatchesQuestion(studyGuide.title, scene)) studyGuide = undefined;
    if (relatedDrug && !titleMatchesText(relatedDrug.label, scene)) relatedDrug = undefined;
  }
  const memoryCards = labeledMemoryCards(memoryCardIds, scene);

  return {
    primaryDeepDive: primary,
    relatedDeepDives: deepDives,
    memoryCardIds,
    memoryCards,
    anatomyStructures,
    keyTakeaway: meta.keyTakeaway,
    topicLinks,
    studyGuide,
    relatedDrug,
    relatedCards,
  };
}

const LINK_STOP = new Set([
  "nursing",
  "therapy",
  "pharmacotherapy",
  "guide",
  "study",
  "clinical",
  "practice",
  "health",
  "patient",
  "management",
  "foundational",
  "knowledge",
  "general",
]);

function structureNameInText(name: string, text: string): boolean {
  const trimmed = name.trim();
  if (trimmed.length < 4 || !text.trim()) return false;
  const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`\\b${escaped}\\b`, "i").test(text);
}

function titleTokens(title: string): string[] {
  return title
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 4 && !LINK_STOP.has(token));
}

function titleMatchesText(title: string, text: string): boolean {
  const scene = text.toLowerCase();
  return titleTokens(title).some((token) => scene.includes(token));
}

function statedAgeYears(text: string): number | null {
  const match = text.match(/\b(\d{1,3})\s*-?\s*(?:year|yr)s?\s*-?\s*old\b/i);
  if (!match) return null;
  const age = Number(match[1]);
  return Number.isFinite(age) ? age : null;
}

/** A guide chapter is shown only when its title is in the stem. Beers requires age 65 or older. */
export function guideMatchesQuestion(title: string, text: string): boolean {
  if (/beer|geriatric|older adult/i.test(title)) {
    const age = statedAgeYears(text);
    return age != null && age >= 65;
  }
  return titleMatchesText(title, text);
}

function confidentAnatomy(
  links: AnatomyStructureLink[],
  fromText: AnatomyStructureLink[],
  source: string
): AnatomyStructureLink[] {
  const text = source.toLowerCase();
  const byId = new Map<string, AnatomyStructureLink>();
  for (const link of fromText) byId.set(link.id, link);
  for (const link of links) {
    if (byId.has(link.id)) continue;
    if (structureNameInText(link.name, text)) byId.set(link.id, link);
  }
  return [...byId.values()];
}

function labeledMemoryCards(ids: string[], stem: string): LabeledMemoryCard[] {
  const out: LabeledMemoryCard[] = [];
  for (const id of ids) {
    const card = MEMORY_CARDS.find((entry) => entry.id === id);
    const title = card?.title?.trim();
    if (!title || /^memory card$/i.test(title)) continue;
    if (stem && !titleMatchesText(title, stem)) continue;
    out.push({ id, title });
    if (out.length >= 4) break;
  }
  return out;
}

export function resolveStudyLinksFromQuestion(
  examSlug: ExamSlug,
  question: StudyQuestion
): ResolvedQuestionStudyLinks {
  const anatomyText = [question.vignette, question.stem].filter(Boolean).join("\n");
  const stem = [anatomyText, question.explanation].filter(Boolean).join("\n");
  return resolveQuestionStudyLinks(examSlug, {
    subjectId: question.subjectId,
    tags: question.tags,
    topicCategory: question.topicCategory,
    ngnPayload: question.ngnPayload as Record<string, unknown> | null | undefined,
    stem,
    anatomyText,
  });
}
