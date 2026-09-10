"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { InlineError, StatusMessage } from "@/components/ui/StatusMessage";
import { CheckoutReview } from "@/components/checkout/CheckoutReview";
import { CheckoutStepIndicator } from "@/components/checkout/CheckoutStepIndicator";
import { PaymentMethodBadges } from "@/components/PaymentMethodBadges";
import { loadCheckoutDiscount } from "@/lib/client/checkout-discount";
import type { BillingInterval } from "@/lib/billing-config";
import { parseBillingInterval } from "@/lib/billing-plans";
import {
  isPaymentModeChoiceEnabled,
  parsePaymentMode,
  type PaymentMode,
} from "@/lib/billing-payment-mode";
import type { DiscountValidation } from "@/lib/discount/types";
import type { SubscriptionTier } from "@/lib/subscription-tiers";
import type { SignupPlan } from "@/lib/validators/auth";

/**
 * Plan review stays on-site; payment opens Stripe-hosted Checkout.
 *
 * Embedded Checkout only shows Apple Pay on Safari 17+ / iOS 17+ and requires
 * live Payment Method Domain registration. Hosted Checkout surfaces Apple Pay
 * (and Google Pay) whenever the shopper's device supports them, which is what
 * "easy checkout" needs.
 */
export function EmbeddedStripeCheckout() {
  const searchParams = useSearchParams();
  const plan: SignupPlan = searchParams.get("plan") === "trial" ? "trial" : "subscribe";
  const tier = useMemo((): SubscriptionTier => {
    const raw = searchParams.get("tier");
    return raw === "pro" ? "pro" : "pro";
  }, [searchParams]);
  const interval = useMemo(() => {
    const raw = searchParams.get("interval");
    return raw ? parseBillingInterval(raw) : "monthly";
  }, [searchParams]);
  const paymentMode = useMemo(
    () => parsePaymentMode(searchParams.get("mode")),
    [searchParams]
  );
  const initialPromo = searchParams.get("promo") ?? "";
  const reactivating = searchParams.get("reactivate") === "1";

  const [selectedPlan, setSelectedPlan] = useState<SignupPlan>(plan);
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier>(tier);
  const [selectedInterval, setSelectedInterval] = useState<BillingInterval>(interval);
  const [selectedPaymentMode, setSelectedPaymentMode] = useState<PaymentMode>(paymentMode);
  const [appliedDiscount, setAppliedDiscount] = useState<DiscountValidation | null>(null);
  const [configured, setConfigured] = useState(true);
  const [allIntervalsConfigured, setAllIntervalsConfigured] = useState(true);
  const [oneTimeAvailable, setOneTimeAvailable] = useState(false);
  const [missingKeys, setMissingKeys] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [upgradeBusy, setUpgradeBusy] = useState(false);

  useEffect(() => {
    setSelectedPlan(plan);
    setSelectedTier(tier);
    setSelectedInterval(interval);
    setSelectedPaymentMode(paymentMode);
  }, [plan, tier, interval, paymentMode]);

  useEffect(() => {
    const stored = loadCheckoutDiscount(selectedPlan);
    if (stored?.validation) setAppliedDiscount(stored.validation);
  }, [selectedPlan]);

  useEffect(() => {
    fetch("/api/stripe/config")
      .then((r) => r.json())
      .then((data) => {
        setConfigured(data.configured);
        setAllIntervalsConfigured(data.allIntervalsConfigured !== false);
        setOneTimeAvailable(data.oneTimePaymentsAvailable === true);
        if (Array.isArray(data.missing)) setMissingKeys(data.missing);
      })
      .catch(() => setError("Could not load payment configuration."));
  }, []);

  async function handleContinueToPayment(
    discount: DiscountValidation | null,
    nextPlan: SignupPlan,
    nextTier: SubscriptionTier,
    nextInterval: BillingInterval,
    nextPaymentMode: PaymentMode
  ) {
    setSelectedPlan(nextPlan);
    setSelectedTier(nextTier);
    setSelectedInterval(nextInterval);
    setSelectedPaymentMode(nextPaymentMode);
    const qs = new URLSearchParams({ plan: nextPlan, tier: nextTier, interval: nextInterval });
    if (isPaymentModeChoiceEnabled()) qs.set("mode", nextPaymentMode);
    if (discount?.code) qs.set("promo", discount.code);
    if (reactivating) qs.set("reactivate", "1");
    const returnPath = searchParams.get("return");
    if (returnPath) qs.set("return", returnPath);
    window.history.replaceState(null, "", `/checkout?${qs.toString()}`);
    setAppliedDiscount(discount);
    setError("");
    setUpgradeBusy(true);

    try {
      // Hosted Checkout (no `embedded`) — Apple Pay / Google Pay show when the
      // device supports them. Mid-trial converts with a card on file still
      // short-circuit to dashboard via `upgraded`.
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: nextPlan,
          tier: nextTier,
          interval: nextInterval,
          paymentMode: nextPaymentMode,
          promoCode: discount?.valid ? discount.code : undefined,
          reactivate: reactivating || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(
          typeof data.error === "string"
            ? data.error
            : "Could not start checkout. Try again or open Settings → Billing."
        );
        return;
      }
      if (data.upgraded && typeof data.redirectTo === "string") {
        window.location.assign(data.redirectTo);
        return;
      }
      if (typeof data.url === "string") {
        window.location.assign(data.url);
        return;
      }
      setError("Could not start checkout.");
    } catch {
      setError("Could not start checkout. Check your connection and try again.");
    } finally {
      setUpgradeBusy(false);
    }
  }

  if (!configured) {
    return (
      <StatusMessage variant="warning">
        Payments are not configured on this server. Add Stripe API keys to enable checkout.
        {missingKeys.length > 0 && (
          <span className="mt-2 block text-xs">
            Missing in <code className="rounded bg-black/5 px-1">.env</code>:{" "}
            {missingKeys.join(", ")}.
          </span>
        )}
        <span className="mt-2 block text-xs">
          Run <code className="rounded bg-black/5 px-1">npm run stripe:setup</code> to create all
          billing prices.
        </span>
      </StatusMessage>
    );
  }

  return (
    <div>
      <CheckoutStepIndicator
        step="review"
        mode={plan === "subscribe" ? "upgrade" : "default"}
      />
      {!allIntervalsConfigured && missingKeys.length > 0 && (
        <StatusMessage variant="warning" className="mb-6">
          Some billing intervals are missing Stripe prices ({missingKeys.join(", ")}). Run{" "}
          <code className="rounded bg-black/5 px-1">npm run stripe:setup</code> before testing
          all plans.
        </StatusMessage>
      )}
      {error ? <InlineError className="mb-4">{error}</InlineError> : null}
      <CheckoutReview
        initialPlan={plan}
        initialTier={tier}
        initialInterval={interval}
        initialPaymentMode={paymentMode}
        oneTimeAvailable={oneTimeAvailable}
        initialPromo={initialPromo}
        onContinue={handleContinueToPayment}
        continueBusy={upgradeBusy}
      />
      <div className="mx-auto mt-6 max-w-lg space-y-2">
        <PaymentMethodBadges className="justify-center" size="sm" />
        <p className="text-center text-[0.6875rem] text-[var(--color-ink-muted)]">
          Apple Pay &amp; Google Pay appear on Stripe Checkout when your device supports them.
        </p>
      </div>
    </div>
  );
}
