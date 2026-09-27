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
 *
 * The calendar day is the student's timezone when that zone is known, and
 * America/Chicago otherwise. The review window moves with that day so the
 * same due items do not lead every set. New items are spread across topics.
 * Ids shown on an earlier day wait until the unseen pool runs out.
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

/** Used when the account has no timezone and the request did not send one. */
export const FALLBACK_STUDY_TIME_ZONE = "America/Chicago";

const HABIT_DAY_CAP = 120;
const TODAY_SET_HISTORY_CAP = 14;
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
  /** Topic bucket. Two or more distinct keys spread the new slice across topics. */
  topicKey?: string | null;
  /**
   * Shown on an earlier day and still unanswered.
   * Drawn only after never-shown items run out.
   */
  previouslyShown?: boolean;
};

/** Moves the due-review window once per calendar day. */
export type TodayReviewCycle = {
  date: string;
  /** Stable per student and board. */
  salt: number;
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

function rotateIds(ids: readonly string[], offset: number): string[] {
  if (ids.length === 0) return [];
  const start = ((Math.trunc(offset) % ids.length) + ids.length) % ids.length;
  if (start === 0) return [...ids];
  return [...ids.slice(start), ...ids.slice(0, start)];
}

/**
 * Which index leads the due-review window.
 * Consecutive calendar days advance one window, so a long queue does not
 * repeat yesterday's slice until the windows wrap.
 */
export function reviewWindowStart(
  length: number,
  take: number,
  dayIndex: number,
  salt: number
): number {
  if (!Number.isFinite(length) || length <= 1) return 0;
  if (!Number.isFinite(take) || take <= 0) return 0;
  if (length <= take) return 0;
  const windows = Math.ceil(length / take);
  const shift = (Math.trunc(dayIndex) || 0) + (Math.trunc(salt) || 0);
  const slot = ((shift % windows) + windows) % windows;
  return (slot * take) % length;
}

function pickFromRotated(
  ids: readonly string[],
  count: number,
  offset: number,
  avoid: ReadonlySet<string>
): string[] {
  if (count <= 0 || ids.length === 0) return [];
  const rotated = rotateIds(ids, offset);
  const picked: string[] = [];
  const seen = new Set<string>();
  const take = (list: readonly string[]) => {
    for (const id of list) {
      if (picked.length >= count) return;
      if (seen.has(id)) continue;
      seen.add(id);
      picked.push(id);
    }
  };
  take(rotated.filter((id) => !avoid.has(id)));
  take(rotated);
  return picked;
}

function topicSlotPlan(
  groups: { key: string; weight: number; count: number }[],
  needed: number
): Map<string, number> {
  const plan = new Map<string, number>();
  const active = groups.filter((group) => group.count > 0 && group.weight > 0);
  const available = active.reduce((sum, group) => sum + group.count, 0);
  let left = Math.max(0, Math.min(needed, available));
  if (left === 0 || active.length === 0) return plan;

  if (left >= active.length) {
    for (const group of active) {
      plan.set(group.key, 1);
      left -= 1;
    }
  }
  if (left === 0) return plan;

  const room = active
    .map((group) => ({
      key: group.key,
      weight: group.weight,
      room: group.count - (plan.get(group.key) ?? 0),
    }))
    .filter((group) => group.room > 0);
  const weightSum = room.reduce((sum, group) => sum + group.weight, 0);
  const shares = room.map((group) => {
    const exact = weightSum > 0 ? (left * group.weight) / weightSum : left / room.length;
    const whole = Math.min(group.room, Math.floor(exact));
    return { ...group, whole, frac: exact - Math.floor(exact) };
  });
  let used = 0;
  for (const share of shares) {
    plan.set(share.key, (plan.get(share.key) ?? 0) + share.whole);
    used += share.whole;
  }
  let rest = left - used;
  const byRemainder = [...shares].sort(
    (a, b) => b.frac - a.frac || b.weight - a.weight || a.key.localeCompare(b.key)
  );
  for (const share of byRemainder) {
    if (rest <= 0) break;
    const current = plan.get(share.key) ?? 0;
    const group = active.find((item) => item.key === share.key);
    if (!group || current >= group.count) continue;
    plan.set(share.key, current + 1);
    rest -= 1;
  }
  if (rest > 0) {
    for (const group of active) {
      if (rest <= 0) break;
      const current = plan.get(group.key) ?? 0;
      const space = group.count - current;
      if (space <= 0) continue;
      const give = Math.min(space, rest);
      plan.set(group.key, current + give);
      rest -= give;
    }
  }
  return plan;
}

function sampleNewQuestions(
  pool: { id: string; weight: number; topicKey?: string | null }[],
  count: number,
  random: () => number
): string[] {
  if (count <= 0 || pool.length === 0) return [];
  const topicOf = (item: { topicKey?: string | null }) => item.topicKey?.trim() || "general";
  if (new Set(pool.map(topicOf)).size < 2) return weightedSample(pool, count, random);

  const groups = new Map<string, { id: string; weight: number }[]>();
  for (const item of pool) {
    const key = topicOf(item);
    const list = groups.get(key) ?? [];
    list.push({ id: item.id, weight: item.weight });
    groups.set(key, list);
  }
  const plan = topicSlotPlan(
    [...groups.entries()].map(([key, items]) => ({
      key,
      count: items.length,
      weight: items.reduce((sum, item) => sum + item.weight, 0),
    })),
    count
  );
  const bags = [...plan.entries()]
    .filter(([, slots]) => slots > 0)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([key, slots]) => ({
      left: slots,
      items: groups.get(key) ?? [],
    }));
  const picked: string[] = [];
  while (picked.length < count && bags.some((bag) => bag.left > 0 && bag.items.length > 0)) {
    let progressed = false;
    for (const bag of bags) {
      if (picked.length >= count || bag.left <= 0 || bag.items.length === 0) continue;
      const next = weightedSample(bag.items, 1, random)[0];
      if (!next) continue;
      bag.items = bag.items.filter((item) => item.id !== next);
      bag.left -= 1;
      picked.push(next);
      progressed = true;
    }
    if (!progressed) break;
  }
  return picked;
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
  /** Ignored when `reviewCycle` is set. 0 keeps the historical prefix. */
  reviewOffset?: number;
  reviewCycle?: TodayReviewCycle | null;
  /** Due ids already shown on earlier days. Repeated only when the due pool is short. */
  avoidReviewIds?: readonly string[];
}): TodaySetComposition {
  const requested = Number.isFinite(input.size) ? Math.max(0, Math.round(input.size)) : 0;
  const random = input.random ?? Math.random;
  const reviewCap = todayReviewSlotCap(requested);
  const avoid = new Set(
    (input.avoidReviewIds ?? []).map((id) => id.trim()).filter(Boolean)
  );

  const openAll = dedupeIds(input.reviewIncorrectIds);
  const seenReview = new Set(openAll);
  const spacedAll: string[] = [];
  for (const id of dedupeIds(input.spacedReviewIds)) {
    if (seenReview.has(id)) continue;
    seenReview.add(id);
    spacedAll.push(id);
  }
  const openTake = Math.min(reviewCap, requested);
  const openOffset = input.reviewCycle
    ? reviewWindowStart(
        openAll.length,
        openTake,
        calendarDayIndex(input.reviewCycle.date),
        input.reviewCycle.salt
      )
    : (input.reviewOffset ?? 0);
  const spacedOffset = input.reviewCycle
    ? reviewWindowStart(
        spacedAll.length,
        Math.max(1, openTake),
        calendarDayIndex(input.reviewCycle.date),
        input.reviewCycle.salt
      )
    : (input.reviewOffset ?? 0);
  const openFirst = pickFromRotated(openAll, openTake, openOffset, avoid);
  const spacedFirst = pickFromRotated(
    spacedAll,
    Math.max(0, openTake - openFirst.length),
    spacedOffset,
    avoid
  );
  const firstReview = [...openFirst, ...spacedFirst];
  const firstTaken = new Set(firstReview);

  const freshPool: { id: string; weight: number; topicKey?: string | null }[] = [];
  const stalePool: { id: string; weight: number; topicKey?: string | null }[] = [];
  const seenNew = new Set<string>();
  for (const candidate of input.newCandidates) {
    const id = candidate.id.trim();
    if (!id || seenReview.has(id) || seenNew.has(id)) continue;
    seenNew.add(id);
    const weight =
      Number.isFinite(candidate.weight) && candidate.weight > 0 ? candidate.weight : 0.001;
    const row = { id, weight, topicKey: candidate.topicKey };
    if (candidate.previouslyShown) stalePool.push(row);
    else freshPool.push(row);
  }
  const newSlots = Math.max(0, requested - firstReview.length);
  const freshPicked = sampleNewQuestions(freshPool, newSlots, random);
  const drawnFresh = [
    ...freshPicked,
    ...sampleNewQuestions(stalePool, newSlots - freshPicked.length, random),
  ];

  const shortfall = requested - firstReview.length - drawnFresh.length;
  const restOpen = rotateIds(openAll, openOffset).filter((id) => !firstTaken.has(id));
  const restSpaced = rotateIds(spacedAll, spacedOffset).filter((id) => !firstTaken.has(id));
  const rest = [...restOpen, ...restSpaced];
  const backfill = [
    ...rest.filter((id) => !avoid.has(id)),
    ...rest.filter((id) => avoid.has(id)),
  ].slice(0, Math.max(0, shortfall));
  const selectedReview = new Set([...firstReview, ...backfill]);
  const reviewIncorrect = [
    ...openFirst,
    ...backfill.filter((id) => openAll.includes(id)),
  ].filter((id) => selectedReview.has(id));
  const spaced = [...spacedFirst, ...backfill.filter((id) => spacedAll.includes(id))].filter((id) =>
    selectedReview.has(id)
  );
  const reviewCount = reviewIncorrect.length + spaced.length;
  return {
    requestedSize: requested,
    ids: [...reviewIncorrect, ...spaced, ...drawnFresh],
    reviewIncorrectIds: reviewIncorrect,
    spacedReviewIds: spaced,
    newIds: drawnFresh,
    reviewCount,
    newCount: drawnFresh.length,
    mixLine: formatTodayMixLine(reviewCount, drawnFresh.length),
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

/** Keep a caller-supplied IANA zone. Anything else falls back to America/Chicago. */
export function resolveStudyTimeZone(input?: string | null): string {
  const trimmed = input?.trim() ?? "";
  if (!trimmed || trimmed.length > 80) return FALLBACK_STUDY_TIME_ZONE;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: trimmed }).format(0);
    return trimmed;
  } catch {
    return FALLBACK_STUDY_TIME_ZONE;
  }
}

