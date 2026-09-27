"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { PASS_CHECK_IN_RESULT, type PassCheckInResult } from "@/lib/learning/pass-check-in";
import { isImmersiveAppRoute } from "@/lib/navigation/app-shell";

const CHOICES: { id: Exclude<PassCheckInResult, "dismissed">; label: string }[] = [
  { id: "passed", label: "Passed" },
  { id: "not_yet", label: "Didn't pass" },
  { id: "not_taken", label: "Haven't taken it yet" },
];

export function PassCheckInPrompt({
  examName,
  examSlug,
}: {
  examName: string | null;
  examSlug: string | null;
}) {
  const pathname = usePathname();
  const [pending, setPending] = useState<PassCheckInResult | null>(null);
  const [quoteFor, setQuoteFor] = useState<Extract<PassCheckInResult, "passed" | "not_yet"> | null>(null);
  const [quote, setQuote] = useState("");
  const [consent, setConsent] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  if (done || isImmersiveAppRoute(pathname)) return null;

  async function save(result: PassCheckInResult, withQuote: boolean) {
    setError("");
    setPending(result);
    try {
      const res = await fetch("/api/pass-check-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          result,
          examSlug,
          quote: withQuote ? quote : "",
          shareQuoteConsent: withQuote && consent,
        }),
      });
      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || "Could not save that.");
      }
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save that.");
      setPending(null);
    }
  }

  function choose(result: Exclude<PassCheckInResult, "dismissed">) {
    if (result === PASS_CHECK_IN_RESULT.not_taken) {
      void save(result, false);
      return;
    }
    setQuoteFor(result);
  }

  const examLabel = examName ? `your ${examName}` : "your exam";

  return (
    <aside
      className="mb-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3"
      aria-label="Did you pass?"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[var(--color-ink)]">Did you pass?</p>
          <p className="mt-0.5 text-sm leading-snug text-[var(--color-ink-muted)]">
            Optional check-in for {examLabel}. Your answer stays on your account.
          </p>
        </div>
        <button
          type="button"
          className="min-h-11 shrink-0 px-2 text-sm font-semibold text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
          onClick={() => void save(PASS_CHECK_IN_RESULT.dismissed, false)}
          disabled={pending != null}
        >
          Not now
        </button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {CHOICES.map((choice) => (
          <button
            key={choice.id}
            type="button"
            disabled={pending != null}
            onClick={() => choose(choice.id)}
            className="inline-flex min-h-11 items-center rounded-full border border-[var(--color-accent)] px-4 text-sm font-semibold text-[var(--color-accent)] hover:bg-[var(--color-accent)]/10 disabled:opacity-60"
          >
            {pending === choice.id ? "Saving…" : choice.label}
          </button>
        ))}
      </div>
      {quoteFor ? (
        <form
          className="mt-3"
          onSubmit={(event) => {
            event.preventDefault();
            void save(quoteFor, true);
          }}
        >
          <label className="block text-sm font-medium text-[var(--color-ink)]" htmlFor="pass-check-in-quote">
            Share a quote (optional)
            <textarea
              id="pass-check-in-quote"
              value={quote}
              maxLength={500}
              rows={2}
              onChange={(event) => setQuote(event.target.value)}
              className="mt-1.5 block w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-ink)]"
            />
          </label>
          <label className="mt-2 flex min-h-11 items-center gap-2 text-sm text-[var(--color-ink)]">
            <input
              type="checkbox"
              checked={consent}
              onChange={(event) => setConsent(event.target.checked)}
            />
            I consent to AnyExamEasy sharing this quote
          </label>
          <button
            type="submit"
            disabled={pending != null}
            className="mt-2 inline-flex min-h-11 items-center rounded-full bg-[var(--color-accent)] px-4 text-sm font-semibold text-white disabled:opacity-60"
          >
            {pending === quoteFor ? "Saving…" : "Save"}
          </button>
        </form>
      ) : null}
      {error ? <p className="mt-2 text-sm text-[var(--color-ink)]">{error}</p> : null}
    </aside>
  );
}
