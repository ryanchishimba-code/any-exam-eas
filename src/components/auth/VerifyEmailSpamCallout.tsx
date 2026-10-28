import Link from "next/link";
import { FolderSearch } from "lucide-react";
import { AUTH_LOGIN_PATH } from "@/lib/auth/verify-email-urls";
import {
  VERIFY_EMAIL_SPAM_CALLOUT_HEADLINE,
  VERIFY_EMAIL_SPAM_CALLOUT_RESEND_NEARBY,
  VERIFY_EMAIL_SPAM_CALLOUT_TIMING,
} from "@/lib/auth/verify-email-copy";
import { cn } from "@/lib/utils";

export type VerifyEmailSpamCalloutProps = {
  /** Where the user can tap Resend — same copy, different pointer. */
  resendHint?: "nearby-button" | "after-login";
  className?: string;
};

/**
 * Prominent spam/junk guidance for every verify-email surface.
 * Place directly under the “we sent a link to …” line.
 */
export function VerifyEmailSpamCallout({
  resendHint = "nearby-button",
  className,
}: VerifyEmailSpamCalloutProps) {
  return (
    <aside
      role="note"
      aria-label="Where to find your verification email"
      className={cn(
        "mt-4 flex gap-3 rounded-2xl border border-teal-500/20 bg-teal-50/90 px-3.5 py-3.5 text-left dark:border-teal-400/25 dark:bg-teal-950/50",
        className
      )}
    >
      <span
        className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/70 text-teal-700 ring-1 ring-teal-600/10 dark:bg-teal-900/40 dark:text-teal-200 dark:ring-teal-400/15"
        aria-hidden
      >
        <FolderSearch className="h-4 w-4" strokeWidth={2} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-semibold leading-snug text-teal-900 dark:text-teal-50">
          {VERIFY_EMAIL_SPAM_CALLOUT_HEADLINE}
        </p>
        <p className="mt-1 text-[12px] leading-relaxed text-teal-800/90 dark:text-teal-100/80">
          {VERIFY_EMAIL_SPAM_CALLOUT_TIMING}{" "}
          {resendHint === "after-login" ? (
            <>
              Still nothing?{" "}
              <Link
                href={AUTH_LOGIN_PATH}
                className="font-semibold text-teal-950 underline decoration-teal-800/50 underline-offset-2 hover:text-teal-900 dark:text-teal-50"
              >
                Log in
              </Link>{" "}
              and tap Resend email.
            </>
          ) : (
            VERIFY_EMAIL_SPAM_CALLOUT_RESEND_NEARBY
          )}
        </p>
      </div>
    </aside>
  );
}
