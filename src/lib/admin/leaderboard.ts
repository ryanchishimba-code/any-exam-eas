import { sqlQuery, withDbRetry } from "@/lib/db";
import {
  LEADERBOARD_BOARDS,
  LEADERBOARD_LIMIT,
  LEADERBOARD_TIME_ZONE,
  attemptFieldIdsForBoard,
  eligibleStudentSql,
  leaderboardBoardSql,
  leaderboardPlanSql,
  leaderboardWindow,
  type LeaderboardBoardId,
  type LeaderboardPlan,
  type LeaderboardQuery,
} from "@/lib/admin/leaderboard-rules";

export type LeaderboardRow = {
  rank: number;
  userId: string;
  name: string | null;
  email: string;
  board: LeaderboardBoardId | null;
  plan: LeaderboardPlan;
  questionsAnswered: number;
  accuracyPct: number | null;
  currentStreak: number;
  longestStreak: number;
  lastActiveAt: string | null;
};

export type BoardCensus = {
  board: LeaderboardBoardId;
  label: string;
  total: number;
  trial: number;
  paid: number;
  free: number;
  active7d: number;
};

export type AdminLeaderboardData = {
  filters: LeaderboardQuery;
  rows: LeaderboardRow[];
  totalMatched: number;
  boards: BoardCensus[];
  unassigned: number;
  windowStartDate: string;
  today: string;
  generatedAt: string;
  fetchError?: string;
};

type RankRaw = {
  place: number | string;
  total_matched: number | string;
  id: string;
  email: string;
  name: string | null;
  board: string | null;
  plan_status: string;
  answered_all: number | string;
  correct_all: number | string;
  answered_7d: number | string;
  correct_7d: number | string;
  last_attempt_at: Date | string | null;
  last_active_at: Date | string | null;
  current_streak: number | string;
  longest_streak: number | string;
};

type CensusRaw = {
  board: string | null;
  plan_status: string;
  users: number | string;
  active: number | string;
};

const QUERY_TIMEOUT_MS = 20_000;

