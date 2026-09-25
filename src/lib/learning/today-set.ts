/**
 * Board-generic "today's set".
 *
 * One composer for every exam. Callers pass the open-remediation ids (the
 * same Review incorrect queue the dashboard counts), due spaced-review ids,
 * and unseen items with blueprint weights. Nothing here branches on NCLEX.
 *
 * The streak is days the daily set was finished or the question target was
 * met. It is not added to LearningProfile.studyStreakDays. That profile
 * streak already moves on any saved attempt, so summing the two would
 * double-count the same day.
 *
 * Review (open remediation, then spaced review) is capped at
 * TODAY_REVIEW_MAX_SHARE of the set so a long miss list still leaves room
 * for new questions. If new items run short, leftover review fills those
 * slots. If both run short, the set is shorter.
 */

import { QUESTION_BANK_MAX_COUNT } from "@/lib/exam/modes";
import { parseMetadataObject } from "@/lib/onboarding/tour-record";

export const TODAY_SET_DEFAULT_SIZE = 25;

/**
 * Combined open-remediation and spaced-review share of a daily set.
 * The rest is reserved for new questions when the bank has them.
 * 0.6 of the default 25 is 15 review and 10 new.
 */
export const TODAY_REVIEW_MAX_SHARE = 0.6;

const HABIT_DAY_CAP = 120;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export type TodaySetSizeInput = {
  /** Explicit per-day question goal, when the account has one. */
  dailyGoal?: number | null;
  /** Week-plan question target, when that plan stores one. */
  weekGoal?: number | null;
  /** Exam-date plan's daily size, when that plan exists. */
  examDatePlanSize?: number | null;
};

export type TodayNewCandidate = {
  id: string;
  /** Blueprint share. Higher is more likely to be drawn. Non-positive still fills last. */
  weight: number;
};

export type TodaySetComposition = {
  requestedSize: number;
  ids: string[];
  reviewIncorrectIds: string[];
  spacedReviewIds: string[];
  newIds: string[];
  reviewCount: number;
  newCount: number;
  mixLine: string | null;
};

export type DailyGoalProgress = {
  done: number;
  target: number;
  met: boolean;
  /** 0–1 stroke. Capped so the ring does not wrap. The label still shows `done`. */
  ring: number;
};

export type HabitDay = {
  date: string;
  completedSet?: boolean;
  targetMet?: boolean;
};

export type TodaySetOutcome = {
  topicId: string;
  topicLabel: string;
  correct: boolean;
  answered: boolean;
};

export type WeakestTopic = {
  topicId: string;
  topicLabel: string;
  misses: number;
  attempts: number;
};

function positiveSize(value: number | null | undefined): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  const rounded = Math.round(value);
  if (rounded < 1) return null;
  return Math.min(QUESTION_BANK_MAX_COUNT, rounded);
}

/**
 * Daily goal, then week goal, then exam-date plan size. Otherwise 25.
 * A missing or non-positive setting is skipped. It is never treated as zero
 * questions.
 */
export function resolveTodaySetSize(input?: TodaySetSizeInput | null): number {
  const chosen =
    positiveSize(input?.dailyGoal) ??
    positiveSize(input?.weekGoal) ??
    positiveSize(input?.examDatePlanSize);
  return chosen ?? TODAY_SET_DEFAULT_SIZE;
}

/**
 * How many review questions to place before new ones.
 * Rounded to the nearest question. A default set of 25 reserves 15;
 * a set of 10 reserves 6.
 */
export function todayReviewSlotCap(size: number): number {
  if (!Number.isFinite(size) || size <= 0) return 0;
  const requested = Math.max(0, Math.round(size));
  if (requested <= 0) return 0;
  const cap = Math.round(requested * TODAY_REVIEW_MAX_SHARE);
  return Math.min(requested, Math.max(0, cap));
}

/**
 * Unseen items to load so the review cap cannot crowd out new questions.
 * `reviewAvailable` is the deduped open-remediation plus spaced-review count.
 */
export function todayUnseenNeeded(size: number, reviewAvailable: number): number {
  const requested = Number.isFinite(size) ? Math.max(0, Math.round(size)) : 0;
  const available = Number.isFinite(reviewAvailable) ? Math.max(0, Math.floor(reviewAvailable)) : 0;
  const firstPass = Math.min(available, todayReviewSlotCap(requested));
  return Math.max(0, requested - firstPass);
}

