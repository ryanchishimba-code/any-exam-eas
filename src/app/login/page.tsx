import { LoginForm } from "@/components/LoginForm";

export const metadata = {
  title: "Log In — Any Exam Easy",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[var(--color-surface)] pt-24 pb-20">
      <div className="mx-auto max-w-md px-6">
        <h1 className="text-center text-3xl font-semibold tracking-tight">Welcome back.</h1>
        <LoginForm />
      </div>
    </div>
  );
}
