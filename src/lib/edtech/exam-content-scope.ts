import type { ExamSlug } from "@/types/edtech";

/** Clinical study tools (Anatomy, Library, Top 500) are available for all board exams. */
export function hasClinicalStudyTools(_slug: ExamSlug | string | null | undefined): boolean {
  return true;
}

/** Pharmacy-law board. Clinical drug and anatomy tools stay off this exam. */
export function isMpjeExam(slug: ExamSlug | string | null | undefined): boolean {
  return slug === "mpje";
}

/** @deprecated MPJE removed — no redirect needed. */
export async function redirectMpjeFromClinicalRoutes(_userId: string): Promise<void> {
  return;
}
