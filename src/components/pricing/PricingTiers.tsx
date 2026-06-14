"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Check, Shield } from "lucide-react";
import type { BillingInterval } from "@/lib/billing-config";
import { TRIAL_DAYS } from "@/lib/billing-config";
import { BILLING_POLICY_SHORT } from "@/lib/billing-plans";
import { formatTrialCtaSubline, formatTrialCtaWithSavings, formatTrialLabel, formatTrialTodayPrice } from "@/lib/site";
import { LANDING_PRICING_FEATURES } from "@/lib/landing/content";
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
};

type PricingTiersProps = {
  className?: string;
};

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

  const checkoutHref = session?.user
    ? `/checkout?plan=trial&interval=${interval}`
    : `/signup?plan=trial&interval=${interval}`;

  if (session?.user && access?.hasAccess) {
    return (
      <div className={cn("apple-bento p-8 text-center shadow-[var(--shadow-apple-sm)]", className)}>
        <p className="text-sm font-medium text-[var(--color-accent)]">You&apos;re all set</p>
        <p className="mt-2 text-lg font-semibold text-[var(--color-ink)]">
          {access.status === "trialing"
            ? `${formatTrialLabel()} active${access.daysRemaining != null ? ` · ${access.daysRemaining} day${access.daysRemaining === 1 ? "" : "s"} left` : ""}`
            : "Your subscription is active"}
        </p>
        <div className="mt-6 flex flex-col items-center gap-3">
          {access.status === "trialing" && access.needsPaymentMethod ? (
            <Button href="/checkout?plan=trial">Add payment method</Button>
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
    <div className={cn("mx-auto max-w-lg space-y-8", className)}>
      {/* Unified offer card */}
      <div className="overflow-hidden rounded-[28px] border border-black/[0.06] bg-white shadow-[var(--shadow-apple-md)]">
        {/* Trial header */}
        <div className="border-b border-black/[0.05] bg-gradient-to-b from-[var(--color-accent)]/[0.08] to-transparent px-6 py-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-accent)]">
            {TRIAL_DAYS}-day free trial
          </p>
          <p className="mt-2 text-5xl font-semibold leading-none tracking-tight text-[var(--color-ink)]">
            {formatTrialTodayPrice()}
          </p>
          <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
            Full access after checkout · payment method required · not charged if you cancel before
            trial ends
          </p>
        </div>

        {/* Billing dropdown + savings */}
        <div className="space-y-6 px-5 py-6 sm:px-6">
          <div>
            <p className="mb-4 text-center text-sm font-medium text-[var(--color-ink)]">
              Then pick your plan — longer plans save more
            </p>
            <BillingIntervalPicker value={interval} onChange={setInterval} variant="pricing" />
          </div>

          <div className="space-y-3 pt-2">
            <Button href={checkoutHref} className="w-full">
              {formatTrialCtaWithSavings(interval)}
            </Button>
            <p className="text-center text-xs font-medium text-emerald-800">
              {formatTrialCtaSubline(interval)}
            </p>
            <p className="flex items-center justify-center gap-1.5 text-[0.6875rem] text-[var(--color-ink-muted)]">
              <Shield className="h-3.5 w-3.5" aria-hidden />
              {BILLING_POLICY_SHORT}
            </p>
          </div>
        </div>
      </div>

      {/* Trust row */}
      <div className="flex flex-col items-center gap-2">
        <PaymentMethodBadges size="sm" />
        <p className="text-center text-xs text-[var(--color-ink-muted)]">
          Apple Pay · Google Pay · Card · secured by Stripe
        </p>
      </div>

      {/* Features — compact */}
      <ul className="grid gap-2 sm:grid-cols-2">
        {LANDING_PRICING_FEATURES.slice(0, 6).map((item) => (
          <li
            key={item}
            className="flex items-start gap-2 text-xs leading-snug text-[var(--color-ink-muted)]"
          >
            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--color-accent)]" aria-hidden />
            <span>{item}</span>
          </li>
        ))}
      </ul>

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
