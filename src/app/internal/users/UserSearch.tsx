"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type InternalUserRow = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  accountStatus: string;
  lastActiveAt: string | null;
  createdAt: string;
};

export default function UserSearch() {
  const [q, setQ] = useState("");
  const [rows, setRows] = useState<InternalUserRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/internal/users?q=${encodeURIComponent(q.trim())}`, {
      credentials: "include",
    })
      .then(async (r) => {
        const data = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(data?.error ?? `HTTP ${r.status}`);
        return data.users as InternalUserRow[];
      })
      .then(setRows)
      .catch((e) => setError(e instanceof Error ? e.message : String(e)))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/internal/users?q=${encodeURIComponent(q.trim())}`,
        { credentials: "include" }
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error ?? `HTTP ${res.status}`);
      setRows(data.users ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={onSubmit} className="flex gap-2">
        <input
          className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm"
          placeholder="Search by email or name…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button className="rounded-lg bg-black px-4 py-2 text-sm text-white">
          Search
        </button>
      </form>

      {error && <p className="text-sm text-red-700">Failed: {error}</p>}

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
                <th className="px-3 py-2 text-left font-semibold">Last active</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td className="px-3 py-4 text-black/50" colSpan={4}>
                    No users found yet.
                  </td>
                </tr>
              ) : (
                rows.map((u) => (
                  <tr key={u.id} className="border-t border-black/5">
                    <td className="px-3 py-3">
                      <Link
                        className="link"
                        href={`/internal/users/${u.id}`}
                      >
                        {u.name ?? u.email}
                      </Link>
                      <div className="mt-1 text-xs text-black/50">
                        {u.email}
                      </div>
                    </td>
                    <td className="px-3 py-3">{u.role}</td>
                    <td className="px-3 py-3">{u.accountStatus}</td>
                    <td className="px-3 py-3">
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

