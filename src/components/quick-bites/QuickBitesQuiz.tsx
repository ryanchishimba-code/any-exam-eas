"use client";

import { useEffect, useState } from "react";
import { dbUi } from "@/lib/study/dashboard-ui";
import { cn } from "@/lib/utils";

type PublicQuestion = {
  id: string;
  type: "single-answer" | "sata";
  stem: string;
  options: { id: string; text: string }[];
  videoTimestamp: string;
};

type Feedback = {
  correct: boolean;
  explanation: string;
  keys: string[];
};

type Phase =
  | { name: "loading" }
  | { name: "unavailable" }
  | { name: "question"; index: number; selected: string[]; correctCount: number }
  | {
      name: "feedback";
      index: number;
      selected: string[];
      correctCount: number;
      feedback: Feedback;
    }
  | { name: "score"; correctCount: number; total: number };

function NextEpisodeButton({
  onNext,
  emphasis,
}: {
  onNext: () => void;
  emphasis: "primary" | "quiet";
}) {
  return (
    <button
      type="button"
      onClick={onNext}
      className={
        emphasis === "primary"
          ? cn(dbUi.primaryBtn, "min-h-11 w-full sm:w-auto")
          : "inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-[var(--color-border)] px-4 text-[14px] font-semibold text-[var(--color-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] sm:w-auto"
      }
    >
      Next episode
    </button>
  );
}

