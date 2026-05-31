import { Suspense } from "react";
import { PageShell } from "@/components/PageShell";
import { StudySubnav } from "@/components/StudySubnav";
import { DrugReviewStudio } from "@/components/study/DrugReviewStudio";

export const metadata = {
  title: "Top 300 Drugs — Any Exam Easy",
  description:
    "Spaced-repetition flashcard review for the top 300 board exam drugs. Generic to brand and indication, refreshed every 3 months.",
};

export default function Drugs300Page() {
  return (
    <PageShell
      eyebrow="Pharmacology"
      title="Top 300 Drugs Mastery"
      description="Flashcard review with spaced repetition: generic → brand, class, indications & side effects. Filter by drug class and track mastery per category."
      maxWidth="max-w-6xl"
    >
      <StudySubnav />
      <Suspense fallback={<p className="mt-8 text-sm text-[var(--color-ink-muted)]">Loading…</p>}>
        <DrugReviewStudio />
      </Suspense>
    </PageShell>
  );
}
