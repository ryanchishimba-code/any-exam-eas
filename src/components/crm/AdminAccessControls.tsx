"use client";

import { useState } from "react";

export function AdminAccessControls({ userId }: { userId: string }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function patch(body: Record<string, unknown>) {
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/internal/users/${userId}/access`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      setMessage("Access updated.");
      window.location.reload();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Update failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="rounded-xl border border-amber-200/60 bg-amber-50/40 p-4">
      <h2 className="text-sm font-semibold">Access management</h2>
      <p className="mt-1 text-xs text-black/60">Admin only — suspend, extend trial, or grant comp access.</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={busy}
          className="rounded-lg border border-black/10 bg-white px-3 py-1.5 text-xs hover:bg-black/[0.03]"
          onClick={() => void patch({ accountStatus: "suspended" })}
        >
          Suspend account
        </button>
        <button
          type="button"
          disabled={busy}
          className="rounded-lg border border-black/10 bg-white px-3 py-1.5 text-xs hover:bg-black/[0.03]"
          onClick={() => void patch({ accountStatus: "active" })}
        >
          Reactivate
        </button>
        <button
          type="button"
          disabled={busy}
          className="rounded-lg border border-black/10 bg-white px-3 py-1.5 text-xs hover:bg-black/[0.03]"
          onClick={() => void patch({ extendTrialDays: 7 })}
        >
          +7 day trial
        </button>
        <button
          type="button"
          disabled={busy}
          className="rounded-lg border border-blue-300 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-900 hover:bg-blue-100"
          onClick={() => void patch({ grantCompDays: 30 })}
        >
          Grant 30d comp access
        </button>
        <button
          type="button"
          disabled={busy}
          className="rounded-lg border border-orange-300 bg-orange-50 px-3 py-1.5 text-xs font-medium text-orange-900 hover:bg-orange-100"
          onClick={() => void patch({ revokeCompAccess: true, subscriptionStatus: "inactive" })}
        >
          Revoke comp access
        </button>
      </div>
      {message && <p className="mt-3 text-xs text-black/70">{message}</p>}
    </section>
  );
}
