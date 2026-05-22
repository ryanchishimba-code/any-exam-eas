import { ExamGenerator } from "@/components/ExamGenerator";
import { PageShell } from "@/components/PageShell";

export const metadata = {
  title: "Generate Exam — Any Exam Easy",
};

export default function GeneratePage() {
  return (
    <PageShell
      eyebrow="Exam generator"
      title="Generate an exam."
      description="Pick a field and subject. Questions are scoped to your topic using OER textbooks and web research — answers stay hidden until you check."
      maxWidth="max-w-3xl"
    >
      <ExamGenerator />
    </PageShell>
  );
}
