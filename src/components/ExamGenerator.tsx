"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { GeneratedExam } from "@/lib/ai";
import { FIELD_LABELS, DEFAULT_STUDY_FIELD_LABEL, getFieldMeta } from "@/lib/fields";
import { getSubjectsForField, buildScopedTopic } from "@/lib/field-subjects";
import {
  formatExamLengthLabel,
  getTimedExamQuestionCount,
} from "@/lib/exam/exam-lengths";
import { ExamQuiz } from "./ExamQuiz";
import { Button } from "./ui/Button";
import { InlineError } from "@/components/ui/StatusMessage";

export function ExamGenerator() {
  const [field, setField] = useState(DEFAULT_STUDY_FIELD_LABEL);
  const [subjectId, setSubjectId] = useState("");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [studyMode, setStudyMode] = useState<"practice" | "timed">("practice");
  const questionCount = useMemo(() => getTimedExamQuestionCount(field), [field]);
  const lengthLabel = useMemo(() => formatExamLengthLabel(field), [field]);
  const [loading, setLoading] = useState(false);
  const [exam, setExam] = useState<GeneratedExam | null>(null);
  const [examId, setExamId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [sourcesReviewed, setSourcesReviewed] = useState<number | null>(null);

  const fieldMeta = getFieldMeta(field);
  const subjects = useMemo(() => getSubjectsForField(field), [field]);
  const selectedSubject = subjects.find((s) => s.id === subjectId);

  useEffect(() => {
    const list = getSubjectsForField(field);
    if (list.length > 0) setSubjectId(list[0].id);
    else setSubjectId("");
    setTopic("");
  }, [field]);

  function resolveTopic(): string {
    if (!subjectId) return topic.trim();
    return buildScopedTopic(field, subjectId, topic);
  }

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();

    if (!subjectId) {
      setError("Please select a subject/topic for this field.");
      return;
    }

    const resolvedTopic = resolveTopic();

    setLoading(true);
    setError("");
    setExam(null);
    setExamId(null);
    setSourcesReviewed(null);
    setStatus(
      `Studying ${selectedSubject?.textbookRefs ?? "OER textbooks"} for ${selectedSubject?.label}…`
    );

    try {
      const res = await fetch("/api/exams/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          field,
          topic: resolvedTopic,
          subjectId,
          difficulty,
          questionCount,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.code === "SUBSCRIPTION_REQUIRED") {
          throw new Error(
            "Your trial has ended. Subscribe from Pricing or your Study Hub to keep generating exams."
          );
        }
        throw new Error(data.error ?? "Generation failed");
      }
      setExam(data.exam);
      setExamId(data.examId ?? null);
      setSourcesReviewed(data.sourcesReviewed ?? data.sources?.length ?? null);
      setStatus("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStatus("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form onSubmit={handleGenerate} className="apple-card mt-10 space-y-6 p-8 md:p-10">
        <div>
          <label className="apple-label">Field</label>
          <select
            value={field}
            onChange={(e) => setField(e.target.value)}
            className="apple-input mt-2"
          >
            {FIELD_LABELS.map((f) => (
              <option key={f}>{f}</option>
            ))}
          </select>
          {fieldMeta && (
            <p className="mt-2 text-xs text-[var(--color-ink-muted)]">
              <span className="font-medium text-[var(--color-accent)]">
                {fieldMeta.boardExam}
              </span>
              {" · "}
              {fieldMeta.examFocus}
            </p>
          )}
        </div>

        <div>
          <label className="apple-label">Subject / topic in {field}</label>
          <select
            required
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            className="apple-input mt-2"
          >
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
          {selectedSubject && (
            <p className="mt-2 text-xs text-[var(--color-ink-muted)]">
              {selectedSubject.contentArea && (
                <>
                  <span className="font-medium text-[var(--color-accent)]">
                    {selectedSubject.contentArea}
                  </span>
                  {" · "}
                </>
              )}
              Textbooks: {selectedSubject.textbookRefs} · Questions will be{" "}
              <strong>only</strong> about {selectedSubject.label}
            </p>
          )}
        </div>

        <div>
          <label className="apple-label">Narrow focus (optional)</label>
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder={selectedSubject?.focusPlaceholder ?? "e.g. Specific unit"}
            className="apple-input mt-2"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="apple-label">Session style</label>
            <select
              value={studyMode}
              onChange={(e) => setStudyMode(e.target.value as typeof studyMode)}
              className="apple-input mt-2"
            >
              <option value="practice">Research — explanations & confidence</option>
              <option value="timed">Timed — 45s per question</option>
            </select>
          </div>
          <div>
            <label className="apple-label">Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="apple-input mt-2"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        <p className="rounded-xl border border-black/[0.06] bg-black/[0.02] px-4 py-3 text-sm text-[var(--color-ink-muted)]">
          <span className="font-medium text-[var(--color-ink)]">Research exam length: </span>
          {lengthLabel}
        </p>

        <Button type="submit" disabled={loading || !subjectId} className="w-full">
          {loading
            ? `Generating ${questionCount} ${selectedSubject?.label ?? field} questions…`
            : `Generate ${questionCount}-question research exam`}
        </Button>

        {loading && status && (
          <p className="text-center text-xs text-[var(--color-ink-muted)]">{status}</p>
        )}

        {error && (
          <InlineError className="text-center">
            {error}. <Link href="/signup" className="underline">Sign in</Link> to generate.
          </InlineError>
        )}
      </form>

      <AnimatePresence>
        {exam && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 space-y-6"
          >
            <div className="apple-card p-8 md:p-10">
              <h2 className="text-2xl font-semibold">{exam.title}</h2>
              <p className="mt-2 text-sm text-[var(--color-ink-muted)]">{exam.studyNotes}</p>
              {sourcesReviewed != null && sourcesReviewed > 0 && (
                <p className="mt-2 text-xs text-[var(--color-accent)]">
                  {exam.questions.length} questions · {sourcesReviewed} textbook/web sources
                </p>
              )}
            </div>

            <ExamQuiz
              key={`${exam.title}-${exam.questions.length}-${studyMode}`}
              exam={exam}
              examId={examId ?? undefined}
              mode={studyMode}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
