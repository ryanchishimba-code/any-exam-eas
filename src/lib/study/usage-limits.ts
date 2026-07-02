import { NextResponse } from "next/server";
import { TRIAL_DAYS } from "@/lib/billing-config";
import type { UserAccess } from "@/lib/access-control";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/analytics/events";
import {
  clampStudySessionSize,
  MOCK_EXAM_MIN_QUESTIONS,
  planHasQuestionAccessLimits,
  resolveStudyUsagePlan,
  STUDY_USAGE_LIMITS,
  type StudyUsageLimits,
  type StudyUsagePlan,
} from "@/lib/study/usage-limits-config";

export type { StudyUsageLimits, StudyUsagePlan };
export {
  clampStudySessionSize,
  MOCK_EXAM_MIN_QUESTIONS,
  planHasQuestionAccessLimits,
  resolveStudyUsagePlan,
  STUDY_USAGE_LIMITS,
} from "@/lib/study/usage-limits-config";

export const STUDY_USAGE_ACTION = "study_questions_served";

function dayStartUtc(): Date {
  const d = new Date();
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0, 0));
}

function monthStartUtc(): Date {
  const d = new Date();
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1, 0, 0, 0, 0));
}

function sumServedFromLogs(
  logs: Array<{ metadata: string | null }>
): number {
  return logs.reduce((sum, log) => {
    if (!log.metadata) return sum;
    try {
      const meta = JSON.parse(log.metadata) as { count?: number };
      return sum + (Number(meta.count) || 0);
    } catch {
      return sum;
    }
  }, 0);
}

export async function countQuestionsServedToday(userId: string): Promise<number> {
  const logs = await prisma.activityLog.findMany({
    where: {
      userId,
      action: STUDY_USAGE_ACTION,
      createdAt: { gte: dayStartUtc() },
    },
    select: { metadata: true },
  });
  return sumServedFromLogs(logs);
}

export async function countQuestionsServedSince(
  userId: string,
  since: Date
): Promise<number> {
  const logs = await prisma.activityLog.findMany({
    where: {
      userId,
      action: STUDY_USAGE_ACTION,
      createdAt: { gte: since },
    },
    select: { metadata: true },
  });
  return sumServedFromLogs(logs);
}

async function freePeriodStart(userId: string): Promise<Date> {
  const sub = await prisma.subscription.findUnique({
    where: { userId },
    select: { trialEndsAt: true, updatedAt: true },
  });
  if (sub?.trialEndsAt) return new Date(sub.trialEndsAt);
  return sub?.updatedAt ?? new Date(0);
}

async function lifetimeUsagePeriodStart(
  userId: string,
  plan: StudyUsagePlan
): Promise<Date> {
  if (plan === "free") return freePeriodStart(userId);
  return trialPeriodStart(userId);
}

async function trialPeriodStart(userId: string): Promise<Date> {
  const sub = await prisma.subscription.findUnique({
    where: { userId },
    select: { createdAt: true, trialEndsAt: true },
  });
  if (sub?.trialEndsAt) {
    const end = new Date(sub.trialEndsAt);
    return new Date(end.getTime() - TRIAL_DAYS * 24 * 60 * 60 * 1000);
  }
  return sub?.createdAt ?? new Date(0);
}

export async function countMockExamsThisMonth(userId: string): Promise<number> {
  return prisma.examSession.count({
    where: {
      userId,
      createdAt: { gte: monthStartUtc() },
      questionCount: { gte: MOCK_EXAM_MIN_QUESTIONS },
    },
  });
}

export async function countTrialMocks(userId: string): Promise<number> {
  const since = await trialPeriodStart(userId);
  return prisma.examSession.count({
    where: {
      userId,
      createdAt: { gte: since },
      questionCount: { gte: MOCK_EXAM_MIN_QUESTIONS },
    },
  });
}

