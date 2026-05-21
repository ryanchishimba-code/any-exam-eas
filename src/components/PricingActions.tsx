"use client";

import { useState } from "react";
import { Button } from "./ui/Button";

export function PricingActions() {
  const [loading, setLoading] = useState(false);

  async function startCheckout() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert(data.error ?? "Sign in first to subscribe");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <Button href="/signup">Start free trial</Button>
      <button
        type="button"
        onClick={startCheckout}
        disabled={loading}
        className="text-sm text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
      >
        {loading ? "Loading…" : "Already have an account? Subscribe"}
      </button>
    </div>
  );
}
