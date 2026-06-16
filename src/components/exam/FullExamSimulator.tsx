"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Flag,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  StickyNote,
  PanelRightClose,
  PanelRightOpen,
} from "lucide-react";
import { FloatingTimer } from "@/components/exam/FloatingTimer";
import { ExamActionBar } from "@/components/exam/ExamActionBar";
import { PauseExamDialog } from "@/components/exam/PauseExamDialog";
import { TimeUpDialog } from "@/components/exam/TimeUpDialog";
import { Progress } from "@/components/ui/progress";
import { QuestionRenderer } from "@/components/study/questions/QuestionRenderer";
import {
  ReportQuestionDialog,
  buildReportContext,
} from "@/components/study/ReportQuestionDialog";
import { EXAM_CATALOG } from "@/lib/edtech/exams";
import {
  deserializeExamSelection,
  formatAnswerDisplay,
  serializeCorrectAnswer,
  serializeExamSelection,
} from "@/lib/full-exam/answer-serialize";
import { fullExamResultsHref } from "@/lib/full-exam/config";
import { buildTopicBreakdown } from "@/lib/full-exam/topic-breakdown";
import {
  calculateExamScorePercent,
  mergeExamAnswers,
} from "@/lib/exam-sessions/scoring";
import type { ExamAnswerRecord } from "@/lib/exam-sessions/service";
import { parseBowTieLayout, parseMatrixKey } from "@/lib/questions/ngn-structures";
import { isAnswerCorrect } from "@/lib/questions/prepare";
import { mapApiQuestionsToStudy } from "@/lib/questions/finalize-exam-session";
import { getSequentialSetContext } from "@/lib/questions/sequential-sets";
import type { RawQuestionInput, StudyQuestion } from "@/lib/questions/types";
import type { ExamSlug } from "@/types/edtech";
import type {
  FullExamAnswerState,
  FullExamSessionConfig,
} from "@/types/full-exam";
import { feUi } from "@/lib/study/full-exam-ui";
import { cn } from "@/lib/utils";

const ENCOURAGEMENT = [
  "You're doing great — stay focused.",
  "One question at a time. You've prepared for this.",
  "Trust your training — read carefully, then commit.",
  "Steady pace wins. Flag anything uncertain and move on.",
];

type Props = {
  sessionId: string;
  examSlug: ExamSlug;
  fieldId: string;
  config: FullExamSessionConfig;
  initialAnswers?: ExamAnswerRecord[];
  startedAt?: string | Date | null;
};

function defaultAnswer(): FullExamAnswerState {
  return { selected: [], eliminated: [], flagged: false, notes: "" };
}

function hasSelection(selected: string[]): boolean {
  return selected.length > 0;
}

function initialRemainingSec(
  config: FullExamSessionConfig,
  startedAt?: string | Date | null
): number {
  if (!config.timed || config.timeLimitSec <= 0) return config.timeLimitSec;
  if (!startedAt) return config.timeLimitSec;
  const elapsed = Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000);
  return Math.max(0, config.timeLimitSec - elapsed);
}

function hydrateAnswers(records: ExamAnswerRecord[]): Record<number, FullExamAnswerState> {
  const out: Record<number, FullExamAnswerState> = {};
  for (const a of records) {
    out[a.questionIndex] = {
      selected: deserializeExamSelection(a.selected),
      eliminated: a.eliminated ?? [],
      flagged: a.flagged ?? false,
      notes: a.notes ?? "",
    };
  }
  return out;
}

