"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import type { BillingInterval } from "@/lib/billing-config";
import { TRIAL_DAYS } from "@/lib/billing-config";
import {
  formatPlanUsd,
  getBillingPlanTier,
  renewalTermsLine,
} from "@/lib/billing-plans";
import {
  DEFAULT_PAYMENT_MODE,
  isPaymentModeChoiceEnabled,
  ONE_TIME_POLICY_SHORT,
  type PaymentMode,
} from "@/lib/billing-payment-mode";
import { formatTrialCtaLabel } from "@/lib/site";
import { PaymentModeToggle } from "@/components/pricing/PaymentModeToggle";
import { CancelAnytimeNote } from "@/components/pricing/CancelAnytimeNote";
import { UpgradeIntervalChoice } from "@/components/checkout/UpgradeIntervalChoice";
import { PaymentMethodBadges } from "@/components/PaymentMethodBadges";
import { Button } from "@/components/ui/Button";
import { analytics } from "@/lib/analytics";
import { cn } from "@/lib/utils";

type AccessInfo = {
  hasAccess: boolean;
  hasAppAccess?: boolean;
  status: string;
  daysRemaining: number | null;
  needsPaymentMethod?: boolean;
  planTier?: string;
};

type PricingTiersProps = {
  className?: string;
};

/**
 * Half-screen buy card. Price, cycle, CTA — nothing else. Feature lists,
 * competitor tables, and "no payment required" banners live elsewhere (or
 * nowhere); repeating them here only slowed the decision.
 */
export function PricingTiers({ className }: PricingTiersProps) {
  const { data: session } = useSession();
  const [interval, setInterval] = useState<BillingInterval>("monthly");
  const [paymentMode, setPaymentMode] = useState<PaymentMode>(DEFAULT_PAYMENT_MODE);
  const [access, setAccess] = useState<AccessInfo | null>(null);
  const [oneTimeAvailable, setOneTimeAvailable] = useState(false);
  const showPaymentMode = isPaymentModeChoiceEnabled() && oneTimeAvailable;

  useEffect(() => {
    if (!session?.user) {
      setAccess(null);
      return;
    }
    fetch("/api/subscription/status")
      .then((r) => r.json())
      .then(setAccess)
      .catch(() => {});
  }, [session?.user]);

  useEffect(() => {
    analytics.pricingViewed("/pricing");
  }, []);

  useEffect(() => {
    if (!isPaymentModeChoiceEnabled()) return;
    fetch("/api/stripe/config")
      .then((r) => r.json())
      .then((data) => setOneTimeAvailable(data?.oneTimePaymentsAvailable === true))
      .catch(() => {});
  }, []);

  const upgradingFromTrial =
    access?.status === "trialing" ||
    access?.status === "trial_expired" ||
    Boolean(access?.hasAppAccess && !access?.hasAccess);

  const plan = getBillingPlanTier("pro", interval);

  if (session?.user && access?.hasAccess && access.status === "active") {
    return (
      <div className={cn("mx-auto max-w-sm space-y-4 text-center", className)}>
        <p className="text-sm text-[var(--color-ink-muted)]">Your Pro plan is active.</p>
        <Button href="/study" className="w-full">
          Continue studying
        </Button>
        <Link href="/settings" className="block text-sm text-[var(--color-accent)] hover:underline">
          Manage billing
        </Link>
      </div>
    );
  }

  const isUpgrade = Boolean(session?.user && upgradingFromTrial);
  const checkoutHref = (() => {
    const params = new URLSearchParams({
      plan: isUpgrade ? "subscribe" : "trial",
      tier: "pro",
      interval,
    });
    if (isUpgrade && showPaymentMode) params.set("mode", paymentMode);
    const path = session?.user ? "/checkout" : "/signup";
    return `${path}?${params.toString()}`;
  })();

  const timeLeft =
    isUpgrade && access?.daysRemaining != null
      ? access.daysRemaining <= 0
        ? "Trial ended"
        : access.daysRemaining === 1
          ? "1 day left"
          : `${access.daysRemaining} days left`
      : null;

  return (
    <div className={cn("mx-auto max-w-lg space-y-5", className)}>
      {timeLeft && (
        <p className="text-center text-sm text-[var(--color-ink-muted)]">{timeLeft}</p>
      )}

      <div className="text-center">
        <p className="flex items-baseline justify-center gap-1">
          <span className="text-5xl font-semibold tracking-tight text-[var(--color-ink)]">
            {isUpgrade ? formatPlanUsd(plan.totalUsd) : "$0"}
          </span>
          {!isUpgrade && (
            <span className="text-sm text-[var(--color-ink-muted)]">today</span>
          )}
          {isUpgrade && (
            <span className="text-sm text-[var(--color-ink-muted)]">
              {interval === "monthly" ? "/mo" : `/${plan.shortLabel}`}
            </span>
          )}
        </p>
        {!isUpgrade && (
          <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
            Then {formatPlanUsd(plan.totalUsd)}
            {interval === "monthly" ? "/mo" : `/${plan.shortLabel}`}
            {plan.savingsBadge ? ` · ${plan.savingsBadge}` : ""}
          </p>
        )}
        {isUpgrade && interval !== "monthly" && (
          <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
            ≈ {formatPlanUsd(plan.monthlyEquivalentUsd)}/mo
            {plan.savingsBadge ? ` · ${plan.savingsBadge}` : ""}
          </p>
        )}
      </div>

      <UpgradeIntervalChoice value={interval} onChange={setInterval} tier="pro" />

      {isUpgrade && showPaymentMode && (
        <PaymentModeToggle
          value={paymentMode}
          onChange={setPaymentMode}
          interval={interval}
          variant="card"
        />
      )}

      <Button
        href={checkoutHref}
        className="w-full"
        variant="primary"
        onClick={() =>
          analytics.planSelected(`pro_${interval}`, {
            tier: "pro",
            interval,
            ...(isUpgrade && showPaymentMode ? { paymentMode } : {}),
          })
        }
      >
        {isUpgrade ? "Continue to checkout" : formatTrialCtaLabel()}
      </Button>

      <CancelAnytimeNote
        hidden={Boolean(isUpgrade && showPaymentMode && paymentMode === "manual")}
      />

      <p className="text-center text-[0.6875rem] leading-relaxed text-[var(--color-ink-muted)]">
        {isUpgrade
          ? showPaymentMode && paymentMode === "manual"
            ? ONE_TIME_POLICY_SHORT
            : renewalTermsLine("pro", interval)
          : `${TRIAL_DAYS}-day free trial · no card required. Payments are non-refundable (except where required by law). Quality issues: contact support within 30 days — we will make the item right.`}
      </p>

      <PaymentMethodBadges className="justify-center" size="sm" />
      <p className="text-center text-[0.6875rem] text-[var(--color-ink-muted)]">
        Secured by Stripe
      </p>

      {!session?.user && (
        <p className="text-center text-sm text-[var(--color-ink-muted)]">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-[var(--color-accent)] hover:underline">
            Log in
          </Link>
        </p>
      )}
    </div>
  );
}
