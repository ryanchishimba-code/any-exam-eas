"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "./ui/Button";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Request failed");

      setSent(true);
      setMessage(
        data.message ??
          "If an account exists for that email, we sent a link to reset your password."
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="apple-card mt-10 space-y-4 p-8 md:p-10 text-center">
        <p className="text-sm text-[var(--color-ink)]">{message}</p>
        <p className="text-xs text-[var(--color-ink-muted)]">
          Check your inbox and spam folder. The link expires in 1 hour.
        </p>
        {process.env.NODE_ENV === "development" && (
          <p className="text-xs text-amber-800">
            Dev mode: if email is not configured, check the terminal running{" "}
            <code className="rounded bg-amber-100 px-1">npm run dev</code> for the reset link.
          </p>
        )}
        <Link href="/login" className="inline-block text-sm font-medium text-[var(--color-accent)]">
          Back to log in
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="apple-card mt-10 space-y-5 p-8 md:p-10">
      <p className="text-sm text-[var(--color-ink-muted)]">
        Enter the email on your account. We will send a link to choose a new password.
      </p>
      <input
        required
        type="text"
        inputMode="email"
        autoComplete="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="apple-input"
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Sending…" : "Send reset link"}
      </Button>
      <p className="text-center text-xs text-[var(--color-ink-muted)]">
        <Link href="/login" className="font-medium text-[var(--color-accent)] hover:underline">
          Back to log in
        </Link>
      </p>
    </form>
  );
}
