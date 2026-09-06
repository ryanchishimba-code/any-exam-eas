/**
 * Skill Cell state transitions.
 *
 * unseen → primed → learning → shaky | stable → exam_ready
 *
 * Defaults:
 * - unseen: never touched
 * - primed: < 5 items answered in cell
 * - learning: answering, below bar
 * - stable: last 12 tutor items in cell ≥ 75% across ≥ 2 sessions
 * - exam_ready: stable AND last 8 timed items in cell ≥ 70%
 * - shaky: last 8 items < 65%
 */

import type {
  CellState,
  RecentItemOutcome,
  StudyItemMode,
  UserCellStateSnapshot,
} from "./types";

const PRIMED_MAX = 4; // < 5 → primed
const STABLE_TUTOR_N = 12;
const STABLE_TUTOR_PCT = 0.75;
const STABLE_MIN_SESSIONS = 2;
const EXAM_READY_TIMED_N = 8;
const EXAM_READY_TIMED_PCT = 0.7;
const SHAKY_N = 8;
const SHAKY_PCT = 0.65;

function accuracy(outcomes: RecentItemOutcome[]): number | null {
  if (outcomes.length === 0) return null;
  const correct = outcomes.filter((o) => o.correct).length;
  return correct / outcomes.length;
}

function lastN<T>(arr: T[], n: number): T[] {
  return arr.slice(-n);
}

function sessionCount(outcomes: RecentItemOutcome[]): number {
  const days = new Set(
    outcomes.map((o) => new Date(o.at).toISOString().slice(0, 10))
  );
  return days.size;
}

export function deriveCellState(input: {
  itemsAnswered: number;
  recentTutor: RecentItemOutcome[];
  recentTimed: RecentItemOutcome[];
}): CellState {
  const { itemsAnswered, recentTutor, recentTimed } = input;
  if (itemsAnswered <= 0) return "unseen";
  if (itemsAnswered < 5) return "primed";

  const last8Any = lastN([...recentTutor, ...recentTimed].sort((a, b) => a.at - b.at), SHAKY_N);
  const last8Acc = accuracy(last8Any);
  if (last8Any.length >= SHAKY_N && last8Acc !== null && last8Acc < SHAKY_PCT) {
    return "shaky";
  }

  const tutorWindow = lastN(recentTutor, STABLE_TUTOR_N);
  const tutorAcc = accuracy(tutorWindow);
  const stable =
    tutorWindow.length >= STABLE_TUTOR_N &&
    tutorAcc !== null &&
    tutorAcc >= STABLE_TUTOR_PCT &&
    sessionCount(tutorWindow) >= STABLE_MIN_SESSIONS;

  if (stable) {
    const timedWindow = lastN(recentTimed, EXAM_READY_TIMED_N);
    const timedAcc = accuracy(timedWindow);
    if (
      timedWindow.length >= EXAM_READY_TIMED_N &&
      timedAcc !== null &&
      timedAcc >= EXAM_READY_TIMED_PCT
    ) {
      return "exam_ready";
    }
    return "stable";
  }

  return "learning";
}

export function applyAttemptToCellState(
  prev: UserCellStateSnapshot,
  outcome: { correct: boolean; mode: StudyItemMode; at?: number }
): UserCellStateSnapshot {
  const at = outcome.at ?? Date.now();
  const entry: RecentItemOutcome = {
    correct: outcome.correct,
    mode: outcome.mode,
    at,
  };

  const recentTutor =
    outcome.mode === "tutor"
      ? [...prev.recentTutor, entry].slice(-20)
      : prev.recentTutor;
  const recentTimed =
    outcome.mode === "timed"
      ? [...prev.recentTimed, entry].slice(-20)
      : prev.recentTimed;

  const itemsAnswered = prev.itemsAnswered + 1;
  const state = deriveCellState({ itemsAnswered, recentTutor, recentTimed });

  return {
    cellKey: prev.cellKey,
    state,
    itemsAnswered,
    recentTutor,
    recentTimed,
    lastSessionAt: at,
  };
}

export function emptyCellState(cellKey: string): UserCellStateSnapshot {
  return {
    cellKey,
    state: "unseen",
    itemsAnswered: 0,
    recentTutor: [],
    recentTimed: [],
    lastSessionAt: null,
  };
}

/** Map cell state → DomainMap readiness key for coloring. */
export function cellStateToRoadmapKey(
  state: CellState
): "strong" | "needs_review" | "needs_more_work" {
  switch (state) {
    case "exam_ready":
      return "strong";
    case "stable":
      return "needs_review";
    default:
      return "needs_more_work";
  }
}

export function cellStateLabel(state: CellState): string {
  switch (state) {
    case "unseen":
      return "Unseen";
    case "primed":
      return "Primed";
    case "learning":
      return "Learning";
    case "shaky":
      return "Shaky";
    case "stable":
      return "Stable";
    case "exam_ready":
      return "Exam ready";
  }
}
