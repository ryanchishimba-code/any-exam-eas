import Link from "next/link";
import { Button } from "./ui/Button";
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

  return (
    <div className="apple-bento mb-10 border-[var(--color-accent)]/20 bg-[var(--color-accent)]/5 text-center">
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-accent)]">
        {isSuspended ? "Account suspended" : isVerify ? "Verify your email" : "Subscription required"}
      </p>
      <h2 className="mt-2 text-xl font-semibold tracking-tight text-[var(--color-ink)]">
        {isSuspended
          ? "Contact support to restore access"
          : isVerify
            ? "Check your inbox to verify your email"
            : "Unlock the full exam prep platform"}
      </h2>
      {!isSuspended && !isVerify && (
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
            <Link href="/login" className="text-[var(--color-accent)] hover:underline">
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
