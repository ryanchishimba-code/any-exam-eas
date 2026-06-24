import { fullExamResultsHref } from "@/lib/full-exam/config";
import { analyticsHref } from "@/lib/edtech/practice-links";
import type { RecentTestRow } from "@/lib/learning/student-dashboard";
import type { ExamSlug } from "@/types/edtech";

/** Best destination for a completed session row from the dashboard or analytics. */
export function recentTestHref(examSlug: ExamSlug, test: RecentTestRow): string {
  const title = test.title.toLowerCase();
  const looksLikeFullExam =
    title.includes("full") ||
    title.includes("mock") ||
    title.includes("simulation") ||
    title.includes("timed exam");

  if (looksLikeFullExam && test.examId) {
    return fullExamResultsHref(examSlug, test.examId);
  }

  return analyticsHref();
}
