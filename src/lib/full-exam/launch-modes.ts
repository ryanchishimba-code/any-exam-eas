/**
 * Shared Full Exam / Roadmap launch modes.
 * Both surfaces call POST /api/full-exam/start with the same payload shape.
 */

import type { ExamSlug } from "@/types/edtech";
import type { FullExamLengthPreset } from "@/types/full-exam";
import { fullExamLaunchHref } from "@/lib/full-exam/config";

export const FULL_EXAM_LAUNCH_MODES = [
  "new_exam",
  "retake_last",
  "focus_weak",
  "continue_learning",
] as const;

export type FullExamLaunchMode = (typeof FULL_EXAM_LAUNCH_MODES)[number];

export function isFullExamLaunchMode(value: unknown): value is FullExamLaunchMode {
  return (
    typeof value === "string" &&
    (FULL_EXAM_LAUNCH_MODES as readonly string[]).includes(value)
  );
}

export type FullExamStartBody = {
  examSlug: ExamSlug;
  launchMode: FullExamLaunchMode;
  lengthPreset?: FullExamLengthPreset;
  timed?: boolean;
  fieldId?: string;
  nclexCat?: boolean;
  nclexLength?: "minimum" | "maximum";
  focusAreas?: string[];
};

/** Build a typed start payload for New / Retake / Focus / Continue. */
export function buildFullExamStartBody(
  examSlug: ExamSlug,
  launchMode: FullExamLaunchMode,
  opts?: Omit<FullExamStartBody, "examSlug" | "launchMode">
): FullExamStartBody {
  return {
    examSlug,
    launchMode,
    lengthPreset: opts?.lengthPreset ?? "50",
    timed: opts?.timed ?? true,
    ...(opts?.fieldId ? { fieldId: opts.fieldId } : {}),
    ...(opts?.nclexCat != null ? { nclexCat: opts.nclexCat } : {}),
    ...(opts?.nclexLength ? { nclexLength: opts.nclexLength } : {}),
    ...(opts?.focusAreas?.length ? { focusAreas: opts.focusAreas } : {}),
  };
}

/** Deep-link into Full Exam launcher with optional mode query (for Continuations). */
export function fullExamLaunchModeHref(
  examSlug: ExamSlug,
  launchMode: FullExamLaunchMode,
  opts?: { lengthPreset?: FullExamLengthPreset; autostart?: boolean; fieldId?: string }
): string {
  const base = fullExamLaunchHref(examSlug, {
    mode: opts?.lengthPreset ?? "50",
    autostart: opts?.autostart ?? false,
  });
  const params = new URLSearchParams(base.includes("?") ? base.split("?")[1] : "");
  params.set("launchMode", launchMode);
  if (opts?.fieldId) params.set("fieldId", opts.fieldId);
  return `${base.split("?")[0]}?${params.toString()}`;
}

export const LAUNCH_MODE_LABELS: Record<FullExamLaunchMode, string> = {
  new_exam: "New Exam",
  retake_last: "Retake Last Exam",
  focus_weak: "Focus on Weak Areas",
  continue_learning: "Continue Learning",
};
