"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { StudySubnav } from "@/components/StudySubnav";

const StudentHub = dynamic(
  () => import("@/components/study/StudentHub").then((m) => m.StudentHub),
  {
    loading: () => (
      <div className="mt-10 space-y-6">
        <div className="h-32 animate-pulse rounded-2xl bg-black/[0.04]" />
        <div className="h-48 animate-pulse rounded-2xl bg-black/[0.04]" />
      </div>
    ),
  }
);

export function StudyPageLayout() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <div className="mx-auto max-w-4xl px-6 pb-24 pt-[var(--page-top)]">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-ink-muted)]">
          Study
        </p>
        <h1 className="apple-display text-[clamp(2rem,5vw,2.75rem)]">Your exam prep hub.</h1>
        <p className="apple-subhead mt-4 max-w-xl text-[1.0625rem]">
          Timed exams, flexible question banks, and progress tracking — all
          in one place.
        </p>
        <Suspense fallback={null}>
          <div className="mt-10">
            <StudySubnav />
          </div>
          <StudentHub />
        </Suspense>
      </div>
    </div>
  );
}
