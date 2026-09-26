"use client";

import { useEffect, useState } from "react";
import { examSlugFromFieldId } from "@/lib/edtech/exams";
import { fullExamSessionHref } from "@/lib/full-exam/config";
import { stashFullExamSessionPayload } from "@/lib/full-exam/session-payload-cache";
import { navigateHard } from "@/lib/client/navigate-hard";
import { studyLimitMessage } from "@/lib/study/usage-limit-messages";
import { qbUi } from "@/lib/study/question-bank-ui";
import {
  previewPracticeExams,
  type PresetFormProgressStatus,
} from "@/lib/exam-prep/preset-form-progress";
import type { NclexTimedVariant } from "@/lib/exam/exam-lengths";
import { isUsmleFieldId } from "@/lib/exam-prep/usmle/steps";
import { cn } from "@/lib/utils";
import type { ExamQuestion } from "@/lib/ai";

type PracticeExamRow = {
  examNumber: number;
  title: string;
  questionCount: number;
  lengthNote: string;
  status: PresetFormProgressStatus;
  score: number | null;
  sessionId: string | null;
  highlighted: boolean;
};

function statusLine(row: PracticeExamRow): string {
  if (row.status === "in_progress") return "In progress";
  if (row.status === "completed") {
    return row.score == null ? "Completed" : `Completed · ${row.score}%`;
  }
  return "Not started";
}

export function PracticeExamList({
  fieldId,
  nclexLength,
}: {
  fieldId: string;
  nclexLength?: NclexTimedVariant;
}) {
  const examSlug = examSlugFromFieldId(fieldId);
  const [forms, setForms] = useState<PracticeExamRow[] | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [pendingNumber, setPendingNumber] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!examSlug) {
      setForms([]);
      return;
    }
    let cancelled = false;
    const params = new URLSearchParams({ field: fieldId });
    if (nclexLength) params.set("nclexLength", nclexLength);
    void fetch(`/api/practice-exams?${params.toString()}`, { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) return [];
        const data = (await res.json()) as { forms?: PracticeExamRow[] };
        return Array.isArray(data.forms) ? data.forms : [];
      })
      .then((rows) => {
        if (!cancelled) setForms(rows);
      })
      .catch(() => {
        if (!cancelled) setForms([]);
      });
    return () => {
      cancelled = true;
    };
  }, [examSlug, fieldId, nclexLength]);

  if (!examSlug || !forms || forms.length === 0) return null;

  const visible = previewPracticeExams(forms, expanded);

  async function openForm(row: PracticeExamRow) {
    if (!examSlug || pendingNumber != null) return;
    setError("");
    if (row.status === "in_progress" && row.sessionId) {
      navigateHard(fullExamSessionHref(examSlug, row.sessionId));
      return;
    }
    if (row.status === "completed") return;
    setPendingNumber(row.examNumber);
    try {
      const res = await fetch("/api/full-exam/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examSlug,
          presetExamNumber: row.examNumber,
          timed: true,
          lengthPreset: "full",
          nclexCat: false,
          ...(nclexLength ? { nclexLength } : {}),
          ...(examSlug === "usmle" && isUsmleFieldId(fieldId) ? { fieldId } : {}),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        sessionId?: string;
        redirectUrl?: string;
        error?: string;
        code?: string;
        upgradeUrl?: string;
        questions?: ExamQuestion[];
        bankItemIds?: string[];
      };
      if (!res.ok) {
        throw new Error(studyLimitMessage(data) || data.error || "Could not start this practice exam");
      }
      const href =
        data.redirectUrl ??
        (data.sessionId ? fullExamSessionHref(examSlug, data.sessionId) : null);
      if (!href || !data.sessionId) {
        throw new Error("Session was not created. Please try again.");
      }
      if (data.questions?.length && data.bankItemIds?.length) {
        stashFullExamSessionPayload(data.sessionId, {
          questions: data.questions,
          bankItemIds: data.bankItemIds,
        });
      }
      navigateHard(href);
    } catch (cause) {
      setPendingNumber(null);
      setError(cause instanceof Error ? cause.message : "Could not start this practice exam");
    }
  }

  return (
    <section className="space-y-3" aria-label="Practice exams">
      <div className="px-0.5">
        <h3 className="text-[17px] font-semibold tracking-[-0.02em] text-[var(--color-ink)]">
          Practice exams
        </h3>
      </div>
      <ul className="space-y-2">
        {visible.map((row) => {
          const action =
            row.status === "completed"
              ? null
              : row.status === "in_progress"
                ? "Resume"
                : "Start";
          return (
            <li key={row.examNumber}>
              <div
                className={cn(
                  "flex flex-col gap-3 rounded-2xl border px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between",
                  row.highlighted
                    ? "border-[var(--color-accent)]/40 bg-[var(--color-accent)]/[0.06]"
                    : "border-[var(--qb-line,var(--color-border))]/80 bg-[var(--qb-card,var(--color-surface-elevated))]"
                )}
              >
                <div className="min-w-0">
                  {row.highlighted ? (
                    <p className="text-[12px] font-semibold text-[var(--color-accent)]">Next</p>
                  ) : null}
                  <p className="text-[16px] font-semibold leading-snug tracking-[-0.01em] text-[var(--color-ink)]">
                    {row.title}
                  </p>
                  <p className="mt-1 text-[14px] leading-relaxed text-[var(--color-ink-muted)]">
                    {row.lengthNote}
                    <span aria-hidden="true"> · </span>
                    <span>{statusLine(row)}</span>
                  </p>
                </div>
                {action ? (
                  <button
                    type="button"
                    className={cn(qbUi.ghostBtn, "h-10 shrink-0 px-4 text-[14px] sm:min-w-[6.5rem]")}
                    disabled={pendingNumber != null}
                    onClick={() => void openForm(row)}
                  >
                    {pendingNumber === row.examNumber ? "Starting…" : action}
                  </button>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
      {forms.length > visible.length || (expanded && forms.length > 3) ? (
        <button
          type="button"
          className="px-0.5 text-[14px] font-semibold text-[var(--color-accent)]"
          onClick={() => setExpanded((open) => !open)}
        >
          {expanded ? "Show fewer" : `Show all ${forms.length}`}
        </button>
      ) : null}
      {error ? (
        <p className="text-[14px] text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </section>
  );
}
