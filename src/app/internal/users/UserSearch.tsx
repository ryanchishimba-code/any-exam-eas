"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileCheck2, RefreshCw, ShieldCheck } from "lucide-react";
import { InlineError } from "@/components/ui/StatusMessage";
import type { BillingCycleSummary } from "@/lib/crm/billing-cycle";
import type { ConsentListSummary } from "@/lib/legal/consent-record";
import { displayFirstLastInitial } from "@/lib/display-name";

type InternalUserRow = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  accountStatus: string;
  lastActiveAt: string | null;
  createdAt: string;
  consent?: ConsentListSummary;
  billing?: BillingCycleSummary;
};

const BILLING_TONE: Record<
  NonNullable<BillingCycleSummary["urgency"]>,
  string
> = {
  calm: "border-emerald-200/80 bg-emerald-50/80 text-emerald-900",
  soon: "border-amber-200/80 bg-amber-50/90 text-amber-950",
  urgent: "border-orange-200/80 bg-orange-50 text-orange-950",
  past_due: "border-red-200/80 bg-red-50 text-red-900",
  trial: "border-violet-200/80 bg-violet-50/90 text-violet-950",
  none: "border-black/10 bg-black/[0.03] text-black/55",
};

function BillingChip({ billing }: { billing: BillingCycleSummary }) {
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

function ConsentCell({
  userId,
  consent,
}: {
  userId: string;
  consent: ConsentListSummary;
}) {
  const accepted = new Date(consent.acceptedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="flex flex-col gap-1.5">
      <Link
        href={`/internal/users/${userId}/consent`}
        className="inline-flex w-fit items-center gap-1.5 rounded-lg border border-sky-200/80 bg-sky-50 px-2.5 py-1.5 text-xs font-semibold text-sky-900 transition hover:bg-sky-100"
      >
        <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
        View consent
      </Link>
      <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-black/50">
        <span className="inline-flex items-center gap-1">
          <FileCheck2 className="h-3 w-3" aria-hidden />
          {accepted}
        </span>
        <span
          className={`rounded-full px-1.5 py-0.5 font-medium ${
            consent.source === "recorded"
              ? "bg-sky-100/80 text-sky-800"
              : "bg-amber-100/80 text-amber-900"
          }`}
        >
          {consent.source === "recorded" ? "On file" : "Inferred"}
        </span>
      </div>
    </div>
  );
}

export default function UserSearch({ showAdminColumns = false }: { showAdminColumns?: boolean }) {
  const [q, setQ] = useState("");
  const [rows, setRows] = useState<InternalUserRow[]>([]);
  const [adminColumns, setAdminColumns] = useState(showAdminColumns);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadUsers(query: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/internal/users?q=${encodeURIComponent(query.trim())}`, {
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error ?? `HTTP ${res.status}`);
      setRows(data.users ?? []);
      if (typeof data.adminColumns === "boolean") setAdminColumns(data.adminColumns);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadUsers("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    await loadUsers(q);
  }

  const colSpan = adminColumns ? 6 : 4;

  return (
    <div className="space-y-4">
      <form onSubmit={onSubmit} className="flex gap-2">
        <input
          className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm"
          placeholder="Search by email or name…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button className="rounded-lg bg-black px-4 py-2 text-sm text-white">Search</button>
      </form>

      {adminColumns ? (
        <p className="text-xs text-black/45">
          Admin columns: consent vault &amp; membership (trial / paid) — visible to administrators only.
        </p>
      ) : null}

      {error && <InlineError>Failed: {error}</InlineError>}

      {loading ? (
        <p className="text-sm text-black/60">Searching…</p>
      ) : (
        <div className="overflow-auto rounded-xl border border-black/10 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-black/5">
              <tr>
                <th className="px-3 py-2 text-left font-semibold">User</th>
                <th className="px-3 py-2 text-left font-semibold">Role</th>
                <th className="px-3 py-2 text-left font-semibold">Status</th>
                {adminColumns ? (
                  <>
                    <th className="px-3 py-2 text-left font-semibold">Consent</th>
                    <th className="px-3 py-2 text-left font-semibold">Membership</th>
                  </>
                ) : null}
                <th className="px-3 py-2 text-left font-semibold">Last active</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td className="px-3 py-4 text-black/50" colSpan={colSpan}>
                    No users found yet.
                  </td>
                </tr>
              ) : (
                rows.map((u) => (
                  <tr key={u.id} className="border-t border-black/5 align-top">
                    <td className="px-3 py-3">
                      <Link className="link" href={`/internal/users/${u.id}`}>
                        {displayFirstLastInitial(u.name, u.email)}
                      </Link>
                      <div className="mt-1 text-xs text-black/50">{u.email}</div>
                    </td>
                    <td className="px-3 py-3">{u.role}</td>
                    <td className="px-3 py-3">{u.accountStatus}</td>
                    {adminColumns ? (
                      <>
                        <td className="px-3 py-3 min-w-[9rem]">
                          {u.consent ? (
                            <ConsentCell userId={u.id} consent={u.consent} />
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="px-3 py-3 min-w-[11rem]">
                          {u.billing ? <BillingChip billing={u.billing} /> : "—"}
                        </td>
                      </>
                    ) : null}
                    <td className="px-3 py-3 whitespace-nowrap">
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