export function QuickBitesQuiz({
  slug,
  onRewatch,
  onDone,
  onNext,
  apiBase = "/api/quick-bites",
}: {
  slug: string;
  onRewatch: (timestamp: string) => void;
  onDone: () => void;
  onNext?: () => void;
  apiBase?: string;
}) {
  const [phase, setPhase] = useState<Phase>({ name: "loading" });
  const [questions, setQuestions] = useState<PublicQuestion[]>([]);
  const [pending, setPending] = useState(false);
  const [sendError, setSendError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    setPhase({ name: "loading" });
    setQuestions([]);
    setSendError(false);

    fetch(`${apiBase}/${slug}/quiz`, { signal: controller.signal, cache: "no-store" })
      .then(async (response) => {
        if (!active) return;
        if (!response.ok) {
          setPhase({ name: "unavailable" });
          return;
        }
        const body = (await response.json()) as { questions?: PublicQuestion[] };
        if (!active) return;
        if (!body.questions?.length) {
          setPhase({ name: "unavailable" });
          return;
        }
        setQuestions(body.questions);
        setPhase({ name: "question", index: 0, selected: [], correctCount: 0 });
      })
      .catch((error: unknown) => {
        if (!active) return;
        if (error instanceof DOMException && error.name === "AbortError") return;
        setPhase({ name: "unavailable" });
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [apiBase, slug]);

  if (phase.name === "loading") {
    return (
      <div className="space-y-4">
        {onNext ? <NextEpisodeButton onNext={onNext} emphasis="quiet" /> : null}
        <p className="text-[13px] text-[var(--color-ink-muted)]" role="status">
          Loading quiz...
        </p>
      </div>
    );
  }

  if (phase.name === "unavailable") {
    return (
      <div className="space-y-4">
        {onNext ? <NextEpisodeButton onNext={onNext} emphasis="quiet" /> : null}
        <p className="text-[13px] text-[var(--color-ink-muted)]">
          This quiz is part of a paid membership.
        </p>
      </div>
    );
  }

  if (phase.name === "score") {
    return (
      <section aria-labelledby="quick-bites-score" className="space-y-4">
        <h3
          id="quick-bites-score"
          className="text-[22px] font-semibold tracking-[-0.03em] text-[var(--color-ink)]"
        >
          You got {phase.correctCount} of {phase.total}.
        </h3>
        <div className="flex flex-col gap-2 sm:flex-row">
          {onNext ? <NextEpisodeButton onNext={onNext} emphasis="primary" /> : null}
          <button
            type="button"
            onClick={onDone}
            className={
              onNext
                ? "inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-[var(--color-border)] px-4 text-[14px] font-semibold text-[var(--color-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] sm:w-auto"
                : cn(dbUi.primaryBtn, "min-h-11 w-full sm:w-auto")
            }
          >
            Back to episodes
          </button>
        </div>
      </section>
    );
  }

  const question = questions[phase.index];
  if (!question) return null;
  const locked = phase.name === "feedback";
  const canCheck = phase.selected.length > 0 && !pending;

  function toggle(optionId: string) {
    if (phase.name !== "question") return;
    setSendError(false);
    setPhase({
      ...phase,
      selected:
        question.type === "single-answer"
          ? [optionId]
          : phase.selected.includes(optionId)
            ? phase.selected.filter((id) => id !== optionId)
            : [...phase.selected, optionId],
    });
  }

  async function checkAnswer() {
    if (phase.name !== "question" || phase.selected.length === 0 || pending) return;
    setPending(true);
    setSendError(false);
    try {
      const response = await fetch(`${apiBase}/${slug}/quiz`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ questionId: question.id, selected: phase.selected }),
      });
      if (!response.ok) {
        setSendError(true);
        return;
      }
      const feedback = (await response.json()) as Feedback;
      if (
        typeof feedback.correct !== "boolean" ||
        typeof feedback.explanation !== "string" ||
        !Array.isArray(feedback.keys)
      ) {
        setSendError(true);
        return;
      }
      setPhase({
        name: "feedback",
        index: phase.index,
        selected: phase.selected,
        correctCount: phase.correctCount + (feedback.correct ? 1 : 0),
        feedback,
      });
    } catch {
      setSendError(true);
    } finally {
      setPending(false);
    }
  }

  function goNext() {
    if (phase.name !== "feedback") return;
    const next = phase.index + 1;
    if (next >= questions.length) {
      setPhase({ name: "score", correctCount: phase.correctCount, total: questions.length });
      return;
    }
    setPhase({
      name: "question",
      index: next,
      selected: [],
      correctCount: phase.correctCount,
    });
  }

  return (
    <section aria-labelledby="quick-bites-quiz-heading" className="space-y-4">
      {onNext ? <NextEpisodeButton onNext={onNext} emphasis="quiet" /> : null}
      <div className="space-y-2">
        <p id="quick-bites-quiz-heading" className={dbUi.eyebrow}>
          {`Quiz · Question ${phase.index + 1} of ${questions.length}`}
        </p>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void checkAnswer();
          }}
        >
          <fieldset disabled={locked} className="min-w-0 space-y-3">
            <legend className="text-[16px] font-semibold leading-snug tracking-[-0.02em] text-[var(--color-ink)]">
              {question.stem}
            </legend>
            {question.type === "sata" ? (
              <p className="text-[13px] font-medium text-[var(--color-ink-muted)]">
                Select all that apply
              </p>
            ) : null}
            <div className="space-y-2">
              {question.options.map((option) => {
                const selected = phase.selected.includes(option.id);
                const isKey = locked && phase.feedback.keys.includes(option.id);
                return (
                  <label
                    key={option.id}
                    className={cn(
                      "flex min-h-11 items-center gap-3 rounded-xl border px-3 py-2 text-[14px] leading-snug text-[var(--color-ink)]",
                      isKey
                        ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10"
                        : "border-[var(--color-border)] bg-[var(--color-surface)]"
                    )}
                  >
                    <input
                      type={question.type === "sata" ? "checkbox" : "radio"}
                      name={question.id}
                      value={option.id}
                      checked={selected}
                      onChange={() => toggle(option.id)}
                      className="h-5 w-5 shrink-0 accent-[var(--color-accent)]"
                    />
                    <span>
                      <span className="mr-2 font-semibold">{option.id}.</span>
                      {option.text}
                    </span>
                  </label>
                );
              })}
            </div>
            {locked ? null : (
              <button
                type="submit"
                disabled={!canCheck}
                className={cn(dbUi.primaryBtn, "min-h-11 w-full sm:w-auto")}
              >
                {pending ? "Checking..." : "Check answer"}
              </button>
            )}
          </fieldset>
        </form>
      </div>

      {sendError ? (
        <p className="text-[13px] text-[var(--color-ink-muted)]" role="alert">
          That answer did not send. Try again.
        </p>
      ) : null}

      {locked ? (
        <div className="space-y-3" aria-live="polite">
          <p className="text-[13px] font-semibold text-[var(--color-ink)]">
            {phase.feedback.correct ? "Correct" : "Not quite"}
          </p>
          <p className="text-[14px] leading-relaxed text-[var(--color-ink)]">
            {phase.feedback.explanation}
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={goNext}
              className={cn(dbUi.primaryBtn, "min-h-11 w-full sm:w-auto")}
            >
              {phase.index + 1 >= questions.length ? "See score" : "Next question"}
            </button>
            <button
              type="button"
              onClick={() => onRewatch(question.videoTimestamp)}
              className="inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-[var(--color-border)] px-4 text-[14px] font-semibold text-[var(--color-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] sm:w-auto"
            >
              Rewatch this part
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
