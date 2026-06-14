import dynamic from "next/dynamic";
import { Suspense } from "react";
import { PremiumGate } from "@/components/PremiumGate";
import { PageShell } from "@/components/PageShell";
import { StudySubnav } from "@/components/StudySubnav";

export const metadata = {
  title: "Top 500 Drugs — Study Hub",
  description:
    "One shared Top 500 drug list for NCLEX, USMLE, and NAPLEX — flashcards with spaced repetition.",
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
      eyebrow="Study Hub"
      title="Top 500 Drugs"
      description="High-yield Top 500 deck with guideline-aligned pearls (ADA, ACC/AHA, FDA) for NCLEX, USMLE, and NAPLEX."
      maxWidth="max-w-6xl"
    >
      <StudySubnav />
      <PremiumGate callbackPath="/study/drugs300">
        <Suspense fallback={<p className="mt-8 text-sm text-[var(--color-ink-muted)]">Loading…</p>}>
          <DrugReviewStudio />
        </Suspense>
      </PremiumGate>
    </PageShell>
  );
}
