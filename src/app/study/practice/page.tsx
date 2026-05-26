import { PremiumGate } from "@/components/PremiumGate";
import { StudyBankPractice } from "@/components/study/StudyBankPractice";
import { StudySubnav } from "@/components/StudySubnav";
import { PageShell } from "@/components/PageShell";

export const metadata = {
  title: "Quick review — Any Exam Easy",
};

export default function StudyPracticePage() {
  return (
    <PageShell
      eyebrow="Study"
      title="Quick review"
      description="Pull questions from your subject bank. One at a time, shuffled options, confidence tracking, and spaced-style review."
      maxWidth="max-w-3xl"
    >
      <StudySubnav />
      <PremiumGate>
        <StudyBankPractice />
      </PremiumGate>
    </PageShell>
  );
}
