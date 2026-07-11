import type { QueryClient } from "@tanstack/react-query";
import { EXAM_CATALOG } from "@/lib/edtech/exams";
import { fieldIdForExamSlug } from "@/lib/edtech/exam-field-ids";
import { clearActivitySessionSummary } from "@/lib/client/exam-session-summary";
import { clearAllStudySessionsLocally } from "@/lib/questions/storage";
import { fetchSubjectCounts } from "@/lib/study/subject-counts-client";
import { ROUTES } from "@/lib/routes";
import type { ExamSlug } from "@/types/edtech";

const FULL_EXAM_PAYLOAD_PREFIX = "full-exam-payload:";

/** Custom event name — listeners reset local exam-scoped UI state. */
export const EXAM_SWITCH_EVENT = "aee:exam-switch";

export type ExamSwitchDetail = {
  examSlug: ExamSlug;
  fieldId: string;
};

/** Remove in-flight full-exam payloads, activity summaries, and stale study sessions. */
export function clearExamTransientClientState(): void {
  if (typeof window === "undefined") return;
  clearActivitySessionSummary();
  clearAllStudySessionsLocally();
  try {
    const keys: string[] = [];
    for (let i = 0; i < window.sessionStorage.length; i += 1) {
      const key = window.sessionStorage.key(i);
      if (key?.startsWith(FULL_EXAM_PAYLOAD_PREFIX)) keys.push(key);
    }
    for (const key of keys) {
      window.sessionStorage.removeItem(key);
    }
  } catch {
    // private mode / quota
  }
}

export function invalidateExamScopedQueries(queryClient: QueryClient): void {
  void queryClient.removeQueries({
    predicate: (query) => {
      const key0 = query.queryKey[0];
      return (
        key0 === "subject-counts" ||
        key0 === "live-bank-counts" ||
        key0 === "learning-dashboard" ||
        key0 === "learning-plan" ||
        key0 === "learning-profile"
      );
    },
  });
}

/** Warm subject-count cache for the newly selected exam before navigation completes. */
export function prefetchExamSubjectCounts(
  queryClient: QueryClient,
  examSlug: ExamSlug
): void {
  const fieldId = fieldIdForExamSlug(examSlug);
  void queryClient.prefetchQuery({
    queryKey: ["subject-counts", fieldId],
    queryFn: () => fetchSubjectCounts(fieldId),
    staleTime: 5 * 60 * 1000,
  });
}

export function broadcastExamSwitch(examSlug: ExamSlug): void {
  if (typeof window === "undefined") return;
  const detail: ExamSwitchDetail = {
    examSlug,
    fieldId: fieldIdForExamSlug(examSlug),
  };
  window.dispatchEvent(new CustomEvent(EXAM_SWITCH_EVENT, { detail }));
}

/**
 * After the server saves a new exam preference, scrub client caches and notify
 * mounted study surfaces before navigation.
 */
export function prepareClientForExamSwitch(
  queryClient: QueryClient,
  examSlug: ExamSlug
): void {
  clearExamTransientClientState();
  invalidateExamScopedQueries(queryClient);
  prefetchExamSubjectCounts(queryClient, examSlug);
  broadcastExamSwitch(examSlug);
}

/** Resolve a safe post-switch URL so stale ?field= / ?exam= params do not linger. */
export function resolvePathAfterExamSwitch(
  pathname: string,
  searchParams: URLSearchParams,
  nextExamSlug: ExamSlug
): string {
  const nextFieldId = fieldIdForExamSlug(nextExamSlug);

  if (pathname === ROUTES.questionBank || pathname.startsWith(`${ROUTES.questionBank}/`)) {
    const qs = new URLSearchParams(searchParams.toString());
    qs.set("field", nextFieldId);
    qs.set("mode", qs.get("mode") === "timed" ? "timed" : "bank");
    qs.delete("subjectId");
    qs.delete("count");
    qs.delete("pace");
    qs.delete("style");
    qs.delete("taskCategory");
    qs.delete("autostart");
    qs.delete("mpjeState");
    qs.delete("state");
    return `${ROUTES.questionBank}?${qs.toString()}`;
  }

  if (pathname === ROUTES.library || pathname.startsWith(`${ROUTES.library}/`)) {
    const qs = new URLSearchParams(searchParams.toString());
    qs.set("exam", nextExamSlug);
    qs.delete("card");
    qs.delete("topic");
    return `${ROUTES.library}?${qs.toString()}`;
  }

  if (pathname.startsWith(`${ROUTES.fullExam}/`)) {
    const segments = pathname.split("/").filter(Boolean);
    const currentSlug = segments[1];
    if (currentSlug && currentSlug !== nextExamSlug) {
      return `${ROUTES.fullExam}/${nextExamSlug}`;
    }
  }

  if (pathname.startsWith("/prep/")) {
    const segments = pathname.split("/").filter(Boolean);
    const currentSlug = segments[1];
    if (currentSlug && currentSlug in EXAM_CATALOG && currentSlug !== nextExamSlug) {
      return `/prep/${nextExamSlug}`;
    }
  }

  // Select-exam switch flow — land on Study Hub for the new exam.
  if (pathname === ROUTES.selectExam || pathname.startsWith(`${ROUTES.selectExam}/`)) {
    return ROUTES.dashboard;
  }

  return pathname;
}
