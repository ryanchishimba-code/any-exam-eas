import { AlertTriangle } from "lucide-react";
import { AdminLeaderboard } from "@/components/admin/AdminLeaderboard";
import { getAdminLeaderboard } from "@/lib/admin/leaderboard";
import { parseLeaderboardFilters } from "@/lib/admin/leaderboard-rules";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Study leaderboard — Admin",
  robots: { index: false, follow: false },
};

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminLeaderboardPage({ searchParams }: Props) {
  const params = await searchParams;
  const filters = parseLeaderboardFilters({
    metric: first(params.metric),
    window: first(params.window),
    board: first(params.board),
    plan: first(params.plan),
  });
  const data = await getAdminLeaderboard(filters);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-zinc-50">
          Study leaderboard
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
          Who is studying the most. Staff, suspended accounts, and internal test inboxes are left out.
        </p>
      </div>

      {data.fetchError ? (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300"
        >
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <p>
            <strong className="font-semibold">Partial data failure:</strong> {data.fetchError}
          </p>
        </div>
      ) : null}

      <AdminLeaderboard data={data} />
    </div>
  );
}
