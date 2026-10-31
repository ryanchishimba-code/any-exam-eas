import { isExamSlug } from "@/lib/edtech/exams";
import type { ExamSlug } from "@/types/edtech";

const OPTIMISTIC_EXAM_KEY = "aee:optimistic-exam-slug";
const OPTIMISTIC_EXAM_AT_KEY = "aee:optimistic-exam-at";

/**
 * How long a board the learner just chose wins over a cached preference read.
 * The server cache can keep the previous exam for up to a minute.
 */
export const OPTIMISTIC_EXAM_MAX_AGE_MS = 60_000;

export type OptimisticExamChoice = {
  slug: ExamSlug;
  at: number;
};

/**
 * The exam the student just saved on /select-exam.
 * A full navigation drops the in-memory preference cache, and the app layout
 * can still paint the previous board. sessionStorage survives that navigation.
 */
export function writeOptimisticExamSlug(slug: ExamSlug | null, at = Date.now()): void {
  if (typeof window === "undefined") return;
  try {
    if (!slug) {
      window.sessionStorage.removeItem(OPTIMISTIC_EXAM_KEY);
      window.sessionStorage.removeItem(OPTIMISTIC_EXAM_AT_KEY);
      return;
    }
    window.sessionStorage.setItem(OPTIMISTIC_EXAM_KEY, slug);
    window.sessionStorage.setItem(OPTIMISTIC_EXAM_AT_KEY, String(at));
  } catch {
    // private mode / quota
  }
}

export function readOptimisticExamSlug(): ExamSlug | null {
  return readOptimisticExamChoice()?.slug ?? null;
}

export function readOptimisticExamChoice(): OptimisticExamChoice | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(OPTIMISTIC_EXAM_KEY);
    if (!raw || !isExamSlug(raw)) return null;
    const at = Number(window.sessionStorage.getItem(OPTIMISTIC_EXAM_AT_KEY));
    return { slug: raw, at: Number.isFinite(at) ? at : 0 };
  } catch {
    return null;
  }
}

export function optimisticExamIsFresh(
  choice: OptimisticExamChoice | null,
  now = Date.now()
): boolean {
  if (!choice || choice.at <= 0) return false;
  return now - choice.at < OPTIMISTIC_EXAM_MAX_AGE_MS;
}

export function clearOptimisticExamSlug(): void {
  writeOptimisticExamSlug(null);
}

/**
 * Header chip, feed link, and question-bank board.
 * A board chosen in the last minute wins over a cached account exam so the
 * nav updates on the click. An older leftover chip loses to the account exam.
 */
export function displayedExamSlug(input: {
  accountExam: ExamSlug | null;
  optimisticExam: ExamSlug | null;
  optimisticAt?: number | null;
  now?: number;
}): ExamSlug | null {
  const now = input.now ?? Date.now();
  const at = input.optimisticAt ?? null;
  const fresh =
    input.optimisticExam != null &&
    at != null &&
    at > 0 &&
    now - at < OPTIMISTIC_EXAM_MAX_AGE_MS;
  if (fresh && input.optimisticExam) return input.optimisticExam;
  return input.accountExam ?? input.optimisticExam;
}

export function headerExamSlug(
  accountExam: ExamSlug | null,
  optimisticSlug: ExamSlug | null,
  options?: { optimisticAt?: number | null; now?: number }
): ExamSlug | null {
  return displayedExamSlug({
    accountExam,
    optimisticExam: optimisticSlug,
    optimisticAt: options?.optimisticAt,
    now: options?.now,
  });
}
