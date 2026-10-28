"use client";

import Link from "next/link";
import { Mail } from "lucide-react";
import { VerifyEmailSpamCallout } from "@/components/auth/VerifyEmailSpamCallout";
import { useVerifyEmailResend } from "@/components/auth/verify-email/use-verify-email-resend";
import {
  verifyEmailCardShell,
  verifyEmailIconWrap,
  verifyEmailPrimaryBtn,
  verifyEmailSecondaryLink,
  verifyEmailTitle,
} from "@/components/auth/verify-email/verify-email-ui";
import { AUTH_LOGIN_PATH } from "@/lib/auth/verify-email-urls";
import { LEGAL_ENTITY } from "@/lib/legal";
import { ROUTES } from "@/lib/routes";
import {
  VERIFY_EMAIL_INBOX_HEADLINE,
  VERIFY_EMAIL_NEXT_STEP,
  formatVerifyEmailSentLine,
} from "@/lib/auth/verify-email-copy";
import { cn } from "@/lib/utils";

export type VerifyEmailInboxCardProps = {
  /** Masked or display-safe email label. */
  emailLabel: string;
  className?: string;
  /** Show authenticated resend control (dashboard / welcome). */
  showResend?: boolean;
  resendHint?: "nearby-button" | "after-login";
  showChangeEmailLink?: boolean;
  showBackToLoginLink?: boolean;
  loginCallbackUrl?: string;
};

export function VerifyEmailInboxCard({
  emailLabel,
  className,
  showResend = true,
  resendHint = "nearby-button",
  showChangeEmailLink = false,
  showBackToLoginLink = false,
  loginCallbackUrl = ROUTES.dashboard,
}: VerifyEmailInboxCardProps) {
  const { message, messageKind, loading, cooldownSec, resend } = useVerifyEmailResend();

  return (
    <div className={cn(verifyEmailCardShell, "text-left", className)}>
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-28 rounded-t-[24px] bg-[radial-gradient(ellipse_at_top,rgba(15,118,110,0.14),transparent_72%)]"
        aria-hidden
      />
      <div className="relative text-center">
        <div className={verifyEmailIconWrap}>
          <Mail className="h-6 w-6" strokeWidth={1.75} aria-hidden />
        </div>
        <h2 className={cn(verifyEmailTitle, "mt-5")}>{VERIFY_EMAIL_INBOX_HEADLINE}</h2>
        <p className="mt-3 text-[15px] leading-snug text-[var(--color-ink)] dark:text-slate-200">
          {formatVerifyEmailSentLine(emailLabel)}
        </p>
      </div>

      <div className="relative mt-5">
        <VerifyEmailSpamCallout resendHint={resendHint} />
        <p className="mt-4 text-[13px] leading-relaxed text-[var(--color-ink-muted)] dark:text-slate-400">
          {VERIFY_EMAIL_NEXT_STEP}
        </p>

        {showResend ? (
          <div className="mt-5 space-y-3">
            <button
              type="button"
              disabled={loading || cooldownSec > 0}
              onClick={() => void resend()}
              className={verifyEmailPrimaryBtn}
            >
              {loading
                ? "Sending…"
                : cooldownSec > 0
                  ? `Resend email (${cooldownSec}s)`
                  : "Resend email"}
            </button>
            {message ? (
              <p
                className={cn(
                  "text-center text-[13px]",
                  messageKind === "error"
                    ? "text-slate-600 dark:text-slate-300"
                    : "text-teal-800 dark:text-teal-200"
                )}
                role="status"
              >
                {message}
              </p>
            ) : null}
          </div>
        ) : null}

        {(showChangeEmailLink || showBackToLoginLink) && (
          <p className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center text-[13px] text-[var(--color-ink-muted)] dark:text-slate-400">
            {showChangeEmailLink ? (
              <Link href={ROUTES.auth.signup} className={verifyEmailSecondaryLink}>
                Use a different email
              </Link>
            ) : null}
            {showChangeEmailLink && showBackToLoginLink ? (
              <span aria-hidden className="text-slate-300 dark:text-slate-600">
                ·
              </span>
            ) : null}
            {showBackToLoginLink ? (
              <Link
                href={`${AUTH_LOGIN_PATH}?callbackUrl=${encodeURIComponent(loginCallbackUrl)}`}
                className={verifyEmailSecondaryLink}
              >
                Back to log in
              </Link>
            ) : null}
          </p>
        )}

        <p className="mt-5 text-center text-[12px] leading-relaxed text-[var(--color-ink-muted)] dark:text-slate-500">
          Need help?{" "}
          <a href={`mailto:${LEGAL_ENTITY.supportEmail}`} className={verifyEmailSecondaryLink}>
            {LEGAL_ENTITY.supportEmail}
          </a>
        </p>
      </div>
    </div>
  );
}
