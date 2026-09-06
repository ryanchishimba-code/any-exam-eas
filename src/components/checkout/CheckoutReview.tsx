"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Lock } from "lucide-react";
import type { BillingInterval } from "@/lib/billing-config";
import { TRIAL_DAYS } from "@/lib/billing-config";
import { BILLING_TRIAL_DISCLOSURE } from "@/lib/billing-plans";
import type { DiscountValidation } from "@/lib/discount/types";
import { getBillingPlanTier } from "@/lib/billing-plans";
import { buildPlanPricing, hasDiscount } from "@/lib/promo-pricing";
import {
  clearCheckoutDiscount,
  loadCheckoutDiscount,
  saveCheckoutDiscount,
} from "@/lib/client/checkout-discount";
import { BillingIntervalSelector } from "@/components/checkout/BillingIntervalSelector";
import { CheckoutPlanSelector } from "@/components/checkout/CheckoutPlanSelector";
import { CheckoutTierSelector } from "@/components/checkout/CheckoutTierSelector";
import { CheckoutOrderSummary } from "@/components/checkout/CheckoutOrderSummary";
import { CheckoutDiscountSection } from "@/components/checkout/CheckoutDiscountSection";
import { UpgradeIntervalChoice } from "@/components/checkout/UpgradeIntervalChoice";
import { PricingGuarantees } from "@/components/pricing/PricingGuarantees";
import { formatCheckoutContinueCta, formatTierName } from "@/lib/site";
import type { SubscriptionTier } from "@/lib/subscription-tiers";
import type { SignupPlan } from "@/lib/validators/auth";
import { Button } from "@/components/ui/Button";

type CheckoutReviewProps = {
  initialPlan: SignupPlan;
  initialTier?: SubscriptionTier;
  initialInterval?: BillingInterval;
  onContinue: (
    discount: DiscountValidation | null,
    plan: SignupPlan,
    tier: SubscriptionTier,
    interval: BillingInterval
  ) => void | Promise<void>;
  initialPromo?: string;
  continueBusy?: boolean;
};

