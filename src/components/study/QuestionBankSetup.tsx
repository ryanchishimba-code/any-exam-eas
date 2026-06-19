"use client";

import {
  QUESTION_BANK_COUNT_PRESETS,
  QUESTION_BANK_MAX_COUNT,
  QUESTION_BANK_MIN_COUNT,
  clampQuestionBankCount,
  type QuestionBankPace,
  type QuestionBankStyle,
} from "@/lib/exam/modes";
import { qbUi } from "@/lib/study/question-bank-ui";
import { cn } from "@/lib/utils";
import { QuestionBankSection, QuestionBankSegment } from "./question-bank/QuestionBankSection";
import { QuestionBankTopicPicker } from "./question-bank/QuestionBankTopicPicker";

type SubjectOption = { id: string; label: string };

type QuestionBankSetupProps = {
  subjects: SubjectOption[];
  subjectId: string;
  subjectCounts?: Record<string, number> | null;
  onSubjectChange: (subjectId: string) => void;
  questionCount: number;
  onQuestionCountChange: (count: number) => void;
  pace: QuestionBankPace;
  onPaceChange: (pace: QuestionBankPace) => void;
  bankStyle: QuestionBankStyle;
  onBankStyleChange: (style: QuestionBankStyle) => void;
  examLabel?: string;
  examDescription?: string;
};

const STYLE_OPTIONS: { id: QuestionBankStyle; label: string; hint: string }[] = [
  { id: "standard", label: "Standard", hint: "Topic pool in bank order" },
  { id: "adaptive", label: "Adaptive", hint: "Weak areas & spaced review" },
  { id: "weak_areas", label: "Weak areas", hint: "Focus on missed topics" },
];

export function QuestionBankSetup({
  subjects,
  subjectId,
  subjectCounts,
  onSubjectChange,
  questionCount,
  onQuestionCountChange,
  pace,
  onPaceChange,
  bankStyle,
  onBankStyleChange,
  examLabel,
}: QuestionBankSetupProps) {
  const isCustomCount = !QUESTION_BANK_COUNT_PRESETS.includes(
    questionCount as (typeof QUESTION_BANK_COUNT_PRESETS)[number]
  );

  const selectedSubject = subjects.find((s) => s.id === subjectId);
  const selectedCount = subjectCounts?.[subjectId];

  return (
    <div className="space-y-6">
      <QuestionBankSection
        step={1}
        title="Choose a topic"
        hint="Search or scroll — every question matches your selected exam."
      >
        {/* Current-filter breadcrumb: Exam → Topic · N questions. Makes the active
            scope explicit and trustworthy (only this topic's questions will serve). */}
        {selectedSubject ? (
          <div className="mb-3 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[12px] text-[var(--color-ink-muted)]">
            <span aria-hidden>Practicing</span>
            {examLabel ? (
              <>
                <span className="font-medium text-[var(--color-ink)]">{examLabel}</span>
                <span aria-hidden>›</span>
              </>
            ) : null}
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-accent)]/10 px-2.5 py-0.5 font-semibold text-[var(--color-accent)]">
              {selectedSubject.label}
            </span>
            {typeof selectedCount === "number" ? (
              <span className="tabular-nums">
                · {selectedCount.toLocaleString()} {selectedCount === 1 ? "question" : "questions"}
              </span>
            ) : null}
          </div>
        ) : null}

        <QuestionBankTopicPicker
          subjects={subjects}
          subjectId={subjectId}
          subjectCounts={subjectCounts}
          onSubjectChange={onSubjectChange}
        />
      </QuestionBankSection>

      <QuestionBankSection step={2} title="Session settings" hint="How many questions and how they’re picked.">
        <div className="space-y-4">
          <div>
            <p className="mb-2 text-[13px] font-medium text-[var(--color-ink-muted)]">Question count</p>
            <div className={qbUi.chipRow}>
              {QUESTION_BANK_COUNT_PRESETS.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => onQuestionCountChange(n)}
                  className={cn(
                    qbUi.chip,
                    questionCount === n && !isCustomCount ? qbUi.chipActive : qbUi.chipIdle
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-3 rounded-[14px] bg-black/[0.03] px-3 py-2.5">
              <label className="text-[13px] font-medium text-[var(--color-ink-muted)]" htmlFor="bank-custom-count">
                Custom
              </label>
              <input
                id="bank-custom-count"
                type="number"
                min={QUESTION_BANK_MIN_COUNT}
                max={QUESTION_BANK_MAX_COUNT}
                value={questionCount}
                onChange={(e) => onQuestionCountChange(clampQuestionBankCount(Number(e.target.value)))}
                className="w-16 rounded-[10px] border-0 bg-white px-2 py-1.5 text-center text-[15px] font-semibold text-[var(--color-ink)] outline-none focus:shadow-[0_0_0_3px_rgba(79,70,229,0.18)]"
              />
              <span className="text-[12px] text-[var(--color-ink-muted)]">
                {QUESTION_BANK_MIN_COUNT}–{QUESTION_BANK_MAX_COUNT} allowed
              </span>
            </div>
          </div>

          <div>
            <p className="mb-2 text-[13px] font-medium text-[var(--color-ink-muted)]">Selection style</p>
            <div className="grid gap-2 sm:grid-cols-3">
              {STYLE_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => onBankStyleChange(option.id)}
                  className={cn(
                    "rounded-[16px] border px-3.5 py-3 text-left transition active:scale-[0.99]",
                    bankStyle === option.id
                      ? "border-[var(--color-accent)]/35 bg-[var(--color-accent)]/5 ring-1 ring-[var(--color-accent)]/20"
                      : "border-black/[0.06] bg-white hover:border-black/[0.1]"
                  )}
                >
                  <p className="text-[14px] font-semibold text-[var(--color-ink)]">{option.label}</p>
                  <p className="mt-0.5 text-[12px] leading-snug text-[var(--color-ink-muted)]">
                    {option.hint}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-[13px] font-medium text-[var(--color-ink-muted)]">Pace</p>
            <QuestionBankSegment
              ariaLabel="Session pace"
              value={pace}
              onChange={onPaceChange}
              options={[
                { id: "untimed", label: "Untimed" },
                { id: "timed", label: "Timed" },
              ]}
            />
            <p className="mt-2 text-[12px] text-[var(--color-ink-muted)]">
              {pace === "timed"
                ? "Per-question timer to simulate exam pressure."
                : "No clock — review rationales at your own speed."}
            </p>
          </div>
        </div>
      </QuestionBankSection>
    </div>
  );
}
