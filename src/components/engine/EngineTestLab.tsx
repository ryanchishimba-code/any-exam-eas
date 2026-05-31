"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Beaker, CheckCircle2, Loader2, XCircle } from "lucide-react";
import type { GeneratedExam } from "@/lib/ai";
import type { GenerationQualityReport, QuestionPatternProfile } from "@/lib/rag/types";
import { FIELD_LABELS, getFieldMeta } from "@/lib/fields";
import { getSubjectsForField, buildScopedTopic } from "@/lib/field-subjects";
import { examQuestionToStudy } from "@/lib/questions/prepare";
import { Button } from "@/components/ui/Button";
import { AppleLink } from "@/components/ui/AppleLink";
import { InlineError } from "@/components/ui/StatusMessage";
import { NgnFormatBadge, VignetteBlock } from "@/components/study/questions/NgnChrome";
import { ExplanationPanel } from "@/components/study/questions/QuestionRenderer";

type TestResult = {
  mode: string;
  durationMs: number;
  subject: { id: string; label: string };
  exam: Pick<GeneratedExam, "title" | "questions" | "studyNotes">;
  qualityReport?: GenerationQualityReport;
  patternProfile?: QuestionPatternProfile;
  retrievalMeta?: { totalChunks: number; retrievedCount: number; rerankedCount: number };
  expandedQueries?: string[];
  sourceCounts?: Record<string, number>;
};

