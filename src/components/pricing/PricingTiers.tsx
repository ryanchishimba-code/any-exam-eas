"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Check, Crown, Shield, Sparkles } from "lucide-react";
import type { BillingInterval } from "@/lib/billing-config";
import { TRIAL_DAYS } from "@/lib/billing-config";
import {
  BILLING_POLICY_SHORT,
  BILLING_TRIAL_DISCLOSURE,
  formatPlanUsd,
  getBillingPlanTier,
} from "@/lib/billing-plans";
import {
  formatTrialCtaLabel,
  formatTrialCtaSubline,
  formatTrialLabel,
} from "@/lib/site";
import {
  PRO_FEATURES,
  PRICING_VALUE_HEADLINE,
  TRIAL_STUDY_LIMITS,
} from "@/lib/subscription-tiers";
import { BillingIntervalPicker } from "@/components/pricing/BillingIntervalPicker";
import { UpgradeIntervalChoice } from "@/components/checkout/UpgradeIntervalChoice";
import { PricingGuarantees } from "@/components/pricing/PricingGuarantees";
import { NoPaymentTrialCallout } from "@/components/marketing/NoPaymentTrialCallout";
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

const INTERVALS: BillingInterval[] = ["monthly", "quarterly", "semiannual", "yearly"];

function TrialUpgradePricing({
  interval,
  onIntervalChange,
  daysRemaining,
  className,
}: {
  interval: BillingInterval;
  onIntervalChange: (interval: BillingInterval) => void;
  daysRemaining: number | null;
  className?: string;
}) {
  const plan = getBillingPlanTier("pro", interval);
  const checkoutHref = (() => {
    const params = new URLSearchParams({
      plan: "subscribe",
      tier: "pro",
      interval,
    });
    return `/checkout?${params.toString()}`;
  })();

  const timeLeft =
    daysRemaining == null
      ? null
      : daysRemaining <= 0
        ? "Your trial has ended"
        : daysRemaining === 1
          ? "1 day left in your trial"
          : `${daysRemaining} days left in your trial`;

  return (
    <div className={cn("mx-auto max-w-lg space-y-8", className)}>
      <div className="text-center">
        <p className="text-sm font-semibold text-[var(--color-accent)]">Upgrade to Pro</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-3xl">
          Keep studying without limits
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-[var(--color-ink-muted)]">
          {timeLeft ? `${timeLeft}. ` : ""}
          Unlock unlimited questions and every Pro study tool across all 6 boards.
        </p>
      </div>

      <div className="rounded-[28px] border border-[var(--color-accent)]/30 bg-white p-5 shadow-[var(--shadow-apple-sm)] sm:p-6">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="text-lg font-semibold text-[var(--color-ink)]">Pro</h3>
          {plan.savingsBadge && (
            <span className="text-xs font-semibold text-emerald-700">{plan.savingsBadge}</span>
          )}
        </div>

        <p className="mt-4 flex items-baseline gap-1">
          <span className="text-4xl font-semibold tracking-tight text-[var(--color-ink)]">
            {formatPlanUsd(plan.totalUsd)}
          </span>
          <span className="text-sm text-[var(--color-ink-muted)]">
            {interval === "monthly" ? "/mo" : `/${plan.shortLabel}`}
          </span>
        </p>
        {interval !== "monthly" && (
          <p className="mt-1 text-xs text-[var(--color-ink-muted)]">
            ≈ {formatPlanUsd(plan.monthlyEquivalentUsd)}/mo
          </p>
        )}

        <div className="mt-6">
          <UpgradeIntervalChoice value={interval} onChange={onIntervalChange} tier="pro" />
        </div>

        <Button
          href={checkoutHref}
          className="mt-6 w-full"
          variant="primary"
          onClick={() => analytics.planSelected(`pro_${interval}`, { tier: "pro", interval })}
        >
          Continue to checkout
        </Button>
        <p className="mt-3 text-center text-[0.6875rem] text-[var(--color-ink-muted)]">
          {BILLING_POLICY_SHORT}
        </p>
      </div>

      <ul className="mx-auto max-w-md space-y-2">
        {PRO_FEATURES.slice(0, 5).map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-[var(--color-ink-muted)]">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-accent)]" aria-hidden />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PricingTiers({ className }: PricingTiersProps) {
  const { data: session } = useSession();
  const [interval, setInterval] = useState<BillingInterval>("monthly");
  const [access, setAccess] = useState<AccessInfo | null>(null);

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

  function handlePlanSelected(billingInterval: BillingInterval) {
    analytics.planSelected(`pro_${billingInterval}`, { tier: "pro", interval: billingInterval });
  }

  const upgradingFromTrial =
    access?.status === "trialing" ||
    access?.status === "trial_expired" ||
    Boolean(access?.hasAppAccess && !access?.hasAccess);

  function checkoutHref() {
    const plan = session?.user && upgradingFromTrial ? "subscribe" : "trial";
    const params = new URLSearchParams({ plan, interval, tier: "pro" });
    return session?.user
      ? `/checkout?${params.toString()}`
      : `/signup?${params.toString()}`;
  }

  const plan = getBillingPlanTier("pro", interval);
  const isAnnual = interval === "yearly";

  if (session?.user && access?.hasAccess && access.status === "active") {
    return (
      <div className={cn("apple-bento p-8 text-center shadow-[var(--shadow-apple-sm)]", className)}>
        <p className="text-sm font-medium text-[var(--color-accent)]">You&apos;re all set</p>
        <p className="mt-2 text-lg font-semibold text-[var(--color-ink)]">
          Your Pro subscription is active
        </p>
        <div className="mt-6 flex flex-col items-center gap-3">
          <Button href="/study">Continue studying</Button>
          <Link href="/settings" className="text-sm text-[var(--color-accent)] hover:underline">
            Manage billing
          </Link>
        </div>
      </div>
    );
  }

  if (session?.user && upgradingFromTrial) {
    return (
      <TrialUpgradePricing
        interval={interval}
        onIntervalChange={setInterval}
        daysRemaining={access?.daysRemaining ?? null}
        className={className}
      />
    );
  }

  return (
    <div className={cn("mx-auto max-w-3xl space-y-10", className)}>
      <NoPaymentTrialCallout variant="prominent" className="mx-auto max-w-xl" />

      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-accent)]">
          {formatTrialLabel()}
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-3xl">
          {PRICING_VALUE_HEADLINE}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-[var(--color-ink-muted)]">
          {BILLING_TRIAL_DISCLOSURE}. One simple Pro plan with everything included.
        </p>
      </div>

      <div className="mx-auto max-w-md">
        <p className="mb-3 text-center text-sm font-medium text-[var(--color-ink)]">
          Choose your billing cycle — monthly is flexible, annual saves more
        </p>
        <BillingIntervalPicker value={interval} onChange={setInterval} variant="pricing" tier="pro" />
      </div>

      <div className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-sm sm:p-6">
        <p className="text-center text-sm font-semibold text-[var(--color-ink)]">
          Trial vs Pro — what changes?
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
              {TRIAL_DAYS}-day free trial
            </p>
            <ul className="mt-2 space-y-1.5 text-xs text-[var(--color-ink-muted)]">
              {TRIAL_STUDY_LIMITS.map((item) => (
                <li key={item}>· {item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/5 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-accent)]">
              Pro (paid)
            </p>
            <ul className="mt-2 space-y-1.5 text-xs text-[var(--color-ink)]">
              <li>· Unlimited questions across all 6 boards</li>
              <li>· Roadmaps, Deep Dives, Full Exams, analytics & more</li>
              <li>· Unlimited full-length mock exams</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[28px] border border-[var(--color-accent)] bg-white shadow-[var(--shadow-apple-md)] ring-2 ring-[var(--color-accent)]/20">
        <NoPaymentTrialCallout variant="ribbon" className="rounded-none" />
        <div className="absolute inset-x-0 top-8 flex justify-center">
          <span className="inline-flex items-center gap-1 rounded-b-xl bg-[var(--color-accent)] px-4 py-1 text-xs font-semibold text-white">
            <Crown className="h-3 w-3" aria-hidden />
            {isAnnual ? "Best value" : "Pro"}
          </span>
        </div>

        <div className="px-6 pt-14 pb-6">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="text-xl font-semibold text-[var(--color-ink)]">Pro</h3>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[0.6875rem] font-semibold text-emerald-800">
              <Sparkles className="h-3 w-3" aria-hidden />
              {formatTrialLabel()}
            </span>
          </div>
          <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
            Everything you need for USMLE, NCLEX, NAPLEX, PANCE, AANP FNP & NPTE-PT
          </p>

          <div className="mt-6">
            <p className="flex items-baseline gap-1">
              <span className="text-4xl font-semibold tracking-tight text-[var(--color-ink)]">
                {formatPlanUsd(plan.totalUsd)}
              </span>
              {interval === "monthly" ? (
                <span className="text-sm text-[var(--color-ink-muted)]">/mo</span>
              ) : (
                <span className="text-sm text-[var(--color-ink-muted)]">/{plan.shortLabel}</span>
              )}
            </p>
            {plan.savingsBadge && (
              <p className="mt-1 text-sm font-medium text-emerald-700">{plan.savingsBadge}</p>
            )}
            {interval !== "monthly" && (
              <p className="mt-0.5 text-xs text-[var(--color-ink-muted)]">
                ≈ {formatPlanUsd(plan.monthlyEquivalentUsd)}/mo equivalent
              </p>
            )}
          </div>

          <Button
            href={checkoutHref()}
            className="mt-6 w-full"
            variant="primary"
            onClick={() => handlePlanSelected(interval)}
          >
            {formatTrialCtaLabel()}
          </Button>
          <p className="mt-2 text-center text-xs font-semibold text-emerald-800">
            No payment method required to start
          </p>
          <p className="mt-1 text-center text-[0.6875rem] text-[var(--color-ink-muted)]">
            {formatTrialCtaSubline("pro", interval)}
          </p>
        </div>

        <div className="border-t border-black/[0.05] px-6 py-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
            Everything included
          </p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {PRO_FEATURES.map((item) => (
              <li key={item} className="flex items-start gap-2 text-xs text-[var(--color-ink-muted)]">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--color-accent)]" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-black/[0.06] bg-white shadow-sm">
        <table className="w-full min-w-[320px] text-left text-sm">
          <thead>
            <tr className="border-b border-black/[0.06] bg-slate-50/80">
              <th className="px-4 py-3 font-semibold text-[var(--color-ink)]">Duration</th>
              <th className="px-4 py-3 font-semibold text-[var(--color-accent)]">Pro</th>
            </tr>
          </thead>
          <tbody>
            {INTERVALS.map((dur) => {
              const row = getBillingPlanTier("pro", dur);
              return (
                <tr
                  key={dur}
                  className={cn(
                    "border-b border-black/[0.04] last:border-0",
                    dur === interval && "bg-[var(--color-accent)]/[0.04]"
                  )}
                >
                  <td className="px-4 py-3 font-medium capitalize text-[var(--color-ink)]">
                    {row.label}
                    {row.savingsBadge && (
                      <span className="ml-2 text-xs font-semibold text-emerald-700">
                        {row.savingsBadge}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium text-[var(--color-ink)]">
                    {formatPlanUsd(row.totalUsd)}
                    {dur !== "monthly" && (
                      <span className="ml-1 text-xs font-normal text-[var(--color-ink-muted)]">
                        (≈ {formatPlanUsd(row.monthlyEquivalentUsd)}/mo)
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col items-center gap-2">
        <PaymentMethodBadges size="sm" />
        <p className="flex items-center justify-center gap-1.5 text-xs text-[var(--color-ink-muted)]">
          <Shield className="h-3.5 w-3.5" aria-hidden />
          {BILLING_POLICY_SHORT} · Secured by Stripe
        </p>
      </div>

      <PricingGuarantees variant="compact" />

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
