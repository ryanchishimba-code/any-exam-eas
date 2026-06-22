"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { getOrCreateAnalyticsSessionId } from "@/lib/analytics/client-session";

export function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const enteredAt = useRef<number>(Date.now());
  const lastPath = useRef<string>("");

  useEffect(() => {
    const path =
      pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");

    if (lastPath.current && lastPath.current !== path) {
      const durationSec = Math.round((Date.now() - enteredAt.current) / 1000);
      void fetch("/api/analytics/beacon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        keepalive: true,
        body: JSON.stringify({
          path: lastPath.current,
          durationSec,
          sessionId: getOrCreateAnalyticsSessionId(),
          referrer: document.referrer || undefined,
        }),
      });
      enteredAt.current = Date.now();
    }

    lastPath.current = path;

    void fetch("/api/analytics/beacon", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        path,
        sessionId: getOrCreateAnalyticsSessionId(),
        referrer: document.referrer || undefined,
      }),
    });
  }, [pathname, searchParams]);

  useEffect(() => {
    function onUnload() {
      if (!lastPath.current) return;
      const durationSec = Math.round((Date.now() - enteredAt.current) / 1000);
      const blob = new Blob(
        [
          JSON.stringify({
            path: lastPath.current,
            durationSec,
            sessionId: getOrCreateAnalyticsSessionId(),
          }),
        ],
        { type: "application/json" }
      );
      navigator.sendBeacon("/api/analytics/beacon", blob);
    }

    window.addEventListener("pagehide", onUnload);
    return () => window.removeEventListener("pagehide", onUnload);
  }, []);

  return null;
}
