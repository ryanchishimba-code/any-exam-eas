import { LearningQuiltStudio } from "@/components/LearningQuiltStudio";
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
      <LearningQuiltStudio />
    </PageShell>
  );
}
