import type { Metadata } from "next";
import { LoginPageView } from "@/components/auth/LoginPageView";
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

/** Canonical login UI (also served via `/login` → rewrite/redirect). */
export default function AuthLoginPage() {
  return <LoginPageView />;
}
