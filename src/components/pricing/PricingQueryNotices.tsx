"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PaywallNotice } from "@/components/PaywallNotice";
import { ProUpgradeBanner } from "@/components/pricing/ProUpgradeBanner";
import { boardFromSearchParams, hrefWithBoard } from "@/lib/auth/board-intent";

/**
 * Reads paywall/upgrade query params on the client so /pricing can stay
 * statically cached (server searchParams force private, no-store responses).
 * Email-verify paywall is redirected away — pricing should never be the verify screen.
 */
export function PricingQueryNotices() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paywall = searchParams.get("paywall");
  const upgrade = searchParams.get("upgrade");
  const feature = searchParams.get("feature");

  useEffect(() => {
    if (paywall === "verify") {
      router.replace("/dashboard?verify=1");
    }
  }, [paywall, router]);

  useEffect(() => {
    const board = boardFromSearchParams(searchParams);
    if (!board) return;
    const root = document.querySelector(".aee-pricing");
    if (!root) return;
    root.querySelectorAll("a[href]").forEach((node) => {
      const href = node.getAttribute("href");
      if (!href || (!href.startsWith("/signup") && !href.startsWith("/login"))) return;
      node.setAttribute("href", hrefWithBoard(href, board));
    });
  }, [searchParams]);

  if (paywall === "verify") {
    return null;
  }

  return (
    <>
      {paywall ? <PaywallNotice reason={paywall} /> : null}
      {upgrade === "pro" ? <ProUpgradeBanner feature={feature} /> : null}
    </>
  );
}
