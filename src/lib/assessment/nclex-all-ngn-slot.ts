import type { NgnCase, NgnItem } from "@/lib/assessment/types";
import type { StudyQuestion } from "@/lib/questions/types";

/** Marker copied through the student layout allow-list. */
export const NCLEX_ALL_NGN_ITEM_FORMAT = "nclex-all-ngn";

/**
 * Bank-pace timed mode budgets 45 seconds a scored item today.
 * A mixed session uses that budget as one timer so a case is not revealed mid-way.
 */
export const NCLEX_ALL_NGN_BANK_PACE_SECONDS = 45;

export type NclexAllNgnRole = "case" | "standalone";

export type NclexAllNgnCaseData = {
  role: NclexAllNgnRole;
  subjectId?: string | null;
  clientNeedId?: string | null;
  item: NgnItem;
  caseItems?: NgnItem[];
  caseDoc?: NgnCase | null;
  sourcesById?: Record<string, { title: string; url: string }>;
};

export type NclexAllNgnSlot = {
  role: NclexAllNgnRole;
  setId: string | null;
  stepIndex: number;
  totalSteps: number;
  item: NgnItem;
  caseItems: NgnItem[];
  caseDoc: NgnCase | null;
  sourcesById: Record<string, { title: string; url: string }>;
  subjectId: string | null;
  clientNeedId: string | null;
};

export type NclexAllNgnCommit = "qbi" | "advance" | "reveal-item" | "reveal-case";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readItem(value: unknown): NgnItem | null {
  if (!isRecord(value)) return null;
  if (typeof value.id !== "string" || !value.id.trim()) return null;
  if (typeof value.version !== "number" || !Number.isInteger(value.version)) return null;
  if (typeof value.stem !== "string") return null;
  if (typeof value.responseFormat !== "string") return null;
  return value as NgnItem;
}

/** Student question produced by the All-questions mix, or null for a normal bank item. */
export function readNclexAllNgnSlot(question: {
  ngnPayload?: Record<string, unknown> | null;
}): NclexAllNgnSlot | null {
  const payload = question.ngnPayload;
  if (!payload || payload.itemFormat !== NCLEX_ALL_NGN_ITEM_FORMAT) return null;
  const data = payload.caseData;
  if (!isRecord(data)) return null;
  if (data.role !== "case" && data.role !== "standalone") return null;
  const item = readItem(data.item);
  if (!item) return null;
  const caseItems = Array.isArray(data.caseItems)
    ? data.caseItems.map(readItem).filter((entry): entry is NgnItem => entry != null)
    : [];
  const stepIndex =
    typeof payload.stepIndex === "number" && payload.stepIndex > 0 ? payload.stepIndex : 1;
  const totalSteps =
    data.role === "case"
      ? typeof payload.totalSteps === "number" && payload.totalSteps > 0
        ? payload.totalSteps
        : 6
      : 1;
  return {
    role: data.role,
    setId: typeof payload.setId === "string" ? payload.setId : null,
    stepIndex,
    totalSteps,
    item,
    caseItems: caseItems.length > 0 ? caseItems : [item],
    caseDoc: isRecord(data.caseDoc) ? (data.caseDoc as NgnCase) : null,
    sourcesById: isRecord(data.sourcesById)
      ? (data.sourcesById as Record<string, { title: string; url: string }>)
      : {},
    subjectId: typeof data.subjectId === "string" ? data.subjectId : null,
    clientNeedId: typeof data.clientNeedId === "string" ? data.clientNeedId : null,
  };
}

export function sessionIncludesNclexAllNgn(
  questions: readonly { ngnPayload?: Record<string, unknown> | null }[]
): boolean {
  return questions.some((question) => readNclexAllNgnSlot(question) != null);
}

/**
 * What Check does for the current scored item.
 * Timed bank pace withholds every reveal until the session timer ends.
 * An untimed case reveals only on its last step.
 */
export function nclexAllNgnCommitKind(params: {
  slot: Pick<NclexAllNgnSlot, "role" | "stepIndex" | "totalSteps"> | null;
  withholdReveal: boolean;
}): NclexAllNgnCommit {
  if (params.withholdReveal) return "advance";
  if (!params.slot) return "qbi";
  if (params.slot.role === "standalone") return "reveal-item";
  if (params.slot.stepIndex >= params.slot.totalSteps) return "reveal-case";
  return "advance";
}

export function encodeNgnStoredResponse(
  response: unknown,
  grade?: { points: number; maxPoints: number }
): string {
  return JSON.stringify(
    grade
      ? { response, points: grade.points, maxPoints: grade.maxPoints }
      : { response }
  );
}

export function decodeNgnStoredResponse(selected: string[] | undefined): unknown {
  const raw = selected?.[0];
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as { response?: unknown };
    if (parsed && typeof parsed === "object" && "response" in parsed) return parsed.response;
    return parsed;
  } catch {
    return raw;
  }
}

export function caseQuestionsForSet(questions: readonly StudyQuestion[], setId: string | null): StudyQuestion[] {
  if (!setId) return [];
  return questions
    .filter((question) => readNclexAllNgnSlot(question)?.setId === setId)
    .sort(
      (a, b) =>
        (readNclexAllNgnSlot(a)?.stepIndex ?? 0) - (readNclexAllNgnSlot(b)?.stepIndex ?? 0)
    );
}

export function bankPaceSessionSeconds(scoredItems: number): number {
  return Math.max(1, scoredItems) * NCLEX_ALL_NGN_BANK_PACE_SECONDS;
}
