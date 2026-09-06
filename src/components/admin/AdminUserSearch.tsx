"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { RefreshCw } from "lucide-react";
import { InlineError } from "@/components/ui/StatusMessage";
import type { BillingCycleSummary } from "@/lib/crm/billing-cycle";
import { displayFirstLastInitial } from "@/lib/display-name";

type UserRow = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  accountStatus: string;
  lastActiveAt: string | null;
  createdAt: string;
  billing?: BillingCycleSummary;
};

const BILLING_TONE: Record<BillingCycleSummary["urgency"], string> = {
  calm: "border-emerald-200/80 bg-emerald-50/80 text-emerald-900",
  soon: "border-amber-200/80 bg-amber-50/90 text-amber-950",
  urgent: "border-orange-200/80 bg-orange-50 text-orange-950",
  past_due: "border-red-200/80 bg-red-50 text-red-900",
  trial: "border-violet-200/80 bg-violet-50/90 text-violet-950",
  none: "border-slate-200 bg-slate-50 text-slate-600",
};

function MembershipChip({ billing }: { billing: BillingCycleSummary }) {
  const tone = BILLING_TONE[billing.urgency];
  return (
    <div className={`rounded-xl border px-2.5 py-2 ${tone}`}>
      <div className="flex items-center gap-1.5 text-xs font-semibold">
        <RefreshCw className="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden />
        {billing.label}
      </div>
      <p className="mt-0.5 text-[11px] leading-snug opacity-80">{billing.detail}</p>
    </div>
  );
}

export function AdminUserSearch() {
  const [q, setQ] = useState("");
  const [rows, setRows] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function search(term: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/internal/users?q=${encodeURIComponent(term.trim())}`, {
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error ?? `HTTP ${res.status}`);
      setRows(data.users ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void search("");
  }, []);

  return (
    <div className="space-y-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void search(q);
        }}
        className="flex gap-2"
      >
        <input
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
          placeholder="Search by email or name…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white">
          Search
        </button>
      </form>

      {error && <InlineError>{error}</InlineError>}

      {loading ? (
        <p className="text-sm text-slate-500">Searching…</p>
      ) : (
        <div className="overflow-auto rounded-xl border border-slate-200 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">User</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">Role</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">Status</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">Membership</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">Last active</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td className="px-3 py-4 text-slate-500" colSpan={5}>
                    No users found.
                  </td>
                </tr>
              ) : (
                rows.map((u) => (
                  <tr key={u.id} className="border-t border-slate-100 align-top">
                    <td className="px-3 py-3">
                      <Link
                        className="font-medium text-cyan-700 hover:underline"
                        href={`/admin/users/${u.id}`}
                      >
                        {displayFirstLastInitial(u.name, u.email)}
                      </Link>
                      <div className="mt-1 text-xs text-slate-500">{u.email}</div>
                    </td>
                    <td className="px-3 py-3 text-slate-700">{u.role}</td>
                    <td className="px-3 py-3 text-slate-700">{u.accountStatus}</td>
                    <td className="px-3 py-3 min-w-[11rem]">
                      {u.billing ? <MembershipChip billing={u.billing} /> : "—"}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-slate-600">
                      {u.lastActiveAt ? new Date(u.lastActiveAt).toLocaleString() : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
