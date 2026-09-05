/**
 * TopicNode spine — one canonical topic identity for bank filters + Study Hub.
 * Code-level only (no Prisma migration). Resolves subject / blueprint / mastery /
 * high-yield keys into a single practice filter.
 */
import { EXAM_CATALOG } from "@/lib/edtech/exams";
import {
  MIXED_SUBJECT_ID,
  practiceTopicHref,
  type TopicPracticeFilters,
  type TopicPracticeReturnContext,
} from "@/lib/edtech/practice-links-core";
import type { BlueprintCategory } from "@/lib/engine/blueprints";
import { resolveNclexTopicPracticeParams } from "@/lib/exam-prep/nclex/topic-practice";
import {
  resolveNclexTopicSlugForBlueprint,
  resolveNclexTopicSlugForSubject,
} from "@/lib/exam-prep/nclex/topic-registry";
import { resolveNaplexTopicPracticeParams } from "@/lib/exam-prep/naplex/topic-practice";
import { resolvePanceTopicPracticeParams } from "@/lib/exam-prep/pance/topic-practice";
import { resolveAanpFnpTopicPracticeParams } from "@/lib/exam-prep/aanp-fnp/topic-practice";
import { resolveNptePtTopicPracticeParams } from "@/lib/exam-prep/npte-pt/topic-practice";
import {
  resolveUsmleTopicPracticeParams,
} from "@/lib/exam-prep/usmle/topic-practice";
import {
  resolveUsmleTopicSlugForBlueprint,
  resolveUsmleTopicSlugForCategory,
  resolveUsmleTopicSlugForSubject,
} from "@/lib/exam-prep/usmle/topic-registry";
import { getHighYieldTopic } from "@/lib/edtech/seeds";
import { conceptKeyToSubjectSlug } from "@/lib/study/question-bank-weak-topics";
import { getSubjectsForFieldId } from "@/lib/subjects/registry";
import { isUsmleStep1Subject } from "@/lib/subjects/medicine/subject-splits";
import type { ExamSlug, HighYieldTopic } from "@/types/edtech";

export type TopicNodeKind =
  | "bank-subject"
  | "blueprint-category"
  | "blueprint-topic"
  | "high-yield"
  | "mastery-tag";

export type TopicNode = {
  /** Stable id: `${examSlug}:${kind}:${slug}` */
  id: string;
  examSlug: ExamSlug;
  fieldId: string;
  label: string;
  kind: TopicNodeKind;
  /** Bank pull subject(s) — first is primary for URL subjectId when not mixed. */
  subjectIds: string[];
  blueprintDomain?: string;
  blueprintTopics?: string[];
  highYieldSlug?: string;
  practiceTopicSlug?: string;
  blueprintWeightPct?: number;
  conceptKeys: string[];
  nclexPreset?: string;
  naplexTopic?: string;
  usmleTopic?: string;
  panceTopic?: string;
  aanpFnpTopic?: string;
  nptePtTopic?: string;
  /** When true, practice URL uses MIXED so multi-subject categories are not under-sampled. */
  useMixedSubject?: boolean;
};

function topicNodeId(examSlug: ExamSlug, kind: TopicNodeKind, slug: string): string {
  return `${examSlug}:${kind}:${slug}`;
}

