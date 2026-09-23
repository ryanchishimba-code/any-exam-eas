import type { SessionAttemptDraft } from "@/lib/learning/session-attempt-plan";

/**
 * Practice-band line shared by the week plan and the exam-sim results panel.
 * Never a licensure or pass claim.
 */
export const FULL_EXAM_PRACTICE_DISCLAIMER =
  "A simulation score is a practice band, not a licensure result.";

const EPHEMERAL_SUBJECTS = new Set(["", "__mixed__"]);

export type FullExamAnswerLike = {
  questionIndex: number;
  questionId?: string;
  selected: string;
  correct: boolean;
  flagged?: boolean;
  eliminated?: string[];
  notes?: string;
  topicCategory?: string;
  answeredAt: string;
};

export type FullExamSnapshotLike = {
  id: string;
  question?: string;
  topicCategory?: string;
};

/**
 * Client submit payload. Null when the body omitted the log so the caller
 * can keep answers already stored on the session.
 */
export function parseFullExamAnswerLog(raw: unknown): FullExamAnswerLike[] | null {
  if (!Array.isArray(raw)) return null;
  const out: FullExamAnswerLike[] = [];
  for (const row of raw) {
    if (!row || typeof row !== "object") continue;
    const rec = row as Partial<FullExamAnswerLike>;
    if (typeof rec.questionIndex !== "number" || !Number.isFinite(rec.questionIndex)) continue;
    const selected = typeof rec.selected === "string" ? rec.selected.trim() : "";
    const questionId = typeof rec.questionId === "string" ? rec.questionId.trim() : "";
    if (!selected || !questionId) continue;
    const eliminated = Array.isArray(rec.eliminated)
      ? rec.eliminated.filter((item): item is string => typeof item === "string")
      : undefined;
    out.push({
      questionIndex: rec.questionIndex,
      questionId,
      selected,
      correct: rec.correct === true,
      flagged: rec.flagged === true,
      eliminated,
      notes: typeof rec.notes === "string" ? rec.notes : undefined,
      topicCategory: typeof rec.topicCategory === "string" ? rec.topicCategory : undefined,
      answeredAt:
        typeof rec.answeredAt === "string" && rec.answeredAt.trim()
          ? rec.answeredAt
          : new Date(0).toISOString(),
    });
  }
  return out;
}

export function snapshotsFromAnalysis(analysis: unknown): FullExamSnapshotLike[] {
  if (!analysis || typeof analysis !== "object") return [];
  const raw = (analysis as { questionSnapshots?: unknown }).questionSnapshots;
  if (!Array.isArray(raw)) return [];
  const out: FullExamSnapshotLike[] = [];
  for (const row of raw) {
    if (!row || typeof row !== "object") continue;
    const id = (row as { id?: unknown }).id;
    if (typeof id !== "string" || !id.trim()) continue;
    const question = (row as { question?: unknown }).question;
    const topicCategory = (row as { topicCategory?: unknown }).topicCategory;
    out.push({
      id: id.trim(),
      question: typeof question === "string" ? question : undefined,
      topicCategory: typeof topicCategory === "string" ? topicCategory : undefined,
    });
  }
  return out;
}

/** Answered simulation items, in question order, ready for QuestionAttempt. */
export function draftsFromFullExamAnswers(params: {
  answers: FullExamAnswerLike[];
  snapshots?: FullExamSnapshotLike[];
}): SessionAttemptDraft[] {
  const snapshots = new Map((params.snapshots ?? []).map((snap) => [snap.id, snap]));
  const seen = new Set<string>();
  const drafts: SessionAttemptDraft[] = [];
  const ordered = [...params.answers].sort((a, b) => a.questionIndex - b.questionIndex);

  for (const answer of ordered) {
    const questionKey = answer.questionId?.trim() ?? "";
    if (!questionKey || !answer.selected.trim() || seen.has(questionKey)) continue;
    seen.add(questionKey);
    const snap = snapshots.get(questionKey);
    const subjectRaw = (answer.topicCategory || snap?.topicCategory || "").trim();
    drafts.push({
      questionKey,
      bankItemId: questionKey,
      subjectId:
        subjectRaw && !EPHEMERAL_SUBJECTS.has(subjectRaw) ? subjectRaw : undefined,
      questionType: "multiple_choice",
      stemPreview: snap?.question?.slice(0, 200),
      correct: answer.correct === true,
      selectedAnswer: answer.selected,
    });
  }

  return drafts;
}

export function countFullExamMisses(drafts: SessionAttemptDraft[]): number {
  return drafts.reduce((count, draft) => count + (draft.correct ? 0 : 1), 0);
}

