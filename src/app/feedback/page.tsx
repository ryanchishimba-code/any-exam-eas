import { PageShell } from "@/components/PageShell";
import { FeedbackForm } from "@/components/feedback/FeedbackForm";

export const metadata = {
  title: "Feedback — Any Exam Easy",
  description: "Share your experience and help us improve Any Exam Easy.",
};

export default function FeedbackPage() {
  return (
    <PageShell
      eyebrow="We listen"
      title="Send us your feedback."
      description="Report bugs, request features, or tell us how study sessions are going. All fields except category, rating, and message are optional."
      maxWidth="max-w-xl"
    >
      <div className="mt-10">
        <FeedbackForm />
      </div>
    </PageShell>
  );
}
