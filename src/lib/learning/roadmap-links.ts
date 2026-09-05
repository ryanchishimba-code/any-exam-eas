import { ROUTES } from "@/lib/routes";
import type { ExamSlug } from "@/types/edtech";

/** Study Hub (dashboard) — blueprint readiness lives here, not a separate roadmap page. */
export function studyHubHref(examSlug?: ExamSlug): string {
  if (!examSlug) return ROUTES.dashboard;
  return `${ROUTES.dashboard}?exam=${encodeURIComponent(examSlug)}`;
}

/** @deprecated Use studyHubHref — roadmap page was removed. */
export function roadmapHref(examSlug?: ExamSlug): string {
  return studyHubHref(examSlug);
}
