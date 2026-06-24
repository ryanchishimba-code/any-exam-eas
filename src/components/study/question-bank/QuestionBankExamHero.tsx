"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { EXAM_SELECTION_THEMES } from "@/lib/edtech/exam-selection-theme";
import { EXAM_CATALOG } from "@/lib/edtech/exams";
import { qbUi } from "@/lib/study/question-bank-ui";
import { ROUTES } from "@/lib/routes";
import type { ExamSlug } from "@/types/edtech";
import { cn } from "@/lib/utils";

export function QuestionBankExamHero({
  exam,
  examSlug,
  description,
  allowExamSwitch = false,
}: {
  exam: (typeof EXAM_CATALOG)[ExamSlug];
  examSlug: ExamSlug;
  description?: string;
  allowExamSwitch?: boolean;
}) {
  const theme = EXAM_SELECTION_THEMES[examSlug];
  const Icon = theme.icon;

  return (
    <div className={qbUi.heroCard}>
      <div
        className={cn(
          "pointer-events-none absolute inset-0 opacity-[0.07] bg-gradient-to-br",
          theme.gradient
        )}
        aria-hidden
      />
      <div className="relative flex items-start gap-4">
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br shadow-sm",
            theme.gradient
          )}
        >
          <Icon className="h-6 w-6 text-white" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <p className={qbUi.eyebrow}>Your exam</p>
          <p className="mt-1 text-[17px] font-semibold tracking-tight text-[var(--color-ink)]">
            {exam.name}
          </p>
          <p className="mt-1 text-[13px] leading-relaxed text-[var(--color-ink-muted)]">
            {description ?? exam.description}
          </p>
          {allowExamSwitch ? (
            <Link
              href={`${ROUTES.selectExam}?switch=1`}
              className="mt-2 inline-flex items-center gap-0.5 text-[13px] font-semibold text-[var(--color-accent)] hover:underline"
            >
              Switch exam
              <ChevronRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
