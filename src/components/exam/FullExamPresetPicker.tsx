"use client";

import { useEffect, useState } from "react";
import type { ExamSlug } from "@/types/edtech";
import { cn } from "@/lib/utils";

type PresetSummary = {
  examNumber: number;
  title: string;
  questionCount: number;
  qaPassed?: boolean;
};

type Props = {
  examSlug: ExamSlug;
  value: number | null;
  onChange: (examNumber: number | null) => void;
  className?: string;
};

export function FullExamPresetPicker({ examSlug, value, onChange, className }: Props) {
  const [presets, setPresets] = useState<PresetSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    void fetch(`/api/full-exam/presets?examSlug=${examSlug}`)
      .then((res) => (res.ok ? res.json() : { exams: [] }))
      .then((data: { exams?: PresetSummary[] }) => {
        if (cancelled) return;
        setPresets(data.exams ?? []);
      })
      .catch(() => {
        if (!cancelled) setPresets([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [examSlug]);

  if (loading) {
    return (
      <p className={cn("text-center text-[12px] text-[var(--color-ink-muted)]", className)}>
        Loading curated exams…
      </p>
    );
  }

  if (presets.length === 0) return null;

  return (
    <div className={cn("space-y-2", className)}>
      <p className="text-center text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">
        Curated practice exams
      </p>
      <label className="block text-[12px] font-medium text-[var(--color-ink-muted)]">
        Optional preset
        <select
          className="mt-1.5 w-full rounded-xl border border-[var(--color-border)] bg-white px-3 py-2.5 text-[14px] text-[var(--color-ink)] shadow-sm"
          value={value ?? ""}
          onChange={(e) => {
            const raw = e.target.value;
            onChange(raw ? Number(raw) : null);
          }}
        >
          <option value="">Random adaptive mix</option>
          {presets.map((exam) => (
            <option key={exam.examNumber} value={exam.examNumber}>
              Exam {exam.examNumber} · {exam.questionCount} Q
              {exam.qaPassed === false ? " (draft)" : ""}
            </option>
          ))}
        </select>
      </label>
      <p className="text-center text-[11px] leading-relaxed text-[var(--color-ink-muted)]">
        Presets are blueprint-balanced with diverse answer choices and no duplicate cases within each exam.
      </p>
    </div>
  );
}
