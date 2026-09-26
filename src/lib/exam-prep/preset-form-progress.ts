/**
 * Board-generic progress for composed practice forms.
 * A form is identified as `${examSlug}:${examNumber}` on the session analysis.
 * Sessions that never recorded that id are left alone.
 */

export type PresetFormProgressStatus = "not_started" | "in_progress" | "completed";

export type PresetFormUse = {
  presetFormId: string;
  status: "in_progress" | "completed";
  sessionId: string;
  score: number | null;
};

const HIDDEN_WORDING = /shortfall|coming soon|placeholder/i;

export function presetFormId(examSlug: string, examNumber: number): string {
  return `${examSlug}:${examNumber}`;
}

export function readPresetFormId(analysis: unknown): string | null {
  if (!analysis || typeof analysis !== "object") return null;
  const id = (analysis as { presetFormId?: unknown }).presetFormId;
  if (typeof id !== "string") return null;
  const trimmed = id.trim();
  const split = trimmed.lastIndexOf(":");
  if (split <= 0) return null;
  const examNumber = Number(trimmed.slice(split + 1));
  if (!Number.isInteger(examNumber) || examNumber <= 0) return null;
  return trimmed;
}

export function readPresetExamNumber(analysis: unknown): number | null {
  if (!analysis || typeof analysis !== "object") return null;
  const value = (analysis as { presetExamNumber?: unknown }).presetExamNumber;
  if (typeof value === "number" && Number.isInteger(value) && value > 0) return value;
  const id = readPresetFormId(analysis);
  if (!id) return null;
  const examNumber = Number(id.slice(id.lastIndexOf(":") + 1));
  return Number.isInteger(examNumber) ? examNumber : null;
}

/** Keep the form id when a submit replaces the rest of the analysis JSON. */
export function preservePresetFormOnAnalysis(
  stored: unknown,
  next: Record<string, unknown>
): Record<string, unknown> {
  const formId = readPresetFormId(stored);
  const examNumber = readPresetExamNumber(stored);
  if (!formId) return next;
  return {
    ...next,
    presetFormId: formId,
    ...(examNumber != null ? { presetExamNumber: examNumber } : {}),
  };
}

/**
 * Newest row wins. An in-progress sitting beats an older completed one.
 * Abandoned rows do not count as started or completed.
 */
export function summarizePresetFormUses(
  rows: readonly {
    id: string;
    status: string;
    score: number | null;
    analysis: unknown;
  }[]
): Map<string, PresetFormUse> {
  const uses = new Map<string, PresetFormUse>();
  for (const row of rows) {
    const formId = readPresetFormId(row.analysis);
    if (!formId || uses.has(formId)) continue;
    if (row.status === "in_progress") {
      uses.set(formId, {
        presetFormId: formId,
        status: "in_progress",
        sessionId: row.id,
        score: null,
      });
      continue;
    }
    if (row.status === "completed" || row.status === "ended_early") {
      uses.set(formId, {
        presetFormId: formId,
        status: "completed",
        sessionId: row.id,
        score: typeof row.score === "number" && Number.isFinite(row.score) ? row.score : null,
      });
    }
  }
  return uses;
}

export function usedPresetExamNumbers(uses: ReadonlyMap<string, PresetFormUse>): Set<number> {
  const used = new Set<number>();
  for (const formId of uses.keys()) {
    const examNumber = Number(formId.slice(formId.lastIndexOf(":") + 1));
    if (Number.isInteger(examNumber)) used.add(examNumber);
  }
  return used;
}

/** Lowest-numbered active form whose length matches and the student has not started or completed. */
export function pickNextUnusedPresetForm<T extends { examNumber: number; questionCount: number }>(
  forms: readonly T[],
  usedExamNumbers: ReadonlySet<number>,
  simulationLength: number
): T | null {
  if (simulationLength <= 0) return null;
  const matching = forms
    .filter((form) => form.questionCount === simulationLength && !usedExamNumbers.has(form.examNumber))
    .sort((a, b) => a.examNumber - b.examNumber);
  return matching[0] ?? null;
}

export function practiceExamLengthNote(
  questionCount: number,
  fullSimulationCount: number
): string {
  if (questionCount > 0 && questionCount < fullSimulationCount) {
    return `${questionCount}-question practice exam`;
  }
  return `${questionCount} questions`;
}

export function studentPracticeExamTitle(
  title: string,
  examNumber: number,
  boardLabel: string
): string {
  const cleaned = title.replace(/\s+/g, " ").trim();
  if (!cleaned || HIDDEN_WORDING.test(cleaned)) {
    return `${boardLabel} Practice Exam ${examNumber}`;
  }
  return cleaned;
}

export const PRACTICE_EXAM_PREVIEW_COUNT = 3;

/**
 * Compact window: in-progress forms stay visible, then the next forms
 * starting at the first one the student has not started.
 */
export function previewPracticeExams<T extends { status: PresetFormProgressStatus }>(
  forms: readonly T[],
  expanded: boolean,
  limit = PRACTICE_EXAM_PREVIEW_COUNT
): T[] {
  if (expanded || forms.length <= limit) return [...forms];
  const inProgress = forms.filter((form) => form.status === "in_progress");
  const rest = forms.filter((form) => form.status !== "in_progress");
  const nextIndex = rest.findIndex((form) => form.status === "not_started");
  const start = nextIndex < 0 ? 0 : nextIndex;
  const slots = Math.max(nextIndex < 0 ? 0 : 1, limit - inProgress.length);
  let window = rest.slice(start, start + slots);
  if (window.length < slots) {
    const need = slots - window.length;
    window = [...rest.slice(Math.max(0, start - need), start), ...window];
  }
  return [...inProgress, ...window];
}

export function nextUnstartedExamNumber(
  forms: readonly { examNumber: number; status: PresetFormProgressStatus }[]
): number | null {
  return forms.find((form) => form.status === "not_started")?.examNumber ?? null;
}
