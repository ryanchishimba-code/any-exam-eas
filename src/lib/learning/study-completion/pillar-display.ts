import type { StudyCompletionPillar } from "./compute-study-completion";

export function cappedPillarProgressPercent(pillar: StudyCompletionPillar): number {
  if (pillar.target <= 0) return pillar.done > 0 ? 100 : 0;
  const cappedDone = Math.min(pillar.done, pillar.target);
  return Math.min(100, Math.round((cappedDone / pillar.target) * 100));
}

export function pillarCountLabel(pillar: StudyCompletionPillar): {
  primary: string;
  extraDone: number | null;
} {
  const capped = pillar.target > 0 ? Math.min(pillar.done, pillar.target) : pillar.done;
  const extraDone = pillar.target > 0 && pillar.done > pillar.target ? pillar.done : null;
  const primary =
    pillar.met && pillar.target > 0
      ? `${capped.toLocaleString("en-US")} / ${pillar.target.toLocaleString("en-US")} ✓`
      : `${pillar.done.toLocaleString("en-US")} / ${pillar.target.toLocaleString("en-US")}`;
  return { primary, extraDone };
}
