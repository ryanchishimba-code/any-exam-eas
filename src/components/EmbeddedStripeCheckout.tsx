"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import { formatMonthlyPrice, formatTrialIntroPrice, formatTrialLabel } from "@/lib/site";
import { PaymentMethodsList } from "./PaymentMethodsList";
import { InlineError, StatusMessage } from "@/components/ui/StatusMessage";

let stripePromise: Promise<Stripe | null> | null = null;

function getStripe(publishableKey: string) {
  if (!stripePromise) {
    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
}

export function EmbeddedStripeCheckout() {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") === "trial" ? "trial" : "subscribe";

  const [publishableKey, setPublishableKey] = useState<string | null>(null);
  const [configured, setConfigured] = useState(true);
  const [missingKeys, setMissingKeys] = useState<string[]>([]);
  const [error, setError] = useState("");

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

  const fetchClientSecret = useCallback(async () => {
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ embedded: true, plan }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error ?? "Could not start checkout");
    }
    return data.clientSecret as string;
  }, [plan]);

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
            {missingKeys.join(", ")}. Get keys from{" "}
            <a
              href="https://dashboard.stripe.com/test/apikeys"
              className="font-medium underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Stripe Dashboard
            </a>
            , then restart the dev server.
          </span>
        )}
      </StatusMessage>
    );
  }

  if (!publishableKey) {
    return <p className="text-sm text-[var(--color-ink-muted)]">Loading secure checkout…</p>;
  }

  const headline =
    plan === "trial"
      ? `${formatTrialIntroPrice()} intro · ${formatTrialLabel()} · then ${formatMonthlyPrice()}/mo`
      : `${formatMonthlyPrice()}/month · full access immediately`;

  return (
    <div className="space-y-6">
      <p className="text-sm text-[var(--color-ink-muted)]">{headline}</p>
      <PaymentMethodsList compact />
      <div className="overflow-hidden rounded-2xl border border-black/[0.08] bg-white shadow-[var(--shadow-apple-sm)] dark:border-white/10">
        <EmbeddedCheckoutProvider
          stripe={getStripe(publishableKey)}
          options={{ fetchClientSecret }}
        >
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      </div>
      <p className="text-center text-[0.6875rem] leading-relaxed text-[var(--color-ink-muted)]">
        Payments are encrypted and processed by Stripe. Cancel anytime from your dashboard.
      </p>
    </div>
  );
}
