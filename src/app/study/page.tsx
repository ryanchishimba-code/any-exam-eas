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
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  if (params.field && isExamFieldId(String(params.field))) {
    const field = String(params.field);
    if (params.mode === "timed") {
      const slug = examSlugFromFieldId(field);
      redirect(slug ? fullExamHref(slug) : ROUTES.fullExam);
    }
    const qs = new URLSearchParams({ field });
    redirect(`${ROUTES.questionBank}?${qs.toString()}`);
  }

  const preserved = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (key === "field" || key === "mode" || value == null) continue;
    if (Array.isArray(value)) {
      for (const item of value) preserved.append(key, item);
    } else {
      preserved.set(key, value);
    }
  }
  const suffix = preserved.toString();
  redirect(suffix ? `${STUDY_HUB_PATH}?${suffix}` : STUDY_HUB_PATH);
}
