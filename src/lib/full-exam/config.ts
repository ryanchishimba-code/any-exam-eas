import { EXAM_CATALOG } from "@/lib/edtech/exams";
import { resolveBoardFullQuestionCount } from "@/lib/exam/exam-lengths";
import { isUsmleFieldId, usmleStepDefinition } from "@/lib/exam-prep/usmle/steps";
import {
  fullExamLaunchHref,
  fullExamHref,
  fullExamResultsHref,
  fullExamSessionHref,
  parseFullExamLengthPreset,
} from "@/lib/full-exam/hrefs";
import { CAT_MAX_QUESTIONS, NCLEX_CAT_TIME_LIMIT_SEC } from "@/lib/questions/cat-engine";
import type { ExamSlug } from "@/types/edtech";
import type { FullExamLengthPreset, FullExamSessionConfig } from "@/types/full-exam";

export {
  fullExamHref,
  fullExamLaunchHref,
  fullExamResultsHref,
  fullExamSessionHref,
  parseFullExamLengthPreset,
};

export type LengthOption = {
  preset: FullExamLengthPreset;
  label: string;
  description: string;
  questionCount: number;
};

/** Exam-specific length choices shown on the launcher. */
export function getLengthOptions(examSlug: ExamSlug, fieldId?: string): LengthOption[] {
  const exam = EXAM_CATALOG[examSlug];
  let full = exam.simulatedQuestionCount;
  if (examSlug === "usmle" && fieldId) {
    full = resolveBoardFullQuestionCount(fieldId);
  }

  if (examSlug === "nclex") {
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
        label: "Full NCLEX (CAT)",
        description:
          "85–150 items · 5 hours · Client Needs + NGN case studies (practice CAT).",
        questionCount: full,
      },
    ];
  }

  // USMLE: 100-Q form is the lightweight self-assessment analogue (blueprint-balanced).
  if (examSlug === "usmle") {
    const stepName =
      fieldId && isUsmleFieldId(fieldId)
        ? usmleStepDefinition(fieldId)?.shortName ?? "USMLE"
        : "USMLE";
    return [
      {
        preset: "50",
        label: "50 Questions",
        description: "Timed sprint — one block of mixed organ systems.",
        questionCount: 50,
      },
      {
        preset: "100",
        label: "Self-assessment form",
        description: `100 blueprint-balanced items · ${stepName} practice coverage only — not a pass prediction.`,
        questionCount: 100,
      },
      {
        preset: "full",
        label: "Full-length simulation",
        description: `${full} questions · mimics real ${stepName} length with mixed organ systems.`,
        questionCount: full,
      },
    ];
  }

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
  timed: boolean,
  fieldId?: string
): number {
  if (!timed) return 0;
  if (examSlug === "usmle" && fieldId && isUsmleFieldId(fieldId)) {
    const step = usmleStepDefinition(fieldId);
    if (step) {
      const secPerQuestion = (step.simulatedDurationMin * 60) / step.simulatedQuestionCount;
      return Math.round(secPerQuestion * questionCount);
    }
  }
  const exam = EXAM_CATALOG[examSlug];
  const secPerQuestion = (exam.simulatedDurationMin * 60) / exam.simulatedQuestionCount;
  return Math.round(secPerQuestion * questionCount);
}

/**
 * Whether NCLEX full-length should run practice CAT.
 * Full preset defaults ON (real NCLEX is always CAT); pass `nclexCat: false` for fixed 85.
 */
export function resolveNclexCatEnabled(
  preset: FullExamLengthPreset,
  nclexCat?: boolean
): boolean {
  if (preset !== "full") return nclexCat === true;
  return nclexCat !== false;
}

