"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { ChevronDown } from "lucide-react";
import { switchExamPreference } from "@/lib/edtech/actions";
import { EXAM_CATALOG, EXAM_SLUGS } from "@/lib/edtech/exams";
import type { ExamSlug } from "@/types/edtech";

export function ExamSwitcher({ currentExam }: { currentExam: ExamSlug }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const exam = EXAM_CATALOG[currentExam];

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value as ExamSlug;
    if (next === currentExam) return;
    startTransition(async () => {
      await switchExamPreference(next);
      router.refresh();
    });
  }

  return (
    <label className="relative inline-flex items-center gap-2">
      <span className="sr-only">Switch exam</span>
      <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Exam</span>
      <div className="relative">
        <select
          value={currentExam}
          disabled={pending}
          onChange={onChange}
          className="appearance-none rounded-xl border border-slate-200 bg-white py-2 pl-3 pr-9 text-sm font-semibold text-slate-900 shadow-sm transition hover:border-slate-300 focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
        >
          {EXAM_SLUGS.map((slug) => (
            <option key={slug} value={slug}>
              {EXAM_CATALOG[slug].shortName}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          aria-hidden
        />
      </div>
      <span className="hidden text-sm text-slate-500 sm:inline">{exam.name}</span>
    </label>
  );
}
