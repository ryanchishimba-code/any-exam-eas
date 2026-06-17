import { NextResponse } from "next/server";
import { requirePremiumApi } from "@/lib/api-access";
import {
  getStudyUsageSnapshot,
  STUDY_USAGE_LIMITS,
} from "@/lib/study/usage-limits";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const premium = await requirePremiumApi(req);
  if (!premium.ok) return premium.response;

  const snapshot = await getStudyUsageSnapshot(premium.access);

  return NextResponse.json({
    plan: snapshot.plan,
    usedToday: snapshot.usedToday,
    remainingToday: snapshot.remainingToday,
    dailyLimit: snapshot.limits.dailyQuestions,
    usedTrialTotal: snapshot.usedTrialTotal,
    remainingTrialTotal: snapshot.remainingTrialTotal,
    trialLimit: snapshot.limits.trialLifetimeQuestions,
    mockExamsThisMonth: snapshot.mockExamsThisMonth,
    limits: {
      maxPerSession: snapshot.limits.maxPerSession,
      maxTimedExamLength: snapshot.limits.maxTimedExamLength,
      allowAdaptive: snapshot.limits.allowAdaptive,
      allowPresetExams: snapshot.limits.allowPresetExams,
      allowFullLengthMocks: snapshot.limits.allowFullLengthMocks,
    },
    allPlans: STUDY_USAGE_LIMITS,
  });
}