export function buildSessionConfig(
  examSlug: ExamSlug,
  preset: FullExamLengthPreset,
  timed: boolean,
  opts?: {
    nclexLength?: "minimum" | "maximum";
    focusAreas?: string[];
    nclexCat?: boolean;
    /** USMLE step field — overrides full-length count (e.g. Step 3 = 200). */
    fieldId?: string;
  }
): FullExamSessionConfig {
  const option = getLengthOptions(examSlug, opts?.fieldId).find((o) => o.preset === preset)!;
  let questionCount = option.questionCount;
  if (examSlug === "nclex" && opts?.nclexLength === "maximum") {
    questionCount = 150;
  }
  const nclexCat =
    examSlug === "nclex" && resolveNclexCatEnabled(preset, opts?.nclexCat);
  // Prefetch the full CAT pool so live stop rules (85–150) can fire early.
  if (nclexCat) {
    questionCount = CAT_MAX_QUESTIONS;
  }
  const timeLimitSec = nclexCat
    ? timed
      ? NCLEX_CAT_TIME_LIMIT_SEC
      : 0
    : computeTimeLimitSec(examSlug, questionCount, timed, opts?.fieldId);
  return {
    lengthPreset: preset,
    questionCount,
    timed,
    timeLimitSec,
    adaptive: (preset === "full" && examSlug !== "nclex") || nclexCat,
    ...(examSlug === "nclex"
      ? { nclexLength: opts?.nclexLength ?? "minimum", nclexCat }
      : {}),
    ...(opts?.focusAreas?.length ? { focusAreas: opts.focusAreas } : {}),
  };
}

export function formatMmSs(totalSec: number): string {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/** Live exam clock — always H:M:S (e.g. 0:45:30, 2:30:00). */
export function formatHms(totalSec: number): string {
  const sec = Math.max(0, Math.floor(totalSec));
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

/** Map a target question count back to a launcher length preset for any board. */
export function resolveLengthPresetFromQuestionCount(
  examSlug: ExamSlug,
  questionCount: number,
  opts?: { nclexLength?: "minimum" | "maximum" }
): FullExamLengthPreset {
  const options = getLengthOptions(examSlug);
  const sprint50 = options.find((o) => o.preset === "50");
  const sprint100 = options.find((o) => o.preset === "100");
  const full = options.find((o) => o.preset === "full");

  if (sprint50 && questionCount === sprint50.questionCount) return "50";
  if (sprint100 && questionCount === sprint100.questionCount) return "100";

  if (examSlug === "nclex") {
    // Fixed 85, CAT pool 150, or explicit maximum all map to the full preset.
    if (
      questionCount === EXAM_CATALOG.nclex.simulatedQuestionCount ||
      questionCount === CAT_MAX_QUESTIONS ||
      (opts?.nclexLength === "maximum" && questionCount === 150)
    ) {
      return "full";
    }
  } else if (full && questionCount === full.questionCount) {
    return "full";
  }

  if (questionCount <= 50) return "50";
  if (questionCount <= 100) return "100";
  return "full";
}

export function fullExamModeTitle(
  examSlug: ExamSlug,
  preset: FullExamLengthPreset,
  fieldId?: string
): string {
  const option = getLengthOptions(examSlug, fieldId).find((o) => o.preset === preset);
  if (!option) return `${EXAM_CATALOG[examSlug].shortName} Practice Test`;
  if (examSlug === "usmle" && preset === "100") {
    const step =
      fieldId && isUsmleFieldId(fieldId)
        ? usmleStepDefinition(fieldId)?.shortName
        : null;
    return step ? `${step} Self-Assessment` : "USMLE Self-Assessment";
  }
  if (preset === "full") return `${EXAM_CATALOG[examSlug].shortName} Full-Length Exam`;
  return `${option.questionCount} Question Practice Test`;
}

/** Deep-link into the USMLE 100-Q self-assessment form (practice coverage only). */
export function usmleSelfAssessmentHref(opts?: {
  fieldId?: string;
  autostart?: boolean;
}): string {
  return fullExamLaunchHref("usmle", {
    mode: "100",
    timed: true,
    autostart: opts?.autostart ?? false,
  });
}
