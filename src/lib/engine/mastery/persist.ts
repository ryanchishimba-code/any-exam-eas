/**
 * Persist UserCellState — Prisma-backed.
 */

import { prisma } from "@/lib/prisma";
import { emptyCellState, applyAttemptToCellState } from "./transitions";
import type {
  RecentItemOutcome,
  StudyItemMode,
  UserCellStateSnapshot,
} from "./types";

function parseRecent(raw: string | null | undefined): RecentItemOutcome[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as RecentItemOutcome[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function rowToSnapshot(row: {
  cellKey: string;
  state: string;
  itemsAnswered: number;
  recentTutorJson: string;
  recentTimedJson: string;
  lastSessionAt: Date | null;
}): UserCellStateSnapshot {
  return {
    cellKey: row.cellKey,
    state: row.state as UserCellStateSnapshot["state"],
    itemsAnswered: row.itemsAnswered,
    recentTutor: parseRecent(row.recentTutorJson),
    recentTimed: parseRecent(row.recentTimedJson),
    lastSessionAt: row.lastSessionAt?.getTime() ?? null,
  };
}

export async function loadUserCellStates(
  userId: string,
  examSlug: string
): Promise<Map<string, UserCellStateSnapshot>> {
  const rows = await prisma.userCellState.findMany({
    where: { userId, examSlug },
  });
  const map = new Map<string, UserCellStateSnapshot>();
  for (const row of rows) {
    map.set(row.cellKey, rowToSnapshot(row));
  }
  return map;
}

export async function loadUserCellState(
  userId: string,
  examSlug: string,
  cellKey: string
): Promise<UserCellStateSnapshot> {
  const row = await prisma.userCellState.findUnique({
    where: { userId_examSlug_cellKey: { userId, examSlug, cellKey } },
  });
  return row ? rowToSnapshot(row) : emptyCellState(cellKey);
}

export async function recordCellAttempt(input: {
  userId: string;
  examSlug: string;
  cellKey: string;
  systemKey: string;
  topicKey: string;
  correct: boolean;
  mode: StudyItemMode;
}): Promise<UserCellStateSnapshot> {
  const prev = await loadUserCellState(input.userId, input.examSlug, input.cellKey);
  const next = applyAttemptToCellState(prev, {
    correct: input.correct,
    mode: input.mode,
  });

  await prisma.userCellState.upsert({
    where: {
      userId_examSlug_cellKey: {
        userId: input.userId,
        examSlug: input.examSlug,
        cellKey: input.cellKey,
      },
    },
    create: {
      userId: input.userId,
      examSlug: input.examSlug,
      cellKey: input.cellKey,
      systemKey: input.systemKey,
      topicKey: input.topicKey,
      state: next.state,
      itemsAnswered: next.itemsAnswered,
      recentTutorJson: JSON.stringify(next.recentTutor),
      recentTimedJson: JSON.stringify(next.recentTimed),
      lastSessionAt: next.lastSessionAt ? new Date(next.lastSessionAt) : null,
    },
    update: {
      state: next.state,
      itemsAnswered: next.itemsAnswered,
      recentTutorJson: JSON.stringify(next.recentTutor),
      recentTimedJson: JSON.stringify(next.recentTimed),
      lastSessionAt: next.lastSessionAt ? new Date(next.lastSessionAt) : null,
      systemKey: input.systemKey,
      topicKey: input.topicKey,
    },
  });

  return next;
}
