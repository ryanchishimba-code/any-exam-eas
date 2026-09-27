import { AuthFocusLayout } from "@/components/auth/AuthFocusLayout";
import { ForgotPasswordForm } from "@/components/ForgotPasswordForm";

export const metadata = {
  title: "Forgot Password — Any Exam Easy",
};

export default function ForgotPasswordPage() {
  return (
    <AuthFocusLayout
      title="Reset your password."
      detail="Enter the email on your account. We'll send a link to choose a new one."
    >
      <ForgotPasswordForm />
    </AuthFocusLayout>
  );
}
