"use client";

import { useState } from "react";
import { Button } from "./ui/Button";

type ManageBillingButtonProps = {
  label?: string;
  variant?: "primary" | "secondary" | "ghost";
  /** `payment_method` opens Stripe portal directly to update the card/wallet for recurring billing. */
  intent?: "manage" | "payment_method";
};

export function ManageBillingButton({
  label = "Manage subscription",
  variant = "ghost",
  intent = "manage",
}: ManageBillingButtonProps) {
  const [loading, setLoading] = useState(false);

  async function openPortal() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intent }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert(data.error ?? "Billing portal unavailable");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button type="button" variant={variant} onClick={openPortal} disabled={loading}>
      {loading ? "Opening…" : label}
    </Button>
  );
}
