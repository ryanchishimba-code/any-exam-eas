"use client";

import { useState } from "react";
import { formatPlanUsd, getBillingPlanTier, renewalIntervalWord } from "@/lib/billing-plans";
import { paidRenewalConsentText } from "@/lib/marketing/legal-copy";
import { formatMonthlyPrice } from "@/lib/site";
import { Button } from "./ui/Button";
import { InlineError } from "@/components/ui/StatusMessage";

type Props = {
  label?: string;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  /** Use Stripe hosted page instead of on-site embedded checkout */
  hosted?: boolean;
  interval?: import("@/lib/billing-config").BillingInterval;
};

export function SubscribeButton({
  label = `Subscribe — from ${formatMonthlyPrice()}/mo`,
  variant = "primary",
  className = "",
  hosted = false,
  interval = "yearly",
}: Props) {
  if (hosted) {
    return (
      <HostedSubscribeButton
        label={label}
        variant={variant}
        className={className}
        interval={interval}
      />
    );
  }

  return (
    <div className={className}>
      <Button href={`/checkout?plan=subscribe&interval=${interval}`} variant={variant}>
        {label}
      </Button>
    </div>
  );
}

function HostedSubscribeButton({
  label,
  variant,
  className,
  interval,
}: {
  label: string;
  variant: Props["variant"];
  className: string;
  interval: import("@/lib/billing-config").BillingInterval;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [renewalConsent, setRenewalConsent] = useState(false);
  const consentPlan = getBillingPlanTier("pro", interval);
  const renewalConsentCopy = paidRenewalConsentText(
    formatPlanUsd(consentPlan.totalUsd),
    renewalIntervalWord(interval)
  );

  async function startCheckout() {
    if (!renewalConsent) {
      setError("Confirm the renewal terms before paying.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          embedded: false,
          plan: "subscribe",
          interval,
          renewalConsent: true,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      setError(data.error ?? "Could not start checkout. Sign in and try again.");
    } catch {
      setError("Could not reach checkout. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={className}>
      <label className="mb-3 flex items-start gap-2 text-left text-sm leading-snug text-[var(--color-ink)]">
        <input
          type="checkbox"
          className="mt-1"
          checked={renewalConsent}
          onChange={(event) => setRenewalConsent(event.target.checked)}
        />
        <span>{renewalConsentCopy}</span>
      </label>
      <Button
        type="button"
        variant={variant}
        className={loading ? "pointer-events-none opacity-70" : ""}
        disabled={!renewalConsent || loading}
        onClick={startCheckout}
      >
        {loading ? "Redirecting…" : label}
      </Button>
      {error && <InlineError className="mt-2">{error}</InlineError>}
    </div>
  );
}
