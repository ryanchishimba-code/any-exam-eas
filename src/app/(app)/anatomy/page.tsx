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
  title: "Anatomy Explorer — Any Exam Easy",
  description:
    "Interactive 3D anatomy with high-yield clinical pearls, memory cards, and board exam practice links.",
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
  searchParams: Promise<{ exam?: string; structure?: string }>;
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
    <div className="space-y-6">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-violet-600">
          Interactive Anatomy
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--color-ink)]">
          Anatomy Explorer
        </h1>
        <p className="mt-2 max-w-2xl text-[var(--color-ink-muted)]">
          Explore structures in 3D — rotate, zoom, and toggle layers. Click any structure for
          high-yield clinical facts, linked memory cards, and practice questions for your exam.
        </p>
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
