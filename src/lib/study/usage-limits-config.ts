import type { UserAccess } from "@/lib/access-control";

export type StudyUsagePlan = "trial" | "basic" | "pro" | "staff";

export type StudyUsageLimits = {
  /** Max questions served per UTC day. `null` = unlimited (paid tiers). */
  dailyQuestions: number | null;
  /** Lifetime cap during free trial only. */
  trialLifetimeQuestions: number | null;
  /** Session size cap. `null` = no cap (paid tiers use bank defaults). */
  maxPerSession: number | null;
  maxTimedExamLength: number | null;
  allowPresetExams: boolean;
  /** 50-question mock exams — Basic+ unlimited; trial gets one. */
  allowShortMocks: boolean;
  /** 100-Q and full-length board simulations — Pro only. */
  allowFullLengthMocks: boolean;
  /** Trial lifetime 50-Q mock allowance. */
  trialMockAllowance: number | null;
  /** Adaptive / weak-area selection — Pro only. */
  allowAdaptive: boolean;
};

export const STUDY_USAGE_LIMITS: Record<StudyUsagePlan, StudyUsageLimits> = {
  trial: {
    dailyQuestions: 50,
    trialLifetimeQuestions: 300,
    maxPerSession: 25,
    maxTimedExamLength: 50,
    allowPresetExams: false,
    allowShortMocks: true,
    allowFullLengthMocks: false,
    trialMockAllowance: 1,
    allowAdaptive: false,
  },
  basic: {
    dailyQuestions: null,
    trialLifetimeQuestions: null,
    maxPerSession: null,
    maxTimedExamLength: null,
    allowPresetExams: true,
    allowShortMocks: true,
    allowFullLengthMocks: false,
    trialMockAllowance: null,
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
    allowAdaptive: true,
  },
};

export const MOCK_EXAM_MIN_QUESTIONS = 50;

export function resolveStudyUsagePlan(access: UserAccess): StudyUsagePlan {
  if (access.role === "staff") return "staff";
  if (access.role === "trial") return "trial";
  if (access.role === "subscriber") {
    return access.subscription.tier === "basic" ? "basic" : "pro";
  }
  return "trial";
}

export function clampStudySessionSize(
  plan: StudyUsagePlan,
  requested: number,
  timedExam: boolean
): number {
  const limits = STUDY_USAGE_LIMITS[plan];
  const cap = timedExam ? limits.maxTimedExamLength : limits.maxPerSession;
  if (cap == null) return Math.max(1, requested);
  return Math.max(1, Math.min(requested, cap));
}

export function planHasQuestionAccessLimits(plan: StudyUsagePlan): boolean {
  return plan === "trial";
}
