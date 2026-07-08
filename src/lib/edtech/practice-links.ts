import { ROUTES, fullExamHref } from "@/lib/routes";
import { EXAM_CATALOG, isExamSlug } from "@/lib/edtech/exams";
import { fullExamLaunchHref } from "@/lib/full-exam/config";
import { resolveNclexTopicPracticeParams } from "@/lib/exam-prep/nclex/topic-practice";
import { resolveNaplexTopicPracticeParams } from "@/lib/exam-prep/naplex/topic-practice";
import { isUsmleStep1Subject } from "@/lib/subjects/medicine/subject-splits";
import type { ExamSlug, HighYieldTopic } from "@/types/edtech";
import type { FullExamLengthPreset } from "@/types/full-exam";

/** Sentinel subjectId the question-bank API treats as a mixed-topic session. */
export const MIXED_SUBJECT_ID = "__mixed__";

/**
 * Resolve the bank fieldId that actually holds a topic. USMLE basic-science
 * subjects (anatomy, physiology, …) live under Step 1, not the catalog default
 * (Step 2 CK), so without this they would 404 the question-bank API.
 */
function topicFieldId(examSlug: ExamSlug, topicSlug: string): string {
  const fieldId = EXAM_CATALOG[examSlug].fieldId;
  if (fieldId.startsWith("usmle") && isUsmleStep1Subject(topicSlug)) {
    return "usmle-step-1";
  }
  return fieldId;
}

/** Context for returning to a high-yield review module after practice. */
export type TopicPracticeReturnContext = {
  /** High-yield topic slug (panel deep link), not question-bank subjectId. */
  topicSlug: string;
  topicTitle: string;
  deepDive?: boolean;
};

export type TopicPracticeFilters = {
  blueprintTopics?: string[];
  nclexPreset?: string;
  naplexTopic?: string;
};

/** Question bank practice filtered to a high-yield topic slug. */
export function practiceTopicHref(
  examSlug: ExamSlug,
  topicSlug: string,
  count = 10,
  returnTo?: TopicPracticeReturnContext,
  filters?: TopicPracticeFilters
): string {
  const isMixed = topicSlug === "mixed" || topicSlug === MIXED_SUBJECT_ID;
  const subjectId = isMixed ? MIXED_SUBJECT_ID : topicSlug;
  const fieldId = isMixed
    ? EXAM_CATALOG[examSlug].fieldId
    : topicFieldId(examSlug, topicSlug);
  const qs = new URLSearchParams({
    field: fieldId,
    mode: "bank",
    subjectId,
    count: String(count),
  });
  if (filters?.blueprintTopics?.length) {
    qs.set("blueprintTopics", filters.blueprintTopics.join(","));
  }
  if (filters?.nclexPreset) {
    qs.set("nclexPreset", filters.nclexPreset);
  }
  if (filters?.naplexTopic) {
    qs.set("naplexTopic", filters.naplexTopic);
  }
  if (returnTo) {
    qs.set("returnExam", examSlug);
    qs.set("returnTopic", returnTo.topicSlug);
    qs.set("returnTitle", returnTo.topicTitle);
    if (returnTo.deepDive) qs.set("returnMode", "deep");
  }
  return `${ROUTES.questionBank}?${qs.toString()}`;
}

/** Practice href aligned to a Study Hub card (NCLEX uses blueprint topic filters). */
export function highYieldTopicPracticeHref(
  examSlug: ExamSlug,
  topic: HighYieldTopic,
  count = 10,
  returnTo?: TopicPracticeReturnContext
): string {
  if (examSlug === "nclex") {
    const params = resolveNclexTopicPracticeParams(topic);
    return practiceTopicHref(
      examSlug,
      params.subjectId,
      count,
      returnTo ?? { topicSlug: topic.slug, topicTitle: topic.title },
      {
        blueprintTopics: params.blueprintTopics,
        nclexPreset: params.nclexPreset,
      }
    );
  }

  if (examSlug === "naplex") {
    const params = resolveNaplexTopicPracticeParams(topic);
    return practiceTopicHref(
      examSlug,
      params.subjectId,
      count,
      returnTo ?? { topicSlug: topic.slug, topicTitle: topic.title },
      {
        blueprintTopics: params.blueprintTopics,
        naplexTopic: params.topicSlug,
      }
    );
  }

  return practiceTopicHref(
    examSlug,
    topic.practiceTopicSlug,
    count,
    returnTo ?? { topicSlug: topic.slug, topicTitle: topic.title }
  );
}

/** Parse return-to-module link from question bank URL params. */
export function parseTopicPracticeReturn(
  params: Pick<URLSearchParams, "get">
): { href: string; label: string } | null {
  const returnExam = params.get("returnExam");
  const returnTopic = params.get("returnTopic");
  const returnTitle = params.get("returnTitle");
  if (!returnExam || !returnTopic || !isExamSlug(returnExam)) return null;
  return {
    href: highYieldTopicHref(returnExam, returnTopic, {
      deepDive: params.get("returnMode") === "deep",
    }),
    label: returnTitle?.trim() || "Review module",
  };
}

export function questionBankHref(examSlug?: ExamSlug): string {
  if (!examSlug) return ROUTES.questionBank;
  const fieldId = EXAM_CATALOG[examSlug].fieldId;
  return `${ROUTES.questionBank}?field=${encodeURIComponent(fieldId)}`;
}

