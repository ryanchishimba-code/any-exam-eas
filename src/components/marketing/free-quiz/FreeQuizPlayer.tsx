"use client";

import { useCallback, useEffect, useState } from "react";
import { Check } from "lucide-react";
import { LandingCta } from "@/components/landing/LandingCta";
import { StudyUseNote } from "@/components/legal/StudyUseNote";
import { QuestionIssueFooter } from "@/components/study/QuestionIssueFooter";
import { CollapsibleSources } from "@/components/study/questions/CollapsibleSources";
import {
  freeQuizSignupHref,
  type FreeQuizBoardSlug,
  type PublicFreeQuizPayload,
  type PublicFreeQuizQuestion,
} from "@/lib/marketing/free-quiz";
const LETTERS = ["A", "B", "C", "D", "E", "F"] as const;

function QuestionStep({
  item,
  fieldId,
  onAnswered,
}: {
  item: PublicFreeQuizQuestion;
  fieldId: string;
  onAnswered: (correct: boolean) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const correct = revealed && selected === item.correct;

  const reveal = useCallback(() => {
    if (!selected) return;
    setRevealed(true);
    onAnswered(selected === item.correct);
  }, [item.correct, onAnswered, selected]);

  return (
    <article className="bl-card bl-free-quiz__card">
      <p className="bl-stem">{item.stem}</p>
      <ul className="bl-options" aria-label="Answer choices">
        {item.options.map((option, index) => {
          const isSelected = selected === option;
          const showCorrect = revealed && option === item.correct;
          const showWrong = revealed && isSelected && option !== item.correct;
          return (
            <li key={option}>
              <button
                type="button"
                className={
                  showCorrect ? "is-correct" : showWrong ? "is-wrong" : isSelected ? "is-selected" : undefined
                }
                aria-pressed={isSelected}
                disabled={revealed}
                onClick={() => setSelected(option)}
              >
                <span className="bl-letter" aria-hidden>
                  {LETTERS[index] ?? index + 1}
                </span>
                <span>{option}</span>
                {showCorrect ? <Check className="bl-free-quiz__check" aria-hidden /> : null}
              </button>
            </li>
          );
        })}
      </ul>
      {!revealed ? (
        <button
          type="button"
          className="aee-flagship-cta aee-flagship-cta--primary bl-free-quiz__check-btn"
          disabled={!selected}
          onClick={reveal}
        >
          Check answer
        </button>
      ) : (
        <div className="bl-free-quiz__feedback">
          <p className="bl-free-quiz__verdict">
            {correct ? "Correct." : "Not this one."} The keyed answer is marked.
          </p>
          <p className="bl-reason is-correct">
            <span className="bl-reason-label">Rationale. </span>
            {item.rationale}
          </p>
          <StudyUseNote className="bl-free-quiz__study-note" />
          {item.sources.length > 0 ? (
            <CollapsibleSources count={item.sources.length} resetKey={item.id} className="bl-sources">
              <ul>
                {item.sources.map((source) => (
                  <li key={source}>
                    <cite>{source}</cite>
                  </li>
                ))}
              </ul>
            </CollapsibleSources>
          ) : null}
          <QuestionIssueFooter
            report={{
              bankItemId: item.id,
              questionKey: item.id,
              fieldId,
              stemPreview: item.stem.slice(0, 500),
              options: item.options,
              correctAnswer: item.correct,
              selectedAnswer: selected ?? undefined,
            }}
          />
        </div>
      )}
    </article>
  );
}

export function FreeQuizPlayer({ board }: { board: FreeQuizBoardSlug }) {
  const [payload, setPayload] = useState<PublicFreeQuizPayload | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [advancePending, setAdvancePending] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadError(null);
    fetch(`/api/marketing/free-quiz?board=${encodeURIComponent(board)}`, {
      credentials: "same-origin",
    })
      .then(async (res) => {
        if (!res.ok) {
          const body = (await res.json().catch(() => null)) as { error?: string } | null;
          throw new Error(body?.error ?? "Could not load the quiz.");
        }
        return res.json() as Promise<PublicFreeQuizPayload>;
      })
      .then((data) => {
        if (!cancelled) {
          setPayload(data);
          setIndex(0);
          setScore(0);
          setFinished(false);
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setLoadError(error instanceof Error ? error.message : "Could not load the quiz.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [board]);

  const questions = payload?.questions ?? [];
  const current = questions[index];
  const fieldId =
    board === "nclex"
      ? "nursing"
      : board === "naplex"
        ? "pharmacy"
        : board === "usmle"
          ? "usmle-step-2"
          : board;

  const onAnswered = useCallback(
    (correct: boolean) => {
      if (correct) setScore((value) => value + 1);
      setAdvancePending(true);
    },
    []
  );

  const goNext = () => {
    setAdvancePending(false);
    if (index + 1 >= questions.length) {
      setFinished(true);
      return;
    }
    setIndex((value) => value + 1);
  };

  if (loading) {
    return <p className="bl-free-quiz__status" role="status">Loading questions…</p>;
  }

  if (loadError) {
    return <p className="bl-free-quiz__status bl-free-quiz__status--error" role="alert">{loadError}</p>;
  }

  if (!questions.length) {
    return (
      <p className="bl-free-quiz__status" role="status">
        Sample questions are not available right now. Try again later.
      </p>
    );
  }

  if (finished) {
    return (
      <div className="bl-free-quiz__summary">
        <p className="bl-free-quiz__score">
          You answered <strong>{score}</strong> of <strong>{questions.length}</strong> correctly.
        </p>
        <LandingCta
          href={freeQuizSignupHref(board)}
          ctaName="free_quiz_trial"
          location="free_quiz_summary"
        >
          Start free trial
        </LandingCta>
      </div>
    );
  }

  return (
    <div className="bl-free-quiz__player">
      <p className="bl-free-quiz__progress" aria-live="polite">
        Question {index + 1} of {questions.length}
      </p>
      {current ? (
        <QuestionStep item={current} fieldId={fieldId} onAnswered={onAnswered} />
      ) : null}
      {advancePending ? (
        <button
          type="button"
          className="aee-flagship-cta aee-flagship-cta--secondary bl-free-quiz__next"
          onClick={goNext}
        >
          {index + 1 >= questions.length ? "See score" : "Next question"}
        </button>
      ) : null}
    </div>
  );
}
