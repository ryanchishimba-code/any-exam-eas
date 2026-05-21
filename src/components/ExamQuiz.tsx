"use client";

import { useMemo, useState } from "react";
import type { ExamQuestion, GeneratedExam } from "@/lib/ai";
import { cleanOptionText, formatChoiceLabel, getSolutionSteps } from "@/lib/question-format";

const QUESTIONS_PER_PAGE = 10;

type AnswerState = {
  selected: string | null;
  revealed: boolean;
};

function isMathematicsField(field: string): boolean {
  return field.trim().toLowerCase() === "mathematics";
}

function QuestionCard({
  question,
  field,
  state,
  onSelect,
  onCheck,
  showSolutionOpen,
  onToggleSolution,
}: {
  question: ExamQuestion;
  field: string;
  state: AnswerState;
  onSelect: (option: string) => void;
  onCheck: () => void;
  showSolutionOpen: boolean;
  onToggleSolution: () => void;
}) {
  const mathMode = isMathematicsField(field);
  const steps = getSolutionSteps(question);

  const isCorrect =
    state.revealed &&
    state.selected &&
    cleanOptionText(state.selected) === cleanOptionText(question.correctAnswer);

  const correctIndex =
    question.options?.findIndex(
      (o) => cleanOptionText(o) === cleanOptionText(question.correctAnswer)
    ) ?? -1;

  return (
    <article className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
      <p className="text-xs uppercase text-[var(--color-ink-muted)]">
        Question {question.id} · {field}
        {question.highYield && (
          <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-amber-800 normal-case">
            High yield
          </span>
        )}
      </p>
      <p className="mt-3 text-lg font-medium leading-relaxed">{question.question}</p>

      {question.options && (
        <ul className="mt-6 space-y-3">
          {question.options.map((o, i) => {
            const selected = state.selected === o;
            const revealed = state.revealed;
            const isCorrectOption =
              cleanOptionText(o) === cleanOptionText(question.correctAnswer);

            const rowBorder = revealed
              ? isCorrectOption
                ? "border-green-300 bg-green-50"
                : selected
                  ? "border-red-300 bg-red-50"
                  : "border-black/5 bg-[var(--color-surface)] opacity-60"
              : selected
                ? "border-[var(--color-accent)] bg-blue-50 ring-2 ring-[var(--color-accent)]"
                : "border-black/10 bg-[var(--color-surface)]";

            const showHowButton =
              mathMode && revealed && isCorrectOption && correctIndex === i;

            return (
              <li key={`${question.id}-${i}`} className="space-y-2">
                <div
                  className={`flex items-center gap-2 rounded-xl border pr-2 transition ${rowBorder}`}
                >
                  <button
                    type="button"
                    onClick={() => onSelect(o)}
                    disabled={revealed}
                    className={`min-w-0 flex-1 rounded-l-xl px-4 py-3 text-left text-sm ${
                      revealed
                        ? isCorrectOption
                          ? "text-green-900"
                          : selected
                            ? "text-red-900"
                            : "text-[var(--color-ink-muted)]"
                        : "text-[var(--color-ink)]"
                    }`}
                  >
                    {formatChoiceLabel(i, o)}
                  </button>
                  {showHowButton && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleSolution();
                      }}
                      className={`shrink-0 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition ${
                        showSolutionOpen
                          ? "bg-[var(--color-accent)] text-white"
                          : "text-[var(--color-accent)] hover:bg-blue-100"
                      }`}
                    >
                      {showSolutionOpen ? "Hide" : "Show how solved"}
                    </button>
                  )}
                </div>
                {showHowButton && showSolutionOpen && (
                  <div className="rounded-xl border border-green-200 bg-green-50/80 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-green-900">
                      How {formatChoiceLabel(i, o)} is derived
                    </p>
                    <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-green-950">
                      {steps.map((step, si) => (
                        <li key={si}>{step}</li>
                      ))}
                    </ol>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {mathMode && !state.revealed && (
        <p className="mt-4 text-xs text-[var(--color-ink-muted)]">
          After you check your answer, use &quot;Show how solved&quot; on the correct choice to
          see step-by-step work.
        </p>
      )}

      <div className="mt-8 flex flex-wrap gap-3">
        {!state.revealed && (
          <button
            type="button"
            onClick={onCheck}
            disabled={!state.selected}
            className="rounded-full bg-[var(--color-accent)] px-6 py-2.5 text-sm font-medium text-white disabled:opacity-40"
          >
            Check answer
          </button>
        )}
        {state.revealed && (
          <p
            className={`text-sm font-medium ${isCorrect ? "text-green-700" : "text-red-700"}`}
          >
            {isCorrect ? "Correct!" : "Not quite."}
            {mathMode
              ? " Open Show how solved on the correct answer."
              : " See explanation below."}
          </p>
        )}
      </div>

      {state.revealed && !mathMode && (
        <div className="mt-6 rounded-2xl bg-[var(--color-surface)] p-5 text-sm leading-relaxed text-[var(--color-ink-muted)]">
          <p className="font-medium text-[var(--color-ink)]">
            Correct answer: {question.correctAnswer}
          </p>
          <p className="mt-2">{question.explanation}</p>
        </div>
      )}

      {state.revealed && mathMode && (
        <p className="mt-4 text-sm text-[var(--color-ink-muted)]">
          Correct answer:{" "}
          <span className="font-medium text-green-800">{question.correctAnswer}</span>
        </p>
      )}
    </article>
  );
}

export function ExamQuiz({ exam }: { exam: GeneratedExam }) {
  const [answers, setAnswers] = useState<Record<number, AnswerState>>({});
  const [page, setPage] = useState(0);
  const [openSolutionIds, setOpenSolutionIds] = useState<Set<number>>(new Set());

  const mathMode = isMathematicsField(exam.field);

  function toggleSolution(questionId: number) {
    setOpenSolutionIds((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) next.delete(questionId);
      else next.add(questionId);
      return next;
    });
  }

  const questions = exam.questions;
  const totalPages = Math.max(1, Math.ceil(questions.length / QUESTIONS_PER_PAGE));
  const pageStart = page * QUESTIONS_PER_PAGE;
  const pageQuestions = questions.slice(pageStart, pageStart + QUESTIONS_PER_PAGE);
  const rangeLabel = `${pageStart + 1}–${Math.min(pageStart + QUESTIONS_PER_PAGE, questions.length)}`;

  const score = useMemo(() => {
    let correct = 0;
    let answered = 0;
    for (const q of questions) {
      const a = answers[q.id];
      if (a?.revealed && a.selected) {
        answered++;
        if (cleanOptionText(a.selected) === cleanOptionText(q.correctAnswer)) {
          correct++;
        }
      }
    }
    return { correct, answered, total: questions.length };
  }, [answers, questions]);

  function getState(id: number): AnswerState {
    return answers[id] ?? { selected: null, revealed: false };
  }

  function selectOption(questionId: number, option: string) {
    const state = getState(questionId);
    if (state.revealed) return;
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { selected: option, revealed: false },
    }));
  }

  function checkAnswer(questionId: number) {
    const state = getState(questionId);
    if (!state.selected) return;
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { selected: state.selected, revealed: true },
    }));
  }

  const allDone = score.answered === score.total;
  const pageChecked = pageQuestions.filter((q) => getState(q.id).revealed).length;

  return (
    <div className="mt-10 space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-ink-muted)]">
              Practice mode · {QUESTIONS_PER_PAGE} questions per page
              {mathMode && " · step-by-step solutions after check"}
            </p>
            <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
              Page {page + 1} of {totalPages} · Questions {rangeLabel} of {questions.length}
              {score.answered > 0 && (
                <> · Score: {score.correct}/{score.answered}</>
              )}
            </p>
          </div>
          <div className="h-2 w-32 overflow-hidden rounded-full bg-[var(--color-surface)]">
            <div
              className="h-full bg-[var(--color-accent)] transition-all"
              style={{ width: `${((page + 1) / totalPages) * 100}%` }}
            />
          </div>
        </div>
        <p className="mt-3 text-xs text-[var(--color-ink-muted)]">
          {pageChecked} of {pageQuestions.length} checked on this page
        </p>
      </div>

      {allDone && (
        <div className="rounded-3xl bg-green-50 p-6 text-center">
          <p className="text-lg font-semibold text-green-900">Exam complete</p>
          <p className="mt-1 text-green-800">
            You got {score.correct} out of {score.total} correct (
            {Math.round((score.correct / score.total) * 100)}%)
          </p>
        </div>
      )}

      <div className="space-y-8">
        {pageQuestions.map((q) => (
          <QuestionCard
            key={q.id}
            question={q}
            field={exam.field}
            state={getState(q.id)}
            onSelect={(option) => selectOption(q.id, option)}
            onCheck={() => checkAnswer(q.id)}
            showSolutionOpen={openSolutionIds.has(q.id)}
            onToggleSolution={() => toggleSolution(q.id)}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-white px-6 py-4 shadow-sm">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="rounded-full border border-black/10 px-5 py-2 text-sm font-medium text-[var(--color-accent)] disabled:opacity-30"
          >
            ← Previous page
          </button>
          <div className="flex flex-wrap justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPage(i)}
                className={`h-9 min-w-9 rounded-full px-3 text-sm font-medium transition ${
                  i === page
                    ? "bg-[var(--color-accent)] text-white"
                    : "bg-[var(--color-surface)] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="rounded-full border border-black/10 px-5 py-2 text-sm font-medium text-[var(--color-accent)] disabled:opacity-30"
          >
            Next page →
          </button>
        </div>
      )}
    </div>
  );
}
