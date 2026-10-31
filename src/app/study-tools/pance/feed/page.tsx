import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PanceFeed } from "@/components/pance-feed/PanceFeed";
import "@/components/pance-feed/pance-feed.css";
import { PanceFeedUpgrade } from "@/components/pance-feed/PanceFeedUpgrade";
import { getCachedSession } from "@/lib/auth/session";
import { getUserAccess } from "@/lib/access-control";
import { redirectIfDbUnavailable } from "@/lib/page-access-error";
import { canUsePanceFeed } from "@/lib/pance-feed/access";
import { ROUTES } from "@/lib/routes";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "PANCE Feed",
  description: "Full-screen PANCE flashcard feed for paid plans.",
  robots: { index: false, follow: false },
};

export default async function PanceFeedPage() {
  const callback = ROUTES.panceFeed;
  const session = await getCachedSession();
  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=${encodeURIComponent(callback)}`);
  }

  let access;
  try {
    const { ensureNeonReady } = await import("@/lib/neon-warmup");
    await ensureNeonReady("access", { budgetMs: 3_000 });
    access = await getUserAccess(session.user.id);
  } catch (error) {
    redirectIfDbUnavailable(error);
  }

  if (access.blockReason === "suspended" || access.blockReason === "deleted") {
    redirect("/pricing?paywall=suspended");
  }
  if (access.blockReason === "email_unverified") {
    redirect(`${ROUTES.dashboard}?verify=1`);
  }
  if (!canUsePanceFeed(access)) {
    return <PanceFeedUpgrade />;
  }

  return <PanceFeed />;
}
