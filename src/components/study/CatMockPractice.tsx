"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FIELD_LABELS } from "@/lib/fields";
import { getSubjectsForField } from "@/lib/field-subjects";
import {
  CAT_MAX_QUESTIONS,
  CAT_MIN_QUESTIONS,
  catPracticeBand,
  difficultyForQuestion,
  initCatSession,
  targetDifficulty,
  updateCatSession,
  type CatSessionState,
} from "@/lib/questions/cat-engine";
import { examQuestionToStudy, isAnswerCorrect } from "@/lib/questions/prepare";
import type { ExamQuestion } from "@/lib/ai";
import type { StudyQuestion } from "@/lib/questions/types";
import { PROGRESS_METRICS_DISCLAIMER, PRACTICE_PROGRESS_LABEL } from "@/lib/site";
import { AnswerFeedbackLabel } from "@/components/ui/StatusMessage";
import { Button } from "@/components/ui/Button";
import { InlineError } from "@/components/ui/StatusMessage";
import {
  ExplanationPanel,
  QuestionRenderer,
} from "./questions/QuestionRenderer";
import { InsightPanel } from "./InsightPanel";
import type { LearningInsight, RemediationRecommendation } from "@/lib/learning/types";
import type { ConfidenceLevel } from "@/lib/questions/types";

type PoolItem = StudyQuestion & { difficultyBand: "easy" | "medium" | "hard" };

