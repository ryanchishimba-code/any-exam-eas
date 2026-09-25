"use client";

import { useState } from "react";
import { dbUi } from "@/lib/study/dashboard-ui";
import { cn } from "@/lib/utils";

export type OutcomeChoice = "passed" | "not_yet" | "not_taken";

const CHOICES: { id: OutcomeChoice; label: string; hint: string }[] = [
  { id: "passed", label: "Passed", hint: "The result this work was for" },
  { id: "not_yet", label: "Didn't pass yet", hint: "We'll set a fresh start" },
  { id: "not_taken", label: "Haven't taken it", hint: "Ask again later" },
];

export function ExamOutcomeForm({
  examName,
  examDate,
  compact = false,
  onSubmit,
}: {
  examName: string;
  examDate: string | null;
  compact?: boolean;
  onSubmit: (result: OutcomeChoice, examDate: string | null) => Promise<void>;
}) {
  const [date, setDate] = useState(examDate ?? "");
  const [pending, setPending] = useState<OutcomeChoice | null>(null);
  const [error, setError] = useState("");

  async function choose(result: OutcomeChoice) {
    setError("");
    setPending(result);
    try {
      await onSubmit(result, date.trim() ? date : null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save that.");
      setPending(null);
    }
  }

  return (
    <div>
      <p className={dbUi.eyebrow}>After the exam</p>
      <h2 className={cn(compact ? "mt-1 text-[22px]" : "mt-2 text-[28px] sm:text-[32px]", "font-semibold tracking-[-0.035em] text-[var(--color-ink)]")}>
        How did your {examName} go?
      </h2>
      <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-[var(--color-ink-muted)]">
        Optional, and only for you. It helps us learn whether these levels match real results. Nothing here is posted publicly.
      </p>
      <label className="mt-4 block text-[13px] font-medium text-[var(--color-ink)]" htmlFor="readiness-exam-date">
        Exam date
        <input
          id="readiness-exam-date"
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
          className="mt-1.5 block w-full max-w-xs rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-[15px] text-[var(--color-ink)]"
        />
      </label>
      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        {CHOICES.map((choice) => (
          <button
            key={choice.id}
            type="button"
            disabled={pending != null}
            onClick={() => void choose(choice.id)}
            className={cn(
              "min-h-11 rounded-2xl border px-3 py-3 text-left transition active:scale-[0.99] disabled:opacity-60",
              choice.id === "passed"
                ? "border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 hover:border-[var(--color-accent)]"
                : "border-[var(--db-line,var(--color-border))]/80 bg-[var(--color-surface)] hover:border-[var(--color-accent)]/40"
            )}
          >
            <span className="block text-[15px] font-semibold tracking-tight text-[var(--color-ink)]">
              {pending === choice.id ? "Saving…" : choice.label}
            </span>
            <span className="mt-0.5 block text-[12px] leading-snug text-[var(--color-ink-muted)]">{choice.hint}</span>
          </button>
        ))}
      </div>
      {error ? <p className="mt-3 text-[13px] text-[var(--color-ink)]">{error}</p> : null}
    </div>
  );
}
