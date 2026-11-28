import { DailyVitalsPlayer } from "@/components/daily-vitals/DailyVitalsPlayer";
import { toPublicPuzzle } from "@/lib/daily-vitals/bank";
import { todayIsoCentral } from "@/lib/daily-vitals/schedule";

export function DailyVitalsDay({ date }: { date: string }) {
  const now = new Date();
  const puzzle = toPublicPuzzle(date, now);
  if (!puzzle) return null;
  return <DailyVitalsPlayer puzzle={puzzle} today={todayIsoCentral(now)} />;
}
