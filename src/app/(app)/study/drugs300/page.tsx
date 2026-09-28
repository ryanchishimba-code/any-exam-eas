import dynamic from "next/dynamic";
import { getCachedSession } from "@/lib/auth/session";
import { GuestTrialBanner } from "@/components/marketing/GuestTrialBanner";
import { DrugReviewStudioSkeleton } from "@/components/study/DrugReviewStudioSkeleton";
import { redirectMpjeFromClinicalRoutes } from "@/lib/edtech/exam-content-scope";
import { DRUGS_DECK_MARKETING_TITLE } from "@/lib/marketing/bank-stats";
import { safetyPathLabel } from "@/lib/drugs300/safety-path";
import { studyUi } from "@/lib/study/study-ui";

export const metadata = {
  title: `${DRUGS_DECK_MARKETING_TITLE} — Any Exam Easy`,
  description:
    "One shared Top 500 drug list for NCLEX, USMLE, and NAPLEX — flashcards with spaced repetition.",
};

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
