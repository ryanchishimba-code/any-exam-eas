"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { GeneratedExam } from "@/lib/ai";
import {
  advanceSession,
  createStudySession,
  getQuestionByIndex,
  isSessionComplete,
  recordSessionAnswer,
  summarizeSession,
} from "@/lib/questions/session-engine";
import { isAnswerCorrect } from "@/lib/questions/prepare";
import { bowTieSelectionValid, parseBowTieLayout, parseMatrixKey } from "@/lib/questions/ngn-structures";
import { persistSessionLocally } from "@/lib/questions/storage";
import type {
  ConfidenceLevel,
  RawQuestionInput,
  StudyMode,
  StudyQuestion,
  StudySessionState,
} from "@/lib/questions/types";
import type { LearningInsight, RemediationRecommendation } from "@/lib/learning/types";
import { InsightPanel } from "./InsightPanel";
import { AnswerFeedbackLabel } from "@/components/ui/StatusMessage";
import {
  ExplanationPanel,
  QuestionRenderer,
} from "./questions/QuestionRenderer";

type Props = {
  field: string;
  subjectId?: string;
  questions: RawQuestionInput[];
  sourceType: StudySessionState["sourceType"];
  sourceId?: string;
  title?: string;
  mode?: StudyMode;
  onComplete?: (summary: ReturnType<typeof summarizeSession>) => void;
};

