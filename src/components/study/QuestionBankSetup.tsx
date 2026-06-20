"use client";

import {
  clampQuestionBankCount,
  type QuestionBankPace,
  type QuestionBankStyle,
} from "@/lib/exam/modes";
import {
  MIXED_SUBJECT_ID,
  MIXED_SUBJECT_LABEL,
  availableQuestionCount,
  isMixedSubjectId,
  questionBankCountOptions,
  validateQuestionBankSession,
} from "@/lib/study/question-bank-setup";
import { cn } from "@/lib/utils";
import { QuestionBankCountWheel } from "./question-bank/QuestionBankCountWheel";
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
  weakSubjectIds?: string[];
  compact?: boolean;
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
  weakSubjectIds,
  compact = false,
}: QuestionBankSetupProps) {
  const countOptions = questionBankCountOptions();
  const validation = validateQuestionBankSession({
    subjectId,
    questionCount,
    subjectCounts,
    bankStyle,
  });

  const selectedSubject = isMixedSubjectId(subjectId)
    ? { id: MIXED_SUBJECT_ID, label: MIXED_SUBJECT_LABEL }
    : subjects.find((s) => s.id === subjectId);
  const selectedCount = availableQuestionCount(subjectId, subjectCounts);

  return (
    <div className="space-y-6">
      <QuestionBankSection
        step={1}
        title="Choose a topic"
        hint="Search or scroll — counts match the live serve pool for your exam."
      >
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
          weakSubjectIds={weakSubjectIds}
        />
      </QuestionBankSection>

      <QuestionBankSection step={2} title="Session settings" hint="Scroll to pick length, then tune how questions are chosen.">
        <div className="space-y-5">
          <div>
            <p className="mb-3 text-[13px] font-medium text-[var(--color-ink-muted)]">Question count</p>
            <QuestionBankCountWheel
              options={countOptions}
              value={clampQuestionBankCount(questionCount)}
              onChange={onQuestionCountChange}
            />
            {!validation.ok && validation.message && validation.maxAvailable ? (
              <p className="mt-2 text-center text-[12px] text-amber-800 dark:text-amber-200" role="status">
                {validation.message}
              </p>
            ) : null}
          </div>

          {!compact ? (
            <div>
              <p className="mb-2 text-[13px] font-medium text-[var(--color-ink-muted)]">Selection style</p>
              <div className="grid gap-2 sm:grid-cols-3">
                {STYLE_OPTIONS.map((option) => {
                  const disabledMixed =
                    isMixedSubjectId(subjectId) && option.id !== "standard";
                  return (
                    <button
                      key={option.id}
                      type="button"
                      disabled={disabledMixed}
                      onClick={() => onBankStyleChange(option.id)}
                      className={cn(
                        "rounded-[16px] border px-3.5 py-3 text-left transition active:scale-[0.99]",
                        disabledMixed && "cursor-not-allowed opacity-45",
                        bankStyle === option.id
                          ? "border-[var(--color-accent)]/35 bg-[var(--color-accent)]/5 ring-1 ring-[var(--color-accent)]/20"
                          : "border-black/[0.06] bg-white hover:border-black/[0.1]"
                      )}
                    >
                      <p className="text-[14px] font-semibold text-[var(--color-ink)]">{option.label}</p>
                      <p className="mt-0.5 text-[12px] leading-snug text-[var(--color-ink-muted)]">
                        {disabledMixed ? "Pick a single topic for this mode" : option.hint}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

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