/** YYYY-MM-DD in the study timezone. Invalid zones use America/Chicago. */
export function calendarDateKey(now: Date, timeZone?: string | null): string {
  const zone = resolveStudyTimeZone(timeZone);
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: zone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(now);
    const year = parts.find((part) => part.type === "year")?.value;
    const month = parts.find((part) => part.type === "month")?.value;
    const day = parts.find((part) => part.type === "day")?.value;
    if (year && month && day) return `${year}-${month}-${day}`;
  } catch {
    /* use UTC below */
  }
  return utcDateKey(now);
}

/** Browser zone when the runtime exposes one. Otherwise America/Chicago. */
export function browserStudyTimeZone(): string {
  try {
    return resolveStudyTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
  } catch {
    return FALLBACK_STUDY_TIME_ZONE;
  }
}

/** Milliseconds until the next midnight in the study timezone. At least one minute. */
export function msUntilNextCalendarDay(now: Date, timeZone?: string | null): number {
  const zone = resolveStudyTimeZone(timeZone);
  const today = calendarDateKey(now, zone);
  let lo = now.getTime();
  let hi = now.getTime() + 36 * 60 * 60 * 1000;
  while (hi - lo > 1000) {
    const mid = Math.floor((lo + hi) / 2);
    if (calendarDateKey(new Date(mid), zone) === today) lo = mid;
    else hi = mid;
  }
  return Math.max(60_000, hi - now.getTime());
}

