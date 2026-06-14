import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { ExamSelectionScreen } from "@/components/edtech/ExamSelectionScreen";
import { ensureAllBoardExams } from "@/lib/edtech/board-exam-sync";
import { getUserExamPreference } from "@/lib/edtech/exam-preference";
import { getUserAccess } from "@/lib/access-control";
import { ROUTES } from "@/lib/routes";

export const metadata = {
  title: "Choose Your Exam — Any Exam Easy",
  description:
    "Bold, personalized prep for NCLEX-RN, USMLE Step 2 CK, NAPLEX, and MPJE.",
};

type PageProps = {
  searchParams: Promise<{ switch?: string }>;
};

export default async function SelectExamPage({ searchParams }: PageProps) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect(`${ROUTES.auth.login}?callbackUrl=${encodeURIComponent(ROUTES.selectExam)}`);
  }

  const params = await searchParams;
  const switchMode = params.switch === "1" || params.switch === "true";

  try {
    await ensureAllBoardExams();
  } catch (err) {
    console.error("[select-exam] board exam bootstrap failed:", err);
  }

  const pref = await getUserExamPreference(session.user.id);

  if (pref && !switchMode) {
    const access = await getUserAccess(session.user.id);
    if (access.hasPremiumAccess) {
      redirect(ROUTES.dashboard);
    }
    redirect("/settings?reactivate=1");
  }

  return (
    <ExamSelectionScreen
      switchMode={switchMode}
      currentExam={pref?.examSlug ?? null}
    />
  );
}
