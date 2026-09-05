"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const ShareFab = dynamic(() => import("./ShareFab").then((m) => m.ShareFab), {
  ssr: false,
});

/**
 * Defer Share FAB until the browser is idle so it never competes with LCP/hydration.
 * Hidden entirely on marketing routes inside ShareFab itself.
 */
export function ShareFabLazy() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const enable = () => {
      if (!cancelled) setReady(true);
    };

    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      const id = window.requestIdleCallback(enable, { timeout: 2500 });
      return () => {
        cancelled = true;
        window.cancelIdleCallback(id);
      };
    }

    const t = window.setTimeout(enable, 1200);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, []);

  if (!ready) return null;
  return <ShareFab />;
}