export async function countTrialFullAdaptiveExams(userId: string): Promise<number> {
  const since = await trialPeriodStart(userId);
  const sessions = await prisma.examSession.findMany({
    where: {
      userId,
      createdAt: { gte: since },
    },
    select: { analysis: true },
  });

  return sessions.filter((session) => {
    const analysis = session.analysis as { sessionConfig?: { lengthPreset?: string } } | null;
    return analysis?.sessionConfig?.lengthPreset === "full";
  }).length;
}

export type StudyUsageSnapshot = {
  plan: StudyUsagePlan;
  limits: StudyUsageLimits;
  usedToday: number;
  remainingToday: number | null;
  usedTrialTotal: number | null;
  remainingTrialTotal: number | null;
  mockExamsThisMonth: number;
  usedTrialMocks: number | null;
  remainingTrialMocks: number | null;
  usedTrialFullAdaptive: number | null;
  remainingTrialFullAdaptive: number | null;
};

export async function getStudyUsageSnapshot(
  access: UserAccess
): Promise<StudyUsageSnapshot> {
  const plan = resolveStudyUsagePlan(access);
  const limits = STUDY_USAGE_LIMITS[plan];

  if (!planHasQuestionAccessLimits(plan)) {
    return {
      plan,
      limits,
      usedToday: 0,
      remainingToday: null,
      usedTrialTotal: null,
      remainingTrialTotal: null,
      mockExamsThisMonth: 0,
      usedTrialMocks: null,
      remainingTrialMocks: null,
      usedTrialFullAdaptive: null,
      remainingTrialFullAdaptive: null,
    };
  }

  const usedToday = await countQuestionsServedToday(access.userId);
  const remainingToday =
    limits.dailyQuestions == null
      ? null
      : Math.max(0, limits.dailyQuestions - usedToday);

  let usedTrialTotal: number | null = null;
  let remainingTrialTotal: number | null = null;
  if (
    (plan === "trial" || plan === "free") &&
    limits.trialLifetimeQuestions != null
  ) {
    const since = await lifetimeUsagePeriodStart(access.userId, plan);
    usedTrialTotal = await countQuestionsServedSince(access.userId, since);
    remainingTrialTotal = Math.max(0, limits.trialLifetimeQuestions - usedTrialTotal);
  }

  let usedTrialMocks: number | null = null;
  let remainingTrialMocks: number | null = null;
  if (plan === "trial" && limits.trialMockAllowance != null) {
    usedTrialMocks = await countTrialMocks(access.userId);
    remainingTrialMocks = Math.max(0, limits.trialMockAllowance - usedTrialMocks);
  }

  let usedTrialFullAdaptive: number | null = null;
  let remainingTrialFullAdaptive: number | null = null;
  if (plan === "trial" && limits.trialFullAdaptiveAllowance != null) {
    usedTrialFullAdaptive = await countTrialFullAdaptiveExams(access.userId);
    remainingTrialFullAdaptive = Math.max(
      0,
      limits.trialFullAdaptiveAllowance - usedTrialFullAdaptive
    );
  }

  const mockExamsThisMonth = planHasQuestionAccessLimits(plan)
    ? await countMockExamsThisMonth(access.userId)
    : 0;

  return {
    plan,
    limits,
    usedToday: planHasQuestionAccessLimits(plan) ? usedToday : 0,
    remainingToday: planHasQuestionAccessLimits(plan) ? remainingToday : null,
    usedTrialTotal,
    remainingTrialTotal,
    mockExamsThisMonth,
    usedTrialMocks,
    remainingTrialMocks,
    usedTrialFullAdaptive,
    remainingTrialFullAdaptive,
  };
}

export type StudyUsageCheckInput = {
  userId: string;
  access: UserAccess;
  requestedCount: number;
  timedExam?: boolean;
  presetExam?: boolean;
  adaptive?: boolean;
  shortMock?: boolean;
  fullLengthMock?: boolean;
  fullAdaptiveMock?: boolean;
};

export type StudyUsageCheckResult =
  | {
      ok: true;
      plan: StudyUsagePlan;
      allowedCount: number;
      snapshot: StudyUsageSnapshot;
    }
  | { ok: false; response: NextResponse };

