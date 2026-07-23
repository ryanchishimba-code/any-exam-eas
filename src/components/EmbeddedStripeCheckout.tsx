"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import { PaymentMethodsList } from "./PaymentMethodsList";
import { InlineError, StatusMessage } from "@/components/ui/StatusMessage";
import { CheckoutReview } from "@/components/checkout/CheckoutReview";
import { CheckoutStepIndicator } from "@/components/checkout/CheckoutStepIndicator";
import { loadCheckoutDiscount } from "@/lib/client/checkout-discount";
import type { BillingInterval } from "@/lib/billing-config";
import { parseBillingInterval, BILLING_POLICY_SHORT } from "@/lib/billing-plans";
import type { DiscountValidation } from "@/lib/discount/types";
import { formatUsd, hasDiscount } from "@/lib/promo-pricing";
import type { SubscriptionTier } from "@/lib/subscription-tiers";
import type { SignupPlan } from "@/lib/validators/auth";

let stripePromise: Promise<Stripe | null> | null = null;

function getStripe(publishableKey: string) {
  if (!stripePromise) {
    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
}

export function EmbeddedStripeCheckout() {
  const searchParams = useSearchParams();
  const plan: SignupPlan = searchParams.get("plan") === "trial" ? "trial" : "subscribe";
  const tier = useMemo((): SubscriptionTier => {
    const raw = searchParams.get("tier");
    return raw === "pro" ? "pro" : "pro";
  }, [searchParams]);
  const interval = useMemo(() => {
    const raw = searchParams.get("interval");
    return raw ? parseBillingInterval(raw) : "yearly";
  }, [searchParams]);
  const initialPromo = searchParams.get("promo") ?? "";
  const reactivating = searchParams.get("reactivate") === "1";

  const [phase, setPhase] = useState<"review" | "payment">("review");
  const [selectedPlan, setSelectedPlan] = useState<SignupPlan>(plan);
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier>(tier);
  const [selectedInterval, setSelectedInterval] = useState<BillingInterval>(interval);
  const [appliedDiscount, setAppliedDiscount] = useState<DiscountValidation | null>(null);
  const [publishableKey, setPublishableKey] = useState<string | null>(null);
  const [configured, setConfigured] = useState(true);
  const [allIntervalsConfigured, setAllIntervalsConfigured] = useState(true);
  const [missingKeys, setMissingKeys] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [upgradeBusy, setUpgradeBusy] = useState(false);
  const [checkoutKey, setCheckoutKey] = useState(0);
  const [prefetchedClientSecret, setPrefetchedClientSecret] = useState<string | null>(null);

  useEffect(() => {
    setSelectedPlan(plan);
    setSelectedTier(tier);
    setSelectedInterval(interval);
  }, [plan, tier, interval]);

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
        setPublishableKey(data.publishableKey);
        if (Array.isArray(data.missing)) setMissingKeys(data.missing);
      })
      .catch(() => setError("Could not load payment configuration."));
  }, []);

  const promoCode = appliedDiscount?.valid ? appliedDiscount.code : "";

  const fetchClientSecret = useCallback(async () => {
    if (prefetchedClientSecret) {
      const secret = prefetchedClientSecret;
      setPrefetchedClientSecret(null);
      return secret;
    }

    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        embedded: true,
        plan: selectedPlan,
        tier: selectedTier,
        interval: selectedInterval,
        promoCode: promoCode || undefined,
        reactivate: reactivating || undefined,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(
        typeof data.error === "string"
          ? data.error
          : "Could not start checkout. Check Stripe keys and restart the server."
      );
    }
    if (data.upgraded && typeof data.redirectTo === "string") {
      window.location.assign(data.redirectTo);
      return new Promise<string>(() => {});
    }
    if (!data.clientSecret) {
      throw new Error("Checkout did not return a client secret.");
    }
    return data.clientSecret as string;
  }, [
    selectedPlan,
    selectedTier,
    selectedInterval,
    promoCode,
    checkoutKey,
    reactivating,
    prefetchedClientSecret,
  ]);

  async function handleContinueToPayment(
    discount: DiscountValidation | null,
    nextPlan: SignupPlan,
    nextTier: SubscriptionTier,
    nextInterval: BillingInterval
  ) {
    setSelectedPlan(nextPlan);
    setSelectedTier(nextTier);
    setSelectedInterval(nextInterval);
    const qs = new URLSearchParams({ plan: nextPlan, tier: nextTier, interval: nextInterval });
    if (discount?.code) qs.set("promo", discount.code);
    if (reactivating) qs.set("reactivate", "1");
    const returnPath = searchParams.get("return");
    if (returnPath) qs.set("return", returnPath);
    window.history.replaceState(null, "", `/checkout?${qs.toString()}`);
    setAppliedDiscount(discount);
    setError("");

    // Subscribe upgrades: attempt mid-trial convert first (ends trial + bills card on file).
    // No-payment trials and converts without a card fall through to embedded Checkout.
    if (nextPlan === "subscribe") {
      setUpgradeBusy(true);
      try {
        const res = await fetch("/api/stripe/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            embedded: true,
            plan: nextPlan,
            tier: nextTier,
            interval: nextInterval,
            promoCode: discount?.valid ? discount.code : undefined,
            reactivate: reactivating || undefined,
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setError(
            typeof data.error === "string"
              ? data.error
              : "Could not start upgrade. Try again or open Settings → Billing."
          );
          return;
        }
        if (data.upgraded && typeof data.redirectTo === "string") {
          window.location.assign(data.redirectTo);
          return;
        }
        if (typeof data.clientSecret === "string") {
          setPrefetchedClientSecret(data.clientSecret);
          setCheckoutKey((k) => k + 1);
          setPhase("payment");
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }
        setError("Could not start checkout.");
        return;
      } catch {
        setError("Could not start upgrade. Check your connection and try again.");
        return;
      } finally {
        setUpgradeBusy(false);
      }
    }

    setPrefetchedClientSecret(null);
    setCheckoutKey((k) => k + 1);
    setPhase("payment");
    window.scrollTo({ top: 0, behavior: "smooth" });
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

  if (phase === "review") {
    return (
      <div>
        <CheckoutStepIndicator step="review" mode={plan === "subscribe" ? "upgrade" : "default"} />
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
          initialPromo={initialPromo}
          onContinue={handleContinueToPayment}
          continueBusy={upgradeBusy}
        />
      </div>
    );
  }

  if (!publishableKey) {
    return <p className="text-sm text-[var(--color-ink-muted)]">Loading secure checkout…</p>;
  }

  const pricing = appliedDiscount?.valid ? appliedDiscount.pricing : undefined;
  const showDiscount = pricing && hasDiscount(pricing) && appliedDiscount?.code;

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <CheckoutStepIndicator step="payment" mode={selectedPlan === "subscribe" ? "upgrade" : "default"} />

      <button
        type="button"
        onClick={() => {
          setPhase("review");
          setPrefetchedClientSecret(null);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        className="text-sm font-medium text-[var(--color-accent)] hover:underline"
      >
        ← Edit plan
      </button>

      {showDiscount && pricing && (
        <div className="rounded-2xl border border-emerald-200/70 bg-emerald-50/50 px-4 py-3 text-sm">
          <p className="font-semibold text-emerald-900">
            {appliedDiscount.code} applied · save {pricing.formattedSavings}
          </p>
        </div>
      )}

      <PaymentMethodsList compact />
      <div className="overflow-hidden rounded-[24px] border border-black/[0.08] bg-white shadow-[var(--shadow-apple-sm)]">
        <EmbeddedCheckoutProvider
          key={checkoutKey}
          stripe={getStripe(publishableKey)}
          options={{ fetchClientSecret }}
        >
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      </div>
      <p className="text-center text-[0.6875rem] leading-relaxed text-[var(--color-ink-muted)]">
        Encrypted by Stripe · Card · Link · Apple Pay & Google Pay when available ·{" "}
        {BILLING_POLICY_SHORT}
      </p>
    </div>
  );
}
