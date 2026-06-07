"use client";

import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { ROUTES } from "@/lib/routes";

/** FIXED: User-friendly error when exam selection fails to render. */
export default function SelectExamError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-6 text-center">
      <AlertCircle className="h-10 w-10 text-amber-500" aria-hidden />
      <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
        Couldn&apos;t load exam selection
      </h2>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
        Please try again or return to the Study Hub.
      </p>
      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white"
        >
          Retry
        </button>
        <Link
          href={ROUTES.practiceHub}
          className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200"
        >
          Study Hub
        </Link>
      </div>
    </div>
  );
}
