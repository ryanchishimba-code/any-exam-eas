"use client";

import { useEffect } from "react";

/** Fire-and-forget view increment — deferred so it never blocks first paint. */
export function BlogViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    const run = () => {
      void fetch(`/api/blog/${encodeURIComponent(slug)}/view`, {
        method: "POST",
        keepalive: true,
      }).catch(() => undefined);
    };

    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      const id = window.requestIdleCallback(run, { timeout: 2500 });
      return () => window.cancelIdleCallback(id);
    }

    const t = window.setTimeout(run, 800);
    return () => window.clearTimeout(t);
  }, [slug]);

  return null;
}
