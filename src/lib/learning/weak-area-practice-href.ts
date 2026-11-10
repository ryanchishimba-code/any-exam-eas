import { MIXED_SUBJECT_ID, topicRetestHref } from "@/lib/edtech/practice-links-core";
import {
  WEAK_AREA_MIN_SERVED,
  usmleWeakAreaServedSubject,
} from "@/lib/exam-prep/usmle/weak-area-served-subject";
import { normalizeWeakAreaTopicKey } from "@/lib/library/weak-area-map";
import type { ExamSlug } from "@/types/edtech";

function practiceTopicSlug(topicKey: string): string {
  return normalizeWeakAreaTopicKey(topicKey)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Practice set for one weak area on that area's step.
 * USMLE areas use a served subject from the bank taxonomy. Null hides a link
 * whose every served subject has fewer than five questions.
 */
export function weakAreaPracticeHref(input: {
  examSlug: ExamSlug;
  topicKey: string;
  fieldId: string;
  count?: 5 | 10 | 25;
  /** Serve-ready counts from the same gate as the question bank. Omit to use the taxonomy default. */
  subjectCounts?: Record<string, number> | null;
}): string | null {
  const slug = practiceTopicSlug(input.topicKey);
  const usmle = input.examSlug === "usmle" || input.fieldId.startsWith("usmle-");
  if (usmle) {
    const served = usmleWeakAreaServedSubject({
      fieldId: input.fieldId,
      topicKey: slug,
      subjectCounts: input.subjectCounts,
    });
    if (!served) return null;
    const href = topicRetestHref(input.examSlug, served.subjectId, input.count ?? 25, {
      filters: {
        fieldId: input.fieldId,
        ...(served.blueprintTopics.length
          ? { blueprintTopics: served.blueprintTopics, usmleTopic: served.blueprintTopics[0] }
          : {}),
      },
    });
    const url = new URL(href, "https://anyexameasy.local");
    url.searchParams.set("style", "standard");
    url.searchParams.set("weakArea", "1");
    return `${url.pathname}?${url.searchParams.toString()}`;
  }
  if (input.subjectCounts) {
    const served = input.subjectCounts[slug];
    if (typeof served === "number" && served < WEAK_AREA_MIN_SERVED) return null;
  }
  const href = topicRetestHref(input.examSlug, slug || MIXED_SUBJECT_ID, input.count ?? 25, {
    filters: { fieldId: input.fieldId },
  });
  const url = new URL(href, "https://anyexameasy.local");
  url.searchParams.set("style", "standard");
  url.searchParams.set("weakArea", "1");
  return `${url.pathname}?${url.searchParams.toString()}`;
}
