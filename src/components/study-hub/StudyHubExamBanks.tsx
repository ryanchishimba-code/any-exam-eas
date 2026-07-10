"use client";

import Link from "next/link";
import { Activity, ArrowRight, HeartPulse, Pill, Stethoscope } from "lucide-react";
import { STUDY_HUB_EXAM_BANKS } from "@/lib/study-hub/config";
import { examHref } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { PLATFORM_EXAM_LIST } from "@/lib/landing/content";

const EXAM_ICONS: Record<string, typeof Activity> = {
  nclex: Activity,
  usmle: Stethoscope,
  naplex: Pill,
  pance: HeartPulse,
};

export function StudyHubExamBanks() {
  return (
    <section aria-labelledby="exam-banks-heading">
      <h2 id="exam-banks-heading" className="text-lg font-semibold text-slate-900">
        Question banks
      </h2>
      <p className="mt-1 text-sm text-slate-600">
        Pick your board — {PLATFORM_EXAM_LIST}.
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STUDY_HUB_EXAM_BANKS.map((exam) => {
          const Icon = EXAM_ICONS[exam.slug] ?? Activity;

          return (
            <Link
              key={exam.slug}
              href={examHref(exam.slug)}
              className={cn(
                "group relative flex flex-col overflow-hidden rounded-2xl border bg-gradient-to-br p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md",
                exam.accentClass
              )}
            >
              <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/70 text-slate-700 shadow-sm">
                <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
              </span>
              <h3 className="text-lg font-semibold text-slate-900">{exam.label}</h3>
              <p className="mt-1.5 flex-1 text-sm leading-relaxed text-slate-600">
                {exam.description}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-accent)]">
                Open bank
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
