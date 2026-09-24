/**
 * Board-generic remediation links.
 *
 * Open items use the shared mastery machine in `item-mastery.ts`: a miss stays
 * open through one correct (pending re-proof) until a spaced re-ask or a
 * confirmed mark-mastered. Study-guide chapters exist for NCLEX, NAPLEX, and
 * AANP FNP. USMLE, PANCE, and NPTE-PT inherit the same loop and omit the guide
 * link when no chapter is mapped. Drug and card links appear only when a
 * catalog match exists.
 */

import { libraryTopicHref, MIXED_SUBJECT_ID } from "@/lib/edtech/practice-links-core";
import {
  drugSafetyPathHref,
  drugStudyHref,
  isSafetyPathDrug,
} from "@/lib/drugs300/safety-path";
import { getExamTopicStudyLinks, topicNameToSlug } from "@/lib/library/exam-topic-bridge";
import { CHAPTER_TOPICS_BY_EXAM } from "@/lib/nclex-study-guide/chapter-topics";
import {
  getStudyGuideConfig,
  type StudyGuideExam,
} from "@/lib/nclex-study-guide/guide-registry";
import {
  resolveNclexTopicSlugForBlueprint,
  resolveNclexTopicSlugForSubject,
} from "@/lib/exam-prep/nclex/topic-registry";
import { resolveNaplexTopicSlugForBlueprint } from "@/lib/exam-prep/naplex/topic-registry";
import { resolveTop500DrugId } from "@/lib/exam-prep/nclex/topic-drug-links";
import { extractTop500DrugsFromText } from "@/lib/exam-prep/nclex-study-meta";
import { TOP_500_DRUGS } from "@/lib/drugs300/catalog";
import {
  REMEDIATION_MASTERY_RULE,
  summarizeRemediationMastery,
  type MasteryMark,
} from "@/lib/learning/item-mastery";
import { formatConceptLabel, isInternalMasteryConceptKey } from "@/lib/learning/concept-labels";
import { ROUTES } from "@/lib/routes";
import type { ExamSlug } from "@/types/edtech";

export { REMEDIATION_MASTERY_RULE };

const NAVIGATIONAL_CHAPTERS = new Set(["front-matter", "back-matter"]);

const CHAPTER_TITLES: Record<string, string> = {
  "exam-strategy": "Exam Strategy",
  "fundamentals-safety": "Fundamentals & Safety",
  "management-of-care": "Management of Care",
  cardiac: "Cardiac",
  respiratory: "Respiratory",
  neuro: "Neuro",
  endocrine: "Endocrine",
  "renal-fluids": "Renal & Fluids",
  "gi-hepatic": "GI & Hepatic",
  "other-medsurg": "Other Med-Surg",
  "maternity-newborn": "Maternity & Newborn",
  pediatrics: "Pediatrics",
  psych: "Psych",
  pharmacology: "Pharmacology",
  "quick-reference": "Quick Reference",
  "foundational-knowledge": "Foundational Knowledge",
  calculations: "Calculations",
  "medication-use-process": "Medication Use Process",
  cardiology: "Cardiology",
  "infectious-disease": "Infectious Disease",
  "neuro-psych": "Neuro & Psych",
  "renal-hepatic": "Renal & Hepatic",
  "onc-heme": "Oncology & Heme",
  "otc-selfcare": "OTC & Self-Care",
  "special-populations": "Special Populations",
  "professional-practice-ops": "Professional Practice",
  "clinical-reasoning": "Clinical Reasoning",
  "health-promotion-screening": "Health Promotion & Screening",
  pulmonary: "Pulmonary",
  "renal-gu": "Renal & GU",
  "womens-health": "Women's Health",
  "pediatrics-lifespan": "Pediatrics & Lifespan",
  "psych-neuro": "Psych & Neuro",
  "msk-derm": "MSK & Derm",
  "ent-eyes-heme-id": "ENT, Eyes, Heme & ID",
  "pharmacology-prescribing": "Pharmacology & Prescribing",
};

/**
 * Bank subject ids that are not themselves guide chapters or high-yield slugs.
 * Only pairs that match the curated chapter maps — no fuzzy title matching.
 */
