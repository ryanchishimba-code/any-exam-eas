"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Check, Crown, Shield, Sparkles, X } from "lucide-react";
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
  PRO_ONLY_FEATURES,
  TIER_DEFINITIONS,
  UNIVERSAL_FEATURES,
  type SubscriptionTier,
} from "@/lib/subscription-tiers";
import { BillingIntervalPicker } from "@/components/pricing/BillingIntervalPicker";
import { PricingGuarantees } from "@/components/pricing/PricingGuarantees";
import { PaymentMethodBadges } from "@/components/PaymentMethodBadges";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type AccessInfo = {
  hasAccess: boolean;
  status: string;
  daysRemaining: number | null;
  needsPaymentMethod?: boolean;
  planTier?: string;
};

type PricingTiersProps = {
  className?: string;
};

const INTERVALS: BillingInterval[] = ["monthly", "quarterly", "semiannual", "yearly"];

function TierCard({
  tier,
  interval,
  checkoutHref,
  highlighted,
}: {
  tier: SubscriptionTier;
  interval: BillingInterval;
  checkoutHref: string;
  highlighted: boolean;
}) {
  const def = TIER_DEFINITIONS[tier];
  const plan = getBillingPlanTier(tier, interval);
  const isAnnual = interval === "yearly";

  return (
    <div
      className={cn(
        "relative flex flex-col overflow-hidden rounded-[28px] border bg-white shadow-[var(--shadow-apple-md)] transition-all",
        highlighted
          ? "border-[var(--color-accent)] ring-2 ring-[var(--color-accent)]/20 scale-[1.02] z-10"
          : "border-black/[0.06]"
      )}
    >
      {highlighted && (
        <div className="absolute inset-x-0 top-0 flex justify-center">
          <span className="inline-flex items-center gap-1 rounded-b-xl bg-[var(--color-accent)] px-4 py-1 text-xs font-semibold text-white">
            {isAnnual ? (
              <>
                <Crown className="h-3 w-3" aria-hidden />
                Most Popular
              </>
            ) : (
              <>
                <Sparkles className="h-3 w-3" aria-hidden />
                Recommended
              </>
            )}
          </span>
        </div>
      )}

      <div className={cn("px-6 pt-10 pb-6", highlighted && "pt-12")}>
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="text-xl font-semibold text-[var(--color-ink)]">{def.name}</h3>
          <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[0.6875rem] font-semibold text-emerald-800">
            {formatTrialLabel()}
          </span>
        </div>
        <p className="mt-1 text-sm text-[var(--color-ink-muted)]">{def.tagline}</p>

        <div className="mt-6">
          <p className="flex items-baseline gap-1">
            <span className="text-4xl font-semibold tracking-tight text-[var(--color-ink)]">
              {formatPlanUsd(plan.totalUsd)}
            </span>
            {interval === "monthly" ? (
              <span className="text-sm text-[var(--color-ink-muted)]">/mo</span>
            ) : (
              <span className="text-sm text-[var(--color-ink-muted)]">
                /{plan.shortLabel}
              </span>
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

        <Button href={checkoutHref} className="mt-6 w-full" variant={highlighted ? "default" : "secondary"}>
          {formatTrialCtaLabel()}
        </Button>
        <p className="mt-2 text-center text-[0.6875rem] text-[var(--color-ink-muted)]">
          {formatTrialCtaSubline(tier, interval)}
        </p>
      </div>

      <div className="border-t border-black/[0.05] px-6 py-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
          Includes
        </p>
        <ul className="space-y-2">
          {UNIVERSAL_FEATURES.map((item) => (
            <li key={item} className="flex items-start gap-2 text-xs text-[var(--color-ink-muted)]">
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--color-accent)]" aria-hidden />
              <span>{item}</span>
            </li>
          ))}
          {tier === "pro" &&
            PRO_ONLY_FEATURES.map((item) => (
              <li key={item} className="flex items-start gap-2 text-xs text-[var(--color-ink)]">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--color-accent)]" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          {tier === "basic" &&
            PRO_ONLY_FEATURES.slice(0, 3).map((item) => (
              <li key={item} className="flex items-start gap-2 text-xs text-[var(--color-ink-muted)]/60">
                <X className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}

export function PricingTiers({ className }: PricingTiersProps) {
  const { data: session } = useSession();
  const [interval, setInterval] = useState<BillingInterval>("yearly");
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

  function checkoutHref(tier: SubscriptionTier) {
    const params = new URLSearchParams({ plan: "trial", interval, tier });
    return session?.user
      ? `/checkout?${params.toString()}`
      : `/signup?${params.toString()}`;
  }

  if (session?.user && access?.hasAccess) {
    return (
      <div className={cn("apple-bento p-8 text-center shadow-[var(--shadow-apple-sm)]", className)}>
        <p className="text-sm font-medium text-[var(--color-accent)]">You&apos;re all set</p>
        <p className="mt-2 text-lg font-semibold text-[var(--color-ink)]">
          {access.status === "trialing"
            ? `${formatTrialLabel()} active${access.daysRemaining != null ? ` · ${access.daysRemaining} day${access.daysRemaining === 1 ? "" : "s"} left` : ""}`
            : "Your subscription is active"}
          {access.planTier ? ` · ${access.planTier === "pro" ? "Pro" : "Basic"} plan` : ""}
        </p>
        <div className="mt-6 flex flex-col items-center gap-3">
          {access.status === "trialing" && access.needsPaymentMethod ? (
            <Button href={`/checkout?plan=trial&interval=${interval}&tier=${access.planTier ?? "pro"}`}>
              Add payment method
            </Button>
          ) : access.planTier === "basic" ? (
            <Button href={`/checkout?plan=subscribe&interval=${interval}&tier=pro`}>
              Upgrade to Pro
            </Button>
          ) : (
            <Button href="/study">Continue studying</Button>
          )}
          <Link href="/settings" className="text-sm text-[var(--color-accent)] hover:underline">
            Manage billing
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("mx-auto max-w-5xl space-y-10", className)}>
      {/* Value headline */}
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-accent)]">
          {TRIAL_DAYS}-day free trial on every plan
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-3xl">
          6 exams + powerful tools for less than one UWorld subscription
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-[var(--color-ink-muted)]">
          {BILLING_TRIAL_DISCLOSURE}. Professional board prep for USMLE, NCLEX, NAPLEX, PANCE & AANP FNP
          at a fraction of competitor prices.
        </p>
      </div>

      {/* Duration picker — annual emphasized */}
      <div className="mx-auto max-w-md">
        <p className="mb-3 text-center text-sm font-medium text-[var(--color-ink)]">
          Choose your billing cycle — annual saves the most
        </p>
        <BillingIntervalPicker value={interval} onChange={setInterval} variant="pricing" tier="pro" />
      </div>

      {/* Side-by-side tier cards */}
      <div className="grid gap-6 md:grid-cols-2 md:items-start">
        <TierCard
          tier="basic"
          interval={interval}
          checkoutHref={checkoutHref("basic")}
          highlighted={false}
        />
        <TierCard
          tier="pro"
          interval={interval}
          checkoutHref={checkoutHref("pro")}
          highlighted
        />
      </div>

      {/* Quick comparison table — all durations */}
      <div className="overflow-x-auto rounded-2xl border border-black/[0.06] bg-white shadow-sm">
        <table className="w-full min-w-[540px] text-left text-sm">
          <thead>
            <tr className="border-b border-black/[0.06] bg-slate-50/80">
              <th className="px-4 py-3 font-semibold text-[var(--color-ink)]">Duration</th>
              <th className="px-4 py-3 font-semibold text-[var(--color-ink)]">Basic</th>
              <th className="px-4 py-3 font-semibold text-[var(--color-accent)]">Pro</th>
            </tr>
          </thead>
          <tbody>
            {INTERVALS.map((dur) => {
              const basic = getBillingPlanTier("basic", dur);
              const pro = getBillingPlanTier("pro", dur);
              return (
                <tr
                  key={dur}
                  className={cn(
                    "border-b border-black/[0.04] last:border-0",
                    dur === interval && "bg-[var(--color-accent)]/[0.04]"
                  )}
                >
                  <td className="px-4 py-3 font-medium capitalize text-[var(--color-ink)]">
                    {basic.label}
                    {basic.savingsBadge && (
                      <span className="ml-2 text-xs font-semibold text-emerald-700">
                        {basic.savingsBadge}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[var(--color-ink-muted)]">
                    {formatPlanUsd(basic.totalUsd)}
                    {dur !== "monthly" && (
                      <span className="ml-1 text-xs">(≈ {formatPlanUsd(basic.monthlyEquivalentUsd)}/mo)</span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium text-[var(--color-ink)]">
                    {formatPlanUsd(pro.totalUsd)}
                    {dur !== "monthly" && (
                      <span className="ml-1 text-xs font-normal text-[var(--color-ink-muted)]">
                        (≈ {formatPlanUsd(pro.monthlyEquivalentUsd)}/mo)
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