export function FullExamSimulator({
  sessionId,
  examSlug,
  fieldId,
  config,
  initialAnswers = [],
  startedAt = null,
}: Props) {
  const router = useRouter();
  const exam = EXAM_CATALOG[examSlug];

  const [questions, setQuestions] = useState<StudyQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, FullExamAnswerState>>(() =>
    hydrateAnswers(initialAnswers)
  );
  const [remainingSec, setRemainingSec] = useState(() =>
    initialRemainingSec(config, startedAt)
  );
  const [elapsedSec, setElapsedSec] = useState(() => {
    if (config.timed || !startedAt) return 0;
    return Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000);
  });
  const [paused, setPaused] = useState(false);
  const [pauseDialog, setPauseDialog] = useState(false);
  const [timeUp, setTimeUp] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [notesOpen, setNotesOpen] = useState(false);
  const [phase, setPhase] = useState<"exam" | "review">("exam");
  const [hasEnteredReview, setHasEnteredReview] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [encouragement] = useState(
    () => ENCOURAGEMENT[Math.floor(Math.random() * ENCOURAGEMENT.length)]
  );

  const pauseAccumSec = useRef(0);
  const pauseStarted = useRef<number | null>(null);

  const current = questions[index];
  const currentAnswer = answers[index] ?? defaultAnswer();
  const sequentialContext = useMemo(
    () =>
      current
        ? getSequentialSetContext(current, questions, {})
        : null,
    [current, questions]
  );
  const flaggedIndices = useMemo(
    () =>
      Object.entries(answers)
        .filter(([, a]) => a.flagged)
        .map(([i]) => Number(i)),
    [answers]
  );

  const answeredCount = useMemo(
    () => Object.values(answers).filter((a) => hasSelection(a.selected)).length,
    [answers]
  );

  const unansweredIndices = useMemo(
    () =>
      questions
        .map((_, i) => (!hasSelection(answers[i]?.selected ?? []) ? i : -1))
        .filter((i) => i >= 0),
    [questions, answers]
  );

  useEffect(() => {
    let cancelled = false;

    async function loadQuestions() {
      setLoading(true);
      setLoadError(null);

      let mpjeStateCode: string | null = null;
      try {
        const prefRes = await fetch("/api/user/exam-preference", { cache: "no-store" });
        if (prefRes.ok) {
          const pref = (await prefRes.json()) as { mpjeStateCode?: string | null };
          mpjeStateCode = pref.mpjeStateCode ?? null;
        }
      } catch {
        // Non-fatal — MPJE may still work with federal-only bank.
      }

      const qs = new URLSearchParams({
        field: fieldId,
        mode: "timed",
        scope: "field",
        limit: String(config.questionCount),
      });
      if (config.adaptive) qs.set("mixed", "1");
      qs.set("meta", "0");
      if (fieldId === "mpje" && mpjeStateCode) {
        qs.set("state", mpjeStateCode);
        qs.set("mpjeState", mpjeStateCode);
        qs.set("mpjeVariant", "state");
      }
      if (fieldId === "nursing" && config.nclexLength) {
        qs.set("nclexLength", config.nclexLength);
      }
      if (fieldId === "nursing" && config.presetExamNumber) {
        qs.set("presetExamNumber", String(config.presetExamNumber));
      }

      try {
        const res = await fetch(`/api/questions?${qs.toString()}`);
        const data = (await res.json()) as {
          error?: string;
          questions?: RawQuestionInput[];
          bankItemIds?: string[];
          requested?: number;
        };

        if (!res.ok) {
          if (!cancelled) {
            setLoadError(data.error ?? "Could not load exam questions.");
            setQuestions([]);
          }
          return;
        }

        const expectedCount = data.requested ?? config.questionCount;
        const bankIds = data.bankItemIds ?? [];
        const raw: RawQuestionInput[] = (data.questions ?? []).map((q, i) => ({
          ...q,
          field: fieldId,
          bankItemId: bankIds[i] ?? q.bankItemId,
        }));

        const prepared = mapApiQuestionsToStudy(raw, { shuffleOptions: false });
        if (prepared.length !== expectedCount) {
          if (!cancelled) {
            setLoadError(
              `Expected ${expectedCount} questions but received ${prepared.length}. Try again in a moment or choose a shorter exam length.`
            );
            setQuestions([]);
          }
          return;
        }

        const items = prepared.slice(0, expectedCount).map((q, i) => ({
          ...q,
          id: bankIds[i] ?? q.bankItemId ?? q.id,
          bankItemId: bankIds[i] ?? q.bankItemId,
          field: fieldId,
        }));

        if (!cancelled) setQuestions(items);
      } catch {
        if (!cancelled) {
          setLoadError("Could not load exam questions. Check your connection and try again.");
          setQuestions([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadQuestions();
    return () => {
      cancelled = true;
    };
  }, [fieldId, config.questionCount, config.adaptive, config.nclexLength, config.presetExamNumber]);

  useEffect(() => {
    if (loading || submitting || paused) return;

    const tick = setInterval(() => {
      if (config.timed && config.timeLimitSec > 0) {
        setRemainingSec((s) => {
          if (s <= 1) {
            setTimeUp(true);
            return 0;
          }
          return s - 1;
        });
      } else {
        setElapsedSec((s) => s + 1);
      }
    }, 1000);

    return () => clearInterval(tick);
  }, [loading, submitting, paused, config.timed, config.timeLimitSec]);

  const persistAnswer = useCallback(
    async (qi: number, state: FullExamAnswerState) => {
      const q = questions[qi];
      if (!q) return;
      if (!hasSelection(state.selected) && !state.flagged && !state.notes) return;

      const selectedSerialized = serializeExamSelection(q, state.selected);
      const correct =
        hasSelection(state.selected) && isAnswerCorrect(q, state.selected);

      await fetch(`/api/exam-sessions/${sessionId}/answer`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionIndex: qi,
          questionId: q.bankItemId ?? q.id,
          selected: selectedSerialized,
          correct,
          flagged: state.flagged,
          eliminated: state.eliminated,
          notes: state.notes,
          topicCategory: q.subjectId,
        } satisfies Partial<ExamAnswerRecord>),
      });
    },
    [questions, sessionId]
  );

  const toggleSelect = useCallback(
    (option: string) => {
      if (!current || submitting || timeUp) return;

      let nextSelected: string[];

      if (option === "__clear__") {
        nextSelected = [];
      } else if (current.type === "ordered_response") {
        const prev = currentAnswer.selected;
        nextSelected = prev.includes(option) ? prev : [...prev, option];
      } else if (current.type === "drag_drop") {
        const prev = currentAnswer.selected;
        if (option.startsWith("__unmatch__|||")) {
          const prompt = option.slice("__unmatch__|||".length);
          nextSelected = prev.filter((p) => !p.startsWith(`${prompt}|||`));
        } else {
          const [left] = option.split("|||");
          if (!left) {
            nextSelected = prev;
          } else {
            const without = prev.filter((p) => !p.startsWith(`${left}|||`));
            nextSelected = [...without, option];
          }
        }
      } else if (current.type === "short_answer") {
        nextSelected = [option];
      } else if (current.type === "select_all" || current.type === "highlight") {
        const prev = currentAnswer.selected;
        nextSelected = prev.includes(option)
          ? prev.filter((o) => o !== option)
          : [...prev, option];
      } else if (current.type === "matrix") {
        const prev = currentAnswer.selected;
        if (prev.includes(option)) {
          nextSelected = prev.filter((o) => o !== option);
        } else {
          const { row } = parseMatrixKey(option);
          const withoutRow = prev.filter((o) => parseMatrixKey(o).row !== row);
          nextSelected = [...withoutRow, option];
        }
      } else if (current.type === "bow_tie") {
        const layout = parseBowTieLayout(current);
        const prev = currentAnswer.selected;
        if (prev.includes(option)) {
          nextSelected = prev.filter((o) => o !== option);
        } else if (layout.actions.includes(option)) {
          nextSelected = [...prev.filter((o) => !layout.actions.includes(o)), option];
        } else if (layout.monitors.includes(option)) {
          let next = prev.filter((o) => !layout.monitors.includes(o));
          const monitors = prev.filter((o) => layout.monitors.includes(o));
          if (monitors.length >= layout.monitorPickCount) {
            next = prev.filter((o) => o !== monitors[0]);
          }
          nextSelected = [...next, option];
        } else {
          nextSelected = [...prev, option];
        }
      } else {
        nextSelected = [option];
      }

      setAnswers((prev) => {
        const next = { ...prev[index], ...currentAnswer, selected: nextSelected };
        const merged = { ...prev, [index]: next };
        void persistAnswer(index, next);
        return merged;
      });
    },
    [current, currentAnswer, index, persistAnswer, submitting, timeUp]
  );

  const updateAnswer = useCallback(
    (patch: Partial<FullExamAnswerState>) => {
      setAnswers((prev) => {
        const next = { ...prev[index], ...patch };
        const merged = { ...prev, [index]: next };
        if (
          patch.selected !== undefined ||
          patch.flagged !== undefined ||
          patch.notes !== undefined
        ) {
          void persistAnswer(index, next);
        }
        return merged;
      });
    },
    [index, persistAnswer]
  );

  const buildAnswerLog = useCallback((): ExamAnswerRecord[] => {
    let log: ExamAnswerRecord[] = [];
    for (let i = 0; i < questions.length; i++) {
      const st = answers[i];
      if (!st || !hasSelection(st.selected)) continue;
      const q = questions[i];
      log = mergeExamAnswers(log, {
        questionIndex: i,
        questionId: q.bankItemId ?? q.id,
        selected: serializeExamSelection(q, st.selected),
        correct: isAnswerCorrect(q, st.selected),
        flagged: st.flagged,
        eliminated: st.eliminated,
        notes: st.notes,
        topicCategory: q.subjectId,
        answeredAt: new Date().toISOString(),
      });
    }
    return log;
  }, [answers, questions]);

  const submitExam = useCallback(
    async (endedEarly = false) => {
      if (submitting) return;
      setSubmitting(true);
      setSubmitError(null);

      const log = buildAnswerLog();
      const score = calculateExamScorePercent(log, questions.length);
      const topicBreakdown = buildTopicBreakdown(questions, log);
      const timeUsedSec = config.timed
        ? config.timeLimitSec - remainingSec
        : elapsedSec;

      try {
        const res = await fetch(`/api/exam-sessions/${sessionId}/answer`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            complete: true,
            endedEarly,
            score,
            weakAreas: topicBreakdown
              .filter((t) => t.pct < 70)
              .map((t) => ({ topic: t.topic, weight: t.total - t.correct })),
            analysis: {
              sessionConfig: config,
              timeUsedSec,
              topicBreakdown,
              questionIds: questions.map((q) => q.bankItemId ?? q.id),
              questionSnapshots: questions.map((q) => ({
                id: q.bankItemId ?? q.id,
                question: q.stem,
                options: q.options,
                correctAnswer: serializeCorrectAnswer(q),
                explanation: q.explanation,
                topicCategory: q.subjectId,
              })),
              summary: endedEarly
                ? "Session ended early. Your saved answers were scored."
                : `Completed ${exam.name} simulation.`,
            },
          }),
        });

        if (!res.ok) {
          const data = (await res.json().catch(() => ({}))) as { error?: string };
          throw new Error(data.error ?? "Could not submit exam");
        }

        router.push(fullExamResultsHref(examSlug, sessionId));
      } catch (e) {
        setSubmitError(e instanceof Error ? e.message : "Could not submit exam");
        setSubmitting(false);
      }
    },
    [
      submitting,
      buildAnswerLog,
      questions,
      config,
      remainingSec,
      elapsedSec,
      sessionId,
      exam.name,
      examSlug,
      router,
    ]
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (submitting || !current) return;
      if (e.key === "f" || e.key === "F") {
        updateAnswer({ flagged: !currentAnswer.flagged });
      }
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        if (index < questions.length - 1) setIndex((i) => i + 1);
        else {
          setHasEnteredReview(true);
          setPhase("review");
        }
      }
      if (e.key === "ArrowLeft" && index > 0) setIndex((i) => i - 1);
      if (e.key === "ArrowRight" && index < questions.length - 1) setIndex((i) => i + 1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current, currentAnswer.flagged, index, questions.length, submitting, updateAnswer]);

  useEffect(() => {
    if (!timeUp || submitting) return;
    const t = window.setTimeout(() => void submitExam(true), 4000);
    return () => window.clearTimeout(t);
  }, [timeUp, submitting, submitExam]);

  function confirmPause() {
    setPauseDialog(false);
    setPaused(true);
    pauseStarted.current = Date.now();
  }

  function resumeExam() {
    if (pauseStarted.current) {
      const pausedFor = Math.floor((Date.now() - pauseStarted.current) / 1000);
      pauseAccumSec.current += pausedFor;
      if (config.timed) {
        setRemainingSec((s) => s + pausedFor);
      }
      pauseStarted.current = null;
    }
    setPaused(false);
  }

  if (loading) {
    return (
      <div className={feUi.pageBg}>
        <FloatingTimer
          totalSec={config.timeLimitSec}
          remainingSec={config.timeLimitSec}
          elapsedSec={0}
          timed={config.timed}
          paused={false}
          questionsCompleted={0}
          questionsTotal={config.questionCount}
        />
        <div className="mx-auto max-w-2xl space-y-6 px-4 py-20 sm:px-6">
          <div className="space-y-3">
            <div className="h-3 w-28 animate-pulse rounded-full bg-black/[0.06]" />
            <div className="h-9 w-full max-w-lg animate-pulse rounded-[14px] bg-black/[0.06]" />
          </div>
          <div className={cn(feUi.questionPanel, "space-y-3")}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 animate-pulse rounded-[14px] bg-black/[0.04]" />
            ))}
          </div>
          <p className="text-center text-[13px] text-[var(--color-ink-muted)]">Preparing your exam…</p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className={cn(feUi.pageBg, "flex min-h-screen items-center justify-center p-6")}>
        <div className={cn(feUi.panel, "max-w-md space-y-4 p-6 text-center")}>
          <p className="text-[15px] font-medium text-[var(--color-ink)]">{loadError}</p>
          {fieldId === "mpje" ? (
            <p className="text-[13px] text-[var(--color-ink-muted)]">
              Choose your MPJE state in Settings or the study hub, then start again.
            </p>
          ) : null}
          <button
            type="button"
            onClick={() => router.push(`/full-exam/${examSlug}`)}
            className={feUi.footerBtnPrimary}
          >
            Back to launcher
          </button>
        </div>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className={cn(feUi.pageBg, "flex min-h-screen items-center justify-center p-6")}>
        <p className="text-center text-[var(--color-ink-muted)]">
          No questions available yet. Sync the question bank and try again.
        </p>
      </div>
    );
  }

  const progressPct = ((index + 1) / questions.length) * 100;

  if (phase === "review") {
    const flaggedList = [...flaggedIndices].sort((a, b) => a - b);
    return (
      <div className={feUi.pageBg}>
        <header className={feUi.glassHeader}>
          <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6">
            <h1 className="text-[17px] font-semibold text-[var(--color-ink)]">Review before submit</h1>
            <p className="text-[13px] text-[var(--color-ink-muted)]">{exam.name}</p>
          </div>
        </header>

        <FloatingTimer
          totalSec={config.timeLimitSec}
          remainingSec={remainingSec}
          elapsedSec={elapsedSec}
          timed={config.timed}
          paused={paused}
          questionsCompleted={answeredCount}
          questionsTotal={questions.length}
        />

        <main className="mx-auto max-w-2xl space-y-5 px-4 py-6 pb-36 sm:px-6">
          <div className="grid gap-3 sm:grid-cols-2">
            <ReviewStatCard
              title={`Flagged (${flaggedList.length})`}
              emptyLabel="None flagged"
              indices={flaggedList}
              tone="amber"
              onSelect={(i) => {
                setIndex(i);
                setPhase("exam");
              }}
            />
            <ReviewStatCard
              title={`Unanswered (${unansweredIndices.length})`}
              emptyLabel="All answered"
              indices={unansweredIndices}
              tone="rose"
              onSelect={(i) => {
                setIndex(i);
                setPhase("exam");
              }}
            />
          </div>

          <div className={cn(feUi.insetGroup, "bg-white p-4")}>
            <p className="text-[13px] font-semibold text-[var(--color-ink)]">Question overview</p>
            <ol className="mt-3 grid grid-cols-5 gap-1.5 sm:grid-cols-8 md:grid-cols-10">
              {questions.map((_, i) => {
                const answered = hasSelection(answers[i]?.selected ?? []);
                const flagged = Boolean(answers[i]?.flagged);
                return (
                  <li key={i}>
                    <button
                      type="button"
                      onClick={() => {
                        setIndex(i);
                        setPhase("exam");
                      }}
                      className={cn(
                        feUi.qNavBtn,
                        flagged && "ring-2 ring-amber-400/80",
                        answered ? feUi.qNavAnswered : "bg-rose-50 text-rose-700 hover:bg-rose-100"
                      )}
                    >
                      {i + 1}
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>

          {submitError ? (
            <p className="rounded-[14px] bg-rose-50 px-3 py-2 text-[13px] text-rose-700" role="alert">
              {submitError}
            </p>
          ) : null}

          <div className="flex flex-col gap-2 sm:flex-row">
            <button type="button" onClick={() => setPhase("exam")} className={cn(feUi.footerBtn, "flex-1")}>
              Return to questions
            </button>
            <button
              type="button"
              disabled={submitting}
              onClick={() => void submitExam()}
              className={cn(feUi.footerBtnPrimary, "flex-1")}
            >
              Submit exam
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={feUi.pageBg}>
      <header className={feUi.glassHeader}>
        <div className="mx-auto flex max-w-[1400px] items-center gap-4 px-4 py-3 sm:px-6">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[14px] font-semibold text-[var(--color-ink)]">{exam.name}</p>
            <p className="truncate text-[12px] text-[var(--color-ink-muted)]">{encouragement}</p>
          </div>
          <div className="hidden text-right sm:block">
            <p className="text-[13px] font-semibold tabular-nums text-[var(--color-ink)]">
              {index + 1}
              <span className="font-normal text-[var(--color-ink-muted)]"> / {questions.length}</span>
            </p>
          </div>
          <div className="w-24 sm:w-40">
            <Progress value={progressPct} className="h-1 rounded-full bg-black/[0.06]" />
          </div>
        </div>
      </header>

      <FloatingTimer
        totalSec={config.timeLimitSec}
        remainingSec={remainingSec}
        elapsedSec={elapsedSec}
        timed={config.timed}
        paused={paused}
        questionsCompleted={answeredCount}
        questionsTotal={questions.length}
      />

      <div className="mx-auto flex max-w-[1400px] gap-0 lg:gap-6">
        <aside className="hidden w-56 shrink-0 p-4 lg:block xl:w-64">
          <div className="sticky top-[calc(var(--nav-height)+1rem)] space-y-4">
            <ExamQuestionNav
              total={questions.length}
              currentIndex={index}
              answers={answers}
              onSelect={setIndex}
            />

            {flaggedIndices.length > 0 ? (
              <div className="rounded-2xl border border-amber-200/80 bg-amber-50/50 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">
                  Flagged ({flaggedIndices.length})
                </p>
                <ul className="mt-2 space-y-1">
                  {flaggedIndices.map((i) => (
                    <li key={i}>
                      <button
                        type="button"
                        onClick={() => setIndex(i)}
                        className="text-sm text-amber-900 hover:underline"
                      >
                        Q{i + 1}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </aside>

        <main className="min-w-0 flex-1 px-4 py-5 pb-36 sm:px-6 lg:pb-32">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-[var(--color-ink-muted)] lg:hidden">
            Question {index + 1} of {questions.length}
          </p>

          <article className={feUi.questionPanel}>
            <QuestionRenderer
              question={current}
              selected={currentAnswer.selected}
              revealed={false}
              onToggle={toggleSelect}
              sequentialContext={sequentialContext}
            />
          </article>
        </main>

        <aside
          className={cn(
            "shrink-0 border-l border-slate-200/80 bg-white transition-all",
            notesOpen ? "w-64 p-4 xl:w-72" : "hidden w-0 overflow-hidden xl:block xl:w-64 xl:p-4"
          )}
        >
          <div className="sticky top-24">
            <div className="mb-2 flex items-center justify-between">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <StickyNote className="h-3.5 w-3.5" /> Scratch pad
              </p>
              <button
                type="button"
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 xl:hidden"
                onClick={() => setNotesOpen(false)}
                aria-label="Close notes"
              >
                <PanelRightClose className="h-4 w-4" />
              </button>
            </div>
            <textarea
              value={currentAnswer.notes}
              onChange={(e) => updateAnswer({ notes: e.target.value })}
              placeholder="Jot down calculations or key clues…"
              className="h-40 w-full resize-none rounded-[14px] border-0 bg-black/[0.03] p-3 text-[14px] text-[var(--color-ink)] outline-none focus:bg-white focus:shadow-[0_0_0_3px_rgba(79,70,229,0.18)]"
            />
          </div>
        </aside>
      </div>

      <footer className={feUi.glassFooter}>
        <div className="mx-auto max-w-[1400px] space-y-2.5 px-4 py-3 sm:px-6">
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              disabled={index === 0}
              onClick={() => setIndex((i) => i - 1)}
              className={feUi.footerBtn}
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </button>

            {hasEnteredReview ? (
              <button type="button" onClick={() => setPhase("review")} className={feUi.footerBtn}>
                Review
              </button>
            ) : null}

            {index + 1 >= questions.length ? (
              <button
                type="button"
                disabled={submitting}
                onClick={() => {
                  setHasEnteredReview(true);
                  setPhase("review");
                }}
                className={feUi.footerBtnPrimary}
              >
                Review & submit
              </button>
            ) : (
              <button type="button" onClick={() => setIndex((i) => i + 1)} className={feUi.footerBtnDark}>
                Next <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {config.timed ? (
              <button
                type="button"
                onClick={() => (paused ? resumeExam() : setPauseDialog(true))}
                className={feUi.footerBtn}
              >
                {paused ? "Resume" : "Pause"}
              </button>
            ) : null}
            <ExamActionBar
              mode={hasEnteredReview ? "review" : "exam"}
              onEndExam={hasEnteredReview ? undefined : () => void submitExam(true)}
              onReturnToReview={hasEnteredReview ? () => setPhase("review") : undefined}
              returnLabel="Return to exam review"
            />
            <button
              type="button"
              onClick={() => setReportOpen(true)}
              className={feUi.footerBtn}
            >
              <AlertTriangle className="h-4 w-4" />
              Report
            </button>
            <button
              type="button"
              onClick={() => updateAnswer({ flagged: !currentAnswer.flagged })}
              className={cn(
                feUi.footerBtn,
                currentAnswer.flagged && "border-amber-300/80 bg-amber-50 text-amber-900"
              )}
            >
              <Flag className={cn("h-4 w-4", currentAnswer.flagged && "fill-amber-500 text-amber-500")} />
              Flag
            </button>
            <button
              type="button"
              className={cn(feUi.footerBtn, "hidden sm:inline-flex")}
              onClick={() => setNotesOpen((v) => !v)}
            >
              {notesOpen ? (
                <PanelRightClose className="h-4 w-4" />
              ) : (
                <PanelRightOpen className="h-4 w-4" />
              )}
              Notes
            </button>
          </div>
        </div>
      </footer>

      <PauseExamDialog
        open={pauseDialog}
        onConfirm={confirmPause}
        onCancel={() => setPauseDialog(false)}
      />
      <TimeUpDialog open={timeUp && !submitting} onFinish={() => void submitExam(true)} />

      {current ? (
        <ReportQuestionDialog
          open={reportOpen}
          onClose={() => setReportOpen(false)}
          context={buildReportContext({
            fieldId,
            examSlug,
            sessionId,
            sessionMode: "full_exam",
            question: current,
            selectedAnswer: serializeExamSelection(current, currentAnswer.selected),
          })}
        />
      ) : null}

      <p className="sr-only" aria-live="polite">
        {config.timed ? `Time remaining ${remainingSec} seconds` : `Elapsed ${elapsedSec} seconds`}
      </p>
    </div>
  );
}

function ExamQuestionNav({
  total,
  currentIndex,
  answers,
  onSelect,
}: {
  total: number;
  currentIndex: number;
  answers: Record<number, FullExamAnswerState>;
  onSelect: (index: number) => void;
}) {
  return (
    <nav className={cn(feUi.insetGroup, "bg-white p-3 shadow-[var(--shadow-apple-sm)]")} aria-label="Question navigation">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
        Questions
      </p>
      <div className="mt-2 max-h-[min(24rem,50vh)] overflow-y-auto pr-1">
        <ol className="grid grid-cols-5 gap-1.5">
          {Array.from({ length: total }, (_, i) => {
            const st = answers[i];
            const answered = hasSelection(st?.selected ?? []);
            const flagged = Boolean(st?.flagged);
            const current = i === currentIndex;
            return (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => onSelect(i)}
                  aria-current={current ? "step" : undefined}
                  aria-label={`Question ${i + 1}${answered ? ", answered" : ""}${flagged ? ", flagged" : ""}`}
                  className={cn(
                    feUi.qNavBtn,
                    current ? feUi.qNavCurrent : answered ? feUi.qNavAnswered : feUi.qNavEmpty
                  )}
                >
                  {i + 1}
                  {flagged ? (
                    <span
                      className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-amber-400 ring-1 ring-white"
                      aria-hidden
                    />
                  ) : null}
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}

function ReviewStatCard({
  title,
  emptyLabel,
  indices,
  tone,
  onSelect,
}: {
  title: string;
  emptyLabel: string;
  indices: number[];
  tone: "amber" | "rose";
  onSelect: (index: number) => void;
}) {
  const toneClass =
    tone === "amber"
      ? "border-amber-200/70 bg-amber-50/50 text-amber-950"
      : "border-rose-200/70 bg-rose-50/50 text-rose-950";
  return (
    <div className={cn("rounded-[18px] border p-4", toneClass)}>
      <p className="text-[14px] font-semibold">{title}</p>
      {indices.length === 0 ? (
        <p className="mt-2 text-[13px] opacity-70">{emptyLabel}</p>
      ) : (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {indices.map((i) => (
            <button
              key={i}
              type="button"
              className="rounded-full bg-white/90 px-3 py-1 text-[12px] font-semibold shadow-sm transition hover:bg-white"
              onClick={() => onSelect(i)}
            >
              Q{i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
