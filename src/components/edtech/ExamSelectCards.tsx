"use client";

import { useState, useTransition } from "react";
import { Activity, Beaker, Pill, Scale } from "lucide-react";
import { saveExamPreference } from "@/lib/edtech/actions";
import { EXAM_CATALOG, EXAM_SLUGS } from "@/lib/edtech/exams";
import type { ExamSlug } from "@/types/edtech";
import { cn } from "@/lib/utils";

const ICONS: Record<ExamSlug, typeof Activity> = {
  nclex: Activity,
  usmle: Beaker,
  naplex: Pill,
  mpje: Scale,
};

export function ExamSelectCards() {
  const [pending, startTransition] = useTransition();
  const [selected, setSelected] = useState<ExamSlug | null>(null);

  function handleSelect(slug: ExamSlug) {
    setSelected(slug);
    const formData = new FormData();
    formData.set("examSlug", slug);
    startTransition(() => saveExamPreference(formData));
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {EXAM_SLUGS.map((slug) => {
        const exam = EXAM_CATALOG[slug];
        const Icon = ICONS[slug];
        const isSelected = selected === slug;

        return (
          <button
            key={slug}
            type="button"
            disabled={pending}
            onClick={() => handleSelect(slug)}
            className={cn(
              "group relative overflow-hidden rounded-2xl border bg-white p-6 text-left shadow-sm transition-all",
              "hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]",
              `bg-gradient-to-br ${exam.accentClass}`,
              isSelected && "ring-2 ring-[var(--color-accent)]"
            )}
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/80 shadow-sm">
                <Icon className="h-6 w-6 text-[var(--color-accent)]" aria-hidden />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {exam.shortName}
                </p>
                <h2 className="mt-1 text-xl font-semibold text-slate-900">{exam.name}</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{exam.description}</p>
                <p className="mt-4 text-sm font-medium text-[var(--color-accent)]">
                  {pending && isSelected ? "Saving…" : "Select exam →"}
                </p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
