"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ROUTES } from "@/lib/routes";

const AUTO_RETRY_KEY = "aee:qb-error-auto-retry";

export default function QuestionBankError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const retried = useRef(false);

  useEffect(() => {
    console.error("[question-bank/error]", error.message, error.digest);
  }, [error]);

  useEffect(() => {
    if (retried.current) return;
    // Persist across error-boundary remounts so auto-retry cannot loop forever.
    try {
      if (sessionStorage.getItem(AUTO_RETRY_KEY) === "1") return;
      sessionStorage.setItem(AUTO_RETRY_KEY, "1");
    } catch {
      /* private mode */
    }
    retried.current = true;
    const t = window.setTimeout(() => {
      reset();
    }, 1200);
    return () => window.clearTimeout(t);
  }, [reset]);

  return (
    <div className="mx-auto max-w-lg space-y-4 px-6 py-16 text-center">
      <h1 className="text-xl font-semibold text-[var(--color-ink)]">Question bank unavailable</h1>
      <p className="text-sm leading-relaxed text-[var(--color-ink-muted)]">
        We could not load your question bank. This is usually a brief database connection blip.
        Tap try again in a moment.
      </p>
      {process.env.NODE_ENV === "development" ? (
        <p className="text-xs text-rose-600">{error.message}</p>
      ) : null}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={() => {
            try {
              sessionStorage.removeItem(AUTO_RETRY_KEY);
            } catch {
              /* ignore */
            }
            reset();
          }}
          className="rounded-full bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-white"
        >
          Try again
        </button>
        <Link
          href={ROUTES.dashboard}
          className="rounded-full border border-black/10 px-5 py-2.5 text-sm font-semibold text-[var(--color-ink)]"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
