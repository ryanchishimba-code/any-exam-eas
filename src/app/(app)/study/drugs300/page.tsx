import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import { getCachedSession } from "@/lib/auth/session";
import { DrugReviewStudioSkeleton } from "@/components/study/DrugReviewStudioSkeleton";
import { redirectMpjeFromClinicalRoutes } from "@/lib/edtech/exam-content-scope";
import { requirePremiumPage } from "@/lib/require-premium-page";
import { studyUi } from "@/lib/study/study-ui";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Top 500 Drugs — Any Exam Easy",
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
  if (!session?.user?.id) {
    redirect(`${ROUTES.auth.login}?callbackUrl=${encodeURIComponent(ROUTES.drugs300)}`);
  }

  await redirectMpjeFromClinicalRoutes(session.user.id);
  await requirePremiumPage(ROUTES.drugs300);

  return (
    <div className={studyUi.page}>
      <header>
        <p className={studyUi.eyebrow}>Study tools</p>
        <h1 className={studyUi.title}>Top 500 Drugs</h1>
        <p className={cn(studyUi.subtitle, "mt-1 max-w-2xl")}>
          High-yield deck with guideline-aligned pearls (ADA, ACC/AHA, FDA) for NCLEX, USMLE, and
          NAPLEX — plus searchable FDA reference for all approved ingredients.
        </p>
      </header>
      <DrugReviewStudio />
    </div>
  );
}
