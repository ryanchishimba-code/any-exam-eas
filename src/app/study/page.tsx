import dynamic from "next/dynamic";
import { PageShell } from "@/components/PageShell";
import { StudySubnav } from "@/components/StudySubnav";

export const metadata = {
  title: "Study — Any Exam Easy",
};

const StudentHub = dynamic(
  () => import("@/components/study/StudentHub").then((m) => m.StudentHub),
  {
    loading: () => (
      <div className="mt-10 space-y-6">
        <div className="h-32 animate-pulse rounded-2xl bg-black/[0.04]" />
        <div className="h-48 animate-pulse rounded-2xl bg-black/[0.04]" />
      </div>
    ),
  }
);

export default function StudyPage() {
  return (
    <PageShell
      eyebrow="Study"
      title="Your exam prep hub."
      description="Personalized question banks, AI-assisted practice exams, and progress tracking — all in one place."
      maxWidth="max-w-4xl"
    >
      <StudySubnav />
      <StudentHub />
    </PageShell>
  );
}
