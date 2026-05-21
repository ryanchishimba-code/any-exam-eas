import { SignupForm } from "@/components/SignupForm";

export const metadata = {
  title: "Sign Up — Any Exam Easy",
};

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-[var(--color-surface)] pt-24 pb-20">
      <div className="mx-auto max-w-md px-6">
        <h1 className="text-center text-3xl font-semibold tracking-tight">
          Create your account.
        </h1>
        <p className="mt-2 text-center text-sm text-[var(--color-ink-muted)]">
          7-day free trial · $9/month after · Must be 18 or older
        </p>
        <SignupForm />
      </div>
    </div>
  );
}