function num(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function asIso(value: Date | string | null | undefined): string | null {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

function laterIso(a: Date | string | null, b: Date | string | null): string | null {
  const left = asIso(a);
  const right = asIso(b);
  if (!left) return right;
  if (!right) return left;
  return left > right ? left : right;
}

function accuracyPct(correct: number, total: number): number | null {
  if (total <= 0) return null;
  return Math.round((correct / total) * 100);
}

function isBoard(value: string | null): value is LeaderboardBoardId {
  return LEADERBOARD_BOARDS.some((board) => board.id === value);
}

function isPlan(value: string): value is LeaderboardPlan {
  return value === "trial" || value === "paid" || value === "free";
}

function emptyBoards(): BoardCensus[] {
  return LEADERBOARD_BOARDS.map((board) => ({
    board: board.id,
    label: board.label,
    total: 0,
    trial: 0,
    paid: 0,
    free: 0,
    active7d: 0,
  }));
}

function eligibleCte(nowParam: string): string {
  return `eligible AS (
    SELECT
      u.id,
      u.email,
      u.name,
      u."lastActiveAt",
      ${leaderboardPlanSql("s", nowParam)} AS plan_status,
      ${leaderboardBoardSql("p")} AS board
    FROM "User" u
    LEFT JOIN "Subscription" s ON s."userId" = u.id
    LEFT JOIN "UserExamPreference" p ON p."userId" = u.id
    WHERE ${eligibleStudentSql("u")}
  )`;
}

function censusSql(nowParam: string, windowParam: string): string {
  return `
    WITH ${eligibleCte(nowParam)},
    recent AS (
      SELECT DISTINCT qa."userId" AS id
      FROM "QuestionAttempt" qa
      INNER JOIN eligible e ON e.id = qa."userId"
      WHERE qa."createdAt" >= ${windowParam}::timestamptz
    )
    SELECT
      e.board,
      e.plan_status,
      COUNT(*)::int AS users,
      COUNT(*) FILTER (
        WHERE e."lastActiveAt" >= ${windowParam}::timestamptz OR r.id IS NOT NULL
      )::int AS active
    FROM eligible e
    LEFT JOIN recent r ON r.id = e.id
    GROUP BY e.board, e.plan_status
  `;
}

/**
 * One pass over the filtered students' attempts. Counts and streaks stay in
 * Postgres. The gaps-and-islands step matches `streaksFromStudyDays`.
 */
function rankingSql(args: {
  nowParam: string;
  windowParam: string;
  todayParam: string;
  fieldParam: string;
  boardParam: string;
  planParam: string;
  metricParam: string;
  windowModeParam: string;
  limitParam: string;
}): string {
  const {
    nowParam,
    windowParam,
    todayParam,
    fieldParam,
    boardParam,
    planParam,
    metricParam,
    windowModeParam,
    limitParam,
  } = args;

  return `
    WITH ${eligibleCte(nowParam)},
    filtered AS (
      SELECT *
      FROM eligible
      WHERE (${boardParam}::text IS NULL OR board = ${boardParam})
        AND (${planParam}::text IS NULL OR plan_status = ${planParam})
    ),
    attempt_days AS (
      SELECT
        qa."userId",
        qa.correct,
        qa."createdAt",
        (qa."createdAt" AT TIME ZONE '${LEADERBOARD_TIME_ZONE}')::date AS study_day
      FROM "QuestionAttempt" qa
      INNER JOIN filtered f ON f.id = qa."userId"
      WHERE CARDINALITY(${fieldParam}::text[]) = 0
        OR qa."fieldId" = ANY(${fieldParam}::text[])
    ),
    stats AS (
      SELECT
        "userId",
        COUNT(*)::int AS answered_all,
        COUNT(*) FILTER (WHERE correct)::int AS correct_all,
        COUNT(*) FILTER (WHERE "createdAt" >= ${windowParam}::timestamptz)::int AS answered_7d,
        COUNT(*) FILTER (
          WHERE correct AND "createdAt" >= ${windowParam}::timestamptz
        )::int AS correct_7d,
        MAX("createdAt") AS last_attempt_at
      FROM attempt_days
      GROUP BY "userId"
    ),
    days AS (
      SELECT DISTINCT "userId", study_day
      FROM attempt_days
    ),
    islands AS (
      SELECT
        "userId",
        study_day,
        study_day - (ROW_NUMBER() OVER (
          PARTITION BY "userId" ORDER BY study_day
        ))::int AS island_key
      FROM days
    ),
    runs AS (
      SELECT
        "userId",
        COUNT(*)::int AS streak_len,
        MAX(study_day) AS end_day
      FROM islands
      GROUP BY "userId", island_key
    ),
    streaks AS (
      SELECT
        "userId",
        COALESCE(MAX(streak_len), 0)::int AS longest_streak,
        COALESCE(MAX(streak_len) FILTER (
          WHERE end_day >= ${todayParam}::date - 1
        ), 0)::int AS current_streak
      FROM runs
      GROUP BY "userId"
    ),
    joined AS (
      SELECT
        f.id,
        f.email,
        f.name,
        f."lastActiveAt" AS last_active_at,
        f.board,
        f.plan_status,
        COALESCE(s.answered_all, 0)::int AS answered_all,
        COALESCE(s.correct_all, 0)::int AS correct_all,
        COALESCE(s.answered_7d, 0)::int AS answered_7d,
        COALESCE(s.correct_7d, 0)::int AS correct_7d,
        s.last_attempt_at,
        COALESCE(st.current_streak, 0)::int AS current_streak,
        COALESCE(st.longest_streak, 0)::int AS longest_streak
      FROM filtered f
      LEFT JOIN stats s ON s."userId" = f.id
      LEFT JOIN streaks st ON st."userId" = f.id
      WHERE CASE
        WHEN ${metricParam} = 'questions' AND ${windowModeParam} = '7d'
          THEN COALESCE(s.answered_7d, 0) > 0
        ELSE COALESCE(s.answered_all, 0) > 0
      END
    )
    SELECT
      place,
      total_matched,
      id,
      email,
      name,
      board,
      plan_status,
      answered_all,
      correct_all,
      answered_7d,
      correct_7d,
      last_attempt_at,
      last_active_at,
      current_streak,
      longest_streak
    FROM (
      SELECT
        j.*,
        (COUNT(*) OVER())::int AS total_matched,
        (ROW_NUMBER() OVER (
          ORDER BY
            CASE
              WHEN ${metricParam} = 'streak' THEN j.current_streak
              WHEN ${windowModeParam} = '7d' THEN j.answered_7d
              ELSE j.answered_all
            END DESC,
            CASE WHEN ${metricParam} = 'streak' THEN j.longest_streak ELSE 0 END DESC,
            CASE
              WHEN ${windowModeParam} = '7d' THEN j.answered_7d
              ELSE j.answered_all
            END DESC,
            CASE
              WHEN ${metricParam} = 'questions' AND ${windowModeParam} = '7d' AND j.answered_7d > 0
                THEN j.correct_7d::float / j.answered_7d
              WHEN j.answered_all > 0 THEN j.correct_all::float / j.answered_all
              ELSE 0
            END DESC,
            j.email ASC
        ))::int AS place
      FROM joined j
    ) ranked
    WHERE place <= ${limitParam}::int
    ORDER BY place
  `;
}

function foldCensus(rows: CensusRaw[]): { boards: BoardCensus[]; unassigned: number } {
  const boards = emptyBoards();
  const byId = new Map(boards.map((board) => [board.board, board]));
  let unassigned = 0;

  for (const row of rows) {
    const users = num(row.users);
    const active = num(row.active);
    if (!isBoard(row.board)) {
      unassigned += users;
      continue;
    }
    const bucket = byId.get(row.board);
    if (!bucket || !isPlan(row.plan_status)) continue;
    bucket[row.plan_status] += users;
    bucket.total += users;
    bucket.active7d += active;
  }

  return { boards, unassigned };
}

function toRow(raw: RankRaw, filters: LeaderboardQuery): LeaderboardRow {
  const useWindow = filters.metric === "questions" && filters.window === "7d";
  const answered = num(useWindow ? raw.answered_7d : raw.answered_all);
  const correct = num(useWindow ? raw.correct_7d : raw.correct_all);
  return {
    rank: num(raw.place),
    userId: raw.id,
    name: raw.name,
    email: raw.email,
    board: isBoard(raw.board) ? raw.board : null,
    plan: isPlan(raw.plan_status) ? raw.plan_status : "free",
    questionsAnswered: answered,
    accuracyPct: accuracyPct(correct, answered),
    currentStreak: num(raw.current_streak),
    longestStreak: num(raw.longest_streak),
    lastActiveAt: laterIso(raw.last_active_at, raw.last_attempt_at),
  };
}

function baseData(filters: LeaderboardQuery, now: Date): AdminLeaderboardData {
  const window = leaderboardWindow(now);
  return {
    filters,
    rows: [],
    totalMatched: 0,
    boards: emptyBoards(),
    unassigned: 0,
    windowStartDate: window.windowStartDate,
    today: window.today,
    generatedAt: now.toISOString(),
  };
}

export async function getAdminLeaderboard(
  filters: LeaderboardQuery,
  now = new Date()
): Promise<AdminLeaderboardData> {
  const data = baseData(filters, now);
  const window = leaderboardWindow(now);
  const fieldIds = filters.board === "all" ? [] : attemptFieldIdsForBoard(filters.board);

  const censusParams = [now, window.windowStart];
  const rankParams = [
    now,
    window.windowStart,
    window.today,
    fieldIds,
    filters.board === "all" ? null : filters.board,
    filters.plan === "all" ? null : filters.plan,
    filters.metric,
    filters.window,
    LEADERBOARD_LIMIT,
  ];

  const [censusResult, rankResult] = await Promise.allSettled([
    withDbRetry(
      () => sqlQuery<CensusRaw[]>(censusSql("$1", "$2"), censusParams, { timeoutMs: QUERY_TIMEOUT_MS }),
      "leaderboard.census"
    ),
    withDbRetry(
      () =>
        sqlQuery<RankRaw[]>(
          rankingSql({
            nowParam: "$1",
            windowParam: "$2",
            todayParam: "$3",
            fieldParam: "$4",
            boardParam: "$5",
            planParam: "$6",
            metricParam: "$7",
            windowModeParam: "$8",
            limitParam: "$9",
          }),
          rankParams,
          { timeoutMs: QUERY_TIMEOUT_MS }
        ),
      "leaderboard.rank"
    ),
  ]);

  const errors: string[] = [];
  if (censusResult.status === "fulfilled") {
    const folded = foldCensus(censusResult.value ?? []);
    data.boards = folded.boards;
    data.unassigned = folded.unassigned;
  } else {
    errors.push("board counts");
    console.error("[leaderboard] census failed:", censusResult.reason);
  }

  if (rankResult.status === "fulfilled") {
    const rows = rankResult.value ?? [];
    data.rows = rows.map((row) => toRow(row, filters));
    data.totalMatched = rows.length > 0 ? num(rows[0]?.total_matched) : 0;
  } else {
    errors.push("rankings");
    console.error("[leaderboard] ranking failed:", rankResult.reason);
  }

  if (errors.length > 0) {
    data.fetchError = `Could not load ${errors.join(" and ")}. Refresh to try again.`;
  }
  return data;
}
