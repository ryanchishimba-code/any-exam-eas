import { redirect } from "next/navigation";
import { isExamFieldId } from "@/lib/subjects/field-ids";
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
    const qs = new URLSearchParams();
    qs.set("field", params.field);
    if (params.mode) qs.set("mode", params.mode);
    redirect(`/study/practice?${qs.toString()}`);
  }

  redirect(STUDY_HUB_PATH);
}