/** Ordinal for a YYYY-MM-DD calendar date. Consecutive dates differ by 1. */
export function calendarDayIndex(dateIso: string): number {
  if (!DATE_RE.test(dateIso)) return 0;
  const [year, month, day] = dateIso.split("-").map(Number);
  if (!year || !month || !day) return 0;
  return Math.floor(Date.UTC(year, month - 1, day) / 86_400_000);
}

/**
 * Serve a smaller sitting from a set that was already chosen.
 * Review stays capped, and the ids are a subset of the original set.
 * A request at least as long as the set returns the set unchanged.
 */
export function fitTodayComposition(composition: TodaySetComposition, size: number): TodaySetComposition {
  const requested = Number.isFinite(size) ? Math.max(0, Math.round(size)) : 0;
  if (requested >= composition.ids.length) {
    return { ...composition, requestedSize: Math.max(composition.requestedSize, requested) };
  }
  const reviewCap = todayReviewSlotCap(requested);
  const openTake = composition.reviewIncorrectIds.slice(0, Math.min(reviewCap, requested));
  const spacedTake = composition.spacedReviewIds.slice(
    0,
    Math.max(0, Math.min(reviewCap, requested) - openTake.length)
  );
  const reviewTaken = openTake.length + spacedTake.length;
  const newTake = composition.newIds.slice(0, Math.max(0, requested - reviewTaken));
  const shortfall = requested - reviewTaken - newTake.length;
  const extraOpen = composition.reviewIncorrectIds.slice(openTake.length);
  const extraSpaced = composition.spacedReviewIds.slice(spacedTake.length);
  const backfill = [...extraOpen, ...extraSpaced].slice(0, Math.max(0, shortfall));
  const openSet = new Set(composition.reviewIncorrectIds);
  const spacedSet = new Set(composition.spacedReviewIds);
  const reviewIncorrectIds = [...openTake, ...backfill.filter((id) => openSet.has(id))];
  const spacedReviewIds = [...spacedTake, ...backfill.filter((id) => spacedSet.has(id))];
  const reviewCount = reviewIncorrectIds.length + spacedReviewIds.length;
  return {
    requestedSize: requested,
    ids: [...reviewIncorrectIds, ...spacedReviewIds, ...newTake],
    reviewIncorrectIds,
    spacedReviewIds,
    newIds: newTake,
    reviewCount,
    newCount: newTake.length,
    mixLine: formatTodayMixLine(reviewCount, newTake.length),
  };
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

export type StoredTodaySet = {
  date: string;
  timeZone: string;
  requestedSize: number;
  reviewIncorrectIds: string[];
  spacedReviewIds: string[];
  newIds: string[];
};

function stringList(value: unknown, cap: number): string[] {
  if (!Array.isArray(value)) return [];
  const out: string[] = [];
  const seen = new Set<string>();
  for (const entry of value) {
    if (typeof entry !== "string") continue;
    const trimmed = entry.trim();
    if (!trimmed || trimmed.length > 80 || seen.has(trimmed)) continue;
    seen.add(trimmed);
    out.push(trimmed);
    if (out.length >= cap) break;
  }
  return out;
}

function todaySetBoards(metadata: unknown): Record<string, { days?: unknown }> | null {
  const root = parseMetadataObject(metadata);
  const stored = root?.todaySets;
  if (!stored || typeof stored !== "object" || Array.isArray(stored)) return null;
  const v1 = (stored as { v1?: unknown }).v1;
  if (!v1 || typeof v1 !== "object" || Array.isArray(v1)) return null;
  const boards = (v1 as { boards?: unknown }).boards;
  if (!boards || typeof boards !== "object" || Array.isArray(boards)) return null;
  return boards as Record<string, { days?: unknown }>;
}

function parseStoredTodaySet(value: unknown): StoredTodaySet | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const row = value as Partial<StoredTodaySet>;
  if (typeof row.date !== "string" || !DATE_RE.test(row.date)) return null;
  const requestedSize =
    typeof row.requestedSize === "number" && Number.isFinite(row.requestedSize)
      ? Math.max(0, Math.round(row.requestedSize))
      : 0;
  return {
    date: row.date,
    timeZone: resolveStudyTimeZone(typeof row.timeZone === "string" ? row.timeZone : null),
    requestedSize,
    reviewIncorrectIds: stringList(row.reviewIncorrectIds, 120),
    spacedReviewIds: stringList(row.spacedReviewIds, 120),
    newIds: stringList(row.newIds, 120),
  };
}

