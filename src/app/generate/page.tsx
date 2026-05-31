import { PremiumGate } from "@/components/PremiumGate";
import { TestGenerator } from "@/components/generate/TestGenerator";
import { StudySubnav } from "@/components/StudySubnav";
import { PageShell } from "@/components/PageShell";

export const metadata = {
  title: "Test Generator — Any Exam Easy",
};

export default function GeneratePage() {
  return (
    <PageShell
      eyebrow="Exam generator"
      title="Build your practice test."
      description="Generate board-style questions from a topic, uploaded notes, or a custom blueprint — then preview before you start. AI content may contain errors; verify independently."
      maxWidth="max-w-4xl"
      variant="premium"
    >
      <StudySubnav />
      <PremiumGate>
        <TestGenerator />
      </PremiumGate>
    </PageShell>
  );
}
