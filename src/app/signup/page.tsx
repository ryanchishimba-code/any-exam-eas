import { SignupForm } from "@/components/SignupForm";
import { PageShell } from "@/components/PageShell";

export const metadata = {
  title: "Sign Up — Any Exam Easy",
};

export default function SignupPage() {
  return (
    <PageShell
      eyebrow="Get started"
      title="Create your account."
      description="7-day free trial · $9/month after · Must be 18 or older"
      align="center"
      maxWidth="max-w-md"
    >
      <SignupForm />
    </PageShell>
  );
}
