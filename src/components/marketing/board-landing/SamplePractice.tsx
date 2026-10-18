"use client";

import { useState } from "react";
import { CollapsibleSources } from "@/components/study/questions/CollapsibleSources";
import type { LandingQuestion } from "@/lib/marketing/board-landing/model";

const LETTERS = ["A", "B", "C", "D", "E", "F"] as const;

/** Tap an option for instant correct or incorrect feedback. The stem is server-rendered. */
export function SamplePractice({ sample }: { sample: LandingQuestion }) {
  const [picked, setPicked] = useState<string | null>(null);
  const revealed = picked !== null;

  return (
    <div className="bl-quiz">
      <ul className="bl-options">
        {sample.options.map((option, index) => {
          const selected = picked === option.id;
          const showCorrect = revealed && option.correct;
          const showWrong = revealed && selected && !option.correct;
          return (
            <li key={option.id}>
              <button
                type="button"
                className={
                  showCorrect ? "is-correct" : showWrong ? "is-wrong" : selected ? "is-selected" : undefined
                }
                aria-pressed={selected}
                disabled={revealed}
                onClick={() => setPicked(option.id)}
              >
                <span className="bl-letter" aria-hidden>
                  {LETTERS[index] ?? index + 1}
                </span>
                <span>{option.text}</span>
              </button>
              {revealed && option.rationale ? (
                <p className={option.correct ? "bl-reason is-correct" : "bl-reason"}>
                  <span className="bl-reason-label">{option.correct ? "Correct. " : "Why not. "}</span>
                  {option.rationale}
                </p>
              ) : null}
            </li>
          );
        })}
      </ul>
      {sample.sources.length > 0 ? (
        <CollapsibleSources count={sample.sources.length} resetKey={sample.id} className="bl-sources">
          <ul>
            {sample.sources.map((source) => (
              <li key={source}>
                <cite>{source}</cite>
              </li>
            ))}
          </ul>
        </CollapsibleSources>
      ) : null}
    </div>
  );
}
