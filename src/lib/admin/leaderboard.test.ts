import { beforeEach, describe, expect, it, vi } from "vitest";

const sqlQuery = vi.hoisted(() => vi.fn());

vi.mock("@/lib/db", () => ({
  sqlQuery,
  withDbRetry: (operation: () => Promise<unknown>) => operation(),
}));

import { getAdminLeaderboard } from "@/lib/admin/leaderboard";
import { parseLeaderboardFilters } from "@/lib/admin/leaderboard-rules";

const filters = parseLeaderboardFilters({});

const rankRow = {
  place: 1,
  total_matched: 8,
  id: "user_1",
  email: "ava@example.com",
  name: "Ava Stone",
  board: "nclex",
  plan_status: "paid",
  answered_all: 10,
  correct_all: 8,
  answered_7d: 4,
  correct_7d: 3,
  last_attempt_at: "2026-11-13T18:00:00.000Z",
  last_active_at: "2026-11-12T18:00:00.000Z",
  current_streak: 3,
  longest_streak: 5,
};

beforeEach(() => {
  sqlQuery.mockReset();
  sqlQuery.mockImplementation(async (text: string) => {
    if (String(text).includes("GROUP BY e.board")) {
      return [
        { board: "nclex", plan_status: "trial", users: 2, active: 1 },
        { board: "nclex", plan_status: "paid", users: 3, active: 2 },
        { board: null, plan_status: "free", users: 4, active: 0 },
      ];
    }
    return [rankRow];
  });
});

describe("getAdminLeaderboard", () => {
  it("aggregates in SQL and keeps attempt rows in the database", async () => {
    const data = await getAdminLeaderboard(filters, new Date("2026-11-13T18:00:00.000Z"));
    expect(sqlQuery).toHaveBeenCalledTimes(2);

    const statements = sqlQuery.mock.calls.map((call) => String(call[0]));
    const ranking = statements.find((sql) => sql.includes("ROW_NUMBER()"));
    const census = statements.find((sql) => sql.includes("GROUP BY e.board"));
    expect(ranking).toBeTruthy();
    expect(census).toBeTruthy();
    expect(ranking).toContain(`AT TIME ZONE 'America/Chicago'`);
    expect(ranking).toContain(`"QuestionAttempt"`);
    expect(ranking).toContain(`role = 'user'`);
    expect(ranking).toContain(`%@anyexameasy.test`);
    expect(ranking).toContain(`%@loadtest.anyexameasy.test`);
    expect(ranking).toContain("COUNT(*)");
    expect(ranking).not.toContain("stemPreview");
    expect(ranking).toContain("place <=");

    expect(data.rows).toHaveLength(1);
    expect(data.rows[0]).toMatchObject({
      rank: 1,
      email: "ava@example.com",
      board: "nclex",
      plan: "paid",
      questionsAnswered: 10,
      accuracyPct: 80,
      currentStreak: 3,
      longestStreak: 5,
      lastActiveAt: "2026-11-13T18:00:00.000Z",
    });
    expect(data.totalMatched).toBe(8);
    expect(data.boards.find((board) => board.board === "nclex")).toMatchObject({
      total: 5,
      trial: 2,
      paid: 3,
      free: 0,
      active7d: 3,
    });
    expect(data.unassigned).toBe(4);
    expect(data.fetchError).toBeUndefined();
  });

  it("uses the 7-day question counts when that view is selected", async () => {
    const data = await getAdminLeaderboard(
      parseLeaderboardFilters({ window: "7d" }),
      new Date("2026-11-13T18:00:00.000Z")
    );
    expect(data.rows[0]).toMatchObject({ questionsAnswered: 4, accuracyPct: 75 });
    const rankingCall = sqlQuery.mock.calls.find((call) => String(call[0]).includes("ROW_NUMBER()"));
    expect(rankingCall?.[1]).toContain("7d");
  });

  it("still renders when a query fails", async () => {
    sqlQuery.mockRejectedValue(new Error("timeout"));
    const data = await getAdminLeaderboard(filters, new Date("2026-11-13T18:00:00.000Z"));
    expect(data.rows).toEqual([]);
    expect(data.boards.every((board) => board.total === 0)).toBe(true);
    expect(data.fetchError).toMatch(/Could not load/);
  });
});
