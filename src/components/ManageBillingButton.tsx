"use client";

import { useState } from "react";
import { Button } from "./ui/Button";

export function ManageBillingButton() {
  const [loading, setLoading] = useState(false);

  async function openPortal() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert(data.error ?? "Billing portal unavailable");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button type="button" variant="ghost" onClick={openPortal} disabled={loading}>
      {loading ? "Opening…" : "Manage billing"}
    </Button>
  );
}
