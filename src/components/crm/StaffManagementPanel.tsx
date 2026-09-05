"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { InlineError } from "@/components/ui/StatusMessage";
import { displayFirstLastInitial } from "@/lib/display-name";

type StaffRow = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  accountStatus: string;
  lastActiveAt: string | null;
  createdAt: string;
};

type StaffApiResponse = {
  staff: StaffRow[];
  assignableRoles: string[];
  roleLabels: Record<string, string>;
  loginUrl: string;
};

export function StaffManagementPanel() {
  const [data, setData] = useState<StaffApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("support_staff");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [tempPassword, setTempPassword] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/internal/staff", { credentials: "include" });
      const json = (await res.json().catch(() => ({}))) as StaffApiResponse & { error?: string };
      if (!res.ok) throw new Error(json.error ?? `HTTP ${res.status}`);
      setData(json);
      if (json.assignableRoles?.length && !json.assignableRoles.includes(role)) {
        setRole(json.assignableRoles[0] ?? "support_staff");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load staff.");
    } finally {
      setLoading(false);
    }
  }, [role]);

  useEffect(() => {
    void load();
  }, [load]);

  async function onInvite(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setSuccess(null);
    setTempPassword(null);
    try {
      const res = await fetch("/api/internal/staff", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          role,
          ...(password.trim() ? { password: password.trim() } : {}),
        }),
      });
      const json = (await res.json().catch(() => ({}))) as {
        error?: string;
        message?: string;
        temporaryPassword?: string;
      };
      if (!res.ok) throw new Error(json.error ?? `HTTP ${res.status}`);
      setSuccess(json.message ?? "Employee updated.");
      if (json.temporaryPassword) setTempPassword(json.temporaryPassword);
      setName("");
      setEmail("");
      setPassword("");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invite failed.");
    } finally {
      setBusy(false);
    }
  }

  const roleLabels = data?.roleLabels ?? {};

  return (
    <div className="space-y-8">
      <section className="rounded-xl border border-black/10 bg-white p-5">
        <h2 className="text-sm font-semibold">Invite employee</h2>
        <p className="mt-1 text-xs text-black/60">
          Creates a new account or promotes an existing user. Share the login link:{" "}
          <Link className="link" href="/login?callbackUrl=%2Finternal">
            /login → Employee portal
          </Link>
        </p>

        <form onSubmit={onInvite} className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="mb-1 block text-xs font-medium text-black/70">Full name</span>
            <input
              className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-xs font-medium text-black/70">Work email</span>
            <input
              type="email"
              className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-xs font-medium text-black/70">Role</span>
            <select
              className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              {(data?.assignableRoles ?? ["support_staff"]).map((r) => (
                <option key={r} value={r}>
                  {roleLabels[r] ?? r}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-xs font-medium text-black/70">
              Password (optional)
            </span>
            <input
              type="text"
              autoComplete="new-password"
              className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Auto-generated if blank"
            />
          </label>
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={busy}
              className="rounded-lg bg-black px-4 py-2 text-sm text-white disabled:opacity-50"
            >
              {busy ? "Saving…" : "Create / promote employee"}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-3">
            <InlineError>{error}</InlineError>
          </div>
        )}
        {success && (
          <p className="mt-3 text-sm text-emerald-800">{success}</p>
        )}
        {tempPassword && (
          <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950">
            <p className="font-medium">Temporary password (copy now — shown once):</p>
            <code className="mt-1 block break-all font-mono text-xs">{tempPassword}</code>
            <p className="mt-2 text-xs text-amber-900/80">
              Employee signs in at /login, then opens /internal. They should change this password
              under Settings after first login.
            </p>
          </div>
        )}
      </section>

      <section className="rounded-xl border border-black/10 bg-white p-5">
        <h2 className="text-sm font-semibold">Current staff</h2>
        {loading ? (
          <p className="mt-3 text-sm text-black/60">Loading…</p>
        ) : (
          <div className="mt-3 overflow-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-black/5">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold">Employee</th>
                  <th className="px-3 py-2 text-left font-semibold">Role</th>
                  <th className="px-3 py-2 text-left font-semibold">Status</th>
                  <th className="px-3 py-2 text-left font-semibold">Last active</th>
                </tr>
              </thead>
              <tbody>
                {(data?.staff ?? []).length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-3 py-4 text-black/50">
                      No staff accounts yet.
                    </td>
                  </tr>
                ) : (
                  data?.staff.map((row) => (
                    <tr key={row.id} className="border-t border-black/5">
                      <td className="px-3 py-3">
                        <Link className="link" href={`/internal/users/${row.id}`}>
                          {displayFirstLastInitial(row.name, row.email)}
                        </Link>
                        <div className="mt-1 text-xs text-black/50">{row.email}</div>
                      </td>
                      <td className="px-3 py-3">{roleLabels[row.role] ?? row.role}</td>
                      <td className="px-3 py-3">{row.accountStatus}</td>
                      <td className="px-3 py-3">
                        {row.lastActiveAt
                          ? new Date(row.lastActiveAt).toLocaleString()
                          : "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
