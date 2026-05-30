import { StudentHub } from "@/components/study/StudentHub";
import { StudySubnav } from "@/components/StudySubnav";
import { PageShell } from "@/components/PageShell";

export const metadata = {
  title: "Study — Any Exam Easy",
};

export default function StudyPage() {
  return (
    <PageShell
      eyebrow="Study"
      title="Your exam prep hub."
      description="Adaptive banks, AI mock exams, and mastery tracking — all in one place."
      maxWidth="max-w-4xl"
    >
      <StudySubnav />
      <StudentHub />
    </PageShell>
  );
}
