"use client";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Defers Vercel Analytics and Speed Insights on the marketing homepage so the
 * first HTML carries fewer third-party scripts. Other routes load immediately.
 */
export function DeferredPlatformScripts() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [ready, setReady] = useState(!isHome);

  useEffect(() => {
    if (!isHome) return;
    const enable = () => setReady(true);
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(enable, { timeout: 4000 });
      return () => window.cancelIdleCallback(id);
    }
    const timer = window.setTimeout(enable, 2500);
    return () => window.clearTimeout(timer);
  }, [isHome]);

  if (!ready) return null;

  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
