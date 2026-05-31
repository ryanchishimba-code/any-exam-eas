"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { FIELD_LABELS, getFieldMeta } from "@/lib/fields";
import { getSubjectsForField } from "@/lib/field-subjects";
import { EXAM_MODES } from "@/lib/exam/modes";
import { StudySessionPlayer } from "./StudySessionPlayer";
import type { RawQuestionInput, StudyMode } from "@/lib/questions/types";
import type { ExamQuestion } from "@/lib/ai";
import { Button } from "@/components/ui/Button";
import { InlineError } from "@/components/ui/StatusMessage";

function resolveModeFromParam(param: string | null): {
  studyMode: StudyMode;
  apiMode: string | null;
  label: string;
} {
  const map: Record<string, { studyMode: StudyMode; apiMode: string | null; label: string }> = {
    timed: { studyMode: "timed", apiMode: null, label: "Timed challenge" },
    rapid: { studyMode: "rapid", apiMode: null, label: "Rapid review" },
    adaptive: { studyMode: "adaptive", apiMode: "adaptive", label: "Adaptive exam" },
    weak: { studyMode: "weak_area", apiMode: "weak", label: "Weak-area drill" },
    weak_area: { studyMode: "weak_area", apiMode: "weak", label: "Weak-area drill" },
    tutor: { studyMode: "practice", apiMode: null, label: "Tutor mode" },
    practice: { studyMode: "practice", apiMode: null, label: "Practice" },
  };
  return map[param ?? "practice"] ?? map.practice;
}

export function StudyBankPractice() {
  const searchParams = useSearchParams();
  const modeParam = searchParams.get("mode");
  const fieldParam = searchParams.get("field");

  const { studyMode, apiMode, label } = resolveModeFromParam(modeParam);

  const [field, setField] = useState("Medicine");
  const [subjectId, setSubjectId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [questions, setQuestions] = useState<RawQuestionInput[] | null>(null);

  const subjects = useMemo(() => getSubjectsForField(field), [field]);

  useEffect(() => {
    if (fieldParam) {
      const meta = getFieldMeta(fieldParam);
      if (meta) setField(meta.label);
    }
  }, [fieldParam]);

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
      const modeQuery = apiMode ? `&mode=${apiMode}` : "";
      const useAdaptiveApi = apiMode === "adaptive" || apiMode === "weak";
      if (useAdaptiveApi) {
        const res = await fetch("/api/study/adaptive/next", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            field,
            subjectId,
            count: 25,
            currentDifficulty: "medium",
            ...(apiMode === "weak" ? { weakFocusRatio: 0.75 } : {}),
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Could not load adaptive set");
        const raw = (data.questions as ExamQuestion[]).map((q, i) => ({
          ...q,
          id: i + 1,
          field,
          subjectId,
          bankItemId: (data.bankItemIds as string[] | undefined)?.[i] ?? `bank-${fieldId}-${subjectId}-${i}`,
        }));
        if (raw.length === 0) throw new Error("No questions in bank for this subject yet.");
        setQuestions(raw);
        return;
      }

      const res = await fetch(
        `/api/questions?field=${encodeURIComponent(field)}&subjectId=${encodeURIComponent(subjectId)}&limit=25${modeQuery}`
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
        mode={studyMode}
        title={`${field} · ${label}`}
      />
    );
  }

  return (
    <div className="mt-8 space-y-6">
      <div className="flex flex-wrap gap-2">
        {EXAM_MODES.slice(0, 5).map((m) => (
          <a
            key={m.id}
            href={m.href}
            className={`rounded-full px-3 py-1.5 text-xs font-medium ${
              modeParam === m.param
                ? "bg-[var(--color-accent)] text-white"
                : "border border-black/[0.08] bg-white text-[var(--color-ink-muted)]"
            }`}
          >
            {m.label}
          </a>
        ))}
      </div>

      <div className="apple-card space-y-6 p-8">
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
        <p className="text-sm text-[var(--color-ink-muted)]">
          Mode: <span className="font-medium text-[var(--color-ink)]">{label}</span>
          {apiMode && " — questions ordered by your weak areas."}
        </p>
        {error && <InlineError>{error}</InlineError>}
        <Button
          type="button"
          disabled={loading || !subjectId}
          className="w-full"
          onClick={() => void start()}
        >
          {loading ? "Loading…" : `Start ${label.toLowerCase()}`}
        </Button>
      </div>
    </div>
  );
}
