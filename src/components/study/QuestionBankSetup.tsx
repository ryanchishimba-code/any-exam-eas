"use client";

import {
  QUESTION_BANK_COUNT_PRESETS,
  type QuestionBankPace,
  type QuestionBankStyle,
} from "@/lib/exam/modes";
import {
  MIXED_SUBJECT_ID,
  MIXED_SUBJECT_LABEL,
  availableQuestionCount,
  isMixedSubjectId,
  questionBankCountOptionsForAvailable,
  resolveWheelCountValue,
  validateQuestionBankSession,
} from "@/lib/study/question-bank-setup";
import { qbUi } from "@/lib/study/question-bank-ui";
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
  countsLoading?: boolean;
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
  weakSubjectIds = [],
  compact = false,
  countsLoading = false,
}: QuestionBankSetupProps) {
  const maxAvailable = availableQuestionCount(subjectId, subjectCounts);
  const countOptions = questionBankCountOptionsForAvailable(maxAvailable);
  const wheelValue = resolveWheelCountValue(questionCount, countOptions);
  const validation = validateQuestionBankSession({
    subjectId,
    questionCount,
    subjectCounts,
    bankStyle,
  });

  const selectedSubject = isMixedSubjectId(subjectId)
    ? { id: MIXED_SUBJECT_ID, label: MIXED_SUBJECT_LABEL }
    : subjects.find((s) => s.id === subjectId);
  const selectedCount = maxAvailable;

  return (
    <div className="space-y-5">
      <QuestionBankSection
        title="Choose a topic"
        hint="Search or scroll — weak topics from your dashboard are marked."
      >
        {weakSubjectIds.length > 0 ? (
          <p className={cn(qbUi.surface, "px-3.5 py-2.5 text-[12px] text-[var(--color-ink-muted)]")}>
            {weakSubjectIds.length} weak topic{weakSubjectIds.length === 1 ? "" : "s"} flagged —
            start there for the biggest gains.
          </p>
        ) : null}
        {selectedSubject ? (
          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 px-0.5 text-[12px] text-[var(--color-ink-muted)]">
            <span aria-hidden>Practicing</span>
            {examLabel ? (
              <>
                <span className="font-medium text-[var(--color-ink)]">{examLabel}</span>
                <span aria-hidden>›</span>
              </>
            ) : null}
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-accent)]/10 px-2 py-0.5 font-semibold text-[var(--color-accent)]">
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
          countsLoading={countsLoading}
        />
      </QuestionBankSection>

      <QuestionBankSection
        title="Session settings"
        hint="Pick length, then tune how questions are chosen."
      >
        <div className="space-y-5">
          <div>
            <p className={cn(qbUi.sectionHint, "mb-3 px-0.5")}>Question count</p>
            {countOptions.length === 0 ? (
              <p className="text-center text-[12px] text-amber-800" role="status">
                Not enough serve-ready questions for this topic yet.
              </p>
            ) : (
              <QuestionBankCountWheel
                options={countOptions}
                value={wheelValue}
                onChange={onQuestionCountChange}
              />
            )}
            {maxAvailable != null &&
            maxAvailable > 0 &&
            maxAvailable < QUESTION_BANK_COUNT_PRESETS[0] ? (
              <p className="mt-2 text-center text-[12px] text-[var(--color-ink-muted)]" role="status">
                This topic has {maxAvailable.toLocaleString()} serve-ready question
                {maxAvailable === 1 ? "" : "s"} — counts above that are hidden.
              </p>
            ) : null}
            {!validation.ok && validation.message ? (
              <p className="mt-2 text-center text-[12px] text-amber-800" role="status">
                {validation.message}
              </p>
            ) : null}
          </div>

          {!compact ? (
            <div>
              <p className={cn(qbUi.sectionHint, "mb-2 px-0.5")}>Selection style</p>
              <div className="grid gap-2 sm:grid-cols-3">
                {STYLE_OPTIONS.map((option) => {
                  const disabledMixed =
                    isMixedSubjectId(subjectId) && option.id !== "standard";
                  const active = bankStyle === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      disabled={disabledMixed}
                      onClick={() => onBankStyleChange(option.id)}
                      className={cn(
                        qbUi.optionCard,
                        active && qbUi.optionCardActive,
                        disabledMixed && "cursor-not-allowed opacity-45"
                      )}
                    >
                      <p className="text-[13px] font-semibold text-[var(--color-ink)]">
                        {option.label}
                      </p>
                      <p className={cn(qbUi.sectionHint, "mt-0.5")}>
                        {disabledMixed ? "Pick a single topic for this mode" : option.hint}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          <div>
            <p className={cn(qbUi.sectionHint, "mb-2 px-0.5")}>Pace</p>
            <QuestionBankSegment
              ariaLabel="Session pace"
              value={pace}
              onChange={onPaceChange}
              options={[
                { id: "untimed", label: "Untimed" },
                { id: "timed", label: "Timed" },
              ]}
            />
            <p className={cn(qbUi.sectionHint, "mt-2 px-0.5")}>
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
