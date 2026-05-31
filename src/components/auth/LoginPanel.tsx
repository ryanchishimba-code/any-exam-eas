"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import {
  fetchAuthHealthWarning,
  messageForSignInError,
  messageFromUnknownAuthError,
} from "@/lib/auth-client";
import { completeLoginFlow } from "@/lib/client/post-login";
import {
  firstName,
  loadReturningUserHint,
  maskEmail,
  rememberEmail,
  saveReturningUserHint,
  type LoginMethod,
} from "@/lib/client/returning-user";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { InlineError, StatusMessage } from "@/components/ui/StatusMessage";

type LoginPanelProps = {
  callbackUrl?: string;
  onSuccess?: () => void;
};

function displayMethod(method?: LoginMethod): string | null {
  if (!method) return null;
  if (method === "magic" || method === "email") return "email & password";
  if (method === "apple") return "Google";
  return method;
}

export function LoginPanel({ callbackUrl = "/study", onSuccess }: LoginPanelProps) {
  const router = useRouter();
  const [hint, setHint] = useState(loadReturningUserHint());
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [configWarning, setConfigWarning] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = loadReturningUserHint();
    setHint(stored);
    setEmail(stored?.email ?? "");
    fetchAuthHealthWarning().then(setConfigWarning);
  }, []);

  const displayName = hint?.name
    ? firstName(hint.name)
    : hint?.email
      ? firstName(null, hint.email)
      : null;

  const lastMethodLabel = displayMethod(hint?.lastMethod);

  function rememberMethod(method: LoginMethod) {
    const trimmed = email.trim() || hint?.email;
    if (!trimmed) return;
    saveReturningUserHint({ email: trimmed, name: hint?.name, lastMethod: method });
  }

  async function handlePasswordLogin(e: React.FormEvent) {
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
        setError("Sign-in service did not respond. Try again in a moment.");
        return;
      }
      if (res.error) {
        setError(messageForSignInError(res.error));
        return;
      }

      onSuccess?.();
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

  const googleEnabled = process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === "true";
  const googleHighlighted = hint?.lastMethod === "google" || hint?.lastMethod === "apple";

  return (
    <div className="space-y-5">
      {lastMethodLabel && (
        <p className="text-center text-xs text-[var(--color-ink-muted)]">
          Last signed in with{" "}
          <span className="font-medium capitalize text-[var(--color-ink)]">{lastMethodLabel}</span>
        </p>
      )}

      {configWarning && <StatusMessage variant="warning">{configWarning}</StatusMessage>}

      {googleEnabled && (
        <GoogleSignInButton
          callbackUrl={callbackUrl}
          highlighted={googleHighlighted}
          large
          onClick={() => rememberMethod("google")}
        />
      )}

      {googleEnabled && (
        <div className="relative py-1">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-black/[0.06]" />
          </div>
          <p className="relative mx-auto w-fit bg-white px-3 text-xs font-medium text-[var(--color-ink-muted)]">
            or log in with email
          </p>
        </div>
      )}

      <form onSubmit={handlePasswordLogin} className="space-y-3" noValidate>
        <input
          required
          type="email"
          autoComplete="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={(e) =>
            rememberEmail(e.target.value, { name: hint?.name, lastMethod: hint?.lastMethod })
          }
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
          <Link
            href="/forgot-password"
            className="text-xs font-medium text-[var(--color-accent)] hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        {error && <InlineError>{error}</InlineError>}
        <button
          type="submit"
          disabled={loading || !!configWarning}
          className="login-modal-btn-primary w-full"
        >
          <Lock className="h-4 w-4" aria-hidden />
          {loading ? "Signing in…" : displayName ? `Log in as ${displayName}` : "Log in"}
        </button>
      </form>

      {hint?.email && (
        <p className="text-center text-xs text-[var(--color-ink-muted)]">
          Continuing as {maskEmail(hint.email)}
        </p>
      )}
    </div>
  );
}
