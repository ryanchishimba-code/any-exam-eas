"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { getSequentialSetContext } from "@/lib/questions/sequential-sets";
import { bowTieSelectionValid, parseBowTieLayout, parseMatrixKey } from "@/lib/questions/ngn-structures";
import { persistSessionLocally } from "@/lib/questions/storage";
import { saveStudySessionRemote } from "@/lib/client/save-study-session";
import { EndActivityControl } from "./EndActivityControl";
import {
  TopicPracticeReturnCompletion,
  type TopicPracticeReturn,
} from "./TopicPracticeReturnBanner";
import { SessionCompletionCard } from "./SessionCompletionCard";
import type { ActivitySessionSummary } from "@/lib/client/exam-session-summary";
import type {
  AdaptiveSessionMeta,
  ConfidenceLevel,
  RawQuestionInput,
  StudyMode,
  StudyQuestion,
  StudySessionState,
} from "@/lib/questions/types";
import { AdaptiveReasoningChip } from "./AdaptiveReasoningChip";
import type { LearningInsight, RemediationRecommendation } from "@/lib/learning/types";
import { InsightPanel } from "./InsightPanel";
import { AnswerFeedbackLabel } from "@/components/ui/StatusMessage";
import {
  ExplanationPanel,
  QuestionRenderer,
} from "./questions/QuestionRenderer";
import { formatHms } from "@/lib/full-exam/config";
import { examSlugFromFieldId } from "@/lib/edtech/exams";
import { StudyThisTopicButton } from "./StudyThisTopicButton";
import { resolveStudyLinksFromQuestion } from "@/lib/reference/question-study-links";
import { Flag } from "lucide-react";

type Props = {
  field: string;
  subjectId?: string;
  questions: RawQuestionInput[];
  sourceType: StudySessionState["sourceType"];
  sourceId?: string;
  title?: string;
  mode?: StudyMode;
  adaptiveMeta?: AdaptiveSessionMeta;
  /** Whole-exam countdown for board timed simulations (e.g. NAPLEX 6 hours). */
  timedSessionSeconds?: number;
  onComplete?: (summary: ReturnType<typeof summarizeSession>) => void;
  /** When set, show return-to-review-module actions after the last question. */
  returnTo?: TopicPracticeReturn;
};

