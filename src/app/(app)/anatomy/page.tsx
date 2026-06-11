import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AnatomyExplorerClient } from "@/components/anatomy/AnatomyExplorerClient";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserExamPreference } from "@/lib/edtech/exam-preference";
import { loadMemoryCards } from "@/lib/reference/memory-cards";
import { requirePremiumPage } from "@/lib/require-premium-page";
import { ROUTES } from "@/lib/routes";
import type { ExamSlug } from "@/types/edtech";
export const metadata = {
  title: "3D Anatomy Model — Any Exam Easy",
  description:
    "Orbit a stylized 3D body, explore organs, and jump into pearls, tours, and board-style practice.",
};

function AnatomySkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-28 w-full rounded-2xl" />
      <Skeleton className="h-[min(72vh,640px)] w-full rounded-2xl" />
    </div>
  );
}

async function AnatomyContent({
  userId,
  examOverride,
  initialStructureId,
}: {
  userId: string;
  examOverride?: ExamSlug;
  initialStructureId?: string;
}) {
  const pref = await getUserExamPreference(userId);
  if (!pref && !examOverride) redirect(ROUTES.selectExam);

  const { examSlug, cards } = await loadMemoryCards(userId, examOverride ?? pref?.examSlug);

  return (
    <AnatomyExplorerClient
      examSlug={examSlug}
      memoryCards={cards}
      initialStructureId={initialStructureId}
    />
  );
}

type PageProps = {
  searchParams: Promise<{ exam?: string; structure?: string; surface?: string }>;
};

export default async function AnatomyPage({ searchParams }: PageProps) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect(`${ROUTES.auth.login}?callbackUrl=${encodeURIComponent(ROUTES.anatomy)}`);
  }

  await requirePremiumPage(ROUTES.anatomy);

  const params = await searchParams;
  const examOverride = params.exam as ExamSlug | undefined;
  const initialStructureId = params.structure?.trim() || undefined;
  return (
    <div className="space-y-4">
      <header className="sr-only">
        <h1>Anatomy Explorer</h1>
      </header>

      <Suspense fallback={<AnatomySkeleton />}>
        <AnatomyContent
          userId={session.user.id}
          examOverride={examOverride}
          initialStructureId={initialStructureId}
        />
      </Suspense>
    </div>
  );
}
