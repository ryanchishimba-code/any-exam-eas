"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Lock } from "lucide-react";
import type { DiscountValidation } from "@/lib/discount/types";
import { buildPlanPricing, hasDiscount } from "@/lib/promo-pricing";
import {
  clearCheckoutDiscount,
  loadCheckoutDiscount,
  saveCheckoutDiscount,
} from "@/lib/client/checkout-discount";
import { CheckoutPlanSelector } from "@/components/checkout/CheckoutPlanSelector";
import { CheckoutOrderSummary } from "@/components/checkout/CheckoutOrderSummary";
import { CheckoutDiscountSection } from "@/components/checkout/CheckoutDiscountSection";
import { FullBenefitsBanner } from "@/components/checkout/FullBenefitsBanner";
import { TRIAL_DAYS } from "@/lib/billing-config";
import type { SignupPlan } from "@/lib/validators/auth";
import { Button } from "@/components/ui/Button";

type CheckoutReviewProps = {
  initialPlan: SignupPlan;
  onContinue: (discount: DiscountValidation | null, plan: SignupPlan) => void;
  initialPromo?: string;
};

export function CheckoutReview({
  initialPlan,
  onContinue,
  initialPromo = "",
}: CheckoutReviewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [plan, setPlan] = useState<SignupPlan>(initialPlan);
  const [discount, setDiscount] = useState<DiscountValidation | null>(null);

  useEffect(() => {
    setPlan(initialPlan);
  }, [initialPlan]);

  useEffect(() => {
    const stored = loadCheckoutDiscount(plan);
    if (stored?.validation) setDiscount(stored.validation);
  }, [plan]);

  const syncPlanToUrl = useCallback(
    (next: SignupPlan) => {
      setPlan(next);
      setDiscount(null);
      clearCheckoutDiscount();
      const promo = searchParams.get("promo");
      const qs = new URLSearchParams({ plan: next });
      if (promo) qs.set("promo", promo);
      router.replace(`/checkout?${qs.toString()}`, { scroll: false });
    },
    [router, searchParams]
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

  const basePricing = buildPlanPricing(plan);
  const pricing =
    discount?.valid && discount.pricing ? discount.pricing : basePricing;
  const discounted = discount?.valid && hasDiscount(pricing);
  const appliedCode = discounted ? discount?.code : null;

  const planLabel =
    plan === "trial" ? `${TRIAL_DAYS}-day trial` : "Monthly subscription";

  return (
    <div className="space-y-8">
      <CheckoutPlanSelector value={plan} onChange={syncPlanToUrl} />

      <CheckoutOrderSummary
        pricing={pricing}
        discount={discount}
        planLabel={planLabel}
      />

      <CheckoutDiscountSection
        plan={plan}
        initialCode={initialPromo}
        onValidationChange={handleValidationChange}
        appliedCode={appliedCode}
        onRemove={appliedCode ? handleRemoveDiscount : undefined}
      />

      <FullBenefitsBanner discounted={discounted} />

      <div className="space-y-3 pt-2">
        <Button
          type="button"
          className="w-full gap-2"
          onClick={() => onContinue(discount?.valid ? discount : null, plan)}
        >
          Continue to secure payment
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Button>
        <p className="flex items-center justify-center gap-1.5 text-xs text-slate-500">
          <Lock className="h-3.5 w-3.5" aria-hidden />
          Encrypted checkout powered by Stripe
        </p>
      </div>
    </div>
  );
}