export function StudySessionPlayer({
  field,
  subjectId,
  questions: rawQuestions,
  sourceType,
  sourceId,
  title,
  mode = "practice",
  onComplete,
}: Props) {
  const initial = useMemo(
    () =>
      createStudySession({
        questions: rawQuestions,
        field,
        subjectId,
        sourceType,
        sourceId,
        mode,
        timedSecondsPerQuestion: mode === "timed" ? 45 : undefined,
      }),
    [rawQuestions, field, subjectId, sourceType, sourceId, mode]
  );

  const [sessionState, setSessionState] = useState<StudySessionState>(initial.session);
  const [questionList] = useState<StudyQuestion[]>(initial.questions);

  const [selected, setSelected] = useState<string[]>([]);
  const [showConfidence, setShowConfidence] = useState(false);
  const [insight, setInsight] = useState<LearningInsight | null>(null);
  const [remediation, setRemediation] = useState<RemediationRecommendation[]>([]);
  const [timerSec, setTimerSec] = useState(initial.session.timedSecondsPerQuestion ?? 0);
  const startedAt = useRef<number>(Date.now());
  const progressSaved = useRef(false);
  const touchStart = useRef<number | null>(null);

  const current = getQuestionByIndex(questionList, sessionState, sessionState.currentIndex);
  const answer = current ? sessionState.answers[current.id] : undefined;
  const summary = summarizeSession(sessionState, questionList);
  const complete = isSessionComplete(sessionState, questionList);

  const persist = useCallback(
    (s: StudySessionState) => {
      persistSessionLocally(s, questionList);
      void fetch("/api/study/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session: s,
          questions: questionList,
          completed: isSessionComplete(s, questionList),
          score: summarizeSession(s, questionList).accuracy,
        }),
      });
    },
    [questionList]
  );

  const submitAttempt = useCallback(
    async (
      q: StudyQuestion,
      correct: boolean,
      choices: string[],
      durationMs: number,
      confidence?: ConfidenceLevel
    ) => {
      const res = await fetch("/api/study/attempt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: q,
          correct,
          confidence,
          durationMs,
          selectedAnswer: choices.join(", "),
          sessionId: sessionState.sessionId,
        }),
      });
      if (res.ok) {
        const data = (await res.json()) as {
          insight?: LearningInsight;
          remediation?: RemediationRecommendation[];
        };
        if (data.insight) setInsight(data.insight);
        if (data.remediation) setRemediation(data.remediation);
      }
    },
    [sessionState.sessionId]
  );

  const revealAnswer = useCallback(
    async (choices: string[]) => {
      if (!current) return;
      const durationMs = Date.now() - startedAt.current;
      const next = recordSessionAnswer(sessionState, current, choices, { durationMs });
      setSessionState(next);
      persist(next);
      setInsight(null);
      setRemediation([]);

      const correct = isAnswerCorrect(current, choices);

      if (sessionState.mode === "practice" || sessionState.mode === "adaptive" || sessionState.mode === "weak_area" || sessionState.mode === "tutor") {
        setShowConfidence(true);
        return;
      }

      void submitAttempt(current, correct, choices, durationMs);

      if (sessionState.mode === "rapid") {
        setTimeout(() => {
          const advanced = advanceSession(next, 1);
          setSessionState(advanced);
          persist(advanced);
        }, 500);
      }
    },
    [current, sessionState, persist, submitAttempt]
  );

  useEffect(() => {
    if (!current || answer?.revealed) return;
    startedAt.current = Date.now();
    setSelected([]);
    setShowConfidence(false);
    setInsight(null);
    setRemediation([]);
    if (sessionState.mode === "timed") {
      setTimerSec(sessionState.timedSecondsPerQuestion ?? 45);
    }
  }, [current, answer?.revealed, sessionState.mode, sessionState.timedSecondsPerQuestion]);

  useEffect(() => {
    if (sessionState.mode !== "timed" || !current || answer?.revealed) return;
    if (timerSec <= 0) {
      void revealAnswer(selected.length ? selected : []);
      return;
    }
    const t = setTimeout(() => setTimerSec((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timerSec, sessionState.mode, current, answer?.revealed, selected, revealAnswer]);

  function goNext(from?: StudySessionState) {
    const base = from ?? sessionState;
    const next = advanceSession(base, 1);
    setSessionState(next);
    persist(next);
  }

  function goPrev() {
    const next = advanceSession(sessionState, -1);
    setSessionState(next);
    persist(next);
  }

  function toggleSelect(option: string) {
    if (answer?.revealed || !current) return;
    if (option === "__clear__") {
      setSelected([]);
      return;
    }
    if (current.type === "ordered_response") {
      setSelected((prev) => (prev.includes(option) ? prev : [...prev, option]));
      return;
    }
    if (current.type === "select_all" || current.type === "highlight") {
      setSelected((prev) =>
        prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
      );
      return;
    }
    if (current.type === "matrix") {
      setSelected((prev) => {
        if (prev.includes(option)) return prev.filter((o) => o !== option);
        const { row } = parseMatrixKey(option);
        const withoutRow = prev.filter((o) => parseMatrixKey(o).row !== row);
        return [...withoutRow, option];
      });
      return;
    }
    if (current.type === "bow_tie") {
      const layout = parseBowTieLayout(current);
      setSelected((prev) => {
        if (prev.includes(option)) return prev.filter((o) => o !== option);
        if (layout.actions.includes(option)) {
          const next = prev.filter((o) => !layout.actions.includes(o));
          return [...next, option];
        }
        if (layout.monitors.includes(option)) {
          let next = prev.filter((o) => !layout.monitors.includes(o));
          const monitors = prev.filter((o) => layout.monitors.includes(o));
          if (monitors.length >= layout.monitorPickCount) {
            next = prev.filter((o) => o !== monitors[0]);
          }
          return [...next, option];
        }
        return [...prev, option];
      });
      return;
    }
    setSelected([option]);
    if (sessionState.mode === "rapid") {
      void revealAnswer([option]);
    }
  }

  function canSubmitSelection(): boolean {
    if (!current || selected.length === 0) return false;
    if (current.type === "ordered_response") {
      return selected.length === current.correctAnswers.length;
    }
    if (current.type === "bow_tie") {
      const layout = parseBowTieLayout(current);
      return bowTieSelectionValid(selected, layout);
    }
    if (current.type === "matrix") {
      return selected.length === current.correctAnswers.length;
    }
    return true;
  }

  function onConfidence(level: ConfidenceLevel) {
    if (!current || !answer) return;
    const next = recordSessionAnswer(sessionState, current, answer.selected, {
      confidence: level,
      durationMs: answer.durationMs,
    });
    setSessionState(next);
    setShowConfidence(false);
    void submitAttempt(
      current,
      answer.correct === true,
      answer.selected,
      answer.durationMs ?? 0,
      level
    );
    persist(next);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!current || answer?.revealed) return;
      const num = Number(e.key);
      if (num >= 1 && num <= current.options.length) {
        toggleSelect(current.options[num - 1]);
      }
      if (e.key === "Enter" && selected.length > 0) {
        void revealAnswer(selected);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  useEffect(() => {
    if (!complete || progressSaved.current) return;
    progressSaved.current = true;
    onComplete?.(summary);
    if (sourceType === "exam" && sourceId) {
      void fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entityType: "exam",
          entityId: sourceId,
          score: summary.accuracy,
          completed: true,
          metadata: { correct: summary.correct, total: summary.total },
        }),
      });
    }
  }, [complete, summary, onComplete, sourceId, sourceType]);

  if (!current) {
    return (
      <div className="rounded-2xl border border-black/10 bg-white p-8 text-center">
        <p className="text-lg font-semibold">Session complete</p>
        <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
          {summary.correct} / {summary.total} correct ({summary.accuracy}%)
        </p>
      </div>
    );
  }

  const progressPct = ((sessionState.currentIndex + 1) / questionList.length) * 100;

  return (
    <div
      className="mt-8 space-y-4"
      onTouchStart={(e) => {
        touchStart.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchStart.current == null) return;
        const dx = e.changedTouches[0].clientX - touchStart.current;
        if (dx < -60) goNext();
        if (dx > 60) goPrev();
        touchStart.current = null;
      }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          {title && <p className="text-sm font-medium">{title}</p>}
          <p className="text-xs text-[var(--color-ink-muted)]">
            {sessionState.mode} · {sessionState.currentIndex + 1}/{questionList.length}
            {summary.answered > 0 && ` · ${summary.accuracy}%`}
          </p>
        </div>
        {sessionState.mode === "timed" && !answer?.revealed && (
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-900">
            {timerSec}s
          </span>
        )}
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-black/[0.06]">
        <motion.div
          className="h-full bg-[var(--color-accent)]"
          animate={{ width: `${progressPct}%` }}
          transition={{ duration: 0.25 }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.article
          key={current.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="rounded-2xl border border-black/[0.08] bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[var(--color-surface-elevated)] sm:p-8"
        >
          <QuestionRenderer
            question={current}
            selected={selected}
            revealed={!!answer?.revealed}
            onToggle={toggleSelect}
          />

          {!answer?.revealed && sessionState.mode !== "rapid" && (
            <button
              type="button"
              disabled={!canSubmitSelection()}
              onClick={() => void revealAnswer(selected)}
              className="mt-8 rounded-full bg-[var(--color-accent)] px-10 py-3 text-sm font-medium text-white disabled:opacity-40"
            >
              {current.type === "ordered_response" &&
              selected.length !== current.correctAnswers.length
                ? `Select ${current.correctAnswers.length - selected.length} more`
                : current.type === "bow_tie" && !canSubmitSelection()
                  ? "Complete bow-tie selections"
                  : current.type === "matrix" && !canSubmitSelection()
                    ? `Select ${current.correctAnswers.length} cells`
                    : "Check"}
            </button>
          )}

          {answer?.revealed && (
            <div className="space-y-3">
              <p className="text-sm">
                <AnswerFeedbackLabel correct={answer.correct === true} />
              </p>
              <ExplanationPanel question={current} />
              {insight && (
                <InsightPanel
                  insight={insight}
                  remediation={remediation}
                  correct={answer.correct === true}
                />
              )}
            </div>
          )}

          {showConfidence && (
            <div className="mt-6 flex flex-wrap gap-2">
              {([1, 2, 3, 4, 5] as ConfidenceLevel[]).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => onConfidence(n)}
                  className="h-9 w-9 rounded-full border text-sm hover:bg-black/[0.04]"
                >
                  {n}
                </button>
              ))}
            </div>
          )}
        </motion.article>
      </AnimatePresence>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={goPrev}
          disabled={sessionState.currentIndex === 0}
          className="rounded-full border px-5 py-2 text-sm disabled:opacity-30"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => (answer?.revealed ? goNext() : void revealAnswer(selected))}
          disabled={!answer?.revealed && !selected.length}
          className="rounded-full bg-[var(--color-accent)] px-5 py-2 text-sm font-medium text-white disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export function StudySessionFromExam(props: {
  exam: GeneratedExam;
  examId?: string;
  mode?: StudyMode;
}) {
  return (
    <StudySessionPlayer
      field={props.exam.field}
      questions={props.exam.questions.map((q) => ({ ...q, field: props.exam.field }))}
      sourceType="exam"
      sourceId={props.examId}
      title={props.exam.title}
      mode={props.mode}
    />
  );
}
