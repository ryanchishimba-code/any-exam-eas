import { EXAM_CATALOG } from "@/lib/edtech/exams";
import { resolveBoardFullQuestionCount } from "@/lib/exam/exam-lengths";
import type { ExamSlug } from "@/types/edtech";
import type { FullExamLengthPreset, FullExamSessionConfig } from "@/types/full-exam";

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
  if (examSlug === "nclex" && opts?.nclexCat) {
    questionCount = opts.nclexLength === "maximum" ? 145 : 85;
  }
  const nclexCat = examSlug === "nclex" && opts?.nclexCat === true;
  return {
    lengthPreset: preset,
    questionCount,
    timed,
    timeLimitSec: computeTimeLimitSec(examSlug, questionCount, timed),
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

export function fullExamHref(examSlug: ExamSlug): string {
  return `/full-exam/${examSlug}`;
}

export function fullExamSessionHref(examSlug: ExamSlug, sessionId: string): string {
  return `/full-exam/${examSlug}/${sessionId}`;
}

export function fullExamResultsHref(
  examSlug: ExamSlug,
  sessionId: string,
  opts?: { review?: boolean }
): string {
  const base = `/full-exam/${examSlug}/${sessionId}/results`;
  if (!opts?.review) return base;
  return `${base}?review=1`;
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
    const nclexFull =
      opts?.nclexLength === "maximum"
        ? buildSessionConfig("nclex", "full", true, { nclexLength: "maximum" }).questionCount
        : buildSessionConfig("nclex", "full", true).questionCount;
    if (questionCount === nclexFull) return "full";
  } else if (full && questionCount === full.questionCount) {
    return "full";
  }

  if (questionCount <= 50) return "50";
  if (questionCount <= 100) return "100";
  return "full";
}

export function parseFullExamLengthPreset(
  value: string | null | undefined
): FullExamLengthPreset {
  const normalized = value?.trim().toLowerCase().replace(/\s+/g, "") ?? "";
  if (normalized === "50" || normalized === "50q") return "50";
  if (normalized === "100" || normalized === "100q") return "100";
  if (
    normalized === "full" ||
    normalized === "fulllength" ||
    normalized === "full-length" ||
    normalized === "fulllengthadaptive"
  ) {
    return "full";
  }
  return "50";
}

/** Launcher URL with optional preset + autostart for dashboard / hub shortcuts. */
export function fullExamLaunchHref(
  examSlug: ExamSlug,
  opts?: { mode?: FullExamLengthPreset; autostart?: boolean; timed?: boolean; nclexCat?: boolean }
): string {
  const params = new URLSearchParams();
  if (opts?.mode) params.set("mode", opts.mode);
  if (opts?.autostart) params.set("autostart", "1");
  if (opts?.timed === false) params.set("timed", "0");
  if (opts?.nclexCat) params.set("nclexCat", "1");
  const query = params.toString();
  return query ? `${fullExamHref(examSlug)}?${query}` : fullExamHref(examSlug);
}

export function fullExamModeTitle(
  examSlug: ExamSlug,
  preset: FullExamLengthPreset
): string {
  const option = getLengthOptions(examSlug).find((o) => o.preset === preset);
  if (!option) return `${EXAM_CATALOG[examSlug].shortName} Practice Test`;
  if (preset === "full") return `${EXAM_CATALOG[examSlug].shortName} Full-Length Exam`;
  return `${option.questionCount} Question Practice Test`;
}
