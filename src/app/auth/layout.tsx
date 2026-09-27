import "@/styles/landing-theme.css";
import { AuthMarketingShell } from "@/components/marketing/AuthMarketingShell";

/**
 * `/login` redirects here. These routes sit outside `(marketing)`, so without
 * this wrapper `--color-accent` stays the app indigo.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <AuthMarketingShell>{children}</AuthMarketingShell>;
}
