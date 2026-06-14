import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { examSlugFromFieldId } from "@/lib/edtech/exams";
import { fullExamHref, ROUTES } from "@/lib/routes";

/** Legacy entry — canonical surfaces are /question-bank and /full-exam. */
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const { mode } = await searchParams;
  return {
    title: mode === "bank" ? "Question Bank — Any Exam Easy" : "Study — Any Exam Easy",
  };
}

export default async function StudyPracticePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;

  if (params.field === "drugs300") redirect(ROUTES.drugs300);

  const session = await auth();
  if (!session?.user?.id) {
    const qs = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value) qs.set(key, value);
    }
    const callback = qs.toString() ? `/study/practice?${qs}` : "/study/practice";
    redirect(`${ROUTES.auth.login}?callbackUrl=${encodeURIComponent(callback)}`);
  }

  if (params.mode === "timed") {
    const field = params.field?.trim();
    if (field) {
      const slug = examSlugFromFieldId(field);
      if (slug) redirect(fullExamHref(slug));
    }
    redirect(ROUTES.fullExam);
  }

  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (!value || key === "mode") continue;
    qs.set(key, value);
  }

  redirect(qs.toString() ? `${ROUTES.questionBank}?${qs}` : ROUTES.questionBank);
}
