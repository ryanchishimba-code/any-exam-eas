import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getUserExamPreference } from "@/lib/edtech/exam-preference";
import { fullExamHref, ROUTES } from "@/lib/routes";

export default async function FullExamIndexPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect(`${ROUTES.auth.login}?callbackUrl=${encodeURIComponent(ROUTES.fullExam)}`);
  }

  const pref = await getUserExamPreference(session.user.id);
  if (!pref) redirect(ROUTES.selectExam);

  redirect(fullExamHref(pref.examSlug));
}
