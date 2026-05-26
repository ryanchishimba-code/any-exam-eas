import { ForgotPasswordForm } from "@/components/ForgotPasswordForm";
import { PageShell } from "@/components/PageShell";

export const metadata = {
  title: "Forgot Password — Any Exam Easy",
};

export default function ForgotPasswordPage() {
  return (
    <PageShell
      title="Reset your password."
      description="We will email you a secure link to choose a new password."
      align="center"
      maxWidth="max-w-md"
    >
      <ForgotPasswordForm />
    </PageShell>
  );
}
