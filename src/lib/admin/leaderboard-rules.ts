import { USMLE_FIELD_ALIASES, USMLE_FIELD_IDS } from "@/lib/exam-prep/usmle/steps";
import { EXAM_CATALOG } from "@/lib/edtech/exams";
import { FIELD_ID_ALIASES, RETIRED_FIELD_IDS } from "@/lib/subjects/field-ids";
import {
  LEADERBOARD_BOARDS,
  type LeaderboardBoardId,
  type LeaderboardPlan,
  type LeaderboardQuery,
} from "@/lib/admin/leaderboard-boards";

export {
  LEADERBOARD_BOARDS,
  type LeaderboardBoardId,
  type LeaderboardMetric,
  type LeaderboardPlan,
  type LeaderboardQuery,
  type LeaderboardWindow,
} from "@/lib/admin/leaderboard-boards";

/** Calendar day for streaks and the 7-day window. */
export const LEADERBOARD_TIME_ZONE = "America/Chicago";

export const LEADERBOARD_LIMIT = 50;

/** Inclusive Chicago calendar days in the "last 7 days" view. */
export const LEADERBOARD_WINDOW_DAYS = 7;

/**
 * Inboxes rejected by `isInternalTestEmail`. The SQL exclusion is built from
 * this list so a new internal domain fails the alignment test.
 */
export const EXCLUDED_EMAIL_SUFFIXES = ["@anyexameasy.test", "@loadtest.anyexameasy.test"] as const;

export type PlanSnapshot = {
  status?: string | null;
  purchaseType?: string | null;
  stripeSubscriptionId?: string | null;
  trialEndsAt?: Date | string | null;
  accessEndsAt?: Date | string | null;
  compAccessUntil?: Date | string | null;
};

const BOARD_IDS = new Set<string>(LEADERBOARD_BOARDS.map((board) => board.id));
const RETIRED = new Set<string>(RETIRED_FIELD_IDS);

export function leaderboardBoardLabel(board: LeaderboardBoardId | null): string {
  if (!board) return "—";
  return LEADERBOARD_BOARDS.find((item) => item.id === board)?.label ?? board;
}

export function parseLeaderboardFilters(raw: {
  metric?: string | null;
  window?: string | null;
  board?: string | null;
  plan?: string | null;
}): LeaderboardQuery {
  const board = raw.board?.trim().toLowerCase() ?? "";
  const plan = raw.plan?.trim().toLowerCase() ?? "";
  return {
    metric: raw.metric === "streak" ? "streak" : "questions",
    window: raw.window === "7d" ? "7d" : "all",
    board: BOARD_IDS.has(board) ? (board as LeaderboardBoardId) : "all",
    plan: plan === "trial" || plan === "paid" || plan === "free" ? plan : "all",
  };
}

/**
 * Trial / paid / free for the leaderboard.
 * Complimentary access that is still open counts as paid because it unlocks
 * the same premium access as a live subscription. An expired trial is free.
 */
export function classifyLeaderboardPlan(
  sub: PlanSnapshot | null | undefined,
  now: Date
): LeaderboardPlan {
  if (!sub) return "free";
  const trialEnds = sub.trialEndsAt ? new Date(sub.trialEndsAt) : null;
  if (sub.status === "trialing" && (!trialEnds || trialEnds > now)) return "trial";

  const accessEnds = sub.accessEndsAt ? new Date(sub.accessEndsAt) : null;
  if (
    sub.purchaseType === "one_time" &&
    sub.status === "active" &&
    accessEnds &&
    accessEnds > now
  ) {
    return "paid";
  }

  if (sub.stripeSubscriptionId?.trim() && sub.status === "active") return "paid";

  const comp = sub.compAccessUntil ? new Date(sub.compAccessUntil) : null;
  if (comp && comp > now) return "paid";

  return "free";
}

/** SQL CASE. Keep the branches in the same order as `classifyLeaderboardPlan`. */
export function leaderboardPlanSql(subscriptionAlias = "s", nowParam = "$1"): string {
  const s = subscriptionAlias;
  return `CASE
    WHEN ${s}.id IS NOT NULL
      AND ${s}.status = 'trialing'
      AND (${s}."trialEndsAt" IS NULL OR ${s}."trialEndsAt" > ${nowParam}::timestamptz)
      THEN 'trial'
    WHEN ${s}.id IS NOT NULL
      AND ${s}."purchaseType" = 'one_time'
      AND ${s}.status = 'active'
      AND ${s}."accessEndsAt" IS NOT NULL
      AND ${s}."accessEndsAt" > ${nowParam}::timestamptz
      THEN 'paid'
    WHEN ${s}.id IS NOT NULL
      AND NULLIF(btrim(${s}."stripeSubscriptionId"), '') IS NOT NULL
      AND ${s}.status = 'active'
      THEN 'paid'
    WHEN ${s}.id IS NOT NULL
      AND ${s}."compAccessUntil" IS NOT NULL
      AND ${s}."compAccessUntil" > ${nowParam}::timestamptz
      THEN 'paid'
    ELSE 'free'
  END`;
}

/**
 * Selected board. Legacy MPJE preferences are PANCE, matching the study-hub
 * read path. Unknown slugs stay unassigned instead of being guessed.
 */
