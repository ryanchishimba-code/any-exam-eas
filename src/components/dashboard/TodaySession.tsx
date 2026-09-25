"use client";

import { createContext, useContext, useLayoutEffect, useState, type ReactNode } from "react";
import { StartTodaySetButton } from "@/components/dashboard/StartTodaySetButton";

export type ServedTodayPreview = {
  mixLine: string | null;
  empty: boolean;
  limitReached: boolean;
  streakDays: number | null;
};

type SessionState =
  | { phase: "idle" }
  | { phase: "loading" }
  | { phase: "ready"; preview: ServedTodayPreview }
  | { phase: "error" };

const TodaySessionContext = createContext<SessionState>({ phase: "idle" });

function readPreview(data: unknown): ServedTodayPreview | null {
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  return {
    mixLine: typeof row.mixLine === "string" && row.mixLine.trim() ? row.mixLine : null,
    empty: row.empty === true,
    limitReached: row.limitReached === true,
    streakDays: typeof row.streakDays === "number" ? row.streakDays : null,
  };
}

/**
 * Loads the served Today mix after the dashboard shell. The slot stays a
 * fixed height and shows no count until this response arrives.
 */
export function TodaySessionProvider({
  enabled,
  fieldId,
  questionsDone,
  children,
}: {
  enabled: boolean;
  fieldId: string;
  questionsDone: number;
  children: ReactNode;
}) {
  const [state, setState] = useState<SessionState>(enabled ? { phase: "loading" } : { phase: "idle" });

  useLayoutEffect(() => {
    if (!enabled) {
      setState({ phase: "idle" });
      return;
    }
    const controller = new AbortController();
    setState({ phase: "loading" });
    const params = new URLSearchParams({
      field: fieldId,
      done: String(Math.max(0, Math.round(questionsDone) || 0)),
    });
    fetch(`/api/study/daily-set/preview?${params.toString()}`, {
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("preview");
        return readPreview(await res.json());
      })
      .then((preview) => {
        if (!preview) throw new Error("preview");
        setState({ phase: "ready", preview });
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setState({ phase: "error" });
      });
    return () => controller.abort();
  }, [enabled, fieldId, questionsDone]);

  return <TodaySessionContext.Provider value={state}>{children}</TodaySessionContext.Provider>;
}

export function useTodaySession(): SessionState {
  return useContext(TodaySessionContext);
}

/** One line tall, whether the served mix is still loading or already shown. */
export function TodayMixLine() {
  const session = useTodaySession();
  if (session.phase === "idle") return null;

  const mixLine = session.phase === "ready" ? session.preview.mixLine : null;
  const pending = session.phase === "loading";
  const unavailable = session.phase === "error";
  const empty = session.phase === "ready" && !mixLine && !session.preview.limitReached;
  const streak =
    session.phase === "ready" && session.preview.streakDays != null && session.preview.streakDays > 0
      ? session.preview.streakDays
      : null;

  return (
    <>
      <div className="mt-3 flex h-6 items-center" data-today-mix-slot aria-busy={pending || undefined}>
        {pending ? (
          <span
            data-today-mix-pending
            className="block h-3.5 w-44 max-w-full rounded-full bg-[color-mix(in_srgb,var(--color-accent)_16%,transparent)]"
            aria-hidden
          />
        ) : mixLine ? (
          <p
            data-today-mix
            className="truncate text-[17px] font-medium leading-6 tracking-[-0.02em] text-[var(--color-ink)]"
          >
            {mixLine}
          </p>
        ) : (
          <p className="truncate text-[15px] leading-6 text-[var(--color-ink-muted)]">
            {unavailable
              ? "Today's mix is unavailable. Refresh to see the counts."
              : empty
                ? "No questions ready for this board yet."
                : ""}
          </p>
        )}
      </div>
      {streak != null ? (
        <p className="mt-2 text-[13px] tracking-[-0.01em] text-[var(--color-ink-muted)]">
          {streak}-day streak
        </p>
      ) : null}
    </>
  );
}

export function TodayStartLive({ fieldId }: { fieldId: string }) {
  const session = useTodaySession();
  const preview = session.phase === "ready" ? session.preview : null;
  const label = preview?.limitReached
    ? "Question limit reached"
    : preview?.empty
      ? "No questions ready yet"
      : "Start today's set (~15 min)";
  return (
    <StartTodaySetButton
      fieldId={fieldId}
      disabled={Boolean(preview?.empty || preview?.limitReached)}
      label={label}
    />
  );
}
