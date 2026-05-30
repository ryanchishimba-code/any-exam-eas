import { EngineTestLab } from "@/components/engine/EngineTestLab";
import { PageShell } from "@/components/PageShell";
import { StudySubnav } from "@/components/StudySubnav";

export const metadata = {
  title: "Engine Lab — Any Exam Easy",
};

export default function EngineTestPage() {
  return (
    <PageShell
      eyebrow="Question engine"
      title="Validate generated items."
      description="Run the advanced RAG pipeline in test mode — hybrid retrieval, pattern analysis, NGN formats, and Self-RAG quality control."
      maxWidth="max-w-4xl"
    >
      <StudySubnav />
      <EngineTestLab />
    </PageShell>
  );
}
