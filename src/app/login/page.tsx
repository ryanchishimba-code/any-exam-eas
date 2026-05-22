import { LoginForm } from "@/components/LoginForm";
import { PageShell } from "@/components/PageShell";

export const metadata = {
  title: "Log In — Any Exam Easy",
};

export default function LoginPage() {
  return (
    <PageShell title="Welcome back." align="center" maxWidth="max-w-md">
      <LoginForm />
    </PageShell>
  );
}
