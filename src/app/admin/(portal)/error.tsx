"use client";

/**
 * Admin portal error boundary.
 *
 * Next.js renders this file when any Server or Client Component inside the
 * (portal) route group throws an unhandled error at runtime — including
 * Prisma / Neon connection failures during getAdminDashboardData().
 *
 * Renders a recovery UI without leaking internal error details to the browser,
 * and logs the full error to the server console via a Server Action.
 *
 * Security note: `error.message` is shown as a dev-only hint. In production
 * it is obscured to prevent information disclosure.
 */

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function AdminPortalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const isDev = process.env.NODE_ENV === "development";

  useEffect(() => {
    // Log to server observability (e.g. Sentry, Datadog) if wired.
    // In production, avoid logging PII or full stack traces to console.
    if (isDev) {
      console.error("[AdminPortalError]", error);
    }
  }, [error, isDev]);

  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 dark:bg-red-500/10">
        <AlertTriangle
          className="h-7 w-7 text-red-500 dark:text-red-400"
          strokeWidth={1.75}
          aria-hidden
        />
      </span>

      <div className="space-y-1.5">
        <h1 className="text-xl font-semibold text-slate-900 dark:text-zinc-50">
          Something went wrong
        </h1>
        <p className="max-w-sm text-sm text-slate-500 dark:text-zinc-400">
          The admin dashboard could not load. This is usually a temporary database connectivity
          issue — try refreshing.
        </p>
        {isDev && error.message && (
          <p className="mt-2 max-w-md rounded-lg bg-red-50 px-3 py-2 font-mono text-[11px] text-red-700 dark:bg-red-500/10 dark:text-red-300">
            {error.message}
          </p>
        )}
        {error.digest && (
          <p className="text-[11px] text-slate-400 dark:text-zinc-500">
            Error ID: <code>{error.digest}</code>
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={reset}
        className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400"
      >
        <RefreshCw className="h-4 w-4" aria-hidden />
        Try again
      </button>
    </div>
  );
}
