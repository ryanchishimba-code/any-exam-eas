import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { ProgressTracker } from "@/components/ProgressTracker";
import { StudySubnav } from "@/components/StudySubnav";
import { PageShell } from "@/components/PageShell";

export const metadata = {
  title: "Progress — Any Exam Easy",
};

export default async function ProgressPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  return (
    <PageShell
      eyebrow="Progress"
      title="Your study tracker."
      description="See exams completed, quilt tiles mastered, and scores over time."
      maxWidth="max-w-4xl"
    >
      <StudySubnav />
      <ProgressTracker />
    </PageShell>
  );
}
