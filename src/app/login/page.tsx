import { Suspense } from "react";
import { LoginForm } from "@/components/LoginForm";
import { PageShell } from "@/components/PageShell";
import { AuthCard } from "@/components/ui/AuthCard";
import { contentWidth } from "@/lib/layout/shell-ui";
import { PLATFORM_EXAM_LIST } from "@/lib/landing/content";

export const metadata = {
  title: "Log In — Any Exam Easy",
};

export default function LoginPage() {
  return (
    <PageShell
      eyebrow="Any Exam Easy"
      title="Log in to continue"
      description={`${PLATFORM_EXAM_LIST} practice — synced across devices.`}
      align="center"
      maxWidth={contentWidth.auth}
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
