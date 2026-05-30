"use client";

import { useState } from "react";
import { formatMonthlyPrice } from "@/lib/site";
import { Button } from "./ui/Button";

type Props = {
  label?: string;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  /** Use Stripe hosted page instead of on-site embedded checkout */
  hosted?: boolean;
};

export function SubscribeButton({
  label = `Subscribe — ${formatMonthlyPrice()}/month`,
  variant = "primary",
  className = "",
  hosted = false,
}: Props) {
  if (hosted) {
    return <HostedSubscribeButton label={label} variant={variant} className={className} />;
  }

  return (
    <div className={className}>
      <Button href="/checkout" variant={variant}>
        {label}
      </Button>
    </div>
  );
}

function HostedSubscribeButton({
  label,
  variant,
  className,
}: {
  label: string;
  variant: Props["variant"];
  className: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function startCheckout() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ embedded: false, plan: "subscribe" }),
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
      <Button
        type="button"
        variant={variant}
        className={loading ? "pointer-events-none opacity-70" : ""}
        onClick={startCheckout}
      >
        {loading ? "Redirecting…" : label}
      </Button>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
