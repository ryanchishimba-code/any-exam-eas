import { EXAM_CATALOG } from "@/lib/edtech/exams";
import type { ExamSlug } from "@/types/edtech";
import type { FullExamLengthPreset, FullExamSessionConfig } from "@/types/full-exam";

export type LengthOption = {
  preset: FullExamLengthPreset;
  label: string;
  description: string;
  questionCount: number;
};

/** Exam-specific length choices shown on the launcher. */
export function getLengthOptions(examSlug: ExamSlug): LengthOption[] {
  const exam = EXAM_CATALOG[examSlug];
  const full = exam.simulatedQuestionCount;

  return [
    {
      preset: "50",
      label: "50 Questions",
      description: "Focused sprint — great for a daily simulation.",
      questionCount: 50,
    },
    {
      preset: "100",
      label: "100 Questions",
      description: "Extended run — builds stamina and pacing.",
      questionCount: 100,
    },
    {
      preset: "full",
      label: "Full-Length Adaptive",
      description: `${full} questions · mimics real ${exam.shortName} length with mixed topics.`,
      questionCount: full,
    },
  ];
}

/** Scale official exam duration to the selected question count. */
export function computeTimeLimitSec(
  examSlug: ExamSlug,
  questionCount: number,
  timed: boolean
): number {
  if (!timed) return 0;
  const exam = EXAM_CATALOG[examSlug];
  const secPerQuestion = (exam.simulatedDurationMin * 60) / exam.simulatedQuestionCount;
  return Math.round(secPerQuestion * questionCount);
}

export function buildSessionConfig(
  examSlug: ExamSlug,
  preset: FullExamLengthPreset,
  timed: boolean
): FullExamSessionConfig {
  const option = getLengthOptions(examSlug).find((o) => o.preset === preset)!;
  return {
    lengthPreset: preset,
    questionCount: option.questionCount,
    timed,
    timeLimitSec: computeTimeLimitSec(examSlug, option.questionCount, timed),
    adaptive: preset === "full",
  };
}

export function formatMmSs(totalSec: number): string {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function fullExamHref(examSlug: ExamSlug): string {
  return `/full-exam/${examSlug}`;
}

export function fullExamSessionHref(examSlug: ExamSlug, sessionId: string): string {
  return `/full-exam/${examSlug}/${sessionId}`;
}

export function fullExamResultsHref(examSlug: ExamSlug, sessionId: string): string {
  return `/full-exam/${examSlug}/${sessionId}/results`;
}
