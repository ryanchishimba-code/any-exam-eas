"use client";

import Link from "next/link";
import { ArrowRight, ClipboardList, Stethoscope } from "lucide-react";
import {
  getUsmleStudyPreset,
  usmlePresetPracticeHref,
} from "@/lib/exam-prep/usmle/study-presets";
import { questionBankHref } from "@/lib/edtech/practice-links-core";
import { fullExamHref } from "@/lib/routes";
import { dbUi } from "@/lib/study/dashboard-ui";
import { cn } from "@/lib/utils";

type Props = {
  practiceFieldId: string;
};

/** Exam-like block shortcuts for USMLE Study Hub (CCS drill + compose + full exam). */
export function UsmleExamPathPanel({ practiceFieldId }: Props) {
  const ccs = getUsmleStudyPreset("step3-ccs-drill");
  const isStep3 = practiceFieldId === "usmle-step-3";
  const composeHref = questionBankHref("usmle", practiceFieldId);
  const fullHref = fullExamHref("usmle");

  return (
    <section className={cn(dbUi.card, "space-y-3 p-4 sm:p-5")}>
      <div>
        <h2 className="text-sm font-semibold tracking-[-0.01em] text-[var(--color-ink)]">
          Exam-style practice
        </h2>
        <p className="mt-0.5 text-xs text-[var(--color-ink-muted)]">
          Timed blocks and CCS-style drills — practice coverage only, not a pass prediction.
        </p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <Link href={composeHref} className={cn(dbUi.secondaryBtn, "justify-between")}>
          <span className="inline-flex items-center gap-2">
            <ClipboardList className="h-3.5 w-3.5" aria-hidden />
            Compose 40-Q timed block
          </span>
          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
        <Link href={fullHref} className={cn(dbUi.secondaryBtn, "justify-between")}>
          <span className="inline-flex items-center gap-2">
            <ClipboardList className="h-3.5 w-3.5" aria-hidden />
            Full exam form
          </span>
          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
        {isStep3 && ccs ? (
          <Link
            href={usmlePresetPracticeHref("usmle", ccs)}
            className={cn(dbUi.secondaryBtn, "justify-between")}
          >
            <span className="inline-flex items-center gap-2">
              <Stethoscope className="h-3.5 w-3.5" aria-hidden />
              {ccs.title}
            </span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        ) : null}
      </div>
    </section>
  );
}