export function readStoredTodaySets(metadata: unknown, fieldId: string): StoredTodaySet[] {
  const days = todaySetBoards(metadata)?.[fieldId]?.days;
  if (!Array.isArray(days)) return [];
  return days
    .map((day) => parseStoredTodaySet(day))
    .filter((day): day is StoredTodaySet => Boolean(day))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function readStoredTodaySetForDate(
  metadata: unknown,
  fieldId: string,
  date: string
): StoredTodaySet | null {
  if (!DATE_RE.test(date)) return null;
  const days = readStoredTodaySets(metadata, fieldId);
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i]?.date === date) return days[i] ?? null;
  }
  return null;
}

/** New and review ids assigned on earlier calendar days for this board. */
export function priorTodaySetIds(
  metadata: unknown,
  fieldId: string,
  today: string
): { newIds: string[]; reviewIds: string[] } {
  const newIds: string[] = [];
  const reviewIds: string[] = [];
  const seenNew = new Set<string>();
  const seenReview = new Set<string>();
  for (const day of readStoredTodaySets(metadata, fieldId)) {
    if (!DATE_RE.test(today) || day.date >= today) continue;
    for (const id of day.newIds) {
      if (seenNew.has(id)) continue;
      seenNew.add(id);
      newIds.push(id);
    }
    for (const id of [...day.reviewIncorrectIds, ...day.spacedReviewIds]) {
      if (seenReview.has(id)) continue;
      seenReview.add(id);
      reviewIds.push(id);
    }
  }
  return { newIds, reviewIds };
}

