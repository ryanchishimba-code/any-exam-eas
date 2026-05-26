"use client";

import { useCallback, useEffect, useState } from "react";
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import { formatMonthlyPrice } from "@/lib/site";
import { PaymentMethodsList } from "./PaymentMethodsList";

let stripePromise: Promise<Stripe | null> | null = null;

function getStripe(publishableKey: string) {
  if (!stripePromise) {
    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
}

export function EmbeddedStripeCheckout() {
  const [publishableKey, setPublishableKey] = useState<string | null>(null);
  const [configured, setConfigured] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/stripe/config")
      .then((r) => r.json())
      .then((data) => {
        setConfigured(data.configured);
        setPublishableKey(data.publishableKey);
      })
      .catch(() => setError("Could not load payment configuration."));
  }, []);

  const fetchClientSecret = useCallback(async () => {
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ embedded: true }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error ?? "Could not start checkout");
    }
    return data.clientSecret as string;
  }, []);

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  if (!configured) {
    return (
      <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        Payments are not configured on this server. Add Stripe API keys to enable checkout.
      </p>
    );
  }

  if (!publishableKey) {
    return <p className="text-sm text-[var(--color-ink-muted)]">Loading secure checkout…</p>;
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-[var(--color-ink-muted)]">
        Subscribe for {formatMonthlyPrice()}/month. Choose card, Apple Pay, Google Pay, or Link
        below.
      </p>
      <PaymentMethodsList compact />
      <div className="overflow-hidden rounded-2xl border border-black/[0.08] bg-white shadow-[var(--shadow-apple-sm)]">
        <EmbeddedCheckoutProvider
          stripe={getStripe(publishableKey)}
          options={{ fetchClientSecret }}
        >
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      </div>
      <p className="text-center text-[0.6875rem] leading-relaxed text-[var(--color-ink-muted)]">
        Payments are encrypted and processed by Stripe. We do not store full card numbers on our
        servers.
      </p>
    </div>
  );
}
