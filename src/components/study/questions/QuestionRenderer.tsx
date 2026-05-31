"use client";

import type { StudyQuestion } from "@/lib/questions/types";
import { cleanOptionText } from "@/lib/question-format";
import { NgnFormatBadge, VignetteBlock } from "./NgnChrome";
import {
  BowTieQuestion,
  HighlightQuestion,
  MatrixQuestion,
  UnfoldingCaseBanner,
  formatMatrixAnswer,
} from "./NgnFormats";
import {
  McqOptions,
  OrderedResponseOptions,
  SelectAllOptions,
} from "./NgnOptionLists";

type Props = {
  question: StudyQuestion;
  selected: string[];
  revealed: boolean;
  onToggle: (option: string) => void;
};

export function QuestionRenderer({ question, selected, revealed, onToggle }: Props) {
  const handleToggle = (opt: string) => {
    if (opt === "__clear__") {
      onToggle("__clear__");
      return;
    }
    onToggle(opt);
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <NgnFormatBadge question={question} />
        {question.highYield && (
          <span className="text-[10px] font-medium uppercase tracking-wide text-amber-600">
            High yield
          </span>
        )}
        {question.qualityScore != null && (
          <span className="text-[10px] tabular-nums text-[var(--color-ink-muted)]">
            QC {(question.qualityScore * 100).toFixed(0)}%
          </span>
        )}
      </div>

      <UnfoldingCaseBanner question={question} />

      {question.vignette && question.type !== "highlight" && (
        <VignetteBlock text={question.vignette} />
      )}

      <p className="text-xl font-medium leading-snug sm:text-2xl">{question.stem}</p>

      {question.type === "bow_tie" && (
        <BowTieQuestion
          question={question}
          selected={selected}
          revealed={revealed}
          onToggle={handleToggle}
        />
      )}

      {question.type === "matrix" && (
        <MatrixQuestion
          question={question}
          selected={selected}
          revealed={revealed}
          onToggle={handleToggle}
        />
      )}

      {question.type === "highlight" && (
        <HighlightQuestion
          question={question}
          selected={selected}
          revealed={revealed}
          onToggle={handleToggle}
        />
      )}

      {question.type === "select_all" && (
        <SelectAllOptions
          question={question}
          selected={selected}
          revealed={revealed}
          onToggle={handleToggle}
        />
      )}

      {question.type === "ordered_response" && (
        <OrderedResponseOptions
          question={question}
          selected={selected}
          revealed={revealed}
          onToggle={handleToggle}
        />
      )}

      {(question.type === "multiple_choice" ||
        question.type === "clinical_reasoning" ||
        question.type === "unfolding_case" ||
        question.type === "true_false") && (
        <McqOptions
          question={question}
          selected={selected}
          revealed={revealed}
          onToggle={handleToggle}
        />
      )}
    </>
  );
}

export function ExplanationPanel({ question }: { question: StudyQuestion }) {
  return (
    <div className="mt-6 space-y-4">
      <div className="rounded-xl bg-[var(--color-surface)] p-4 dark:border dark:border-white/10">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
          Rationale
        </p>
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink)]">
          {question.explanation}
        </p>
      </div>

      {question.clinicalReasoning && (
        <div className="rounded-xl border border-[var(--color-accent)]/15 bg-[var(--color-accent)]/5 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-accent)]">
            Clinical reasoning
          </p>
          <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink)]">
            {question.clinicalReasoning}
          </p>
        </div>
      )}

      {question.distractorRationale &&
        Object.keys(question.distractorRationale).length > 0 && (
          <div className="rounded-xl border border-black/[0.06] p-4 dark:border-white/10">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
              Why each distractor fails
            </p>
            <ul className="mt-3 space-y-2">
              {Object.entries(question.distractorRationale).map(([opt, why]) => (
                <li key={opt} className="text-sm">
                  <span className="font-medium text-[var(--color-ink)]">
                    {cleanOptionText(opt)}:
                  </span>{" "}
                  <span className="text-[var(--color-ink-muted)]">{why}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

      {question.references && question.references.length > 0 && (
        <div className="text-xs text-[var(--color-ink-muted)]">
          <span className="font-semibold uppercase tracking-wide">Sources</span>
          <ul className="mt-1 list-inside list-disc">
            {question.references.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      )}

      {question.type === "matrix" && question.correctAnswers.length > 0 && (
        <div className="text-xs text-[var(--color-ink-muted)]">
          <span className="font-semibold uppercase tracking-wide">Correct cells</span>
          <ul className="mt-1 list-inside list-disc">
            {question.correctAnswers.map((k) => (
              <li key={k}>{formatMatrixAnswer(k)}</li>
            ))}
          </ul>
        </div>
      )}

      {question.solutionSteps && question.solutionSteps.length > 0 && (
        <ol className="list-decimal space-y-1 pl-5 text-sm text-[var(--color-ink-muted)]">
          {question.solutionSteps.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ol>
      )}
    </div>
  );
}
