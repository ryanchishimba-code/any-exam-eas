import { MIXED_SUBJECT_ID, topicRetestHref } from "@/lib/edtech/practice-links-core";
import { normalizeWeakAreaTopicKey } from "@/lib/library/weak-area-map";
import type { ExamSlug } from "@/types/edtech";

function practiceTopicSlug(topicKey: string): string {
  return normalizeWeakAreaTopicKey(topicKey)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Practice set for one weak area on that area's step.
 * Standard bank practice so the topic filter is applied. Adaptive would ignore it.
 */
export function weakAreaPracticeHref(input: {
  examSlug: ExamSlug;
  topicKey: string;
  fieldId: string;
  count?: 5 | 10 | 25;
}): string {
  const slug = practiceTopicSlug(input.topicKey);
  const usmle = input.examSlug === "usmle" || input.fieldId.startsWith("usmle-");
  const href = topicRetestHref(input.examSlug, slug || MIXED_SUBJECT_ID, input.count ?? 25, {
    filters: {
      fieldId: input.fieldId,
      ...(usmle && slug
        ? { blueprintTopics: [slug], usmleTopic: slug }
        : {}),
    },
  });
  const url = new URL(href, "https://anyexameasy.local");
  url.searchParams.set("style", "standard");
  return `${url.pathname}?${url.searchParams.toString()}`;
}
