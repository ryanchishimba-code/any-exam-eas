"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { formatTrialCtaLabel } from "@/lib/site";
import { dbUi } from "@/lib/study/dashboard-ui";
import { cn } from "@/lib/utils";

/** Visible confirmation when Try for free lands a signed-in member on Study Hub. */
export function DashboardTryForFreeBanner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (searchParams.get("from") !== "try-for-free") return;
    setVisible(true);
    const next = new URLSearchParams(searchParams.toString());
    next.delete("from");
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [pathname, router, searchParams]);

  if (!visible) return null;

  return (
    <div
      role="status"
      className={cn(
        dbUi.surface,
        "border border-teal-500/30 bg-teal-50/70 px-4 py-3 text-sm text-[var(--color-ink)] dark:bg-teal-950/30"
      )}
    >
      <p className="font-semibold">{formatTrialCtaLabel()} — you&apos;re in.</p>
      <p className="mt-0.5 text-[var(--color-ink-muted)]">
        Your account is active. Keep practicing from Study Hub below.
      </p>
    </div>
  );
}
