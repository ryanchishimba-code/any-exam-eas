"use client";

import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { ROUTES } from "@/lib/routes";

/** FIXED: Graceful recovery when Study Hub data fails to load. */
export default function StudyHubError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-lg rounded-3xl border border-red-200/80 bg-white p-8 text-center shadow-sm dark:border-red-900/50 dark:bg-slate-900">
      <AlertCircle className="mx-auto h-10 w-10 text-red-500" aria-hidden />
      <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
        Study Hub unavailable
      </h2>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
        We couldn&apos;t load your dashboard. This can happen if database migrations are pending.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button
          type="button"
          onClick={reset}
          className="rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-700"
        >
          Try again
        </button>
        <Link
          href={ROUTES.selectExam}
          className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200"
        >
          Choose exam
        </Link>
      </div>
    </div>
  );
}
