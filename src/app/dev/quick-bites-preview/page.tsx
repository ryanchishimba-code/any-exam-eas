import { notFound } from "next/navigation";
import { VideoQuickBitesSection } from "@/components/quick-bites/VideoQuickBitesSection";
import { postTrialCheckoutHref, trialUpgradeCheckoutHref } from "@/lib/dashboard/upgrade-banner";
import { ROUTES } from "@/lib/routes";

export const metadata = {
  title: "Video Quick Bites preview",
  robots: { index: false, follow: false },
};

/** Local fixture for Video Quick Bites screenshots. Not available in production. */
export default async function QuickBitesPreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ access?: string }>;
}) {
  if (process.env.NODE_ENV === "production" && process.env.ALLOW_TOUR_PREVIEW !== "1") {
    notFound();
  }

  const access = (await searchParams).access === "free" ? "free" : "premium";
  const locked = access === "free";

  return (
    <main id="main-content" className="dashboard-ui mx-auto min-h-screen w-full max-w-5xl px-4 py-6 sm:px-6">
      <p className="mb-4 text-[13px] font-semibold text-[var(--color-ink-muted)]">NCLEX dashboard</p>
      <VideoQuickBitesSection
        canPlay={!locked}
        upgradeHref={
          locked ? postTrialCheckoutHref(ROUTES.dashboard) : trialUpgradeCheckoutHref(ROUTES.dashboard)
        }
        upgradeLabel={locked ? "Subscribe to watch" : "Upgrade to watch"}
      />
    </main>
  );
}
