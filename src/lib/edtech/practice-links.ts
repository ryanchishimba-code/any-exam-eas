import { ROUTES, fullExamHref } from "@/lib/routes";
import { EXAM_CATALOG } from "@/lib/edtech/exams";
import type { ExamSlug } from "@/types/edtech";

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

export function simulatedExamHref(examSlug: ExamSlug): string {
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
