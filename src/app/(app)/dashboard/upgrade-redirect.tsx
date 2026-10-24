"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ROUTES } from "@/lib/routes";

/** Legacy `?upgrade=1` on dashboard → dedicated upgrade screen. */
export function DashboardUpgradeRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("upgrade") !== "1") return;
    const returnPath = searchParams.get("return");
    const params = new URLSearchParams();
    if (returnPath?.startsWith("/")) params.set("return", returnPath);
    const reason = searchParams.get("reason");
    if (reason) params.set("reason", reason);
    const target = params.toString() ? `${ROUTES.upgrade}?${params}` : ROUTES.upgrade;
    router.replace(target);
  }, [router, searchParams]);

  return null;
}
