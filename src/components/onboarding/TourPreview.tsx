"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { firstLoginTourSteps } from "@/lib/onboarding/first-login-tour";
import { ProductTour } from "@/components/onboarding/ProductTour";

/**
 * Dev-only fixture for screenshots. Production builds 404 this route.
 * Mobile includes a study-guide chip so step 3 can be captured; the live
 * dashboard skips that step when the link is not on screen.
 */
export function TourPreview() {
  const params = useSearchParams();
  const step = Number(params.get("step") ?? "0");
  const board = params.get("board") ?? "NCLEX";
  const steps = firstLoginTourSteps(board);
  const safeStep = Number.isFinite(step) ? Math.min(Math.max(step, 0), steps.length - 1) : 0;

  return (
    <div className="study-home-accent min-h-screen bg-[#f4f7f8] text-[#0a2540]">
      <div className="mx-auto flex max-w-5xl gap-6 px-4 py-8 lg:px-8">
        <aside className="hidden w-60 shrink-0 lg:block">
          <nav className="rounded-2xl border border-black/5 bg-white p-3 shadow-sm" aria-label="Study">
            <Link data-tour="bank" className="block rounded-xl px-3 py-3 text-[15px] font-semibold" href="/question-bank">
              Question Bank
            </Link>
            <Link
              data-tour="study-guide"
              className="mt-1 block rounded-xl px-3 py-3 text-[15px] font-semibold"
              href="/nclex/study-guide"
            >
              Study Guide
            </Link>
          </nav>
        </aside>
        <main className="min-w-0 flex-1 space-y-4 pb-28">
          <section data-tour="today" className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Today&apos;s block</p>
            <h1 className="mt-1 text-[26px] font-semibold tracking-[-0.03em]">{board}</h1>
            <p className="mt-2 text-[15px] text-slate-600">A short set picked for you. About 15 minutes.</p>
            <Link
              data-tour="today-start"
              href="/question-bank?style=bank"
              className="mt-4 inline-flex rounded-xl bg-[#0f766e] px-4 py-3 text-sm font-semibold text-white"
            >
              Start today&apos;s set
            </Link>
          </section>
          <Link
            data-tour="review-incorrect"
            href="/question-bank?style=review_incorrect"
            className="block rounded-2xl border border-black/5 bg-white px-5 py-4 text-[15px] font-semibold shadow-sm"
          >
            Review incorrect
          </Link>
          <Link
            data-tour="study-guide"
            href="/nclex/study-guide"
            className="block rounded-2xl border border-black/5 bg-white px-5 py-4 text-[15px] font-semibold shadow-sm lg:hidden"
          >
            {board} Study Guide
          </Link>
          <section data-tour="readiness" className="hidden rounded-2xl border border-black/5 bg-white p-6 shadow-sm lg:block">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Readiness proof</p>
            <h2 className="mt-1 text-[22px] font-semibold tracking-[-0.03em]">Not enough practice yet</h2>
          </section>
        </main>
      </div>
      <nav
        className="fixed inset-x-0 bottom-0 z-50 border-t border-black/5 bg-white pb-[env(safe-area-inset-bottom,0px)] lg:hidden"
        aria-label="Mobile study navigation"
      >
        <ul className="flex justify-around py-2 text-[11px] font-semibold">
          <li>
            <Link data-tour="bank" href="/question-bank" className="flex min-h-12 min-w-12 flex-col items-center justify-center">
              Bank
            </Link>
          </li>
          <li>
            <Link data-tour="stats" href="/analytics" className="flex min-h-12 min-w-12 flex-col items-center justify-center">
              Stats
            </Link>
          </li>
        </ul>
      </nav>
      <ProductTour
        open
        steps={steps}
        initialStep={safeStep}
        freeze
        onDismiss={() => {}}
        onComplete={() => {}}
        onStepViewed={() => {}}
        onStepMissing={() => {}}
      />
    </div>
  );
}
