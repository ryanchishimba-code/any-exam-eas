import { PageShell } from "@/components/PageShell";
import { StudySubnav } from "@/components/StudySubnav";
import { StudentDashboard } from "@/components/dashboard/StudentDashboard";

export const metadata = {
  title: "Learning analytics | Any Exam Easy",
  description: "Practice progress, weak areas, and personalized study recommendations.",
};

export default function StudyAnalyticsPage() {
  return (
    <PageShell
      eyebrow="Performance"
      title="Learning analytics"
      description="Practice trends, weak topics, and recent test scores — based on your in-app question attempts."
      maxWidth="max-w-[980px]"
    >
      <StudySubnav />
      <StudentDashboard />
    </PageShell>
  );
}
