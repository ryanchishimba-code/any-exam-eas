import { redirect } from "next/navigation";
import { isExamFieldId } from "@/lib/subjects/field-ids";
import { STUDYGUB_PATH } from "@/lib/studygub/config";

export const metadata = {
  title: "StudyGub — Any Exam Easy",
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

  redirect(STUDYGUB_PATH);
}
