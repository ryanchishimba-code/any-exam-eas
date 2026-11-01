import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PanceFeed } from "@/components/pance-feed/PanceFeed";
import { PanceFeedUpgrade } from "@/components/pance-feed/PanceFeedUpgrade";
import "@/components/pance-feed/pance-feed.css";
import { getCachedSession } from "@/lib/auth/session";
import { getUserAccess } from "@/lib/access-control";
import { redirectIfDbUnavailable } from "@/lib/page-access-error";
import { flashcardFeedLevel } from "@/lib/pance-feed/access";
import { type StudyFeedBoard } from "@/lib/study-feed/catalog";

export function studyFeedMetadata(board: StudyFeedBoard): Metadata {
  return {
    title: board.label,
    description: board.description,
    robots: { index: false, follow: false },
  };
}

/** Paid flashcard feed. Signed-out learners return here after sign-in. */
export async function StudyFeedPage({ board }: { board: StudyFeedBoard }) {
  const session = await getCachedSession();
  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=${encodeURIComponent(board.href)}`);
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
    redirect(`/dashboard?verify=1`);
  }
  if (flashcardFeedLevel(access) === "locked") {
    return <PanceFeedUpgrade board={board} />;
  }

  return <PanceFeed board={board} />;
}
