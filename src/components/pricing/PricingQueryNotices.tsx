"use client";

import { useSearchParams } from "next/navigation";
import { PaywallNotice } from "@/components/PaywallNotice";
import { ProUpgradeBanner } from "@/components/pricing/ProUpgradeBanner";

/**
 * Reads paywall/upgrade query params on the client so /pricing can stay
 * statically cached (server searchParams force private, no-store responses).
 */
export function PricingQueryNotices() {
  const searchParams = useSearchParams();
  const paywall = searchParams.get("paywall");
  const upgrade = searchParams.get("upgrade");
  const feature = searchParams.get("feature");

  return (
    <>
      {paywall ? <PaywallNotice reason={paywall} /> : null}
      {upgrade === "pro" ? <ProUpgradeBanner feature={feature} /> : null}
    </>
  );
}
