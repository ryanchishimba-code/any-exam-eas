import Link from "next/link";
import { loadMarketingReport } from "@/lib/admin/marketing-report";
import {
  filterMarketingPasses,
  passStatus,
  summarizeCampaign,
  type MarketingPass,
} from "@/lib/promo/marketing-phase";

export const metadata = {
  title: "Marketing Phase 1 — Admin",
};

type Search = { audience?: string; status?: string };

function formatWhen(value: Date | null): string {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(value);
}

function exportHref(audience: string, status: string): string {
  const params = new URLSearchParams();
  if (audience !== "all") params.set("audience", audience);
  if (status !== "all") params.set("status", status);
  const query = params.toString();
  return query ? `/api/admin/marketing/export?${query}` : "/api/admin/marketing/export";
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
      <p className="text-sm text-slate-600 dark:text-zinc-300">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-950 dark:text-zinc-50">{value}</p>
    </div>
  );
}

function PassCards({ rows }: { rows: MarketingPass[] }) {
  if (rows.length === 0) {
    return <p className="text-sm text-slate-700 dark:text-zinc-200">No codes match this filter.</p>;
  }
  return (
    <ul className="space-y-3 md:hidden">
      {rows.map((row) => (
        <li
          key={row.code}
          className="rounded-2xl border border-slate-200 bg-white p-4 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        >
          <p className="font-mono text-base font-semibold text-slate-950 dark:text-zinc-50">{row.code}</p>
          <dl className="mt-3 grid grid-cols-2 gap-2 text-slate-800 dark:text-zinc-100">
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-zinc-400">Audience</dt>
              <dd>{row.audience ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-zinc-400">Status</dt>
              <dd className="capitalize">{passStatus(row)}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-zinc-400">Redeemed</dt>
              <dd>{formatWhen(row.redeemedAt)}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-zinc-400">Email</dt>
              <dd className="break-all">{row.redeemerEmail ?? "—"}</dd>
            </div>
          </dl>
        </li>
      ))}
    </ul>
  );
}

export default async function MarketingPhasePage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const params = await searchParams;
  const audience = params.audience === "nursing" || params.audience === "pharmacy" ? params.audience : "all";
  const status = params.status === "unused" || params.status === "redeemed" ? params.status : "all";
  const report = await loadMarketingReport();
  const totals = summarizeCampaign(report.passes);
  const rows = filterMarketingPasses(report.passes, { audience, status });

  return (
    <div className="space-y-8 text-slate-900 dark:text-zinc-100">
      <div>
        <p className="text-sm font-medium text-indigo-700 dark:text-indigo-300">Marketing</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950 dark:text-zinc-50">
          {totals.campaign}
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-600 dark:text-zinc-300">
          Read-only redemption tracker for the printed pass codes. Nothing on this page changes a code or a user.
        </p>
      </div>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Issued" value={String(totals.issued)} />
        <Stat label="Redeemed" value={String(totals.redeemed)} />
        <Stat label="Redeemed %" value={`${totals.redeemedPercent}%`} />
        <Stat
          label="Nursing / pharmacy"
          value={`${totals.nursingIssued} / ${totals.pharmacyIssued}`}
        />
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        <Stat label="Nursing redeemed" value={`${totals.nursingRedeemed} of ${totals.nursingIssued}`} />
        <Stat label="Pharmacy redeemed" value={`${totals.pharmacyRedeemed} of ${totals.pharmacyIssued}`} />
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-lg font-semibold text-slate-950 dark:text-zinc-50">Codes</h2>
          <form method="get" className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <label className="text-sm text-slate-700 dark:text-zinc-200">
              Audience
              <select
                name="audience"
                defaultValue={audience}
                className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-950 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-50"
              >
                <option value="all">All</option>
                <option value="nursing">Nursing</option>
                <option value="pharmacy">Pharmacy</option>
              </select>
            </label>
            <label className="text-sm text-slate-700 dark:text-zinc-200">
              Status
              <select
                name="status"
                defaultValue={status}
                className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-950 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-50"
              >
                <option value="all">All</option>
                <option value="unused">Unused</option>
                <option value="redeemed">Redeemed</option>
              </select>
            </label>
            <button
              type="submit"
              className="rounded-lg bg-indigo-700 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-800 dark:bg-indigo-500 dark:text-zinc-950 dark:hover:bg-indigo-400"
            >
              Apply filter
            </button>
            <Link
              href={exportHref(audience, status)}
              className="rounded-lg border border-slate-300 px-4 py-2 text-center text-sm font-medium text-slate-900 hover:bg-slate-100 dark:border-zinc-600 dark:text-zinc-50 dark:hover:bg-zinc-800"
            >
              Download CSV
            </Link>
          </form>
        </div>

        <PassCards rows={rows} />

        <div className="hidden overflow-x-auto rounded-2xl border border-slate-200 dark:border-zinc-700 md:block">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-200">
              <tr>
                <th className="px-4 py-3 font-medium">Code</th>
                <th className="px-4 py-3 font-medium">Audience</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Redeemed</th>
                <th className="px-4 py-3 font-medium">Email</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-zinc-900">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-slate-700 dark:text-zinc-200">
                    No codes match this filter.
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.code} className="border-t border-slate-200 dark:border-zinc-800">
                    <td className="px-4 py-3 font-mono text-slate-950 dark:text-zinc-50">{row.code}</td>
                    <td className="px-4 py-3 capitalize">{row.audience ?? "—"}</td>
                    <td className="px-4 py-3 capitalize">{passStatus(row)}</td>
                    <td className="px-4 py-3">{formatWhen(row.redeemedAt)}</td>
                    <td className="px-4 py-3">{row.redeemerEmail ?? "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-950 dark:text-zinc-50">Active complimentary users</h2>
        <p className="text-sm text-slate-600 dark:text-zinc-300">
          Accounts whose complimentary Pro access is still in the future.
        </p>
        {report.activeCompUsers.length === 0 ? (
          <p className="text-sm text-slate-700 dark:text-zinc-200">No active complimentary users.</p>
        ) : (
          <ul className="space-y-3">
            {report.activeCompUsers.map((user) => (
              <li
                key={`${user.email}-${user.compAccessUntil.toISOString()}`}
                className="rounded-2xl border border-slate-200 bg-white p-4 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              >
                <p className="break-all font-medium text-slate-950 dark:text-zinc-50">{user.email}</p>
                <p className="mt-1 text-slate-700 dark:text-zinc-200">
                  Access ends {formatWhen(user.compAccessUntil)}
                  {user.audience ? ` · ${user.audience}` : ""}
                  {user.campaign ? ` · ${user.campaign}` : ""}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
