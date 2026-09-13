import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCachedSession } from "@/lib/auth/session";
import { AnatomyExplorerClient } from "@/components/anatomy/AnatomyExplorerClient";
import { GuestTrialBanner } from "@/components/marketing/GuestTrialBanner";
import { Skeleton } from "@/components/ui/skeleton";
import { redirectMpjeFromClinicalRoutes } from "@/lib/edtech/exam-content-scope";
import { getUserExamPreference } from "@/lib/edtech/exam-preference";
import { loadMemoryCards } from "@/lib/library/memory-cards";
import { ROUTES } from "@/lib/routes";
import type { ExamSlug } from "@/types/edtech";

export const metadata = {
  title: "Anatomy Catalog — Any Exam Easy",
  description:
    "Browse anatomy structures, guided tours, and quizzes — pearls and practice without a body viewer.",
};

export const maxDuration = 60;

function AnatomySkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-28 w-full rounded-2xl" />
      <Skeleton className="h-[min(60vh,520px)] w-full rounded-2xl" />
    </div>
  );
}

async function AnatomyCatalogContent({
  userId,
  examOverride,
  initialStructureId,
  guestPreview,
}: {
  userId?: string;
  examOverride?: ExamSlug;
  initialStructureId?: string;
  guestPreview: boolean;
}) {
  const { examSlug, cards } = userId
    ? await loadMemoryCards(userId, examOverride)
    : { examSlug: examOverride ?? ("nclex" as ExamSlug), cards: [] };

  return (
    <>
      {guestPreview ? <GuestTrialBanner examSlug={examSlug} /> : null}
      <AnatomyExplorerClient
        examSlug={examSlug}
        memoryCards={cards}
        initialStructureId={initialStructureId}
        initialSurfaceId="none"
      />
    </>
  );
}

type PageProps = {
  searchParams: Promise<{ exam?: string; structure?: string }>;
};

export default async function AnatomyCatalogPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const examOverride = params.exam as ExamSlug | undefined;
  const initialStructureId = params.structure?.trim() || undefined;

  const session = await getCachedSession();
  const guestPreview = !session?.user?.id;

  if (session?.user?.id) {
    await redirectMpjeFromClinicalRoutes(session.user.id);
    if (!examOverride) {
      const pref = await getUserExamPreference(session.user.id);
      if (!pref) redirect(ROUTES.selectExam);
    }
  }

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-xl font-bold text-[var(--color-ink)]">Anatomy catalog</h1>
        <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
          Sidebar, tours, quiz, and pearls — switch to video or atlas view anytime.
        </p>
      </header>

      <Suspense fallback={<AnatomySkeleton />}>
        <AnatomyCatalogContent
          userId={session?.user?.id}
          examOverride={examOverride}
          initialStructureId={initialStructureId}
          guestPreview={guestPreview}
        />
      </Suspense>
    </div>
  );
}
