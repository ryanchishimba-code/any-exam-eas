"use client";

import { useEffect, useState } from "react";
import { ExamOutcomeForm, type OutcomeChoice } from "@/components/readiness/ExamOutcomeForm";
import type { ExamSlug } from "@/types/edtech";
import { EXAM_CATALOG } from "@/lib/edtech/exams";

export function SettingsExamOutcome({ examSlug }: { examSlug: ExamSlug }) {
  const [examDate, setExamDate] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [note, setNote] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/readiness", { cache: "no-store", signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) throw new Error("unavailable");
        return (await res.json()) as { examDate?: string | null };
      })
      .then((payload) => {
        if (!controller.signal.aborted) setExamDate(payload.examDate ?? null);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
      })
      .finally(() => {
        if (!controller.signal.aborted) setReady(true);
      });
    return () => controller.abort();
  }, [examSlug]);

  async function save(result: OutcomeChoice, date: string | null) {
    const res = await fetch("/api/readiness/outcome", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ result, examDate: date, examSlug }),
    });
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    if (!res.ok) throw new Error(body.error || "Could not save that.");
    setNote(
      result === "not_yet"
        ? "Saved. A new baseline and your focus areas are on the readiness page."
        : "Saved. This stays private."
    );
  }

  return (
    <section className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6 shadow-[var(--shadow-apple-sm)]">
      {ready ? (
        <ExamOutcomeForm examName={EXAM_CATALOG[examSlug].shortName} examDate={examDate} onSubmit={save} />
      ) : (
        <div className="h-48 animate-pulse rounded-2xl bg-[var(--color-border)]/40" aria-hidden />
      )}
      {note ? <p className="mt-4 text-[14px] leading-relaxed text-[var(--color-ink-muted)]">{note}</p> : null}
    </section>
  );
}
