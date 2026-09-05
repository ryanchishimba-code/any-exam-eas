"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarPlus, Check, ChevronDown } from "lucide-react";
import { ExamDatePicker } from "@/components/edtech/ExamDatePicker";
import { formatExamDateLong, todayIso } from "@/lib/edtech/exam-date-utils";
import { dbUi } from "@/lib/study/dashboard-ui";
import { cn } from "@/lib/utils";

type DashboardExamCountdownProps = {
  examSlug: string;
  examName: string;
  testDate: string | null;
};

const MS_DAY = 86_400_000;
const RING_SIZE = 136;
const RING_STROKE = 8;

function calendarDaysUntil(isoDate: string, now: number): number {
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const target = new Date(`${isoDate}T00:00:00`);
  return Math.round((target.getTime() - today.getTime()) / MS_DAY);
}

/** Soft progress around a 120-day planning horizon (Apple Fitness–style). */
function ringProgress(days: number | null): number {
  if (days == null) return 0.12;
  if (days <= 0) return 1;
  return Math.max(0.08, Math.min(1, 1 - days / 120));
}

export function DashboardExamCountdown({
  examSlug,
  examName,
  testDate,
}: DashboardExamCountdownProps) {
  const router = useRouter();
  const [date, setDate] = useState<string | null>(testDate);
  const [draft, setDraft] = useState(testDate ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [now] = useState(() => Date.now());

  useEffect(() => {
    setDate(testDate);
    setDraft(testDate ?? "");
  }, [testDate]);

  const today = useMemo(() => todayIso(), []);
  const calDays = date ? calendarDaysUntil(date, now) : null;
  const isPast = calDays != null && calDays < 0;
  const isToday = calDays === 0;
  const isUrgent = calDays != null && calDays > 0 && calDays <= 14;
  const draftDirty = Boolean(draft && draft !== date);

  const radius = (RING_SIZE - RING_STROKE) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = ringProgress(isPast ? 0 : calDays);
  const dashOffset = circumference * (1 - progress);

  const toneClass = !date
    ? "db-exam-day--empty"
    : isToday
      ? "db-exam-day--today"
      : isUrgent
        ? "db-exam-day--urgent"
        : "";

  const title = (() => {
    if (!date) return `When is your ${examName}?`;
    if (isPast) return "Exam date passed";
    if (isToday) return "Exam day";
    if (calDays === 1) return "Exam tomorrow";
    return `${calDays} days to go`;
  })();

  const meta = (() => {
    if (!date) return "Add your test date for a clearer study horizon.";
    if (isPast) return `${formatExamDateLong(date)} · update when you reschedule`;
    if (isToday) return `${examName} · you've got this`;
    return `${examName} · ${formatExamDateLong(date)}`;
  })();

  const countLabel = (() => {
    if (!date) return "—";
    if (isPast) return "0";
    if (isToday) return "0";
    return String(calDays);
  })();

  const countUnit = !date ? "set date" : isToday || isPast ? "today" : calDays === 1 ? "day" : "days";

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
      aria-labelledby="dashboard-exam-day-heading"
      className={cn("db-exam-day apple-animate-in", toneClass)}
    >
      <span className="db-exam-day__glow" aria-hidden />

      <div className="relative flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:gap-7">
        <div className="db-exam-day__ring" aria-hidden>
          <svg width={RING_SIZE} height={RING_SIZE} viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}>
            <circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={radius}
              fill="none"
              stroke="color-mix(in srgb, var(--color-border) 80%, transparent)"
              strokeWidth={RING_STROKE}
            />
            <circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={radius}
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth={RING_STROKE}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              transform={`rotate(-90 ${RING_SIZE / 2} ${RING_SIZE / 2})`}
              style={{
                transition: "stroke-dashoffset 700ms cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            />
          </svg>
          <div className="text-center">
            <span className="db-exam-day__count">{countLabel}</span>
            <span className="db-exam-day__count-unit">{countUnit}</span>
          </div>
        </div>

        <div className="db-exam-day__copy w-full text-center sm:text-left">
          <p className="db-exam-day__eyebrow">Exam day</p>
          <h2 id="dashboard-exam-day-heading" className="db-exam-day__title">
            {title}
          </h2>
          <p className="db-exam-day__meta">{meta}</p>

          <button
            type="button"
            onClick={() => setEditing((v) => !v)}
            className="db-exam-day__action"
          >
            {!date ? <CalendarPlus className="h-3.5 w-3.5" aria-hidden /> : null}
            {date ? (editing ? "Done" : "Change date") : "Set exam date"}
            <ChevronDown
              className={cn("h-3.5 w-3.5 transition-transform", editing && "rotate-180")}
              aria-hidden
            />
          </button>
        </div>
      </div>

      {editing ? (
        <div className="relative mt-5 space-y-3 border-t border-[var(--db-line)] pt-4">
          <ExamDatePicker
            value={draft || date || today}
            minDate={today}
            onChange={setDraft}
            ariaLabel={`${examName} test date`}
          />
          <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            <button
              type="button"
              disabled={saving || !draft || (!draftDirty && !!date)}
              onClick={() => save(draft)}
              className={dbUi.primaryBtn}
            >
              <Check className="h-3.5 w-3.5" aria-hidden />
              {saving ? "Saving…" : date ? "Update date" : "Save date"}
            </button>
            {date ? (
              <button
                type="button"
                disabled={saving}
                onClick={() => save(null)}
                className="text-[12px] font-medium text-rose-600/90 hover:underline"
              >
                Clear
              </button>
            ) : null}
          </div>
          {error ? <p className="text-[12px] font-medium text-rose-600">{error}</p> : null}
        </div>
      ) : null}
    </section>
  );
}
