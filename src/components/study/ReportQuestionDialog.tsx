"use client";

import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import {
  QUESTION_REPORT_REASONS,
  type QuestionReportReason,
  type SubmitQuestionReportInput,
} from "@/lib/question-reports/types";

export type ReportQuestionContext = Omit<
  SubmitQuestionReportInput,
  "reason" | "message"
>;

type Props = {
  open: boolean;
  onClose: () => void;
  context: ReportQuestionContext;
};

export function ReportQuestionDialog({ open, onClose, context }: Props) {
  const [reason, setReason] = useState<QuestionReportReason>("other");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  if (!open) return null;

  async function submit() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/questions/report", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...context,
          reason,
          message: message.trim() || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Could not submit report.");
      setSubmitted(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not submit report.");
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    setSubmitted(false);
    setMessage("");
    setReason("other");
    setError(null);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-question-title"
    >
      <div className="w-full max-w-md rounded-2xl border border-black/[0.08] bg-white p-5 shadow-xl sm:p-6">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" aria-hidden />
            <div>
              <h2 id="report-question-title" className="text-base font-semibold text-[var(--color-ink)]">
                Report question
              </h2>
              <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
                Flag quality issues for our editorial team. We analyze each report against board-style standards.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-full p-1 text-[var(--color-ink-muted)] hover:bg-black/[0.05]"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {submitted ? (
          <div className="space-y-4">
            <p className="text-sm text-[var(--color-ink)]">
              Thank you — your report was received. Our team will review it and improve future questions.
            </p>
            <button
              type="button"
              onClick={handleClose}
              className="w-full rounded-full bg-[var(--color-accent)] px-4 py-2.5 text-sm font-medium text-white"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <fieldset>
              <legend className="mb-2 text-xs font-semibold uppercase tracking-wide text-black/45">
                What&apos;s wrong?
              </legend>
              <div className="space-y-2">
                {QUESTION_REPORT_REASONS.map((opt) => (
                  <label
                    key={opt.id}
                    className="flex cursor-pointer items-center gap-2 rounded-lg border border-black/[0.06] px-3 py-2 text-sm hover:bg-black/[0.02]"
                  >
                    <input
                      type="radio"
                      name="report-reason"
                      value={opt.id}
                      checked={reason === opt.id}
                      onChange={() => setReason(opt.id)}
                      className="accent-[var(--color-accent)]"
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </fieldset>

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-black/45">
                Details (optional)
              </span>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                maxLength={2000}
                placeholder="Describe the issue — e.g. why you think another answer is correct."
                className="w-full rounded-xl border border-black/[0.08] px-3 py-2 text-sm"
              />
            </label>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 rounded-full border border-black/[0.08] px-4 py-2.5 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => void submit()}
                className="flex-1 rounded-full bg-[var(--color-accent)] px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50"
              >
                {loading ? "Sending…" : "Submit report"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function buildReportContext(params: {
  fieldId: string;
  examSlug?: string | null;
  subjectId?: string;
  sessionId?: string;
  sessionMode?: string;
  question: {
    id: string | number;
    bankItemId?: string;
    stem: string;
    vignette?: string;
    options: string[];
    correctAnswers: string[];
    field?: string;
    subjectId?: string;
  };
  selectedAnswer?: string;
}): ReportQuestionContext {
  const stemPreview = [params.question.vignette, params.question.stem]
    .filter(Boolean)
    .join("\n\n")
    .slice(0, 500);

  return {
    bankItemId: params.question.bankItemId,
    questionKey: String(params.question.bankItemId ?? params.question.id),
    fieldId: params.fieldId,
    examSlug: params.examSlug ?? undefined,
    subjectId: params.subjectId ?? params.question.subjectId,
    sessionId: params.sessionId,
    sessionMode: params.sessionMode,
    stemPreview,
    options: params.question.options,
    correctAnswer: params.question.correctAnswers[0],
    selectedAnswer: params.selectedAnswer,
  };
}
