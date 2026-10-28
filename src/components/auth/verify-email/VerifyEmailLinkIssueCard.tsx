import Link from "next/link";
import { Link2Off } from "lucide-react";
import { VerifyEmailSpamCallout } from "@/components/auth/VerifyEmailSpamCallout";
import {
  verifyEmailCardShell,
  verifyEmailIconWrap,
  verifyEmailPrimaryBtn,
  verifyEmailSecondaryLink,
  verifyEmailTitle,
} from "@/components/auth/verify-email/verify-email-ui";
import { AUTH_LOGIN_PATH } from "@/lib/auth/verify-email-urls";
import { ROUTES } from "@/lib/routes";
import {
  VERIFY_EMAIL_LINK_ISSUE_HEADLINE,
  VERIFY_EMAIL_LINK_ISSUE_SUBLINE,
  VERIFY_EMAIL_MISSING_LINK_HEADLINE,
  formatVerifyEmailSentLine,
} from "@/lib/auth/verify-email-copy";
import { cn } from "@/lib/utils";

type VerifyEmailLinkIssueCardProps = {
  kind: "invalid" | "missing";
  emailLabel: string;
  className?: string;
};

/** Calm premium card for expired / invalid verification links (login page). */
export function VerifyEmailLinkIssueCard({
  kind,
  emailLabel,
  className,
}: VerifyEmailLinkIssueCardProps) {
  const headline =
    kind === "missing" ? VERIFY_EMAIL_MISSING_LINK_HEADLINE : VERIFY_EMAIL_LINK_ISSUE_HEADLINE;
  const loginHref = `${AUTH_LOGIN_PATH}?callbackUrl=${encodeURIComponent(ROUTES.dashboard)}`;

  return (
    <div className={cn(verifyEmailCardShell, "text-left", className)}>
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-28 rounded-t-[24px] bg-[radial-gradient(ellipse_at_top,rgba(15,118,110,0.1),transparent_72%)]"
        aria-hidden
      />
      <div className="relative text-center">
        <div className={cn(verifyEmailIconWrap, "bg-gradient-to-br from-slate-50 to-teal-50/90")}>
          <Link2Off className="h-6 w-6" strokeWidth={1.75} aria-hidden />
        </div>
        <h2 className={cn(verifyEmailTitle, "mt-5")}>{headline}</h2>
        <p className="mt-3 text-[15px] leading-relaxed text-[var(--color-ink-muted)] dark:text-slate-300">
          {VERIFY_EMAIL_LINK_ISSUE_SUBLINE}
        </p>
        <p className="mt-3 text-[15px] leading-snug text-[var(--color-ink)] dark:text-slate-200">
          {formatVerifyEmailSentLine(emailLabel)}
        </p>
      </div>

      <div className="relative mt-5">
        <VerifyEmailSpamCallout resendHint="after-login" />
        <Link href={loginHref} className={cn(verifyEmailPrimaryBtn, "mt-5 text-center no-underline")}>
          Log in to resend
        </Link>
        <p className="mt-4 text-center">
          <Link href={ROUTES.auth.signup} className={verifyEmailSecondaryLink}>
            Use a different email
          </Link>
        </p>
      </div>
    </div>
  );
}
