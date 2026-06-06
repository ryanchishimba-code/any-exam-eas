"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Flag,
  Maximize2,
  Minimize2,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { InlineError } from "@/components/ui/StatusMessage";
import { MpjeStateSelect } from "@/components/study/MpjeStateSelect";
import {
  MPJE_PRACTICE_EXAM_PASSING_PERCENT,
  MPJE_TIMER_WARN_MINUTES,
  type MpjePracticeExamQuestionPublic,
} from "@/lib/mpje/practice-exam-config";
import type { MpjePracticeExamResult } from "@/lib/mpje/practice-exam-scoring";
import { parseOptionalMpjeStateParam } from "@/lib/mpje/validators";
import { mpjePracticeExamHref, mpjePracticeHref } from "@/lib/study-hub/config";
import {
  parseMpjeStoredAnswer,
  serializeMpjeAnswer,
} from "@/lib/mpje/grade-answer";
import { MpjeQuestionDisplay } from "@/components/mpje/MpjeQuestionDisplay";
import { cn } from "@/lib/utils";

type ExamPayload = {
  examId: string;
  stateCode: string;
  stateName: string;
  title: string;
  questionCount: number;
  timeLimitSeconds: number;
  passingPercent: number;
  questions: MpjePracticeExamQuestionPublic[];
};

