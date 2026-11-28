"use client";

import {
  googleAdsConversionParams,
  normalizeAdsEmail,
  type PurchaseConversion,
} from "@/lib/analytics/google-ads";

/**
 * Queue a conversion on the sitewide tag.
 * Consent stays denied for ordinary pageviews. It is updated only for this
 * hit, after the server has confirmed the trial or the paid subscription.
 * user_data email is a gtag set call. Google hashes it. It is not added to
 * the document URL.
 */
export function fireGoogleAdsConversion(input: {
  sendTo: string;
  email?: string | null;
  value?: number;
  currency?: "USD";
  transactionId?: string;
}): boolean {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return false;
  const email = normalizeAdsEmail(input.email);
  window.gtag("consent", "update", {
    ad_storage: "granted",
    ad_user_data: "granted",
    ad_personalization: "denied",
  });
  if (email) {
    window.gtag("set", "user_data", { email });
  }
  window.gtag("event", "conversion", googleAdsConversionParams(input));
  return true;
}

export function fireGoogleAdsPurchase(purchase: PurchaseConversion, email: string | null | undefined): boolean {
  return fireGoogleAdsConversion({
    sendTo: purchase.sendTo,
    value: purchase.value,
    currency: purchase.currency,
    transactionId: purchase.transactionId,
    email,
  });
}

/** Ask the server to claim the one-time trial conversion, then queue the tag. */
export async function requestGoogleAdsTrialConversion(email: string | null | undefined): Promise<void> {
  try {
    const response = await fetch("/api/ads/google-trial", { method: "POST" });
    if (!response.ok) return;
    const data = (await response.json()) as { fire?: boolean; sendTo?: string };
    if (!data.fire || !data.sendTo) return;
    fireGoogleAdsConversion({ sendTo: data.sendTo, email });
  } catch {
    /* Trial access does not depend on the ads tag. */
  }
}
