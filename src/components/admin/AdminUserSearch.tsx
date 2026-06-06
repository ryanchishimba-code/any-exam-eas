"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { InlineError } from "@/components/ui/StatusMessage";

type UserRow = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  accountStatus: string;
  lastActiveAt: string | null;
  createdAt: string;
};

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
                <th className="px-3 py-2 text-left font-semibold text-slate-700">Last active</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td className="px-3 py-4 text-slate-500" colSpan={4}>
                    No users found.
                  </td>
                </tr>
              ) : (
                rows.map((u) => (
                  <tr key={u.id} className="border-t border-slate-100">
                    <td className="px-3 py-3">
                      <Link
                        className="font-medium text-cyan-700 hover:underline"
                        href={`/admin/users/${u.id}`}
                      >
                        {u.name ?? u.email}
                      </Link>
                      <div className="mt-1 text-xs text-slate-500">{u.email}</div>
                    </td>
                    <td className="px-3 py-3 text-slate-700">{u.role}</td>
                    <td className="px-3 py-3 text-slate-700">{u.accountStatus}</td>
                    <td className="px-3 py-3 text-slate-600">
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