type Phase = "loading" | "intro" | "exam" | "review" | "submitting" | "results";

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function MpjePracticeExam() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [stateCode, setStateCode] = useState("");
  const [phase, setPhase] = useState<Phase>("loading");
  const [exam, setExam] = useState<ExamPayload | null>(null);
  const [error, setError] = useState("");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [showTimer, setShowTimer] = useState(true);
  const [timerWarnings, setTimerWarnings] = useState<Set<number>>(new Set());
  const [activeWarning, setActiveWarning] = useState<number | null>(null);
  const [result, setResult] = useState<MpjePracticeExamResult | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [showMissed, setShowMissed] = useState(false);
  const startedAt = useRef<number | null>(null);
  const autoSubmitted = useRef(false);

  useEffect(() => {
    const param = parseOptionalMpjeStateParam(
      searchParams.get("state"),
      searchParams.get("mpjeState")
    );
    setStateCode(param ?? "");
  }, [searchParams]);

  const loadExam = useCallback(async (code: string) => {
    setPhase("loading");
    setError("");
    setExam(null);
    setResult(null);
    setIndex(0);
    setAnswers({});
    setFlagged(new Set());
    setTimerWarnings(new Set());
    setActiveWarning(null);
    autoSubmitted.current = false;

    try {
      const qs = code ? `?state=${encodeURIComponent(code)}` : "";
      const res = await fetch(`/api/mpje/practice-exam${qs}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not load practice exam");
      setExam(data);
      setSecondsLeft(data.timeLimitSeconds);
      setPhase("intro");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load exam");
      setPhase("intro");
    }
  }, []);

  useEffect(() => {
    void loadExam(stateCode);
  }, [stateCode, loadExam]);

  const questions = useMemo(
    () => exam?.questions ?? [],
    [exam?.questions]
  );
  const total = questions.length;
  const current = questions[index];

  const unansweredIndices = useMemo(() => {
    return questions
      .map((q, i) => (!answers[q.id]?.trim() ? i : -1))
      .filter((i) => i >= 0);
  }, [questions, answers]);

  const submitExam = useCallback(
    async (endedEarly = false) => {
      if (!exam || phase === "submitting" || phase === "results") return;
      setPhase("submitting");
      const timeSpentSec = startedAt.current
        ? Math.round((Date.now() - startedAt.current) / 1000)
        : exam.timeLimitSeconds - secondsLeft;

      try {
        const res = await fetch("/api/mpje/practice-exam", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            examId: exam.examId,
            answers: questions.map((q) => ({
              questionId: q.id,
              selected: answers[q.id] ?? null,
            })),
            timeSpentSec,
            endedEarly,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Could not grade exam");
        setResult(data);
        setPhase("results");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Submission failed");
        setPhase("review");
      }
    },
    [exam, phase, secondsLeft, questions, answers]
  );

  useEffect(() => {
    if (phase !== "exam") return;
    const tick = setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(tick);
  }, [phase]);

  useEffect(() => {
    if (phase !== "exam" || secondsLeft > 0) return;
    if (!autoSubmitted.current) {
      autoSubmitted.current = true;
      void submitExam(true);
    }
  }, [phase, secondsLeft, submitExam]);

  useEffect(() => {
    if (phase !== "exam") return;
    const minsLeft = Math.ceil(secondsLeft / 60);
    for (const warn of MPJE_TIMER_WARN_MINUTES) {
      if (minsLeft === warn && !timerWarnings.has(warn)) {
        setTimerWarnings((prev) => new Set(prev).add(warn));
        setActiveWarning(warn);
        const t = setTimeout(() => setActiveWarning(null), 8000);
        return () => clearTimeout(t);
      }
    }
  }, [phase, secondsLeft, timerWarnings]);

  useEffect(() => {
    if (phase !== "exam" && phase !== "review") return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [phase]);

  function syncState(code: string) {
    setStateCode(code);
    router.replace(mpjePracticeExamHref(code), { scroll: false });
  }

  function startExam() {
    startedAt.current = Date.now();
    setPhase("exam");
  }

  function toggleFlag() {
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  function selectAnswer(choice: string) {
    if (!current) return;
    setAnswers((prev) => ({ ...prev, [current.id]: choice }));
  }

  function toggleSelectAll(choice: string) {
    if (!current) return;
    const stored = answers[current.id] ?? "";
    const parts = parseMpjeStoredAnswer(current.itemType, stored);
    const list = Array.isArray(parts) ? [...parts] : [];
    const idx = list.indexOf(choice);
    if (idx >= 0) list.splice(idx, 1);
    else list.push(choice);
    const serialized = serializeMpjeAnswer(current.itemType, list);
    setAnswers((prev) => ({
      ...prev,
      [current.id]: serialized ?? "",
    }));
  }

  function goNext() {
    if (index + 1 >= total) {
      setPhase("review");
      return;
    }
    setIndex((i) => i + 1);
  }

  function goPrev() {
    setIndex((i) => Math.max(0, i - 1));
  }

  async function toggleFullscreen() {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setFullscreen(true);
      } else {
        await document.exitFullscreen();
        setFullscreen(false);
      }
    } catch {
      setFullscreen((f) => !f);
    }
  }

  useEffect(() => {
    const onFs = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  if (phase === "loading") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-slate-500">
        Building your {stateCode ? `${stateCode} ` : "federal "}MPJE practice exam…
      </div>
    );
  }

  if (phase === "intro") {
    return (
      <div className="mx-auto max-w-2xl space-y-6 px-4 py-10">
        <Link
          href={mpjePracticeHref({ mode: "timed", variant: "state", stateCode })}
          className="text-sm font-medium text-slate-500 hover:text-slate-800"
        >
          ← Back to MPJE practice
        </Link>

        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-wide text-amber-700">
            Full-length simulator
          </p>
          <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
            {exam?.title ??
              (stateCode ? `${stateCode} MPJE Practice Exam` : "Federal MPJE Practice Exam")}
          </h1>
          <p className="text-slate-600">
            Mimics the real MPJE: 120 questions in 2.5 hours.{" "}
            {stateCode
              ? "State-specific and federal pharmacy law."
              : "Federal pharmacy law only until you select a state."}
          </p>
        </div>

        <MpjeStateSelect
          value={stateCode}
          onChange={syncState}
          disabled={phase !== "intro"}
        />

        {error && <InlineError>{error}</InlineError>}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900">Before you begin</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>• {exam?.questionCount ?? 120} questions — all counted for your practice score</li>
            <li>• {Math.floor((exam?.timeLimitSeconds ?? 9000) / 60)} minutes total (countdown timer)</li>
            <li>• Passing practice threshold: {exam?.passingPercent ?? MPJE_PRACTICE_EXAM_PASSING_PERCENT}%</li>
            <li>• One question at a time — flag items to review before submitting</li>
            <li>• Timer warnings at 30, 10, and 5 minutes remaining</li>
            <li>• Exam auto-submits when time expires</li>
          </ul>
          <p className="mt-4 text-xs text-slate-500">
            Real MPJE includes 100 scored + 20 unscored pretest items. This simulator scores
            all 120 for practice feedback.
          </p>
        </div>

        <Button
          type="button"
          className="w-full"
          disabled={!exam}
          onClick={startExam}
        >
          Begin practice exam
        </Button>
      </div>
    );
  }

  if (phase === "submitting") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-slate-300">Grading your exam…</p>
      </div>
    );
  }

  if (phase === "results" && result && exam) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-3xl space-y-8">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
              {exam.title} — Results
            </p>
            <h1
              className={cn(
                "mt-2 text-4xl font-bold tabular-nums",
                result.passed ? "text-emerald-600" : "text-red-600"
              )}
            >
              {result.scorePercent}%
            </h1>
            <p className="mt-2 text-lg font-semibold text-slate-800">
              {result.passed ? "Pass" : "Fail"} — need {result.passingPercent}% to pass
            </p>
            <p className="mt-1 text-sm text-slate-600">
              {result.correct} correct · {result.incorrect} incorrect ·{" "}
              {result.unanswered} unanswered
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-slate-900">Topic breakdown</h2>
            <ul className="mt-4 space-y-3">
              {result.topicBreakdown.map((t) => (
                <li key={t.subjectId}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-800">{t.subjectLabel}</span>
                    <span className="tabular-nums text-slate-600">
                      {t.correct}/{t.total} ({t.percent}%)
                    </span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        t.percent >= result.passingPercent
                          ? "bg-emerald-500"
                          : "bg-amber-500"
                      )}
                      style={{ width: `${t.percent}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {result.missed.length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <button
                type="button"
                className="flex w-full items-center justify-between text-left"
                onClick={() => setShowMissed((v) => !v)}
              >
                <h2 className="font-semibold text-slate-900">
                  Review missed questions ({result.missed.length})
                </h2>
                <span className="text-sm text-slate-500">{showMissed ? "Hide" : "Show"}</span>
              </button>
              {showMissed && (
                <ul className="mt-4 space-y-6">
                  {result.missed.map((m) => (
                    <li
                      key={m.questionId}
                      className="rounded-xl border border-slate-100 bg-slate-50/80 p-4"
                    >
                      <p className="text-xs font-medium text-slate-500">
                        Q{m.index + 1} · {m.subjectLabel}
                      </p>
                      <p className="mt-2 whitespace-pre-wrap text-sm text-slate-800">
                        {m.question}
                      </p>
                      <p className="mt-2 text-sm text-red-600">
                        Your answer: {m.selected ?? "(unanswered)"}
                      </p>
                      <p className="text-sm font-medium text-emerald-700">
                        Correct: {m.correctAnswer}
                      </p>
                      <p className="mt-2 text-sm text-slate-600">{m.explanation}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              type="button"
              className="flex-1"
              onClick={() => void loadExam(stateCode)}
            >
              Retake exam
            </Button>
            <Button
              href={mpjePracticeHref({
                mode: "bank",
                variant: "state",
                stateCode,
              })}
              variant="secondary"
              className="flex-1"
            >
              Practice weak topics
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "review") {
    const flaggedList = [...flagged].sort((a, b) => a - b);
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <header className="border-b border-white/10 px-4 py-4">
          <h1 className="text-lg font-semibold">Review before submit</h1>
          <p className="text-sm text-slate-400">{exam?.title}</p>
        </header>
        <main className="mx-auto max-w-3xl space-y-8 px-4 py-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
              <p className="font-medium text-amber-200">
                Flagged for review ({flaggedList.length})
              </p>
              {flaggedList.length === 0 ? (
                <p className="mt-2 text-sm text-slate-400">None flagged</p>
              ) : (
                <div className="mt-3 flex flex-wrap gap-2">
                  {flaggedList.map((i) => (
                    <button
                      key={i}
                      type="button"
                      className="rounded-lg bg-white/10 px-3 py-1 text-sm hover:bg-white/20"
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
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
              <p className="font-medium text-red-200">
                Unanswered ({unansweredIndices.length})
              </p>
              {unansweredIndices.length === 0 ? (
                <p className="mt-2 text-sm text-slate-400">All questions answered</p>
              ) : (
                <div className="mt-3 flex flex-wrap gap-2">
                  {unansweredIndices.map((i) => (
                    <button
                      key={i}
                      type="button"
                      className="rounded-lg bg-white/10 px-3 py-1 text-sm hover:bg-white/20"
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

          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-slate-300">Question overview</p>
            <div className="mt-3 grid grid-cols-6 gap-2 sm:grid-cols-10">
              {questions.map((q, i) => {
                const answered = Boolean(answers[q.id]?.trim());
                return (
                  <button
                    key={q.id}
                    type="button"
                    title={`Question ${i + 1}`}
                    onClick={() => {
                      setIndex(i);
                      setPhase("exam");
                    }}
                    className={cn(
                      "rounded-lg px-2 py-2 text-xs font-medium tabular-nums transition",
                      flagged.has(i) && "ring-1 ring-amber-400",
                      answered
                        ? "bg-emerald-500/20 text-emerald-200"
                        : "bg-red-500/20 text-red-200"
                    )}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {error && <InlineError>{error}</InlineError>}

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              type="button"
              variant="secondary"
              className="flex-1 !text-slate-900"
              onClick={() => setPhase("exam")}
            >
              Return to exam
            </Button>
            <Button type="button" className="flex-1" onClick={() => void submitExam(false)}>
              Submit exam
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const progress = total ? ((index + 1) / total) * 100 : 0;
  const selectedRaw = current ? answers[current.id] : undefined;
  const selectedParsed = current
    ? parseMpjeStoredAnswer(current.itemType, selectedRaw ?? null)
    : "";

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {activeWarning !== null && (
        <div className="flex items-center justify-center gap-2 bg-amber-600 px-4 py-2 text-sm font-medium text-white">
          <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden />
          {activeWarning} minutes remaining
        </div>
      )}

      <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/95 backdrop-blur">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-200">{exam?.title}</p>
            <p className="text-xs text-slate-500">MPJE Practice Exam Simulator</p>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            {showTimer ? (
              <span
                className={cn(
                  "flex items-center gap-1.5 font-mono text-sm tabular-nums",
                  secondsLeft <= 300 ? "text-red-400" : "text-slate-300"
                )}
              >
                <Clock className="h-4 w-4 shrink-0" aria-hidden />
                {formatTime(secondsLeft)}
              </span>
            ) : (
              <span className="text-xs text-slate-500">Timer hidden</span>
            )}
            <button
              type="button"
              className="rounded-lg p-2 hover:bg-white/10"
              onClick={() => setShowTimer((v) => !v)}
              aria-label={showTimer ? "Hide timer" : "Show timer"}
            >
              {showTimer ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
            <button
              type="button"
              className="rounded-lg p-2 hover:bg-white/10"
              onClick={() => void toggleFullscreen()}
              aria-label={fullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {fullscreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
        <div className="px-4 pb-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>
              Question {index + 1} of {total}
            </span>
            {current?.isPretest && (
              <span className="text-slate-500">Pretest item (practice scored)</span>
            )}
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-sky-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8">
        {current && (
          <>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              {current.subjectLabel}
              {current.stateCode ? ` · ${current.stateCode}` : " · Federal"}
            </p>
            <MpjeQuestionDisplay
              variant="exam"
              question={{
                question: current.question,
                options: current.options,
                itemType: current.itemType,
                scenario: current.scenario,
                statements: current.statements,
              }}
              selected={selectedParsed}
              onSelect={selectAnswer}
              onToggleMulti={toggleSelectAll}
            />
          </>
        )}
      </main>

      <footer className="sticky bottom-0 border-t border-white/10 bg-slate-950/95 px-4 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-3">
          <button
            type="button"
            disabled={index === 0}
            onClick={goPrev}
            className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10 disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>

          <button
            type="button"
            onClick={toggleFlag}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-white/10",
              flagged.has(index) ? "text-amber-400" : "text-slate-400"
            )}
          >
            <Flag
              className={cn("h-4 w-4", flagged.has(index) && "fill-amber-400")}
              aria-hidden
            />
            {flagged.has(index) ? "Flagged" : "Flag"}
          </button>

          <button
            type="button"
            onClick={goNext}
            className="inline-flex items-center gap-1 rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-500"
          >
            {index + 1 >= total ? "Review & submit" : "Next"}
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </footer>
    </div>
  );
}
