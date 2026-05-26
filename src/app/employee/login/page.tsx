import { Suspense } from "react";
import { EmployeeLoginForm } from "@/components/employee/EmployeeLoginForm";
import { PageShell } from "@/components/PageShell";

export const metadata = {
  title: "Employee Login — Any Exam Easy",
  robots: { index: false, follow: false },
};

export default function EmployeeLoginPage() {
  return (
    <PageShell
      eyebrow="Internal access"
      title="Employee portal"
      description="Authorized staff only. Sign in with your work email to manage users, analytics, and feedback."
      align="center"
      maxWidth="max-w-md"
    >
      <Suspense fallback={null}>
        <EmployeeLoginForm />
      </Suspense>
    </PageShell>
  );
}
