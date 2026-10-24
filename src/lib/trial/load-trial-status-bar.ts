import { getUserAccess } from "@/lib/access-control";
import { getStudyUsageSnapshot } from "@/lib/study/usage-limits";
import { buildTrialStatusBarModel, type TrialStatusBarModel } from "@/lib/trial/trial-status";

export async function loadTrialStatusBar(userId: string): Promise<TrialStatusBarModel | null> {
  try {
    const access = await getUserAccess(userId);
    if (access.role !== "trial" || !access.subscription.trialEndsAt) return null;
    const usage = await getStudyUsageSnapshot(access);
    const used = usage.usedTrialTotal ?? 0;
    return buildTrialStatusBarModel({
      trialEndsAt: new Date(access.subscription.trialEndsAt),
      usedTrialTotal: used,
    });
  } catch (error) {
    console.warn(
      "[trialStatusBar] unavailable:",
      error instanceof Error ? error.message : error
    );
    return null;
  }
}
