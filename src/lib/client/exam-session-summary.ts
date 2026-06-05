import { STUDY_HUB_PATH } from "@/lib/study-hub/config";

export type ActivityType = "exam" | "practice" | "drugs" | "quilt" | "cat";

export type ActivitySessionSummary = {
  title: string;
  activityType: ActivityType;
  examType?: string;
  mode?: string;
  answered?: number;
  total?: number;
  correct?: number;
  accuracy?: number;
  reviewed?: number;
  mastered?: number;
  progressPct?: number;
  endedEarly: boolean;
  timed?: boolean;
  timeRemainingSec?: number;
  flaggedCount?: number;
};

/** @deprecated Use ActivitySessionSummary */
export type ExamSessionSummary = ActivitySessionSummary;

const STORAGE_KEY = "aee-activity-session-summary";
const LEGACY_KEY = "aee-exam-session-summary";

export function storeActivitySessionSummary(summary: ActivitySessionSummary): void {
  if (typeof sessionStorage === "undefined") return;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(summary));
}

/** @deprecated Use storeActivitySessionSummary */
export const storeExamSessionSummary = storeActivitySessionSummary;

export function readActivitySessionSummary(): ActivitySessionSummary | null {
  if (typeof sessionStorage === "undefined") return null;
  const raw =
    sessionStorage.getItem(STORAGE_KEY) ?? sessionStorage.getItem(LEGACY_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as ActivitySessionSummary;
    if (!parsed.activityType) {
      parsed.activityType = "exam";
    }
    return parsed;
  } catch {
    return null;
  }
}

/** @deprecated Use readActivitySessionSummary */
export const readExamSessionSummary = readActivitySessionSummary;

export function clearActivitySessionSummary(): void {
  if (typeof sessionStorage === "undefined") return;
  sessionStorage.removeItem(STORAGE_KEY);
  sessionStorage.removeItem(LEGACY_KEY);
}

/** @deprecated Use clearActivitySessionSummary */
export const clearExamSessionSummary = clearActivitySessionSummary;

export function studyHubWithSummaryPath(): string {
  return `${STUDY_HUB_PATH}?session=ended`;
}
