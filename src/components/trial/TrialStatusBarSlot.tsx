import { TrialStatusBar } from "@/components/trial/TrialStatusBar";
import { getUserExamPreference } from "@/lib/edtech/exam-preference";
import { loadTrialStatusBar } from "@/lib/trial/load-trial-status-bar";

export async function TrialStatusBarSlot({ userId }: { userId: string }) {
  const [model, pref] = await Promise.all([
    loadTrialStatusBar(userId),
    getUserExamPreference(userId).catch(() => null),
  ]);
  if (!model) return null;
  return <TrialStatusBar model={model} examSlug={pref?.examSlug ?? null} />;
}
