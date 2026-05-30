import Link from "next/link";
import { Button } from "./ui/Button";
import { formatMonthlyPrice, formatTrialIntroPrice, formatTrialLabel } from "@/lib/site";

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
            Question engine, AI tutor, practice exams, and analytics are available with an
            active subscription. {formatTrialIntroPrice()} for {formatTrialLabel()}, then{" "}
            {formatMonthlyPrice()}/month.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button href="/signup?plan=trial">
              Start {formatTrialLabel()} — {formatTrialIntroPrice()}
            </Button>
            <Button href="/signup?plan=subscribe" variant="secondary">
              Subscribe Now
            </Button>
          </div>
          <p className="mt-4 text-xs text-[var(--color-ink-muted)]">
            Already subscribed?{" "}
            <Link href="/login" className="text-[var(--color-accent)] hover:underline">
              Log in
            </Link>
          </p>
        </>
      )}
    </div>
  );
}