/** Cap a resolved size by a remaining question allowance. Null means unlimited. */
export function applyQuestionAllowance(
  size: number,
  allowance: number | null | undefined
): number {
  const base = Number.isFinite(size) ? Math.max(0, Math.round(size)) : 0;
  if (allowance == null || !Number.isFinite(allowance)) return base;
  return Math.max(0, Math.min(base, Math.floor(allowance)));
}

export function questionAllowanceFromUsage(snapshot: {
  remainingToday: number | null;
  remainingTrialTotal: number | null;
} | null): number | null {
  if (!snapshot) return null;
  const caps = [snapshot.remainingToday, snapshot.remainingTrialTotal].filter(
    (value): value is number => typeof value === "number" && Number.isFinite(value)
  );
  if (caps.length === 0) return null;
  return Math.min(...caps);
}

export function formatTodayMixLine(reviewCount: number, newCount: number): string | null {
  const review = Math.max(0, Math.floor(Number.isFinite(reviewCount) ? reviewCount : 0));
  const fresh = Math.max(0, Math.floor(Number.isFinite(newCount) ? newCount : 0));
  if (review === 0 && fresh === 0) return null;
  const parts: string[] = [];
  if (review > 0) parts.push(`${review} to review`);
  if (fresh > 0) parts.push(`${fresh} new`);
  return parts.join(" · ");
}

function dedupeIds(ids: readonly string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const id of ids) {
    const trimmed = id.trim();
    if (!trimmed || seen.has(trimmed)) continue;
    seen.add(trimmed);
    out.push(trimmed);
  }
  return out;
}

function weightedSample(
  pool: { id: string; weight: number }[],
  count: number,
  random: () => number
): string[] {
  if (count <= 0 || pool.length === 0) return [];
  const working = pool.slice();
  const picked: string[] = [];
  while (picked.length < count && working.length > 0) {
    let total = 0;
    for (const item of working) total += item.weight;
    let mark = random() * total;
    if (!Number.isFinite(mark) || mark < 0) mark = 0;
    let index = working.length - 1;
    for (let i = 0; i < working.length; i++) {
      mark -= working[i]!.weight;
      if (mark < 0) {
        index = i;
        break;
      }
    }
    const item = working.splice(index, 1)[0];
    if (item) picked.push(item.id);
  }
  return picked;
}

/**
 * Fill a set in order: open remediation, then spaced review that is not
 * already in that queue, then unseen blueprint-weighted items.
 * Review is capped first so new questions keep a share of the set. If new
 * items run short, more review fills the remainder, still with open
 * remediation ahead of spaced review. The result is never longer than
 * `size`, and the mix line counts only ids that were actually chosen.
 */
export function composeTodaySet(input: {
  size: number;
  reviewIncorrectIds: readonly string[];
  spacedReviewIds: readonly string[];
  newCandidates: readonly TodayNewCandidate[];
  random?: () => number;
}): TodaySetComposition {
  const requested = Number.isFinite(input.size) ? Math.max(0, Math.round(input.size)) : 0;
  const random = input.random ?? Math.random;
  const reviewCap = todayReviewSlotCap(requested);

  const openAll = dedupeIds(input.reviewIncorrectIds);
  const seenReview = new Set(openAll);
  const spacedAll: string[] = [];
  for (const id of dedupeIds(input.spacedReviewIds)) {
    if (seenReview.has(id)) continue;
    seenReview.add(id);
    spacedAll.push(id);
  }
  const reviewOrder = [...openAll, ...spacedAll];
  const firstReview = reviewOrder.slice(0, Math.min(reviewCap, requested));
  const firstTaken = new Set(firstReview);

  const pool: { id: string; weight: number }[] = [];
  const seenNew = new Set<string>();
  for (const candidate of input.newCandidates) {
    const id = candidate.id.trim();
    if (!id || seenReview.has(id) || seenNew.has(id)) continue;
    seenNew.add(id);
    const weight =
      Number.isFinite(candidate.weight) && candidate.weight > 0 ? candidate.weight : 0.001;
    pool.push({ id, weight });
  }
  const fresh = weightedSample(pool, requested - firstReview.length, random);

  const shortfall = requested - firstReview.length - fresh.length;
  const backfill =
    shortfall > 0 ? reviewOrder.filter((id) => !firstTaken.has(id)).slice(0, shortfall) : [];
  const selectedReview = new Set([...firstReview, ...backfill]);
  const reviewIncorrect = openAll.filter((id) => selectedReview.has(id));
  const spaced = spacedAll.filter((id) => selectedReview.has(id));
  const reviewCount = reviewIncorrect.length + spaced.length;
  return {
    requestedSize: requested,
    ids: [...reviewIncorrect, ...spaced, ...fresh],
    reviewIncorrectIds: reviewIncorrect,
    spacedReviewIds: spaced,
    newIds: fresh,
    reviewCount,
    newCount: fresh.length,
    mixLine: formatTodayMixLine(reviewCount, fresh.length),
  };
}

