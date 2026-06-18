import type { ExamSlug } from "@/types/edtech";

/** Clinical study tools (Anatomy, Library, Top 500) are available for all board exams. */
export function hasClinicalStudyTools(_slug: ExamSlug | string | null | undefined): boolean {
  return true;
}

/** @deprecated MPJE removed — always false. */
export function isMpjeExam(_slug: ExamSlug | string | null | undefined): boolean {
  return false;
}

/** @deprecated MPJE removed — no redirect needed. */
export async function redirectMpjeFromClinicalRoutes(_userId: string): Promise<void> {
  return;
}
