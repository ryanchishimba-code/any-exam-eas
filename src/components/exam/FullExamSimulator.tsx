"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Flag,
  ChevronLeft,
  ChevronRight,
  StickyNote,
  PanelRightClose,
  PanelRightOpen,
} from "lucide-react";
import { FloatingTimer } from "@/components/exam/FloatingTimer";
import { ExamActionBar } from "@/components/exam/ExamActionBar";
import { ExamChoiceCard } from "@/components/exam/ExamChoiceCard";
import { PauseExamDialog } from "@/components/exam/PauseExamDialog";
import { TimeUpDialog } from "@/components/exam/TimeUpDialog";
import { Progress } from "@/components/ui/progress";
import { EXAM_CATALOG } from "@/lib/edtech/exams";
import { fullExamResultsHref } from "@/lib/full-exam/config";
import { buildTopicBreakdown } from "@/lib/full-exam/topic-breakdown";
import {
  calculateExamScorePercent,
  mergeExamAnswers,
} from "@/lib/exam-sessions/scoring";
import type { ExamAnswerRecord } from "@/lib/exam-sessions/service";
import type { ExamSlug } from "@/types/edtech";
import type {
  FullExamAnswerState,
  FullExamQuestion,
  FullExamSessionConfig,
} from "@/types/full-exam";
import { cn } from "@/lib/utils";

const LETTERS = ["A", "B", "C", "D", "E", "F"];
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
};

function defaultAnswer(): FullExamAnswerState {
  return { selected: null, eliminated: [], flagged: false, notes: "" };
}

