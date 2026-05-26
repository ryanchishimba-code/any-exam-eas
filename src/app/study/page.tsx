import { PremiumGate } from "@/components/PremiumGate";
import { StudyModePicker } from "@/components/StudyModePicker";
import { StudySubnav } from "@/components/StudySubnav";
import { PageShell } from "@/components/PageShell";

export const metadata = {
  title: "Study — Any Exam Easy",
};

export default function StudyPage() {
  return (
    <PageShell
      eyebrow="Study"
      title="Choose how you want to study."
      description="Pick flashcards for quick recall, or exam-style multiple choice for full practice tests. Your progress is saved as you go."
      maxWidth="max-w-3xl"
    >
      <StudySubnav />
      <PremiumGate>
        <div className="mt-10">
          <StudyModePicker />
        </div>
      </PremiumGate>
    </PageShell>
  );
}
