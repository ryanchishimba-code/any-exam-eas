/**
 * Lightweight full-exam URL builders for nav / dashboard / home chrome.
 * Keep this module free of exam-lengths → fields → subject-registry (and seed) imports
 * so client chunks that only need hrefs stay small.
 */
import type { ExamSlug } from "@/types/edtech";
import type { FullExamLengthPreset } from "@/types/full-exam";

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

/** Launcher URL with optional preset + autostart for dashboard / hub shortcuts. */
export function fullExamLaunchHref(
  examSlug: ExamSlug,
  opts?: {
    mode?: FullExamLengthPreset;
    autostart?: boolean;
    timed?: boolean;
    nclexCat?: boolean;
    fieldId?: string;
  }
): string {
  const params = new URLSearchParams();
  if (opts?.mode) params.set("mode", opts.mode);
  if (opts?.autostart) params.set("autostart", "1");
  if (opts?.timed === false) params.set("timed", "0");
  if (opts?.nclexCat) params.set("nclexCat", "1");
  if (opts?.fieldId) params.set("fieldId", opts.fieldId);
  const query = params.toString();
  return query ? `${fullExamHref(examSlug)}?${query}` : fullExamHref(examSlug);
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
