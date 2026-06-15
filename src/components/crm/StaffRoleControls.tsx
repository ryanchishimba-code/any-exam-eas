"use client";

import { useState } from "react";

const ROLE_LABELS: Record<string, string> = {
  user: "Customer (no portal)",
  support_staff: "Support staff",
  moderator: "Moderator",
  admin: "Admin",
  super_admin: "Super admin",
};

export function StaffRoleControls({
  userId,
  currentRole,
  actorRole,
}: {
  userId: string;
  currentRole: string;
  actorRole: string;
}) {
  const [role, setRole] = useState(currentRole);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const assignable =
    actorRole === "super_admin"
      ? ["user", "support_staff", "moderator", "admin", "super_admin"]
      : ["user", "support_staff", "moderator"];

  async function saveRole() {
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/internal/users/${userId}/role`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string; message?: string };
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      setMessage(data.message ?? "Role updated.");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Update failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="rounded-xl border border-violet-200/70 bg-violet-50/40 p-4">
      <h2 className="text-sm font-semibold">Staff role</h2>
      <p className="mt-1 text-xs text-black/60">
        Grant or revoke employee portal access. User must sign out and back in after changes.
      </p>
      <div className="mt-4 flex flex-wrap items-end gap-2">
        <label className="text-sm">
          <span className="mb-1 block text-xs font-medium text-black/70">Role</span>
          <select
            className="rounded-lg border border-black/10 bg-white px-3 py-2 text-sm"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            {assignable.map((r) => (
              <option key={r} value={r}>
                {ROLE_LABELS[r] ?? r}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          disabled={busy || role === currentRole}
          className="rounded-lg border border-violet-300 bg-violet-100 px-3 py-2 text-xs font-medium text-violet-950 hover:bg-violet-200 disabled:opacity-50"
          onClick={() => void saveRole()}
        >
          {busy ? "Saving…" : "Update role"}
        </button>
      </div>
      {message && <p className="mt-3 text-xs text-black/70">{message}</p>}
    </section>
  );
}
