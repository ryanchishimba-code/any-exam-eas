import type { FormatCounts } from "@/lib/inventory/active-questions";
import {
  isMixedPracticeSubject,
  type DeliberatePracticeFormat,
  type PracticeFormatMode,
} from "@/lib/study/practice-format";

/**
 * A format is a student choice only when this scope has eligible items.
 * Unknown counts are not an offer — callers must not advertise or launch them.
 */
export function isFormatOffered(
  format: DeliberatePracticeFormat,
  formats: FormatCounts | null | undefined
): boolean {
  if (!formats) return false;
  const count = format === "ngn" ? formats.ngn : formats.case;
  return count > 0;
}

export function offeredDeliberateFormats(
  formats: FormatCounts | null | undefined
): DeliberatePracticeFormat[] {
  return (["ngn", "case"] as const).filter((format) => isFormatOffered(format, formats));
}

/**
 * A deep link to a format with nothing to serve becomes standard practice.
 * Unknown counts stay as requested so a valid link is not rewritten while loading.
 */
export function coercePracticeFormat(
  requested: PracticeFormatMode,
  formats: FormatCounts | null | undefined
): PracticeFormatMode {
  if (requested !== "ngn" && requested !== "case") return requested;
  if (!formats) return requested;
  return isFormatOffered(requested, formats) ? requested : "all";
}

export type PracticeFormatChooser = {
  choices: Array<"all" | DeliberatePracticeFormat>;
  intro: string;
  columns: 2 | 3;
};

/**
 * Format picker model. Null means the section is omitted: a blueprint area,
 * counts still loading, or neither NGN nor case has eligible items.
 */
export function practiceFormatChooser(params: {
  formats: FormatCounts | null | undefined;
  ngnLabel?: string;
  subjectId?: string | null;
  lockToAll?: boolean;
}): PracticeFormatChooser | null {
  if (params.lockToAll || !params.formats) return null;
  const offered = offeredDeliberateFormats(params.formats);
  if (offered.length === 0) return null;
  const ngnLabel = params.ngnLabel?.trim() || "NGN";
  const names = offered.map((format) => (format === "ngn" ? ngnLabel : "Case"));
  const named = names.length === 2 ? `${names[0]} and ${names[1]}` : names[0]!;
  const scope = isMixedPracticeSubject(params.subjectId) ? "every topic" : "this topic";
  return {
    choices: ["all", ...offered],
    intro: `${named} sets draw eligible items from ${scope}. The numbers are the questions this session can use.`,
    columns: offered.length === 1 ? 2 : 3,
  };
}

/** Presets that exist only to practice one format bucket. */
const PRESET_FORMAT: Record<string, DeliberatePracticeFormat> = {
  "sata-mastery": "ngn",
  "step3-ccs-drill": "case",
};

export function practicePresetFormat(presetId: string | null | undefined): DeliberatePracticeFormat | null {
  const id = presetId?.trim() ?? "";
  return PRESET_FORMAT[id] ?? null;
}

export function isFormatTaggedPreset(presetId: string | null | undefined): boolean {
  return practicePresetFormat(presetId) != null;
}

export function isPracticePresetOffered(
  presetId: string | null | undefined,
  formats: FormatCounts | null | undefined
): boolean {
  const format = practicePresetFormat(presetId);
  if (!format) return true;
  return isFormatOffered(format, formats);
}

export function filterPresetsByOfferedFormats<T extends { id: string }>(
  presets: readonly T[],
  formats: FormatCounts | null | undefined
): T[] {
  return presets.filter((preset) => isPracticePresetOffered(preset.id, formats));
}

export function visibleStudyPlanDays<T extends { label: string; presetIds: readonly string[] }>(
  days: readonly T[],
  formats: FormatCounts | null | undefined,
  scrubLabel: (label: string) => string | null
): T[] {
  const visible: T[] = [];
  for (const day of days) {
    const presetIds = day.presetIds.filter((id) => isPracticePresetOffered(id, formats));
    if (day.presetIds.length > 0 && presetIds.length === 0) continue;
    const label = scrubLabel(day.label);
    if (!label) {
      if (presetIds.length === 0) continue;
      visible.push({ ...day, presetIds, label: "Practice block" });
      continue;
    }
    visible.push(presetIds.length === day.presetIds.length ? { ...day, label } : { ...day, presetIds, label });
  }
  return visible;
}
