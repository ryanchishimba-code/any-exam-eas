"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CalendarClock, Check, Sparkles } from "lucide-react";
import { ExamDatePicker } from "@/components/edtech/ExamDatePicker";
import { formatExamDateLong, todayIso } from "@/lib/edtech/exam-date-utils";
import { dbUi } from "@/lib/study/dashboard-ui";
import { cn } from "@/lib/utils";

type DashboardExamCountdownProps = {
  examSlug: string;
  examName: string;
  testDate: string | null;
};

const MS = { day: 86_400_000, hour: 3_600_000, minute: 60_000 };

type TimeLeft = { days: number; hours: number; minutes: number; total: number };
type UrgencyTone = "calm" | "focus" | "urgent" | "today" | "past" | "unset";

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

function urgencyTone(calDays: number | null, hasDate: boolean): UrgencyTone {
  if (!hasDate) return "unset";
  if (calDays == null) return "unset";
  if (calDays < 0) return "past";
  if (calDays === 0) return "today";
  if (calDays <= 3) return "urgent";
  if (calDays <= 14) return "focus";
  return "calm";
}

const TONE_STYLES: Record<
  UrgencyTone,
  { shell: string; glow: string; chip: string; digit: string; separator: string }
> = {
  unset: {
    shell:
      "border-[var(--color-border)]/60 bg-[var(--color-surface-elevated)]",
    glow: "",
    chip: "bg-[var(--color-surface)] text-[var(--color-ink-muted)]",
    digit: "text-[var(--color-ink-muted)]",
    separator: "text-[var(--color-ink-muted)]/25",
  },
  calm: {
    shell:
      "border-teal-400/25 bg-gradient-to-br from-teal-500/[0.08] via-[var(--color-surface-elevated)] to-cyan-500/[0.06]",
    glow: "from-teal-400/20 via-transparent to-cyan-400/10",
    chip: "bg-teal-500/12 text-teal-700 dark:text-teal-300",
    digit: "from-teal-600 via-teal-500 to-cyan-500 dark:from-teal-300 dark:via-teal-200 dark:to-cyan-300",
    separator: "text-teal-500/35",
  },
  focus: {
    shell:
      "border-violet-400/30 bg-gradient-to-br from-violet-500/[0.1] via-[var(--color-surface-elevated)] to-fuchsia-500/[0.06]",
    glow: "from-violet-400/25 via-transparent to-fuchsia-400/12",
    chip: "bg-violet-500/12 text-violet-700 dark:text-violet-300",
    digit: "from-violet-600 via-purple-500 to-fuchsia-500 dark:from-violet-300 dark:via-purple-200 dark:to-fuchsia-300",
    separator: "text-violet-500/40",
  },
  urgent: {
    shell:
      "border-amber-400/35 bg-gradient-to-br from-amber-500/[0.12] via-[var(--color-surface-elevated)] to-orange-500/[0.08]",
    glow: "from-amber-400/30 via-transparent to-orange-400/15",
    chip: "bg-amber-500/15 text-amber-800 dark:text-amber-300",
    digit: "from-amber-600 via-orange-500 to-rose-500 dark:from-amber-300 dark:via-orange-200 dark:to-rose-300",
    separator: "text-amber-500/45",
  },
  today: {
    shell:
      "border-emerald-400/40 bg-gradient-to-br from-emerald-500/[0.14] via-[var(--color-surface-elevated)] to-teal-500/[0.1]",
    glow: "from-emerald-400/35 via-transparent to-teal-400/18",
    chip: "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300",
    digit: "from-emerald-600 via-teal-500 to-cyan-500 dark:from-emerald-300 dark:via-teal-200 dark:to-cyan-300",
    separator: "text-emerald-500/45",
  },
  past: {
    shell: "border-[var(--color-border)]/60 bg-[var(--color-surface-elevated)]",
    glow: "",
    chip: "bg-[var(--color-surface)] text-[var(--color-ink-muted)]",
    digit: "text-[var(--color-ink-muted)]",
    separator: "text-[var(--color-ink-muted)]/25",
  },
};