function upgradeUrl(plan: StudyUsagePlan, reason: string): string {
  if (plan === "trial" || plan === "free") {
    return `/pricing?upgrade=subscribe&reason=${encodeURIComponent(reason)}`;
  }
  return `/pricing?upgrade=pro&reason=${encodeURIComponent(reason)}`;
}

export async function checkStudyQuestionUsage(
  input: StudyUsageCheckInput
): Promise<StudyUsageCheckResult> {
  const plan = resolveStudyUsagePlan(input.access);
  const limits = STUDY_USAGE_LIMITS[plan];
  const snapshot = await getStudyUsageSnapshot(input.access);
  const timed = input.timedExam ?? false;

  if (input.adaptive && !limits.allowAdaptive) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          error:
            plan === "trial"
              ? "Adaptive practice requires a Pro subscription after your trial."
              : "Adaptive practice requires a Pro subscription.",
          code: plan === "trial" ? "TRIAL_FEATURE_LOCKED" : "PRO_FEATURE_REQUIRED",
          plan,
          feature: "adaptive",
          upgradeUrl: upgradeUrl(plan, "adaptive"),
        },
        { status: 403 }
      ),
    };
  }

  if (input.presetExam && !limits.allowPresetExams) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          error:
            "Preset practice exams are included with a paid subscription. Your trial includes short topic and timed drills.",
          code: "TRIAL_PRESET_EXAM_LOCKED",
          plan,
          upgradeUrl: upgradeUrl(plan, "preset_exam"),
        },
        { status: 403 }
      ),
    };
  }

  if (input.fullLengthMock && !limits.allowFullLengthMocks) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          error:
            plan === "free"
              ? "Full-length mock exams require a Pro subscription."
              : "Full-length mock exams require a Pro subscription.",
          code: plan === "trial" ? "TRIAL_MOCK_LOCKED" : "PRO_MOCK_LOCKED",
          plan,
          upgradeUrl: upgradeUrl(plan, "full_mock"),
        },
        { status: 403 }
      ),
    };
  }

  if (
    input.fullAdaptiveMock &&
    plan === "trial" &&
    limits.trialFullAdaptiveAllowance != null &&
    snapshot.usedTrialFullAdaptive != null &&
    snapshot.usedTrialFullAdaptive >= limits.trialFullAdaptiveAllowance
  ) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          error: `Your trial includes ${limits.trialFullAdaptiveAllowance} full-length adaptive exam. Upgrade for unlimited full simulations.`,
          code: "TRIAL_FULL_ADAPTIVE_USED",
          plan,
          usedTrialFullAdaptive: snapshot.usedTrialFullAdaptive,
          trialFullAdaptiveAllowance: limits.trialFullAdaptiveAllowance,
          upgradeUrl: upgradeUrl(plan, "full_mock"),
        },
        { status: 403 }
      ),
    };
  }

  if (input.shortMock && !limits.allowShortMocks) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          error: "Mock exams unlock with a paid subscription.",
          code: "MOCK_LOCKED",
          plan,
          upgradeUrl: upgradeUrl(plan, "full_mock"),
        },
        { status: 403 }
      ),
    };
  }

  if (
    input.shortMock &&
    plan === "trial" &&
    limits.trialMockAllowance != null &&
    snapshot.usedTrialMocks != null &&
    snapshot.usedTrialMocks >= limits.trialMockAllowance
  ) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          error: `Your trial includes ${limits.trialMockAllowance} mock exam. Upgrade for unlimited mocks and full-length simulations.`,
          code: "TRIAL_MOCK_USED",
          plan,
          upgradeUrl: upgradeUrl(plan, "full_mock"),
        },
        { status: 403 }
      ),
    };
  }

  const allowedCount = clampStudySessionSize(plan, input.requestedCount, timed);

  if (!planHasQuestionAccessLimits(plan)) {
    return { ok: true, plan, allowedCount, snapshot };
  }

  if (
    limits.dailyQuestions != null &&
    snapshot.usedToday + allowedCount > limits.dailyQuestions
  ) {
    const remaining = snapshot.remainingToday ?? 0;
    return {
      ok: false,
      response: NextResponse.json(
        {
          error:
            remaining > 0
              ? `Daily question limit: ${remaining} remaining today on your ${plan} plan. Upgrade for more practice.`
              : `Daily question limit reached (${limits.dailyQuestions}/day on ${plan}). Upgrade for unlimited practice.`,
          code: "DAILY_QUESTION_LIMIT",
          plan,
          usedToday: snapshot.usedToday,
          dailyLimit: limits.dailyQuestions,
          remainingToday: remaining,
          upgradeUrl: upgradeUrl(plan, "daily_limit"),
        },
        { status: 429 }
      ),
    };
  }

  if (
    (plan === "trial" || plan === "free") &&
    limits.trialLifetimeQuestions != null &&
    snapshot.usedTrialTotal != null &&
    snapshot.usedTrialTotal + allowedCount > limits.trialLifetimeQuestions
  ) {
    const remaining = snapshot.remainingTrialTotal ?? 0;
    const label = plan === "free" ? "Free plan" : "Trial";
    return {
      ok: false,
      response: NextResponse.json(
        {
          error:
            remaining > 0
              ? `${label} allowance: ${remaining} questions left. Upgrade to keep studying.`
              : plan === "free"
                ? `You've used all ${limits.trialLifetimeQuestions} free questions. Upgrade to unlock unlimited practice.`
                : `You've used all ${limits.trialLifetimeQuestions} trial questions. Subscribe to unlock the full bank.`,
          code: plan === "free" ? "FREE_LIFETIME_LIMIT" : "TRIAL_LIFETIME_LIMIT",
          plan,
          usedTrialTotal: snapshot.usedTrialTotal,
          trialLimit: limits.trialLifetimeQuestions,
          remainingTrialTotal: remaining,
          upgradeUrl: upgradeUrl(plan, plan === "free" ? "free_total" : "trial_total"),
        },
        { status: 429 }
      ),
    };
  }

  return { ok: true, plan, allowedCount, snapshot };
}