export function EngineTestLab() {
  const [field, setField] = useState(FIELD_LABELS[0] ?? "Nursing");
  const [subjectId, setSubjectId] = useState("");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [questionCount, setQuestionCount] = useState(3);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<TestResult | null>(null);
  const [activeQ, setActiveQ] = useState(0);

  const subjects = useMemo(() => getSubjectsForField(field), [field]);
  const fieldMeta = getFieldMeta(field);

  useEffect(() => {
    const list = getSubjectsForField(field);
    if (list.length > 0) setSubjectId(list[0].id);
  }, [field]);

  async function runTest() {
    if (!subjectId) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/engine/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          field: fieldMeta?.id ?? field.toLowerCase(),
          subjectId,
          topic: buildScopedTopic(field, subjectId, topic.trim() || undefined),
          difficulty,
          questionCount,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Test failed");
      setResult(data as TestResult);
      setActiveQ(0);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Test failed");
    } finally {
      setLoading(false);
    }
  }

  const report = result?.qualityReport;
  const questions = result?.exam.questions ?? [];
  const studyQ = questions[activeQ]
    ? examQuestionToStudy({ ...questions[activeQ], field: result?.exam.title }, activeQ)
    : null;

  return (
    <div className="mt-10 space-y-10">
      <section className="apple-bento">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-accent)]/10">
            <Beaker className="h-5 w-5 text-[var(--color-accent)]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Engine validation</h2>
            <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
              Generate sample questions with full RAG + Self-RAG QC. Nothing is saved to your account.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="apple-label">Discipline</span>
            <select
              className="apple-select mt-1.5"
              value={field}
              onChange={(e) => setField(e.target.value)}
            >
              {FIELD_LABELS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="apple-label">Subject</span>
            <select
              className="apple-select mt-1.5"
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm sm:col-span-2">
            <span className="apple-label">Topic focus (optional)</span>
            <input
              className="apple-input mt-1.5"
              placeholder="e.g. infection control, pharmacology calculations"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </label>
          <label className="block text-sm">
            <span className="apple-label">Difficulty</span>
            <select
              className="apple-select mt-1.5"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as typeof difficulty)}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </label>
          <label className="block text-sm">
            <span className="apple-label">Sample size</span>
            <select
              className="apple-select mt-1.5"
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
            >
              {[1, 2, 3, 5, 8, 10].map((n) => (
                <option key={n} value={n}>
                  {n} questions
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Button type="button" onClick={() => void runTest()} disabled={loading || !subjectId}>
            {loading ? (
              <>
                <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
                Running engine…
              </>
            ) : (
              "Run validation"
            )}
          </Button>
          <AppleLink href="/generate">Production generator</AppleLink>
        </div>

        {error && <InlineError className="mt-4">{error}</InlineError>}
      </section>

      {result && report && (
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          <MetricCard
            label="QC status"
            value={report.passed ? "Passed" : "Review"}
            icon={report.passed ? CheckCircle2 : XCircle}
            tone={report.passed ? "ok" : "warn"}
          />
          <MetricCard
            label="Avg quality"
            value={`${(report.averageScore * 100).toFixed(0)}%`}
          />
          <MetricCard label="Chunks used" value={String(report.chunksUsed)} />
          <MetricCard
            label="Duration"
            value={`${(result.durationMs / 1000).toFixed(1)}s`}
          />
        </motion.section>
      )}

      {result?.retrievalMeta && (
        <p className="text-xs text-[var(--color-ink-muted)]">
          RAG: {result.retrievalMeta.totalChunks} chunks indexed ·{" "}
          {result.retrievalMeta.rerankedCount} reranked · Pattern sample:{" "}
          {result.patternProfile?.sampleSize ?? 0} bank items
        </p>
      )}

      {questions.length > 0 && studyQ && (
        <section className="grid gap-6 lg:grid-cols-[220px_1fr]">
          <div className="space-y-1">
            {questions.map((q, i) => {
              const pq = report?.perQuestion.find((p) => p.id === q.id);
              const score = pq?.score ?? q.qualityScore;
              return (
                <button
                  key={q.id ?? i}
                  type="button"
                  onClick={() => setActiveQ(i)}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition ${
                    activeQ === i
                      ? "bg-[var(--color-ink)] text-white"
                      : "hover:bg-black/[0.04]"
                  }`}
                >
                  <span>Q{i + 1}</span>
                  {score != null && (
                    <span className="text-xs tabular-nums opacity-80">
                      {(score * 100).toFixed(0)}%
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.article
              key={activeQ}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              className="apple-bento"
            >
              <div className="flex flex-wrap items-center gap-2">
                <NgnFormatBadge question={studyQ} />
                {report?.perQuestion[activeQ]?.regenerated && (
                  <span className="text-[10px] uppercase tracking-wide text-amber-600">
                    Regenerated
                  </span>
                )}
              </div>

              {studyQ.vignette && <VignetteBlock text={studyQ.vignette} />}
              <p className="mt-4 text-base font-medium leading-relaxed">{studyQ.stem}</p>

              <ul className="mt-4 space-y-1.5">
                {studyQ.options.map((opt, j) => {
                  const correct = studyQ.correctAnswers.some(
                    (c) => c.toLowerCase() === opt.toLowerCase()
                  );
                  return (
                    <li
                      key={j}
                      className={`rounded-lg px-3 py-2 text-sm ${
                        correct
                          ? "a11y-correct font-medium"
                          : "text-[var(--color-ink-muted)]"
                      }`}
                    >
                      {opt}
                      {correct && " — Correct answer"}
                    </li>
                  );
                })}
              </ul>

              <ExplanationPanel question={studyQ} />

              {report?.perQuestion[activeQ] && (
                <div className="mt-6 rounded-xl border border-black/[0.06] p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
                    Self-RAG reflection
                  </p>
                  <ul className="mt-2 space-y-1 text-sm text-[var(--color-ink-muted)]">
                    {report.perQuestion[activeQ].reflection.issues.map((issue) => (
                      <li key={issue}>· {issue}</li>
                    ))}
                    {report.perQuestion[activeQ].reflection.issues.length === 0 && (
                      <li>No issues flagged.</li>
                    )}
                  </ul>
                </div>
              )}
            </motion.article>
          </AnimatePresence>
        </section>
      )}
    </div>
  );
}

function MetricCard({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  icon?: typeof CheckCircle2;
  tone?: "ok" | "warn";
}) {
  return (
    <div className="apple-tile p-5 text-center">
      {Icon && (
        <Icon
          className={`mx-auto h-5 w-5 ${
            tone === "ok"
              ? "text-blue-700"
              : tone === "warn"
                ? "text-amber-600"
                : "text-[var(--color-accent)]"
          }`}
        />
      )}
      <p className="mt-2 text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
      <p className="mt-1 text-xs text-[var(--color-ink-muted)]">{label}</p>
    </div>
  );
}
