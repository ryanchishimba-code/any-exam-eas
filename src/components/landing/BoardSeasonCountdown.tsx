"use client";

/**
 * BoardSeasonCountdown — subtle, evergreen urgency chip.
 *
 * Counts down to the next "board season" anchor (quarterly), so the urgency is
 * always real and never expires into the past. Label is derived from the target
 * date, e.g. "fall 2026 board season".
 */

import { useEffect, useState } from "react";
import { CalendarClock } from "lucide-react";
import { cn } from "@/lib/utils";

const SEASON_ANCHORS: { month: number; day: number; label: string }[] = [
  { month: 2, day: 1, label: "spring" }, // Mar 1
  { month: 5, day: 1, label: "summer" }, // Jun 1
  { month: 8, day: 1, label: "fall" }, // Sep 1
  { month: 11, day: 1, label: "winter" }, // Dec 1
];

function nextBoardSeason(now: Date): { target: Date; label: string } {
  for (let yearOffset = 0; yearOffset <= 1; yearOffset += 1) {
    const year = now.getFullYear() + yearOffset;
    for (const anchor of SEASON_ANCHORS) {
      const target = new Date(year, anchor.month, anchor.day, 0, 0, 0, 0);
      if (target.getTime() > now.getTime()) {
        return { target, label: `${anchor.label} ${year} board season` };
      }
    }
  }
  // Fallback (unreachable): one quarter out.
  const target = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 90);
  return { target, label: "next board season" };
}

function diffParts(ms: number) {
  const clamped = Math.max(0, ms);
  const days = Math.floor(clamped / (1000 * 60 * 60 * 24));
  const hours = Math.floor((clamped / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((clamped / (1000 * 60)) % 60);
  return { days, hours, minutes };
}

export function BoardSeasonCountdown({ className }: { className?: string }) {
  // Render a stable placeholder on the server / first paint to avoid hydration
  // mismatch, then fill in live values on the client.
  const [mounted, setMounted] = useState(false);
  const [season, setSeason] = useState(() => nextBoardSeason(new Date()));
  const [parts, setParts] = useState(() => diffParts(season.target.getTime() - Date.now()));

  useEffect(() => {
    setMounted(true);
    const tick = () => {
      const now = new Date();
      const next = nextBoardSeason(now);
      setSeason(next);
      setParts(diffParts(next.target.getTime() - now.getTime()));
    };
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3.5 py-1.5 text-xs font-semibold text-[var(--color-ink-muted)] shadow-[var(--shadow-apple-sm)]",
        className
      )}
      aria-live="off"
    >
      <CalendarClock className="h-3.5 w-3.5 text-[var(--color-accent)]" aria-hidden />
      <span className="text-[var(--color-ink)]">
        {mounted ? `${parts.days}d ${parts.hours}h ${parts.minutes}m` : "—"}
      </span>
      <span className="hidden sm:inline">until {season.label} — start today</span>
      <span className="sm:hidden">to {season.label}</span>
    </div>
  );
}
