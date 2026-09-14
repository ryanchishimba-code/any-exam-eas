import "@/styles/landing-theme.css";
import { AuthMarketingShell } from "@/components/marketing/AuthMarketingShell";

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <AuthMarketingShell>{children}</AuthMarketingShell>;
}
