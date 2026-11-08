"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { quickBiteRouteForLegacyHash } from "@/lib/quick-bites/boards";

/** Sends bookmarked dashboard anchors to the standalone Quick Bites page. */
export function QuickBitesDashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    const route = quickBiteRouteForLegacyHash(window.location.hash);
    if (route) router.replace(route);
  }, [router]);

  return null;
}
