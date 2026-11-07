import { EXAM_CATALOG, isExamSlug } from "@/lib/edtech/exams";

/** Ten-question bank session for the signed-in board. Count 10 is a real bank size. */
export function firstTenQuestionsHref(examSlug: string | null | undefined): string | null {
  if (!examSlug || !isExamSlug(examSlug)) return null;
  const params = new URLSearchParams({
    field: EXAM_CATALOG[examSlug].fieldId,
    mode: "bank",
    count: "10",
  });
  return `/question-bank?${params.toString()}`;
}
