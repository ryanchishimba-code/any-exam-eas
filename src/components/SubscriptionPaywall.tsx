import Link from "next/link";
import type { SubscriptionAccess } from "@/lib/subscription-access";
import { formatMonthlyPrice, formatTrialIntroPrice, formatTrialLabel } from "@/lib/site";
import { Button } from "./ui/Button";

export function SubscriptionPaywall({ access }: { access: SubscriptionAccess }) {
  const isExpired = access.status === "trial_expired";

  return (
    <div className="apple-bento mt-10 text-center">
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-accent)]">
        {isExpired ? "Subscription expired" : "Subscription required"}
      </p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--color-ink)]">
        {isExpired ? "Renew to keep studying" : "Unlock full access"}
      </h2>
      <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-[var(--color-ink-muted)]">
        {formatTrialIntroPrice()} for {formatTrialLabel()}, then {formatMonthlyPrice()}/month.
        Includes the advanced question engine, practice exams, dashboard, and analytics.
      </p>
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Button href="/checkout?plan=trial">
          Start {formatTrialLabel()} — {formatTrialIntroPrice()}
        </Button>
        <Button href="/checkout?plan=subscribe" variant="secondary">
          Subscribe Now
        </Button>
      </div>
      <Link href="/pricing" className="mt-4 inline-block text-xs text-[var(--color-ink-muted)] hover:underline">
        View pricing details
      </Link>
    </div>
  );
}
