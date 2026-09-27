"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import {
  ReportQuestionDialog,
  type ReportQuestionContext,
} from "@/components/study/ReportQuestionDialog";
import { StudyUseNote } from "@/components/legal/StudyUseNote";
import { ROUTES } from "@/lib/routes";

type Props = {
  /** Opens a dialog the parent already owns. */
  onReportIssue?: () => void;
  /** Builds a dialog here when the parent does not already have one. */
  report?: ReportQuestionContext;
  tone?: "default" | "onDark";
};

/** Sits with a rationale: standards link plus a stored issue report. */
export function QuestionIssueFooter({ onReportIssue, report, tone = "default" }: Props) {
  const [open, setOpen] = useState(false);
  const muted = tone === "onDark" ? "text-slate-300" : "text-[var(--color-ink-muted)]";
  const link = tone === "onDark" ? "text-teal-200 hover:underline" : "text-[var(--color-accent)] hover:underline";
  const button =
    tone === "onDark"
      ? "border-white/20 text-white hover:bg-white/10"
      : "border-[var(--color-border)] text-[var(--color-ink)] hover:bg-black/[0.03]";

  return (
    <div className="mt-4 flex flex-col gap-3 border-t border-black/[0.06] pt-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/[0.08]">
      <div className="min-w-0">
        <p className={`text-xs leading-relaxed ${muted}`}>
          <Link href={ROUTES.howQuestionsAreReviewed} className={`font-semibold ${link}`}>
            How questions are reviewed
          </Link>
          <span aria-hidden> · </span>
          Sources shown here are the ones stored on this item.
        </p>
        <StudyUseNote className={`mt-1 ${muted}`} />
      </div>
      {onReportIssue || report ? (
        <button
          type="button"
          onClick={() => (onReportIssue ? onReportIssue() : setOpen(true))}
          className={`inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full border px-3 py-2 text-xs font-semibold ${button}`}
        >
          <AlertTriangle className="h-3.5 w-3.5" aria-hidden />
          Report an issue
        </button>
      ) : null}
      {report && !onReportIssue ? (
        <ReportQuestionDialog open={open} onClose={() => setOpen(false)} context={report} />
      ) : null}
    </div>
  );
}
