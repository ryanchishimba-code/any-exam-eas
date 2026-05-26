import Link from "next/link";
import { ArrowRight, Lock, Mail, User } from "lucide-react";

/** Prominent login mockup graphic — links to /login. */
export function LoginPromoGraphic() {
  return (
    <Link
      href="/login"
      className="group relative mx-auto block w-full max-w-md focus:outline-none focus-visible:ring-4 focus-visible:ring-[rgba(0,113,227,0.35)] focus-visible:ring-offset-4 rounded-[1.75rem]"
      aria-label="Log in to your account"
    >
      <div
        className="pointer-events-none absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-[rgba(0,113,227,0.2)] via-[rgba(0,113,227,0.06)] to-transparent opacity-80 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
        aria-hidden
      />

      <div className="relative overflow-hidden rounded-[1.75rem] border border-black/[0.06] bg-white p-8 shadow-[0_24px_64px_rgba(0,0,0,0.12)] transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-[0_32px_80px_rgba(0,113,227,0.18)] md:p-10">
        <div
          className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent opacity-60"
          aria-hidden
        />

        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0071e3] to-[#40a9ff] text-white shadow-[0_8px_24px_rgba(0,113,227,0.35)]">
            <User className="h-7 w-7" strokeWidth={2} aria-hidden />
          </div>
          <div className="text-left">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-accent)]">
              Member sign-in
            </p>
            <p className="text-lg font-semibold tracking-tight text-[var(--color-ink)]">
              Log in to your account
            </p>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <div className="flex items-center gap-3 rounded-xl border border-black/[0.06] bg-[var(--color-surface)] px-4 py-3.5">
            <Mail className="h-5 w-5 shrink-0 text-[var(--color-ink-muted)]" aria-hidden />
            <span className="text-sm text-[var(--color-ink-muted)]">you@school.edu</span>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-black/[0.06] bg-[var(--color-surface)] px-4 py-3.5">
            <Lock className="h-5 w-5 shrink-0 text-[var(--color-ink-muted)]" aria-hidden />
            <span className="text-sm tracking-[0.2em] text-[var(--color-ink-muted)]">••••••••</span>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 rounded-full bg-[var(--color-accent)] py-4 text-[1.0625rem] font-semibold text-white shadow-[0_8px_28px_rgba(0,113,227,0.4)] transition-all duration-300 group-hover:bg-[var(--color-accent-hover)] group-hover:shadow-[0_12px_36px_rgba(0,113,227,0.45)]">
          Log in
          <ArrowRight
            className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5"
            aria-hidden
          />
        </div>

        <p className="mt-5 text-center text-xs text-[var(--color-ink-muted)]">
          Secure access to exams, flashcards, and your progress
        </p>
      </div>

      <div
        className="pointer-events-none absolute -right-8 top-1/4 h-24 w-24 rounded-full bg-[rgba(0,113,227,0.15)] blur-2xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-6 bottom-0 h-20 w-20 rounded-full bg-[rgba(120,120,128,0.12)] blur-2xl"
        aria-hidden
      />
    </Link>
  );
}
