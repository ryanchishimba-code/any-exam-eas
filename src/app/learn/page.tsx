import { LearningQuiltStudio } from "@/components/LearningQuiltStudio";

export const metadata = {
  title: "Learning Quilt — Any Exam Easy",
};

export default function LearnPage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-5xl px-6">
        <h1 className="text-4xl font-semibold tracking-tight">Learning quilt.</h1>
        <p className="mt-3 max-w-2xl text-[var(--color-ink-muted)]">
          A patchwork of flashcards and quiz tiles that connect as you learn. Choose
          your preferred mode — flashcards, quizzes, or mixed.
        </p>
        <LearningQuiltStudio />
      </div>
    </div>
  );
}
