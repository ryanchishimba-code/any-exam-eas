/**
 * Board-generic remediation mastery.
 *
 * One state machine for every exam field (nursing/NCLEX first, same primitives
 * for USMLE, NAPLEX, PANCE, AANP FNP, NPTE-PT). No board-specific branch.
 *
 * A missed item stays in Review incorrect and in the open-remediation count
 * until either:
 *   (a) a correct attempt, then a later-session correct after at least
 *       SPACED_REPROOF_MIN_DAYS or SPACED_REPROOF_MIN_INTERVENING other
 *       attempts, or
 *   (b) an explicit confirmed mark-mastered dated after the latest miss.
 *
 * One correct — including an immediate retest in the same sitting — leaves
 * the item pending re-proof. It does not clear the queue.
 */

import { MIXED_SUBJECT_ID } from "@/lib/edtech/practice-links-core";
import { isInternalMasteryConceptKey } from "@/lib/learning/concept-labels";
import {
  isOtherOpenSubject,
  isUntaggedOpenSubject,
} from "@/lib/learning/other-open-subject";

/** Days after the first post-miss correct before a re-ask can clear the item. */
export const SPACED_REPROOF_MIN_DAYS = 1;
/** Other attempts after that correct that also open the re-ask, whichever comes first. */
export const SPACED_REPROOF_MIN_INTERVENING = 20;

const DAY_MS = 24 * 60 * 60 * 1000;

export const REMEDIATION_MASTERY_RULE =
  "One correct answer does not clear a miss. It stays in Review incorrect as pending re-proof until you get it right again after at least 1 day or 20 other questions. You can also mark it mastered after you confirm.";

export type ItemMasteryStatus = "open" | "pending_reproof" | "cleared";

export type MasteryAttempt = {
  bankItemId?: string | null;
  questionKey?: string | null;
  correct: boolean;
  createdAt?: Date | string | number | null;
  sessionId?: string | null;
  subjectId?: string | null;
};

export type MasteryMark = {
  itemId: string;
  confirmedAt: Date | string | number;
};

export type RemediationItemState = {
  itemId: string;
  status: Exclude<ItemMasteryStatus, "cleared">;
  subjectId: string | null;
  /** Pending item whose spacing window is already open. */
  reproofDue: boolean;
  lastMissAt: number | null;
};

export type RemediationMasterySummary = {
  items: RemediationItemState[];
  /** Still missed plus pending re-proof. Cleared items are omitted. */
  totalOpen: number;
  pendingReproof: number;
  stillMissed: number;
};

/** Stable bank identity, or null when the row cannot be re-drilled. */
export function attemptItemId(row: {
  bankItemId?: string | null;
  questionKey?: string | null;
}): string | null {
  const id = row.bankItemId || row.questionKey;
  if (!id) return null;
  if (!row.bankItemId && /^\d+$/.test(id)) return null;
  return id;
}

function toTime(value: Date | string | number | null | undefined): number | null {
  if (value == null) return null;
  if (value instanceof Date) {
    const time = value.getTime();
    return Number.isFinite(time) ? time : null;
  }
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  const time = Date.parse(value);
  return Number.isFinite(time) ? time : null;
}

function usableSubject(subjectId: string | null | undefined): string | null {
  const subject = subjectId?.trim();
  if (!subject || subject === MIXED_SUBJECT_ID) return null;
  if (isInternalMasteryConceptKey(subject)) return null;
  return subject;
}

type Track = {
  status: ItemMasteryStatus;
  subjectId: string | null;
  lastMissAt: number | null;
  proofAt: number | null;
  proofSessionId: string | null;
  intervening: number;
};

function emptyTrack(): Track {
  return {
    status: "open",
    subjectId: null,
    lastMissAt: null,
    proofAt: null,
    proofSessionId: null,
    intervening: 0,
  };
}

function spacingMet(track: Track, at: number | null): boolean {
  const daysOk =
    track.proofAt != null &&
    at != null &&
    at - track.proofAt >= SPACED_REPROOF_MIN_DAYS * DAY_MS;
  return daysOk || track.intervening >= SPACED_REPROOF_MIN_INTERVENING;
}

function laterSitting(track: Track, sessionId: string | null | undefined): boolean {
  if (!track.proofSessionId || !sessionId) return true;
  return sessionId !== track.proofSessionId;
}

/**
 * Classify every missed item. Attempts are ordered by time when timestamps
 * exist, otherwise by input order. Intervening items are other attempts
 * after the first post-miss correct.
 */
