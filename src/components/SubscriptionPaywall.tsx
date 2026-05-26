import Link from "next/link";
import type { SubscriptionAccess } from "@/lib/subscription-access";
import { formatMonthlyPrice, formatTrialLabel } from "@/lib/site";
import { SubscribeButton } from "./SubscribeButton";
import { Button } from "./ui/Button";

export function SubscriptionPaywall({ access }: { access: SubscriptionAccess }) {
  const isExpired = access.status === "trial_expired";

  return (
    <div className="apple-card mt-10 border-amber-200/60 bg-gradient-to-b from-amber-50/80 to-white p-8 md:p-10 text-center">
      <p className="text-xs font-semibold uppercase tracking-wider text-amber-800">
        {isExpired ? "Free trial ended" : "Subscription required"}
      </p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--color-ink)]">
        {isExpired
          ? "Continue studying with a paid plan"
          : "Unlock full access"}
      </h2>
      <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-[var(--color-ink-muted)]">
        {isExpired ? (
          <>
            Your {formatTrialLabel()} has ended. Subscribe for {formatMonthlyPrice()}/month to
            keep generating exams, flashcards, and tracking progress.
          </>
        ) : (
          <>
            Start a {formatTrialLabel()} or subscribe for {formatMonthlyPrice()}/month for
            unlimited access.
          </>
        )}
      </p>
      <div className="mt-8 flex flex-col items-center gap-3">
        {isExpired ? (
          <SubscribeButton />
        ) : (
          <>
            <Button href="/signup?plan=trial">{formatTrialLabel()}</Button>
            <SubscribeButton variant="secondary" />
          </>
        )}
        <Link href="/pricing" className="text-xs text-[var(--color-ink-muted)] hover:underline">
          View pricing details
        </Link>
      </div>
    </div>
  );
}