export function CheckoutReview({
  initialPlan,
  initialTier = "pro",
  initialInterval = "monthly",
  onContinue,
  initialPromo = "",
  continueBusy = false,
}: CheckoutReviewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [plan, setPlan] = useState<SignupPlan>(initialPlan);
  const [tier, setTier] = useState<SubscriptionTier>(initialTier);
  const [interval, setInterval] = useState<BillingInterval>(initialInterval);
  const [discount, setDiscount] = useState<DiscountValidation | null>(null);

  const isUpgrade = plan === "subscribe";

  useEffect(() => {
    setPlan(initialPlan);
  }, [initialPlan]);

  useEffect(() => {
    setTier(initialTier);
  }, [initialTier]);

  useEffect(() => {
    setInterval(initialInterval);
  }, [initialInterval]);

  useEffect(() => {
    const stored = loadCheckoutDiscount(plan);
    if (stored?.validation) setDiscount(stored.validation);
  }, [plan]);

  const syncUrl = useCallback(
    (nextPlan: SignupPlan, nextTier: SubscriptionTier, nextInterval: BillingInterval) => {
      const promo = searchParams.get("promo");
      const reactivate = searchParams.get("reactivate");
      const returnPath = searchParams.get("return");
      const qs = new URLSearchParams({
        plan: nextPlan,
        tier: nextTier,
        interval: nextInterval,
      });
      if (promo) qs.set("promo", promo);
      if (reactivate) qs.set("reactivate", reactivate);
      if (returnPath) qs.set("return", returnPath);
      router.replace(`/checkout?${qs.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const handlePlanChange = useCallback(
    (next: SignupPlan) => {
      setPlan(next);
      setDiscount(null);
      clearCheckoutDiscount();
      syncUrl(next, tier, interval);
    },
    [interval, syncUrl, tier]
  );

  const handleTierChange = useCallback(
    (next: SubscriptionTier) => {
      setTier(next);
      setDiscount(null);
      clearCheckoutDiscount();
      syncUrl(plan, next, interval);
    },
    [interval, plan, syncUrl]
  );

  const handleIntervalChange = useCallback(
    (next: BillingInterval) => {
      setInterval(next);
      setDiscount(null);
      clearCheckoutDiscount();
      syncUrl(plan, tier, next);
    },
    [plan, syncUrl, tier]
  );

  const handleValidationChange = useCallback(
    (result: DiscountValidation | null) => {
      setDiscount(result);
      if (result?.valid) saveCheckoutDiscount(plan, result);
      else if (!result) clearCheckoutDiscount();
    },
    [plan]
  );

  const handleRemoveDiscount = () => {
    clearCheckoutDiscount();
    setDiscount(null);
  };

  const basePricing = buildPlanPricing(plan, tier, interval);
  const pricing =
    discount?.valid && discount.pricing ? discount.pricing : basePricing;
  const discounted = discount?.valid && hasDiscount(pricing);
  const appliedCode = discounted ? discount?.code : null;

  const planTier = getBillingPlanTier(tier, interval);
  const planLabel =
    plan === "trial"
      ? `${TRIAL_DAYS}-day free trial · ${formatTierName(tier)} · ${planTier.label}`
      : `${formatTierName(tier)} · ${planTier.label}`;

  const continueButton = (
    <div className="space-y-3">
      <Button
        type="button"
        className="w-full gap-2"
        disabled={continueBusy}
        onClick={() =>
          void onContinue(discount?.valid ? discount : null, plan, tier, interval)
        }
      >
        {continueBusy
          ? "Upgrading…"
          : isUpgrade
            ? "Upgrade now"
            : formatCheckoutContinueCta(plan, tier, interval)}
        {!continueBusy ? <ArrowRight className="h-4 w-4" aria-hidden /> : null}
      </Button>
      {isUpgrade ? (
        <p className="text-center text-[0.6875rem] text-[var(--color-ink-muted)]">
          You can upgrade anytime before your trial ends. Billing starts when you confirm.
        </p>
      ) : (
        <p className="text-center text-[0.6875rem] text-[var(--color-ink-muted)]">
          {BILLING_TRIAL_DISCLOSURE}
        </p>
      )}
      <p className="flex items-center justify-center gap-1.5 text-[0.6875rem] text-[var(--color-ink-muted)]">
        <Lock className="h-3.5 w-3.5" aria-hidden />
        Secured by Stripe · Apple Pay & Google Pay
      </p>
    </div>
  );

  if (isUpgrade) {
    return (
      <div className="mx-auto max-w-lg space-y-6">
        <div className="text-center sm:text-left">
          <p className="text-sm font-medium text-[var(--color-accent)]">Pro</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-[var(--color-ink)]">
            One plan · all 6 boards
          </h2>
          <p className="mt-1.5 text-sm text-[var(--color-ink-muted)]">
            Upgrade anytime before your trial ends — unlimited questions, Roadmaps, Deep
            Dives, Full Exams, and study tools. Billing starts when you confirm.
          </p>
        </div>

        <UpgradeIntervalChoice value={interval} onChange={handleIntervalChange} tier={tier} />

        <CheckoutOrderSummary
          pricing={pricing}
          discount={discount}
          planLabel={planLabel}
          interval={interval}
          tier={tier}
        />

        <CheckoutDiscountSection
          plan={plan}
          interval={interval}
          initialCode={initialPromo}
          onValidationChange={handleValidationChange}
          appliedCode={appliedCode}
          onRemove={appliedCode ? handleRemoveDiscount : undefined}
        />

        {continueButton}
      </div>
    );
  }

  return (
    <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start lg:gap-10">
      <div className="space-y-6">
        <CheckoutTierSelector value={tier} onChange={handleTierChange} />
        <CheckoutPlanSelector value={plan} onChange={handlePlanChange} />
        <BillingIntervalSelector value={interval} onChange={handleIntervalChange} tier={tier} />
        <CheckoutDiscountSection
          plan={plan}
          interval={interval}
          initialCode={initialPromo}
          onValidationChange={handleValidationChange}
          appliedCode={appliedCode}
          onRemove={appliedCode ? handleRemoveDiscount : undefined}
        />

        <div className="space-y-4 lg:hidden">
          <CheckoutOrderSummary
            pricing={pricing}
            discount={discount}
            planLabel={planLabel}
            interval={interval}
            tier={tier}
          />
          {continueButton}
        </div>
      </div>

      <aside className="hidden space-y-4 lg:block">
        <CheckoutOrderSummary
          pricing={pricing}
          discount={discount}
          planLabel={planLabel}
          interval={interval}
          tier={tier}
          sticky
        />
        <PricingGuarantees variant="compact" />
        {continueButton}
      </aside>
    </div>
  );
}