export function summarizeRemediationMastery(params: {
  attempts: MasteryAttempt[];
  marks?: MasteryMark[];
  now?: Date | string | number;
}): RemediationMasterySummary {
  const decorated = params.attempts.map((row, index) => ({ row, index }));
  decorated.sort((a, b) => {
    const left = toTime(a.row.createdAt);
    const right = toTime(b.row.createdAt);
    if (left != null && right != null && left !== right) return left - right;
    if (left != null && right == null) return -1;
    if (left == null && right != null) return 1;
    return a.index - b.index;
  });

  const tracks = new Map<string, Track>();
  const pendingIds = new Set<string>();

  for (const { row } of decorated) {
    const id = attemptItemId(row);
    const at = toTime(row.createdAt);
    const subject = usableSubject(row.subjectId);

    if (id) {
      let track = tracks.get(id);
      if (!row.correct) {
        if (!track) {
          track = emptyTrack();
          tracks.set(id, track);
        }
        track.status = "open";
        track.lastMissAt = at ?? track.lastMissAt;
        track.proofAt = null;
        track.proofSessionId = null;
        track.intervening = 0;
        if (subject) track.subjectId = subject;
        pendingIds.delete(id);
      } else if (track?.status === "open") {
        track.status = "pending_reproof";
        track.proofAt = at;
        track.proofSessionId = row.sessionId?.trim() || null;
        track.intervening = 0;
        if (!track.subjectId && subject) track.subjectId = subject;
        pendingIds.add(id);
      } else if (track?.status === "pending_reproof") {
        const sessionId = row.sessionId?.trim() || null;
        if (laterSitting(track, sessionId) && spacingMet(track, at)) {
          track.status = "cleared";
          track.proofAt = null;
          track.proofSessionId = null;
          track.intervening = 0;
          pendingIds.delete(id);
        }
        if (!track.subjectId && subject) track.subjectId = subject;
      } else if (track && !track.subjectId && subject) {
        track.subjectId = subject;
      }
    }

    for (const otherId of pendingIds) {
      if (otherId === id) continue;
      const track = tracks.get(otherId);
      if (track?.status === "pending_reproof") track.intervening += 1;
    }
  }

  for (const mark of params.marks ?? []) {
    const itemId = mark.itemId.trim();
    if (!itemId) continue;
    const track = tracks.get(itemId);
    if (!track || track.status === "cleared") continue;
    const confirmedAt = toTime(mark.confirmedAt);
    if (confirmedAt == null) continue;
    if (track.lastMissAt != null && confirmedAt < track.lastMissAt) continue;
    track.status = "cleared";
    pendingIds.delete(itemId);
  }

  const nowTs = toTime(params.now) ?? Date.now();
  const items: RemediationItemState[] = [];
  let pendingReproof = 0;
  let stillMissed = 0;

  for (const [itemId, track] of tracks) {
    if (track.status === "cleared") continue;
    const reproofDue =
      track.status === "pending_reproof" &&
      ((track.proofAt != null && nowTs - track.proofAt >= SPACED_REPROOF_MIN_DAYS * DAY_MS) ||
        track.intervening >= SPACED_REPROOF_MIN_INTERVENING);
    if (track.status === "pending_reproof") pendingReproof += 1;
    else stillMissed += 1;
    items.push({
      itemId,
      status: track.status,
      subjectId: track.subjectId,
      reproofDue,
      lastMissAt: track.lastMissAt,
    });
  }

  return {
    items,
    totalOpen: items.length,
    pendingReproof,
    stillMissed,
  };
}

function queueRank(item: RemediationItemState): number {
  if (item.status === "pending_reproof" && item.reproofDue) return 0;
  if (item.status === "open") return 1;
  return 2;
}

/** Review incorrect queue: due re-proofs, then still-missed, then not-yet-due. */
export function selectReviewQueueIds(params: {
  attempts: MasteryAttempt[];
  marks?: MasteryMark[];
  subjectId?: string | null;
  limit?: number;
  now?: Date | string | number;
}): string[] {
  const limit = Math.min(Math.max(params.limit ?? 100, 1), 300);
  const untaggedOnly = isOtherOpenSubject(params.subjectId);
  const subject =
    params.subjectId && params.subjectId !== MIXED_SUBJECT_ID && !untaggedOnly
      ? params.subjectId
      : null;
  const summary = summarizeRemediationMastery({
    attempts: params.attempts,
    marks: params.marks,
    now: params.now,
  });
  const ranked = summary.items
    .filter((item) =>
      untaggedOnly ? isUntaggedOpenSubject(item.subjectId) : !subject || item.subjectId === subject
    )
    .sort((a, b) => {
      const rank = queueRank(a) - queueRank(b);
      if (rank !== 0) return rank;
      const left = a.lastMissAt ?? -1;
      const right = b.lastMissAt ?? -1;
      if (left !== right) return right - left;
      return a.itemId.localeCompare(b.itemId);
    });
  return ranked.slice(0, limit).map((item) => item.itemId);
}

export function countOpenIncorrectItems(
  attempts: MasteryAttempt[],
  options?: { marks?: MasteryMark[]; now?: Date | string | number }
): number {
  return summarizeRemediationMastery({
    attempts,
    marks: options?.marks,
    now: options?.now,
  }).totalOpen;
}