export function FullExamSimulator({ sessionId, examSlug, fieldId, config }: Props) {
  const router = useRouter();
  const exam = EXAM_CATALOG[examSlug];

  const [questions, setQuestions] = useState<FullExamQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, FullExamAnswerState>>({});
  const [remainingSec, setRemainingSec] = useState(config.timeLimitSec);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [paused, setPaused] = useState(false);
  const [pauseDialog, setPauseDialog] = useState(false);
  const [timeUp, setTimeUp] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [phase, setPhase] = useState<"exam" | "review">("exam");
  const [hasEnteredReview, setHasEnteredReview] = useState(false);
  const [encouragement] = useState(
    () => ENCOURAGEMENT[Math.floor(Math.random() * ENCOURAGEMENT.length)]
  );

  const pauseAccumSec = useRef(0);
  const pauseStarted = useRef<number | null>(null);
  const startedAt = useRef(Date.now());

  const current = questions[index];
  const currentAnswer = answers[index] ?? defaultAnswer();
  const flaggedIndices = useMemo(
    () =>
      Object.entries(answers)
        .filter(([, a]) => a.flagged)
        .map(([i]) => Number(i)),
    [answers]
  );

  const answeredCount = useMemo(
    () => Object.values(answers).filter((a) => a.selected).length,
    [answers]
  );

  const unansweredIndices = useMemo(
    () =>
      questions
        .map((_, i) => (!answers[i]?.selected ? i : -1))
        .filter((i) => i >= 0),
    [questions, answers]
  );

  useEffect(() => {
    const qs = new URLSearchParams({
      field: fieldId,
      mode: "timed",
      scope: "field",
      limit: String(config.questionCount),
    });
    if (config.adaptive) qs.set("mixed", "1");
    qs.set("meta", "0");

    fetch(`/api/questions?${qs.toString()}`)
      .then((r) => r.json())
      .then((d) => {
        const bankIds: string[] = d.bankItemIds ?? [];
        const items: FullExamQuestion[] = (d.questions ?? []).map(
          (
            q: {
              id: number;
              question: string;
              options: string[];
              correctAnswer: string;
              explanation: string;
              topicCategory?: string;
            },
            i: number
          ) => ({
            id: bankIds[i] ?? String(q.id),
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
            topicCategory: q.topicCategory,
          })
        );
        setQuestions(items.slice(0, config.questionCount));
      })
      .finally(() => setLoading(false));
  }, [fieldId, config.questionCount, config.adaptive]);

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
      if (!state.selected && !state.flagged && !state.notes) return;

      await fetch(`/api/exam-sessions/${sessionId}/answer`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionIndex: qi,
          questionId: q.id,
          selected: state.selected ?? "",
          correct: state.selected ? state.selected === q.correctAnswer : false,
          flagged: state.flagged,
          eliminated: state.eliminated,
          notes: state.notes,
          topicCategory: q.topicCategory,
        } satisfies Partial<ExamAnswerRecord>),
      });
    },
    [questions, sessionId]
  );

  const updateAnswer = useCallback(
    (patch: Partial<FullExamAnswerState>) => {
      setAnswers((prev) => {
        const next = { ...prev[index], ...patch };
        const merged = { ...prev, [index]: next };
        if (patch.selected || patch.flagged !== undefined || patch.notes !== undefined) {
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
      if (!st?.selected) continue;
      const q = questions[i];
      log = mergeExamAnswers(log, {
        questionIndex: i,
        questionId: q.id,
        selected: st.selected,
        correct: st.selected === q.correctAnswer,
        flagged: st.flagged,
        eliminated: st.eliminated,
        notes: st.notes,
        topicCategory: q.topicCategory,
        answeredAt: new Date().toISOString(),
      });
    }
    return log;
  }, [answers, questions]);

  const submitExam = useCallback(
    async (endedEarly = false) => {
      if (submitting) return;
      setSubmitting(true);

      const log = buildAnswerLog();
      const score = calculateExamScorePercent(log, questions.length);
      const topicBreakdown = buildTopicBreakdown(questions, log);
      const timeUsedSec = config.timed
        ? config.timeLimitSec - remainingSec
        : elapsedSec;

      await fetch(`/api/exam-sessions/${sessionId}/answer`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          complete: true,
          endedEarly,
          score,
          weakAreas: topicBreakdown.filter((t) => t.pct < 70).map((t) => ({ topic: t.topic, weight: t.total - t.correct })),
          analysis: {
            sessionConfig: config,
            timeUsedSec,
            topicBreakdown,
            questionIds: questions.map((q) => q.id),
            questionSnapshots: questions.map((q) => ({
              id: q.id,
              question: q.question,
              options: q.options,
              correctAnswer: q.correctAnswer,
              explanation: q.explanation,
              topicCategory: q.topicCategory,
            })),
            summary: endedEarly
              ? "Session ended early. Your saved answers were scored."
              : `Completed ${exam.name} simulation.`,
          },
        }),
      });

      router.push(fullExamResultsHref(examSlug, sessionId));
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
      const opts = current.options;
      if (e.key >= "1" && e.key <= "9") {
        const i = Number(e.key) - 1;
        if (opts[i]) updateAnswer({ selected: opts[i] });
      }
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
  }, [current, currentAnswer.flagged, index, questions.length, submitting, updateAnswer, submitExam]);

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
      pauseAccumSec.current += Math.floor((Date.now() - pauseStarted.current) / 1000);
      pauseStarted.current = null;
    }
    setPaused(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f7fb]">
        <FloatingTimer
          totalSec={config.timeLimitSec}
          remainingSec={config.timeLimitSec}
          elapsedSec={0}
          timed={config.timed}
          paused={false}
          questionsCompleted={0}
          questionsTotal={config.questionCount}
        />
        <div className="mx-auto max-w-3xl space-y-6 px-4 py-16 sm:px-6">
          <div className="space-y-3">
            <div className="h-3 w-32 animate-pulse rounded bg-slate-200" />
            <div className="h-8 w-full max-w-xl animate-pulse rounded-lg bg-slate-200" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-slate-100" />
          </div>
          <div className="space-y-3 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 animate-pulse rounded-xl bg-slate-100" />
            ))}
          </div>
          <p className="text-center text-sm text-slate-500">Preparing your exam…</p>
        </div>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f7fb] p-6">
        <p className="text-center text-slate-600">
          No questions available yet. Run <code className="text-xs">npm run db:seed-edtech</code> or{" "}
          <code className="text-xs">npm run db:sync-questions</code>.
        </p>
      </div>
    );
  }

  const progressPct = ((index + 1) / questions.length) * 100;

  if (phase === "review") {
    const flaggedList = [...flaggedIndices].sort((a, b) => a - b);
    return (
      <div className="min-h-screen bg-[#f0f4f8] text-slate-900">
        <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
          <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6">
            <h1 className="text-lg font-semibold text-slate-900">Review before submit</h1>
            <p className="text-sm text-slate-500">{exam.name}</p>
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

        <main className="mx-auto max-w-3xl space-y-8 px-4 py-8 sm:px-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4">
              <p className="font-semibold text-amber-900">
                Flagged for review ({flaggedList.length})
              </p>
              {flaggedList.length === 0 ? (
                <p className="mt-2 text-sm text-slate-500">None flagged</p>
              ) : (
                <div className="mt-3 flex flex-wrap gap-2">
                  {flaggedList.map((i) => (
                    <button
                      key={i}
                      type="button"
                      className="rounded-lg bg-white px-3 py-1 text-sm font-medium text-amber-900 shadow-sm hover:bg-amber-100"
                      onClick={() => {
                        setIndex(i);
                        setPhase("exam");
                      }}
                    >
                      Q{i + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-4">
              <p className="font-semibold text-rose-900">
                Unanswered ({unansweredIndices.length})
              </p>
              {unansweredIndices.length === 0 ? (
                <p className="mt-2 text-sm text-slate-500">All questions answered</p>
              ) : (
                <div className="mt-3 flex flex-wrap gap-2">
                  {unansweredIndices.map((i) => (
                    <button
                      key={i}
                      type="button"
                      className="rounded-lg bg-white px-3 py-1 text-sm font-medium text-rose-800 shadow-sm hover:bg-rose-100"
                      onClick={() => {
                        setIndex(i);
                        setPhase("exam");
                      }}
                    >
                      Q{i + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
            <p className="text-sm font-semibold text-slate-700">Question overview</p>
            <ol className="mt-3 grid grid-cols-5 gap-2 sm:grid-cols-8 md:grid-cols-10">
              {questions.map((_, i) => {
                const answered = Boolean(answers[i]?.selected);
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
                        "flex h-9 w-full items-center justify-center rounded-lg text-xs font-semibold tabular-nums transition",
                        flagged && "ring-2 ring-amber-400",
                        answered
                          ? "bg-teal-50 text-teal-800 hover:bg-teal-100"
                          : "bg-rose-50 text-rose-800 hover:bg-rose-100"
                      )}
                    >
                      {i + 1}
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => setPhase("exam")}
              className="flex-1 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Return to exam
            </button>
            <button
              type="button"
              disabled={submitting}
              onClick={() => void submitExam()}
              className="flex-1 rounded-xl bg-[var(--color-accent)] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-95 disabled:opacity-60"
            >
              Submit exam
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f4f8] text-slate-900">
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#1e3a5f 1px, transparent 1px), linear-gradient(90deg, #1e3a5f 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
        aria-hidden
      />

      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1400px] items-center gap-4 px-4 py-3 sm:px-6">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-900">{exam.name}</p>
            <p className="text-xs text-slate-500">{encouragement}</p>
          </div>
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold tabular-nums text-slate-800">
              Question {index + 1}{" "}
              <span className="font-normal text-slate-400">/ {questions.length}</span>
            </p>
          </div>
          <div className="w-32 sm:w-48">
            <Progress value={progressPct} className="h-1.5" />
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
        {/* Left sidebar — question nav + flags */}
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

        {/* Main question area */}
        <main className="min-w-0 flex-1 px-4 py-6 pb-28 sm:px-6 lg:pb-8">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-teal-700 lg:hidden">
            Q{index + 1} of {questions.length}
          </p>

          <article className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
            <div
              className="prose prose-slate max-w-none text-[1.0625rem] leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: highlightQuestionStem(current.question),
              }}
            />

            <div className="mt-8 space-y-3" role="radiogroup" aria-label="Answer choices">
              {current.options.map((opt, i) => (
                <ExamChoiceCard
                  key={opt}
                  letter={LETTERS[i] ?? String(i + 1)}
                  label={opt}
                  selected={currentAnswer.selected === opt}
                  eliminated={currentAnswer.eliminated.includes(opt)}
                  disabled={submitting || timeUp}
                  onSelect={() => updateAnswer({ selected: opt })}
                  onEliminate={() => {
                    const elim = currentAnswer.eliminated.includes(opt)
                      ? currentAnswer.eliminated.filter((e) => e !== opt)
                      : [...currentAnswer.eliminated, opt];
                    updateAnswer({ eliminated: elim });
                  }}
                />
              ))}
            </div>
          </article>
        </main>

        {/* Right sidebar — scratch pad */}
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
              className="h-40 w-full resize-none rounded-xl border border-slate-200 p-3 text-sm text-slate-700 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400/20"
            />
          </div>
        </aside>
      </div>

      {/* Bottom bar */}
      <footer className="fixed bottom-0 left-0 right-0 z-20 border-t border-slate-200/80 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <button
            type="button"
            disabled={index === 0}
            onClick={() => setIndex((i) => i - 1)}
            className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" /> Previous
          </button>

          <div className="flex flex-wrap items-center gap-2">
            {config.timed ? (
              <button
                type="button"
                onClick={() => (paused ? resumeExam() : setPauseDialog(true))}
                className="hidden rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 sm:inline-flex"
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
              onClick={() => updateAnswer({ flagged: !currentAnswer.flagged })}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-semibold transition",
                currentAnswer.flagged
                  ? "border-amber-300 bg-amber-50 text-amber-800"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              )}
            >
              <Flag className={cn("h-4 w-4", currentAnswer.flagged && "fill-amber-500 text-amber-500")} />
              Flag
            </button>
            <button
              type="button"
              className="hidden rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 sm:inline-flex"
              onClick={() => setNotesOpen((v) => !v)}
            >
              {notesOpen ? (
                <PanelRightClose className="h-4 w-4" />
              ) : (
                <PanelRightOpen className="h-4 w-4" />
              )}
            </button>
          </div>

          {index + 1 >= questions.length ? (
            <button
              type="button"
              disabled={submitting}
              onClick={() => {
                setHasEnteredReview(true);
                setPhase("review");
              }}
              className="inline-flex items-center gap-1 rounded-xl bg-[var(--color-accent)] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-95 disabled:opacity-60"
            >
              Review & submit
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIndex((i) => i + 1)}
              className="inline-flex items-center gap-1 rounded-xl bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Next <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </footer>

      <PauseExamDialog
        open={pauseDialog}
        onConfirm={confirmPause}
        onCancel={() => setPauseDialog(false)}
      />
      <TimeUpDialog open={timeUp && !submitting} onFinish={() => void submitExam(true)} />

      <p className="sr-only" aria-live="polite">
        {config.timed ? `Time remaining ${remainingSec} seconds` : `Elapsed ${elapsedSec} seconds`}
      </p>
    </div>
  );
}

/** Light emphasis on common clinical cue words in stems. */
function highlightQuestionStem(text: string): string {
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return escaped.replace(
    /\b(\d+-year-old|prioritiz|first|best|most likely|contraindicat|mg\/kg|mEq|BP|HR|SpO2)\w*/gi,
    "<strong class='text-slate-900'>$&</strong>"
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
    <nav
      className="rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm"
      aria-label="Question navigation"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        Questions
      </p>
      <div className="mt-2 max-h-[min(24rem,50vh)] overflow-y-auto pr-1">
        <ol className="grid grid-cols-5 gap-1.5">
          {Array.from({ length: total }, (_, i) => {
            const st = answers[i];
            const answered = Boolean(st?.selected);
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
                    "relative flex h-8 w-full items-center justify-center rounded-lg text-xs font-semibold tabular-nums transition",
                    current
                      ? "bg-[var(--color-accent)] text-white shadow-sm ring-2 ring-[var(--color-accent)]/30"
                      : answered
                        ? "bg-teal-50 text-teal-800 hover:bg-teal-100"
                        : "bg-slate-50 text-slate-600 hover:bg-slate-100"
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
