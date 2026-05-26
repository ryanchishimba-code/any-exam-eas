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

      router.refresh();
      router.push("/dashboard");
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
      <input
        required
        type="password"
        autoComplete="current-password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="apple-input"
      />
      <p className="text-right text-xs">
        <Link href="/forgot-password" className="font-medium text-[var(--color-accent)] hover:underline">
          Forgot password?
        </Link>
      </p>
      {error && <p className="text-center text-sm text-red-600">{error}</p>}
      <Button type="submit" disabled={loading || !!configWarning} className="w-full">
        {loading ? "Signing in…" : "Log in"}
      </Button>
      <div className="relative py-2 text-center text-xs text-[var(--color-ink-muted)]">
        <span className="bg-white px-2">or</span>
        <div className="absolute inset-x-0 top-1/2 -z-10 border-t border-black/10" />
      </div>
      <GoogleSignInButton />
      <p className="text-center text-xs text-[var(--color-ink-muted)]">
        New here?{" "}
        <a href="/signup?plan=trial" className="font-medium text-[var(--color-accent)] hover:underline">
          Sign up
        </a>
      </p>
    </form>
  );
}
