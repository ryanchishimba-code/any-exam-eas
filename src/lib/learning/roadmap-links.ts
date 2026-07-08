import type { ExamSlug } from "@/types/edtech";

export function roadmapHref(examSlug?: ExamSlug): string {
  if (!examSlug) return "/dashboard/roadmap";
  return `/dashboard/roadmap?exam=${encodeURIComponent(examSlug)}`;
}
