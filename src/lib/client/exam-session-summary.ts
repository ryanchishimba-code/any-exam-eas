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
  attemptsSaved?: number;
  studyStreakDays?: number;
  weakTopicLabels?: string[];
  analyticsHref?: string;
  reviewIncorrectHref?: string;
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
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(summary));
  } catch {
    // Private mode or quota. The ended URL still carries the receipt.
  }
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

const RECEIPT_QUERY_KEYS = [
  "session",
  "title",
  "early",
  "saved",
  "acc",
  "correct",
  "answered",
  "total",
  "streak",
  "weak",
  "review",
  "stats",
] as const;

function finiteNumber(value: string | null): number | undefined {
  if (value == null || value.trim() === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

/** Compact receipt on the dashboard URL so a cleared sessionStorage still shows it. */
export function studyHubWithSummaryPath(summary?: ActivitySessionSummary | null): string {
  const qs = new URLSearchParams();
  qs.set("session", "ended");
  if (!summary) return `${STUDY_HUB_PATH}?${qs.toString()}`;

  const title = summary.title?.trim().slice(0, 80);
  if (title) qs.set("title", title);
  qs.set("early", summary.endedEarly ? "1" : "0");
  if (summary.attemptsSaved != null) qs.set("saved", String(summary.attemptsSaved));
  if (summary.accuracy != null) qs.set("acc", String(summary.accuracy));
  if (summary.correct != null) qs.set("correct", String(summary.correct));
  if (summary.answered != null) qs.set("answered", String(summary.answered));
  if (summary.total != null) qs.set("total", String(summary.total));
  if (summary.studyStreakDays != null) qs.set("streak", String(summary.studyStreakDays));
  if (summary.weakTopicLabels?.length) {
    qs.set("weak", summary.weakTopicLabels.slice(0, 3).join("|").slice(0, 160));
  }
  if (summary.reviewIncorrectHref) qs.set("review", summary.reviewIncorrectHref.slice(0, 300));
  if (summary.analyticsHref) qs.set("stats", summary.analyticsHref.slice(0, 200));
  return `${STUDY_HUB_PATH}?${qs.toString()}`;
}

export function activitySummaryFromSearchParams(
  params: Pick<URLSearchParams, "get">
): ActivitySessionSummary | null {
  if (params.get("session") !== "ended") return null;
  const weak = params.get("weak");
  return {
    title: params.get("title")?.trim() || "Practice session",
    activityType: "practice",
    endedEarly: params.get("early") === "1",
    answered: finiteNumber(params.get("answered")),
    total: finiteNumber(params.get("total")),
    correct: finiteNumber(params.get("correct")),
    accuracy: finiteNumber(params.get("acc")),
    attemptsSaved: finiteNumber(params.get("saved")),
    studyStreakDays: finiteNumber(params.get("streak")),
    weakTopicLabels: weak
      ? weak
          .split("|")
          .map((label) => label.trim())
          .filter(Boolean)
      : undefined,
    reviewIncorrectHref: params.get("review") || undefined,
    analyticsHref: params.get("stats") || undefined,
  };
}

/** Prefer the stored summary, and fill any fields that only survived on the URL. */
export function mergeActivitySummary(
  stored: ActivitySessionSummary | null,
  fromQuery: ActivitySessionSummary | null
): ActivitySessionSummary | null {
  if (!stored) return fromQuery;
  if (!fromQuery) return stored;
  return {
    ...fromQuery,
    ...stored,
    attemptsSaved: stored.attemptsSaved ?? fromQuery.attemptsSaved,
    accuracy: stored.accuracy ?? fromQuery.accuracy,
    correct: stored.correct ?? fromQuery.correct,
    answered: stored.answered ?? fromQuery.answered,
    total: stored.total ?? fromQuery.total,
    studyStreakDays: stored.studyStreakDays ?? fromQuery.studyStreakDays,
    weakTopicLabels: stored.weakTopicLabels?.length
      ? stored.weakTopicLabels
      : fromQuery.weakTopicLabels,
    reviewIncorrectHref: stored.reviewIncorrectHref ?? fromQuery.reviewIncorrectHref,
    analyticsHref: stored.analyticsHref ?? fromQuery.analyticsHref,
  };
}

export function receiptQueryKeys(): readonly string[] {
  return RECEIPT_QUERY_KEYS;
}
