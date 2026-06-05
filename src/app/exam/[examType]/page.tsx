import { redirect } from "next/navigation";

/** Redirect /exam/nclex → prep hub practice tab flow. */
export default async function ExamTypeIndexPage({
  params,
}: {
  params: Promise<{ examType: string }>;
}) {
  const { examType } = await params;
  redirect(`/prep/${examType}`);
}
