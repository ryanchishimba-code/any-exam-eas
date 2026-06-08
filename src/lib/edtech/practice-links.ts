import { ROUTES, fullExamHref } from "@/lib/routes";
import { EXAM_CATALOG } from "@/lib/edtech/exams";
import { fullExamLaunchHref } from "@/lib/full-exam/config";
import type { ExamSlug } from "@/types/edtech";
import type { FullExamLengthPreset } from "@/types/full-exam";

/** Question bank practice filtered to a high-yield topic slug. */
export function practiceTopicHref(
  examSlug: ExamSlug,
  topicSlug: string,
  count = 10
): string {
  const fieldId = EXAM_CATALOG[examSlug].fieldId;
  const qs = new URLSearchParams({
    field: fieldId,
    mode: "bank",
    subjectId: topicSlug,
    count: String(count),
  });
  return `${ROUTES.questionBank}?${qs.toString()}`;
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

export function top500Href(examSlug: ExamSlug): string {
  return `${ROUTES.drugs300}?exam=${examSlug}`;
}

export function highYieldTopicsHref(examSlug?: ExamSlug): string {
  if (!examSlug) return ROUTES.highYieldTopics;
  return `${ROUTES.highYieldTopics}?exam=${encodeURIComponent(examSlug)}`;
}

/** Deep link to a specific review module or topic slide-over. */
export function highYieldTopicHref(examSlug: ExamSlug, topicSlug: string): string {
  const qs = new URLSearchParams({
    exam: examSlug,
    topic: topicSlug,
  });
  return `${ROUTES.highYieldTopics}?${qs.toString()}`;
}

export function referenceHref(examSlug?: ExamSlug): string {
  if (!examSlug) return ROUTES.reference;
  return `${ROUTES.reference}?exam=${encodeURIComponent(examSlug)}`;
}

/** Future Stats integration: link to reference filtered by memory card id. */
export function referenceCardHref(examSlug: ExamSlug, cardId: string): string {
  const qs = new URLSearchParams({ exam: examSlug, card: cardId });
  return `${ROUTES.reference}?${qs.toString()}`;
}
