"use client";

import { ArrowRight, User } from "lucide-react";
import { LoginModalTrigger } from "@/components/auth/LoginModalTrigger";

/** Prominent login mockup — opens the login modal. */
export function LoginPromoGraphic() {
  return (
    <LoginModalTrigger className="group relative mx-auto block w-full max-w-md text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-400/35 focus-visible:ring-offset-4 rounded-[1.75rem]">
      <div
        className="pointer-events-none absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-teal-400/20 via-cyan-400/10 to-transparent opacity-80 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
        aria-hidden
      />

      <div className="relative overflow-hidden rounded-[1.75rem] border border-teal-100 bg-white p-8 shadow-[0_24px_64px_rgba(8,145,178,0.15)] transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-[0_32px_80px_rgba(8,145,178,0.22)] md:p-10">
        <div
          className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal-500 via-cyan-500 to-sky-500 opacity-80"
          aria-hidden
        />

        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-600 to-cyan-600 text-white shadow-[0_8px_24px_rgba(8,145,178,0.35)]">
            <User className="h-7 w-7" strokeWidth={2} aria-hidden />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-teal-600">
              Returning student
            </p>
            <p className="text-lg font-semibold tracking-tight text-[var(--color-ink)]">
              Welcome back
            </p>
          </div>
        </div>

        <p className="mt-6 text-sm leading-relaxed text-[var(--color-ink-muted)]">
          One tap with Google, or log in with your email and password.
        </p>

        <div className="mt-8 flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-teal-600 to-cyan-600 py-4 text-[1.0625rem] font-semibold text-white shadow-[0_8px_28px_rgba(8,145,178,0.35)] transition-all duration-300 group-hover:from-teal-500 group-hover:to-cyan-500">
          Sign in
          <ArrowRight
            className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5"
            aria-hidden
          />
        </div>

        <p className="mt-5 text-center text-xs text-[var(--color-ink-muted)]">
          Secure · HIPAA-aware · Progress synced
        </p>
      </div>
    </LoginModalTrigger>
  );
}
