import Link from "next/link";
import { LeaderboardFilters } from "@/components/admin/LeaderboardFilters";
import type { AdminLeaderboardData, BoardCensus, LeaderboardRow } from "@/lib/admin/leaderboard";
import {
  formatChicagoDate,
  leaderboardBoardLabel,
  type LeaderboardPlan,
} from "@/lib/admin/leaderboard-rules";
import { displayFirstLastInitial } from "@/lib/display-name";

const PLAN_LABEL: Record<LeaderboardPlan, string> = {
  trial: "Trial",
  paid: "Paid",
  free: "Free",
};

const PLAN_CHIP: Record<LeaderboardPlan, string> = {
  trial:
    "rounded-full border border-violet-200 bg-violet-50 px-2 py-0.5 text-xs font-medium text-violet-950",
  paid: "rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-800",
  free: "rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-600",
};

function BoardCard({ board }: { board: BoardCensus }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <p className="text-xs font-medium text-slate-500 dark:text-zinc-400">{board.label}</p>
      <p className="mt-2 text-2xl font-semibold tabular-nums text-slate-900 dark:text-zinc-50">
        {board.total.toLocaleString()}
      </p>
      <p className="mt-1 text-[0.6875rem] text-slate-400 dark:text-zinc-500">
        Trial {board.trial.toLocaleString()} · Paid {board.paid.toLocaleString()} · Free{" "}
        {board.free.toLocaleString()}
      </p>
      <p className="mt-1 text-[0.6875rem] text-slate-400 dark:text-zinc-500">
        {board.active7d.toLocaleString()} active in 7 days
      </p>
    </div>
  );
}

function StudentCell({ row }: { row: LeaderboardRow }) {
  return (
    <td className="px-3 py-3">
      <Link className="font-medium text-cyan-700 hover:underline" href={`/admin/users/${row.userId}`}>
        {displayFirstLastInitial(row.name, row.email)}
      </Link>
      <div className="mt-1 text-xs text-slate-500">{row.email}</div>
    </td>
  );
}

export function AdminLeaderboard({ data }: { data: AdminLeaderboardData }) {
  const { filters } = data;
  const questionsLabel = filters.metric === "questions" && filters.window === "7d" ? "Last 7 days" : "All time";
  const rankingTitle = filters.metric === "streak" ? "Study streak" : "Questions answered";
  const shown = data.rows.length;
  const since = formatChicagoDate(`${data.windowStartDate}T18:00:00.000Z`);

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-indigo-200/60 bg-gradient-to-br from-indigo-50/90 to-white p-5 dark:border-indigo-500/20 dark:from-indigo-950/40 dark:to-zinc-900">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-indigo-900/80 dark:text-indigo-200/90">
          Students per board
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-zinc-400">
          Active student accounts on the board they selected. Active in 7 days means a sign-in or a
          saved answer since {since}, America/Chicago.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {data.boards.map((board) => (
            <BoardCard key={board.board} board={board} />
          ))}
        </div>
        {data.unassigned > 0 ? (
          <p className="mt-4 text-xs text-slate-500 dark:text-zinc-400">
            {data.unassigned.toLocaleString()} active{" "}
            {data.unassigned === 1 ? "student has" : "students have"} no board selected.
          </p>
        ) : null}
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-zinc-400">
            {rankingTitle}
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
            Top {shown.toLocaleString()} of {data.totalMatched.toLocaleString()}
            {filters.metric === "questions" ? ` · ${questionsLabel.toLowerCase()}` : ""}. Days follow
            America/Chicago.
          </p>
        </div>

        <LeaderboardFilters filters={filters} />

        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
              <tr>
                <th className="px-3 py-3 font-medium">Rank</th>
                <th className="px-3 py-3 font-medium">Student</th>
                <th className="px-3 py-3 font-medium">Board</th>
                <th className="px-3 py-3 font-medium">Plan</th>
                <th className="px-3 py-3 font-medium">
                  Questions
                  <span className="mt-1 block font-normal normal-case tracking-normal text-slate-400 dark:text-zinc-500">
                    {questionsLabel}
                  </span>
                </th>
                <th className="px-3 py-3 font-medium">Accuracy</th>
                <th className="px-3 py-3 font-medium">Current streak</th>
                <th className="px-3 py-3 font-medium">Longest streak</th>
                <th className="px-3 py-3 font-medium">Last active</th>
              </tr>
            </thead>
            <tbody>
              {data.rows.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-10 text-center text-slate-500">
                    No students match these filters.
                  </td>
                </tr>
              ) : (
                data.rows.map((row) => (
                  <tr
                    key={row.userId}
                    className="border-b border-slate-100 last:border-0 dark:border-zinc-800"
                  >
                    <td className="px-3 py-3 tabular-nums font-medium text-slate-900 dark:text-zinc-100">
                      {row.rank}
                    </td>
                    <StudentCell row={row} />
                    <td className="px-3 py-3 text-slate-600 dark:text-zinc-300">
                      {leaderboardBoardLabel(row.board)}
                    </td>
                    <td className="px-3 py-3">
                      <span className={PLAN_CHIP[row.plan]}>{PLAN_LABEL[row.plan]}</span>
                    </td>
                    <td className="px-3 py-3 tabular-nums text-slate-700 dark:text-zinc-200">
                      {row.questionsAnswered.toLocaleString()}
                    </td>
                    <td className="px-3 py-3 tabular-nums text-slate-700 dark:text-zinc-200">
                      {row.accuracyPct == null ? "—" : `${row.accuracyPct}%`}
                    </td>
                    <td className="px-3 py-3 tabular-nums text-slate-700 dark:text-zinc-200">
                      {row.currentStreak.toLocaleString()}
                    </td>
                    <td className="px-3 py-3 tabular-nums text-slate-700 dark:text-zinc-200">
                      {row.longestStreak.toLocaleString()}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-slate-600 dark:text-zinc-300">
                      {formatChicagoDate(row.lastActiveAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-slate-500 dark:text-zinc-400">
          A streak day is a Chicago calendar day with at least one saved answer. The current streak
          stays alive through yesterday. Paid includes a live subscription, an open pay-once window,
          and complimentary access that has not expired. Questions in the last 7 days use the same
          Chicago dates, from {since} through today.
        </p>
      </section>
    </div>
  );
}