export async function checkMockExamStart(input: {
  userId: string;
  access: UserAccess;
  questionCount: number;
  presetExam?: boolean;
  lengthPreset?: string;
}): Promise<StudyUsageCheckResult> {
  const isShortMock = input.lengthPreset === "50";
  const isFullLength =
    input.lengthPreset === "full" ||
    input.lengthPreset === "100" ||
    (!isShortMock && input.questionCount >= 100);

  if (input.presetExam) {
    return checkStudyQuestionUsage({
      userId: input.userId,
      access: input.access,
      requestedCount: input.questionCount,
      timedExam: true,
      presetExam: true,
    });
  }

  if (input.lengthPreset === "full") {
    return checkStudyQuestionUsage({
      userId: input.userId,
      access: input.access,
      requestedCount: input.questionCount,
      timedExam: true,
      fullLengthMock: true,
      fullAdaptiveMock: true,
    });
  }

  if (isFullLength) {
    return checkStudyQuestionUsage({
      userId: input.userId,
      access: input.access,
      requestedCount: input.questionCount,
      timedExam: true,
      fullLengthMock: true,
    });
  }

  if (isShortMock || input.questionCount >= MOCK_EXAM_MIN_QUESTIONS) {
    return checkStudyQuestionUsage({
      userId: input.userId,
      access: input.access,
      requestedCount: input.questionCount,
      timedExam: true,
      shortMock: true,
    });
  }

  return checkStudyQuestionUsage({
    userId: input.userId,
    access: input.access,
    requestedCount: input.questionCount,
    timedExam: true,
    presetExam: input.presetExam,
  });
}

export async function recordStudyQuestionsServed(
  userId: string,
  count: number,
  source: "bank" | "timed" | "adaptive" | "exam_session",
  plan?: StudyUsagePlan
): Promise<void> {
  if (count <= 0) return;
  if (plan && !planHasQuestionAccessLimits(plan)) return;
  await logActivity({
    userId,
    action: STUDY_USAGE_ACTION,
    summary: `Served ${count} study questions (${source})`,
    metadata: { count, source },
  });
}
