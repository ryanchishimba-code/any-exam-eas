import type { MonitorTone, TileMark } from "@/lib/daily-vitals/types";

export type MonitorReading = {
  hr: number;
  label: string;
  tone: MonitorTone;
};

const MAX_TRIES = 6;

/**
 * The trace calms as a guess gets closer. Correct spots count fully.
 * A letter in the word but in the wrong spot counts a little.
 * The calmest reading on the screen is the one we show.
 */
export function monitorReading(rows: TileMark[][], length: number, solved: boolean): MonitorReading {
  if (solved) return { hr: 86, label: "Stable", tone: "ok" };
  let best = 0;
  for (const row of rows) {
    const correct = row.filter((mark) => mark === "correct").length;
    const present = row.filter((mark) => mark === "present").length;
    best = Math.max(best, correct + present * 0.35);
  }
  const ratio = length > 0 ? best / length : 0;
  if (ratio <= 0) return { hr: 128, label: "Unstable", tone: "alarm" };
  const hr = Math.max(86, Math.round(128 - ratio * 40));
  if (ratio < 0.9) return { hr, label: "Improving", tone: "warn" };
  return { hr, label: "Stable", tone: "ok" };
}

export function triesLeftLabel(used: number): string {
  const current = Math.min(MAX_TRIES, used + 1);
  return `${current}/${MAX_TRIES}`;
}

export const DAILY_VITALS_TRIES = MAX_TRIES;