/** Drop ids the bank could not load, then recount. Never keeps a missing id in the line. */
export function recountTodayMix(
  composition: TodaySetComposition,
  loadedIds: ReadonlySet<string>
): TodaySetComposition {
  const reviewIncorrectIds = composition.reviewIncorrectIds.filter((id) => loadedIds.has(id));
  const spacedReviewIds = composition.spacedReviewIds.filter((id) => loadedIds.has(id));
  const newIds = composition.newIds.filter((id) => loadedIds.has(id));
  const reviewCount = reviewIncorrectIds.length + spacedReviewIds.length;
  return {
    requestedSize: composition.requestedSize,
    ids: composition.ids.filter((id) => loadedIds.has(id)),
    reviewIncorrectIds,
    spacedReviewIds,
    newIds,
    reviewCount,
    newCount: newIds.length,
    mixLine: formatTodayMixLine(reviewCount, newIds.length),
  };
}

export function dailyGoalProgress(done: number, target: number): DailyGoalProgress {
  const safeDone = Number.isFinite(done) ? Math.max(0, Math.round(done)) : 0;
  const safeTarget = Number.isFinite(target) ? Math.max(0, Math.round(target)) : 0;
  if (safeTarget <= 0) {
    return { done: safeDone, target: 0, met: false, ring: 0 };
  }
  return {
    done: safeDone,
    target: safeTarget,
    met: safeDone >= safeTarget,
    ring: Math.min(1, safeDone / safeTarget),
  };
}

export function utcDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function habitDayQualifies(day: Pick<HabitDay, "completedSet" | "targetMet">): boolean {
  return day.completedSet === true || day.targetMet === true;
}

