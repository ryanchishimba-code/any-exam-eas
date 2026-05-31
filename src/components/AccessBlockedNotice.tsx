"use client";

import { useState } from "react";
import { Button } from "./ui/Button";

export function AccessBlockedNotice({
  reason,
}: {
  reason: "suspended" | "email_unverified";
}) {
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function resendVerification() {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/auth/resend-verification", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      setMessage(data.message ?? (res.ok ? "Email sent." : data.error ?? "Failed."));
    } catch {
      setMessage("Could not send email. Try again later.");
    } finally {
      setLoading(false);
    }
  }

  if (reason === "suspended") {
    return (
      <div className="apple-card mt-10 a11y-banner a11y-banner--error flex-col items-center p-8 text-center">
        <h2 className="text-xl font-semibold">Account suspended</h2>
        <p className="mt-3 text-sm">
          Your account has been suspended. Contact support if you believe this is an error.
        </p>
      </div>
    );
  }

  return (
    <div className="apple-card mt-10 border-sky-200/60 bg-sky-50/50 p-8 text-center">
      <h2 className="text-xl font-semibold text-sky-950">Verify your email</h2>
      <p className="mt-3 text-sm text-sky-900/80">
        We sent a verification link when you signed up. Confirm your email to access study
        tools.
      </p>
      <div className="mt-6 flex flex-col items-center gap-2">
        <Button type="button" disabled={loading} onClick={() => void resendVerification()}>
          {loading ? "Sending…" : "Resend verification email"}
        </Button>
        {message && <p className="text-xs text-sky-800">{message}</p>}
      </div>
    </div>
  );
}
