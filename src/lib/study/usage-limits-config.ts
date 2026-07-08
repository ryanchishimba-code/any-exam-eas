import type { UserAccess } from "@/lib/access-control";
import { FREE_TIER_LIFETIME_QUESTIONS, TRIAL_LIFETIME_QUESTIONS } from "@/lib/billing-config";

export type StudyUsagePlan = "trial" | "free" | "pro" | "staff";

export type StudyUsageLimits = {
  /** Max questions served per UTC day. `null` = unlimited (paid tiers). */
  dailyQuestions: number | null;
  /** Lifetime cap during free trial or post-trial free tier. */
  trialLifetimeQuestions: number | null;
  /** Session size cap. `null` = no cap. */
  maxPerSession: number | null;
  maxTimedExamLength: number | null;
  allowPresetExams: boolean;
  allowShortMocks: boolean;
  allowFullLengthMocks: boolean;
  /** Trial mock allowance — `null` = unlimited during trial. */
  trialMockAllowance: number | null;
  /** Full-length adaptive exam allowance during trial (`full` preset). `null` = unlimited. */
  trialFullAdaptiveAllowance: number | null;
  allowAdaptive: boolean;
};

export const STUDY_USAGE_LIMITS: Record<StudyUsagePlan, StudyUsageLimits> = {
  trial: {
    dailyQuestions: null,
    trialLifetimeQuestions: TRIAL_LIFETIME_QUESTIONS,
    maxPerSession: null,
    maxTimedExamLength: null,
    allowPresetExams: true,
    allowShortMocks: true,
    allowFullLengthMocks: true,
    trialMockAllowance: null,
    trialFullAdaptiveAllowance: 1,
    allowAdaptive: true,
  },
  free: {
    dailyQuestions: null,
    trialLifetimeQuestions: FREE_TIER_LIFETIME_QUESTIONS,
    maxPerSession: 0,
    maxTimedExamLength: null,
    allowPresetExams: false,
    allowShortMocks: false,
    allowFullLengthMocks: false,
    trialMockAllowance: null,
    trialFullAdaptiveAllowance: null,
    allowAdaptive: false,
  },
  pro: {
    dailyQuestions: null,
    trialLifetimeQuestions: null,
    maxPerSession: null,
    maxTimedExamLength: null,
    allowPresetExams: true,
    allowShortMocks: true,
    allowFullLengthMocks: true,
    trialMockAllowance: null,
    trialFullAdaptiveAllowance: null,
    allowAdaptive: true,
  },
  staff: {
    dailyQuestions: null,
    trialLifetimeQuestions: null,
    maxPerSession: null,
    maxTimedExamLength: null,
    allowPresetExams: true,
    allowShortMocks: true,
    allowFullLengthMocks: true,
    trialMockAllowance: null,
    trialFullAdaptiveAllowance: null,
    allowAdaptive: true,
  },
};

export const MOCK_EXAM_MIN_QUESTIONS = 50;

export function resolveStudyUsagePlan(access: UserAccess): StudyUsagePlan {
  if (access.role === "staff") return "staff";
  if (access.role === "free") return "free";
  if (access.role === "trial") return "trial";
  if (access.role === "subscriber") return "pro";
  return "free";
}

export function clampStudySessionSize(
  plan: StudyUsagePlan,
  requested: number,
  timedExam: boolean
): number {
  const limits = STUDY_USAGE_LIMITS[plan];
  const cap = timedExam ? limits.maxTimedExamLength : limits.maxPerSession;
  if (cap == null) return Math.max(1, requested);
  if (cap <= 0) return 0;
  return Math.max(1, Math.min(requested, cap));
}

export function planHasQuestionAccessLimits(plan: StudyUsagePlan): boolean {
  return plan === "trial" || plan === "free";
}
