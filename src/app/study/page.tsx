import { redirect } from "next/navigation";
import { isExamFieldId } from "@/lib/subjects/field-ids";
import { examSlugFromFieldId } from "@/lib/edtech/exams";
import { fullExamHref, ROUTES } from "@/lib/routes";
import { STUDY_HUB_PATH } from "@/lib/study-hub/config";

export const metadata = {
  title: "Study Hub — Any Exam Easy",
};

export default async function StudyPage({
  searchParams,
}: {
  searchParams: Promise<{ field?: string; mode?: string }>;
}) {
  const params = await searchParams;
  if (params.field && isExamFieldId(params.field)) {
    if (params.mode === "timed") {
      const slug = examSlugFromFieldId(params.field);
      redirect(slug ? fullExamHref(slug) : ROUTES.fullExam);
    }
    const qs = new URLSearchParams({ field: params.field });
    redirect(`${ROUTES.questionBank}?${qs.toString()}`);
  }

  redirect(STUDY_HUB_PATH);
}
