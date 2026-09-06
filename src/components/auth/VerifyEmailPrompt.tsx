"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { maskEmail } from "@/lib/client/returning-user";
import { cn } from "@/lib/utils";

type VerifyEmailPromptProps = {
  email?: string | null;
  /** When true, study is locked until they verify. */
  required?: boolean;
  className?: string;
};

/**
 * Plain, Apple-like direction after signup: check inbox → verify email.
 */
export function VerifyEmailPrompt({
  email,
  required: _required = false,
  className,
}: VerifyEmailPromptProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const displayEmail = email?.trim() ? maskEmail(email.trim()) : "your email";

  async function resend() {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/auth/resend-verification", { method: "POST" });
      const data = (await res.json().catch(() => ({}))) as { message?: string; error?: string };
      setMessage(
        data.message ?? (res.ok ? "Verification email sent." : data.error ?? "Could not send email.")
      );
    } catch {
      setMessage("Could not send email. Try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-[22px] border border-black/[0.06] bg-white px-6 py-8 text-center shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_40px_rgba(15,23,42,0.06)]",
        className
      )}
      aria-labelledby="verify-email-heading"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[radial-gradient(ellipse_at_top,rgba(79,70,229,0.08),transparent_70%)]"
        aria-hidden
      />
      <div className="relative mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--color-accent)_10%,white)] text-[var(--color-accent)]">
        <Mail className="h-5 w-5" strokeWidth={1.75} aria-hidden />
      </div>
      <h2
        id="verify-email-heading"
        className="relative mt-5 text-[22px] font-semibold tracking-[-0.03em] text-[var(--color-ink)]"
      >
        Please verify your email
      </h2>
      <p className="relative mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-[var(--color-ink-muted)]">
        We sent a link to{" "}
        <span className="font-medium text-[var(--color-ink)]">{displayEmail}</span>.
        Please verify your email to continue.
      </p>
      <div className="relative mt-7 flex flex-col items-center gap-3">
        <button
          type="button"
          disabled={loading}
          onClick={() => void resend()}
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--color-ink)] px-6 text-[14px] font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Sending…" : "Resend email"}
        </button>
        {message ? (
          <p className="text-[13px] text-[var(--color-ink-muted)]" role="status">
            {message}
          </p>
        ) : null}
      </div>
    </section>
  );
}
