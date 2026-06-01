import { PremiumGate } from "@/components/PremiumGate";
import { ProgressTracker } from "@/components/ProgressTracker";
import { StudySubnav } from "@/components/StudySubnav";
import { PageShell } from "@/components/PageShell";

export const metadata = {
  title: "Progress — Any Exam Easy",
};

export default async function ProgressPage() {
  return (
    <PageShell
      eyebrow="Progress"
      title="Your study tracker."
      description="See exams completed, quilt tiles mastered, and scores over time."
      maxWidth="max-w-4xl"
    >
      <PremiumGate callbackPath="/progress">
        <StudySubnav />
        <ProgressTracker />
      </PremiumGate>
    </PageShell>
  );
}
