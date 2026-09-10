"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight } from "lucide-react";
import type { BillingInterval } from "@/lib/billing-config";
import type { DiscountValidation } from "@/lib/discount/types";
import {
  DEFAULT_PAYMENT_MODE,
  isPaymentModeChoiceEnabled,
  type PaymentMode,
} from "@/lib/billing-payment-mode";
import { buildPlanPricing, hasDiscount } from "@/lib/promo-pricing";
import {
  clearCheckoutDiscount,
  loadCheckoutDiscount,
  saveCheckoutDiscount,
} from "@/lib/client/checkout-discount";
import { PaymentModeToggle } from "@/components/pricing/PaymentModeToggle";
import { CancelAnytimeNote } from "@/components/pricing/CancelAnytimeNote";
import { CheckoutOrderSummary } from "@/components/checkout/CheckoutOrderSummary";
import { CheckoutDiscountSection } from "@/components/checkout/CheckoutDiscountSection";
import { UpgradeIntervalChoice } from "@/components/checkout/UpgradeIntervalChoice";
import { PaymentMethodBadges } from "@/components/PaymentMethodBadges";
import { formatCheckoutContinueCta } from "@/lib/site";
import type { SubscriptionTier } from "@/lib/subscription-tiers";
import type { SignupPlan } from "@/lib/validators/auth";
import { Button } from "@/components/ui/Button";

type CheckoutReviewProps = {
  initialPlan: SignupPlan;
  initialTier?: SubscriptionTier;
  initialInterval?: BillingInterval;
  initialPaymentMode?: PaymentMode;
  /** False when Stripe has no one-time prices — hides the pay-once option. */
  oneTimeAvailable?: boolean;
  onContinue: (
    discount: DiscountValidation | null,
    plan: SignupPlan,
    tier: SubscriptionTier,
    interval: BillingInterval,
    paymentMode: PaymentMode
  ) => void | Promise<void>;
  initialPromo?: string;
  continueBusy?: boolean;
};

export function CheckoutReview({
  initialPlan,
  initialTier = "pro",
  initialInterval = "monthly",
  initialPaymentMode = DEFAULT_PAYMENT_MODE,
  oneTimeAvailable = true,
  onContinue,
  initialPromo = "",
  continueBusy = false,
}: CheckoutReviewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [plan, setPlan] = useState<SignupPlan>(initialPlan);
  const [tier, setTier] = useState<SubscriptionTier>(initialTier);
  const [interval, setInterval] = useState<BillingInterval>(initialInterval);
  const [paymentMode, setPaymentMode] = useState<PaymentMode>(initialPaymentMode);
  const [discount, setDiscount] = useState<DiscountValidation | null>(null);

  const isUpgrade = plan === "subscribe";
  const showPaymentMode = isPaymentModeChoiceEnabled() && oneTimeAvailable;
  const effectivePaymentMode = showPaymentMode ? paymentMode : DEFAULT_PAYMENT_MODE;

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
    setPaymentMode(initialPaymentMode);
  }, [initialPaymentMode]);

  useEffect(() => {
    const stored = loadCheckoutDiscount(plan);
    if (stored?.validation) setDiscount(stored.validation);
  }, [plan]);

  const syncUrl = useCallback(
    (
      nextPlan: SignupPlan,
      nextTier: SubscriptionTier,
      nextInterval: BillingInterval,
      nextMode: PaymentMode
    ) => {
      const promo = searchParams.get("promo");
      const reactivate = searchParams.get("reactivate");
      const returnPath = searchParams.get("return");
      const qs = new URLSearchParams({
        plan: nextPlan,
        tier: nextTier,
        interval: nextInterval,
      });
      if (isPaymentModeChoiceEnabled()) qs.set("mode", nextMode);
      if (promo) qs.set("promo", promo);
      if (reactivate) qs.set("reactivate", reactivate);
      if (returnPath) qs.set("return", returnPath);
      router.replace(`/checkout?${qs.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const handleIntervalChange = useCallback(
    (next: BillingInterval) => {
      setInterval(next);
      setDiscount(null);
      clearCheckoutDiscount();
      syncUrl(plan, tier, next, paymentMode);
    },
    [paymentMode, plan, syncUrl, tier]
  );

  const handlePaymentModeChange = useCallback(
    (next: PaymentMode) => {
      setPaymentMode(next);
      syncUrl(plan, tier, interval, next);
    },
    [interval, plan, syncUrl, tier]
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

  const continueButton = (
    <div className="space-y-3">
      <Button
        type="button"
        className="w-full gap-2"
        disabled={continueBusy}
        onClick={() =>
          void onContinue(
            discount?.valid ? discount : null,
            plan,
            tier,
            interval,
            effectivePaymentMode
          )
        }
      >
        {continueBusy
          ? "Upgrading…"
          : isUpgrade
            ? "Upgrade now"
            : formatCheckoutContinueCta(plan, tier, interval)}
        {!continueBusy ? <ArrowRight className="h-4 w-4" aria-hidden /> : null}
      </Button>
      {/* Summary already shows Cancel anytime for paid plans; keep it under the
          CTA on the trial path so the reassurance sits next to the action. */}
      <CancelAnytimeNote hidden={isUpgrade} />
      <PaymentMethodBadges className="justify-center" size="sm" />
      <p className="text-center text-[0.6875rem] text-[var(--color-ink-muted)]">
        Secured by Stripe
      </p>
    </div>
  );

  // No restatement of the page heading — pick a cycle, see the total, pay.
  if (isUpgrade) {
    return (
      <div className="mx-auto max-w-lg space-y-5">
        <UpgradeIntervalChoice value={interval} onChange={handleIntervalChange} tier={tier} />

        {showPaymentMode && (
          <PaymentModeToggle
            value={paymentMode}
            onChange={handlePaymentModeChange}
            interval={interval}
            tier={tier}
          />
        )}

        <CheckoutOrderSummary
          pricing={pricing}
          discount={discount}
          interval={interval}
          tier={tier}
          paymentMode={effectivePaymentMode}
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

  // Same single-column rhythm as upgrade: cycle, total, pay. Tier is fixed
  // at Pro and a $0 trial has nothing to auto-pay yet, so those controls go.
  return (
    <div className="mx-auto max-w-lg space-y-5">
      <UpgradeIntervalChoice value={interval} onChange={handleIntervalChange} tier={tier} />

      <CheckoutOrderSummary
        pricing={pricing}
        discount={discount}
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