const SUBJECT_CHAPTER: Partial<Record<StudyGuideExam, Record<string, string>>> = {
  naplex: {
    pharmacokinetics: "foundational-knowledge",
    pharmacology: "foundational-knowledge",
    pharmaceutics: "foundational-knowledge",
    "compounding-calculations": "calculations",
    "cardiovascular-rx": "cardiology",
    "infectious-disease-rx": "infectious-disease",
    "endocrine-rx": "endocrine",
    "cns-rx": "neuro-psych",
    "oncology-rx": "onc-heme",
  },
  "aanp-fnp": {
    assess: "clinical-reasoning",
    diagnose: "clinical-reasoning",
    plan: "pharmacology-prescribing",
    evaluate: "pharmacology-prescribing",
    cardiovascular: "cardiology",
    pulmonary: "pulmonary",
    endocrine: "endocrine",
    gastrointestinal: "gi-hepatic",
    musculoskeletal: "msk-derm",
    neurology: "psych-neuro",
    "womens-health": "womens-health",
    pediatrics: "pediatrics-lifespan",
    geriatrics: "pediatrics-lifespan",
    "psychiatry-behavioral": "psych-neuro",
    "infectious-disease": "ent-eyes-heme-id",
    "dermatology-ent": "ent-eyes-heme-id",
  },
};

const topicToChapterCache = new Map<StudyGuideExam, Map<string, string>>();

function topicToChapter(exam: StudyGuideExam): Map<string, string> {
  const cached = topicToChapterCache.get(exam);
  if (cached) return cached;
  const map = new Map<string, string>();
  for (const [chapter, topics] of Object.entries(CHAPTER_TOPICS_BY_EXAM[exam] ?? {})) {
    if (NAVIGATIONAL_CHAPTERS.has(chapter)) continue;
    if (!map.has(chapter)) map.set(chapter, chapter);
    for (const topic of topics) {
      if (!map.has(topic)) map.set(topic, chapter);
    }
  }
  topicToChapterCache.set(exam, map);
  return map;
}

function chapterTitle(slug: string): string {
  return CHAPTER_TITLES[slug] ?? formatConceptLabel(slug);
}

export type StudyGuideSectionLink = {
  chapterSlug: string;
  title: string;
  href: string;
};

export type RelatedDrugLink = {
  id: string;
  label: string;
  href: string;
  kind: "drug" | "class";
  /** Safety path when this link is not already that path. One click from the miss. */
  safetyPathHref?: string;
};

export type RelatedCardsLink = {
  href: string;
  count: number;
  title: string;
};

function sectionLink(exam: StudyGuideExam, chapterSlug: string): StudyGuideSectionLink | null {
  if (NAVIGATIONAL_CHAPTERS.has(chapterSlug)) return null;
  const config = getStudyGuideConfig(exam);
  if (!config) return null;
  if (!(chapterSlug in (CHAPTER_TOPICS_BY_EXAM[exam] ?? {}))) return null;
  return {
    chapterSlug,
    title: chapterTitle(chapterSlug),
    href: `${config.routeBase}/${chapterSlug}`,
  };
}

function expandedTopicKeys(exam: StudyGuideExam, slug: string): string[] {
  const keys = [slug];
  if (exam === "nclex") {
    const fromSubject = resolveNclexTopicSlugForSubject(slug);
    const fromBlueprint = resolveNclexTopicSlugForBlueprint(slug);
    if (fromSubject) keys.push(fromSubject);
    if (fromBlueprint) keys.push(fromBlueprint);
  }
  if (exam === "naplex") {
    const fromBlueprint = resolveNaplexTopicSlugForBlueprint(slug);
    if (fromBlueprint) keys.push(fromBlueprint);
  }
  return keys;
}

/** Guide chapter for a topic, subject, or concept id. Null when this board has no matching chapter. */
export function resolveStudyGuideSection(
  examSlug: string,
  keys: Array<string | null | undefined>
): StudyGuideSectionLink | null {
  const config = getStudyGuideConfig(examSlug);
  if (!config) return null;
  const map = topicToChapter(config.exam);
  const aliases = SUBJECT_CHAPTER[config.exam] ?? {};

  for (const raw of keys) {
    if (!raw) continue;
    const slug = topicNameToSlug(raw);
    if (!slug || slug === "general" || slug === "mixed" || slug === MIXED_SUBJECT_ID) continue;
    if (isInternalMasteryConceptKey(slug)) continue;

    const alias = aliases[slug];
    if (alias) {
      const linked = sectionLink(config.exam, alias);
      if (linked) return linked;
    }

    for (const key of expandedTopicKeys(config.exam, slug)) {
      const chapter = map.get(key);
      if (!chapter) continue;
      const linked = sectionLink(config.exam, chapter);
      if (linked) return linked;
    }
  }
  return null;
}