export function simulatedExamHref(
  examSlug: ExamSlug,
  opts?: { mode?: FullExamLengthPreset; autostart?: boolean }
): string {
  if (opts?.mode || opts?.autostart) {
    return fullExamLaunchHref(examSlug, opts);
  }
  return fullExamHref(examSlug);
}

export function analyticsHref(): string {
  return ROUTES.analytics;
}

/** Adaptive session prioritizing spaced-review due items and weak areas. */
export function spacedReviewHref(examSlug: ExamSlug, count = 20): string {
  const fieldId = EXAM_CATALOG[examSlug].fieldId;
  const qs = new URLSearchParams({
    field: fieldId,
    mode: "bank",
    style: "adaptive",
    count: String(count),
  });
  return `${ROUTES.questionBank}?${qs.toString()}`;
}

export function top500Href(examSlug: ExamSlug): string {
  return `${ROUTES.drugs300}?exam=${examSlug}`;
}

export function highYieldTopicsHref(_examSlug?: ExamSlug): string {
  return ROUTES.highYieldTopics;
}

/** Deep link to a specific review module or topic slide-over (scoped to active exam on load). */
export function highYieldTopicHref(
  _examSlug: ExamSlug,
  topicSlug: string,
  opts?: { deepDive?: boolean }
): string {
  const qs = new URLSearchParams({ topic: topicSlug });
  if (opts?.deepDive) qs.set("mode", "deep");
  return `${ROUTES.highYieldTopics}?${qs.toString()}`;
}

export function deepDiveTopicHref(examSlug: ExamSlug, topicSlug: string): string {
  return highYieldTopicHref(examSlug, topicSlug, { deepDive: true });
}

export function libraryHref(examSlug?: ExamSlug): string {
  if (!examSlug) return ROUTES.library;
  return `${ROUTES.library}?exam=${encodeURIComponent(examSlug)}`;
}

/** Future Stats integration: link to reference filtered by memory card id. */
export function libraryCardHref(examSlug: ExamSlug, cardId: string): string {
  const qs = new URLSearchParams({ exam: examSlug, card: cardId });
  return `${ROUTES.library}?${qs.toString()}`;
}

/** Link to reference hub with weak-area / topic recommendations highlighted. */
export function libraryTopicHref(examSlug: ExamSlug, topicKey: string): string {
  const qs = new URLSearchParams({ exam: examSlug, topic: topicKey });
  return `${ROUTES.library}?${qs.toString()}`;
}

/** Deep link to anatomy explorer with optional structure pre-selection. */
export function anatomyHref(examSlug?: ExamSlug, structureId?: string, procedureId?: string): string {
  const qs = new URLSearchParams();
  if (examSlug) qs.set("exam", examSlug);
  if (structureId) qs.set("structure", structureId);
  if (procedureId) qs.set("procedure", procedureId);
  const q = qs.toString();
  return q ? `${ROUTES.anatomy}?${q}` : ROUTES.anatomy;
}

/** Deep link highlighting a specific procedure on its primary structure. */
export function anatomyProcedureHref(
  procedureId: string,
  examSlug?: ExamSlug
): string {
  return anatomyHref(examSlug, undefined, procedureId);
}

/** Practice questions filtered to gross anatomy subject. */
export function anatomyPracticeHref(examSlug: ExamSlug, count = 10): string {
  return practiceTopicHref(examSlug, "anatomy", count);
}

type StructurePracticeInput = {
  id: string;
  name: string;
  practiceTopicSlug: string;
};

/** Bank practice on a structure's topic with return-to-anatomy after the session. */
export function structurePracticeHref(
  examSlug: ExamSlug,
  structure: StructurePracticeInput,
  count = 10
): string {
  const fieldId = topicFieldId(examSlug, structure.practiceTopicSlug);
  const qs = new URLSearchParams({
    field: fieldId,
    mode: "bank",
    subjectId: structure.practiceTopicSlug,
    count: String(count),
    returnExam: examSlug,
    returnStructure: structure.id,
    returnStructureName: structure.name,
  });
  return `${ROUTES.questionBank}?${qs.toString()}`;
}

/** Parse return link after practice launched from Anatomy Explorer. */
export function parseAnatomyPracticeReturn(
  params: Pick<URLSearchParams, "get">
): { href: string; label: string } | null {
  const returnExam = params.get("returnExam");
  const returnStructure = params.get("returnStructure")?.trim();
  if (!returnExam || !returnStructure || !isExamSlug(returnExam)) return null;
  const name = params.get("returnStructureName")?.trim();
  return {
    href: anatomyHref(returnExam, returnStructure),
    label: name ? `${name} in Anatomy` : "Anatomy Explorer",
  };
}

/** Top 500 drug flashcards filtered by therapeutic class. */
export function drugs300ClassHref(drugClass: string): string {
  return `${ROUTES.drugs300}?class=${encodeURIComponent(drugClass)}`;
}

/** Top 500 drug flashcard for a specific generic slug. */
export function drugs300DrugHref(drugSlug: string): string {
  return `${ROUTES.drugs300}?drug=${encodeURIComponent(drugSlug)}`;
}

/** Topic review module return takes precedence over anatomy when both are set. */
export function parsePracticeReturn(
  params: Pick<URLSearchParams, "get">
): { href: string; label: string } | null {
  return parseTopicPracticeReturn(params) ?? parseAnatomyPracticeReturn(params);
}
