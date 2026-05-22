import { ExamGenerator } from "@/components/ExamGenerator";
import { StudySubnav } from "@/components/StudySubnav";
import { StudyModePicker } from "@/components/StudyModePicker";
import { PageShell } from "@/components/PageShell";

export const metadata = {
  title: "Generate Exam — Any Exam Easy",
};

export default function GeneratePage() {
  return (
    <PageShell
      eyebrow="Exam generator"
      title="Generate an exam."
      description="Choose Medicine, Nursing, or Pharmacy, then a subject area. Questions follow USMLE, NCLEX, and NAPLEX-style stratification with OER-backed research."
      maxWidth="max-w-3xl"
    >
      <StudySubnav />
      <div className="mt-8">
        <p className="apple-label">Study format</p>
        <div className="mt-3">
          <StudyModePicker active="exam" compact />
        </div>
      </div>
      <ExamGenerator />
    </PageShell>
  );
}
