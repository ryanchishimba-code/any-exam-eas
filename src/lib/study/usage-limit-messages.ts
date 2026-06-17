/** Client-safe helpers for study usage limit API responses. */
export type StudyLimitErrorPayload = {
  error?: string;
  code?: string;
  upgradeUrl?: string;
};

const LIMIT_CODES = new Set([
  "DAILY_QUESTION_LIMIT",
  "TRIAL_LIFETIME_LIMIT",
  "TRIAL_FEATURE_LOCKED",
  "TRIAL_PRESET_EXAM_LOCKED",
  "TRIAL_MOCK_LOCKED",
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
