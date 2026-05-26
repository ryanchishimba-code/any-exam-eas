import Link from "next/link";
import type { SubscriptionAccess } from "@/lib/subscription-access";
import { formatMonthlyPrice } from "@/lib/site";
import { SubscribeButton } from "./SubscribeButton";

export function SubscriptionBanner({ access }: { access: SubscriptionAccess }) {
  if (access.status === "trialing" && access.hasAccess && access.daysRemaining != null) {
    const urgent = access.daysRemaining <= 2;
    return (
      <div
        className={`mt-8 rounded-2xl border px-5 py-4 ${
          urgent
            ? "border-amber-300 bg-amber-50"
            : "border-[var(--color-border)] bg-[var(--color-surface-elevated)]"
        }`}
      >
        <p className="text-sm font-medium text-[var(--color-ink)]">
          Free trial · {access.daysRemaining} day{access.daysRemaining === 1 ? "" : "s"} left
        </p>
        <p className="mt-1 text-xs text-[var(--color-ink-muted)]">
          After your trial, access continues at {formatMonthlyPrice()}/month.{" "}
          <Link href="/pricing" className="text-[var(--color-accent)] hover:underline">
            View pricing
          </Link>
        </p>
        {urgent && (
          <div className="mt-3">
            <SubscribeButton
              label="Subscribe before trial ends"
              variant="secondary"
              className="!inline-block"
            />
          </div>
        )}
      </div>
    );
  }

  if (access.status === "trial_expired") {
    return (
      <div className="mt-8 rounded-2xl border border-amber-300 bg-amber-50 px-5 py-4">
        <p className="text-sm font-medium text-amber-950">Your free trial has ended</p>
        <p className="mt-1 text-xs text-amber-900/80">
          Subscribe to keep using exams, flashcards, and progress tracking.
        </p>
        <div className="mt-3">
          <SubscribeButton />
        </div>
      </div>
    );
  }

  if (access.status === "active") {
    return (
      <p className="mt-6 text-sm text-[var(--color-ink-muted)]">
        Subscription: <span className="font-medium text-green-700">Active</span>
      </p>
    );
  }

  return null;
}
