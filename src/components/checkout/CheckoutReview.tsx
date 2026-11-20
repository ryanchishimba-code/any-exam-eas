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
  OFFER_PUBLIC_MESSAGE,
  TRIAL_UPGRADE_OFFER_PERCENT,
  type TrialUpgradeOfferView,
} from "@/lib/billing/trial-upgrade-offer";
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
import { formatPlanUsd, getBillingPlanTier, renewalIntervalWord } from "@/lib/billing-plans";
import { paidRenewalConsentText } from "@/lib/marketing/legal-copy";
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
    paymentMode: PaymentMode,
    renewalConsent: boolean,
    offerToken: string | null
  ) => void | Promise<void>;
  initialPromo?: string;
  /** Resolved on the server from `?offer=`. Null when the visit has no offer. */
  offer?: TrialUpgradeOfferView | null;
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
  offer = null,
  continueBusy = false,
}: CheckoutReviewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [plan, setPlan] = useState<SignupPlan>(initialPlan);
  const [tier, setTier] = useState<SubscriptionTier>(initialTier);
  const [interval, setInterval] = useState<BillingInterval>(initialInterval);
  const [paymentMode, setPaymentMode] = useState<PaymentMode>(initialPaymentMode);
  const [discount, setDiscount] = useState<DiscountValidation | null>(null);
  const [renewalConsent, setRenewalConsent] = useState(false);
  const initialOffer = offer?.token ?? "";

  const isUpgrade = plan === "subscribe";
  const showPaymentMode = isPaymentModeChoiceEnabled() && oneTimeAvailable;
  const effectivePaymentMode = showPaymentMode ? paymentMode : DEFAULT_PAYMENT_MODE;
  const needsRenewalConsent = isUpgrade && effectivePaymentMode === "auto";
  const consentPlan = getBillingPlanTier(tier, interval);
  const renewalConsentCopy = paidRenewalConsentText(
    formatPlanUsd(consentPlan.totalUsd),
    renewalIntervalWord(interval)
  );

  useEffect(() => {
    setRenewalConsent(false);
  }, [interval, tier, plan, effectivePaymentMode]);

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
    if (initialOffer) return;
    const stored = loadCheckoutDiscount(plan);
    if (stored?.validation) setDiscount(stored.validation);
  }, [plan, initialOffer]);

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
      const offer = searchParams.get("offer");
      const qs = new URLSearchParams({
        plan: nextPlan,
        tier: nextTier,
        interval: nextInterval,
      });
      if (isPaymentModeChoiceEnabled()) qs.set("mode", nextMode);
      if (promo) qs.set("promo", promo);
      if (offer) qs.set("offer", offer);
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

  const offerView = offer;
  const offerValid = offerView?.status === "valid" && Boolean(offerView.token);
  const offerPricing = offerValid
    ? buildPlanPricing(
        plan,
        tier,
        interval,
        offerView.percentOff ?? TRIAL_UPGRADE_OFFER_PERCENT,
        null
      )
    : null;
  const basePricing = buildPlanPricing(plan, tier, interval);
  const pricing = offerPricing
    ? offerPricing
    : discount?.valid && discount.pricing
      ? discount.pricing
      : basePricing;
  const summaryDiscount: DiscountValidation | null = offerValid
    ? {
        valid: true,
        code: `${TRIAL_UPGRADE_OFFER_PERCENT}% off first payment`,
        message: offerView?.message ?? OFFER_PUBLIC_MESSAGE.valid,
        discountPercent: offerView?.percentOff ?? TRIAL_UPGRADE_OFFER_PERCENT,
        pricing,
        fullAccessIncluded: true,
      }
    : discount;
  const discounted = Boolean(summaryDiscount?.valid && hasDiscount(pricing));
  const appliedCode = !offerValid && discounted ? discount?.code : null;
  const offerTokenForCheckout = offerValid ? initialOffer : null;

  const continueButton = (
    <div className="space-y-3">
      {needsRenewalConsent ? (
        <label className="flex items-start gap-2 text-left text-sm leading-snug text-[var(--color-ink)]">
          <input
            type="checkbox"
            className="mt-1"
            checked={renewalConsent}
            onChange={(event) => setRenewalConsent(event.target.checked)}
          />
          <span>{renewalConsentCopy}</span>
        </label>
      ) : null}
      <Button
        type="button"
        className="w-full gap-2"
        disabled={continueBusy || (needsRenewalConsent && !renewalConsent)}
        onClick={() =>
          void onContinue(
            offerValid ? null : discount?.valid ? discount : null,
            plan,
            tier,
            interval,
            effectivePaymentMode,
            needsRenewalConsent && renewalConsent,
            offerTokenForCheckout
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
        Card, Apple Pay, or Google Pay — wallets show when your device supports them.
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

        {offerView && !offerValid ? (
          <p className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm leading-snug text-[var(--color-ink-muted)]">
            {offerView.message}
          </p>
        ) : null}
        <CheckoutOrderSummary
          pricing={pricing}
          discount={summaryDiscount}
          interval={interval}
          tier={tier}
          paymentMode={effectivePaymentMode}
        />
        {offerValid ? (
          <p className="text-center text-[0.6875rem] leading-relaxed text-[var(--color-ink-muted)]">
            {TRIAL_UPGRADE_OFFER_PERCENT}% off this first payment only. It can’t be combined with another code.
          </p>
        ) : (
          <CheckoutDiscountSection
            plan={plan}
            interval={interval}
            initialCode={initialPromo}
            onValidationChange={handleValidationChange}
            appliedCode={appliedCode}
            onRemove={appliedCode ? handleRemoveDiscount : undefined}
          />
        )}

        {continueButton}
      </div>
    );
  }

  // Same single-column rhythm as upgrade: cycle, total, pay. Tier is fixed
  // at Pro and a $0 trial has nothing to auto-pay yet, so those controls go.
  return (
    <div className="mx-auto max-w-lg space-y-5">
      <UpgradeIntervalChoice value={interval} onChange={handleIntervalChange} tier={tier} />

      {offerView && !offerValid ? (
        <p className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm leading-snug text-[var(--color-ink-muted)]">
          {offerView.message}
        </p>
      ) : null}
      <CheckoutOrderSummary
        pricing={pricing}
        discount={summaryDiscount}
        interval={interval}
        tier={tier}
      />
      {offerValid ? (
        <p className="text-center text-[0.6875rem] leading-relaxed text-[var(--color-ink-muted)]">
          {TRIAL_UPGRADE_OFFER_PERCENT}% off this first payment only. It can’t be combined with another code.
        </p>
      ) : (
        <CheckoutDiscountSection
          plan={plan}
          interval={interval}
          initialCode={initialPromo}
          onValidationChange={handleValidationChange}
          appliedCode={appliedCode}
          onRemove={appliedCode ? handleRemoveDiscount : undefined}
        />
      )}

      {continueButton}
    </div>
  );
}
