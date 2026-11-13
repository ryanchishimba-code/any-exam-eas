/** Boards shown on the admin leaderboard. No database or catalog imports. */
export const LEADERBOARD_BOARDS = [
  { id: "nclex", label: "NCLEX" },
  { id: "naplex", label: "NAPLEX" },
  { id: "pance", label: "PANCE" },
  { id: "aanp-fnp", label: "AANP FNP" },
  { id: "usmle", label: "USMLE" },
  { id: "npte-pt", label: "NPTE-PT" },
] as const;

export type LeaderboardBoardId = (typeof LEADERBOARD_BOARDS)[number]["id"];
export type LeaderboardPlan = "trial" | "paid" | "free";
export type LeaderboardMetric = "questions" | "streak";
export type LeaderboardWindow = "all" | "7d";

export type LeaderboardQuery = {
  metric: LeaderboardMetric;
  window: LeaderboardWindow;
  board: LeaderboardBoardId | "all";
  plan: LeaderboardPlan | "all";
};
