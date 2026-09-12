import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCachedSession } from "@/lib/auth/session";
import { AnatomyExplorerClient } from "@/components/anatomy/AnatomyExplorerClient";
import { CtAtlasHeadHints } from "@/components/anatomy/ct/CtAtlasHeadHints";
import { GuestTrialBanner } from "@/components/marketing/GuestTrialBanner";
import { Skeleton } from "@/components/ui/skeleton";
import { redirectMpjeFromClinicalRoutes } from "@/lib/edtech/exam-content-scope";
import { getPrimaryStructureIdForProcedure } from "@/lib/anatomy/procedure-recommendations";
import { getAnatomyStructure } from "@/lib/anatomy";
import { getUserExamPreference } from "@/lib/edtech/exam-preference";
import { loadMemoryCards } from "@/lib/library/memory-cards";
import { ROUTES } from "@/lib/routes";
import type { ExamSlug } from "@/types/edtech";

export const metadata = {
  title: "3D Anatomy Model — Any Exam Easy",
  description:
    "Orbit a stylized 3D body, explore organs, and jump into pearls, tours, and board-style practice.",
};

export const maxDuration = 60;

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
  guestPreview,
}: {
  userId?: string;
  examOverride?: ExamSlug;
  initialStructureId?: string;
  initialProcedureId?: string;
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
        initialProcedureId={initialProcedureId}
      />
    </>
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
    <div className="w-full space-y-4">
      <CtAtlasHeadHints />
      <header className="sr-only">
        <h1>Anatomy Explorer</h1>
      </header>

      <Suspense fallback={<AnatomySkeleton />}>
        <AnatomyContent
          userId={session?.user?.id}
          examOverride={examOverride}
          initialStructureId={initialStructureId}
          initialProcedureId={initialProcedureId}
          guestPreview={guestPreview}
        />
      </Suspense>
    </div>
  );
}
