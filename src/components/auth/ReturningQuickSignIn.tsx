"use client";

import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { Zap } from "lucide-react";
import { MemberLoginLink } from "@/components/auth/MemberLoginLink";
import { useReturningUserHint } from "@/hooks/useReturningUserHint";
import {
  maskEmail,
  rememberEmail,
  saveReturningUserHint,
  type LoginMethod,
} from "@/lib/client/returning-user";

type ReturningQuickSignInProps = {
  callbackUrl?: string;
  variant?: "default" | "dark";
  className?: string;
};

const googleEnabled = process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === "true";
const appleEnabled = process.env.NEXT_PUBLIC_APPLE_AUTH_ENABLED === "true";

export function ReturningQuickSignIn({
  callbackUrl = "/dashboard",
  variant = "default",
  className = "",
}: ReturningQuickSignInProps) {
  const { data: session, status } = useSession();
  const hint = useReturningUserHint();
  const [magicLoading, setMagicLoading] = useState(false);
  const [magicSent, setMagicSent] = useState(false);

  if (status === "authenticated" && session?.user) return null;
  if (status === "loading") return null;

  if (!hint?.email) {
    return (
      <div className={className}>
        <MemberLoginLink callbackUrl={callbackUrl} variant={variant} />
      </div>
    );
  }

  const preferred = hint.lastMethod;
  const masked = maskEmail(hint.email);

  function track(method: LoginMethod) {
    saveReturningUserHint({ email: hint!.email, name: hint!.name, lastMethod: method });
  }

  async function sendMagicLink() {
    setMagicLoading(true);
    try {
      const res = await fetch("/api/auth/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: hint!.email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not send link");
      rememberEmail(hint!.email, { lastMethod: "magic", name: hint!.name });
      setMagicSent(true);
    } catch {
      setMagicSent(false);
    } finally {
      setMagicLoading(false);
    }
  }

  const isDark = variant === "dark";

  const instantButtonBase =
    "inline-flex w-full max-w-sm items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-[0.9375rem] font-semibold transition-all active:scale-[0.98] sm:w-auto";

  let instantAction: React.ReactNode = null;

  if (preferred === "google" && googleEnabled) {
    instantAction = (
      <button
        type="button"
        className={`${instantButtonBase} border border-slate-200 bg-white text-slate-800 shadow-[0_4px_20px_rgba(8,145,178,0.12)] hover:border-teal-200 hover:bg-teal-50/80 ${
          isDark ? "!border-white/20 !bg-white !text-slate-900" : ""
        }`}
        onClick={() => {
          track("google");
          void signIn("google", { callbackUrl });
        }}
      >
        <GoogleIcon />
        Continue with Google
      </button>
    );
  } else if (preferred === "apple" && appleEnabled) {
    instantAction = (
      <button
        type="button"
        className={`${instantButtonBase} bg-slate-900 text-white shadow-[0_4px_20px_rgba(0,0,0,0.25)] hover:bg-slate-800`}
        onClick={() => {
          track("apple");
          void signIn("apple", { callbackUrl });
        }}
      >
        <AppleIcon />
        Continue with Apple
      </button>
    );
  } else if (preferred === "magic" || preferred === "email") {
    instantAction = (
      <button
        type="button"
        disabled={magicLoading || magicSent}
        className={`${instantButtonBase} bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-[0_6px_24px_rgba(8,145,178,0.35)] hover:from-teal-500 hover:to-cyan-500 disabled:opacity-70`}
        onClick={() => void sendMagicLink()}
      >
        <Zap className="h-4 w-4" aria-hidden />
        {magicSent
          ? "Link sent — check your inbox"
          : magicLoading
            ? "Sending…"
            : `Email link to ${masked}`}
      </button>
    );
  } else if (googleEnabled) {
    instantAction = (
      <button
        type="button"
        className={`${instantButtonBase} border border-slate-200 bg-white text-slate-800 shadow-[0_4px_20px_rgba(8,145,178,0.12)] hover:border-teal-200 hover:bg-teal-50/80 ${
          isDark ? "!border-white/20 !bg-white !text-slate-900" : ""
        }`}
        onClick={() => {
          track("google");
          void signIn("google", { callbackUrl });
        }}
      >
        <GoogleIcon />
        Continue with Google
      </button>
    );
  }

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      {instantAction && (
        <div className="flex flex-col items-center gap-1.5">
          <p
            className={`flex items-center gap-1 text-xs font-medium ${
              isDark ? "text-[#a1a1a6]" : "text-teal-700 dark:text-teal-300"
            }`}
          >
            <Zap className="h-3.5 w-3.5" aria-hidden />
            One tap — pick up where you left off
          </p>
          {instantAction}
        </div>
      )}
      <MemberLoginLink
        callbackUrl={callbackUrl}
        variant={variant}
        showEmailHint={!instantAction}
      />
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.56c2.08-1.92 3.28-4.74 3.28-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.77c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
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
