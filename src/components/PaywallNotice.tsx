import Link from "next/link";
import { Button } from "./ui/Button";
import { VerifyEmailInboxCard } from "@/components/auth/verify-email/VerifyEmailInboxCard";
import { AUTH_LOGIN_PATH } from "@/lib/auth/verify-email-urls";
import { LANDING_TRIAL_HREF } from "@/lib/landing/content";
import {
  formatTrialEntryPrice,
  formatTrialLabel,
  formatTrialPlanDetail,
  SIGNUP_PAYMENT_REQUIRED_NOTE,
} from "@/lib/site";

export function PaywallNotice({
  reason,
}: {
  reason?: string | null;
}) {
  const isSuspended = reason === "suspended";
  const isVerify = reason === "verify";

  if (isVerify) {
    return (
      <div className="mb-10 flex justify-center px-4">
        <VerifyEmailInboxCard
          emailLabel="your email"
          showResend={false}
          resendHint="after-login"
          showBackToLoginLink
        />
      </div>
    );
  }

  return (
    <div className="apple-bento mb-10 border-[var(--color-accent)]/20 bg-[var(--color-accent)]/5 text-center">
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-accent)]">
        {isSuspended ? "Account suspended" : "Subscription required"}
      </p>
      <h2 className="mt-2 text-xl font-semibold tracking-tight text-[var(--color-ink)]">
        {isSuspended ? "Contact support to restore access" : "Unlock the full exam prep platform"}
      </h2>
      {!isSuspended && (
        <>
          <p className="mx-auto mt-3 max-w-md text-sm text-[var(--color-ink-muted)]">
            Question banks, timed practice exams, and analytics require an active subscription.{" "}
            {SIGNUP_PAYMENT_REQUIRED_NOTE} {formatTrialPlanDetail()}.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button href={LANDING_TRIAL_HREF}>
              Start {formatTrialLabel()} — {formatTrialEntryPrice()} today
            </Button>
            <Button href="/checkout?plan=trial&interval=monthly" variant="secondary">
              Already have an account? Add payment
            </Button>
          </div>
          <p className="mt-4 text-xs text-[var(--color-ink-muted)]">
            Already subscribed?{" "}
            <Link href={AUTH_LOGIN_PATH} className="text-[var(--color-accent)] hover:underline">
              Log in
            </Link>
            {" · "}
            <Link href="/settings" className="text-[var(--color-accent)] hover:underline">
              Manage billing
            </Link>
          </p>
        </>
      )}
    </div>
  );
}
