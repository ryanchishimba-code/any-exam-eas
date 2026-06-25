import dynamic from "next/dynamic";
import { Suspense } from "react";
import { auth } from "@/auth";
import { PremiumGate } from "@/components/PremiumGate";
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
        <div className="aee-drugs-skeleton h-12 rounded-2xl" />
        <div className="aee-drugs-skeleton h-32 rounded-2xl" />
        <div className="aee-drugs-skeleton h-[420px] rounded-3xl" />
      </div>
    ),
  }
);

export default async function Drugs300Page() {
  const session = await auth();
  if (session?.user?.id) {
    await redirectMpjeFromClinicalRoutes(session.user.id);
  }

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

      <PremiumGate callbackPath={ROUTES.drugs300}>
        <Suspense fallback={<p className="text-sm text-[var(--color-ink-muted)]">Loading…</p>}>
          <DrugReviewStudio />
        </Suspense>
      </PremiumGate>
    </div>
  );
}
