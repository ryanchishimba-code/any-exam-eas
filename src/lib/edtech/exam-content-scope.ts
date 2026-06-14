import { redirect } from "next/navigation";
import { getUserExamPreference } from "@/lib/edtech/exam-preference";
import { ROUTES } from "@/lib/routes";
import type { ExamSlug } from "@/types/edtech";

export function isMpjeExam(slug: ExamSlug | string | null | undefined): boolean {
  return slug === "mpje";
}

/** Anatomy explorer, Top 500 drugs, and related clinical reference tools. */
export function hasClinicalStudyTools(slug: ExamSlug | string | null | undefined): boolean {
  return !isMpjeExam(slug);
}

/** Redirect MPJE users away from NCLEX/NAPLEX/USMLE-only study tools. */
export async function redirectMpjeFromClinicalRoutes(userId: string): Promise<void> {
  const pref = await getUserExamPreference(userId);
  if (isMpjeExam(pref?.examSlug)) {
    redirect(ROUTES.dashboard);
  }
}
