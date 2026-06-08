"use client";

import {
  QUESTION_BANK_COUNT_PRESETS,
  QUESTION_BANK_MAX_COUNT,
  QUESTION_BANK_MIN_COUNT,
  clampQuestionBankCount,
  type QuestionBankPace,
  type QuestionBankStyle,
} from "@/lib/exam/modes";
import { cn } from "@/lib/utils";

type SubjectOption = { id: string; label: string };

type QuestionBankSetupProps = {
  subjects: SubjectOption[];
  subjectId: string;
  onSubjectChange: (subjectId: string) => void;
  questionCount: number;
  onQuestionCountChange: (count: number) => void;
  pace: QuestionBankPace;
  onPaceChange: (pace: QuestionBankPace) => void;
  bankStyle: QuestionBankStyle;
  onBankStyleChange: (style: QuestionBankStyle) => void;
};

export function QuestionBankSetup({
  subjects,
  subjectId,
  onSubjectChange,
  questionCount,
  onQuestionCountChange,
  pace,
  onPaceChange,
  bankStyle,
  onBankStyleChange,
}: QuestionBankSetupProps) {
  const isCustomCount = !QUESTION_BANK_COUNT_PRESETS.includes(
    questionCount as (typeof QUESTION_BANK_COUNT_PRESETS)[number]
  );

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-violet-200/60 bg-gradient-to-br from-violet-500/5 to-transparent px-4 py-3">
        <p className="text-sm font-medium text-[var(--color-ink)]">Flexible practice</p>
        <p className="mt-1 text-xs text-[var(--color-ink-muted)]">
          Choose a topic, set how many questions you want, and practice timed or at your own pace.
        </p>
      </div>

      <div>
        <label className="apple-label" htmlFor="bank-topic">
          Topic
        </label>
        <select
          id="bank-topic"
          className="apple-input mt-2 w-full"
          value={subjectId}
          onChange={(e) => onSubjectChange(e.target.value)}
        >
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="apple-label">Number of questions</label>
        <div className="mt-2 flex flex-wrap gap-2">
          {QUESTION_BANK_COUNT_PRESETS.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => onQuestionCountChange(n)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition",
                questionCount === n && !isCustomCount
                  ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                  : "border-black/[0.08] bg-white text-[var(--color-ink-muted)] hover:border-black/[0.12]"
              )}
            >
              {n}
            </button>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-3">
          <label className="text-sm text-[var(--color-ink-muted)]" htmlFor="bank-custom-count">
            Custom
          </label>
          <input
            id="bank-custom-count"
            type="number"
            min={QUESTION_BANK_MIN_COUNT}
            max={QUESTION_BANK_MAX_COUNT}
            value={questionCount}
            onChange={(e) => onQuestionCountChange(clampQuestionBankCount(Number(e.target.value)))}
            className="apple-input w-24"
          />
          <span className="text-xs text-[var(--color-ink-muted)]">
            {QUESTION_BANK_MIN_COUNT}–{QUESTION_BANK_MAX_COUNT}
          </span>
        </div>
      </div>

      <div>
        <label className="apple-label">Question selection</label>
        <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {(
            [
              {
                id: "standard" as const,
                title: "Standard",
                hint: "Topic-based pool in bank order",
              },
              {
                id: "adaptive" as const,
                title: "Adaptive practice",
                hint: "Weak areas, SRS due, and high-yield scoring",
              },
              {
                id: "weak_areas" as const,
                title: "Weak areas",
                hint: "Focus on topics you miss most",
              },
            ] as const
          ).map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => onBankStyleChange(option.id)}
              className={cn(
                "rounded-xl border px-3 py-3 text-left transition",
                bankStyle === option.id
                  ? "border-[var(--color-accent)] bg-[var(--color-accent)]/5 ring-1 ring-[var(--color-accent)]"
                  : "border-black/[0.08] bg-white hover:border-black/[0.12]"
              )}
            >
              <p className="text-sm font-medium text-[var(--color-ink)]">{option.title}</p>
              <p className="mt-1 text-[0.6875rem] leading-snug text-[var(--color-ink-muted)]">
                {option.hint}
              </p>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="apple-label">Session pace</label>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          {(
            [
              {
                id: "untimed" as const,
                title: "Untimed",
                hint: "Practice at your own pace with no clock",
              },
              {
                id: "timed" as const,
                title: "Timed",
                hint: "Per-question timer to simulate exam pressure",
              },
            ] as const
          ).map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => onPaceChange(option.id)}
              className={cn(
                "rounded-xl border px-4 py-3 text-left transition",
                pace === option.id
                  ? "border-[var(--color-accent)] bg-[var(--color-accent)]/5 ring-1 ring-[var(--color-accent)]"
                  : "border-black/[0.08] bg-white hover:border-black/[0.12]"
              )}
            >
              <p className="font-medium text-[var(--color-ink)]">{option.title}</p>
              <p className="mt-1 text-xs text-[var(--color-ink-muted)]">{option.hint}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
