import type { SubscriptionAccess } from "@/lib/subscription-access";
import Link from "next/link";
import { formatMonthlyPrice } from "@/lib/site";
import { Button } from "./ui/Button";
import { SubscribeButton } from "./SubscribeButton";

/** Monetization banners — trial payment reminder or paywall when access lapses. */
export function SubscriptionBanner({ access }: { access: SubscriptionAccess }) {
  if (access.hasAccess && access.status === "trialing" && access.needsPaymentMethod) {
    return (
      <div className="mt-8 rounded-2xl border border-sky-200 bg-sky-50 px-5 py-4">
        <p className="text-sm font-medium text-sky-950">
          {access.daysRemaining != null && access.daysRemaining <= 1
            ? "Your free trial ends soon"
            : "Free trial active"}
        </p>
        <p className="mt-1 text-xs text-sky-900/80">
          {access.daysRemaining != null
            ? `${access.daysRemaining} day${access.daysRemaining === 1 ? "" : "s"} left on your free trial. `
            : ""}
          Add a payment method to keep access — then {formatMonthlyPrice()}/month after your trial
          ends. You won&apos;t be charged until then.
        </p>
        <div className="mt-3">
          <Button href="/checkout?plan=trial" variant="secondary">
            Add payment method
          </Button>
        </div>
      </div>
    );
  }

  if (access.hasAccess) {
    return null;
  }

  if (access.status === "trial_expired") {
    return (
      <div className="mt-8 rounded-2xl border border-amber-300 bg-amber-50 px-5 py-4">
        <p className="text-sm font-medium text-amber-950">Your trial has ended</p>
        <p className="mt-1 text-xs text-amber-900/80">
          Subscribe to keep using exams, flashcards, and progress tracking.
        </p>
        <div className="mt-3">
          <SubscribeButton />
        </div>
      </div>
    );
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
