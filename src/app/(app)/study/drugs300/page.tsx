import dynamic from "next/dynamic";
import { getCachedSession } from "@/lib/auth/session";
import { GuestTrialBanner } from "@/components/marketing/GuestTrialBanner";
import { DrugReviewStudioSkeleton } from "@/components/study/DrugReviewStudioSkeleton";
import { redirectMpjeFromClinicalRoutes } from "@/lib/edtech/exam-content-scope";
import { DRUGS_DECK_MARKETING_TITLE } from "@/lib/marketing/bank-stats";
import { safetyPathLabel } from "@/lib/drugs300/safety-path";
import { studyUi } from "@/lib/study/study-ui";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import { buildLearningResourceJsonLd } from "@/lib/seo/learning-resource-jsonld";
import {
  DRUGS_PAGE_DESCRIPTION,
  DRUGS_PAGE_TITLE,
  drugsPageMetadata,
} from "@/lib/seo/public-tool-metadata";

export const metadata = drugsPageMetadata();

export const maxDuration = 60;

const DrugReviewStudio = dynamic(
  () => import("@/components/study/DrugReviewStudio").then((m) => m.DrugReviewStudio),
  {
    loading: () => <DrugReviewStudioSkeleton />,
  }
);

export default async function Drugs300Page({
  searchParams,
}: {
  searchParams: Promise<{ path?: string; exam?: string }>;
}) {
  const params = await searchParams;
  const safetyPath = params.path === "safety";
  const safetyExam = params.exam ?? "nclex";
  const session = await getCachedSession();
  const guestPreview = !session?.user?.id;

  if (session?.user?.id) {
    await redirectMpjeFromClinicalRoutes(session.user.id);
  }

  return (
    <div className={studyUi.page}>
      <JsonLdScript
        data={buildLearningResourceJsonLd({
          name: DRUGS_PAGE_TITLE,
          description: DRUGS_PAGE_DESCRIPTION,
          path: "/study/drugs300",
          learningResourceType: "Flashcards",
        })}
      />
      <header>
        <p className={studyUi.eyebrow}>{safetyPath ? "Today’s block" : "Study tools"}</p>
        <h1 className={studyUi.title}>
          {safetyPath ? safetyPathLabel(safetyExam) : DRUGS_DECK_MARKETING_TITLE}
        </h1>
      </header>
      {guestPreview ? <GuestTrialBanner className="mt-4" /> : null}
      <DrugReviewStudio guestPreview={guestPreview} />
    </div>
  );
}