export function leaderboardBoardSql(preferenceAlias = "p"): string {
  const slug = `${preferenceAlias}."examSlug"`;
  return `CASE
    WHEN ${preferenceAlias}."userId" IS NOT NULL AND ${slug} = 'nclex' THEN 'nclex'
    WHEN ${preferenceAlias}."userId" IS NOT NULL AND ${slug} = 'naplex' THEN 'naplex'
    WHEN ${preferenceAlias}."userId" IS NOT NULL AND (${slug} = 'pance' OR ${slug} = 'mpje') THEN 'pance'
    WHEN ${preferenceAlias}."userId" IS NOT NULL AND ${slug} = 'aanp-fnp' THEN 'aanp-fnp'
    WHEN ${preferenceAlias}."userId" IS NOT NULL AND ${slug} = 'npte-pt' THEN 'npte-pt'
    WHEN ${preferenceAlias}."userId" IS NOT NULL AND (${slug} = 'usmle' OR ${slug} LIKE 'usmle-%') THEN 'usmle'
    ELSE NULL
  END`;
}

export function excludedEmailSql(column = 'u.email'): string {
  return EXCLUDED_EMAIL_SUFFIXES.map((suffix) => `${column} NOT ILIKE '%${suffix}'`).join("\n    AND ");
}

/** Students only. Staff roles and internal test inboxes never enter the board. */
export function eligibleStudentSql(userAlias = "u"): string {
  return `${userAlias}.role = 'user'
    AND ${userAlias}."accountStatus" = 'active'
    AND ${excludedEmailSql(`${userAlias}.email`)}`;
}

/** Field ids that count as answers on a board, including stored aliases. */
export function attemptFieldIdsForBoard(board: LeaderboardBoardId): string[] {
  if (board === "usmle") {
    const ids = new Set<string>(USMLE_FIELD_IDS);
    for (const [alias, target] of Object.entries(USMLE_FIELD_ALIASES)) {
      if (RETIRED.has(alias)) continue;
      if ((USMLE_FIELD_IDS as readonly string[]).includes(target)) ids.add(alias);
    }
    return [...ids];
  }

  const canonical = EXAM_CATALOG[board].fieldId;
  const ids = new Set<string>([canonical]);
  for (const [alias, target] of Object.entries(FIELD_ID_ALIASES)) {
    if (RETIRED.has(alias)) continue;
    if (target === canonical) ids.add(alias);
  }
  return [...ids];
}

type ChicagoClock = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
};

export function chicagoWallClock(date: Date): ChicagoClock {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: LEADERBOARD_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  let hour = Number(get("hour"));
  if (hour === 24) hour = 0;
  return {
    year: Number(get("year")),
    month: Number(get("month")),
    day: Number(get("day")),
    hour,
    minute: Number(get("minute")),
    second: Number(get("second")),
  };
}

export function chicagoDateKey(date: Date = new Date()): string {
  const clock = chicagoWallClock(date);
  return `${clock.year}-${String(clock.month).padStart(2, "0")}-${String(clock.day).padStart(2, "0")}`;
}

export function addCalendarDays(dateKey: string, days: number): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateKey);
  if (!match) throw new Error(`Invalid calendar date: ${dateKey}`);
  const utc = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
  utc.setUTCDate(utc.getUTCDate() + days);
  return utc.toISOString().slice(0, 10);
}

/** UTC instant of midnight America/Chicago on `dateKey`. */
export function chicagoMidnightUtc(dateKey: string): Date {
  const probe = new Date(`${dateKey}T06:00:00.000Z`);
  const clock = chicagoWallClock(probe);
  const elapsedMs = (clock.hour * 3600 + clock.minute * 60 + clock.second) * 1000;
  const start = new Date(probe.getTime() - elapsedMs);
  if (chicagoDateKey(start) !== dateKey) {
    throw new Error(`Could not resolve America/Chicago midnight for ${dateKey}`);
  }
  return start;
}

export function leaderboardWindow(now: Date): {
  today: string;
  windowStart: Date;
  windowStartDate: string;
} {
  const today = chicagoDateKey(now);
  const windowStartDate = addCalendarDays(today, -(LEADERBOARD_WINDOW_DAYS - 1));
  return {
    today,
    windowStart: chicagoMidnightUtc(windowStartDate),
    windowStartDate,
  };
}

/**
 * Current and longest streaks from Chicago calendar days that already have
 * at least one answer. Mirrors the gaps-and-islands SQL: a streak is still
 * current when the latest day is today or yesterday.
 */
export function streaksFromStudyDays(
  days: string[],
  today: string
): { current: number; longest: number } {
  const unique = [...new Set(days.filter((day) => /^\d{4}-\d{2}-\d{2}$/.test(day)))].sort();
  if (unique.length === 0) return { current: 0, longest: 0 };

  let longest = 1;
  let run = 1;
  for (let i = 1; i < unique.length; i++) {
    run = unique[i] === addCalendarDays(unique[i - 1]!, 1) ? run + 1 : 1;
    if (run > longest) longest = run;
  }

  const last = unique[unique.length - 1]!;
  const yesterday = addCalendarDays(today, -1);
  if (last !== today && last !== yesterday) return { current: 0, longest };

  let current = 1;
  for (let i = unique.length - 1; i > 0; i--) {
    if (unique[i - 1] !== addCalendarDays(unique[i]!, -1)) break;
    current += 1;
  }
  return { current, longest };
}

export function formatChicagoDate(value: string | Date | null | undefined): string {
  if (!value) return "—";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", {
    timeZone: LEADERBOARD_TIME_ZONE,
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}