function slugifyLabel(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/^(tag|subject):/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function resolvePracticeFieldId(
  examSlug: ExamSlug,
  topicSlug: string,
  fieldIdOverride?: string
): string {
  if (fieldIdOverride) return fieldIdOverride;
  const catalogField = EXAM_CATALOG[examSlug].fieldId;
  if (catalogField.startsWith("usmle") && isUsmleStep1Subject(topicSlug)) {
    return "usmle-step-1";
  }
  return catalogField;
}

function bankSubjectSet(fieldId: string): Set<string> {
  return new Set(getSubjectsForFieldId(fieldId).map((s) => s.id));
}

function isBankSubject(fieldId: string, subjectId: string): boolean {
  if (bankSubjectSet(fieldId).has(subjectId)) return true;
  if (fieldId.startsWith("usmle") && isUsmleStep1Subject(subjectId)) {
    return fieldId === "usmle-step-1";
  }
  return false;
}

/** Prefer HY registry slug when a weak / blueprint key maps to a Study Hub card. */
function resolveHighYieldSlug(
  examSlug: ExamSlug,
  slug: string,
  fieldId?: string
): string | undefined {
  if (examSlug === "nclex") {
    return (
      resolveNclexTopicSlugForBlueprint(slug) ??
      resolveNclexTopicSlugForSubject(slug) ??
      undefined
    );
  }
  if (examSlug === "usmle") {
    return (
      resolveUsmleTopicSlugForBlueprint(slug) ??
      (fieldId ? resolveUsmleTopicSlugForCategory(slug, fieldId) : undefined) ??
      resolveUsmleTopicSlugForSubject(slug, fieldId) ??
      undefined
    );
  }
  return undefined;
}

function applyHighYieldPracticeParams(
  examSlug: ExamSlug,
  card: HighYieldTopic,
  base: TopicNode
): TopicNode {
  if (examSlug === "nclex") {
    const params = resolveNclexTopicPracticeParams(card);
    return {
      ...base,
      kind: "high-yield",
      highYieldSlug: card.slug,
      practiceTopicSlug: card.practiceTopicSlug,
      subjectIds: [params.subjectId],
      blueprintTopics: params.blueprintTopics,
      nclexPreset: params.nclexPreset,
      useMixedSubject: params.subjectId === MIXED_SUBJECT_ID,
      conceptKeys: Array.from(
        new Set([
          ...base.conceptKeys,
          ...(params.subjectId !== MIXED_SUBJECT_ID
            ? [`subject:${params.subjectId}`]
            : []),
        ])
      ),
    };
  }
  if (examSlug === "naplex") {
    const params = resolveNaplexTopicPracticeParams(card);
    return {
      ...base,
      kind: "high-yield",
      highYieldSlug: card.slug,
      practiceTopicSlug: card.practiceTopicSlug,
      subjectIds: [params.subjectId],
      blueprintTopics: params.blueprintTopics,
      naplexTopic: params.topicSlug,
      conceptKeys: Array.from(
        new Set([...base.conceptKeys, `subject:${params.subjectId}`])
      ),
    };
  }
  if (examSlug === "usmle") {
    const params = resolveUsmleTopicPracticeParams(card);
    return {
      ...base,
      kind: "high-yield",
      highYieldSlug: card.slug,
      practiceTopicSlug: card.practiceTopicSlug,
      fieldId: params.fieldId,
      subjectIds: [params.subjectId],
      blueprintTopics: params.blueprintTopics,
      usmleTopic: params.topicSlug,
      conceptKeys: Array.from(
        new Set([...base.conceptKeys, `subject:${params.subjectId}`])
      ),
    };
  }
  if (examSlug === "pance") {
    const params = resolvePanceTopicPracticeParams(card);
    return {
      ...base,
      kind: "high-yield",
      highYieldSlug: card.slug,
      practiceTopicSlug: card.practiceTopicSlug,
      subjectIds: [params.subjectId],
      blueprintTopics: params.blueprintTopics,
      panceTopic: params.topicSlug,
      conceptKeys: Array.from(
        new Set([...base.conceptKeys, `subject:${params.subjectId}`])
      ),
    };
  }
  if (examSlug === "aanp-fnp") {
    const params = resolveAanpFnpTopicPracticeParams(card);
    return {
      ...base,
      kind: "high-yield",
      highYieldSlug: card.slug,
      practiceTopicSlug: card.practiceTopicSlug,
      subjectIds: [params.subjectId],
      blueprintTopics: params.blueprintTopics,
      aanpFnpTopic: params.topicSlug,
      conceptKeys: Array.from(
        new Set([...base.conceptKeys, `subject:${params.subjectId}`])
      ),
    };
  }
  if (examSlug === "npte-pt") {
    const params = resolveNptePtTopicPracticeParams(card);
    return {
      ...base,
      kind: "high-yield",
      highYieldSlug: card.slug,
      practiceTopicSlug: card.practiceTopicSlug,
      subjectIds: [params.subjectId],
      blueprintTopics: params.blueprintTopics,
      nptePtTopic: params.topicSlug,
      conceptKeys: Array.from(
        new Set([...base.conceptKeys, `subject:${params.subjectId}`])
      ),
    };
  }
  return {
    ...base,
    kind: "high-yield",
    highYieldSlug: card.slug,
    practiceTopicSlug: card.practiceTopicSlug,
    subjectIds: [card.practiceTopicSlug],
    conceptKeys: Array.from(
      new Set([...base.conceptKeys, `subject:${card.practiceTopicSlug}`])
    ),
  };
}

export function topicNodeFromHighYield(
  examSlug: ExamSlug,
  topic: HighYieldTopic,
  fieldIdOverride?: string
): TopicNode {
  const fieldId =
    fieldIdOverride ??
    resolvePracticeFieldId(examSlug, topic.practiceTopicSlug);
  const base: TopicNode = {
    id: topicNodeId(examSlug, "high-yield", topic.slug),
    examSlug,
    fieldId,
    label: topic.title,
    kind: "high-yield",
    subjectIds: [topic.practiceTopicSlug],
    practiceTopicSlug: topic.practiceTopicSlug,
    highYieldSlug: topic.slug,
    blueprintTopics: topic.blueprintTopicSlugs,
    conceptKeys: [`subject:${topic.practiceTopicSlug}`],
  };
  return applyHighYieldPracticeParams(examSlug, topic, base);
}

/**
 * Resolve a ConceptMastery key (subject:* | tag:*) into a TopicNode.
 * Prefers Study Hub high-yield practice filters when a card exists.
 */
export function topicNodeFromConceptKey(
  examSlug: ExamSlug,
  conceptKey: string,
  options?: { fieldId?: string; label?: string }
): TopicNode {
  const slug = conceptKeyToSubjectSlug(conceptKey);
  const isTag = conceptKey.startsWith("tag:");
  const fieldId = resolvePracticeFieldId(examSlug, slug, options?.fieldId);
  const hySlug = resolveHighYieldSlug(examSlug, slug, fieldId);
  const card = hySlug ? getHighYieldTopic(examSlug, hySlug) : getHighYieldTopic(examSlug, slug);

  if (card) {
    return applyHighYieldPracticeParams(examSlug, card, {
      id: topicNodeId(examSlug, "high-yield", card.slug),
      examSlug,
      fieldId,
      label: options?.label ?? card.title,
      kind: "high-yield",
      subjectIds: [card.practiceTopicSlug],
      practiceTopicSlug: card.practiceTopicSlug,
      highYieldSlug: card.slug,
      conceptKeys: [conceptKey],
    });
  }

  if (isTag) {
    // Unknown free-form tags: degrade to mixed so chips never 400.
    const nearest =
      isBankSubject(fieldId, slug) ? slug : undefined;
    return {
      id: topicNodeId(examSlug, "mastery-tag", slug),
      examSlug,
      fieldId,
      label: options?.label ?? slug.replace(/-/g, " "),
      kind: "mastery-tag",
      subjectIds: nearest ? [nearest] : [MIXED_SUBJECT_ID],
      useMixedSubject: !nearest,
      conceptKeys: [conceptKey],
    };
  }

  const subjectId = isBankSubject(fieldId, slug) ? slug : MIXED_SUBJECT_ID;
  return {
    id: topicNodeId(examSlug, "bank-subject", slug),
    examSlug,
    fieldId,
    label: options?.label ?? slug.replace(/-/g, " "),
    kind: subjectId === MIXED_SUBJECT_ID ? "mastery-tag" : "bank-subject",
    subjectIds: [subjectId],
    useMixedSubject: subjectId === MIXED_SUBJECT_ID,
    practiceTopicSlug: subjectId === MIXED_SUBJECT_ID ? undefined : subjectId,
    conceptKeys: [conceptKey.startsWith("subject:") ? conceptKey : `subject:${slug}`],
  };
}

/**
 * Blueprint readiness category → TopicNode.
 * Multi-subject categories use MIXED + blueprint topic filters so deep links
 * are not stuck on subjectIds[0] alone.
 */
export function topicNodeFromBlueprintCategory(
  examSlug: ExamSlug,
  category: BlueprintCategory,
  options?: { fieldId?: string }
): TopicNode {
  const subjectIds =
    category.subjectIds?.filter(Boolean).length
      ? [...(category.subjectIds as string[])]
      : [category.id];
  const primary =
    subjectIds.includes(category.id) ? category.id : subjectIds[0]!;
  const fieldId = resolvePracticeFieldId(examSlug, primary, options?.fieldId);
  const hyLabels = category.highYieldTopics ?? [];
  const hySlugs = hyLabels.map(slugifyLabel).filter(Boolean);

  // Prefer a Study Hub card for the first high-yield topic when resolvable.
  for (const raw of hyLabels) {
    const slug = slugifyLabel(raw);
    const hySlug = resolveHighYieldSlug(examSlug, slug, fieldId) ?? slug;
    const card = getHighYieldTopic(examSlug, hySlug);
    if (card) {
      const fromCard = topicNodeFromHighYield(examSlug, card, fieldId);
      // Domain bars represent the whole category — keep multi-subject sampling.
      if (subjectIds.length > 1) {
        return {
          ...fromCard,
          id: topicNodeId(examSlug, "blueprint-category", category.id),
          kind: "blueprint-category",
          label: category.label,
          subjectIds,
          blueprintDomain: category.id,
          blueprintWeightPct: Math.round(category.weight * 100),
          blueprintTopics: fromCard.blueprintTopics?.length
            ? fromCard.blueprintTopics
            : hySlugs.length
              ? hySlugs
              : fromCard.blueprintTopics,
          useMixedSubject: true,
          conceptKeys: subjectIds.map((id) => `subject:${id}`),
        };
      }
      return {
        ...fromCard,
        id: topicNodeId(examSlug, "blueprint-category", category.id),
        kind: "blueprint-category",
        label: category.label,
        subjectIds,
        blueprintDomain: category.id,
        blueprintWeightPct: Math.round(category.weight * 100),
        conceptKeys: subjectIds.map((id) => `subject:${id}`),
      };
    }
  }

  const multi = subjectIds.length > 1;
  return {
    id: topicNodeId(examSlug, "blueprint-category", category.id),
    examSlug,
    fieldId,
    label: category.label,
    kind: "blueprint-category",
    subjectIds,
    blueprintDomain: category.id,
    blueprintTopics: hySlugs.length ? hySlugs : undefined,
    blueprintWeightPct: Math.round(category.weight * 100),
    practiceTopicSlug: primary,
    useMixedSubject: multi,
    conceptKeys: subjectIds.map((id) => `subject:${id}`),
  };
}

export function topicNodeToPracticeFilter(node: TopicNode): {
  subjectId: string;
  filters: TopicPracticeFilters;
} {
  const subjectId = node.useMixedSubject
    ? MIXED_SUBJECT_ID
    : (node.subjectIds[0] ?? MIXED_SUBJECT_ID);

  const filters: TopicPracticeFilters = {
    fieldId: node.fieldId,
  };
  if (node.blueprintTopics?.length) {
    filters.blueprintTopics = node.blueprintTopics;
  }
  if (node.nclexPreset) filters.nclexPreset = node.nclexPreset;
  if (node.naplexTopic) filters.naplexTopic = node.naplexTopic;
  if (node.usmleTopic) filters.usmleTopic = node.usmleTopic;
  if (node.panceTopic) filters.panceTopic = node.panceTopic;
  if (node.aanpFnpTopic) filters.aanpFnpTopic = node.aanpFnpTopic;
  if (node.nptePtTopic) filters.nptePtTopic = node.nptePtTopic;

  return { subjectId, filters };
}

export function topicNodePracticeHref(
  node: TopicNode,
  count = 15,
  returnTo?: TopicPracticeReturnContext
): string {
  const { subjectId, filters } = topicNodeToPracticeFilter(node);
  return practiceTopicHref(node.examSlug, subjectId, count, returnTo, filters);
}
