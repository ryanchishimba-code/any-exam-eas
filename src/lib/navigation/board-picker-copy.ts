import { boardAccentFromHref } from "@/lib/marketing/board-accent";
import { EXAM_CATALOG } from "@/lib/edtech/exams";
import type { ExamSlug } from "@/types/edtech";

const HREF_TO_EXAM: Record<string, ExamSlug> = {
  "/nclex": "nclex",
  "/usmle": "usmle",
  "/naplex": "naplex",
  "/pance": "pance",
  "/aanp-fnp": "aanp-fnp",
  "/npte-pt": "npte-pt",
};

/** Short muted line under the board name in the picker menu. */
export function boardPickerSubtitle(href: string): string {
  const slug = boardAccentFromHref(href);
  const fromHref = HREF_TO_EXAM[href];
  const examSlug = fromHref ?? (slug as ExamSlug | null);
  if (examSlug && EXAM_CATALOG[examSlug]) {
    return EXAM_CATALOG[examSlug].description;
  }
  return "Board exam prep";
}
