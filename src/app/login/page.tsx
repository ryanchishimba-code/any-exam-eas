import { Suspense } from "react";
import type { Metadata } from "next";
import { LoginForm } from "@/components/LoginForm";
import { PageShell } from "@/components/PageShell";
import { AuthCard } from "@/components/ui/AuthCard";
import { contentWidth } from "@/lib/layout/shell-ui";
import { PLATFORM_EXAM_LIST } from "@/lib/landing/content";
import { SITE_NAME } from "@/lib/site";

const LOGIN_TITLE = `Log In — ${SITE_NAME}`;
const LOGIN_DESCRIPTION =
  "Log in to Any Exam Easy to continue NCLEX, USMLE, NAPLEX, PANCE, FNP or NPTE practice. Your progress syncs securely across all of your devices.";

export const metadata: Metadata = {
  title: { absolute: LOGIN_TITLE },
  description: LOGIN_DESCRIPTION,
  alternates: { canonical: "/login" },
  robots: { index: false, follow: true },
  openGraph: {
    title: LOGIN_TITLE,
    description: LOGIN_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: LOGIN_TITLE,
    description: LOGIN_DESCRIPTION,
  },
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
