"use client";

import { useState } from "react";
import Link from "next/link";
import { InlineError, StatusMessage } from "@/components/ui/StatusMessage";

type ActivityRow = {
  id: string;
  action: string;
  summary: string;
  createdAt: string | Date;
};

type Props = {
  userId: string;
  email: string;
  name: string | null;
  accountStatus: string;
  subscriptionLabel?: string | null;
  lastActiveAt?: string | Date | null;
  activityTimeline?: ActivityRow[];
  compact?: boolean;
};

export function CustomerServiceTools({
  userId,
  email,
  name,
  accountStatus,
  subscriptionLabel,
  lastActiveAt,
  activityTimeline = [],
  compact = false,
}: Props) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState<"email" | "reset" | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function sendEmail() {
    setBusy("email");
    setError(null);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/users/${userId}/send-email`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, body }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error ?? `HTTP ${res.status}`);
      setMessage("Email sent successfully.");
      setSubject("");
      setBody("");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(null);
    }
  }

  async function triggerPasswordReset() {
    if (!confirm(`Send a password reset link to ${email}?`)) return;
    setBusy("reset");
    setError(null);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/users/${userId}/trigger-password-reset`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error ?? `HTTP ${res.status}`);
      setMessage(data?.message ?? "Password reset email queued.");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className={`space-y-6 ${compact ? "" : "rounded-xl border border-slate-200 bg-white p-6"}`}>
      {!compact && (
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Customer service</h2>
          <p className="mt-1 text-sm text-slate-500">
            Send email, reset passwords, and review recent activity.
          </p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg bg-slate-50 p-4 text-sm">
          <p className="font-medium text-slate-900">{name ?? email}</p>
          <p className="mt-1 text-slate-600">{email}</p>
          <p className="mt-2 text-xs text-slate-500">
            Status: {accountStatus}
            {subscriptionLabel ? ` · ${subscriptionLabel}` : ""}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Last active:{" "}
            {lastActiveAt ? new Date(lastActiveAt).toLocaleString() : "—"}
          </p>
          <Link href={`/admin/users/${userId}`} className="mt-3 inline-block text-xs text-cyan-700 hover:underline">
            Full profile →
          </Link>
        </div>

        <div className="flex flex-col gap-2">
          <a
            href={`mailto:${encodeURIComponent(email)}`}
            className="rounded-lg border border-slate-200 px-4 py-2 text-center text-sm font-medium text-slate-800 hover:bg-slate-50"
          >
            Open in mail client
          </a>
          <button
            type="button"
            disabled={busy !== null}
            onClick={() => void triggerPasswordReset()}
            className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-900 hover:bg-amber-100 disabled:opacity-60"
          >
            {busy === "reset" ? "Sending…" : "Send password reset link"}
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-slate-800">Send email (Resend)</p>
        <input
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <textarea
          className="min-h-[120px] w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          placeholder="Message to the user…"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <button
          type="button"
          disabled={busy !== null || !subject.trim() || !body.trim()}
          onClick={() => void sendEmail()}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {busy === "email" ? "Sending…" : "Send email"}
        </button>
      </div>

      {error && <InlineError>{error}</InlineError>}
      {message && <StatusMessage variant="success">{message}</StatusMessage>}

      {activityTimeline.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium text-slate-800">Recent activity</p>
          <ul className="max-h-48 space-y-2 overflow-auto text-xs text-slate-600">
            {activityTimeline.slice(0, 12).map((row) => (
              <li key={row.id} className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
                <span className="font-medium text-slate-800">{row.action}</span>
                <span className="text-slate-500"> · {new Date(row.createdAt).toLocaleString()}</span>
                <p className="mt-0.5">{row.summary}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
