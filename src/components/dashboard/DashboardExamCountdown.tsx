"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarClock, Check, Pencil, X } from "lucide-react";
import { dbUi } from "@/lib/study/dashboard-ui";
import { cn } from "@/lib/utils";

type DashboardExamCountdownProps = {
  examSlug: string;
  examName: string;
  testDate: string | null;
};

const MS = { day: 86_400_000, hour: 3_600_000, minute: 60_000 };

type TimeLeft = { days: number; hours: number; minutes: number; total: number };

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

  const statusChip = (() => {
    if (!date) return "Not set";
    if (isPast) return "Date passed";
    if (isToday) return "Test day";
    if (calDays === 1) return "Tomorrow";
    if (calDays != null && calDays <= 7) return "Final stretch";
    return `${calDays} days`;
  })();

  const segments: { value: string; label: string }[] = [
    { value: String(left?.days ?? 0), label: "Days" },
    { value: String(left?.hours ?? 0).padStart(2, "0"), label: "Hours" },
    { value: String(left?.minutes ?? 0).padStart(2, "0"), label: "Min" },
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
    <section className={cn(dbUi.surface, "p-4 sm:p-5")}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--color-surface)] text-[var(--color-accent)]">
            <CalendarClock className="h-4 w-4" aria-hidden />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className={dbUi.eyebrow}>Exam countdown</p>
              <span className={dbUi.statPill}>{statusChip}</span>
            </div>
            <p className="mt-1 text-[13px] font-medium text-[var(--color-ink)]">
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

        {date && !editing ? (
          <button type="button" onClick={() => { setDraft(date); setEditing(true); }} className={dbUi.ghostBtn}>
            <Pencil className="h-3 w-3" aria-hidden />
            Edit
          </button>
        ) : null}
      </div>

      <div className="mt-4 flex items-end gap-2 sm:gap-3">
        {segments.map((seg, i) => (
          <div key={seg.label} className="flex items-end gap-2 sm:gap-3">
            {i > 0 ? (
              <span
                className={cn(
                  "pb-5 text-lg font-light text-[var(--color-ink-muted)]/30",
                  !hasActiveCountdown && "opacity-50"
                )}
                aria-hidden
              >
                :
              </span>
            ) : null}
            <div className="text-center">
              <span
                className={cn(
                  "block text-2xl font-semibold tabular-nums leading-none sm:text-3xl",
                  hasActiveCountdown ? "text-[var(--color-ink)]" : "text-[var(--color-ink-muted)]"
                )}
              >
                {seg.value}
              </span>
              <span className="mt-1 block text-[10px] font-medium uppercase tracking-wide text-[var(--color-ink-muted)]">
                {seg.label}
              </span>
            </div>
          </div>
        ))}
      </div>

      {(editing || !date) && (
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[var(--color-border)]/60 pt-4">
          <input
            type="date"
            value={draft}
            min={today}
            disabled={saving}
            onChange={(e) => setDraft(e.target.value)}
            className="apple-input max-w-[12rem] bg-[var(--color-surface-elevated)]"
          />
          <button
            type="button"
            disabled={saving || !draft}
            onClick={() => save(draft)}
            className={dbUi.primaryBtn}
          >
            <Check className="h-3.5 w-3.5" aria-hidden />
            {saving ? "Saving…" : date ? "Update date" : "Start countdown"}
          </button>
          {editing ? (
            <button
              type="button"
              disabled={saving}
              onClick={() => {
                setEditing(false);
                setDraft(date ?? "");
                setError("");
              }}
              className="inline-flex items-center gap-1 px-2 py-2 text-[12px] font-medium text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
            >
              <X className="h-3.5 w-3.5" aria-hidden />
              Cancel
            </button>
          ) : null}
          {date && editing ? (
            <button
              type="button"
              disabled={saving}
              onClick={() => save(null)}
              className="ml-auto text-[12px] font-medium text-rose-600 hover:underline"
            >
              Clear date
            </button>
          ) : null}
        </div>
      )}

      {error ? <p className="mt-2 text-[12px] font-medium text-rose-600">{error}</p> : null}
    </section>
  );
}
