"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarClock, Check, ChevronDown } from "lucide-react";
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

function calendarDaysUntil(isoDate: string, now: number): number {
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const target = new Date(`${isoDate}T00:00:00`);
  return Math.round((target.getTime() - today.getTime()) / MS_DAY);
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
  const draftDirty = Boolean(draft && draft !== date);

  const summary = (() => {
    if (!date) return `Set your ${examName} exam date`;
    if (isPast) return `Exam date passed · ${formatExamDateLong(date)}`;
    if (isToday) return `Exam day — good luck`;
    if (calDays === 1) return `Exam tomorrow · ${formatExamDateLong(date)}`;
    return `Exam in ${calDays} days · ${formatExamDateLong(date)}`;
  })();

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
    <section className={cn(dbUi.surface, "px-4 py-3")}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2.5">
          <CalendarClock className="h-4 w-4 shrink-0 text-[var(--color-accent)]" aria-hidden />
          <p className="truncate text-[13px] font-medium text-[var(--color-ink)]">{summary}</p>
        </div>
        <button
          type="button"
          onClick={() => setEditing((v) => !v)}
          className="inline-flex items-center gap-1 text-[12px] font-semibold text-[var(--color-accent)] hover:underline"
        >
          {date ? (editing ? "Done" : "Change date") : "Set date"}
          <ChevronDown
            className={cn("h-3.5 w-3.5 transition-transform", editing && "rotate-180")}
            aria-hidden
          />
        </button>
      </div>

      {editing ? (
        <div className="mt-3 space-y-3 border-t border-[var(--color-border)]/50 pt-3">
          <ExamDatePicker
            value={draft || date || today}
            minDate={today}
            onChange={setDraft}
            ariaLabel={`${examName} test date`}
          />
          <div className="flex flex-wrap items-center gap-2">
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
                className="text-[12px] font-medium text-rose-600 hover:underline"
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
