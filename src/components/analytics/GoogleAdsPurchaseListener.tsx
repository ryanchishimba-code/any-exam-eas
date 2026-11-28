"use client";

import { useSession } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { fireGoogleAdsPurchase } from "@/lib/analytics/google-ads-client";
import {
  GOOGLE_ADS_CHECKOUT_SESSION_PARAM,
  GOOGLE_ADS_SUBSCRIPTION_PARAM,
  isStripeCheckoutSessionId,
  isStripeSubscriptionId,
  type PurchaseConversion,
} from "@/lib/analytics/google-ads";

/**
 * After Stripe returns the shopper to the dashboard, ask the server whether
 * this checkout is a paid subscription. The browser fires the Ads conversion
 * only when that check succeeds, and the server records the transaction id
 * so a refresh does not send it again.
 */
export function GoogleAdsPurchaseListener() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const started = useRef(false);

  useEffect(() => {
    if (status !== "authenticated" || started.current) return;
    if (params.get("checkout") !== "success") return;
    if (params.get("welcome") === "trial") return;
    const sessionId = params.get(GOOGLE_ADS_CHECKOUT_SESSION_PARAM);
    const subscriptionId = params.get(GOOGLE_ADS_SUBSCRIPTION_PARAM);
    if (!isStripeCheckoutSessionId(sessionId) && !isStripeSubscriptionId(subscriptionId)) return;

    started.current = true;
    const email = session?.user?.email ?? null;

    void (async () => {
      try {
        const response = await fetch("/api/ads/google-purchase", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: isStripeCheckoutSessionId(sessionId) ? sessionId : undefined,
            subscriptionId: isStripeSubscriptionId(subscriptionId) ? subscriptionId : undefined,
          }),
        });
        const data = (await response.json()) as { purchase?: PurchaseConversion | null };
        if (data.purchase) fireGoogleAdsPurchase(data.purchase, email);
      } catch {
        /* The subscription is already active. A missed pixel can be retried by support, not by looping. */
      } finally {
        const next = new URLSearchParams(params.toString());
        next.delete(GOOGLE_ADS_CHECKOUT_SESSION_PARAM);
        next.delete(GOOGLE_ADS_SUBSCRIPTION_PARAM);
        const query = next.toString();
        router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
      }
    })();
  }, [params, pathname, router, session?.user?.email, status]);

  return null;
}
