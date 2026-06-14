import type { SubscriptionAccess } from "@/lib/subscription-access";
import Link from "next/link";
import { formatMonthlyPrice } from "@/lib/site";
import { Button } from "./ui/Button";
import { SubscribeButton } from "./SubscribeButton";
import { ManageBillingButton } from "./ManageBillingButton";

/** Monetization banners — payment required before study, trial reminders, or paywall when access lapses. */
export function SubscriptionBanner({ access }: { access: SubscriptionAccess }) {
  if (access.needsPaymentMethod) {
    return (
      <div className="mt-8 rounded-2xl border border-sky-200 bg-sky-50 px-5 py-4">
        <p className="text-sm font-medium text-sky-950">
          {access.daysRemaining != null && access.daysRemaining <= 1
            ? "Add payment to start studying"
            : "One step left — add payment to unlock study"}
        </p>
        <p className="mt-1 text-xs text-sky-900/80">
          Payment method required. You are not charged today — cancel anytime before your trial
          ends and you will not be billed. Then {formatMonthlyPrice()}/month after the trial.
        </p>
        <div className="mt-3 flex flex-wrap gap-3">
          <Button href="/checkout?plan=trial&interval=yearly" variant="secondary">
            Add payment method
          </Button>
          <Button href="/settings" variant="ghost">
            Manage in settings
          </Button>
        </div>
      </div>
    );
  }

  if (access.status === "past_due") {
    return (
      <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 px-5 py-4">
        <p className="text-sm font-medium text-red-950">Payment failed — study access paused</p>
        <p className="mt-1 text-xs text-red-900/80">
          We couldn&apos;t process your latest payment. Update your payment method to restore full
          access.
        </p>
        <div className="mt-3">
          <ManageBillingButton label="Update payment method" variant="secondary" intent="payment_method" />
        </div>
      </div>
    );
  }

  if (access.status === "canceled" || access.status === "trial_expired") {
    return (
      <div className="mt-8 rounded-2xl border border-teal-200 bg-teal-50 px-5 py-4">
        <p className="text-sm font-medium text-teal-950">
          {access.status === "canceled" ? "Subscription canceled" : "Trial ended"}
        </p>
        <p className="mt-1 text-xs text-teal-900/80">
          Welcome back — log in anytime. Reactivate in Settings to restore full study access.
        </p>
        <div className="mt-3 flex flex-wrap gap-3">
          <Button href="/settings?reactivate=1" variant="secondary">
            Reactivate account
          </Button>
          <SubscribeButton variant="ghost" label="Resubscribe" />
        </div>
      </div>
    );
  }

  if (access.hasAccess) {
    return null;
  }

  if (!access.canStartCheckout) {
    return null;
  }

  return (
    <div className="mt-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-5 py-4">
      <p className="text-sm font-medium text-[var(--color-ink)]">Unlock full study access</p>
      <p className="mt-1 text-xs text-[var(--color-ink-muted)]">
        Get board-style exams, adaptive practice, and progress tracking.{" "}
        <Link href="/pricing" className="text-[var(--color-accent)] hover:underline">
          View plans
        </Link>
      </p>
      <div className="mt-3">
        <SubscribeButton variant="secondary" />
      </div>
    </div>
  );
}
