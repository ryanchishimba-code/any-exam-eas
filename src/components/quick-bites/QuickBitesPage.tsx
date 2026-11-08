import { redirect } from "next/navigation";
import { AccessBlockedNotice } from "@/components/AccessBlockedNotice";
import { VideoQuickBitesSection } from "@/components/quick-bites/VideoQuickBitesSection";
import { getCachedSession } from "@/lib/auth/session";
import {
  postTrialCheckoutHref,
  trialUpgradeCheckoutHref,
} from "@/lib/dashboard/upgrade-banner";
import { canPlayQuickBites } from "@/lib/quick-bites/access";
import { QUICK_BITE_BOARDS, type QuickBiteExam } from "@/lib/quick-bites/boards";
import { runPageDb } from "@/lib/page-access-error";
import { requireAppPage } from "@/lib/require-premium-page";
import { ROUTES } from "@/lib/routes";

/**
 * Standalone Quick Bites library. Trial and post-trial members still see
 * posters; playback of every episode except the board's fixed free sample
 * stays on the paid check inside the section.
 */
export async function QuickBitesPage({ exam }: { exam: QuickBiteExam }) {
  const board = QUICK_BITE_BOARDS[exam];
  const session = await getCachedSession();
  if (!session?.user?.id) {
    redirect(`${ROUTES.auth.login}?callbackUrl=${encodeURIComponent(board.route)}`);
  }

  const access = await runPageDb(() => requireAppPage(board.route));
  if (access.blockReason === "email_unverified") {
    return <AccessBlockedNotice reason="email_unverified" email={session.user.email} />;
  }

  const upgradeHref =
    access.role === "free"
      ? postTrialCheckoutHref(board.route)
      : trialUpgradeCheckoutHref(board.route);

  return (
    <div className="dashboard-ui mx-auto w-full min-w-0 max-w-5xl">
      <VideoQuickBitesSection
        series={board.series}
        titleAs="h1"
        canPlay={canPlayQuickBites(access)}
        upgradeHref={upgradeHref}
        upgradeLabel={access.role === "free" ? "Subscribe to watch" : "Upgrade to watch"}
      />
    </div>
  );
}
