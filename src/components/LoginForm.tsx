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
import { Button } from "./ui/Button";
import { GoogleSignInButton } from "./GoogleSignInButton";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetSuccess = searchParams.get("reset") === "success";
  const callbackUrl = searchParams.get("callbackUrl") ?? "/study";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [configWarning, setConfigWarning] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAuthHealthWarning().then(setConfigWarning);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError("Enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      const res = await signIn("credentials", {
        email: trimmedEmail,
        password,
        redirect: false,
      });

      if (!res) {
        setError(
          "Sign-in service did not respond. If this is the live site, confirm NEXTAUTH_SECRET and DATABASE_URL are set on Vercel."
        );
        return;
      }

      if (res.error) {
        setError(messageForSignInError(res.error));
        return;
      }

      const statusRes = await fetch("/api/subscription/status");
      const status = statusRes.ok ? await statusRes.json() : { hasAccess: false };

      router.refresh();
      if (status.hasAccess) {
        router.push(callbackUrl);
      } else {
        router.push("/pricing?paywall=1");
      }
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
      className="apple-card mt-10 space-y-5 p-8 md:p-10"
    >
      {resetSuccess && (
        <p className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-900">
          Your password was updated. Log in with your new password.
        </p>
      )}
      {configWarning && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {configWarning}
        </p>
      )}

      <GoogleSignInButton callbackUrl={callbackUrl} />

      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-black/[0.06]" />
        </div>
        <p className="relative mx-auto w-fit bg-white px-3 text-xs text-[var(--color-ink-muted)] dark:bg-[var(--color-surface-elevated)]">
          or email
        </p>
      </div>

      <input
        required
        type="email"
        autoComplete="email"
        placeholder="Email"
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

      <div className="flex justify-end">
        <Link href="/forgot-password" className="text-xs text-[var(--color-accent)] hover:underline">
          Forgot password?
        </Link>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="submit" disabled={loading || !!configWarning} className="w-full">
        {loading ? "Signing in…" : "Log in"}
      </Button>

      <p className="text-center text-xs text-[var(--color-ink-muted)]">
        Need access?{" "}
        <Link href="/signup?plan=trial" className="font-medium text-[var(--color-accent)] hover:underline">
          Start trial
        </Link>
      </p>
    </form>
  );
}
