"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  LEADERBOARD_BOARDS,
  type LeaderboardQuery,
} from "@/lib/admin/leaderboard-boards";

const selectClass =
  "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100";

export function LeaderboardFilters({ filters }: { filters: LeaderboardQuery }) {
  const router = useRouter();
  const pathname = usePathname();

  function update(partial: Partial<LeaderboardQuery>) {
    const next = { ...filters, ...partial };
    const params = new URLSearchParams();
    if (next.metric !== "questions") params.set("metric", next.metric);
    if (next.window !== "all") params.set("window", next.window);
    if (next.board !== "all") params.set("board", next.board);
    if (next.plan !== "all") params.set("plan", next.plan);
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 sm:flex-row sm:flex-wrap sm:items-end">
      <label className="flex min-w-[11rem] flex-1 flex-col gap-1">
        <span className="text-xs font-medium text-slate-500 dark:text-zinc-400">Ranking</span>
        <select
          className={selectClass}
          value={filters.metric}
          onChange={(event) =>
            update({ metric: event.target.value === "streak" ? "streak" : "questions" })
          }
        >
          <option value="questions">Questions answered</option>
          <option value="streak">Study streak</option>
        </select>
      </label>
      <label className="flex min-w-[11rem] flex-1 flex-col gap-1">
        <span className="text-xs font-medium text-slate-500 dark:text-zinc-400">
          Questions window
        </span>
        <select
          className={selectClass}
          value={filters.window}
          disabled={filters.metric === "streak"}
          onChange={(event) => update({ window: event.target.value === "7d" ? "7d" : "all" })}
        >
          <option value="all">All time</option>
          <option value="7d">Last 7 days</option>
        </select>
      </label>
      <label className="flex min-w-[11rem] flex-1 flex-col gap-1">
        <span className="text-xs font-medium text-slate-500 dark:text-zinc-400">Board</span>
        <select
          className={selectClass}
          value={filters.board}
          onChange={(event) =>
            update({
              board: LEADERBOARD_BOARDS.some((board) => board.id === event.target.value)
                ? (event.target.value as LeaderboardQuery["board"])
                : "all",
            })
          }
        >
          <option value="all">All boards</option>
          {LEADERBOARD_BOARDS.map((board) => (
            <option key={board.id} value={board.id}>
              {board.label}
            </option>
          ))}
        </select>
      </label>
      <label className="flex min-w-[11rem] flex-1 flex-col gap-1">
        <span className="text-xs font-medium text-slate-500 dark:text-zinc-400">Plan</span>
        <select
          className={selectClass}
          value={filters.plan}
          onChange={(event) => {
            const plan = event.target.value;
            update({
              plan: plan === "trial" || plan === "paid" || plan === "free" ? plan : "all",
            });
          }}
        >
          <option value="all">All plans</option>
          <option value="trial">Trial</option>
          <option value="paid">Paid</option>
          <option value="free">Free</option>
        </select>
      </label>
    </div>
  );
}
