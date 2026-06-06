/** Local autosave for MPJE practice exam — survives refresh; cleared on submit. */

export type MpjeExamAutosave = {
  examId: string;
  stateCode: string;
  index: number;
  answers: Record<string, string>;
  flagged: number[];
  secondsLeft: number;
  phase: "exam" | "review";
  savedAt: string;
};

const PREFIX = "mpje-practice-exam:";

export function autosaveKey(examId: string): string {
  return `${PREFIX}${examId}`;
}

export function loadMpjeExamAutosave(examId: string): MpjeExamAutosave | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(autosaveKey(examId));
    if (!raw) return null;
    return JSON.parse(raw) as MpjeExamAutosave;
  } catch {
    return null;
  }
}

export function saveMpjeExamAutosave(payload: MpjeExamAutosave): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(autosaveKey(payload.examId), JSON.stringify(payload));
  } catch {
    /* quota exceeded — non-fatal */
  }
}

export function clearMpjeExamAutosave(examId: string): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(autosaveKey(examId));
}
