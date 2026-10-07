import { isExamSlug } from "@/lib/edtech/exams";
import type { ExamSlug } from "@/types/edtech";

const OPTIMISTIC_EXAM_KEY = "aee:optimistic-exam-slug";

/**
 * The exam the student just saved on /select-exam.
 * A full navigation drops the in-memory preference cache, and the app layout
 * can still paint the previous board. sessionStorage survives that navigation.
 */
export function writeOptimisticExamSlug(slug: ExamSlug | null): void {
  if (typeof window === "undefined") return;
  try {
    if (!slug) window.sessionStorage.removeItem(OPTIMISTIC_EXAM_KEY);
    else window.sessionStorage.setItem(OPTIMISTIC_EXAM_KEY, slug);
  } catch {
    // private mode / quota
  }
}

export function readOptimisticExamSlug(): ExamSlug | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(OPTIMISTIC_EXAM_KEY);
    return raw && isExamSlug(raw) ? raw : null;
  } catch {
    return null;
  }
}

export function clearOptimisticExamSlug(): void {
  writeOptimisticExamSlug(null);
}

/**
 * Header links (Full Exam, Bank) follow the exam just chosen.
 * A stale server prop loses to that choice until the preference read agrees.
 */
export function headerExamSlug(
  serverSlug: ExamSlug | null,
  optimisticSlug: ExamSlug | null
): ExamSlug | null {
  return optimisticSlug ?? serverSlug;
}