function shiftUtcDate(iso: string, days: number): string | null {
  if (!DATE_RE.test(iso)) return null;
  const [year, month, day] = iso.split("-").map(Number);
  if (!year || !month || !day) return null;
  const date = new Date(Date.UTC(year, month - 1, day));
  if (Number.isNaN(date.getTime())) return null;
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

/**
 * Consecutive qualifying days ending today, or ending yesterday when today
 * is not done yet. One calendar day counts once even if the set was finished
 * and the target was also met.
 */
export function computeDailyHabitStreak(input: {
  days: readonly HabitDay[];
  today: string;
}): number {
  if (!DATE_RE.test(input.today)) return 0;
  const qualified = new Set<string>();
  for (const day of input.days) {
    if (!DATE_RE.test(day.date) || day.date > input.today) continue;
    if (habitDayQualifies(day)) qualified.add(day.date);
  }
  const start = qualified.has(input.today) ? input.today : shiftUtcDate(input.today, -1);
  if (!start || !qualified.has(start)) return 0;
  let count = 0;
  let cursor: string | null = start;
  while (cursor && qualified.has(cursor)) {
    count += 1;
    cursor = shiftUtcDate(cursor, -1);
  }
  return count;
}

export function weakestTopicFromOutcomes(rows: readonly TodaySetOutcome[]): WeakestTopic | null {
  const byTopic = new Map<string, WeakestTopic>();
  for (const row of rows) {
    if (!row.answered) continue;
    const topicId = row.topicId.trim() || "general";
    const current = byTopic.get(topicId) ?? {
      topicId,
      topicLabel: row.topicLabel.trim() || "This topic",
      misses: 0,
      attempts: 0,
    };
    current.attempts += 1;
    if (!row.correct) current.misses += 1;
    byTopic.set(topicId, current);
  }
  const missed = [...byTopic.values()].filter((row) => row.misses > 0);
  if (missed.length === 0) return null;
  missed.sort((a, b) => {
    if (b.misses !== a.misses) return b.misses - a.misses;
    const accuracyA = (a.attempts - a.misses) / a.attempts;
    const accuracyB = (b.attempts - b.misses) / b.attempts;
    if (accuracyA !== accuracyB) return accuracyA - accuracyB;
    if (b.attempts !== a.attempts) return b.attempts - a.attempts;
    return a.topicLabel.localeCompare(b.topicLabel);
  });
  return missed[0] ?? null;
}

type HabitBoard = { days?: HabitDay[] };
type HabitV1 = { boards?: Record<string, HabitBoard> };

function habitBoards(metadata: unknown): Record<string, HabitBoard> | null {
  const root = parseMetadataObject(metadata);
  const habit = root?.dailyHabit;
  if (!habit || typeof habit !== "object" || Array.isArray(habit)) return null;
  const v1 = (habit as { v1?: unknown }).v1;
  if (!v1 || typeof v1 !== "object" || Array.isArray(v1)) return null;
  const boards = (v1 as HabitV1).boards;
  if (!boards || typeof boards !== "object" || Array.isArray(boards)) return null;
  return boards;
}

export function readDailyHabitDays(metadata: unknown, examSlug: string): HabitDay[] {
  const board = habitBoards(metadata)?.[examSlug];
  if (!board || !Array.isArray(board.days)) return [];
  return board.days.filter(
    (day): day is HabitDay =>
      Boolean(day) && typeof day.date === "string" && DATE_RE.test(day.date)
  );
}

function habitDayRecord(
  date: string,
  completedSet: boolean | undefined,
  targetMet: boolean | undefined
): HabitDay {
  const day: HabitDay = { date };
  if (completedSet === true) day.completedSet = true;
  if (targetMet === true) day.targetMet = true;
  return day;
}

/** Merge one qualifying day. Other metadata, including tours, stays put. */
export function mergeDailyHabitDay(
  metadata: unknown,
  patch: {
    examSlug: string;
    date: string;
    completedSet?: boolean;
    targetMet?: boolean;
  }
): Record<string, unknown> {
  const current = { ...(parseMetadataObject(metadata) ?? {}) };
  if (!patch.examSlug.trim() || !DATE_RE.test(patch.date)) return current;
  const completedSet = patch.completedSet === true;
  const targetMet = patch.targetMet === true;
  if (!completedSet && !targetMet) return current;

  const habitRaw = current.dailyHabit;
  const habit =
    habitRaw && typeof habitRaw === "object" && !Array.isArray(habitRaw)
      ? { ...(habitRaw as Record<string, unknown>) }
      : {};
  const v1Raw = habit.v1;
  const v1 =
    v1Raw && typeof v1Raw === "object" && !Array.isArray(v1Raw)
      ? { ...(v1Raw as Record<string, unknown>) }
      : {};
  const boardsRaw = v1.boards;
  const boards =
    boardsRaw && typeof boardsRaw === "object" && !Array.isArray(boardsRaw)
      ? { ...(boardsRaw as Record<string, unknown>) }
      : {};
  const boardRaw = boards[patch.examSlug];
  const board =
    boardRaw && typeof boardRaw === "object" && !Array.isArray(boardRaw)
      ? { ...(boardRaw as Record<string, unknown>) }
      : {};

  const byDate = new Map<string, HabitDay>();
  for (const day of readDailyHabitDays(current, patch.examSlug)) {
    byDate.set(day.date, habitDayRecord(day.date, day.completedSet, day.targetMet));
  }
  const previous = byDate.get(patch.date);
  byDate.set(
    patch.date,
    habitDayRecord(
      patch.date,
      previous?.completedSet === true || completedSet,
      previous?.targetMet === true || targetMet
    )
  );
  const days = [...byDate.values()]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-HABIT_DAY_CAP);
  boards[patch.examSlug] = { ...board, days };
  v1.boards = boards;
  habit.v1 = v1;
  return { ...current, dailyHabit: habit };
}

export function hashStringToSeed(value: string): number {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function seededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let next = Math.imul(state ^ (state >>> 15), 1 | state);
    next = (next + Math.imul(next ^ (next >>> 7), 61 | next)) ^ next;
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}

export function todaySetRandom(parts: readonly string[]): () => number {
  return seededRandom(hashStringToSeed(parts.join("|")));
}
