"use client";

import { useId, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, Eye, EyeOff, Loader2, X } from "lucide-react";
import { Button } from "./ui/Button";
import { InlineError } from "@/components/ui/StatusMessage";
import {
  PASSWORD_RESET_EXPIRY_MINUTES,
  checkStrongPassword,
  strongPasswordError,
} from "@/lib/validators/password-reset";
import { cn } from "@/lib/utils";

function PasswordField({
  id,
  label,
  value,
  onChange,
  show,
  onToggleShow,
  describedBy,
  invalid,
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  show: boolean;
  onToggleShow: () => void;
  describedBy?: string;
  invalid?: boolean;
  autoComplete: "new-password";
}) {
  return (
    <div className="space-y-2 text-left">
      <label htmlFor={id} className="apple-label">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          required
          type={show ? "text" : "password"}
          minLength={8}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          className="apple-input pr-12"
        />
        <button
          type="button"
          onClick={onToggleShow}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-[var(--color-ink-muted)] transition hover:text-[var(--color-ink)]"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff className="h-4 w-4" aria-hidden /> : <Eye className="h-4 w-4" aria-hidden />}
        </button>
      </div>
    </div>
  );
}

function RequirementRow({ met, label }: { met: boolean; label: string }) {
  return (
    <li className={cn("flex items-center gap-2 text-xs", met ? "text-teal-700" : "text-[var(--color-ink-muted)]")}>
      {met ? (
        <Check className="h-3.5 w-3.5 shrink-0" aria-hidden />
      ) : (
        <X className="h-3.5 w-3.5 shrink-0 opacity-50" aria-hidden />
      )}
      <span>{label}</span>
    </li>
  );
}

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const passwordId = useId();
  const confirmId = useId();
  const requirementsId = useId();
  const errorId = useId();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [tokenExpired, setTokenExpired] = useState(false);
  const [loading, setLoading] = useState(false);

  const checks = useMemo(() => checkStrongPassword(password), [password]);
  const passwordReady = checks.minLength && checks.hasNumber && checks.hasSymbol;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setTokenExpired(false);

    if (!token) {
      setError("This reset link is invalid. Request a new one from the forgot password page.");
      return;
    }

    const strengthError = strongPasswordError(password);
    if (strengthError) {
      setError(strengthError);
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });
      const data = await res.json();
      if (!res.ok) {
        const message = data.error ?? "Reset failed";
        if (/invalid|expired/i.test(message)) setTokenExpired(true);
        throw new Error(message);
      }

      router.push("/login?reset=success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not reset password.");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="apple-card mt-10 space-y-4 p-8 md:p-10 text-center" role="alert">
        <InlineError>This reset link is missing or invalid.</InlineError>
        <p className="text-sm text-[var(--color-ink-muted)]">
          Reset links expire after {PASSWORD_RESET_EXPIRY_MINUTES} minutes and can only be used once.
        </p>
        <Link
          href="/forgot-password"
          className="inline-flex min-h-[44px] items-center justify-center text-sm font-medium text-[var(--color-accent)] hover:underline"
        >
          Request a new reset link
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="apple-card mt-10 space-y-5 p-8 md:p-10"
      aria-busy={loading}
    >
      <p className="text-sm text-[var(--color-ink-muted)]">
        Choose a strong password. This link expires in {PASSWORD_RESET_EXPIRY_MINUTES} minutes.
      </p>

      <PasswordField
        id={passwordId}
        label="New password"
        value={password}
        onChange={(value) => {
          setPassword(value);
          if (error) setError("");
        }}
        show={showPassword}
        onToggleShow={() => setShowPassword((v) => !v)}
        describedBy={requirementsId}
        invalid={Boolean(error) && !passwordReady}
        autoComplete="new-password"
      />

      <ul id={requirementsId} className="space-y-1 rounded-xl border border-black/[0.06] bg-[var(--color-surface)] px-4 py-3" aria-live="polite">
        <RequirementRow met={checks.minLength} label="At least 8 characters" />
        <RequirementRow met={checks.hasNumber} label="At least one number" />
        <RequirementRow met={checks.hasSymbol} label="At least one symbol (!@#$…)" />
      </ul>

      <PasswordField
        id={confirmId}
        label="Confirm new password"
        value={confirm}
        onChange={(value) => {
          setConfirm(value);
          if (error) setError("");
        }}
        show={showConfirm}
        onToggleShow={() => setShowConfirm((v) => !v)}
        invalid={Boolean(error) && password !== confirm}
        autoComplete="new-password"
      />

      {error && (
        <div id={errorId} role="alert">
          <InlineError>{error}</InlineError>
          {tokenExpired && (
            <p className="mt-3 text-center text-sm">
              <Link href="/forgot-password" className="font-medium text-[var(--color-accent)] hover:underline">
                Request a new reset link
              </Link>
            </p>
          )}
        </div>
      )}

      <Button type="submit" disabled={loading || !passwordReady} className="w-full gap-2">
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            Updating…
          </>
        ) : (
          "Update password"
        )}
      </Button>

      <p className="text-center text-sm">
        <Link href="/login" className="font-medium text-[var(--color-accent)] hover:underline">
          Back to login
        </Link>
      </p>
    </form>
  );
}
