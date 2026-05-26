"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const BEACON_KEY = "aee_analytics_sid";

function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";
  try {
    let sid = sessionStorage.getItem(BEACON_KEY);
    if (!sid) {
      sid = crypto.randomUUID();
      sessionStorage.setItem(BEACON_KEY, sid);
    }
    return sid;
  } catch {
    return "";
  }
}

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
          sessionId: getOrCreateSessionId(),
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
        sessionId: getOrCreateSessionId(),
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
            sessionId: getOrCreateSessionId(),
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
