"use client";

import { useState } from "react";

type Phase = "idle" | "confirm" | "saving" | "done" | "error";

/** Explicit confirmation before a miss leaves Review incorrect. */
export function MarkItemMastered({
  field,
  itemId,
}: {
  field: string;
  itemId: string;
}) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [message, setMessage] = useState("");

  if (!itemId || /^\d+$/.test(itemId)) return null;

  async function confirm() {
    setPhase("saving");
    setMessage("");
    try {
      const res = await fetch("/api/study/remediation-mastery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ field, itemId, confirm: true }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setPhase("error");
        setMessage(data.error || "Could not mark this item mastered.");
        return;
      }
      setPhase("done");
    } catch {
      setPhase("error");
      setMessage("Could not mark this item mastered. Try again.");
    }
  }

  if (phase === "done") {
    return (
      <p role="status" className="text-[14px] leading-relaxed text-[var(--color-ink)]">
        Marked mastered. It leaves Review incorrect and the open-remediation count. A later miss
        puts it back.
      </p>
    );
  }

  if (phase === "confirm" || phase === "saving" || phase === "error") {
    return (
      <div className="space-y-3 rounded-2xl border border-[var(--color-accent)]/25 bg-[var(--color-surface-elevated)] px-4 py-4">
        <p className="text-[16px] font-semibold tracking-[-0.02em] text-[var(--color-ink)]">
          Mark this item mastered?
        </p>
        <p className="text-[14px] leading-relaxed text-[var(--color-ink-muted)]">
          It leaves Review incorrect and open remediations. A later miss puts it back.
        </p>
        {message ? (
          <p role="alert" className="text-[13px] text-rose-700">
            {message}
          </p>
        ) : null}
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => void confirm()}
            disabled={phase === "saving"}
            className="inline-flex items-center justify-center rounded-full bg-[var(--color-accent)] px-4 py-2.5 text-[14px] font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {phase === "saving" ? "Saving…" : "Confirm mastery"}
          </button>
          <button
            type="button"
            onClick={() => {
              setPhase("idle");
              setMessage("");
            }}
            disabled={phase === "saving"}
            className="inline-flex items-center justify-center rounded-full border border-[var(--color-border)] px-4 py-2.5 text-[14px] font-semibold text-[var(--color-ink)]"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPhase("confirm")}
      className="inline-flex items-center justify-center rounded-full border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 px-4 py-2.5 text-[14px] font-semibold text-[var(--color-accent)] transition hover:bg-[var(--color-accent)]/15"
    >
      Mark mastered
    </button>
  );
}
