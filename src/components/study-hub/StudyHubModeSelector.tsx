"use client";

import Link from "next/link";
import { ArrowRight, Clock, SlidersHorizontal } from "lucide-react";
import { EXAM_MODES } from "@/lib/exam/modes";
import { cn } from "@/lib/utils";
import { PLATFORM_EXAM_LIST_MIDDOT } from "@/lib/landing/content";

const MODE_STYLES = {
  timed: {
    icon: Clock,
    gradient: "from-sky-500/15 via-blue-500/10 to-indigo-500/5",
    border: "border-sky-200/70 hover:border-sky-300",
    iconBg: "bg-sky-500/10 text-sky-600",
    ring: "group-hover:shadow-[0_0_0_1px_rgba(14,165,233,0.35)]",
  },
  bank: {
    icon: SlidersHorizontal,
    gradient: "from-violet-500/15 via-purple-500/10 to-fuchsia-500/5",
    border: "border-violet-200/70 hover:border-violet-300",
    iconBg: "bg-violet-500/10 text-violet-600",
    ring: "group-hover:shadow-[0_0_0_1px_rgba(139,92,246,0.35)]",
  },
} as const;

export function StudyHubModeSelector() {
  return (
    <section aria-labelledby="study-mode-heading">
      <h2 id="study-mode-heading" className="sr-only">
        Choose how to study
      </h2>
      <div className="grid gap-5 sm:grid-cols-2">
        {EXAM_MODES.map((mode) => {
          const style = MODE_STYLES[mode.id];
          const Icon = style.icon;
          return (
            <Link
              key={mode.id}
              href={mode.href}
              className={cn(
                "group relative flex min-h-[220px] flex-col overflow-hidden rounded-3xl border bg-gradient-to-br p-7 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-lg sm:min-h-[240px] sm:p-8",
                style.gradient,
                style.border,
                style.ring
              )}
            >
              <div
                className={cn(
                  "inline-flex h-14 w-14 items-center justify-center rounded-2xl shadow-sm",
                  style.iconBg
                )}
              >
                <Icon className="h-7 w-7" strokeWidth={1.75} aria-hidden />
              </div>
              <h3 className="mt-6 text-2xl font-semibold tracking-tight text-slate-900">
                {mode.label}
              </h3>
              <p className="mt-2 max-w-sm flex-1 text-[0.9375rem] leading-relaxed text-slate-600">
                {mode.description}
              </p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-accent)]">
                Get started
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden
                />
              </span>
              <p className="mt-4 text-xs font-medium uppercase tracking-wide text-slate-500">
                {PLATFORM_EXAM_LIST_MIDDOT}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
