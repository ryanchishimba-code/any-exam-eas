"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { InlineError, StatusMessage } from "@/components/ui/StatusMessage";
import type { LoginMethod } from "@/lib/client/returning-user";
import { saveReturningUserHint, rememberEmail } from "@/lib/client/returning-user";

type QuickSignInProps = {
  callbackUrl?: string;
  preferredMethod?: LoginMethod;
  defaultEmail?: string;
  compact?: boolean;
  onMethodUsed?: (method: LoginMethod) => void;
};

export function GoogleSignInButton({
  callbackUrl = "/study",
  highlighted,
  onClick,
}: {
  callbackUrl?: string;
  highlighted?: boolean;
  onClick?: () => void;
}) {
  if (process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED !== "true") return null;

  return (
    <Button
      type="button"
      variant="secondary"
      className={`w-full gap-2 ${highlighted ? "ring-2 ring-[var(--color-accent)]/30" : ""}`}
      onClick={() => {
        onClick?.();
        void signIn("google", { callbackUrl });
      }}
    >
      <GoogleIcon />
      Continue with Google
    </Button>
  );
}

export function AppleSignInButton({
  callbackUrl = "/study",
  highlighted,
  onClick,
}: {
  callbackUrl?: string;
  highlighted?: boolean;
  onClick?: () => void;
}) {
  if (process.env.NEXT_PUBLIC_APPLE_AUTH_ENABLED !== "true") return null;

  return (
    <Button
      type="button"
      variant="secondary"
      className={`w-full gap-2 !border-black/10 !bg-black !text-white hover:!bg-black/90 dark:!border-white/20 ${highlighted ? "ring-2 ring-white/30" : ""}`}
      onClick={() => {
        onClick?.();
        void signIn("apple", { callbackUrl });
      }}
    >
      <AppleIcon />
      Continue with Apple
    </Button>
  );
}

export function MagicLinkForm({
  defaultEmail = "",
  compact,
  onSent,
}: {
  defaultEmail?: string;
  compact?: boolean;
  onSent?: (email: string) => void;
}) {
  const [email, setEmail] = useState(defaultEmail);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/auth/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not send link");
      setMessage(data.message ?? "Check your inbox for a secure sign-in link.");
      onSent?.(email.trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send link.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={compact ? "space-y-3" : "space-y-4"}>
      <div className="flex items-center gap-2 text-left">
        <MailIcon />
        <div>
          <p className="text-sm font-medium text-[var(--color-ink)]">Magic link</p>
          <p className="text-xs text-[var(--color-ink-muted)]">
            No password — we email you a secure one-time link.
          </p>
        </div>
      </div>
      <input
        type="email"
        required
        autoComplete="email"
        placeholder="you@school.edu"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onBlur={(e) => rememberEmail(e.target.value)}
        className="apple-input"
      />
      <Button type="submit" disabled={loading} variant="secondary" className="w-full">
        {loading ? "Sending…" : "Email me a sign-in link"}
      </Button>
      {message && (
        <StatusMessage variant="success" className="text-xs">
          {message}
        </StatusMessage>
      )}
      {error && <InlineError className="text-xs">{error}</InlineError>}
    </form>
  );
}


export function QuickSignIn({
  callbackUrl = "/study",
  preferredMethod,
  defaultEmail,
  compact,
  onMethodUsed,
}: QuickSignInProps) {
  const track = (method: LoginMethod) => onMethodUsed?.(method);

  return (
    <div className={compact ? "space-y-3" : "space-y-4"}>
      <GoogleSignInButton
        callbackUrl={callbackUrl}
        highlighted={preferredMethod === "google"}
        onClick={() => track("google")}
      />
      <AppleSignInButton
        callbackUrl={callbackUrl}
        highlighted={preferredMethod === "apple"}
        onClick={() => track("apple")}
      />
      <MagicLinkForm
        defaultEmail={defaultEmail ?? ""}
        compact={compact}
        onSent={(sentEmail) => {
          track("magic");
          saveReturningUserHint({ email: sentEmail, lastMethod: "magic" });
        }}
      />
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.56c2.08-1.92 3.28-4.74 3.28-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.77c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M16.365 1.43c0 1.14-.417 2.063-1.248 2.769-.786.68-1.705 1.018-2.754.942-.03-1.095.398-2.04 1.282-2.833.83-.755 1.816-1.14 2.72-1.078.026 1.066-.332 2.02-1 2.2zm1.103 3.711c-1.517-.088-2.81.864-3.535.864-.748 0-1.906-.816-3.146-.792-1.618.026-3.106.942-3.938 2.396-1.68 2.912-.432 7.224 1.206 9.588.8 1.158 1.752 2.457 3.006 2.411 1.206-.048 1.662-.78 3.12-.78 1.458 0 1.872.78 3.146.756 1.3-.022 2.124-1.182 2.916-2.346.918-1.342 1.296-2.646 1.318-2.712-.03-.014-2.534-.972-2.56-3.858-.022-2.416 1.98-3.572 2.07-3.636-1.128-1.654-2.884-1.88-3.504-1.914z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="M4 4h16v16H4z" />
        <path d="m22 6-10 7L2 6" />
      </svg>
    </span>
  );
}
