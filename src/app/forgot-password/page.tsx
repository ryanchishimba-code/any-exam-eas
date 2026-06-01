import { ForgotPasswordForm } from "@/components/ForgotPasswordForm";
import { PageShell } from "@/components/PageShell";
import { AuthCard } from "@/components/ui/AuthCard";

export const metadata = {
  title: "Forgot Password — Any Exam Easy",
};

export default function ForgotPasswordPage() {
  return (
    <PageShell
      eyebrow="Account recovery"
      title="Forgot your password?"
      description="Enter your email and we'll send you a link to reset it."
      align="center"
      maxWidth="max-w-md"
      variant="premium"
    >
      <AuthCard>
        <ForgotPasswordForm />
      </AuthCard>
    </PageShell>
  );
}
