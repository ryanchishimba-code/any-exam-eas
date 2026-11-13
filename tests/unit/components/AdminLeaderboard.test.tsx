import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AdminLeaderboard } from "@/components/admin/AdminLeaderboard";
import type { AdminLeaderboardData } from "@/lib/admin/leaderboard";
import { LEADERBOARD_BOARDS } from "@/lib/admin/leaderboard-rules";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => "/admin/leaderboard",
}));

const data: AdminLeaderboardData = {
  filters: { metric: "questions", window: "all", board: "all", plan: "all" },
  totalMatched: 2,
  unassigned: 1,
  windowStartDate: "2026-11-07",
  today: "2026-11-13",
  generatedAt: "2026-11-13T18:00:00.000Z",
  boards: LEADERBOARD_BOARDS.map((board) => ({
    board: board.id,
    label: board.label,
    total: board.id === "nclex" ? 4 : 0,
    trial: board.id === "nclex" ? 1 : 0,
    paid: board.id === "nclex" ? 2 : 0,
    free: board.id === "nclex" ? 1 : 0,
    active7d: board.id === "nclex" ? 3 : 0,
  })),
  rows: [
    {
      rank: 1,
      userId: "user_1",
      name: "Ava Stone",
      email: "ava@example.com",
      board: "nclex",
      plan: "paid",
      questionsAnswered: 42,
      accuracyPct: 81,
      currentStreak: 6,
      longestStreak: 9,
      lastActiveAt: "2026-11-13T18:00:00.000Z",
    },
  ],
};

describe("AdminLeaderboard", () => {
  it("shows the board census and the ranking row", () => {
    render(<AdminLeaderboard data={data} />);

    expect(screen.getByRole("heading", { name: "Students per board" })).toBeInTheDocument();
    for (const label of ["NCLEX", "NAPLEX", "PANCE", "AANP FNP", "USMLE", "NPTE-PT"]) {
      expect(screen.getAllByText(label).length).toBeGreaterThan(0);
    }
    expect(screen.getByText("Trial 1 · Paid 2 · Free 1")).toBeInTheDocument();
    expect(screen.getByText("3 active in 7 days")).toBeInTheDocument();
    expect(screen.getByText(/no board selected/i)).toBeInTheDocument();

    expect(screen.getByRole("link", { name: "Ava S." })).toHaveAttribute("href", "/admin/users/user_1");
    expect(screen.getByText("ava@example.com")).toBeInTheDocument();
    expect(screen.getByText("Paid", { selector: "span" })).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByText("81%")).toBeInTheDocument();
    expect(screen.getByText("6")).toBeInTheDocument();
    expect(screen.getByText("9")).toBeInTheDocument();
    expect(screen.getByText("Nov 13, 2026")).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Ranking" })).toHaveValue("questions");
  });
});
