import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { SignupScreen } from "@/components/auth/SignupScreen";
import { parseBoardSlug } from "@/lib/auth/board-intent";
import { getCachedSession } from "@/lib/auth/session";
import { resolveSignupIntent, signedInSignupRedirect } from "@/lib/auth/signup-intent";
import { assignBoardIfUnset } from "@/lib/edtech/exam-preference";
import { SITE_NAME } from "@/lib/site";

const SIGNUP_TITLE = `Sign Up — ${SITE_NAME}`;
const SIGNUP_DESCRIPTION =
  "Create your Any Exam Easy account for NCLEX, USMLE, NAPLEX, PANCE, FNP & NPTE prep. Start a free trial or subscribe to Pro.";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: SIGNUP_TITLE },
  description: SIGNUP_DESCRIPTION,
  alternates: { canonical: "/signup" },
  robots: { index: false, follow: true },
  openGraph: {
    title: SIGNUP_TITLE,
    description: SIGNUP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: SIGNUP_TITLE,
    description: SIGNUP_DESCRIPTION,
  },
};

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{
    plan?: string;
    promo?: string;
    code?: string;
    interval?: string;
    tier?: string;
    exam?: string;
    board?: string;
  }>;
}) {
  const params = await searchParams;
  const session = await getCachedSession();
  if (session?.user?.id) {
    const board = parseBoardSlug(params.board) ?? parseBoardSlug(params.exam);
    if (board) {
      try {
        await assignBoardIfUnset(session.user.id, board);
      } catch (error) {
        console.warn(
          "[signup] board intent skipped:",
          error instanceof Error ? error.message : error
        );
      }
    }
    redirect(signedInSignupRedirect(params));
  }

  const intent = resolveSignupIntent(params);

  return (
    <SignupScreen
      initialPlan={intent.plan}
      initialPromo={intent.promo}
      initialPassCode={intent.passCode}
      initialInterval={intent.interval}
      initialTier={intent.tier}
      initialExam={intent.exam}
    />
  );
}
