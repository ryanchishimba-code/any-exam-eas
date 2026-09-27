import { Suspense } from "react";
import { AuthFocusLayout } from "@/components/auth/AuthFocusLayout";
import { ResetPasswordForm } from "@/components/ResetPasswordForm";

export const metadata = {
  title: "Choose New Password — Any Exam Easy",
};

export default function ResetPasswordPage() {
  return (
    <AuthFocusLayout title="Choose a new password.">
      <Suspense fallback={<p className="text-sm text-[#334155]">Loading…</p>}>
        <ResetPasswordForm embedded />
      </Suspense>
    </AuthFocusLayout>
  );
}
