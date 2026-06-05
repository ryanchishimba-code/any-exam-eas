import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { EXAM_HUBS, type ExamSlug } from "@/lib/exams/catalog";
import { ExamHubIcon } from "@/components/exam/ExamHubIcon";
import { cn } from "@/lib/utils";

export function ExamSelectorCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {EXAM_HUBS.map((exam) => {
        return (
          <Link
            key={exam.slug}
            href={`/prep/${exam.slug}`}
            className={cn(
              "group relative overflow-hidden rounded-2xl border bg-gradient-to-br p-6 shadow-sm transition hover:shadow-md",
              exam.accentClass
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="mb-3 inline-flex rounded-xl bg-white/80 p-2.5 text-[var(--color-accent)] shadow-sm">
                  <ExamHubIcon slug={exam.slug as ExamSlug} className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">{exam.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{exam.subtitle}</p>
                <p className="mt-2 text-xs font-medium text-slate-500">{exam.questionBankLabel}</p>
              </div>
              <ArrowRight
                className="h-5 w-5 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-[var(--color-accent)]"
                aria-hidden
              />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
