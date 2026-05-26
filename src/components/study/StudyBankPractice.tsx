"use client";

import { useEffect, useMemo, useState } from "react";
import { FIELD_LABELS, getFieldMeta } from "@/lib/fields";
import { getSubjectsForField } from "@/lib/field-subjects";
import { StudySessionPlayer } from "./StudySessionPlayer";
import type { RawQuestionInput } from "@/lib/questions/types";
import type { ExamQuestion } from "@/lib/ai";
import { Button } from "@/components/ui/Button";

export function StudyBankPractice() {
  const [field, setField] = useState("Medicine");
  const [subjectId, setSubjectId] = useState("");
  const [mode, setMode] = useState<"practice" | "rapid" | "timed">("practice");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [questions, setQuestions] = useState<RawQuestionInput[] | null>(null);

  const subjects = useMemo(() => getSubjectsForField(field), [field]);

  useEffect(() => {
    const list = getSubjectsForField(field);
    if (list.length) setSubjectId(list[0].id);
  }, [field]);

  async function start() {
    if (!subjectId) return;
    setLoading(true);
    setError("");
    setQuestions(null);
    try {
      const meta = getFieldMeta(field);
      const fieldId = meta?.id ?? field.toLowerCase();
      const res = await fetch(
        `/api/questions?field=${encodeURIComponent(field)}&subjectId=${encodeURIComponent(subjectId)}&limit=25`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not load questions");
      const metaIds = (data.bankItemIds as string[] | undefined) ?? [];
      const raw = (data.questions as ExamQuestion[]).map((q, i) => ({
        ...q,
        id: i + 1,
        field,
        subjectId,
        bankItemId: metaIds[i] ?? `bank-${fieldId}-${subjectId}-${i}`,
      }));
      if (raw.length === 0) throw new Error("No questions in bank for this subject yet.");
      setQuestions(raw);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  if (questions) {
    return (
      <StudySessionPlayer
        field={field}
        subjectId={subjectId}
        questions={questions}
        sourceType="bank"
        mode={mode}
        title={`${field} · Quick review`}
      />
    );
  }

  return (
    <div className="apple-card mt-8 space-y-6 p-8">
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
      <div>
        <label className="apple-label">Mode</label>
        <select
          className="apple-input mt-2 w-full"
          value={mode}
          onChange={(e) => setMode(e.target.value as typeof mode)}
        >
          <option value="practice">Practice (confidence + explanations)</option>
          <option value="rapid">Rapid review</option>
          <option value="timed">Timed challenge</option>
        </select>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="button" disabled={loading || !subjectId} className="w-full" onClick={() => void start()}>
        {loading ? "Loading…" : "Start review"}
      </Button>
    </div>
  );
}
