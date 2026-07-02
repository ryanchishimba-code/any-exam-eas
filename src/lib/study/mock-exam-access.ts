import type { StudyUsageLimits, StudyUsagePlan } from "@/lib/study/usage-limits-config";

/** Client/server mock access for full-exam launcher UI. */
export type MockExamAccess = {
  plan: StudyUsagePlan;
  allowShortMocks: boolean;
  allowFullLengthMocks: boolean;
  trialMockAllowance: number | null;
  usedTrialMocks: number | null;
  trialFullAdaptiveAllowance: number | null;
  usedTrialFullAdaptive: number | null;
};

export function isTrialFullAdaptiveExhausted(access: MockExamAccess): boolean {
  return (
    access.trialFullAdaptiveAllowance != null &&
    access.usedTrialFullAdaptive != null &&
    access.usedTrialFullAdaptive >= access.trialFullAdaptiveAllowance
  );
}

export function resolveMockExamAccess(
  limits: StudyUsageLimits,
  plan: StudyUsagePlan,
  opts?: {
    usedTrialMocks?: number | null;
    usedTrialFullAdaptive?: number | null;
  }
): MockExamAccess {
  const usedTrialMocks = opts?.usedTrialMocks ?? null;
  const usedTrialFullAdaptive = opts?.usedTrialFullAdaptive ?? null;
  return {
    plan,
    allowShortMocks: limits.allowShortMocks,
    allowFullLengthMocks: limits.allowFullLengthMocks,
    trialMockAllowance: limits.trialMockAllowance,
    usedTrialMocks,
    trialFullAdaptiveAllowance: limits.trialFullAdaptiveAllowance,
    usedTrialFullAdaptive,
  };
}

export function filterLengthOptionsForAccess<T extends { preset: string }>(
  options: T[],
  access: MockExamAccess
): T[] {
  let filtered = options;
  if (!access.allowFullLengthMocks) {
    filtered = access.allowShortMocks
      ? filtered.filter((o) => o.preset === "50")
      : filtered.filter((o) => o.preset === "50");
  }
  if (isTrialFullAdaptiveExhausted(access)) {
    filtered = filtered.filter((o) => o.preset !== "full");
  }
  return filtered;
}

export function defaultMockPresetForAccess(
  access: MockExamAccess
): "50" | "100" | "full" {
  if (access.allowFullLengthMocks && !isTrialFullAdaptiveExhausted(access)) return "full";
  if (access.allowShortMocks && access.allowFullLengthMocks) return "100";
  return "50";
}

export function mockPresetLockedMessage(access: MockExamAccess): string | null {
  if (isTrialFullAdaptiveExhausted(access)) {
    return "Your trial includes 1 full-length adaptive exam.";
  }
  if (access.allowFullLengthMocks) return null;
  if (access.plan === "free") {
    return "Full-length mock exams require a Pro subscription.";
  }
  return "Mock exams require a Pro subscription.";
}
