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
import { QuickSignIn } from "./auth/QuickSignIn";
import { completeLoginFlow, signInWithMagicToken } from "@/lib/client/post-login";
import { loadReturningUserHint, rememberEmail, saveReturningUserHint } from "@/lib/client/returning-user";
import type { LoginMethod } from "@/lib/client/returning-user";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetSuccess = searchParams.get("reset") === "success";
  const callbackUrl = searchParams.get("callbackUrl") ?? "/study";
  const magicToken = searchParams.get("magicToken");
  const emailParam = searchParams.get("email");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [configWarning, setConfigWarning] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [magicLoading, setMagicLoading] = useState(false);

  const [preferredMethod, setPreferredMethod] = useState<LoginMethod | undefined>();

  useEffect(() => {
    fetchAuthHealthWarning().then(setConfigWarning);
    const hint = loadReturningUserHint();
    setPreferredMethod(hint?.lastMethod);
  }, []);

  useEffect(() => {
    const hint = loadReturningUserHint();
    const initial = emailParam ?? hint?.email ?? "";
    if (initial) setEmail(initial);
  }, [emailParam]);

  useEffect(() => {
    if (!magicToken) return;
    let cancelled = false;
    setMagicLoading(true);
    void signInWithMagicToken(magicToken, router, callbackUrl).then((err) => {
      if (cancelled) return;
      if (err) setError(err);
      setMagicLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [magicToken, router, callbackUrl]);

  function rememberMethod(method: LoginMethod) {
    if (!email.trim()) return;
    saveReturningUserHint({ email: email.trim(), lastMethod: method });
    setPreferredMethod(method);
  }

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

      await completeLoginFlow({
        router,
        callbackUrl,
        email: trimmedEmail,
        method: "email",
      });
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
      {magicLoading && (
        <p className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900">
          Verifying your secure sign-in link…
        </p>
      )}
      {configWarning && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {configWarning}
        </p>
      )}

      <QuickSignIn
        callbackUrl={callbackUrl}
        preferredMethod={preferredMethod}
        defaultEmail={email}
        compact
        onMethodUsed={rememberMethod}
      />

      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-black/[0.06]" />
        </div>
        <p className="relative mx-auto w-fit bg-white px-3 text-xs text-[var(--color-ink-muted)] dark:bg-[var(--color-surface-elevated)]">
          or email & password
        </p>
      </div>

      <input
        required
        type="email"
        autoComplete="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onBlur={(e) => rememberEmail(e.target.value, { lastMethod: preferredMethod })}
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

      <Button type="submit" disabled={loading || magicLoading || !!configWarning} className="w-full">
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
