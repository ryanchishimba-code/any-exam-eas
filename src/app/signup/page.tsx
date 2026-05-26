import { Suspense } from "react";
import { SignupForm } from "@/components/SignupForm";
import { PageShell } from "@/components/PageShell";
import { formatMonthlyPrice, formatTrialLabel } from "@/lib/site";

export const metadata = {
  title: "Sign Up — Any Exam Easy",
};

export default function SignupPage() {
  return (
    <PageShell
      eyebrow="Get started · Beta"
      title="Create your account."
      description={`Choose ${formatTrialLabel()} or subscribe at ${formatMonthlyPrice()}/month. Must be 18 or older.`}
      align="center"
      maxWidth="max-w-lg"
    >
      <Suspense fallback={null}>
        <SignupForm />
      </Suspense>
    </PageShell>
  );
}
