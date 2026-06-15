import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ExamHubIcon } from "@/components/exam/ExamHubIcon";
import { cn } from "@/lib/utils";
import { STUDYGUB_EXAM_BANKS, questionBankHref } from "@/lib/studygub/config";
import type { ExamSlug } from "@/lib/exams/catalog";

export function ExamQuestionBankCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {STUDYGUB_EXAM_BANKS.map((exam) => (
        <Link
          key={exam.slug}
          href={questionBankHref(exam.fieldId)}
          className={cn(
            "group rounded-2xl border bg-gradient-to-br p-5 shadow-sm transition hover:shadow-md",
            exam.accentClass
          )}
        >
          <div className="mb-3 inline-flex rounded-xl bg-white/80 p-2 text-[var(--color-accent)] shadow-sm">
            <ExamHubIcon slug={exam.slug as ExamSlug} className="h-5 w-5" />
          </div>
          <h3 className="text-base font-semibold text-slate-900">{exam.label}</h3>
          <p className="mt-1 text-sm text-slate-600">{exam.description}</p>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[var(--color-accent)]">
            Open bank
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden />
          </span>
        </Link>
      ))}
    </div>
  );
}
