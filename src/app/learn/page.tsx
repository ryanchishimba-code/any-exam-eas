import { LearningQuiltStudio } from "@/components/LearningQuiltStudio";
import { PremiumGate } from "@/components/PremiumGate";
import { PageShell } from "@/components/PageShell";

export const metadata = {
  title: "Learning Quilt — Any Exam Easy",
};

export default function LearnPage() {
  return (
    <PageShell
      eyebrow="Learn"
      title="Learning quilt."
      description="Build a learning quilt: flip flashcards or answer mini-quiz tiles. Switch to Exams for full multiple-choice practice."
      maxWidth="max-w-5xl"
    >
      <PremiumGate callbackPath="/learn">
        <LearningQuiltStudio />
      </PremiumGate>
    </PageShell>
  );
}
