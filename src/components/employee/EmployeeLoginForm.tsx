"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  fetchAuthHealthWarning,
  messageForSignInError,
  messageFromUnknownAuthError,
} from "@/lib/auth-client";
import { signOutAndCleanup } from "@/lib/client/sign-out";
import { Button } from "@/components/ui/Button";
import { InlineError } from "@/components/ui/StatusMessage";

export function EmployeeLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [configWarning, setConfigWarning] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const staffOnly = searchParams.get("error") === "staff_only";
  const expired = searchParams.get("error") === "session_expired";

  useEffect(() => {
    fetchAuthHealthWarning().then(setConfigWarning);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError("Enter a valid work email address.");
      setLoading(false);
      return;
    }

    try {
      const res = await signIn("credentials", {
        email: trimmedEmail,
        password,
        rememberMe: rememberMe ? "true" : "false",
        redirect: false,
      });

      if (!res) {
        setError("Sign-in service did not respond.");
        return;
      }

      if (res.error) {
        setError(messageForSignInError(res.error));
        return;
      }

      const sessionRes = await fetch("/api/employee/session", { credentials: "include" });
      const sessionData = await sessionRes.json().catch(() => ({}));

      if (!sessionData.staff) {
        await signOutAndCleanup({ redirect: false });
        setError(
          "This account does not have employee access. Use the regular login for students, or contact your administrator."
        );
        return;
      }

      router.refresh();
      router.push("/internal");
    } catch (err) {
      setError(messageFromUnknownAuthError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="apple-card mt-10 space-y-5 border border-black/[0.06] p-8 md:p-10"
    >
      {staffOnly && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Employee credentials are required to access the portal.
        </p>
      )}
      {expired && (
        <p className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-900">
          Your session expired. Please sign in again.
        </p>
      )}
      {configWarning && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {configWarning}
        </p>
      )}

      <input
        required
        type="email"
        autoComplete="email"
        placeholder="Work email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="apple-input"
      />
      <input
        required
        type="password"
        autoComplete="current-password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="apple-input"
      />

      <label className="flex items-center gap-2 text-sm text-[var(--color-ink-muted)]">
        <input
          type="checkbox"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
          className="rounded border-black/20"
        />
        Remember me for 30 days
      </label>

      <p className="text-right text-xs">
        <Link
          href="/forgot-password"
          className="font-medium text-[var(--color-accent)] hover:underline"
        >
          Forgot password?
        </Link>
      </p>

      {error && <InlineError className="text-center">{error}</InlineError>}

      <Button type="submit" disabled={loading || !!configWarning} className="w-full">
        {loading ? "Verifying access…" : "Sign in to portal"}
      </Button>

      <p className="text-center text-xs text-[var(--color-ink-muted)]">
        Student or subscriber?{" "}
        <Link href="/login" className="font-medium text-[var(--color-accent)] hover:underline">
          Regular login
        </Link>
      </p>
    </form>
  );
}
