/**
 * Study launch modes — full simulated exam or custom question bank only.
 */
import type { PracticeFieldId } from "@/lib/subjects/field-ids";
import { USMLE_STEPS } from "@/lib/exam-prep/usmle/steps";
import { examSlugFromFieldId } from "@/lib/edtech/exams";
import { fullExamLaunchHref } from "@/lib/full-exam/config";
import { ROUTES } from "@/lib/routes";

const bankUrl = (fieldId: string, extra?: Record<string, string>) => {
  const qs = new URLSearchParams({ field: fieldId, ...extra });
  return `${ROUTES.questionBank}?${qs.toString()}`;
};

export type PracticeModeId = "simulator" | "bank";

export type PracticeModeDefinition = {
  id: PracticeModeId;
  label: string;
  description: string;
  icon: string;
  /** Study practice URL param or special route */
  href: (fieldId: PracticeFieldId) => string;
  timing: string;
  bestFor: string;
};

export const PRACTICE_MODES: PracticeModeDefinition[] = [
  {
    id: "simulator",
    label: "Full Exam",
    description:
      "Board-length timed exam with mixed topics — mirrors real USMLE, NAPLEX, NCLEX, or PANCE format.",
    icon: "clock",
    href: (fieldId) => {
      const slug = examSlugFromFieldId(fieldId);
      if (!slug) return ROUTES.fullExam;
      return fullExamLaunchHref(slug, {
        mode: "full",
        autostart: true,
        ...(slug === "nclex" ? { nclexCat: true } : {}),
      });
    },
    timing: "Full length",
    bestFor: "Endurance and exam-day readiness",
  },
  {
    id: "bank",
    label: "Question Bank",
    description: "Custom practice — pick a topic, set question count, timed or untimed.",
    icon: "book",
    href: (fieldId) => bankUrl(fieldId),
    timing: "Flexible",
    bestFor: "Focused review and daily drills",
  },
];

export const USMLE_STEP_OPTIONS = USMLE_STEPS.map((step) => ({
  id: step.fieldId as PracticeFieldId,
  label: step.shortName,
  fieldParam: step.fieldId,
  description: step.description,
  timing: `${step.simulatedQuestionCount} questions · ~${Math.round(step.simulatedDurationMin / 60)} hours`,
  format:
    step.level === "step1"
      ? "Basic science MCQs"
      : step.level === "step3"
        ? "MCQs · biostats · ethics · CCS-style"
        : "Clinical vignettes · sequential sets",
}));

export const EXAM_FIELD_OPTIONS: {
  id: PracticeFieldId;
  label: string;
  fieldParam: string;
  description: string;
  timing: string;
  format: string;
}[] = [
  {
    id: "nursing",
    label: "NCLEX",
    fieldParam: "nursing",
    description: "NCLEX-NGN clinical judgment — bow-tie, matrix, case studies, prioritization.",
    timing: "85–150 questions · adaptive",
    format: "NGN + traditional items",
  },
  ...USMLE_STEP_OPTIONS,
  {
    id: "pharmacy",
    label: "NAPLEX",
    fieldParam: "pharmacy",
    description: "NABP five-domain blueprint (2025) — calculations, treatment planning (~40%), medication use, and professional practice.",
    timing: "225 questions · 6 hours",
    format: "Clinical scenarios + calculations",
  },
  {
    id: "pance",
    label: "PANCE",
    fieldParam: "pance",
    description:
      "NCCPA 2026 blueprint — 14 knowledge areas, 8 task areas, clinical vignettes across the lifespan.",
    timing: "300 questions · 5 hours",
    format: "Clinical MCQ vignettes",
  },
  {
    id: "aanp-fnp",
    label: "AANP FNP",
    fieldParam: "aanp-fnp",
    description:
      "AANPCB blueprint primary care — Assess, Diagnose, Plan, Evaluate across the lifespan.",
    timing: "135 questions · 3.5 hours",
    format: "Clinical vignette MCQs",
  },
  {
    id: "npte-pt",
    label: "NPTE-PT",
    fieldParam: "npte-pt",
    description:
      "FSBPT blueprint — MSK, neuromuscular, cardiopulmonary, modalities, and safety.",
    timing: "250 questions · 5 hours",
    format: "Clinical scenario MCQs",
  },
];

export function getPracticeMode(id: PracticeModeId): PracticeModeDefinition | undefined {
  return PRACTICE_MODES.find((m) => m.id === id);
}

/** Map URL params from a practice launch link back to a hub mode. */
export function resolvePracticeModeFromParams(params: {
  practiceMode?: string | null;
  mode?: string | null;
  style?: string | null;
  count?: string | null;
}): PracticeModeId {
  const explicit = params.practiceMode;
  if (explicit === "simulator" || explicit === "test_day") return "simulator";
  if (explicit === "bank" || explicit === "topic" || explicit === "quick" || explicit === "adaptive") {
    return "bank";
  }
  if (params.mode === "timed") return "simulator";
  return "bank";
}

/** Build a launch URL on the given base path with autostart. */
export function practiceModeLaunchHref(
  fieldId: PracticeFieldId,
  modeId: PracticeModeId,
  basePath: string
): string {
  const mode = getPracticeMode(modeId);
  if (!mode) return basePath;

  if (modeId === "simulator") {
    const slug = examSlugFromFieldId(fieldId);
    if (slug) {
      return fullExamLaunchHref(slug, {
        mode: "full",
        autostart: true,
        ...(slug === "nclex" ? { nclexCat: true } : {}),
      });
    }
  }

  const raw = mode.href(fieldId);
  const qs = raw.includes("?") ? raw.slice(raw.indexOf("?") + 1) : "";
  const params = new URLSearchParams(qs);
  params.set("autostart", "1");
  params.set("practiceMode", modeId);
  return `${basePath}?${params.toString()}`;
}
