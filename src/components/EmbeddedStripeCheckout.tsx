"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import { PaymentMethodsList } from "./PaymentMethodsList";
import { InlineError, StatusMessage } from "@/components/ui/StatusMessage";
import { CheckoutReview } from "@/components/checkout/CheckoutReview";
import { loadCheckoutDiscount } from "@/lib/client/checkout-discount";
import type { DiscountValidation } from "@/lib/discount/types";
import { formatUsd, hasDiscount } from "@/lib/promo-pricing";
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
  const initialPromo = searchParams.get("promo") ?? "";

  const [phase, setPhase] = useState<"review" | "payment">("review");
  const [appliedDiscount, setAppliedDiscount] = useState<DiscountValidation | null>(null);
  const [publishableKey, setPublishableKey] = useState<string | null>(null);
  const [configured, setConfigured] = useState(true);
  const [missingKeys, setMissingKeys] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [checkoutKey, setCheckoutKey] = useState(0);

  useEffect(() => {
    const stored = loadCheckoutDiscount(plan);
    if (stored?.validation) setAppliedDiscount(stored.validation);
  }, [plan]);

  useEffect(() => {
    fetch("/api/stripe/config")
      .then((r) => r.json())
      .then((data) => {
        setConfigured(data.configured);
        setPublishableKey(data.publishableKey);
        if (Array.isArray(data.missing)) setMissingKeys(data.missing);
      })
      .catch(() => setError("Could not load payment configuration."));
  }, []);

  const promoCode = appliedDiscount?.valid ? appliedDiscount.code : "";

  const fetchClientSecret = useCallback(async () => {
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        embedded: true,
        plan,
        promoCode: promoCode || undefined,
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
    if (!data.clientSecret) {
      throw new Error("Checkout did not return a client secret.");
    }
    return data.clientSecret as string;
  }, [plan, promoCode, checkoutKey]);

  function handleContinueToPayment(
    discount: DiscountValidation | null,
    selectedPlan?: SignupPlan
  ) {
    if (selectedPlan && selectedPlan !== plan) {
      const qs = new URLSearchParams({ plan: selectedPlan });
      if (discount?.code) qs.set("promo", discount.code);
      window.history.replaceState(null, "", `/checkout?${qs.toString()}`);
    }
    setAppliedDiscount(discount);
    setCheckoutKey((k) => k + 1);
    setPhase("payment");
  }

  if (error) {
    return <InlineError>{error}</InlineError>;
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
      </StatusMessage>
    );
  }

  if (phase === "review") {
    return (
      <CheckoutReview
        initialPlan={plan}
        initialPromo={initialPromo}
        onContinue={handleContinueToPayment}
      />
    );
  }

  if (!publishableKey) {
    return <p className="text-sm text-[var(--color-ink-muted)]">Loading secure checkout…</p>;
  }

  const pricing = appliedDiscount?.valid ? appliedDiscount.pricing : undefined;
  const showDiscount =
    pricing && hasDiscount(pricing) && appliedDiscount?.code;

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => setPhase("review")}
        className="text-sm font-medium text-[var(--color-accent)] hover:underline"
      >
        ← Back to review
      </button>

      {showDiscount && pricing && (
        <div className="rounded-2xl border border-emerald-200/70 bg-emerald-50/50 px-4 py-3 text-sm">
          <p className="font-semibold text-emerald-900">
            {appliedDiscount.code} applied · save {pricing.formattedSavings}
          </p>
          <p className="mt-1 text-emerald-800">
            Charged{" "}
            <span className="font-semibold">{formatUsd(pricing.primary.discounted)}</span>
            {pricing.recurring && (
              <>
                {" "}
                then {formatUsd(pricing.recurring.discounted)}/mo
              </>
            )}
            {" · "}full benefits included
          </p>
        </div>
      )}

      <PaymentMethodsList compact />
      <div className="overflow-hidden rounded-2xl border border-black/[0.08] bg-white shadow-[var(--shadow-apple-sm)]">
        <EmbeddedCheckoutProvider
          key={checkoutKey}
          stripe={getStripe(publishableKey)}
          options={{ fetchClientSecret }}
        >
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      </div>
      <p className="text-center text-[0.6875rem] leading-relaxed text-[var(--color-ink-muted)]">
        Payments are encrypted and processed by Stripe. Cancel anytime from your account settings.
      </p>
    </div>
  );
}
