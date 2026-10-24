"use client";

import { useCallback, useEffect, useMemo, useState, type KeyboardEvent } from "react";
import { LandingCta } from "@/components/landing/LandingCta";
import {
  freeQuizSignupHref,
  type FreeQuizBoardSlug,
  type FreeQuizGradePayload,
  type FreeQuizGradeResultItem,
  type PublicFreeQuizPayload,
  type PublicFreeQuizQuestion,
} from "@/lib/marketing/free-quiz";

const LETTERS = ["A", "B", "C", "D", "E", "F"] as const;

function optionClassName(flags: { selected: boolean; correct: boolean; wrong: boolean }): string | undefined {
  const names = [
    flags.correct ? "is-correct" : flags.wrong ? "is-wrong" : null,
    flags.selected ? "is-selected" : null,
  ].filter((name): name is string => Boolean(name));
  return names.length ? names.join(" ") : undefined;
}

function ChoiceList({
  questionId,
  options,
  selected,
  correctAnswers,
  multi,
  locked,
  onToggle,
}: {
  questionId: string;
  options: string[];
  selected: readonly string[];
  correctAnswers?: readonly string[];
  multi: boolean;
  locked: boolean;
  onToggle?: (option: string) => void;
}) {
  const selectedSet = new Set(selected);
  const correctSet = new Set(correctAnswers ?? []);

  const moveFocus = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (locked) return;
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp" && event.key !== "ArrowRight" && event.key !== "ArrowLeft") {
      return;
    }
    event.preventDefault();
    const delta = event.key === "ArrowDown" || event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = (index + delta + options.length) % options.length;
    const nextOption = options[nextIndex];
    const buttons = event.currentTarget.closest("ul")?.querySelectorAll("button");
    const target = buttons?.[nextIndex];
    target?.focus();
    if (!multi && nextOption && onToggle) onToggle(nextOption);
  };

  return (
    <ul
      className="bl-options"
      role={multi ? "group" : "radiogroup"}
      aria-label={multi ? "Select all that apply" : "Answer choices"}
    >
      {options.map((option, index) => {
        const isSelected = selectedSet.has(option);
        const isCorrect = locked && correctSet.has(option);
        const isWrong = locked && isSelected && !isCorrect;
        return (
          <li key={`${questionId}-${index}`}>
            <button
              type="button"
              role={multi ? "checkbox" : "radio"}
              className={optionClassName({ selected: isSelected, correct: isCorrect, wrong: isWrong })}
              aria-checked={isSelected}
              aria-pressed={isSelected}
              disabled={locked}
              onClick={() => onToggle?.(option)}
              onKeyDown={(event) => moveFocus(event, index)}
            >
              <span
                className={multi ? "bl-free-quiz__marker bl-free-quiz__marker--multi" : "bl-free-quiz__marker"}
                aria-hidden
              />
              <span className="bl-letter" aria-hidden>
                {LETTERS[index] ?? index + 1}
              </span>
              <span className="bl-free-quiz__choice-text">{option}</span>
              {locked && isSelected ? <span className="bl-free-quiz__choice-tag">Your answer</span> : null}
              {locked && isCorrect ? <span className="bl-free-quiz__choice-tag">Correct</span> : null}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function QuestionStep({
  item,
  selected,
  onChange,
}: {
  item: PublicFreeQuizQuestion;
  selected: string[];
  onChange: (next: string[]) => void;
}) {
  const multi = item.selection === "multi";

  const toggle = (option: string) => {
    if (multi) {
      onChange(selected.includes(option) ? selected.filter((value) => value !== option) : [...selected, option]);
      return;
    }
    onChange([option]);
  };

  return (
    <article className="bl-card bl-free-quiz__card">
      {multi ? <p className="bl-free-quiz__sata-hint">Select all that apply.</p> : null}
      <p className="bl-stem">{item.stem}</p>
      <ChoiceList
        questionId={item.id}
        options={item.options}
        selected={selected}
        multi={multi}
        locked={false}
        onToggle={toggle}
      />
    </article>
  );
}

function reviewOptions(item: FreeQuizGradeResultItem, fromQuiz: string[] | undefined): string[] {
  if (fromQuiz && fromQuiz.length >= 2) return fromQuiz;
  return [...new Set([...item.correctAnswers, ...item.selected])];
}

function ReviewItem({
  item,
  options,
  board,
}: {
  item: FreeQuizGradeResultItem;
  options: string[];
  board: FreeQuizBoardSlug;
}) {
  const signupHref = freeQuizSignupHref(board);

  return (
    <article className="bl-free-quiz__review-item">
      <p className="bl-free-quiz__review-stem">{item.stem}</p>
      <p className={`bl-free-quiz__review-verdict${item.correct ? " is-correct" : " is-wrong"}`}>
        {item.correct ? "Correct" : "Incorrect"}
      </p>
      <ChoiceList
        questionId={item.id}
        options={options}
        selected={item.selected}
        correctAnswers={item.correctAnswers}
        multi={item.selection === "multi"}
        locked
      />
      <div className="bl-free-quiz__upsell">
        <p className="bl-free-quiz__upsell-lead">Want explanations?</p>
        <LandingCta
          href={signupHref}
          ctaName="free_quiz_explanations"
          location="free_quiz_review"
          className="bl-free-quiz__upsell-btn"
        >
          Start for free
        </LandingCta>
        <p className="bl-free-quiz__trial-note">No card needed</p>
      </div>
    </article>
  );
}

export function FreeQuizPlayer({ board }: { board: FreeQuizBoardSlug }) {
  const [payload, setPayload] = useState<PublicFreeQuizPayload | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [grade, setGrade] = useState<FreeQuizGradePayload | null>(null);
  const [grading, setGrading] = useState(false);
  const [gradeError, setGradeError] = useState<string | null>(null);
  const [unansweredWarn, setUnansweredWarn] = useState(false);

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
          setAnswers({});
          setGrade(null);
          setGradeError(null);
          setUnansweredWarn(false);
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

  const questions = useMemo(() => payload?.questions ?? [], [payload]);
  const current = questions[index];

  const currentSelected = current ? answers[current.id] ?? [] : [];

  const setCurrentSelected = useCallback(
    (next: string[]) => {
      if (!current) return;
      setAnswers((prev) => ({ ...prev, [current.id]: next }));
    },
    [current]
  );

  const unansweredCount = questions.filter((q) => !(answers[q.id]?.length)).length;

  const submitGrade = useCallback(async () => {
    if (!payload) return;
    setGrading(true);
    setGradeError(null);
    try {
      const res = await fetch("/api/marketing/free-quiz/grade", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          board: payload.board,
          rotationKey: payload.rotationKey,
          answers: questions.map((question) => ({
            id: question.id,
            selected: answers[question.id] ?? [],
          })),
        }),
      });
      const body = (await res.json().catch(() => null)) as FreeQuizGradePayload | { error?: string } | null;
      if (!res.ok) {
        throw new Error(body && "error" in body && body.error ? body.error : "Could not grade the quiz.");
      }
      setGrade(body as FreeQuizGradePayload);
      setUnansweredWarn(false);
    } catch (error: unknown) {
      setGradeError(error instanceof Error ? error.message : "Could not grade the quiz.");
    } finally {
      setGrading(false);
    }
  }, [answers, payload, questions]);

  const tryFinish = () => {
    if (unansweredCount > 0) {
      setUnansweredWarn(true);
      return;
    }
    void submitGrade();
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

  if (grade) {
    return (
      <div className="bl-free-quiz__summary">
        <p className="bl-free-quiz__score">
          <strong>{grade.score}</strong> of <strong>{grade.total}</strong>
        </p>
        <ol className="bl-free-quiz__review-list">
          {grade.results.map((item, position) => (
            <li key={item.id}>
              <span className="bl-free-quiz__review-qnum">Question {position + 1}</span>
              <ReviewItem
                item={item}
                board={board}
                options={reviewOptions(item, questions.find((question) => question.id === item.id)?.options)}
              />
            </li>
          ))}
        </ol>
        <div className="bl-free-quiz__trial-cta">
          <LandingCta
            href={freeQuizSignupHref(board)}
            ctaName="free_quiz_trial"
            location="free_quiz_summary"
            className="bl-free-quiz__trial-btn"
          >
            Start 5-day free trial
          </LandingCta>
          <p className="bl-free-quiz__trial-note">No card needed</p>
        </div>
      </div>
    );
  }

  const onLast = index + 1 >= questions.length;

  return (
    <div className="bl-free-quiz__player">
      <p className="bl-free-quiz__progress" aria-live="polite">
        Question {index + 1} of {questions.length}
      </p>
      {current ? (
        <QuestionStep key={current.id} item={current} selected={currentSelected} onChange={setCurrentSelected} />
      ) : null}
      {unansweredWarn ? (
        <p className="bl-free-quiz__warn" role="alert">
          {unansweredCount === 1
            ? "1 question has no answer selected."
            : `${unansweredCount} questions have no answer selected.`}{" "}
          You can still finish and see your score.
        </p>
      ) : null}
      {gradeError ? (
        <p className="bl-free-quiz__status bl-free-quiz__status--error" role="alert">{gradeError}</p>
      ) : null}
      <div className="bl-free-quiz__nav">
        <button
          type="button"
          className="aee-flagship-cta aee-flagship-cta--secondary bl-free-quiz__nav-btn"
          disabled={index === 0 || grading}
          onClick={() => {
            setUnansweredWarn(false);
            setIndex((value) => Math.max(0, value - 1));
          }}
        >
          Previous
        </button>
        {onLast ? (
          <button
            type="button"
            className="aee-flagship-cta aee-flagship-cta--primary bl-free-quiz__nav-btn"
            disabled={grading}
            onClick={() => {
              if (unansweredWarn) void submitGrade();
              else tryFinish();
            }}
          >
            {grading ? "Grading…" : unansweredWarn ? "Finish anyway" : "Finish quiz"}
          </button>
        ) : (
          <button
            type="button"
            className="aee-flagship-cta aee-flagship-cta--primary bl-free-quiz__nav-btn"
            disabled={grading}
            onClick={() => {
              setUnansweredWarn(false);
              setIndex((value) => value + 1);
            }}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}
