"use client";

import { useEffect, useState } from "react";
import { CustomerServiceTools } from "@/components/admin/CustomerServiceTools";
import { InlineError } from "@/components/ui/StatusMessage";
import { displayFirstLastInitial } from "@/lib/display-name";

type UserRow = {
  id: string;
  name: string | null;
  email: string;
  accountStatus: string;
  lastActiveAt: string | null;
};

type Profile = {
  user: {
    id: string;
    email: string;
    name: string | null;
    accountStatus: string;
    lastActiveAt: string | null;
  };
  subscription: { status: string; plan: string | null } | null;
  activityTimeline: Array<{
    id: string;
    action: string;
    summary: string;
    createdAt: string;
  }>;
};

export function AdminSupportConsole() {
  const [q, setQ] = useState("");
  const [rows, setRows] = useState<UserRow[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
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

  useEffect(() => {
    if (!selectedId) {
      setProfile(null);
      return;
    }
    fetch(`/api/internal/users/${selectedId}`, { credentials: "include" })
      .then(async (r) => {
        const data = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(data?.error ?? `HTTP ${r.status}`);
        return data.profile as Profile;
      })
      .then(setProfile)
      .catch((e) => setError(e instanceof Error ? e.message : String(e)));
  }, [selectedId]);

  const subscriptionLabel = profile?.subscription
    ? `${profile.subscription.status}${profile.subscription.plan ? ` (${profile.subscription.plan})` : ""}`
    : "No subscription";

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
      <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void search(q);
          }}
          className="flex gap-2"
        >
          <input
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            placeholder="Email or name…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button className="shrink-0 rounded-lg bg-slate-900 px-4 py-2 text-sm text-white">
            Search
          </button>
        </form>

        {error && <InlineError>{error}</InlineError>}

        <ul className="max-h-[480px] space-y-1 overflow-auto">
          {loading ? (
            <li className="px-2 py-4 text-sm text-slate-500">Loading…</li>
          ) : rows.length === 0 ? (
            <li className="px-2 py-4 text-sm text-slate-500">No users found.</li>
          ) : (
            rows.map((u) => (
              <li key={u.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(u.id)}
                  className={`w-full rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                    selectedId === u.id
                      ? "bg-slate-900 text-white"
                      : "hover:bg-slate-50 text-slate-800"
                  }`}
                >
                  <span className="font-medium">
                    {displayFirstLastInitial(u.name, u.email)}
                  </span>
                  <span
                    className={`mt-0.5 block text-xs ${
                      selectedId === u.id ? "text-slate-300" : "text-slate-500"
                    }`}
                  >
                    {u.email}
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
      </div>

      <div>
        {!selectedId || !profile ? (
          <div className="flex h-full min-h-[320px] items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white p-8 text-sm text-slate-500">
            Select a user to open customer service tools.
          </div>
        ) : (
          <CustomerServiceTools
            userId={profile.user.id}
            email={profile.user.email}
            name={profile.user.name}
            accountStatus={profile.user.accountStatus}
            subscriptionLabel={subscriptionLabel}
            lastActiveAt={profile.user.lastActiveAt}
            activityTimeline={profile.activityTimeline}
          />
        )}
      </div>
    </div>
  );
}
