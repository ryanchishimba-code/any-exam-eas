import { FolderSearch } from "lucide-react";
import {
  VERIFY_EMAIL_SPAM_CALLOUT_HEADLINE,
  VERIFY_EMAIL_SPAM_CALLOUT_RESEND_AFTER_LOGIN,
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
  const resendLine =
    resendHint === "after-login"
      ? VERIFY_EMAIL_SPAM_CALLOUT_RESEND_AFTER_LOGIN
      : VERIFY_EMAIL_SPAM_CALLOUT_RESEND_NEARBY;

  return (
    <aside
      role="note"
      aria-label="Where to find your verification email"
      className={cn(
        "mt-3 flex gap-3 rounded-xl border border-teal-600/35 bg-teal-100/90 px-3.5 py-3 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] dark:border-teal-400/40 dark:bg-teal-950/70",
        className
      )}
    >
      <span
        className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-700/10 text-teal-800 dark:bg-teal-400/15 dark:text-teal-200"
        aria-hidden
      >
        <FolderSearch className="h-5 w-5" strokeWidth={2} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-semibold leading-snug text-teal-950 dark:text-teal-50">
          {VERIFY_EMAIL_SPAM_CALLOUT_HEADLINE}
        </p>
        <p className="mt-1.5 text-[13px] leading-relaxed text-teal-900/90 dark:text-teal-100/90">
          {VERIFY_EMAIL_SPAM_CALLOUT_TIMING} {resendLine}
        </p>
      </div>
    </aside>
  );
}
