import type { StudyUsageLimits, StudyUsagePlan } from "@/lib/study/usage-limits-config";

/** Client/server mock access for full-exam launcher UI. */
export type MockExamAccess = {
  plan: StudyUsagePlan;
  allowShortMocks: boolean;
  allowFullLengthMocks: boolean;
  trialMockAllowance: number | null;
  usedTrialMocks: number | null;
};

export function resolveMockExamAccess(
  limits: StudyUsageLimits,
  plan: StudyUsagePlan,
  opts?: { usedTrialMocks?: number | null }
): MockExamAccess {
  const usedTrialMocks = opts?.usedTrialMocks ?? null;
  return {
    plan,
    allowShortMocks: limits.allowShortMocks,
    allowFullLengthMocks: limits.allowFullLengthMocks,
    trialMockAllowance: limits.trialMockAllowance,
    usedTrialMocks,
  };
}

export function filterLengthOptionsForAccess<T extends { preset: string }>(
  options: T[],
  access: MockExamAccess
): T[] {
  if (access.allowFullLengthMocks) return options;
  if (access.allowShortMocks) {
    return options.filter((o) => o.preset === "50");
  }
  return options.filter((o) => o.preset === "50");
}

export function defaultMockPresetForAccess(
  access: MockExamAccess
): "50" | "100" | "full" {
  if (access.allowFullLengthMocks) return "full";
  return "50";
}

export function mockPresetLockedMessage(access: MockExamAccess): string | null {
  if (access.allowFullLengthMocks) return null;
  if (access.plan === "free") {
    return "Full-length mock exams require a Pro subscription.";
  }
  return "Mock exams require a Pro subscription.";
}