export function analysisWithAnsweredCount(
  analysis: unknown,
  answeredCount: number
): Record<string, unknown> {
  const base =
    analysis && typeof analysis === "object" && !Array.isArray(analysis)
      ? { ...(analysis as Record<string, unknown>) }
      : {};
  return {
    ...base,
    answeredCount: Math.max(0, Math.round(answeredCount) || 0),
    passPathPersisted: true,
  };
}

/** True only after this completion wrote QuestionAttempt rows. */
export function examPassPathPersisted(analysis: unknown): boolean {
  if (!analysis || typeof analysis !== "object") return false;
  return (analysis as { passPathPersisted?: unknown }).passPathPersisted === true;
}

/** Stored answered count when this completion wrote one. Otherwise null. */
export function examSimAnsweredCount(analysis: unknown): number | null {
  if (!analysis || typeof analysis !== "object") return null;
  const value = (analysis as { answeredCount?: unknown }).answeredCount;
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) return null;
  return Math.round(value);
}

/**
 * Length used for the optional exam-sim trend.
 * Completions that recorded answeredCount use that. Older rows keep the
 * planned questionCount stored on the session. The week-plan Done today tick
 * does not use this fallback — see examSimDoneTodayAnswerCount.
 */
export function examSimQualifyingQuestionCount(session: {
  questionCount: number;
  analysis?: unknown;
}): number {
  return examSimAnsweredCount(session.analysis) ?? session.questionCount;
}

/**
 * Saved-answer count for the week Exam simulation tick.
 * Planned session length is never a source. Ending a 50-question set after
 * fewer saved answers must stay under the 50-answer bar.
 *
 * The scored answer log and linked QuestionAttempt rows outvote
 * analysis.answeredCount. When both of those exist, the smaller count wins
 * so a planned-length stamp cannot mark the day done.
 */
export function examSimDoneTodayAnswerCount(input: {
  /** Null when this session has no answer log. 0 is an empty log. */
  savedAnswerCount: number | null;
  analysis?: unknown;
  /** QuestionAttempt rows whose sessionId is this exam session. Null if not counted. */
  linkedAttemptCount?: number | null;
}): number {
  const sources: number[] = [];
  const saved = nonNegativeInt(input.savedAnswerCount);
  const linked = nonNegativeInt(input.linkedAttemptCount ?? null);
  if (saved != null && saved > 0) sources.push(saved);
  if (linked != null && linked > 0) sources.push(linked);
  if (sources.length > 0) return Math.min(...sources);
  if (saved === 0) return 0;
  return examSimAnsweredCount(input.analysis) ?? 0;
}

function nonNegativeInt(value: number | null): number | null {
  if (value == null || typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    return null;
  }
  return Math.round(value);
}

/** Cell mode for a simulation. Untimed sets stay on the tutor window. */
export function fullExamStudyMode(analysis: unknown): "mock" | "tutor" {
  if (!analysis || typeof analysis !== "object") return "mock";
  const timed = (analysis as { sessionConfig?: { timed?: unknown } }).sessionConfig?.timed;
  return timed === false ? "tutor" : "mock";
}

export function fullExamPassPathCopy(input: {
  missCount: number;
  /** False for simulations finished before answers were written to QuestionAttempt. */
  persisted: boolean;
}): {
  disclaimer: string;
  title: string;
  detail: string;
  reviewCta: string | null;
  proofCta: string;
} {
  if (!input.persisted) {
    return {
      disclaimer: FULL_EXAM_PRACTICE_DISCLAIMER,
      title: "Practice simulation",
      detail:
        "This result was saved before simulation misses were added to Review incorrect. New simulations add their misses there.",
      reviewCta: "Review incorrect",
      proofCta: "Readiness proof",
    };
  }
  const misses = Math.max(0, Math.round(input.missCount) || 0);
  if (misses === 0) {
    return {
      disclaimer: FULL_EXAM_PRACTICE_DISCLAIMER,
      title: "No misses from this simulation",
      detail:
        "Review incorrect and open remediations stay as they were. Refresh the dashboard to see readiness proof.",
      reviewCta: null,
      proofCta: "Readiness proof",
    };
  }
  const noun = misses === 1 ? "miss is" : "misses are";
  return {
    disclaimer: FULL_EXAM_PRACTICE_DISCLAIMER,
    title: `${misses} ${noun} in Review incorrect`,
    detail:
      "Saved with your other open remediations. Refresh the dashboard to see readiness proof update from these answers.",
    reviewCta: "Review incorrect",
    proofCta: "Readiness proof",
  };
}
