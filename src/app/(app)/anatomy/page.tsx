import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AnatomyExplorerClient } from "@/components/anatomy/AnatomyExplorerClient";
import { Skeleton } from "@/components/ui/skeleton";
import { redirectMpjeFromClinicalRoutes } from "@/lib/edtech/exam-content-scope";
import { getPrimaryStructureIdForProcedure } from "@/lib/anatomy/procedure-recommendations";
import { getAnatomyStructure } from "@/lib/anatomy";
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
  initialProcedureId,
}: {
  userId: string;
  examOverride?: ExamSlug;
  initialStructureId?: string;
  initialProcedureId?: string;
}) {
  const pref = await getUserExamPreference(userId);
  if (!pref && !examOverride) redirect(ROUTES.selectExam);

  const { examSlug, cards } = await loadMemoryCards(userId, examOverride ?? pref?.examSlug);

  return (
    <AnatomyExplorerClient
      examSlug={examSlug}
      memoryCards={cards}
      initialStructureId={initialStructureId}
      initialProcedureId={initialProcedureId}
    />
  );
}

type PageProps = {
  searchParams: Promise<{ exam?: string; structure?: string; procedure?: string; surface?: string }>;
};

export default async function AnatomyPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const examOverride = params.exam as ExamSlug | undefined;
  const initialProcedureId = params.procedure?.trim() || undefined;
  const structureFromProcedure = initialProcedureId
    ? getPrimaryStructureIdForProcedure(initialProcedureId)
    : undefined;
  const structureParam = params.structure?.trim();
  const initialStructureId =
    structureParam && getAnatomyStructure(structureParam)
      ? structureParam
      : structureFromProcedure && getAnatomyStructure(structureFromProcedure)
        ? structureFromProcedure
        : undefined;

  const callbackQuery = new URLSearchParams();
  if (examOverride) callbackQuery.set("exam", examOverride);
  if (structureParam) callbackQuery.set("structure", structureParam);
  else if (initialProcedureId) callbackQuery.set("procedure", initialProcedureId);
  const callbackPath = callbackQuery.toString()
    ? `${ROUTES.anatomy}?${callbackQuery.toString()}`
    : ROUTES.anatomy;

  const session = await auth();
  if (!session?.user?.id) {
    redirect(`${ROUTES.auth.login}?callbackUrl=${encodeURIComponent(callbackPath)}`);
  }

  await redirectMpjeFromClinicalRoutes(session.user.id);
  await requirePremiumPage(ROUTES.anatomy);
  return (
    <div className="mx-auto max-w-[1440px] space-y-4 pb-6">
      <header className="sr-only">
        <h1>Anatomy Explorer</h1>
      </header>

      <Suspense fallback={<AnatomySkeleton />}>
        <AnatomyContent
          userId={session.user.id}
          examOverride={examOverride}
          initialStructureId={initialStructureId}
          initialProcedureId={initialProcedureId}
        />
      </Suspense>
    </div>
  );
}
