/**
 * Lightweight practice URL builders for nav, dashboard, and shell chrome.
 * Avoids importing exam topic-practice resolvers (and their seed bundles).
 * Use `@/lib/edtech/practice-links` when you need `highYieldTopicPracticeHref`.
 */
import { ROUTES, fullExamHref } from "@/lib/routes";
import { EXAM_CATALOG, isExamSlug } from "@/lib/edtech/exams";
import { fullExamLaunchHref } from "@/lib/full-exam/hrefs";
import { isUsmleStep1Subject } from "@/lib/subjects/medicine/subject-splits";
import type { ExamSlug } from "@/types/edtech";
import type { FullExamLengthPreset } from "@/types/full-exam";

/** Sentinel subjectId the question-bank API treats as a mixed-topic session. */
export const MIXED_SUBJECT_ID = "__mixed__";

export type TopicPracticeReturnContext = {
  topicSlug: string;
  topicTitle: string;
  deepDive?: boolean;
};

export type TopicPracticeFilters = {
  blueprintTopics?: string[];
  nclexPreset?: string;
  naplexTopic?: string;
  usmleTopic?: string;
  panceTopic?: string;
  aanpFnpTopic?: string;
  nptePtTopic?: string;
  fieldId?: string;
};

function topicFieldId(examSlug: ExamSlug, topicSlug: string): string {
  const fieldId = EXAM_CATALOG[examSlug].fieldId;
  if (fieldId.startsWith("usmle") && isUsmleStep1Subject(topicSlug)) return "usmle-step-1";
  return fieldId;
}

export function practiceTopicHref(
  examSlug: ExamSlug,
  topicSlug: string,
  count = 10,
  returnTo?: TopicPracticeReturnContext,
  filters?: TopicPracticeFilters
): string {
  const isMixed = topicSlug === "mixed" || topicSlug === MIXED_SUBJECT_ID;
  const subjectId = isMixed ? MIXED_SUBJECT_ID : topicSlug;
  const fieldId =
    filters?.fieldId ??
    (isMixed ? EXAM_CATALOG[examSlug].fieldId : topicFieldId(examSlug, topicSlug));
  const qs = new URLSearchParams({
    field: fieldId,
    mode: "bank",
    subjectId,
    count: String(count),
  });
  if (filters?.blueprintTopics?.length) {
    qs.set("blueprintTopics", filters.blueprintTopics.join(","));
  }
  if (filters?.nclexPreset) qs.set("nclexPreset", filters.nclexPreset);
  if (filters?.naplexTopic) qs.set("naplexTopic", filters.naplexTopic);
  if (filters?.usmleTopic) qs.set("usmleTopic", filters.usmleTopic);
  if (filters?.panceTopic) qs.set("panceTopic", filters.panceTopic);
  if (filters?.aanpFnpTopic) qs.set("aanpFnpTopic", filters.aanpFnpTopic);
  if (filters?.nptePtTopic) qs.set("nptePtTopic", filters.nptePtTopic);
  if (returnTo) {
    qs.set("returnExam", examSlug);
    qs.set("returnTopic", returnTo.topicSlug);
    qs.set("returnTitle", returnTo.topicTitle);
    if (returnTo.deepDive) qs.set("returnMode", "deep");
  }
  return `${ROUTES.questionBank}?${qs.toString()}`;
}

/**
 * Closed-loop topic retest after a miss or Deep Dive.
 * Defaults to autostart so students land in the session immediately.
 */
export function topicRetestHref(
  examSlug: ExamSlug,
  topicSlug: string,
  count: 5 | 10 | 25 = 5,
  opts?: {
    returnTo?: TopicPracticeReturnContext;
    filters?: TopicPracticeFilters;
    autostart?: boolean;
  }
): string {
  const base = practiceTopicHref(
    examSlug,
    topicSlug,
    count,
    opts?.returnTo,
    opts?.filters
  );
  const url = new URL(base, "https://anyexameasy.local");
  if (opts?.autostart !== false) {
    url.searchParams.set("autostart", "1");
  }
  return `${url.pathname}?${url.searchParams.toString()}`;
}

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

export function libraryCardHref(examSlug: ExamSlug, cardId: string): string {
  const qs = new URLSearchParams({ exam: examSlug, card: cardId });
  return `${ROUTES.library}?${qs.toString()}`;
}

export function libraryTopicHref(examSlug: ExamSlug, topicKey: string): string {
  const qs = new URLSearchParams({ exam: examSlug, topic: topicKey });
  return `${ROUTES.library}?${qs.toString()}`;
}

export function anatomyHref(examSlug?: ExamSlug, structureId?: string, procedureId?: string): string {
  const qs = new URLSearchParams();
  if (examSlug) qs.set("exam", examSlug);
  if (structureId) qs.set("structure", structureId);
  if (procedureId) qs.set("procedure", procedureId);
  const q = qs.toString();
  return q ? `${ROUTES.anatomy}?${q}` : ROUTES.anatomy;
}

export function anatomyProcedureHref(procedureId: string, examSlug?: ExamSlug): string {
  return anatomyHref(examSlug, undefined, procedureId);
}

export function anatomyPracticeHref(examSlug: ExamSlug, count = 10): string {
  return practiceTopicHref(examSlug, "anatomy", count);
}

type StructurePracticeInput = {
  id: string;
  name: string;
  practiceTopicSlug: string;
};

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

export function drugs300ClassHref(drugClass: string): string {
  return `${ROUTES.drugs300}?class=${encodeURIComponent(drugClass)}`;
}

export function drugs300DrugHref(drugSlug: string): string {
  return `${ROUTES.drugs300}?drug=${encodeURIComponent(drugSlug)}`;
}

export function parsePracticeReturn(
  params: Pick<URLSearchParams, "get">
): { href: string; label: string } | null {
  return parseTopicPracticeReturn(params) ?? parseAnatomyPracticeReturn(params);
}