const DRUGS_BY_LENGTH = [...TOP_500_DRUGS].sort((a, b) => b.generic.length - a.generic.length);

/** Match a catalog id, generic name, or "Generic (Brand)" label to a Top 500 drug. */
export function matchCatalogDrug(raw: string): { id: string; label: string } | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const fromSlug = resolveTop500DrugId(trimmed);
  if (fromSlug) {
    const drug = TOP_500_DRUGS.find((d) => d.id === fromSlug);
    if (drug) return { id: drug.id, label: drug.generic };
  }
  const lower = trimmed.toLowerCase();
  const byName = DRUGS_BY_LENGTH.find((d) => lower.startsWith(d.generic.toLowerCase()));
  if (byName) return { id: byName.id, label: byName.generic };
  const compact = lower.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const byId = DRUGS_BY_LENGTH.find((d) => compact === d.id || compact.startsWith(`${d.id}-`));
  if (byId) return { id: byId.id, label: byId.generic };
  return null;
}

function presentDrugLink(examSlug: ExamSlug, link: RelatedDrugLink): RelatedDrugLink {
  if (link.kind === "drug" && isSafetyPathDrug(examSlug, link.id)) {
    return { ...link, href: drugStudyHref(examSlug, link.id) };
  }
  return { ...link, safetyPathHref: drugSafetyPathHref(examSlug) };
}

function drugLinkFromTopic(examSlug: ExamSlug, topicKey: string): RelatedDrugLink | null {
  const links = getExamTopicStudyLinks(examSlug, topicKey);
  const drug = links.drugLinks?.[0];
  if (drug) return { id: drug.id, label: drug.label, href: drug.href, kind: "drug" };
  const drugClass = links.drugClassLinks?.[0];
  if (drugClass) {
    return { id: drugClass.classId, label: drugClass.label, href: drugClass.href, kind: "class" };
  }
  return null;
}

/** Specific drug when the catalog has one; otherwise the topic's drug class. */
export function resolveRelatedDrug(params: {
  examSlug: ExamSlug;
  topicKeys: Array<string | null | undefined>;
  explicit?: string[];
  text?: string;
}): RelatedDrugLink | null {
  for (const raw of params.explicit ?? []) {
    const hit = matchCatalogDrug(raw);
    if (hit) return presentDrugLink(params.examSlug, { ...hit, href: drugStudyHref(params.examSlug, hit.id), kind: "drug" });
  }

  const seen = new Set<string>();
  for (const raw of params.topicKeys) {
    if (!raw) continue;
    const slug = topicNameToSlug(raw);
    if (!slug || seen.has(slug)) continue;
    seen.add(slug);
    if (seen.size > 4) break;
    const linked = drugLinkFromTopic(params.examSlug, slug);
    if (linked) return presentDrugLink(params.examSlug, linked);
  }

  const text = params.text?.trim();
  if (text && text.length > 8) {
    const label = extractTop500DrugsFromText(text, 1)[0];
    if (label) {
      const hit = matchCatalogDrug(label);
      if (hit) {
        return presentDrugLink(params.examSlug, {
          ...hit,
          href: drugStudyHref(params.examSlug, hit.id),
          kind: "drug",
        });
      }
    }
  }
  return null;
}

export function resolveRelatedCards(
  examSlug: ExamSlug,
  topicKeys: Array<string | null | undefined>
): RelatedCardsLink | null {
  const seen = new Set<string>();
  for (const raw of topicKeys) {
    if (!raw) continue;
    const slug = topicNameToSlug(raw);
    if (!slug || seen.has(slug)) continue;
    seen.add(slug);
    if (seen.size > 4) break;
    const links = getExamTopicStudyLinks(examSlug, slug);
    if (links.memoryCardIds.length === 0) continue;
    const count = links.memoryCardIds.length;
    return {
      href: links.firstCardHref ?? libraryTopicHref(examSlug, links.topicKey),
      count,
      title: count === 1 ? "Related card" : `Related cards (${count})`,
    };
  }
  return null;
}

export function reviewIncorrectHref(
  fieldId: string,
  subjectId: string | null | undefined,
  count: number
): string {
  const subject =
    subjectId && subjectId !== MIXED_SUBJECT_ID ? subjectId : MIXED_SUBJECT_ID;
  const qs = new URLSearchParams({
    field: fieldId,
    mode: "bank",
    subjectId: subject,
    style: "review_incorrect",
    count: String(Math.max(1, Math.min(75, Math.round(count) || 1))),
    autostart: "1",
  });
  return `${ROUTES.questionBank}?${qs.toString()}`;
}

