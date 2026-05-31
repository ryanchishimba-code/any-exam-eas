"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ArrowRight, BookOpen } from "lucide-react";
import {
  firstName,
  loadReturningUserHint,
  touchReturningVisit,
} from "@/lib/client/returning-user";

export function ReturningUserHeroBanner() {
  const { data: session, status } = useSession();
  const [hint, setHint] = useState<ReturnType<typeof loadReturningUserHint>>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setHint(loadReturningUserHint());
    touchReturningVisit();
    setReady(true);
  }, []);

  if (!ready || status === "loading") return null;

  const isReturning = Boolean(session?.user || (!session?.user && hint));
  if (!isReturning) return null;

  const displayName = session?.user?.name
    ? firstName(session.user.name)
    : hint
      ? firstName(hint.name, hint.email)
      : null;

  const headline = displayName
    ? `Welcome back, ${displayName}! Continue your NCLEX · USMLE · NAPLEX prep`
    : "Welcome back! Continue your NCLEX · USMLE · NAPLEX prep";

  return (
    <div
      className="apple-animate-in relative z-10 mx-auto mb-8 max-w-[980px] px-6 md:mb-10"
      role="region"
      aria-label="Returning student"
    >
      <div className="overflow-hidden rounded-2xl border border-teal-200/80 bg-gradient-to-r from-teal-50 via-cyan-50/90 to-sky-50 shadow-[0_8px_32px_rgba(8,145,178,0.12)]">
        <div
          className="h-1 bg-gradient-to-r from-teal-600 via-cyan-500 to-sky-500"
          aria-hidden
        />

        <div className="flex flex-col items-stretch gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-5 md:p-6">
          <div className="flex min-w-0 items-start gap-3 sm:items-center">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-600 to-cyan-600 text-white shadow-[0_4px_14px_rgba(8,145,178,0.35)] sm:h-11 sm:w-11">
              <BookOpen className="h-5 w-5" strokeWidth={2.25} aria-hidden />
            </span>
            <p className="text-left text-[0.9375rem] font-semibold leading-snug text-teal-950 sm:text-base md:text-[1.0625rem]">
              {headline}
            </p>
          </div>

          <Link
            href="/dashboard"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 px-6 py-3.5 text-base font-semibold text-white shadow-[0_6px_24px_rgba(8,145,178,0.4)] transition-all hover:from-teal-500 hover:to-cyan-500 hover:shadow-[0_8px_28px_rgba(8,145,178,0.45)] active:scale-[0.98] sm:px-8 sm:py-4 sm:text-[1.0625rem]"
          >
            Resume Study
            <ArrowRight className="h-5 w-5" aria-hidden />
          </Link>
        </div>
      </div>
    </div>
  );
}
