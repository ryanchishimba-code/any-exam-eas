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
  if (access.plan === "trial") {
    const remaining =
      access.trialMockAllowance != null && access.usedTrialMocks != null
        ? Math.max(0, access.trialMockAllowance - access.usedTrialMocks)
        : access.trialMockAllowance;
    if (remaining === 0) {
      return "Your trial includes one 50-question mock. Upgrade for unlimited mocks and full-length exams.";
    }
    return "Trial includes one 50-question mock. 100-Q and full-length exams require Pro.";
  }
  if (access.plan === "basic") {
    return "Basic includes unlimited 50-question mocks. Full-length adaptive exams require Pro.";
  }
  return null;
}
