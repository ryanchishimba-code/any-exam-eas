import dynamic from "next/dynamic";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCachedSession } from "@/lib/auth/session";
import { PremiumGate } from "@/components/PremiumGate";
import { Skeleton } from "@/components/ui/skeleton";
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

const DrugReviewStudio = dynamic(
  () => import("@/components/study/DrugReviewStudio").then((m) => m.DrugReviewStudio),
  {
    loading: () => (
      <div className="mt-6 space-y-4">
        <Skeleton className="h-12 rounded-2xl" />
        <Skeleton className="h-32 rounded-2xl" />
        <Skeleton className="h-[420px] rounded-3xl" />
      </div>
    ),
  }
);

function DrugsPageSkeleton() {
  return (
    <div className={studyUi.page}>
      <Skeleton className="h-6 w-32" />
      <Skeleton className="mt-2 h-10 w-64" />
      <Skeleton className="mt-2 h-16 w-full max-w-2xl" />
      <Skeleton className="mt-6 h-[420px] w-full rounded-3xl" />
    </div>
  );
}

async function Drugs300PageInner() {
  const session = await getCachedSession();
  if (session?.user?.id) {
    await redirectMpjeFromClinicalRoutes(session.user.id);
  }

  await requirePremiumPage(ROUTES.drugs300);

  return (
    <PremiumGate callbackPath={ROUTES.drugs300}>
      <DrugReviewStudio />
    </PremiumGate>
  );
}

export default async function Drugs300Page() {
  return (
    <Suspense fallback={<DrugsPageSkeleton />}>
      <div className={studyUi.page}>
        <header>
          <p className={studyUi.eyebrow}>Study tools</p>
          <h1 className={studyUi.title}>Top 500 Drugs</h1>
          <p className={cn(studyUi.subtitle, "mt-1 max-w-2xl")}>
            High-yield deck with guideline-aligned pearls (ADA, ACC/AHA, FDA) for NCLEX, USMLE, and
            NAPLEX — plus searchable FDA reference for all approved ingredients.
          </p>
        </header>
        <Drugs300PageInner />
      </div>
    </Suspense>
  );
}
