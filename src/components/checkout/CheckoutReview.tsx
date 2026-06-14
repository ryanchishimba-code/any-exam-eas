"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Lock } from "lucide-react";
import type { BillingInterval } from "@/lib/billing-config";
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
import { CheckoutOrderSummary } from "@/components/checkout/CheckoutOrderSummary";
import { CheckoutDiscountSection } from "@/components/checkout/CheckoutDiscountSection";
import { PricingGuarantees } from "@/components/pricing/PricingGuarantees";
import { TRIAL_DAYS } from "@/lib/billing-config";
import { formatCheckoutContinueCta } from "@/lib/site";
import type { SignupPlan } from "@/lib/validators/auth";
import { Button } from "@/components/ui/Button";

type CheckoutReviewProps = {
  initialPlan: SignupPlan;
  initialInterval?: BillingInterval;
  onContinue: (
    discount: DiscountValidation | null,
    plan: SignupPlan,
    interval: BillingInterval
  ) => void;
  initialPromo?: string;
};

export function CheckoutReview({
  initialPlan,
  initialInterval = "yearly",
  onContinue,
  initialPromo = "",
}: CheckoutReviewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [plan, setPlan] = useState<SignupPlan>(initialPlan);
  const [interval, setInterval] = useState<BillingInterval>(initialInterval);
  const [discount, setDiscount] = useState<DiscountValidation | null>(null);

  useEffect(() => {
    setPlan(initialPlan);
  }, [initialPlan]);

  useEffect(() => {
    setInterval(initialInterval);
  }, [initialInterval]);

  useEffect(() => {
    const stored = loadCheckoutDiscount(plan);
    if (stored?.validation) setDiscount(stored.validation);
  }, [plan]);

  const syncUrl = useCallback(
    (nextPlan: SignupPlan, nextInterval: BillingInterval) => {
      const promo = searchParams.get("promo");
      const qs = new URLSearchParams({ plan: nextPlan, interval: nextInterval });
      if (promo) qs.set("promo", promo);
      router.replace(`/checkout?${qs.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const handlePlanChange = useCallback(
    (next: SignupPlan) => {
      setPlan(next);
      setDiscount(null);
      clearCheckoutDiscount();
      syncUrl(next, interval);
    },
    [interval, syncUrl]
  );

  const handleIntervalChange = useCallback(
    (next: BillingInterval) => {
      setInterval(next);
      setDiscount(null);
      clearCheckoutDiscount();
      syncUrl(plan, next);
    },
    [plan, syncUrl]
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

  const basePricing = buildPlanPricing(plan, interval);
  const pricing =
    discount?.valid && discount.pricing ? discount.pricing : basePricing;
  const discounted = discount?.valid && hasDiscount(pricing);
  const appliedCode = discounted ? discount?.code : null;

  const tier = getBillingPlanTier(interval);
  const planLabel =
    plan === "trial"
      ? `${TRIAL_DAYS}-day free trial · ${tier.label}`
      : `${tier.label} subscription`;

  const continueButton = (
    <div className="space-y-3">
      <Button
        type="button"
        className="w-full gap-2"
        onClick={() => onContinue(discount?.valid ? discount : null, plan, interval)}
      >
        {formatCheckoutContinueCta(plan, interval)}
        <ArrowRight className="h-4 w-4" aria-hidden />
      </Button>
      <p className="flex items-center justify-center gap-1.5 text-[0.6875rem] text-[var(--color-ink-muted)]">
        <Lock className="h-3.5 w-3.5" aria-hidden />
        Secured by Stripe · Apple Pay & Google Pay
      </p>
    </div>
  );

  return (
    <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start lg:gap-10">
      <div className="space-y-6">
        <CheckoutPlanSelector value={plan} onChange={handlePlanChange} />
        <BillingIntervalSelector value={interval} onChange={handleIntervalChange} />
        <CheckoutDiscountSection
          plan={plan}
          interval={interval}
          initialCode={initialPromo}
          onValidationChange={handleValidationChange}
          appliedCode={appliedCode}
          onRemove={appliedCode ? handleRemoveDiscount : undefined}
        />

        {/* Mobile summary + CTA */}
        <div className="space-y-4 lg:hidden">
          <CheckoutOrderSummary
            pricing={pricing}
            discount={discount}
            planLabel={planLabel}
            interval={interval}
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
          sticky
        />
        <PricingGuarantees variant="compact" />
        {continueButton}
      </aside>
    </div>
  );
}
