import { StatusMessage } from "@/components/ui/StatusMessage";
import { VerifyEmailSpamCallout } from "@/components/auth/VerifyEmailSpamCallout";
import {
  VERIFY_EMAIL_INVALID_LINK_BODY,
  VERIFY_EMAIL_INVALID_LINK_TITLE,
  VERIFY_EMAIL_MISSING_LINK_BODY,
  VERIFY_EMAIL_MISSING_LINK_TITLE,
  formatVerifyEmailBody,
} from "@/lib/auth/verify-email-copy";

type VerifyEmailLinkProblemNoticeProps = {
  kind: "invalid" | "missing";
  /** Masked or full email when known (returning-user hint). */
  displayEmail?: string | null;
};

/** Login page when `/api/auth/verify-email` redirects with `verify=invalid` or `missing`. */
export function VerifyEmailLinkProblemNotice({
  kind,
  displayEmail,
}: VerifyEmailLinkProblemNoticeProps) {
  const emailLabel = displayEmail?.trim() ? displayEmail.trim() : "your email";
  const title =
    kind === "invalid" ? VERIFY_EMAIL_INVALID_LINK_TITLE : VERIFY_EMAIL_MISSING_LINK_TITLE;
  const body =
    kind === "invalid" ? VERIFY_EMAIL_INVALID_LINK_BODY : VERIFY_EMAIL_MISSING_LINK_BODY;

  return (
    <div className="space-y-4">
      <StatusMessage variant="warning">{title}</StatusMessage>
      <div className="rounded-2xl border border-teal-500/25 bg-teal-50 px-4 py-4 text-left dark:border-teal-400/30 dark:bg-teal-950/40">
        <p className="text-[15px] font-medium leading-snug text-[var(--color-ink)]">{body}</p>
        <p className="mt-2 text-[15px] font-medium leading-snug text-[var(--color-ink)]">
          {formatVerifyEmailBody(emailLabel)}
        </p>
        <VerifyEmailSpamCallout resendHint="after-login" />
      </div>
    </div>
  );
}