export function StudySessionPlayer({
  field,
  subjectId,
  questions: rawQuestions,
  sourceType,
  sourceId,
  title,
  mode = "practice",
  adaptiveMeta,
  timedSessionSeconds,
  onComplete,
  returnTo,
}: Props) {
  const initial = useMemo(
    () => {
      const created = createStudySession({
        questions: rawQuestions,
        field,
        subjectId,
        sourceType,
        sourceId,
        mode,
        timedSecondsPerQuestion: mode === "timed" && !timedSessionSeconds ? 45 : undefined,
        timedSessionSeconds: mode === "timed" ? timedSessionSeconds : undefined,
      });
      if (adaptiveMeta) {
        created.session.adaptiveMeta = adaptiveMeta;
      }
      return created;
    },
    [rawQuestions, field, subjectId, sourceType, sourceId, mode, adaptiveMeta, timedSessionSeconds]
  );

  const [sessionState, setSessionState] = useState<StudySessionState>(initial.session);
  const [questionList] = useState<StudyQuestion[]>(initial.questions);

  const [selected, setSelected] = useState<string[]>([]);
  const [showConfidence, setShowConfidence] = useState(false);
  const [insight, setInsight] = useState<LearningInsight | null>(null);
  const [remediation, setRemediation] = useState<RemediationRecommendation[]>([]);
  const usesSessionTimer = Boolean(initial.session.timedSessionSeconds);
  const [timerSec, setTimerSec] = useState(
    initial.session.timedSessionSeconds ?? initial.session.timedSecondsPerQuestion ?? 0
  );
  const [timeUp, setTimeUp] = useState(false);
  const [inReview, setInReview] = useState(false);
  const [flaggedIds, setFlaggedIds] = useState<Set<string>>(() => new Set());
  const startedAt = useRef<number>(Date.now());
  const progressSaved = useRef(false);
  const touchStart = useRef<number | null>(null);

  const current = getQuestionByIndex(questionList, sessionState, sessionState.currentIndex);
  const answer = current ? sessionState.answers[current.id] : undefined;
  const sequentialContext = useMemo(
    () =>
      current
        ? getSequentialSetContext(current, questionList, sessionState.answers)
        : null,
    [current, questionList, sessionState.answers]
  );
  const summary = summarizeSession(sessionState, questionList);
  const complete = isSessionComplete(sessionState, questionList) || timeUp;

  const persist = useCallback(
    (s: StudySessionState) => {
      persistSessionLocally(s, questionList);
      void saveStudySessionRemote({
        session: s,
        questions: questionList,
        completed: isSessionComplete(s, questionList),
      }).catch(() => undefined);
    },
    [questionList]
  );

  const exitSession = useCallback(async (): Promise<ActivitySessionSummary> => {
    persistSessionLocally(sessionState, questionList);
    await saveStudySessionRemote({
      session: sessionState,
      questions: questionList,
      completed: false,
      endedEarly: true,
    });

    const partial = summarizeSession(sessionState, questionList);

    if (sourceType === "exam" && sourceId) {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entityType: "exam",
          entityId: sourceId,
          score: partial.accuracy,
          completed: false,
          metadata: {
            correct: partial.correct,
            total: partial.total,
            answered: partial.answered,
            endedEarly: true,
          },
        }),
      });
      if (!res.ok) {
        throw new Error("Could not save exam progress.");
      }
    }

    return {
      title: title ?? `${field} practice`,
      activityType: sourceType === "exam" ? "exam" : "practice",
      mode: sessionState.mode,
      answered: partial.answered,
      total: partial.total,
      correct: partial.correct,
      accuracy: partial.accuracy,
      endedEarly: true,
      timed: sessionState.mode === "timed",
    };
  }, [field, questionList, sessionState, sourceId, sourceType, title]);

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
    if (sessionState.mode === "timed" && !usesSessionTimer) {
      setTimerSec(sessionState.timedSecondsPerQuestion ?? 45);
    }
  }, [current, answer?.revealed, sessionState.mode, sessionState.timedSecondsPerQuestion, usesSessionTimer]);

  useEffect(() => {
    if (sessionState.mode !== "timed" || usesSessionTimer) return;
    if (!current || answer?.revealed) return;
    if (timerSec <= 0) {
      void revealAnswer(selected.length ? selected : []);
      return;
    }
    const t = setTimeout(() => setTimerSec((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timerSec, sessionState.mode, current, answer?.revealed, selected, revealAnswer, usesSessionTimer]);

  useEffect(() => {
    if (sessionState.mode !== "timed" || !usesSessionTimer || timeUp) return;
    if (timerSec <= 0) {
      setTimeUp(true);
      return;
    }
    const t = setTimeout(() => setTimerSec((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timerSec, sessionState.mode, usesSessionTimer, timeUp]);

  function startReview() {
    setInReview(true);
    const next = { ...sessionState, currentIndex: 0 };
    setSessionState(next);
    persist(next);
  }

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
    if (current.type === "drag_drop") {
      if (option.startsWith("__unmatch__|||")) {
        const prompt = option.slice("__unmatch__|||".length);
        setSelected((prev) => prev.filter((p) => !p.startsWith(`${prompt}|||`)));
        return;
      }
      setSelected((prev) => {
        const [left] = option.split("|||");
        if (!left) return prev;
        const without = prev.filter((p) => !p.startsWith(`${left}|||`));
        return [...without, option];
      });
      return;
    }
    if (current.type === "short_answer") {
      setSelected([option]);
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
    if (current.type === "drag_drop") {
      const prompts = (current.ngnPayload as { prompts?: string[] } | undefined)?.prompts;
      const need = prompts?.length ?? current.correctAnswers.length;
      return selected.length === need && need > 0;
    }
    if (current.type === "short_answer") {
      return selected.length > 0 && selected[0].trim().length > 0;
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
    if (returnTo) {
      return (
        <TopicPracticeReturnCompletion
          returnTo={returnTo}
          summary={summary}
          onReview={startReview}
        />
      );
    }
    return (
      <SessionCompletionCard
        title={title ? `${title} complete` : "Session complete"}
        summary={summary}
        onReview={startReview}
      />
    );
  }

  const onLastQuestion = sessionState.currentIndex === questionList.length - 1;
  const showCompletion =
    complete && !inReview && onLastQuestion && Boolean(answer?.revealed);
  const showReturnActions = Boolean(returnTo && showCompletion);

  const progressPct = ((sessionState.currentIndex + 1) / questionList.length) * 100;
  const selectionReasoning =
    sessionState.adaptiveMeta?.questionReasoning?.[String(current.id)] ??
    sessionState.adaptiveMeta?.sessionRationale;
  const examSlug = examSlugFromFieldId(field) ?? "nclex";
  const studyLinks = resolveStudyLinksFromQuestion(examSlug, current);
  const isFlagged = flaggedIds.has(String(current.id));

  const toggleFlag = () => {
    const id = String(current.id);
    setFlaggedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

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
      <div className="flex items-center justify-end gap-2">
        {sessionState.mode === "timed" && !timeUp && (
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium tabular-nums text-amber-900">
            {usesSessionTimer ? formatHms(timerSec) : `${timerSec}s`}
          </span>
        )}
        <EndActivityControl
          kind={sourceType === "exam" || sessionState.mode === "timed" ? "exam" : "activity"}
          onConfirm={exitSession}
        />
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-black/[0.06]">
        <div
          className="h-full bg-[var(--color-accent)] transition-[width] duration-200 ease-out"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <article
        key={current.id}
        className="aee-question-enter rounded-2xl border border-black/[0.08] bg-white p-4 shadow-sm sm:p-6 md:p-8"
      >
          {(sessionState.mode === "adaptive" ||
            sessionState.mode === "weak_area" ||
            sessionState.adaptiveMeta) &&
            selectionReasoning && (
              <AdaptiveReasoningChip
                reasoning={
                  sessionState.adaptiveMeta?.questionReasoning?.[String(current.id)] ??
                  selectionReasoning
                }
                sessionRationale={sessionState.adaptiveMeta?.sessionRationale}
                questionIndex={sessionState.currentIndex}
                total={questionList.length}
              />
            )}
          <div className="mb-4 flex justify-end">
            <button
              type="button"
              onClick={toggleFlag}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                isFlagged
                  ? "border-amber-300 bg-amber-50 text-amber-900"
                  : "border-black/[0.08] text-[var(--color-ink-muted)] hover:bg-black/[0.03]"
              }`}
              aria-pressed={isFlagged}
            >
              <Flag className="h-3.5 w-3.5" aria-hidden />
              {isFlagged ? "Flagged" : "Flag for review"}
            </button>
          </div>
          <QuestionRenderer
            question={current}
            selected={selected}
            revealed={!!answer?.revealed}
            onToggle={toggleSelect}
            sequentialContext={sequentialContext}
          />

          {!answer?.revealed && sessionState.mode !== "rapid" && (
            <button
              type="button"
              disabled={!canSubmitSelection()}
              onClick={() => void revealAnswer(selected)}
              className="mt-8 w-full rounded-full bg-[var(--color-accent)] px-6 py-3 text-sm font-medium text-white disabled:opacity-40 sm:w-auto sm:px-10"
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
              <StudyThisTopicButton
                links={studyLinks}
                missed={answer.correct !== true}
                flagged={isFlagged}
              />
              <ExplanationPanel question={current} field={field} />
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
      </article>

      {showReturnActions && returnTo ? (
        <TopicPracticeReturnCompletion
          returnTo={returnTo}
          summary={summary}
          onReview={startReview}
        />
      ) : showCompletion ? (
        <SessionCompletionCard summary={summary} onReview={startReview} />
      ) : null}

      {!showReturnActions && !showCompletion ? (
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <button
          type="button"
          onClick={goPrev}
          disabled={sessionState.currentIndex === 0}
          className="w-full rounded-full border px-5 py-2.5 text-sm disabled:opacity-30 sm:w-auto"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => (answer?.revealed ? goNext() : void revealAnswer(selected))}
          disabled={!answer?.revealed && !selected.length}
          className="w-full rounded-full bg-[var(--color-accent)] px-5 py-2.5 text-sm font-medium text-white disabled:opacity-40 sm:w-auto"
        >
          Next
        </button>
      </div>
      ) : null}
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
