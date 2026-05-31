"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import type { GeneratedExam } from "@/lib/ai";
import { cleanOptionText } from "@/lib/question-format";
import { formatNgnLabel } from "@/lib/questions/ngn-map";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Props = {
  exam: GeneratedExam;
  sourcesReviewed?: number | null;
  timed: boolean;
  onStart: () => void;
};

export function QuestionPreview({ exam, sourcesReviewed, timed, onStart }: Props) {
  const [expanded, setExpanded] = useState<number | null>(0);
  const qc = exam.qualityReport;

  return (
    <Card className="mt-8 overflow-hidden border-[var(--color-accent)]/20 shadow-none">
      <CardHeader className="border-b border-black/[0.06] bg-[var(--color-surface)]">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Sparkles className="h-5 w-5 text-[var(--color-accent)]" />
              {exam.title}
            </CardTitle>
            <CardDescription className="mt-2 max-w-xl">{exam.studyNotes}</CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge className="border-[var(--color-accent)]/20 bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
              {exam.questions.length} questions
            </Badge>
            {qc && (
              <Badge
                className={
                  qc.passed
                    ? "border-blue-600/30 bg-blue-50 text-blue-900"
                    : "border-amber-600/30 bg-amber-50 text-amber-900"
                }
              >
                QC {qc.passed ? "Pass" : "Review"} {(qc.averageScore * 100).toFixed(0)}%
              </Badge>
            )}
            {timed && (
              <Badge className="border-amber-500/20 bg-amber-500/10 text-amber-800">
                Timed mode
              </Badge>
            )}
            {sourcesReviewed != null && sourcesReviewed > 0 && (
              <Badge>{sourcesReviewed} sources</Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <ul className="max-h-[420px] divide-y divide-black/[0.06] overflow-y-auto">
          {exam.questions.map((q, i) => {
            const open = expanded === i;
            return (
              <li key={q.id ?? i}>
                <button
                  type="button"
                  className="flex w-full items-start gap-3 px-6 py-4 text-left hover:bg-[var(--color-surface)]"
                  onClick={() => setExpanded(open ? null : i)}
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--color-surface)] text-xs font-semibold">
                    {i + 1}
                  </span>
                  <span className="flex-1">
                    <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-[var(--color-accent)]">
                      {formatNgnLabel(q.type, q.ngnFormat)}
                    </span>
                    <span className="text-sm font-medium leading-snug text-[var(--color-ink)]">
                      {q.vignette ? `${q.vignette.slice(0, 120)}… ` : ""}
                      {q.question}
                    </span>
                  </span>
                  {open ? (
                    <ChevronUp className="h-4 w-4 shrink-0 text-[var(--color-ink-muted)]" />
                  ) : (
                    <ChevronDown className="h-4 w-4 shrink-0 text-[var(--color-ink-muted)]" />
                  )}
                </button>
                {open && (
                  <div className="space-y-3 border-t border-black/[0.06] bg-[var(--color-surface)]/50 px-6 pb-4 pt-2">
                    {q.vignette && (
                      <p className="rounded-lg bg-white/80 p-3 text-xs leading-relaxed text-[var(--color-ink-muted)]">
                        {q.vignette}
                      </p>
                    )}
                    <ul className="space-y-1.5">
                      {(q.options ?? []).map((opt, j) => {
                        const isCorrect = q.type === "select_all"
                          ? q.correctAnswer.toLowerCase().includes(cleanOptionText(opt).toLowerCase())
                          : cleanOptionText(opt).toLowerCase() ===
                            cleanOptionText(q.correctAnswer).toLowerCase();
                        return (
                          <li
                            key={j}
                            className={cn(
                              "rounded-lg px-3 py-2 text-xs",
                              isCorrect
                                ? "a11y-correct font-medium"
                                : "text-[var(--color-ink-muted)]"
                            )}
                          >
                            {cleanOptionText(opt)}
                            {isCorrect && " — Correct answer"}
                          </li>
                        );
                      })}
                    </ul>
                    <p className="text-xs text-[var(--color-ink-muted)]">{q.explanation}</p>
                    {q.clinicalReasoning && (
                      <p className="text-xs text-[var(--color-accent)]">
                        {q.clinicalReasoning.slice(0, 200)}
                        {q.clinicalReasoning.length > 200 ? "…" : ""}
                      </p>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        <div className="border-t border-black/[0.06] bg-white p-6">
          <Button type="button" className="w-full !rounded-xl" onClick={onStart}>
            Start test →
          </Button>
          <p className="mt-2 text-center text-xs text-[var(--color-ink-muted)]">
            NGN formats render interactively in the study player.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
