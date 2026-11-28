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

import { JsonLdScript } from "@/components/seo/JsonLdScript";
import { buildLearningResourceJsonLd } from "@/lib/seo/learning-resource-jsonld";
import {
  ANATOMY_PAGE_DESCRIPTION,
  ANATOMY_PAGE_TITLE,
  anatomyPageMetadata,
} from "@/lib/seo/public-tool-metadata";

export const metadata = anatomyPageMetadata();

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
      <JsonLdScript
        data={buildLearningResourceJsonLd({
          name: ANATOMY_PAGE_TITLE,
          description: ANATOMY_PAGE_DESCRIPTION,
          path: "/anatomy",
          learningResourceType: "Interactive model",
        })}
      />
      <header className="sr-only">
        <h1>3D Anatomy Explorer</h1>
        <p>{ANATOMY_PAGE_DESCRIPTION}</p>
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