export function compositionFromStored(snapshot: StoredTodaySet): TodaySetComposition {
  const reviewIncorrectIds = dedupeIds(snapshot.reviewIncorrectIds);
  const open = new Set(reviewIncorrectIds);
  const spacedReviewIds = dedupeIds(snapshot.spacedReviewIds).filter((id) => !open.has(id));
  const taken = new Set([...reviewIncorrectIds, ...spacedReviewIds]);
  const newIds = dedupeIds(snapshot.newIds).filter((id) => !taken.has(id));
  const reviewCount = reviewIncorrectIds.length + spacedReviewIds.length;
  return {
    requestedSize: snapshot.requestedSize,
    ids: [...reviewIncorrectIds, ...spacedReviewIds, ...newIds],
    reviewIncorrectIds,
    spacedReviewIds,
    newIds,
    reviewCount,
    newCount: newIds.length,
    mixLine: formatTodayMixLine(reviewCount, newIds.length),
  };
}

/** One set per board per calendar day. Other metadata, including tours, stays put. */
export function mergeStoredTodaySet(
  metadata: unknown,
  fieldId: string,
  snapshot: StoredTodaySet
): Record<string, unknown> {
  const current = { ...(parseMetadataObject(metadata) ?? {}) };
  const boardId = fieldId.trim();
  if (!boardId || !DATE_RE.test(snapshot.date)) return current;
  const storedRaw = current.todaySets;
  const stored =
    storedRaw && typeof storedRaw === "object" && !Array.isArray(storedRaw)
      ? { ...(storedRaw as Record<string, unknown>) }
      : {};
  const v1Raw = stored.v1;
  const v1 =
    v1Raw && typeof v1Raw === "object" && !Array.isArray(v1Raw)
      ? { ...(v1Raw as Record<string, unknown>) }
      : {};
  const boardsRaw = v1.boards;
  const boards =
    boardsRaw && typeof boardsRaw === "object" && !Array.isArray(boardsRaw)
      ? { ...(boardsRaw as Record<string, unknown>) }
      : {};
  const boardRaw = boards[boardId];
  const board =
    boardRaw && typeof boardRaw === "object" && !Array.isArray(boardRaw)
      ? { ...(boardRaw as Record<string, unknown>) }
      : {};
  const nextDay: StoredTodaySet = {
    date: snapshot.date,
    timeZone: resolveStudyTimeZone(snapshot.timeZone),
    requestedSize: Math.max(0, Math.round(snapshot.requestedSize) || 0),
    reviewIncorrectIds: stringList(snapshot.reviewIncorrectIds, 120),
    spacedReviewIds: stringList(snapshot.spacedReviewIds, 120),
    newIds: stringList(snapshot.newIds, 120),
  };
  const days = readStoredTodaySets(current, boardId).filter((day) => day.date !== snapshot.date);
  days.push(nextDay);
  days.sort((a, b) => a.date.localeCompare(b.date));
  boards[boardId] = { ...board, days: days.slice(-TODAY_SET_HISTORY_CAP) };
  v1.boards = boards;
  stored.v1 = v1;
  return { ...current, todaySets: stored };
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
