import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCachedSession } from "@/lib/auth/session";
import { AnatomyExplorerClient } from "@/components/anatomy/AnatomyExplorerClient";
import { Skeleton } from "@/components/ui/skeleton";
import { redirectMpjeFromClinicalRoutes } from "@/lib/edtech/exam-content-scope";
import { getUserExamPreference } from "@/lib/edtech/exam-preference";
import { loadMemoryCards } from "@/lib/library/memory-cards";
import { requirePremiumPage } from "@/lib/require-premium-page";
import { ROUTES } from "@/lib/routes";
import type { ExamSlug } from "@/types/edtech";

export const metadata = {
  title: "Anatomy Catalog — Any Exam Easy",
  description:
    "Browse anatomy structures, guided tours, and quizzes — pearls and practice without a body viewer.",
};

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
}: {
  userId: string;
  examOverride?: ExamSlug;
  initialStructureId?: string;
}) {
  if (!examOverride) {
    const pref = await getUserExamPreference(userId);
    if (!pref) redirect(ROUTES.selectExam);
  }

  const { examSlug, cards } = await loadMemoryCards(userId, examOverride);

  return (
    <AnatomyExplorerClient
      examSlug={examSlug}
      memoryCards={cards}
      initialStructureId={initialStructureId}
      initialSurfaceId="none"
    />
  );
}

async function AnatomyCatalogPageInner({
  examOverride,
  initialStructureId,
}: {
  examOverride?: ExamSlug;
  initialStructureId?: string;
}) {
  const session = await getCachedSession();
  if (!session?.user?.id) {
    redirect(`${ROUTES.auth.login}?callbackUrl=${encodeURIComponent(ROUTES.anatomyCatalog)}`);
  }

  await redirectMpjeFromClinicalRoutes(session.user.id);
  await requirePremiumPage(ROUTES.anatomy);

  return (
    <AnatomyCatalogContent
      userId={session.user.id}
      examOverride={examOverride}
      initialStructureId={initialStructureId}
    />
  );
}

type PageProps = {
  searchParams: Promise<{ exam?: string; structure?: string }>;
};

export default async function AnatomyCatalogPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const examOverride = params.exam as ExamSlug | undefined;
  const initialStructureId = params.structure?.trim() || undefined;

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-xl font-bold text-[var(--color-ink)]">Anatomy catalog</h1>
        <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
          Sidebar, tours, quiz, and pearls — switch to video or atlas view anytime.
        </p>
      </header>

      <Suspense fallback={<AnatomySkeleton />}>
        <AnatomyCatalogPageInner
          examOverride={examOverride}
          initialStructureId={initialStructureId}
        />
      </Suspense>
    </div>
  );
}
