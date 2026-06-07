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
  return `/study/practice?${qs.toString()}`;
}

export function questionBankHref(examSlug: ExamSlug): string {
  const fieldId = EXAM_CATALOG[examSlug].fieldId;
  return `/study/practice?field=${encodeURIComponent(fieldId)}&mode=bank`;
}

export function simulatedExamHref(examSlug: ExamSlug): string {
  const fieldId = EXAM_CATALOG[examSlug].fieldId;
  return `/study/practice?field=${encodeURIComponent(fieldId)}&mode=timed`;
}

export function analyticsHref(): string {
  return "/study/analytics";
}

export function top500Href(examSlug: ExamSlug): string {
  return `/study/drugs300?exam=${examSlug}`;
}

export function highYieldTopicsHref(examSlug: ExamSlug): string {
  return `/study-hub/topics?exam=${examSlug}`;
}
