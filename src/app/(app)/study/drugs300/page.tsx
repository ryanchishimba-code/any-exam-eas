import dynamic from "next/dynamic";
import { getCachedSession } from "@/lib/auth/session";
import { GuestTrialBanner } from "@/components/marketing/GuestTrialBanner";
import { DrugReviewStudioSkeleton } from "@/components/study/DrugReviewStudioSkeleton";
import { redirectMpjeFromClinicalRoutes } from "@/lib/edtech/exam-content-scope";
import { DRUGS_DECK_MARKETING_TITLE } from "@/lib/marketing/bank-stats";
import { safetyPathLabel } from "@/lib/drugs300/safety-path";
import { studyUi } from "@/lib/study/study-ui";
import { cn } from "@/lib/utils";

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
          {safetyPath ? "Safety path" : DRUGS_DECK_MARKETING_TITLE}
        </h1>
        <p className={cn(studyUi.subtitle, "mt-2 max-w-2xl text-[15px] tracking-[-0.015em]")}>
          {safetyPath
            ? `${safetyPathLabel(safetyExam)}. These high-alert drugs stay in this order. Review each one today and the drugs row on Today’s block is complete.`
            : "High-yield deck with guideline-aligned pearls (ADA, ACC/AHA, FDA) for NCLEX, USMLE, and NAPLEX — plus searchable FDA reference for all approved ingredients."}
        </p>
      </header>
      {guestPreview ? <GuestTrialBanner className="mt-4" /> : null}
      <DrugReviewStudio guestPreview={guestPreview} />
    </div>
  );
}
