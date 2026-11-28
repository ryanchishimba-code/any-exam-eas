"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { flushPendingAdsConversions } from "@/lib/analytics/google-ads-browser";

function libraryLoaded(): boolean {
  if (typeof window === "undefined") return false;
  const flag = (window as Window & { google_tag_manager?: object }).google_tag_manager;
  return typeof flag === "object" && flag !== null;
}

/**
 * Sends sign_up or purchase once, after the page that follows account creation
 * or an in-app charge. The cookies are set only when the server confirmed the
 * new account or the paid invoice. Hits wait until gtag.js is loaded so a
 * following navigation cannot drop a dataLayer queue.
 */
export function AdsConversionFlush() {
  const { data, status } = useSession();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (libraryLoaded()) {
      setReady(true);
      return;
    }
    const timer = window.setInterval(() => {
      if (!libraryLoaded()) return;
      window.clearInterval(timer);
      setReady(true);
    }, 200);
    const stop = window.setTimeout(() => window.clearInterval(timer), 8000);
    return () => {
      window.clearInterval(timer);
      window.clearTimeout(stop);
    };
  }, []);

  useEffect(() => {
    if (status === "loading" || !ready) return;
    void flushPendingAdsConversions(data?.user?.email ?? null);
  }, [data?.user?.email, ready, status]);

  return null;
}
