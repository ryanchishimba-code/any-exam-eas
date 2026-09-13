import dynamic from "next/dynamic";
import { getCachedSession } from "@/lib/auth/session";
import { GuestTrialBanner } from "@/components/marketing/GuestTrialBanner";
import { DrugReviewStudioSkeleton } from "@/components/study/DrugReviewStudioSkeleton";
import { redirectMpjeFromClinicalRoutes } from "@/lib/edtech/exam-content-scope";
import { DRUGS_DECK_MARKETING_TITLE } from "@/lib/marketing/bank-stats";
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

export default async function Drugs300Page() {
  const session = await getCachedSession();
  const guestPreview = !session?.user?.id;

  if (session?.user?.id) {
    await redirectMpjeFromClinicalRoutes(session.user.id);
  }

  return (
    <div className={studyUi.page}>
      <header>
        <p className={studyUi.eyebrow}>Study tools</p>
        <h1 className={studyUi.title}>{DRUGS_DECK_MARKETING_TITLE}</h1>
        <p className={cn(studyUi.subtitle, "mt-1 max-w-2xl")}>
          High-yield deck with guideline-aligned pearls (ADA, ACC/AHA, FDA) for NCLEX, USMLE, and
          NAPLEX — plus searchable FDA reference for all approved ingredients.
        </p>
      </header>
      {guestPreview ? <GuestTrialBanner className="mt-4" /> : null}
      <DrugReviewStudio guestPreview={guestPreview} />
    </div>
  );
}
