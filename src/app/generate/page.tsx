import { ExamGenerator } from "@/components/ExamGenerator";

export const metadata = {
  title: "Generate Exam — Any Exam Easy",
};

export default function GeneratePage() {
  return (
    <div className="min-h-screen bg-[var(--color-surface)] pt-24 pb-20">
      <div className="mx-auto max-w-3xl px-6">
        <h1 className="text-4xl font-semibold tracking-tight">Generate an exam.</h1>
        <p className="mt-3 text-[var(--color-ink-muted)]">
          Pick a field, then a subject (e.g. Mathematics → Calculus). Questions are
          generated only for that subject using OER textbooks and web research. Answer
          each item yourself — solutions stay hidden until you check.
        </p>
        <ExamGenerator />
      </div>
    </div>
  );
}
