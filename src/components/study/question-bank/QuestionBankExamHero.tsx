"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
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
  return (
    <div className={qbUi.heroCard}>
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <p className={qbUi.eyebrow}>Your exam</p>
          <p className="mt-0.5 text-[15px] font-semibold tracking-tight text-[var(--color-ink)]">
            {exam.name}
          </p>
          <p className={cn(qbUi.sectionHint, "mt-1")}>{description ?? exam.description}</p>
          {allowExamSwitch ? (
            <Link
              href={`${ROUTES.selectExam}?switch=1`}
              className="mt-2 inline-flex items-center gap-0.5 text-[12px] font-semibold text-[var(--color-accent)] hover:underline"
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
