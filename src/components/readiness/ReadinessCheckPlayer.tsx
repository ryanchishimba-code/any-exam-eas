"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { dbUi } from "@/lib/study/dashboard-ui";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";

type Prompt = {
  itemId: string;
  index: number;
  total: number;
  areaLabel: string;
  stem: string;
  vignette: string | null;
  selection: "single" | "multi";
  options: string[];
};

type Feedback = {
  correct: boolean;
  lead: string;
  done: boolean;
  summaryLine?: string | null;
  overallLabel?: string | null;
};

export function ReadinessCheckPlayer({ previewPrompt = null }: { previewPrompt?: Prompt | null }) {
  const router = useRouter();
  const [prompt, setPrompt] = useState<Prompt | null>(previewPrompt);
  const [queued, setQueued] = useState<Prompt | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(!previewPrompt);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (previewPrompt) return;
    const controller = new AbortController();
    fetch("/api/readiness/check", { cache: "no-store", signal: controller.signal })
      .then(async (res) => {
        const body = (await res.json()) as { done?: boolean; prompt?: Prompt; error?: string };
        if (res.status === 404) {
          router.replace(ROUTES.readiness);
          return;
        }
        if (!res.ok) throw new Error(body.error || "Could not open the check.");
        if (body.done) {
          router.replace(ROUTES.readiness);
          return;
        }
        if (body.prompt) setPrompt(body.prompt);
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Could not open the check.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [previewPrompt, router]);

  function toggle(option: string) {
    if (feedback) return;
    setSelected((current) => {
      if (prompt?.selection === "multi") {
        return current.includes(option) ? current.filter((value) => value !== option) : [...current, option];
      }
      return [option];
    });
  }

  async function submit() {
    if (!prompt || selected.length === 0) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/readiness/check/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: prompt.itemId, selected }),
      });
      const body = (await res.json()) as Feedback & { prompt?: Prompt; error?: string };
      if (!res.ok) throw new Error(body.error || "Could not save that answer.");
      setFeedback({
        correct: body.correct,
        lead: body.lead,
        done: body.done,
        summaryLine: body.summaryLine,
        overallLabel: body.overallLabel,
      });
      if (!body.done && body.prompt) setQueued(body.prompt);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save that answer.");
    } finally {
      setSaving(false);
    }
  }

  function goNext() {
    if (feedback?.done || !queued) {
      router.push(ROUTES.readiness);
      return;
    }
    setPrompt(queued);
    setQueued(null);
    setSelected([]);
    setFeedback(null);
  }

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6" aria-busy="true" aria-label="Loading check">
        <div className="h-3 w-28 animate-pulse rounded-full bg-[var(--color-border)]/70" />
        <div className="mt-4 h-2 w-full animate-pulse rounded-full bg-[var(--color-border)]/60" />
        <div className="mt-6 h-24 animate-pulse rounded-2xl bg-[var(--color-border)]/50" />
        <div className="mt-4 space-y-2">
          <div className="h-14 animate-pulse rounded-2xl bg-[var(--color-border)]/40" />
          <div className="h-14 animate-pulse rounded-2xl bg-[var(--color-border)]/40" />
          <div className="h-14 animate-pulse rounded-2xl bg-[var(--color-border)]/40" />
        </div>
      </div>
    );
  }

  if (error && !prompt) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <p className="text-[17px] text-[var(--color-ink)]">{error}</p>
        <Link href={ROUTES.readiness} className={cn(dbUi.primaryBtn, "mt-6 min-h-11")}>
          Back to readiness
        </Link>
      </div>
    );
  }

  if (!prompt) return null;

  const progress = Math.max(0, Math.min(1, (prompt.index - (feedback ? 0 : 1)) / prompt.total));

  return (
    <div className="mx-auto flex min-h-[calc(100vh-var(--nav-height))] w-full max-w-2xl flex-col px-4 py-6 sm:px-6 sm:py-10">
      <div className="flex items-center justify-between gap-3">
        <p className={dbUi.eyebrow}>{prompt.areaLabel}</p>
        <p className="text-[13px] font-semibold tabular-nums text-[var(--color-ink-muted)]">
          {prompt.index} of {prompt.total}
        </p>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--color-border)]/60" aria-hidden>
        <div
          className="h-full rounded-full bg-[var(--color-accent)] transition-[width] duration-300 motion-reduce:transition-none"
          style={{ width: `${Math.round(progress * 100)}%` }}
        />
      </div>

      {prompt.vignette ? (
        <p className="mt-6 text-[15px] leading-relaxed text-[var(--color-ink-muted)]">{prompt.vignette}</p>
      ) : null}
      <h1 className="mt-4 text-[22px] font-semibold leading-snug tracking-[-0.03em] text-[var(--color-ink)] sm:text-[26px]">
        {prompt.stem}
      </h1>
      {prompt.selection === "multi" ? (
        <p className="mt-2 text-[13px] text-[var(--color-ink-muted)]">Select every answer that applies.</p>
      ) : null}

      <div className="mt-5 min-h-[240px] space-y-2" role={prompt.selection === "multi" ? "group" : "radiogroup"} aria-label="Answers">
        {prompt.options.map((option, index) => {
          const on = selected.includes(option);
          return (
            <button
              key={`${index}-${option.slice(0, 24)}`}
              type="button"
              role={prompt.selection === "multi" ? "checkbox" : "radio"}
              aria-checked={on}
              disabled={Boolean(feedback) || saving}
              onClick={() => toggle(option)}
              className={cn(
                "flex min-h-12 w-full items-start gap-3 rounded-2xl border px-4 py-3 text-left text-[16px] leading-snug transition active:scale-[0.99] disabled:active:scale-100",
                on
                  ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-ink)]"
                  : "border-[var(--color-border)] bg-[var(--color-surface-elevated)] text-[var(--color-ink)] hover:border-[var(--color-accent)]/40"
              )}
            >
              <span className="mt-0.5 w-5 shrink-0 text-[13px] font-semibold text-[var(--color-ink-muted)]">
                {index + 1}
              </span>
              <span>{option}</span>
            </button>
          );
        })}
      </div>

      {feedback ? (
        <div className="mt-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <p className="text-[15px] font-semibold text-[var(--color-ink)]">
            {feedback.correct ? "That's right" : "Not this time"}
          </p>
          <p className="mt-1 text-[14px] leading-relaxed text-[var(--color-ink-muted)]">{feedback.lead}</p>
          {feedback.done && feedback.summaryLine ? (
            <p className="mt-3 text-[15px] font-semibold tracking-tight text-[var(--color-ink)]">
              {feedback.overallLabel ? `${feedback.overallLabel}. ` : ""}
              {feedback.summaryLine}
            </p>
          ) : null}
        </div>
      ) : null}

      {error ? <p className="mt-3 text-[14px] text-[var(--color-ink)]">{error}</p> : null}

      <div className="mt-auto flex items-center justify-between gap-3 pt-6 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <Link href={ROUTES.readiness} className="text-[13px] font-semibold text-[var(--color-ink-muted)]">
          Save and leave
        </Link>
        {feedback ? (
          <button type="button" className={cn(dbUi.primaryBtn, "min-h-11")} onClick={goNext}>
            {feedback.done ? "See your levels" : "Next"}
          </button>
        ) : (
          <button
            type="button"
            className={cn(dbUi.primaryBtn, "min-h-11")}
            disabled={selected.length === 0 || saving}
            onClick={() => void submit()}
          >
            {saving ? "Checking…" : "Check answer"}
          </button>
        )}
      </div>
    </div>
  );
}