export function CatMockPractice() {
  const [field, setField] = useState("Nursing");
  const [subjectId, setSubjectId] = useState("");
  const [pool, setPool] = useState<PoolItem[]>([]);
  const [catState, setCatState] = useState<CatSessionState>(() => initCatSession());
  const [current, setCurrent] = useState<PoolItem | null>(null);
  const [usedIds, setUsedIds] = useState<Set<string>>(() => new Set());
  const [selected, setSelected] = useState<string[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [wasCorrect, setWasCorrect] = useState<boolean | null>(null);
  const [showConfidence, setShowConfidence] = useState(false);
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [error, setError] = useState("");
  const [insight, setInsight] = useState<LearningInsight | null>(null);
  const [remediation, setRemediation] = useState<RemediationRecommendation[]>([]);
  const startedAt = useRef(Date.now());

  const subjects = useMemo(() => getSubjectsForField(field), [field]);

  useEffect(() => {
    const list = getSubjectsForField(field);
    if (list.length) setSubjectId(list[0].id);
  }, [field]);

  const pickNext = useCallback(
    (state: CatSessionState, exclude: Set<string>): PoolItem | null => {
      const want = targetDifficulty(state);
      const available = pool.filter((q) => !exclude.has(q.id));
      if (available.length === 0) return null;

      const bandMatch = available.filter((q) => q.difficultyBand === want);
      const pickFrom = bandMatch.length > 0 ? bandMatch : available;
      return pickFrom[Math.floor(Math.random() * pickFrom.length)] ?? null;
    },
    [pool]
  );

  async function loadPool() {
    if (!subjectId) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `/api/questions?field=${encodeURIComponent(field)}&subjectId=${encodeURIComponent(subjectId)}&limit=100`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not load questions");

      const items = (data.questions as ExamQuestion[]).map((q, i) => {
        const prepared = examQuestionToStudy(
          {
            ...q,
            id: i + 1,
            field,
            subjectId,
            bankItemId: (data.bankItemIds as string[] | undefined)?.[i],
          },
          i
        );
        return {
          ...prepared,
          difficultyBand: difficultyForQuestion(i),
        };
      });

      if (items.length < 20) {
        throw new Error("Need at least 20 questions in bank to start a CAT mock.");
      }
      setPool(items);
      setStarted(true);
      setCatState(initCatSession());
      setUsedIds(new Set());
      const first = items[Math.floor(Math.random() * items.length)] ?? null;
      setCurrent(first);
      if (first) setUsedIds(new Set([first.id]));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  function toggleSelect(option: string) {
    if (revealed || !current) return;
    if (option === "__clear__") {
      setSelected([]);
      return;
    }
    if (current.type === "select_all" || current.type === "highlight") {
      setSelected((prev) =>
        prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
      );
      return;
    }
    if (current.type === "ordered_response") {
      setSelected((prev) => (prev.includes(option) ? prev : [...prev, option]));
      return;
    }
    setSelected([option]);
  }

  async function submitAttempt(confidence?: ConfidenceLevel) {
    if (!current) return;
    const durationMs = Date.now() - startedAt.current;
    const correct = isAnswerCorrect(current, selected);
    void fetch("/api/study/attempt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: current,
        correct,
        confidence,
        durationMs,
        selectedAnswer: selected.join(", "),
      }),
    }).then(async (res) => {
      if (res.ok) {
        const data = (await res.json()) as {
          insight?: LearningInsight;
          remediation?: RemediationRecommendation[];
        };
        if (data.insight) setInsight(data.insight);
        if (data.remediation) setRemediation(data.remediation);
      }
    });
  }

  function checkAnswer() {
    if (!current) return;
    const correct = isAnswerCorrect(current, selected);
    setRevealed(true);
    setWasCorrect(correct);
    setShowConfidence(true);
  }

  function advanceAfterConfidence(level: ConfidenceLevel) {
    if (!current) return;
    void submitAttempt(level);
    const nextCat = updateCatSession(catState, wasCorrect === true, current.difficultyBand);
    setCatState(nextCat);

    if (nextCat.isComplete) {
      setCurrent(null);
      return;
    }

    const exclude = new Set(usedIds);
    exclude.add(current.id);
    const next = pickNext(nextCat, exclude);
    if (!next) {
      setCatState({ ...nextCat, isComplete: true, stopReason: "maximum" });
      setCurrent(null);
      return;
    }

    setUsedIds(new Set([...exclude, next.id]));
    setCurrent(next);
    setSelected([]);
    setRevealed(false);
    setWasCorrect(null);
    setShowConfidence(false);
    setInsight(null);
    setRemediation([]);
    startedAt.current = Date.now();
  }

  useEffect(() => {
    startedAt.current = Date.now();
  }, [current?.id]);

  if (catState.isComplete || (started && !current && pool.length > 0)) {
    const band = catPracticeBand(catState);
    const accuracy =
      catState.questionNumber > 0
        ? Math.round((catState.correctCount / catState.questionNumber) * 100)
        : 0;

    return (
      <div className="mt-8 space-y-6">
        <div className="apple-card p-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-accent)]">
            NCLEX-style adaptive mock complete
          </p>
          <h2 className="mt-2 text-2xl font-bold text-[var(--color-ink)]">{band.label}</h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-[var(--color-ink-muted)]">
            {band.hint}
          </p>
          <dl className="mx-auto mt-8 grid max-w-sm grid-cols-2 gap-4 text-left">
            <div className="rounded-xl bg-black/[0.03] px-4 py-3 dark:bg-white/5">
              <dt className="text-xs text-[var(--color-ink-muted)]">Questions</dt>
              <dd className="text-lg font-bold tabular-nums">{catState.questionNumber}</dd>
            </div>
            <div className="rounded-xl bg-black/[0.03] px-4 py-3 dark:bg-white/5">
              <dt className="text-xs text-[var(--color-ink-muted)]">Accuracy</dt>
              <dd className="text-lg font-bold tabular-nums">{accuracy}%</dd>
            </div>
            <div className="rounded-xl bg-black/[0.03] px-4 py-3 dark:bg-white/5">
              <dt className="text-xs text-[var(--color-ink-muted)]">{PRACTICE_PROGRESS_LABEL}</dt>
              <dd className="text-lg font-bold tabular-nums">
                {Math.round((catState.ability + 1) * 50)}%
              </dd>
            </div>
            <div className="rounded-xl bg-black/[0.03] px-4 py-3 dark:bg-white/5">
              <dt className="text-xs text-[var(--color-ink-muted)]">Stop reason</dt>
              <dd className="text-sm font-semibold capitalize">
                {catState.stopReason ?? "complete"}
              </dd>
            </div>
          </dl>
          <p className="mx-auto mt-6 max-w-lg text-[0.6875rem] leading-relaxed text-[var(--color-ink-muted)]">
            {PROGRESS_METRICS_DISCLAIMER} This mock uses rule-based difficulty — not the official
            Pearson VUE CAT algorithm.
          </p>
          <Button type="button" className="mt-8" onClick={() => void loadPool()}>
            Run another mock
          </Button>
        </div>
      </div>
    );
  }

  if (current && started) {
    const progressMin = Math.min(catState.questionNumber + 1, CAT_MIN_QUESTIONS);
    const progressPct = (progressMin / CAT_MAX_QUESTIONS) * 100;

    return (
      <div className="mt-8 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium">NCLEX-style adaptive mock</p>
            <p className="text-xs text-[var(--color-ink-muted)]">
              Question {catState.questionNumber + 1} · {CAT_MIN_QUESTIONS}–{CAT_MAX_QUESTIONS}{" "}
              item range · difficulty adapts to your answers
            </p>
          </div>
          <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-medium text-teal-900 dark:bg-teal-950 dark:text-teal-200">
            Target: {targetDifficulty(catState)}
          </span>
        </div>

        <div className="h-1.5 overflow-hidden rounded-full bg-black/[0.06]">
          <motion.div
            className="h-full bg-[var(--color-accent)]"
            animate={{ width: `${Math.min(progressPct, 100)}%` }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.article
            key={current.id}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            className="rounded-2xl border border-black/[0.08] bg-white p-6 shadow-sm sm:p-8"
          >
            <QuestionRenderer
              question={current}
              selected={selected}
              revealed={revealed}
              onToggle={toggleSelect}
            />

            {!revealed && (
              <button
                type="button"
                disabled={selected.length === 0}
                onClick={checkAnswer}
                className="mt-8 rounded-full bg-[var(--color-accent)] px-10 py-3 text-sm font-medium text-white disabled:opacity-40"
              >
                Check
              </button>
            )}

            {revealed && (
              <div className="space-y-4">
                <AnswerFeedbackLabel correct={wasCorrect === true} />
                <ExplanationPanel question={current} />
                {insight && (
                  <InsightPanel
                    insight={insight}
                    remediation={remediation}
                    correct={wasCorrect === true}
                  />
                )}
                {showConfidence && (
                  <div className="border-t border-black/[0.06] pt-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
                      How confident were you?
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {([1, 2, 3, 4, 5] as ConfidenceLevel[]).map((n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => advanceAfterConfidence(n)}
                          className="rounded-full border border-black/[0.08] px-4 py-2 text-sm font-medium hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.article>
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-6">
      <div className="apple-card space-y-6 p-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-accent)]">
            NCLEX-style adaptive mock
          </p>
          <h2 className="mt-2 text-xl font-bold text-[var(--color-ink)]">
            Practice like test day — without the pass/fail guesswork
          </h2>
          <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
            Question count adapts between {CAT_MIN_QUESTIONS} and {CAT_MAX_QUESTIONS} based on
            your performance. Difficulty ramps up or down after each item. For self-assessment
            only — not the official Pearson VUE algorithm.
          </p>
        </div>

        <div>
          <label className="apple-label">Field</label>
          <select
            className="apple-input mt-2 w-full"
            value={field}
            onChange={(e) => setField(e.target.value)}
          >
            {FIELD_LABELS.map((f) => (
              <option key={f}>{f}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="apple-label">Subject</label>
          <select
            className="apple-input mt-2 w-full"
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
          >
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        {error && <InlineError>{error}</InlineError>}
        <Button
          type="button"
          disabled={loading || !subjectId}
          className="w-full"
          onClick={() => void loadPool()}
        >
          {loading ? "Loading question pool…" : "Start adaptive mock"}
        </Button>
      </div>
    </div>
  );
}
