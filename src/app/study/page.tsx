import { redirect } from "next/navigation";
import { StudyPageLayout } from "@/components/study/StudyPageLayout";
import { isExamFieldId } from "@/lib/subjects/field-ids";

export const metadata = {
  title: "Study — Any Exam Easy",
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

  return <StudyPageLayout />;
}
