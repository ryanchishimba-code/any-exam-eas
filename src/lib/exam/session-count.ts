import type { ExamSlug } from "@/types/edtech";
import type { FullExamLengthPreset, FullExamSessionConfig } from "@/types/full-exam";
import {
  computeTimeLimitSec,
  parseFullExamLengthPreset,
  resolveLengthPresetFromQuestionCount,
} from "@/lib/full-exam/config";
import {
  type NclexTimedVariant,
  resolveBoardFullQuestionCount,
} from "@/lib/exam/exam-lengths";
import { isMpjeField } from "@/lib/mpje/config";

const SPRINT_COUNTS = new Set([50, 100]);

/** Parse API/client preset strings — invalid values fall back to 50Q sprint, not full. */
export function parseRequestedLengthPreset(
  value: string | null | undefined
): FullExamLengthPreset {
  return parseFullExamLengthPreset(value);
}

/** Reverse-map a count to a launcher preset (USMLE step-aware when fieldId provided). */
export function resolveLengthPresetForField(
  examSlug: ExamSlug,
  questionCount: number,
  opts?: { nclexLength?: NclexTimedVariant; fieldId?: string }
): FullExamLengthPreset {
  if (SPRINT_COUNTS.has(questionCount)) {
    return questionCount === 50 ? "50" : "100";
  }
  if (opts?.fieldId && isMpjeField(opts.fieldId)) {
    const full = resolveBoardFullQuestionCount(opts.fieldId, opts.nclexLength);
    if (questionCount === full) return "full";
  }
  if (opts?.fieldId && examSlug === "usmle") {
    const full = resolveBoardFullQuestionCount(opts.fieldId, opts.nclexLength);
    if (questionCount === full) return "full";
  }
  return resolveLengthPresetFromQuestionCount(examSlug, questionCount, {
    nclexLength: opts?.nclexLength,
  });
}

/** Keep stored session config aligned with the count actually assembled and served. */
export function syncSessionConfigQuestionCount(
  config: FullExamSessionConfig,
  examSlug: ExamSlug,
  deliveredCount: number
): FullExamSessionConfig {
  if (deliveredCount === config.questionCount) return config;
  return {
    ...config,
    questionCount: deliveredCount,
    timeLimitSec: config.timed ? computeTimeLimitSec(examSlug, deliveredCount, true) : 0,
  };
}

export function assertExactQuestionCount(received: number, expected: number, label = "session"): void {
  if (received !== expected) {
    throw new Error(
      `Expected ${expected} questions but received ${received} for this ${label}. Try fewer questions or another topic.`
    );
  }
}
