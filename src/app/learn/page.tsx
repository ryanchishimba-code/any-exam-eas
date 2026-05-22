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
      description="A patchwork of flashcards and quiz tiles that connect as you learn. Choose flashcards, quizzes, or mixed."
      maxWidth="max-w-5xl"
    >
      <LearningQuiltStudio />
    </PageShell>
  );
}
