"use client";

import { useEffect } from "react";
import { hardReloadAfterStaleChunk } from "@/lib/client/stale-chunk-recovery";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-6 text-center">
      <h1 className="text-xl font-semibold text-slate-900">Something went wrong</h1>
      <p className="mt-2 text-sm text-slate-600">
        Try refreshing the page. If you just deployed, a hard refresh clears stale cached files.
      </p>
      {process.env.NODE_ENV === "development" && error?.message ? (
        <p className="mt-3 max-w-md break-words font-mono text-xs text-red-600">{error.message}</p>
      ) : null}
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => {
            void hardReloadAfterStaleChunk();
          }}
          className="rounded-xl bg-[var(--color-accent)] px-4 py-2.5 text-sm font-semibold text-white"
        >
          Refresh page
        </button>
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