function CountdownDigit({
  value,
  label,
  active,
  digitClass,
}: {
  value: string;
  label: string;
  active: boolean;
  digitClass: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="flex flex-col items-center">
      <div
        className={cn(
          "relative flex min-w-[4.25rem] items-center justify-center rounded-2xl border px-3 py-3 sm:min-w-[4.75rem] sm:px-4 sm:py-3.5",
          active
            ? "border-white/40 bg-white/55 shadow-[0_8px_32px_-8px_rgba(20,184,166,0.45)] backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.06]"
            : "border-[var(--color-border)]/40 bg-[var(--color-surface)]/50"
        )}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={value}
            initial={reduceMotion ? false : { opacity: 0, y: 8, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -8, scale: 0.92 }}
            transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
            className={cn(
              "block text-3xl font-extrabold tabular-nums leading-none tracking-tight sm:text-4xl",
              active && digitClass.includes("from-")
                ? cn("bg-gradient-to-br bg-clip-text text-transparent", digitClass)
                : digitClass
            )}
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="mt-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
        {label}
      </span>
    </div>
  );
}

export function DashboardExamCountdown({ examSlug, examName, testDate }: DashboardExamCountdownProps) {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [date, setDate] = useState<string | null>(testDate);
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

  const today = useMemo(() => todayIso(), []);

  const left = date ? timeLeft(date, now) : null;
  const calDays = date ? calendarDaysUntil(date, now) : null;
  const isPast = calDays != null && calDays < 0;
  const isToday = calDays === 0;
  const hasActiveCountdown = !!date && !isPast && !isToday;
  const tone = urgencyTone(calDays, !!date);
  const styles = TONE_STYLES[tone];
  const draftDirty = Boolean(draft && draft !== date);

  const statusChip = (() => {
    if (!date) return "Not set";
    if (isPast) return "Date passed";
    if (isToday) return "Test day";
    if (calDays === 1) return "Tomorrow";
    if (calDays != null && calDays <= 7) return "Final stretch";
    if (calDays != null && calDays <= 30) return "On track";
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
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save test date.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className={cn("relative overflow-hidden rounded-2xl border p-4 sm:p-5", styles.shell)}>
      {styles.glow ? (
        <div
          className={cn(
            "pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br opacity-80",
            styles.glow
          )}
          aria-hidden
        />
      ) : null}
      {!reduceMotion && hasActiveCountdown ? (
        <motion.div
          className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-teal-400/20 blur-3xl"
          animate={{ scale: [1, 1.12, 1], opacity: [0.35, 0.55, 0.35] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden
        />
      ) : null}

      <div className="relative flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm",
              hasActiveCountdown
                ? "bg-gradient-to-br from-teal-500 to-cyan-500 text-white"
                : "bg-[var(--color-surface)] text-[var(--color-accent)]"
            )}
          >
            {hasActiveCountdown ? (
              <Sparkles className="h-4 w-4" aria-hidden />
            ) : (
              <CalendarClock className="h-4 w-4" aria-hidden />
            )}
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className={dbUi.eyebrow}>Exam countdown</p>
              <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold", styles.chip)}>
                {statusChip}
              </span>
            </div>
            <p className="mt-1 text-[13px] font-medium text-[var(--color-ink)] sm:text-[14px]">
              {date
                ? isPast
                  ? `${examName} · ${formatExamDateLong(date)}`
                  : isToday
                    ? `Today is the day — good luck with your ${examName}!`
                    : `${examName} · ${formatExamDateLong(date)}`
                : `Choose your ${examName} test date below.`}
            </p>
          </div>
        </div>
      </div>

      <div className="relative mt-5 flex items-center justify-center gap-2 sm:gap-3">
        {segments.map((seg, i) => (
          <div key={seg.label} className="flex items-center gap-2 sm:gap-3">
            {i > 0 ? (
              <motion.span
                className={cn("pb-6 text-2xl font-light sm:text-3xl", styles.separator)}
                animate={
                  hasActiveCountdown && !reduceMotion
                    ? { opacity: [0.35, 0.85, 0.35] }
                    : undefined
                }
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                aria-hidden
              >
                :
              </motion.span>
            ) : null}
            <CountdownDigit
              value={seg.value}
              label={seg.label}
              active={hasActiveCountdown}
              digitClass={hasActiveCountdown ? styles.digit : "text-[var(--color-ink-muted)]"}
            />
          </div>
        ))}
      </div>

      <div className="relative mt-5 space-y-4 border-t border-[var(--color-border)]/50 pt-5">
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
            className={cn(
              dbUi.primaryBtn,
              "bg-gradient-to-r from-teal-600 to-cyan-600 shadow-[0_8px_24px_-8px_rgba(20,184,166,0.55)]"
            )}
          >
            <Check className="h-3.5 w-3.5" aria-hidden />
            {saving ? "Saving…" : date ? (draftDirty ? "Update date" : "Date saved") : "Start countdown"}
          </button>
          {date ? (
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
      </div>

      {error ? <p className="relative mt-2 text-[12px] font-medium text-rose-600">{error}</p> : null}
    </section>
  );
}
