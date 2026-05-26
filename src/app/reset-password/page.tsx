import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/ResetPasswordForm";
import { PageShell } from "@/components/PageShell";

export const metadata = {
  title: "Choose New Password — Any Exam Easy",
};

export default function ResetPasswordPage() {
  return (
    <PageShell
      title="Choose a new password."
      align="center"
      maxWidth="max-w-md"
    >
      <Suspense fallback={<p className="mt-10 text-sm text-[var(--color-ink-muted)]">Loading…</p>}>
        <ResetPasswordForm />
      </Suspense>
    </PageShell>
  );
}
