"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarClock, Check, Pencil, X } from "lucide-react";
import { cn } from "@/lib/utils";

type DashboardExamCountdownProps = {
  examSlug: string;
  examName: string;
  testDate: string | null;
};

const MS = { day: 86_400_000, hour: 3_600_000, minute: 60_000 };

type TimeLeft = { days: number; hours: number; minutes: number; total: number };

/** Time remaining until the start of the test day (local). */
function timeLeft(isoDate: string, now: number): TimeLeft {
  const target = new Date(`${isoDate}T00:00:00`).getTime();
  const total = Math.max(0, target - now);
  return {
    days: Math.floor(total / MS.day),
    hours: Math.floor((total % MS.day) / MS.hour),
    minutes: Math.floor((total % MS.hour) / MS.minute),
    total,
  };
}

/** Whole calendar days between today and the test date (negative = past). */
function calendarDaysUntil(isoDate: string, now: number): number {
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const target = new Date(`${isoDate}T00:00:00`);
  return Math.round((target.getTime() - today.getTime()) / MS.day);
}

function formatLongDate(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00`).toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function DashboardExamCountdown({ examSlug, examName, testDate }: DashboardExamCountdownProps) {
  const router = useRouter();
  const [date, setDate] = useState<string | null>(testDate);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(testDate ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    setDate(testDate);
    setDraft(testDate ?? "");
  }, [testDate]);

  // Live tick every second so minutes/hours count down in real time.
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const today = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }, []);

  const left = date ? timeLeft(date, now) : null;
  const calDays = date ? calendarDaysUntil(date, now) : null;
  const isPast = calDays != null && calDays < 0;
  const isToday = calDays === 0;
  const hasActiveCountdown = !!date && !isPast && !isToday && !editing;

  // Urgency theming drives the gradient + numeral color.
  const urgency = (() => {
    if (!date || isPast) return "neutral" as const;
    if (isToday || (calDays != null && calDays <= 7)) return "hot" as const;
    if (calDays != null && calDays <= 30) return "warm" as const;
    return "cool" as const;
  })();

  const theme = {
    neutral: {
      card: "from-slate-50 to-white",
      glow: "bg-slate-300/30",
      num: "text-[var(--color-ink)]",
      ring: "border-black/[0.06]",
      chip: "bg-black/[0.04] text-[var(--color-ink-muted)]",
    },
    cool: {
      card: "from-[var(--color-accent)]/[0.10] via-sky-50 to-white",
      glow: "bg-[var(--color-accent)]/25",
      num: "text-[var(--color-accent)]",
      ring: "border-[var(--color-accent)]/15",
      chip: "bg-[var(--color-accent)]/10 text-[var(--color-accent)]",
    },
    warm: {
      card: "from-amber-100/70 via-amber-50 to-white",
      glow: "bg-amber-300/40",
      num: "text-amber-600",
      ring: "border-amber-200/70",
      chip: "bg-amber-100 text-amber-700",
    },
    hot: {
      card: "from-rose-100/70 via-rose-50 to-white",
      glow: "bg-rose-300/40",
      num: "text-rose-600",
      ring: "border-rose-200/70",
      chip: "bg-rose-100 text-rose-700",
    },
  }[urgency];

  const statusChip = (() => {
    if (!date) return "Not set";
    if (isPast) return "Date passed";
    if (isToday) return "Test day!";
    if (calDays === 1) return "Tomorrow";
    if (calDays != null && calDays <= 7) return "Final stretch";
    return `${calDays} days`;
  })();

  const segments: { value: string; label: string }[] = [
    { value: String(left?.days ?? 0), label: "Days" },
    { value: String(left?.hours ?? 0).padStart(2, "0"), label: "Hours" },
    { value: String(left?.minutes ?? 0).padStart(2, "0"), label: "Minutes" },
  ];

  async function save(next: string | null) {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/user/exam-date", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ examSlug, testDate: next }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        throw new Error(typeof data.error === "string" ? data.error : "Could not save test date.");
      }
      setDate(data.testDate ?? null);
      setDraft(data.testDate ?? "");
      setEditing(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save test date.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-[26px] border bg-gradient-to-br p-5 shadow-[var(--shadow-apple-sm)] sm:p-6",
        theme.card,
        theme.ring
      )}
    >
      {/* Ambient depth */}
      <div
        className={cn("pointer-events-none absolute -right-10 -top-12 h-44 w-44 rounded-full blur-3xl", theme.glow)}
        aria-hidden
      />
      <div
        className={cn("pointer-events-none absolute -bottom-16 -left-10 h-40 w-40 rounded-full blur-3xl opacity-60", theme.glow)}
        aria-hidden
      />

      <div className="relative">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-white/70 text-[var(--color-ink)] shadow-[var(--shadow-apple-sm)] backdrop-blur">
              <CalendarClock className={cn("h-5 w-5", theme.num)} aria-hidden />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
                  Countdown to exam day
                </p>
                <span className={cn("rounded-full px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-wide", theme.chip)}>
                  {statusChip}
                </span>
              </div>
              <p className="mt-0.5 text-sm font-medium text-[var(--color-ink)]">
                {date
                  ? isPast
                    ? `${examName} · ${formatLongDate(date)}`
                    : isToday
                      ? `Today is the day — good luck with your ${examName}!`
                      : `${examName} · ${formatLongDate(date)}`
                  : `Set your ${examName} date to start the countdown.`}
              </p>
            </div>
          </div>

          {date && !editing && (
            <button
              type="button"
              onClick={() => {
                setDraft(date);
                setEditing(true);
              }}
              className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-white/70 px-3 py-1.5 text-xs font-medium text-[var(--color-ink)] backdrop-blur transition hover:border-black/[0.18]"
            >
              <Pencil className="h-3.5 w-3.5" aria-hidden />
              Edit
            </button>
          )}
        </div>

        {/* Timer */}
        <div className="mt-5 flex items-end gap-2 sm:gap-3">
          {segments.map((seg, i) => (
            <div key={seg.label} className="flex items-end gap-2 sm:gap-3">
              {i > 0 && (
                <span
                  className={cn(
                    "pb-7 text-2xl font-light leading-none sm:text-3xl",
                    hasActiveCountdown ? theme.num : "text-[var(--color-ink-muted)]/40"
                  )}
                  aria-hidden
                >
                  :
                </span>
              )}
              <div
                className={cn(
                  "min-w-[4.25rem] rounded-2xl border border-white/60 bg-white/70 px-2 py-3 text-center shadow-[var(--shadow-apple-sm)] backdrop-blur sm:min-w-[5.5rem] sm:py-4",
                  !hasActiveCountdown && "opacity-70"
                )}
              >
                <span
                  className={cn(
                    "block font-semibold tabular-nums leading-none tracking-tight",
                    "text-4xl sm:text-5xl",
                    hasActiveCountdown ? theme.num : "text-[var(--color-ink-muted)]"
                  )}
                >
                  {seg.value}
                </span>
                <span className="mt-2 block text-[0.625rem] font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">
                  {seg.label}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Set / edit controls */}
        {(editing || !date) && (
          <div className="mt-5 flex flex-wrap items-center gap-2 rounded-2xl border border-white/60 bg-white/60 p-3 backdrop-blur">
            <input
              type="date"
              value={draft}
              min={today}
              disabled={saving}
              onChange={(e) => setDraft(e.target.value)}
              className="apple-input max-w-[12rem] bg-white"
            />
            <button
              type="button"
              disabled={saving || !draft}
              onClick={() => save(draft)}
              className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-accent)] px-4 py-2 text-xs font-semibold text-white shadow-[var(--shadow-apple-sm)] transition hover:opacity-90 disabled:opacity-50"
            >
              <Check className="h-3.5 w-3.5" aria-hidden />
              {saving ? "Saving…" : date ? "Update date" : "Start countdown"}
            </button>
            {editing && (
              <button
                type="button"
                disabled={saving}
                onClick={() => {
                  setEditing(false);
                  setDraft(date ?? "");
                  setError("");
                }}
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium text-[var(--color-ink-muted)] transition hover:text-[var(--color-ink)]"
              >
                <X className="h-3.5 w-3.5" aria-hidden />
                Cancel
              </button>
            )}
            {date && editing && (
              <button
                type="button"
                disabled={saving}
                onClick={() => save(null)}
                className="ml-auto text-xs font-medium text-rose-600 transition hover:underline"
              >
                Clear date
              </button>
            )}
          </div>
        )}

        {error && <p className="mt-2 text-xs font-medium text-rose-600">{error}</p>}
      </div>
    </section>
  );
}
