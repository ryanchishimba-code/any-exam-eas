import { navigateHard } from "@/lib/client/navigate-hard";

/** Client-safe helpers for study usage limit API responses. */
export type StudyLimitErrorPayload = {
  error?: string;
  code?: string;
  upgradeUrl?: string;
  remainingTrialTotal?: number | null;
  upgradeScreen?: boolean;
};

const LIMIT_CODES = new Set([
  "DAILY_QUESTION_LIMIT",
  "TRIAL_LIFETIME_LIMIT",
  "TRIAL_FEATURE_LOCKED",
  "TRIAL_PRESET_EXAM_LOCKED",
  "TRIAL_MOCK_LOCKED",
  "TRIAL_FULL_ADAPTIVE_USED",
  "PRO_MOCK_LOCKED",
  "MOCK_EXAM_MONTHLY_LIMIT",
  "PRO_FEATURE_REQUIRED",
]);

export function isStudyLimitError(data: StudyLimitErrorPayload): boolean {
  return Boolean(data.code && LIMIT_CODES.has(data.code));
}

export function studyLimitMessage(data: StudyLimitErrorPayload): string {
  return data.error ?? "Study limit reached.";
}

function readLimitPayload(data: unknown): StudyLimitErrorPayload | null {
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  return {
    error: typeof row.error === "string" ? row.error : undefined,
    code: typeof row.code === "string" ? row.code : undefined,
    upgradeUrl: typeof row.upgradeUrl === "string" ? row.upgradeUrl : undefined,
    remainingTrialTotal:
      typeof row.remainingTrialTotal === "number" ? row.remainingTrialTotal : undefined,
    upgradeScreen: row.upgradeScreen === true,
  };
}

/** True when this trial user is already at or past the question cap. */
export function isTrialQuestionCapReached(data: unknown): boolean {
  const payload = readLimitPayload(data);
  if (!payload || payload.code !== "TRIAL_LIFETIME_LIMIT") return false;
  if (payload.upgradeScreen === true) return true;
  return typeof payload.remainingTrialTotal === "number" && payload.remainingTrialTotal <= 0;
}

/**
 * Open the upgrade screen for a trial user who is already past the question cap.
 * Returns true when navigation started so callers do not also show an error.
 */
export function redirectToUpgradeIfTrialCapReached(data: unknown): boolean {
  if (!isTrialQuestionCapReached(data)) return false;
  const payload = readLimitPayload(data);
  const href =
    payload?.upgradeUrl && payload.upgradeUrl.startsWith("/")
      ? payload.upgradeUrl
      : "/upgrade?reason=trial_total";
  navigateHard(href);
  return true;
}
