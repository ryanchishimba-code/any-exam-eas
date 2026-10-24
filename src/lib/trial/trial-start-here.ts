import type { UserAccess } from "@/lib/access-control";
import { MIXED_SUBJECT_ID, practiceTopicHref } from "@/lib/edtech/practice-links-core";
import { fullExamLaunchHref } from "@/lib/full-exam/hrefs";
import type { ExamSlug } from "@/types/edtech";
import type { UserEdtechMetadata } from "@/lib/edtech/user-metadata";

export const TRIAL_START_HERE_ID = "trialStartHere.v1" as const;
export const TRIAL_START_HERE_QUERY = "trialStartHere";

export type TrialStartHereStatus =
  | "active"
  | "practice_done"
  | "completed"
  | "dismissed";

export type TrialStartHereRecord = {
  status: TrialStartHereStatus;
  step: number;
  at: string;
  examSlug?: ExamSlug;
};

type MetadataRoot = Record<string, unknown> & {
  trialStartHere?: Record<string, unknown>;
};

const STATUSES = new Set<TrialStartHereStatus>([
  "active",
  "practice_done",
  "completed",
  "dismissed",
]);

export function readTrialStartHereRecord(
  metadata: UserEdtechMetadata | MetadataRoot | null | undefined,
  examSlug: ExamSlug
): TrialStartHereRecord | null {
  const raw = metadata?.trialStartHere?.[TRIAL_START_HERE_ID];
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const record = raw as Partial<TrialStartHereRecord>;
  if (!record.status || !STATUSES.has(record.status)) return null;
  if (record.examSlug && record.examSlug !== examSlug) return null;
  if (typeof record.at !== "string" || !record.at) return null;
  return {
    status: record.status,
    step: typeof record.step === "number" && Number.isFinite(record.step) ? record.step : 0,
    at: record.at,
    examSlug: record.examSlug,
  };
}

export function shouldShowTrialStartHerePath(input: {
  access: UserAccess;
  record: TrialStartHereRecord | null;
}): boolean {
  if (input.access.role !== "trial") return false;
  if (!input.access.subscription.trialEndsAt) return false;
  if (input.record?.status === "completed" || input.record?.status === "dismissed") {
    return false;
  }
  return true;
}

export function trialStartHerePracticeHref(
  examSlug: ExamSlug,
  fieldId: string
): string {
  const base = practiceTopicHref(examSlug, MIXED_SUBJECT_ID, 10, undefined, { fieldId });
  const url = new URL(base, "https://anyexameasy.local");
  url.searchParams.set("autostart", "1");
  url.searchParams.set(TRIAL_START_HERE_QUERY, "1");
  return `${url.pathname}?${url.searchParams.toString()}`;
}

export function trialStartHereFullMockHref(examSlug: ExamSlug, fieldId?: string): string {
  return fullExamLaunchHref(examSlug, {
    mode: "full",
    autostart: false,
    fieldId,
    nclexCat: examSlug === "nclex",
  });
}

export function mergeTrialStartHereRecord(
  metadata: UserEdtechMetadata | MetadataRoot | null | undefined,
  patch: TrialStartHereRecord
): UserEdtechMetadata {
  const current = (metadata && typeof metadata === "object" ? metadata : {}) as UserEdtechMetadata;
  const trialStartHere =
    current.trialStartHere && typeof current.trialStartHere === "object"
      ? { ...current.trialStartHere }
      : {};
  trialStartHere[TRIAL_START_HERE_ID] = patch;
  return { ...current, trialStartHere };
}

export function inferTrialStartHereStep(input: {
  record: TrialStartHereRecord | null;
  accountAttemptCount: number | null;
}): 1 | 2 | 3 {
  if (input.record?.status === "practice_done") return 3;
  if ((input.accountAttemptCount ?? 0) > 0 || input.record?.status === "active") return 2;
  return 1;
}
