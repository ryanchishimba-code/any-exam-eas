"use client";

import { Check } from "lucide-react";
import type { SampleQuestionPreview } from "@/lib/landing/content";
import { cn } from "@/lib/utils";

const LABELS = ["A", "B", "C", "D"] as const;

/** UWorld-style sample question card for landing previews. */
export function QuestionPreviewCard({ question }: { question: SampleQuestionPreview }) {
  return (
    <article className="aee-flagship-question-card">
      <header className="aee-flagship-question-card__head">
        <span
          className="aee-flagship-question-card__badge"
          style={{
            color: question.examColor,
            borderColor: `${question.examColor}40`,
            backgroundColor: `${question.examColor}0d`,
          }}
        >
          {question.exam}
        </span>
      </header>
      <p className="aee-flagship-question-card__stem">{question.stem}</p>
      <ol className="aee-flagship-question-card__options" aria-label="Answer choices">
        {question.options.map((opt, i) => {
          const isCorrect = opt === question.correct;
          return (
            <li
              key={opt}
              className={cn(
                "aee-flagship-question-card__option",
                isCorrect && "aee-flagship-question-card__option--correct"
              )}
            >
              <span className="aee-flagship-question-card__letter" aria-hidden>
                {LABELS[i] ?? "?"}
              </span>
              <span className="flex-1">{opt}</span>
              {isCorrect ? (
                <Check className="h-3.5 w-3.5 shrink-0 text-[var(--flagship-teal)]" aria-hidden />
              ) : null}
            </li>
          );
        })}
      </ol>
      <p className="aee-flagship-question-card__rationale">
        <strong>Rationale:</strong> {question.rationale}
      </p>
    </article>
  );
}
