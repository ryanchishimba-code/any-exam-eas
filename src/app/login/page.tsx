import { Suspense } from "react";
import { LoginForm } from "@/components/LoginForm";
import { PageShell } from "@/components/PageShell";
import { AuthCard } from "@/components/ui/AuthCard";

export const metadata = {
  title: "Log In — Any Exam Easy",
};

export default function LoginPage() {
  return (
    <PageShell
      eyebrow="Any Exam Easy"
      title="Log in to continue"
      description="NCLEX, USMLE, NAPLEX, and PANCE practice — synced across devices."
      align="center"
      maxWidth="max-w-md"
      variant="premium"
    >
      <AuthCard>
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </AuthCard>
    </PageShell>
  );
}
