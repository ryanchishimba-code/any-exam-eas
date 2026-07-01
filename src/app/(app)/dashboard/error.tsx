"use client";

import Link from "next/link";
import { ROUTES } from "@/lib/routes";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-lg space-y-4 px-6 py-16 text-center">
      <h1 className="text-xl font-semibold text-[var(--color-ink)]">Dashboard unavailable</h1>
      <p className="text-sm leading-relaxed text-[var(--color-ink-muted)]">
        We could not load your study data. This is usually a temporary database connection issue —
        try again in a moment.
      </p>
      {process.env.NODE_ENV === "development" ? (
        <p className="text-xs text-rose-600">{error.message}</p>
      ) : null}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-full bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-white"
        >
          Try again
        </button>
        <Link
          href={ROUTES.questionBank}
          className="rounded-full border border-black/10 px-5 py-2.5 text-sm font-semibold text-[var(--color-ink)]"
        >
          Open question bank
        </Link>
      </div>
    </div>
  );
}
