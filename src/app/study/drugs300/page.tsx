import dynamic from "next/dynamic";
import { Suspense } from "react";
import { PageShell } from "@/components/PageShell";
import { StudySubnav } from "@/components/StudySubnav";

export const metadata = {
  title: "Top 500 Drugs — Any Exam Easy",
  description:
    "Spaced-repetition flashcard review for the top 500 board exam drugs. Generic to brand and indication, refreshed every 3 months.",
};

const DrugReviewStudio = dynamic(
  () => import("@/components/study/DrugReviewStudio").then((m) => m.DrugReviewStudio),
  {
    loading: () => (
      <div className="mt-8 space-y-4">
        <div className="aee-drugs-skeleton h-12 rounded-2xl" />
        <div className="aee-drugs-skeleton h-32 rounded-2xl" />
        <div className="aee-drugs-skeleton h-[420px] rounded-3xl" />
      </div>
    ),
  }
);

export default function Drugs300Page() {
  return (
    <PageShell
      eyebrow="Pharmacology"
      title="Top 500 Drugs Review"
      description="Flashcard review with spaced repetition: generic → brand, class, indications & side effects. Filter by drug class and track review progress per category."
      maxWidth="max-w-6xl"
    >
      <StudySubnav />
      <Suspense fallback={<p className="mt-8 text-sm text-[var(--color-ink-muted)]">Loading…</p>}>
        <DrugReviewStudio />
      </Suspense>
    </PageShell>
  );
}
