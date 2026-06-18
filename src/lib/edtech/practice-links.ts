import { ROUTES, fullExamHref } from "@/lib/routes";
import { EXAM_CATALOG, isExamSlug } from "@/lib/edtech/exams";
import { fullExamLaunchHref } from "@/lib/full-exam/config";
import type { ExamSlug } from "@/types/edtech";
import type { FullExamLengthPreset } from "@/types/full-exam";

/** Context for returning to a high-yield review module after practice. */
export type TopicPracticeReturnContext = {
  /** High-yield topic slug (panel deep link), not question-bank subjectId. */
  topicSlug: string;
  topicTitle: string;
  deepDive?: boolean;
};

/** Question bank practice filtered to a high-yield topic slug. */
export function practiceTopicHref(
  examSlug: ExamSlug,
  topicSlug: string,
  count = 10,
  returnTo?: TopicPracticeReturnContext
): string {
  const fieldId = EXAM_CATALOG[examSlug].fieldId;
  const qs = new URLSearchParams({
    field: fieldId,
    mode: "bank",
    subjectId: topicSlug,
    count: String(count),
  });
  if (returnTo) {
    qs.set("returnExam", examSlug);
    qs.set("returnTopic", returnTo.topicSlug);
    qs.set("returnTitle", returnTo.topicTitle);
    if (returnTo.deepDive) qs.set("returnMode", "deep");
  }
  return `${ROUTES.questionBank}?${qs.toString()}`;
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

export function highYieldTopicsHref(examSlug?: ExamSlug): string {
  if (!examSlug) return ROUTES.highYieldTopics;
  return `${ROUTES.highYieldTopics}?exam=${encodeURIComponent(examSlug)}`;
}

/** Deep link to a specific review module or topic slide-over. */
export function highYieldTopicHref(
  examSlug: ExamSlug,
  topicSlug: string,
  opts?: { deepDive?: boolean }
): string {
  const qs = new URLSearchParams({
    exam: examSlug,
    topic: topicSlug,
  });
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