export type OpenLoopAttempt = {
  bankItemId?: string | null;
  questionKey?: string | null;
  correct: boolean;
  subjectId?: string | null;
  createdAt?: Date | string | number | null;
  sessionId?: string | null;
};

export type OpenRemediationLoop = {
  id: string;
  label: string;
  openCount: number;
  /** Open items in this topic that already have one correct and await spacing. */
  pendingCount: number;
  guide: { title: string; href: string } | null;
  drug: { label: string; href: string; kind: "drug" | "class"; safetyPathHref?: string } | null;
  cards: { title: string; href: string } | null;
  retestHref: string;
};

export type OpenRemediationSummary = {
  loops: OpenRemediationLoop[];
  /** Still-open items with no subject, so they cannot be tied to a guide or drug. */
  unscopedCount: number;
  /** Still missed plus pending re-proof. Same rule as Review incorrect. */
  totalOpen: number;
  /** Subset of totalOpen that already has one correct and is waiting on spacing. */
  pendingReproof: number;
  /** Additional open topics past the list cap. They stay in Review incorrect. */
  hiddenLoopCount: number;
};

/**
 * Open loops are subjects that still have missed or pending-reproof items.
 * Same mastery machine as Review incorrect.
 */
export function groupOpenRemediationLoops(params: {
  examSlug: ExamSlug;
  fieldId: string;
  attempts: OpenLoopAttempt[];
  marks?: MasteryMark[];
  now?: Date | string | number;
  limit?: number;
  /**
   * Servable review-queue ids. When set, the heading, the still-missed /
   * pending split, and the unscoped note all count this list — the same ids
   * Review incorrect launches.
   */
  openIds?: readonly string[];
}): OpenRemediationSummary {
  const mastery = summarizeRemediationMastery({
    attempts: params.attempts,
    marks: params.marks,
    now: params.now,
  });
  const allowed = params.openIds ? new Set(params.openIds) : null;
  const items = allowed ? mastery.items.filter((item) => allowed.has(item.itemId)) : mastery.items;

  const groups = new Map<string, { ids: Set<string>; pending: number }>();
  for (const item of items) {
    const subject = item.subjectId?.trim();
    if (!subject || subject === MIXED_SUBJECT_ID || isInternalMasteryConceptKey(subject)) continue;
    const group = groups.get(subject) ?? { ids: new Set<string>(), pending: 0 };
    group.ids.add(item.itemId);
    if (item.status === "pending_reproof") group.pending += 1;
    groups.set(subject, group);
  }

  const limit = Math.max(1, params.limit ?? 6);
  const ranked = [...groups.entries()]
    .map(([subjectId, group]) => {
      const guide = resolveStudyGuideSection(params.examSlug, [subjectId]);
      const drug = resolveRelatedDrug({
        examSlug: params.examSlug,
        topicKeys: [subjectId],
      });
      const cards = resolveRelatedCards(params.examSlug, [subjectId]);
      return {
        id: subjectId,
        label: formatConceptLabel(subjectId),
        openCount: group.ids.size,
        pendingCount: group.pending,
        guide: guide ? { title: guide.title, href: guide.href } : null,
        drug: drug
          ? {
              label: drug.label,
              href: drug.href,
              kind: drug.kind,
              safetyPathHref: drug.safetyPathHref,
            }
          : null,
        cards: cards ? { title: cards.title, href: cards.href } : null,
        retestHref: reviewIncorrectHref(params.fieldId, subjectId, Math.min(10, group.ids.size)),
      };
    })
    .sort((a, b) => b.openCount - a.openCount || a.label.localeCompare(b.label));

  const scoped = [...groups.values()].reduce((sum, group) => sum + group.ids.size, 0);
  const totalOpen = allowed ? params.openIds!.length : mastery.totalOpen;
  const pendingReproof = allowed
    ? items.filter((item) => item.status === "pending_reproof").length
    : mastery.pendingReproof;
  return {
    loops: ranked.slice(0, limit),
    unscopedCount: Math.max(0, totalOpen - scoped),
    totalOpen,
    pendingReproof,
    hiddenLoopCount: Math.max(0, ranked.length - limit),
  };
}
