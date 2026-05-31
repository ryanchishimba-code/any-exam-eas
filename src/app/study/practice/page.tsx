import { Suspense } from "react";
import { PremiumGate } from "@/components/PremiumGate";
import { StudyBankPractice } from "@/components/study/StudyBankPractice";
import { StudySubnav } from "@/components/StudySubnav";
import { PageShell } from "@/components/PageShell";

export const metadata = {
  title: "Question bank — Any Exam Easy",
};

export default function StudyPracticePage() {
  return (
    <PageShell
      eyebrow="Study"
      title="Question bank"
      description="Board-style practice with personalized ordering, confidence tracking, and cited explanations after each item."
      maxWidth="max-w-3xl"
    >
      <StudySubnav />
      <PremiumGate>
        <Suspense fallback={<p className="mt-8 text-sm text-[var(--color-ink-muted)]">Loading…</p>}>
          <StudyBankPractice />
        </Suspense>
      </PremiumGate>
    </PageShell>
  );
}
